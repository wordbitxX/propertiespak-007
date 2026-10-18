# Database performance

The app runs on Vercel Functions and talks to Postgres (e.g. Supabase) through a
**transaction pooler** (`...pooler.supabase.com:6543`). That setup is correct —
keep it. Switching database vendors does not make pages faster; what matters is
how many network round trips a request makes and how long each one takes.

## What the code does

| Layer | Behaviour |
| --- | --- |
| Boot (`src/db/seed.ts`) | Each cold start makes **one** query (`app_meta.seed_version`). The full seed/refresh only runs when the seed data or schema guard changes, inside one transaction guarded by `pg_advisory_xact_lock` (safe behind a transaction pooler). Previously ~50 sequential queries ran on every cold start. |
| Pool (`src/db/index.ts`) | One pool per instance, idle sockets kept 60 s (no TLS/auth handshake per request), closed cleanly before Fluid compute suspends via `attachDatabasePool`. |
| Reads (`src/lib/cache.ts`, `src/lib/queries.ts`) | Public, visitor-independent reads (listings, dealers, cities, posts, projects, stats) are served from the Next.js data cache. A warm homepage makes zero database queries instead of ~22. |
| Writes | Every route that changes public listings or dealer profiles calls `invalidateCatalog()`, so owners and admins see their change on the very next request. A 5-minute `revalidate` catches edits made outside the app. |

Per-user data (session user, favourites, account dashboard, admin screens) is
never cached and always reads the database.

Rule for new code: a new **public** read goes through `cachedQuery(...)` in
`src/lib/queries.ts`; a new **write** that affects public pages calls
`invalidateCatalog()` after it succeeds.

## Region: the setting that matters most

Every uncached query pays the network distance between the Vercel Function and
the database. If the database is in Mumbai and functions run in Washington
(Vercel's default `iad1`), each round trip is ~200 ms.

1. Supabase → Project Settings → General → note the **region** (e.g. `ap-south-1` Mumbai).
2. Vercel → Project → Settings → Functions → **Function Region** → pick the
   matching one (Mumbai = `bom1`, Singapore = `sin1`, Frankfurt = `fra1`,
   N. Virginia = `iad1`). Redeploy.

For visitors in Pakistan, Mumbai (`ap-south-1` / `bom1`) is the closest pair.

## Measured locally (100 ms simulated DB round trip)

| | Before | After |
| --- | --- | --- |
| Cold start, first page | 6.8 s | 0.3 s (0.9 s right after a deploy) |
| Homepage, warm | 0.44 s | 0.08 s |
| Listing / blog / dealer pages, warm | 0.13–0.17 s | 0.03–0.05 s |

## Scaling to millions of listings

Four layers keep response times flat as inventory grows; none of them requires
changing the database vendor.

1. **Edge HTML cache** (`src/proxy.ts`). Anonymous `GET` requests for public
   pages carry `Cache-Control: public, s-maxage=60, stale-while-revalidate=600`,
   so Vercel's CDN serves the rendered HTML from the edge POP nearest the
   visitor and re-renders in the background. Signed-in requests, `/api`,
   `/admin`, `/account`, `/login`, `/favorites`, `/compare` and `/list-property`
   stay fully dynamic. Inventory changes propagate within a minute (writes also
   purge the data cache immediately via `invalidateCatalog()`).
2. **Data cache** (`src/lib/cache.ts`). Every public read is a `cachedQuery`
   keyed by its arguments with a `catalog` tag, so a re-render after the edge
   entry expires still makes **zero** database queries for warm filter
   combinations.
3. **Index plan** (`src/db/seed.ts` schema guard). Listing queries filter on
   `published` + equality columns and sort by `created_at`, `price` or `views`;
   composite indexes (`published, city_slug, purpose, created_at DESC` …) keep
   those plans index-driven. Radius search pre-filters with a lat/lng bounding
   box backed by `properties_lat_idx` / `properties_lng_idx`. Free-text search
   and town matching use `pg_trgm` GIN indexes, so `ILIKE '%term%'` never
   degenerates into a sequential scan. (Hosts without `pg_trgm` skip those
   indexes automatically.) Keep `q` limited to the trigram-indexed columns —
   adding a non-indexed column to the `OR` would defeat every GIN index.
4. **Pooler + region** (above). One warm pooled connection per instance, and
   the function region matched to the database region.

### When to add more (roadmap, not needed yet)

- **Read replica**: point `DATABASE_URL` at a Supabase read replica once write
  and read traffic compete on the primary.
- **Dedicated search**: at multi-million scale, move `q` + facets to
  Meilisearch/Typesense (index refreshed from the `catalog` tag) for typo
  tolerance and instant facet counts; keep Postgres as the source of truth.
- **Deep pagination**: page 1 000+ offsets grow linearly; switch those rare
  deep pages to keyset pagination (`created_at, id` cursor).
- **Approximate counts**: if exact `count(*)` for wide filters ever exceeds a
  few hundred ms, cache it with a shorter TTL or cap the counted rows.
- **Partitioning** by `city_slug` only if a single table exceeds ~100 M rows.
