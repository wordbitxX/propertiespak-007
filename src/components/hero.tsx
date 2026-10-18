"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useLanguage } from "@/components/language-provider";
import { HeroBudgetField, HeroLocationField, type LocatedPlace } from "@/components/hero-search-fields";
import type { LocationSuggestion } from "@/lib/location-suggest";
import { BUDGETS_BUY, BUDGETS_RENT } from "@/lib/constants";
import {
  COMMERCIAL_SEARCH_TYPES,
  defaultPropertySearch,
  formatNear,
  HOME_SEARCH_TYPES,
  PLOT_SEARCH_TYPES,
  propertySearchHref,
  searchTypeLabel,
} from "@/lib/property-search";

type Tab = "buy" | "rent" | "sell";
type HeroStats = { listings: number; verified: number; locations: number; maps: number };

const TABS: { id: Tab; label: string }[] = [
  { id: "buy", label: "Buy" },
  { id: "rent", label: "Rent" },
  { id: "sell", label: "Sell" },
];

const TYPES = [...HOME_SEARCH_TYPES, ...PLOT_SEARCH_TYPES, ...COMMERCIAL_SEARCH_TYPES];

function PinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  );
}
function HomeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3.5 10.5 12 3.8l8.5 6.7" />
      <path d="M5.5 9v11h13V9" />
      <path d="M10 20v-5.5h4V20" />
    </svg>
  );
}
function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3.2 5 6v5.6c0 4.3 3 7.9 7 9.2 4-1.3 7-4.9 7-9.2V6l-7-2.8Z" />
      <path d="m8.8 12.2 2.2 2.2 4.3-4.5" />
    </svg>
  );
}
function MapIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m9 4.5-5.5 2v13l5.5-2 6 2 5.5-2v-13l-5.5 2-6-2Z" />
      <path d="M9 4.5v13M15 6.5v13" />
    </svg>
  );
}
function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 12h15M13.5 6.5 19 12l-5.5 5.5" />
    </svg>
  );
}
function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m6.5 9.5 5.5 5.5 5.5-5.5" />
    </svg>
  );
}

/**
 * Homepage hero: night villa photograph, "Find Your Dream / Property in Pakistan."
 * headline, cream Buy / Rent / Sell search card and three live counters.
 * (The previous Lahore-skyline hero lives on in hero-legacy.tsx, shown on /sample.)
 */
