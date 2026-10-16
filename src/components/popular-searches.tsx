"use client";

import Link from "next/link";
import { useState } from "react";
import { IconArrowRight, IconPin, IconSearch } from "@/components/icons";
import { SEARCH_CITIES } from "@/lib/property-search";
import type { PopularSearchGroup } from "@/lib/queries";

const TYPES = [
  { value: "all", label: "All Properties" },
  { value: "House", label: "Houses" },
  { value: "Apartment", label: "Apartments & Flats" },
  { value: "Plot", label: "Plots & Land" },
  { value: "commercial", label: "Commercial" },
];

const TRENDING_SHORTCUTS = [
  { label: "DHA Lahore Properties", href: "/property-for-sale/dha-lahore" },
  { label: "Bahria Town Lahore", href: "/property-for-sale/bahria-town-lahore" },
  { label: "5 Marla House in Lahore", href: "/5-marla-house-for-sale-in-lahore" },
  { label: "5 Marla Plot in Lahore", href: "/5-marla-plot-for-sale-in-lahore" },
  { label: "Plots on Installments Lahore", href: "/plots-on-installments-in-lahore" },
  { label: "Houses in Islamabad", href: "/houses-for-sale-in-islamabad" },
  { label: "Apartments in Karachi", href: "/apartments-for-sale-in-karachi" },
  { label: "Society PDF Maps (DHA & Bahria)", href: "/maps" },
] as const;

