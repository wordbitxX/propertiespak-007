"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { IconArrowRight, IconPin, IconSearch } from "@/components/icons";
import { mallImage, type Mall } from "@/lib/malls";

type StatusFilter = "all" | "open" | "upcoming";

/**
 * Premium image-led mall card: full-bleed cover photo with a cinematic
 * gradient, status ribbon on the photo, and the story below on deep
 * emerald — no plain white boxes anywhere in the directory.
 */
export function MallCard({ mall, priority = false }: { mall: Mall; priority?: boolean }) {
  const upcoming = mall.status === "upcoming";
  const cover = mallImage(mall);
  return (
    <Link
      href={`/malls/${mall.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-[20px] bg-[#071F16] text-white shadow-[0_18px_38px_-20px_rgba(4,24,17,0.55)] ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_48px_-20px_rgba(4,24,17,0.6)]"
    >
      <span className="relative block aspect-[16/10] overflow-hidden">
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#071F16] via-transparent to-black/10"
        />
        <span
          className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-[0.65rem] font-extrabold uppercase tracking-[0.14em] shadow-lg ${
            upcoming ? "bg-[#E8B54A] text-[#231600]" : "bg-[#0E5B3F] text-white ring-1 ring-white/25"
          }`}
        >
          {upcoming ? "Coming soon" : "Open now"}
        </span>
        <span className="absolute bottom-3 right-4 rounded-full bg-black/45 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-white backdrop-blur-sm">
          {mall.city}
        </span>
        {mall.sizeLabel && (
          <span className="absolute bottom-3 left-4 text-[0.72rem] font-semibold text-white/85">{mall.sizeLabel}</span>
        )}
      </span>
      <span className="flex flex-1 flex-col px-5 pb-5 pt-4">
        <span className="font-sans text-[1.15rem] font-bold leading-snug text-white group-hover:text-[#F0CE8F]">
          {mall.name}
        </span>
        <span className="mt-1.5 flex items-start gap-1.5 text-[0.8rem] text-white/65">
          <IconPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#DFB872]" />
          {mall.area}, {mall.city}
        </span>
        <span className="mt-2.5 line-clamp-3 flex-1 text-[0.85rem] leading-relaxed text-white/70">{mall.description}</span>
        <span className="mt-4 flex flex-wrap gap-1.5">
          {mall.highlights.slice(0, 2).map((chip) => (
            <span key={chip} className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[0.66rem] font-semibold text-white/80">
              {chip}
            </span>
          ))}
        </span>
        <span className="mt-4 inline-flex items-center gap-1.5 border-t border-white/10 pt-3.5 text-[0.8rem] font-bold text-[#F0CE8F]">
          {upcoming ? "Track this project" : "Explore this mall"}
          <IconArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
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
      <div className="relative overflow-hidden rounded-[22px] bg-[#071F16] p-5 text-white shadow-[0_24px_44px_-22px_rgba(4,24,17,0.6)] sm:p-7">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(560px 240px at 88% -10%, rgba(223,184,114,0.25), transparent 62%)" }}
        />
        <div className="relative grid gap-4 lg:grid-cols-[1.4fr_1fr_auto] lg:items-end">
          <div>
            <label htmlFor="mall-search" className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#DFB872]">
              Search malls
            </label>
            <div className="relative mt-2">
              <IconSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-ink-muted" />
              <input
                id="mall-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Try “Emporium”, “Clifton” or “cinema”…"
                className="field w-full border-0 bg-white pl-10 text-navy-900 shadow-inner"
              />
            </div>
          </div>
          <div>
            <label htmlFor="mall-city" className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#DFB872]">
              City
            </label>
            <select id="mall-city" value={city} onChange={(event) => setCity(event.target.value)} className="field mt-2 w-full border-0 bg-white text-navy-900">
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
                className={`rounded-full border px-4 py-2.5 font-sans text-[0.8rem] font-bold transition-all ${
                  status === key
                    ? "border-[#DFB872] bg-gradient-to-br from-[#E2BC76] to-[#C89B4F] text-[#231600] shadow-lg"
                    : "border-white/25 bg-white/5 text-white hover:border-[#DFB872]/80"
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
        <p className="mt-6 rounded-[20px] bg-[#071F16] p-10 text-center text-[0.9375rem] text-white/75">
          No mall matches that search yet.{" "}
          <Link href="/contact" className="font-semibold text-[#F0CE8F] hover:underline">
            Suggest a mall for the directory
          </Link>{" "}
          and we will add it after a quick check.
        </p>
      ) : (
        <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((mall, index) => (
            <MallCard key={mall.slug} mall={mall} priority={index < 3} />
          ))}
        </div>
      )}
    </div>
  );
}
