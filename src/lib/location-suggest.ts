/**
 * Hero / quick-search location suggestions.
 *
 * Merges three sources into one ranked list:
 *   1. Cities (with live listing counts)
 *   2. Location areas that actually have published listings (exact filter, so
 *      picking one always returns results)
 *   3. The built-in society index (societies, phases, sectors, blocks) and
 *      curated towns, so buyers can search places before listings exist.
 *
 * Ranking favours word-prefix matches ("La" → Lahore, Lake City) over
 * mid-word matches ("Faisalabad"), then cities, then places with listings.
 */
import { getSocietyIndex, societyAliases, type SocietyPlace } from "@/lib/society-index";
import { TOWNS } from "@/lib/towns";

export type LocationSuggestion = {
  id: string;
  label: string;
  /** Secondary line, e.g. "Society · Lahore" or "City · 120 listings". */
  detail: string;
  kind: "city" | "area" | SocietyPlace["kind"];
  city: string;
  /** Value for the `town` search filter ("" for a whole city). */
  town: string;
  townExact: boolean;
  count: number;
};

export type AreaCount = { citySlug: string; cityName: string; area: string; total: number };

const CITY_SUFFIX = /[\s,]+(Lahore|Islamabad|Karachi|Rawalpindi|Multan|Faisalabad|Gujranwala|Peshawar)$/i;
const KIND_LABEL: Record<string, string> = {
  city: "City",
  area: "Area",
  society: "Society",
  phase: "Phase",
  sector: "Sector",
  block: "Block",
};

function normalise(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function stripCity(label: string) {
  return tidy(label.replace(CITY_SUFFIX, "").trim() || label);
}

/** Collapses index quirks such as "Gulberg Gulberg I" → "Gulberg I". */
function tidy(label: string) {
  return label.replace(/\b(\w+) \1\b/gi, "$1").replace(/\s{2,}/g, " ").trim();
}

function listingsLabel(count: number) {
  return `${count} ${count === 1 ? "listing" : "listings"}`;
}

type Candidate = LocationSuggestion & { haystack: string; extra: string };

function buildCandidates(areas: AreaCount[]): Candidate[] {
  const out = new Map<string, Candidate>();
  const cityCounts = new Map<string, number>();
  for (const row of areas) cityCounts.set(row.citySlug, (cityCounts.get(row.citySlug) ?? 0) + row.total);

  const add = (candidate: Candidate) => {
    const key = `${candidate.city}|${normalise(stripCity(candidate.label))}`;
    const existing = out.get(key);
    // Keep the entry that leads to real listings; merge alias text.
    if (!existing) out.set(key, candidate);
    else if (candidate.count > existing.count) out.set(key, { ...candidate, extra: `${existing.extra} ${candidate.extra}` });
    else existing.extra = `${existing.extra} ${candidate.extra}`;
  };

  for (const place of getSocietyIndex()) {
    if (place.kind === "city") {
      const count = cityCounts.get(place.citySlug) ?? 0;
      add({
        id: `city-${place.citySlug}`,
        label: place.cityName,
        detail: count ? `City · ${listingsLabel(count)}` : "City",
        kind: "city",
        city: place.citySlug,
        town: "",
        townExact: false,
        count,
        haystack: normalise(place.cityName),
        extra: "",
      });
      continue;
    }
    const label = stripCity(place.label);
    const isSociety = place.kind === "society";
    add({
      id: `idx-${place.kind}-${normalise(place.label).replace(/ /g, "-")}`,
      // Societies keep their full name ("DHA Lahore"); sub-areas show the city below.
      label: isSociety ? tidy(place.label) : label,
      detail: isSociety && CITY_SUFFIX.test(place.label) ? "Housing society" : `${KIND_LABEL[place.kind] ?? "Area"} · ${place.cityName}`,
      kind: place.kind,
      city: place.citySlug,
      town: label,
      townExact: false,
      count: 0,
      haystack: normalise(label),
      extra: normalise([...societyAliases(place.parent ?? place.label), place.cityName].join(" ")),
    });
  }

  for (const town of TOWNS) {
    const label = stripCity(town.name);
    add({
      id: `town-${town.slug}`,
      label: tidy(town.name),
      detail: CITY_SUFFIX.test(town.name) ? "Housing society" : `Society · ${town.cityName}`,
      kind: "society",
      city: town.citySlug,
      town: label,
      townExact: false,
      count: 0,
      haystack: normalise(label),
      extra: normalise([...(town.aliases ?? []), town.cityName].join(" ")),
    });
  }

  for (const row of areas) {
    if (!row.area?.trim()) continue;
    const label = stripCity(row.area.trim());
    add({
      id: `area-${row.citySlug}-${normalise(row.area).replace(/ /g, "-")}`,
      label,
      detail: `${row.cityName} · ${listingsLabel(row.total)}`,
      kind: "area",
      city: row.citySlug,
      town: row.area.trim(),
      townExact: true,
      count: row.total,
      haystack: normalise(label),
      extra: normalise(row.cityName),
    });
  }
  return [...out.values()];
}

function score(candidate: Candidate, query: string, tokens: string[]): number {
  const words = candidate.haystack.split(" ");
  const extraWords = candidate.extra.split(" ").filter(Boolean);
  let total = 0;
  for (const token of tokens) {
    if (words.some((word) => word.startsWith(token))) total += 10;
    else if (token.length >= 3 && candidate.haystack.includes(token)) total += 3;
    else if (extraWords.some((word) => word.startsWith(token))) total += 2;
    else return -1;
  }
  if (candidate.haystack.startsWith(query)) total += 30;
  if (candidate.haystack === query) total += 20;
  if (candidate.kind === "city") total += 25;
  else if (candidate.count > 0) total += 8 + Math.min(candidate.count, 20) * 0.5;
  else if (candidate.kind === "society") total += 6;
  else if (candidate.kind === "phase") total += 2;
  // Shorter names first on ties ("DHA Lahore" before "DHA Lahore Phase 9 Prism").
  total -= candidate.haystack.length / 100;
  return total;
}

export function suggestLocations(query: string, areas: AreaCount[], limit = 8): LocationSuggestion[] {
  const candidates = buildCandidates(areas);
  const strip = ({ haystack: _h, extra: _e, ...rest }: Candidate): LocationSuggestion => {
    void _h;
    void _e;
    return rest;
  };
  const q = normalise(query);

  if (!q) {
    // Empty field: popular cities, then the busiest listing areas.
    const cities = candidates.filter((c) => c.kind === "city").sort((a, b) => b.count - a.count);
    const busy = candidates.filter((c) => c.kind === "area").sort((a, b) => b.count - a.count).slice(0, 3);
    return [...cities.slice(0, limit - busy.length), ...busy].map(strip);
  }

  const tokens = q.split(" ").filter(Boolean);
  return candidates
    .map((candidate) => ({ candidate, s: score(candidate, q, tokens) }))
    .filter((row) => row.s >= 0)
    .sort((a, b) => b.s - a.s || a.candidate.label.localeCompare(b.candidate.label, undefined, { numeric: true }))
    .slice(0, limit)
    .map((row) => strip(row.candidate));
}
