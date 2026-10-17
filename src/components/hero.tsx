"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useLanguage } from "@/components/language-provider";
import { BUDGETS_BUY, BUDGETS_RENT } from "@/lib/constants";
import {
  COMMERCIAL_SEARCH_TYPES,
  defaultPropertySearch,
  HOME_SEARCH_TYPES,
  PLOT_SEARCH_TYPES,
  propertySearchHref,
  searchTypeLabel,
} from "@/lib/property-search";

type Tab = "buy" | "rent" | "sell";
type HeroStats = { listings: number; members: number; locations: number };

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
function PersonIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="3.6" />
      <path d="M5 20.5c.6-3.8 3.4-6 7-6s6.4 2.2 7 6" />
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
 * Homepage hero: night villa photograph, "Exceptional spaces. / New beginnings."
 * headline, cream Buy / Rent / Sell search card and three live counters.
 * (The previous Lahore-skyline hero lives on in hero-legacy.tsx, shown on /sample.)
 */
export function Hero({ stats }: { stats: HeroStats }) {
  const { t } = useLanguage();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("buy");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [budget, setBudget] = useState("");
  const budgets = tab === "rent" ? BUDGETS_RENT : BUDGETS_BUY;

  function selectTab(next: Tab) {
    setTab(next);
    setBudget("");
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (tab === "sell") {
      router.push("/list-property");
      return;
    }
    const [minPrice = "", maxPrice = ""] = budget ? budget.split("-") : [];
    const state = { ...defaultPropertySearch(tab), keyword: location.trim(), type, minPrice, maxPrice };
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
          <span aria-hidden="true" />{t("A place for your next chapter")}
        </p>
        <h1 id="hero-heading" className="pkr-hero-title">
          Exceptional spaces.
          <em>New beginnings.</em>
        </h1>
        <p className="pkr-hero-sub">
          Discover homes, land and possibilities across Pakistan.{" "}
          <br />
          Your next move starts with the right place.
        </p>
        <Link href="/properties" className="pkr-hero-explore">
          {t("Explore the collection")}
          <ArrowIcon className="pkr-hero-explore-arrow" />
        </Link>

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
            <label className="pkr-field pkr-field--location">
              <span className="pkr-field-label">{t("Location")}</span>
              <span className="pkr-field-control">
                <input
                  type="text"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder={t("Enter city or area")}
                  autoComplete="off"
                />
                <PinIcon className="pkr-field-icon" />
              </span>
            </label>
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
            <label className="pkr-field">
              <span className="pkr-field-label">{t("Your budget")}</span>
              <span className="pkr-field-control">
                <select value={budget} onChange={(event) => setBudget(event.target.value)}>
                  <option value="">{t("Any price")}</option>
                  {budgets.map((item) => (
                    <option key={item.value} value={item.value}>
                      {t(item.label)}
                    </option>
                  ))}
                </select>
                <ChevronIcon className="pkr-field-chevron" />
              </span>
            </label>
            <button type="submit" className="pkr-search-submit">
              {t(tab === "sell" ? "List Your Property" : "Search Properties")}
              <ArrowIcon className="pkr-search-submit-arrow" />
            </button>
          </div>
        </form>

        <ul className="pkr-stats" aria-label="Properties Pak at a glance">
          <li>
            <HomeIcon className="pkr-stat-icon" />
            <span>
              <b>{stats.listings}</b>
              <small>{t("Properties Listed")}</small>
            </span>
          </li>
          <li>
            <PersonIcon className="pkr-stat-icon" />
            <span>
              <b>{stats.members}</b>
              <small>{t("Registered Members")}</small>
            </span>
          </li>
          <li>
            <PinIcon className="pkr-stat-icon" />
            <span>
              <b>{stats.locations}</b>
              <small>{t("Listing Locations")}</small>
            </span>
          </li>
        </ul>
      </div>
    </section>
  );
}