export function Hero({ stats }: { stats: HeroStats }) {
  const { t, locale } = useLanguage();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("buy");
  const [location, setLocation] = useState("");
  const [place, setPlace] = useState<LocationSuggestion | null>(null);
  const [type, setType] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const budgets = tab === "rent" ? BUDGETS_RENT : BUDGETS_BUY;

  function selectTab(next: Tab) {
    setTab(next);
    setMinPrice("");
    setMaxPrice("");
  }

  /** "Use my current location": straight to listings around the visitor. */
  function onLocate(found: LocatedPlace) {
    setLocation(found.label);
    setPlace(null);
    if (tab === "sell") return;
    const base = { ...defaultPropertySearch(tab), type, minPrice, maxPrice };
    const state =
      found.status === "near"
        ? { ...base, near: formatNear(found.lat, found.lng), radius: String(found.radiusKm), sort: "nearest" }
        : { ...base, city: found.city };
    router.push(propertySearchHref(state));
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (tab === "sell") {
      router.push("/list-property");
      return;
    }
    const base = { ...defaultPropertySearch(tab), type, minPrice, maxPrice };
    // A picked suggestion becomes a precise city / area filter; free text stays a keyword search.
    const state = place
      ? { ...base, city: place.city, town: place.town, townExact: place.townExact }
      : { ...base, keyword: location.trim() };
    router.push(propertySearchHref(state));
  }

  return (
    <section id="hero" className="pkr-hero pkr-hero--home" aria-labelledby="hero-heading" data-testid="home-hero">
      <picture>
        <source type="image/avif" srcSet="/images/hero-villa-night-2400.avif" />
        <source type="image/webp" media="(max-width: 767px)" srcSet="/images/hero-villa-night-1280.webp" />
        <img className="pkr-hero-bg" src="/images/hero-villa-night-2400.webp" alt="" fetchPriority="high" decoding="async" width={2400} height={1179} />
      </picture>
      <div className="pkr-hero-shade" aria-hidden="true" />

      <div className="pkr-hero-inner">
        <p className="pkr-hero-eyebrow">
          <span aria-hidden="true" />
          {t("PREMIUM REAL ESTATE PLATFORM")}
        </p>
        <h1 id="hero-heading" className="pkr-hero-title" aria-label={t("Find Your Dream Property in Pakistan")}>
          {locale === "en" ? (
            <>
              Find Your Dream
              <em>Property in Pakistan.</em>
            </>
          ) : (
            t("Find Your Dream Property in Pakistan")
          )}
        </h1>
        <p className="pkr-hero-sub">
          {locale === "en" ? (
            <>
              Discover homes, apartments, plots, commercial properties and new projects across{" "}
              <Link href="/city/lahore" className="pkr-hero-city">Lahore</Link>,{" "}
              <Link href="/city/islamabad" className="pkr-hero-city">Islamabad</Link>,{" "}
              <Link href="/city/karachi" className="pkr-hero-city">Karachi</Link> and{" "}
              <Link href="/properties" className="pkr-hero-city">Pakistan’s major markets</Link>.
            </>
          ) : (
            t(
              "Discover homes, apartments, plots, commercial properties and new projects across Lahore, Islamabad, Karachi and Pakistan’s major markets.",
            )
          )}
        </p>
        <div className="pkr-hero-links">
          <Link href="/properties" className="pkr-hero-explore">
            {t("Explore Properties")}
            <ArrowIcon className="pkr-hero-explore-arrow" />
          </Link>
          <Link href="/dealers" className="pkr-hero-explore pkr-hero-explore--secondary">
            {t("Find an Agent")}
          </Link>
        </div>

        <form id="property-search" className="pkr-search" onSubmit={submit} role="search" aria-label={t("Search properties")} data-testid="hero-search">
          <div className="pkr-search-tabs" role="tablist" aria-label="Search purpose">
            {TABS.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={tab === item.id}
                className={`pkr-search-tab${tab === item.id ? " is-active" : ""}`}
                onClick={() => selectTab(item.id)}
              >
                {t(item.label)}
              </button>
            ))}
          </div>
          <div className="pkr-search-card">
            <HeroLocationField value={location} onChange={setLocation} onPick={setPlace} purpose={tab === "rent" ? "rent" : "buy"} onLocate={onLocate} />
            <label className="pkr-field">
              <span className="pkr-field-label">{t("Property type")}</span>
              <span className="pkr-field-control">
                <select value={type} onChange={(event) => setType(event.target.value)}>
                  <option value="">{t("All Types")}</option>
                  {TYPES.map((value) => (
                    <option key={value} value={value}>
                      {t(searchTypeLabel(value))}
                    </option>
                  ))}
                </select>
                <ChevronIcon className="pkr-field-chevron" />
              </span>
            </label>
            <HeroBudgetField
              presets={budgets}
              minPrice={minPrice}
              maxPrice={maxPrice}
              onChange={(low, high) => {
                setMinPrice(low);
                setMaxPrice(high);
              }}
            />
            <button type="submit" className="pkr-search-submit">
              {t(tab === "sell" ? "List Your Property" : "Search Properties")}
              <ArrowIcon className="pkr-search-submit-arrow" />
            </button>
          </div>
        </form>

        <ul className="pkr-stats" aria-label="Properties Pak at a glance">
          <li>
            <Link href="/properties" className="pkr-stat-link">
              <HomeIcon className="pkr-stat-icon" />
              <span>
                <b>{stats.listings}</b>
                <small>{t("Properties Listed")}</small>
              </span>
            </Link>
          </li>
          <li>
            <Link href="/properties?verified=1" className="pkr-stat-link">
              <ShieldCheckIcon className="pkr-stat-icon" />
              <span>
                <b>{stats.verified}</b>
                <small>{t("Verified Listings")}</small>
              </span>
            </Link>
          </li>
          <li>
            <Link href="/towns" className="pkr-stat-link">
              <PinIcon className="pkr-stat-icon" />
              <span>
                <b>{stats.locations}</b>
                <small>{t("Listing Locations")}</small>
              </span>
            </Link>
          </li>
          <li>
            <Link href="/maps" className="pkr-stat-link">
              <MapIcon className="pkr-stat-icon" />
              <span>
                <b>{stats.maps}</b>
                <small>{t("HD Society Maps")}</small>
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
