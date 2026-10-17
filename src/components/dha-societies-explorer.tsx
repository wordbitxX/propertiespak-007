"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { IconArrowRight, IconMap, IconPin, IconSearch } from "@/components/icons";
import { DHA_SOCIETY_CITIES, DHAPLUS_SOURCE, dhaSocietyImageUrl, type DhaSocietyMap } from "@/lib/map-library";
import { SOCIETY_MAPS } from "@/lib/society-maps";

const INTERACTIVE = new Set(SOCIETY_MAPS.map((society) => society.slug));

type CityFilter = "All" | (typeof DHA_SOCIETY_CITIES)[number];

export function DhaSocietiesExplorer({
  societies,
  initialCity,
}: {
  societies: DhaSocietyMap[];
  initialCity?: CityFilter;
}) {
  const [city, setCity] = useState<CityFilter>(initialCity ?? "All");
  const [query, setQuery] = useState("");
  // 1 = proxied image failed → try the original URL; 2 = both failed → placeholder.
  const [failed, setFailed] = useState<Map<string, number>>(() => new Map());
  const markFailed = (slug: string, attempt: number) =>
    setFailed((current) => {
      if ((current.get(slug) ?? 0) !== attempt) return current;
      const next = new Map(current);
      next.set(slug, attempt + 1);
      return next;
    });

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const society of societies) map.set(society.city, (map.get(society.city) ?? 0) + 1);
    return map;
  }, [societies]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return societies.filter(
      (society) => (city === "All" || society.city === city) && (!needle || society.name.toLowerCase().includes(needle)),
    );
  }, [societies, city, query]);

  return (
    <div>
      <div className="dha-maps-toolbar">
        <div className="dha-maps-filters" role="group" aria-label="Filter by city">
          {(["All", ...DHA_SOCIETY_CITIES] as CityFilter[]).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={city === option}
              onClick={() => setCity(option)}
              className="dha-maps-filter"
            >
              {option === "All" ? "All cities" : option}
              <span className="dha-maps-filter-count">{option === "All" ? societies.length : counts.get(option) ?? 0}</span>
            </button>
          ))}
        </div>
        <label className="dha-maps-search">
          <IconSearch className="h-4 w-4 shrink-0 text-ink-muted" aria-hidden="true" />
          <span className="sr-only">Search societies</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search e.g. Phase 6, Rahbar, Karachi"
          />
        </label>
      </div>

      {visible.length === 0 ? (
        <p className="mt-10 rounded-panel border border-dashed border-soft bg-white p-8 text-center text-ink-muted">
          No societies match your search.
        </p>
      ) : (
        <ul className="dha-maps-grid" data-testid="dha-societies-grid">
          {visible.map((society) => {
            const attempts = failed.get(society.slug) ?? 0;
            const image =
              attempts === 0 ? dhaSocietyImageUrl(society) : attempts === 1 && society.image ? `${DHAPLUS_SOURCE.imageBase}${society.image}` : null;
            return (
              <li key={society.slug}>
                <Link href={`/maps/dha-societies/${society.slug}`} className="dha-map-card group">
                  <span className="dha-map-card-media">
                    {image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={image}
                        src={image}
                        referrerPolicy="no-referrer"
                        alt={`${society.name} map`}
                        loading="lazy"
                        decoding="async"
                        ref={(element) => {
                          // Images that failed before hydration never fire onError.
                          if (element?.complete && element.naturalWidth === 0) {
                            queueMicrotask(() => markFailed(society.slug, attempts));
                          }
                        }}
                        onError={() => markFailed(society.slug, attempts)}
                      />
                    ) : (
                      <span className="dha-map-card-placeholder">
                        <IconMap className="h-8 w-8" aria-hidden="true" />
                        <span>{society.image ? "Open to view the HD map" : "HD map coming soon"}</span>
                      </span>
                    )}
                    <span className="dha-map-card-badge">{INTERACTIVE.has(society.slug) ? "Plot Map + HD" : "HD Map"}</span>
                  </span>
                  <span className="dha-map-card-body">
                    <span className="dha-map-card-title">{society.name}</span>
                    <span className="dha-map-card-meta">
                      <span className="inline-flex items-center gap-1">
                        <IconPin className="h-3.5 w-3.5" aria-hidden="true" />
                        {society.city}
                      </span>
                      {society.blocks > 0 && <span>{society.blocks} blocks</span>}
                    </span>
                    <span className="dha-map-card-cta">
                      View map <IconArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
