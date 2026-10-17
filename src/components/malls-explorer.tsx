"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { IconArrowRight, IconPin, IconSearch } from "@/components/icons";
import type { Mall } from "@/lib/malls";

type StatusFilter = "all" | "open" | "upcoming";

function MallCard({ mall }: { mall: Mall }) {
  const upcoming = mall.status === "upcoming";
  return (
    <Link
      href={`/malls/${mall.slug}`}
      className="group flex h-full flex-col rounded-panel border border-soft bg-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C9A86A] hover:shadow-[0_16px_34px_-18px_rgba(8,34,26,.3)]"
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={`rounded-md px-2 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.12em] ${
            upcoming ? "bg-amber-100 text-amber-800" : "bg-forest-50 text-forest-700"
          }`}
        >
          {upcoming ? "Coming soon" : "Open now"}
        </span>
        <span className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-ink-muted">{mall.city}</span>
      </div>
      <h3 className="mt-3.5 font-sans text-[1.125rem] font-bold leading-snug text-navy-900 group-hover:text-forest-700">
        {mall.name}
      </h3>
      <p className="mt-1.5 flex items-start gap-1.5 text-[0.8125rem] text-ink-muted">
        <IconPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-forest-600" />
        {mall.area}
      </p>
      <p className="mt-2.5 line-clamp-3 flex-1 text-[0.875rem] leading-relaxed text-ink-muted">{mall.description}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {(mall.sizeLabel ? [mall.sizeLabel] : []).concat(mall.highlights.slice(0, 2)).map((chip) => (
          <span key={chip} className="rounded-md bg-mist px-2 py-1 text-[0.6875rem] font-semibold text-navy-900">
            {chip}
          </span>
        ))}
      </div>
      <span className="mt-4 inline-flex items-center gap-1.5 border-t border-soft pt-3.5 text-[0.8125rem] font-bold text-forest-700">
        {upcoming ? "See what's planned" : "Explore this mall"}
        <IconArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

/**
 * Directory explorer for /malls: live search plus city and status filters.
 * Filtering is client-side only — there is one canonical /malls URL, so
 * filter states never create thin duplicate pages for search engines.
 */
export function MallsExplorer({ malls, cities }: { malls: Mall[]; cities: { city: string; total: number }[] }) {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("all");
  const [status, setStatus] = useState<StatusFilter>("all");

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return malls.filter((mall) => {
      if (city !== "all" && mall.city !== city) return false;
      if (status !== "all" && mall.status !== status) return false;
      if (term && !`${mall.name} ${mall.city} ${mall.area} ${mall.highlights.join(" ")}`.toLowerCase().includes(term)) return false;
      return true;
    });
  }, [malls, query, city, status]);

  const openCount = malls.filter((mall) => mall.status === "open").length;
  const upcomingCount = malls.length - openCount;

  return (
    <div>
      <div className="rounded-panel border border-[#DFB872]/35 bg-navy-950 p-5 text-white shadow-soft sm:p-6">
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr_auto] lg:items-end">
          <div>
            <label htmlFor="mall-search" className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-white/60">
              Search malls
            </label>
            <div className="relative mt-2">
              <IconSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-ink-muted" />
              <input
                id="mall-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Try “Emporium”, “Clifton” or “cinema”…"
                className="field w-full bg-white pl-10 text-navy-900"
              />
            </div>
          </div>
          <div>
            <label htmlFor="mall-city" className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-white/60">
              City
            </label>
            <select id="mall-city" value={city} onChange={(event) => setCity(event.target.value)} className="field mt-2 w-full bg-white text-navy-900">
              <option value="all">All cities ({malls.length} malls)</option>
              {cities.map((item) => (
                <option key={item.city} value={item.city}>
                  {item.city} ({item.total})
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2" role="group" aria-label="Mall status">
            {(
              [
                ["all", `All · ${malls.length}`],
                ["open", `Open · ${openCount}`],
                ["upcoming", `Coming soon · ${upcomingCount}`],
              ] as [StatusFilter, string][]
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                aria-pressed={status === key}
                onClick={() => setStatus(key)}
                className={`rounded-[10px] border px-3.5 py-2.5 font-sans text-[0.8125rem] font-semibold transition-colors ${
                  status === key
                    ? "border-[#DFB872] bg-[#DFB872] text-[#082218]"
                    : "border-white/25 bg-white/5 text-white hover:border-[#DFB872]/70"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-6 text-[0.875rem] text-ink-muted" role="status">
        Showing <span className="font-bold text-navy-900">{visible.length}</span> of {malls.length} malls
        {city !== "all" ? ` in ${city}` : " across Pakistan"}
        {status === "upcoming" ? " · coming soon" : status === "open" ? " · open now" : ""}.
      </p>

      {visible.length === 0 ? (
        <p className="mt-6 rounded-panel border border-soft bg-white p-10 text-center text-[0.9375rem] text-ink-muted">
          No mall matches that search yet.{" "}
          <Link href="/contact" className="font-semibold text-forest-700 hover:underline">
            Suggest a mall for the directory
          </Link>{" "}
          and we will add it after a quick check.
        </p>
      ) : (
        <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((mall) => (
            <MallCard key={mall.slug} mall={mall} />
          ))}
        </div>
      )}
    </div>
  );
}