export function PopularSearches({ groups }: { groups: PopularSearchGroup[] }) {
  const [purpose, setPurpose] = useState<"buy" | "rent">("buy");
  const [city, setCity] = useState(
    groups.some((group) => group.citySlug === "lahore") ? "lahore" : "",
  );
  const [type, setType] = useState("all");

  const cityName = SEARCH_CITIES.find((item) => item.slug === city)?.name ?? city;
  const current = groups.find(
    (group) => group.purpose === purpose && group.citySlug === city && group.type === type,
  );
  const cityGroups = groups.filter(
    (group) => group.purpose === purpose && group.type === type,
  );
  const availableCities = SEARCH_CITIES.filter((item) =>
    groups.some((group) => group.citySlug === item.slug),
  );

  function href(slug: string, area?: string) {
    const params = new URLSearchParams({ city: slug });
    if (type === "commercial") params.set("category", "commercial");
    else if (type !== "all") params.set("type", type);
    if (area) {
      params.set("town", area);
      params.set("townExact", "1");
    }
    return `/properties/for-${purpose === "buy" ? "sale" : "rent"}?${params}`;
  }

  const activeTypeLabel = TYPES.find((item) => item.value === type)?.label ?? "Properties";

  return (
    <section
      id="popular-searches"
      className="home-popular-searches"
      aria-labelledby="popular-heading"
    >
      <div className="ui-container">
        <div className="overflow-hidden rounded-[20px] border border-[#E2E8E4] bg-white shadow-[0_18px_44px_-24px_rgba(7,31,23,0.18)]">
          {/* Top Emerald & Champagne Gold Header */}
          <div className="relative overflow-hidden bg-gradient-to-r from-[#071F17] via-[#0B2D22] to-[#0E382A] px-5 py-6 text-white sm:px-7 sm:py-7">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-60"
              style={{
                background:
                  "radial-gradient(500px 220px at 90% 0%, rgba(216, 175, 104,0.22), transparent 65%)",
              }}
            />
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <span className="mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-[#DFB872]/40 bg-[#DFB872]/15 text-[#DFB872]">
                  <IconSearch className="h-5 w-5" />
                </span>
                <div>
                  <span className="block font-sans text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#DFB872]">
                    MARKET EXPLORER
                  </span>
                  <h2
                    id="popular-heading"
                    className="mt-0.5 font-sans text-[clamp(1.35rem,2vw,1.75rem)] font-extrabold leading-tight tracking-[-0.025em] text-white"
                  >
                    Popular Searches
                  </h2>
                  <p className="mt-1 text-[0.84rem] text-white/80">
                    Explore active listings by city, area and property type.
                  </p>
                </div>
              </div>

              {/* Buy / Rent Purpose Toggle */}
              <div
                className="inline-flex rounded-xl border border-white/16 bg-[#061812]/70 p-1 backdrop-blur-sm"
                role="group"
                aria-label="Popular search purpose"
              >
                <button
                  type="button"
                  aria-pressed={purpose === "buy"}
                  onClick={() => setPurpose("buy")}
                  className={`min-h-[38px] rounded-lg px-4 font-sans text-[0.8rem] font-bold transition-all ${
                    purpose === "buy"
                      ? "bg-gradient-to-b from-[#E2BC76] to-[#D4A85D] text-[#082218] shadow-sm"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  For Sale
                </button>
                <button
                  type="button"
                  aria-pressed={purpose === "rent"}
                  onClick={() => setPurpose("rent")}
                  className={`min-h-[38px] rounded-lg px-4 font-sans text-[0.8rem] font-bold transition-all ${
                    purpose === "rent"
                      ? "bg-gradient-to-b from-[#E2BC76] to-[#D4A85D] text-[#082218] shadow-sm"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  To Rent
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Filters & Results Body */}
          <div className="p-5 sm:p-7">
            {/* Row 1: City Selector Pills */}
            <div className="flex flex-col gap-3 border-b border-[#EDF1EE] pb-5 lg:flex-row lg:items-center lg:justify-between">
              <div
                className="flex flex-wrap items-center gap-2"
                role="group"
                aria-label="Popular cities"
              >
                <button
                  type="button"
                  aria-pressed={!city}
                  onClick={() => setCity("")}
                  className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-full border px-4 font-sans text-[0.78rem] font-bold transition-all ${
                    !city
                      ? "border-[#0D382A] bg-[#0D382A] text-white shadow-sm"
                      : "border-[#DFE6E1] bg-[#F8FAF8] text-[#263B31] hover:border-[#0D382A]/40 hover:bg-white"
                  }`}
                >
                  <IconPin className="h-3.5 w-3.5 text-[#DFB872]" />
                  <span>All Pakistan</span>
                </button>
                {availableCities.map((item) => {
                  const isActive = city === item.slug;
                  return (
                    <button
                      key={item.slug}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setCity(item.slug)}
                      className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-full border px-4 font-sans text-[0.78rem] font-semibold transition-all ${
                        isActive
                          ? "border-[#0D382A] bg-[#0D382A] text-white shadow-sm"
                          : "border-[#DFE6E1] bg-[#F8FAF8] text-[#263B31] hover:border-[#0D382A]/40 hover:bg-white"
                      }`}
                    >
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Row 1 Right: Property Type Pills */}
              <div
                className="flex flex-wrap items-center gap-1.5 rounded-xl bg-[#F3F6F4] p-1"
                role="group"
                aria-label="Popular property types"
              >
                {TYPES.map((item) => {
                  const active = type === item.value;
                  return (
                    <button
                      key={item.value}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setType(item.value)}
                      className={`min-h-[32px] rounded-lg px-3 font-sans text-[0.75rem] font-semibold transition-all ${
                        active
                          ? "bg-white font-bold text-[#0D261D] shadow-xs"
                          : "text-[#52655B] hover:text-[#0D261D]"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Results Header */}
            <div className="mt-5" aria-live="polite">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-sans text-[0.95rem] font-bold text-[#0D261D]">
                  {city
                    ? `${activeTypeLabel} ${purpose === "buy" ? "for sale" : "for rent"} in ${cityName}`
                    : `Popular cities ${purpose === "buy" ? "for sale" : "for rent"} across Pakistan`}
                </h3>
                {city && current && (
                  <Link
                    href={href(city)}
                    className="inline-flex items-center gap-1.5 font-sans text-[0.8rem] font-bold text-[#0D382A] transition-colors hover:text-[#B8893D]"
                  >
                    <span>
                      View all {current.total.toLocaleString("en-PK")} listings in {cityName}
                    </span>
                    <IconArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>

              {/* Location / City Cards Grid */}
              {city ? (
                current ? (
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {current.locations.map((area) => (
                      <li key={area.name}>
                        <Link
                          href={href(city, area.name)}
                          className="group flex items-center justify-between gap-3 rounded-xl border border-[#E4EAE6] bg-[#FAFBF9] p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#DFB872] hover:bg-white hover:shadow-[0_12px_26px_-16px_rgba(8,34,26,0.22)]"
                        >
                          <div className=" flex min-w-0 items-center gap-2.5">
                            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#0D382A]/8 text-[#0D382A] transition-colors group-hover:bg-[#0D382A] group-hover:text-[#DFB872]">
                              <IconPin className="h-3.5 w-3.5" />
                            </span>
                            <div className="min-w-0">
                              <span className="block truncate font-sans text-[0.84rem] font-bold text-[#0D261D] group-hover:text-[#0D382A]">
                                {area.name}
                              </span>
                              <span className="block text-[0.7rem] text-[#66776E]">
                                {cityName} · {purpose === "buy" ? "For Sale" : "For Rent"}
                              </span>
                            </div>
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            <span className="rounded-full border border-[#DFE7E2] bg-white px-2.5 py-0.5 font-sans text-[0.72rem] font-bold text-[#0D382A]">
                              {area.total.toLocaleString("en-PK")}
                            </span>
                            <IconArrowRight className="h-3.5 w-3.5 text-[#7A8B82] transition-transform group-hover:translate-x-0.5 group-hover:text-[#0D382A]" />
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 rounded-xl border border-[#E6ECE8] bg-[#F8FAF8] p-4 text-[0.84rem] text-[#5B6D63]">
                    No matching listings in this city yet. Try another city or property type.
                  </p>
                )
              ) : (
                <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {cityGroups
                    .slice()
                    .sort((a, b) => b.total - a.total)
                    .map((group) => (
                      <li key={group.citySlug}>
                        <Link
                          href={href(group.citySlug)}
                          className="group flex items-center justify-between gap-3 rounded-xl border border-[#E4EAE6] bg-[#FAFBF9] p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#DFB872] hover:bg-white hover:shadow-[0_12px_26px_-16px_rgba(8,34,26,0.22)]"
                        >
                          <div className="flex min-w-0 items-center gap-2.5">
                            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#0D382A]/8 text-[#0D382A] transition-colors group-hover:bg-[#0D382A] group-hover:text-[#DFB872]">
                              <IconPin className="h-3.5 w-3.5" />
                            </span>
                            <div className="min-w-0">
                              <span className="block truncate font-sans text-[0.86rem] font-bold text-[#0D261D]">
                                {group.cityName}
                              </span>
                              <span className="block text-[0.7rem] text-[#66776E]">
                                {activeTypeLabel} · {purpose === "buy" ? "For Sale" : "For Rent"}
                              </span>
                            </div>
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            <span className="rounded-full border border-[#DFE7E2] bg-white px-2.5 py-0.5 font-sans text-[0.72rem] font-bold text-[#0D382A]">
                              {group.total.toLocaleString("en-PK")}
                            </span>
                            <IconArrowRight className="h-3.5 w-3.5 text-[#7A8B82] transition-transform group-hover:translate-x-0.5 group-hover:text-[#0D382A]" />
                          </div>
                        </Link>
                      </li>
                    ))}
                  {!cityGroups.length && (
                    <li className="rounded-xl border border-[#E6ECE8] bg-[#F8FAF8] p-4 text-[0.84rem] text-[#5B6D63]">
                      No matching listings yet.
                    </li>
                  )}
                </ul>
              )}
            </div>

            {/* Bottom Trending Quick-Jump Tags */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#EDF1EE] pt-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-sans text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[#5B6D63]">
                  Quick Links:
                </span>
                {TRENDING_SHORTCUTS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="inline-flex items-center gap-1 rounded-full border border-[#E2E8E4] bg-[#F8FAF8] px-3 py-1 font-sans text-[0.74rem] font-semibold text-[#2B4035] transition-colors hover:border-[#DFB872] hover:bg-[#0D382A] hover:text-white"
                  >
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
              <p className="text-[0.72rem] text-[#7A8B82]">
                Live published inventory counts across Pakistan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
