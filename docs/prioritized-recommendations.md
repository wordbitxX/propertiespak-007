# Prioritized Recommendations — Implementation Notes

Date: 2026-10-17 · Branch: `arena/d831b3a5-propertiespak-007`

Everything below was implemented **additively**: no existing URL, page title,
meta description, keyword set or canonical was changed, and no existing page
was removed or redirected. New pages were added to the sitemaps that already
exist (`/sitemap.xml`, `/sitemaps/pages.xml`, `/sitemaps/keywords.xml`), so
indexing, keyword targeting and traffic patterns of the live site are
untouched. Filtered listing URLs keep their existing `noindex, follow`
treatment.

## 1. Schema markup (RealEstateListing, FAQ, Breadcrumb)

Already present and kept: `RealEstateListing` + `Offer` on listing pages,
`FAQPage` on landing/guide pages, `BreadcrumbList` via the shared
`Breadcrumbs` component, `RealEstateAgent`/`WebSite` sitewide.

Gaps closed in this change:

| Page | Added |
| --- | --- |
| `/property/<slug>` | Visible FAQ section ("Questions about this property") + matching `FAQPage` schema — price, verification, visit and buy/rent-specific answers generated from the listing itself |
| `/city/<slug>` | `BreadcrumbList` (it was the hub without one) |
| `/tools/<tool>` (all calculators) | `WebPage` + visible FAQ section + matching `FAQPage` schema |
| `/dealers/<slug>` | Agent schema centralised in `dealerJsonLd()`; `aggregateRating` is emitted **only** when approved reviews exist |
| `/pakistan-property-price-index` | `Dataset` + `FAQPage` + `BreadcrumbList` |

Note: several pages already emitted `BreadcrumbList` through the shared
`Breadcrumbs`/`PageHero` components — those were left as-is rather than
duplicated.

## 2. Agent directory with verified profiles

Already live at `/dealers` and `/dealers/<slug>` (blue tick = admin-verified).
This change connects it to the new review system (see §3): dealer profiles
show approved reviews, a review form, star summary, and the profile picture
uploaded by the dealer or an admin.

## 3. Testimonials / review system

- New `reviews` table (dealer-targeted or platform reviews).
- Visitors submit reviews on any dealer profile and on the homepage
  ("What buyers, sellers and tenants say"). **Nothing is public until an
  admin approves it** in Admin → *Client reviews* — this keeps spam and
  fabricated ratings off the site and out of schema markup.
- Approved reviews appear on the homepage block and on dealer profiles;
  the average/count feeds `aggregateRating` in dealer schema only then.
- No reviews were fabricated or seeded: the section invites the first real
  ones, and ratings appear as soon as the first reviews are approved. To
  collect the first 10–15 quickly: ask recent clients to use the form on
  their dealer's profile page, then approve them from the admin tab.
- The homepage experts rail no longer shows invented star counts; it shows
  real verification/listing facts instead.

## 4. Society-level landing pages

New intent variants for every society, e.g.:

- `/bahria-town-phase-8-rawalpindi-houses`
- `/bahria-town-phase-8-rawalpindi-plots`
- `/bahria-town-phase-8-rawalpindi-apartments`
- `/bahria-town-phase-8-rawalpindi-for-rent`

(76 URLs total.) Each has its own H1, title, keywords, filtered live
listings, an intent-specific FAQ plus society FAQs, and links back to the
society overview at `/property-for-sale/<society>` (which is unchanged and
stays the canonical overview). Slugs follow the society's canonical slug,
so Bahria Town Phase 8 uses its full `…-rawalpindi` slug. All are in the
keywords/master sitemaps with no duplicates.

## 5. Pakistan Property Price Index

New page: **`/pakistan-property-price-index`**

- Median asking price, median price per sq ft and median monthly rent by
  city, property type and area (areas need ≥3 live listings), computed live
  from marketplace inventory (`getPriceIndex()`), with methodology and FAQ
  sections and `Dataset` schema — a citable, link-earning data asset.
- Linked from the footer (Investment tools), society intent pages and the
  investment guide links; added to both sitemaps.

## 6. Urdu language toggle

The header toggle already existed (EN/اردو, stored per visitor, RTL when
Urdu is active). This change extends coverage: the homepage "Premium
Properties For You" and "Work With Trusted Real Estate Experts" headings,
copy and CTAs now switch to Urdu as well (new `TranslatedText` component +
dictionary entries). Listing data and user content stay as entered.

## Admin: complete user profile editing

Admin → *Users & dealers* → **Edit full profile** now edits everything:
profile picture (upload/remove), company logo (upload/remove), name,
agency, designation, role, phone, WhatsApp, company phone/website, city
(name + slug), office address, experience, areas, bio and verification
notes. The card header shows the current picture. Email and the
verify/unverify (blue tick) action are intentionally separate, as before.
API: `PATCH /api/admin/users/<id>` accepts the same fields with length and
URL validation.

## Premium Properties & experts rail behaviour

- **Premium Properties For You**: only admin-verified **and** featured
  listings (`featured=1&verified=1`) can appear. The old fallback that
  quietly filled the rail with unverified listings when none qualified is
  removed — if nothing qualifies, the section hides rather than showing
  unchecked properties. Admins control membership from the property
  manager (featured + verified flags).
- **Work With Trusted Real Estate Experts**: now auto-scrolls horizontally
  exactly like the premium rail — one card at a time while on screen,
  pauses on hover/focus/drag/wheel (resumes after 5 s), wraps to the
  start, arrows and drag still work, and it never animates for
  `prefers-reduced-motion` visitors.

## SEO safety checklist (verified after the change)

- `npm run build` passes; all pre-existing routes render unchanged.
- `/sitemap.xml` (819 URLs) and `/sitemaps/keywords.xml` (471 URLs) contain
  no duplicate URLs; the price index and 76 society-intent URLs are included.
- Titles/canonicals of existing pages untouched (spot-checked home,
  properties, city, dealer, tools, society guide).
- New reviews never change page URLs and are invisible to crawlers until
  approved, so they cannot create thin/duplicate content.

After deploy, in Google Search Console: Sitemaps → confirm
`/sitemap-index.xml` was re-read, then URL Inspection → Request indexing
for `/pakistan-property-price-index` and 2–3 society-intent pages
(e.g. `/bahria-town-phase-8-rawalpindi-houses`).
