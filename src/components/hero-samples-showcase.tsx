"use client";

import { useState } from "react";
import Link from "next/link";
import { IconArrowRight, IconPin } from "@/components/icons";
import { useLanguage } from "@/components/language-provider";
import { ResilientImage } from "@/components/resilient-image";
import { SearchPanel } from "@/components/search-panel";
import { SITE } from "@/lib/constants";

type ImageGroup = "lahore" | "villa";
type VariantStyle = "signature" | "ultraclear" | "royal-gold" | "emerald-luxe" | "cinematic-glass";

interface HeroSampleConfig {
  id: number;
  code: string;
  title: string;
  subtitle: string;
  imageGroup: ImageGroup;
  imageLabel: string;
  locationBadge: string;
  locationHref: string;
  variant: VariantStyle;
  sources: { type: string; srcSet: string; sizes: string }[];
  fallbackSrc: string;
  objectPosition: string;
}

const LAHORE_SOURCES = [
  { type: "image/avif", srcSet: "/images/hero-lahore-skyline.avif 1672w", sizes: "100vw" },
  { type: "image/webp", srcSet: "/images/hero-lahore-skyline.webp 1672w", sizes: "100vw" },
  { type: "image/jpeg", srcSet: "/images/hero-lahore-skyline.jpg 1672w", sizes: "100vw" },
];

const VILLA_SOURCES = [
  { type: "image/avif", srcSet: "/images/hero-villa-sunset.avif 1672w", sizes: "100vw" },
  { type: "image/webp", srcSet: "/images/hero-villa-sunset.webp 1672w", sizes: "100vw" },
  { type: "image/jpeg", srcSet: "/images/hero-premium.jpg 1672w", sizes: "100vw" },
];

const HERO_SAMPLES: HeroSampleConfig[] = [
  // 1–5: New Attached Image — Lahore Skyline at Golden Hour
  {
    id: 1,
    code: "Sample 01",
    title: "Lahore Golden Hour — Signature Emerald & Gold",
    subtitle: "Current hero layout with balanced left shade, Champagne Gold 'Dream' accent, and frosted owner CTA card.",
    imageGroup: "lahore",
    imageLabel: "New Image: Lahore Skyline at Golden Hour",
    locationBadge: "Lahore",
    locationHref: "/city/lahore",
    variant: "signature",
    sources: LAHORE_SOURCES,
    fallbackSrc: "/images/hero-lahore-skyline.jpg",
    objectPosition: "center 46%",
  },
  {
    id: 2,
    code: "Sample 02",
    title: "Lahore Golden Hour — Ultra-Clear HD Panorama",
    subtitle: "Maximum background visibility with a soft frosted glass backdrop behind the left text & right owner card.",
    imageGroup: "lahore",
    imageLabel: "New Image: Lahore Skyline at Golden Hour",
    locationBadge: "Lahore",
    locationHref: "/city/lahore",
    variant: "ultraclear",
    sources: LAHORE_SOURCES,
    fallbackSrc: "/images/hero-lahore-skyline.jpg",
    objectPosition: "center 42%",
  },
  {
    id: 3,
    code: "Sample 03",
    title: "Lahore Golden Hour — Royal Sunset Gold Edition",
    subtitle: "Warm golden-hour theme with Champagne Gold CTA buttons, gold-rimmed glass owner card, and golden highlights.",
    imageGroup: "lahore",
    imageLabel: "New Image: Lahore Skyline at Golden Hour",
    locationBadge: "Lahore",
    locationHref: "/city/lahore",
    variant: "royal-gold",
    sources: LAHORE_SOURCES,
    fallbackSrc: "/images/hero-lahore-skyline.jpg",
    objectPosition: "center 48%",
  },
  {
    id: 4,
    code: "Sample 04",
    title: "Lahore Golden Hour — Emerald Luxe & Mint Accent",
    subtitle: "Rich architectural emerald glass card with glowing top border and luminous emerald-mint headline accent.",
    imageGroup: "lahore",
    imageLabel: "New Image: Lahore Skyline at Golden Hour",
    locationBadge: "Lahore",
    locationHref: "/city/lahore",
    variant: "emerald-luxe",
    sources: LAHORE_SOURCES,
    fallbackSrc: "/images/hero-lahore-skyline.jpg",
    objectPosition: "center 45%",
  },
  {
    id: 5,
    code: "Sample 05",
    title: "Lahore Golden Hour — Cinematic Pill & Dark Glass Search",
    subtitle: "Refined pill-shaped buttons, warm sunset vignette, and a dark frosted-glass search bar at the bottom.",
    imageGroup: "lahore",
    imageLabel: "New Image: Lahore Skyline at Golden Hour",
    locationBadge: "Lahore",
    locationHref: "/city/lahore",
    variant: "cinematic-glass",
    sources: LAHORE_SOURCES,
    fallbackSrc: "/images/hero-lahore-skyline.jpg",
    objectPosition: "center 50%",
  },

  // 6–10: Current Hero Image — Luxury Villa Overlooking Sunset Cityscape
  {
    id: 6,
    code: "Sample 06",
    title: "Islamabad Sunset Villa — Signature Emerald & Gold",
    subtitle: "Current hero layout with the Sunset Villa & Faisal Mosque backdrop, Champagne Gold 'Dream' accent, and glass owner card.",
    imageGroup: "villa",
    imageLabel: "Current Image: Sunset Villa & Islamabad Skyline",
    locationBadge: "Islamabad",
    locationHref: "/city/islamabad",
    variant: "signature",
    sources: VILLA_SOURCES,
    fallbackSrc: "/images/hero-premium.jpg",
    objectPosition: "66% 48%",
  },
  {
    id: 7,
    code: "Sample 07",
    title: "Islamabad Sunset Villa — Ultra-Clear HD Panorama",
    subtitle: "Lightest backdrop overlay so the infinity pool, villa lights, and Margalla sunset shine at full clarity.",
    imageGroup: "villa",
    imageLabel: "Current Image: Sunset Villa & Islamabad Skyline",
    locationBadge: "Islamabad",
    locationHref: "/city/islamabad",
    variant: "ultraclear",
    sources: VILLA_SOURCES,
    fallbackSrc: "/images/hero-premium.jpg",
    objectPosition: "68% 46%",
  },
  {
    id: 8,
    code: "Sample 08",
    title: "Islamabad Sunset Villa — Royal Sunset Gold Edition",
    subtitle: "Champagne Gold primary buttons, warm gold 'Dream Property' highlight, and gold-bordered frosted owner card.",
    imageGroup: "villa",
    imageLabel: "Current Image: Sunset Villa & Islamabad Skyline",
    locationBadge: "Islamabad",
    locationHref: "/city/islamabad",
    variant: "royal-gold",
    sources: VILLA_SOURCES,
    fallbackSrc: "/images/hero-premium.jpg",
    objectPosition: "66% 48%",
  },
  {
    id: 9,
    code: "Sample 09",
    title: "Islamabad Sunset Villa — Emerald Luxe & Mint Accent",
    subtitle: "Deep emerald glassmorphism with luminous mint accents and a glowing emerald top bar on the owner card.",
    imageGroup: "villa",
    imageLabel: "Current Image: Sunset Villa & Islamabad Skyline",
    locationBadge: "Islamabad",
    locationHref: "/city/islamabad",
    variant: "emerald-luxe",
    sources: VILLA_SOURCES,
    fallbackSrc: "/images/hero-premium.jpg",
    objectPosition: "64% 48%",
  },
  {
    id: 10,
    code: "Sample 10",
    title: "Islamabad Sunset Villa — Cinematic Pill & Dark Glass Search",
    subtitle: "Rounded pill CTAs, warm sunset framing, and a matching translucent dark-glass search panel.",
    imageGroup: "villa",
    imageLabel: "Current Image: Sunset Villa & Islamabad Skyline",
    locationBadge: "Islamabad",
    locationHref: "/city/islamabad",
    variant: "cinematic-glass",
    sources: VILLA_SOURCES,
    fallbackSrc: "/images/hero-premium.jpg",
    objectPosition: "66% 50%",
  },
];

export function HeroSamplesShowcase() {
  const { t, locale } = useLanguage();
  const [filter, setFilter] = useState<"all" | ImageGroup>("all");

  const visibleSamples = HERO_SAMPLES.filter((item) =>
    filter === "all" ? true : item.imageGroup === filter,
  );

  return (
    <div className="home-page hero-samples-page">
      {/* Top Sticky Sample Bar */}
      <div className="hero-samples-toolbar">
        <div className="ui-container hero-samples-toolbar-inner">
          <div className="hero-samples-toolbar-head">
            <div>
              <span className="hero-samples-kicker">HERO DESIGN GALLERY · 10 SAMPLES</span>
              <h1 className="hero-samples-heading">
                Hero Section Variations (5 New Lahore Skyline + 5 Current Sunset Villa)
              </h1>
            </div>
            <div className="hero-samples-filter-group" role="tablist" aria-label="Filter hero samples by background image">
              <button
                type="button"
                role="tab"
                aria-selected={filter === "all"}
                onClick={() => setFilter("all")}
                className={`hero-samples-filter-btn ${filter === "all" ? "is-active" : ""}`}
              >
                All 10 Samples
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={filter === "lahore"}
                onClick={() => setFilter("lahore")}
                className={`hero-samples-filter-btn ${filter === "lahore" ? "is-active" : ""}`}
              >
                1–5: Lahore Skyline (New)
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={filter === "villa"}
                onClick={() => setFilter("villa")}
                className={`hero-samples-filter-btn ${filter === "villa" ? "is-active" : ""}`}
              >
                6–10: Sunset Villa (Current)
              </button>
            </div>
          </div>

          <div className="hero-samples-jump-nav" aria-label="Jump to sample">
            {visibleSamples.map((sample) => (
              <a
                key={sample.id}
                href={`#sample-${sample.id}`}
                className={`hero-samples-jump-chip ${
                  sample.imageGroup === "lahore" ? "is-lahore" : "is-villa"
                }`}
              >
                <span>#{sample.id}</span>
                <span className="hidden sm:inline">
                  {sample.imageGroup === "lahore" ? "Lahore" : "Villa"}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* 10 Hero Samples */}
      <div className="hero-samples-list">
        {visibleSamples.map((sample) => {
          const englishHeadline =
            sample.variant === "royal-gold" || sample.variant === "emerald-luxe" ? (
              <>
                Find Your <span className="hero-headline-accent">Dream Property</span>
                <br />
                in Pakistan
              </>
            ) : (
              <>
                Find Your <span className="hero-headline-accent">Dream</span>
                <br />
                Property in Pakistan
              </>
            );
          const headline =
            locale === "en" ? englishHeadline : t("Find Your Dream Property in Pakistan");

          return (
            <article
              key={sample.id}
              id={`sample-${sample.id}`}
              className={`hero-sample-block hero-variant--${sample.variant}`}
              data-testid={`hero-sample-${sample.id}`}
            >
              {/* Sample Label Bar */}
              <div className="ui-container hero-sample-meta-bar">
                <div className="hero-sample-meta-left">
                  <span
                    className={`hero-sample-badge ${
                      sample.imageGroup === "lahore"
                        ? "hero-sample-badge--lahore"
                        : "hero-sample-badge--villa"
                    }`}
                  >
                    {sample.code}
                  </span>
                  <span className="hero-sample-image-tag">{sample.imageLabel}</span>
                  <h2 className="hero-sample-title">{sample.title}</h2>
                </div>
                <p className="hero-sample-subtitle">{sample.subtitle}</p>
              </div>

              {/* Exact Hero Section Structure */}
              <div className="hero-section-wrapper">
                <section
                  className="home-hero"
                  aria-label={`${sample.code}: ${sample.title}`}
                >
                  <ResilientImage
                    pictureClassName="hero-photograph"
                    pictureSources={sample.sources}
                    srcSet={`${sample.fallbackSrc} 1672w`}
                    fallbackSrc={sample.fallbackSrc}
                    src={sample.fallbackSrc}
                    sizes="100vw"
                    width={1672}
                    height={941}
                    alt={sample.title}
                    loading={sample.id <= 2 ? "eager" : "lazy"}
                    decoding="async"
                    className="hero-background-image"
                    style={{ objectPosition: sample.objectPosition }}
                  />
                  <div className="hero-photograph-shade" aria-hidden="true" />
                  <div className="hero-particles" aria-hidden="true">
                    <span className="hero-particle hero-particle--1" />
                    <span className="hero-particle hero-particle--2" />
                    <span className="hero-particle hero-particle--3" />
                    <span className="hero-particle hero-particle--4" />
                    <span className="hero-particle hero-particle--5" />
                    <span className="hero-particle hero-particle--6" />
                  </div>

                  <div className="ui-container hero-content">
                    <div className="hero-main">
                      <div className="hero-search-intro">
                        <p className="hero-eyebrow">
                          <span className="hero-eyebrow-dot" aria-hidden="true" />
                          {t("PREMIUM REAL ESTATE PLATFORM")}
                        </p>
                        <h3
                          className="hero-headline"
                          aria-label={t("Find Your Dream Property in Pakistan")}
                        >
                          <span className="hero-headline-desktop">{headline}</span>
                          <span className="hero-headline-mobile">{headline}</span>
                        </h3>
                        <p className="hero-description hero-description-desktop">
                          {t(
                            "Discover homes, apartments, plots, commercial properties and new projects across Lahore, Islamabad, Karachi and Pakistan’s major markets.",
                          )}
                        </p>
                        <p className="hero-description hero-description-mobile">
                          {t(
                            "Discover homes, apartments, plots, commercial properties and new projects across Lahore, Islamabad, Karachi and Pakistan’s major markets.",
                          )}
                        </p>

                        <ul className="hero-premium-bullets" aria-label="Platform highlights">
                          {[
                            "Buy, rent and explore new projects",
                            "Connect with property agents",
                            "Verified property listings",
                          ].map((point) => (
                            <li key={point} className="hero-premium-bullet">
                              <span className="hero-premium-bullet-icon" aria-hidden="true">
                                ✓
                              </span>
                              <span>{t(point)}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="hero-actions hero-actions-desktop">
                          <Link href="/#featured" className="btn hero-cta-primary">
                            <span>{t("Explore Properties")}</span>
                            <IconArrowRight className="h-4 w-4 shrink-0" />
                          </Link>
                          <Link href="/dealers" className="btn hero-cta-secondary">
                            <span>{t("Find an Agent")}</span>
                          </Link>
                        </div>

                        <p className="hero-signature">{t("Better Homes. Bigger Dreams.")}</p>
                        <a
                          className="hero-credit"
                          href={SITE.companyUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          {t("Official platform by WordbitX Software Company")}
                        </a>
                      </div>

                      <aside
                        className="hero-owner-glass-card"
                        aria-label={`${sample.code} property owners callout`}
                      >
                        <p className="hero-owner-glass-eyebrow">{t("For property owners")}</p>
                        <h4 className="hero-owner-glass-title">
                          List it free. Reach thousands.
                        </h4>
                        <ul className="hero-owner-glass-list">
                          <li>
                            <span className="hero-owner-glass-check" aria-hidden="true">
                              ✓
                            </span>
                            <span>{t("Free listing")}</span>
                          </li>
                          <li>
                            <span className="hero-owner-glass-check" aria-hidden="true">
                              ✓
                            </span>
                            <span>{t("No hidden charges")}</span>
                          </li>
                          <li>
                            <span className="hero-owner-glass-check" aria-hidden="true">
                              ✓
                            </span>
                            <span>Reach buyers at home &amp; abroad</span>
                          </li>
                        </ul>
                        <div className="hero-owner-glass-actions">
                          <Link href="/list-property" className="btn hero-owner-glass-btn">
                            <span>{t("List Your Property")}</span>
                            <IconArrowRight className="h-4 w-4 shrink-0" />
                          </Link>
                        </div>
                      </aside>
                    </div>
                  </div>
                </section>

                <div className="ui-container home-search-wrap">
                  <nav className="hero-city-pills-bar" aria-label="Popular cities in Pakistan">
                    {[
                      { label: "Lahore", href: "/city/lahore" },
                      { label: "Islamabad", href: "/city/islamabad" },
                      { label: "Karachi", href: "/city/karachi" },
                      { label: "Peshawar", href: "/city/peshawar" },
                    ].map((city) => (
                      <Link
                        key={city.href}
                        href={city.href}
                        className="hero-city-pill"
                        aria-label={`Explore properties in ${city.label}`}
                      >
                        <IconPin className="h-3.5 w-3.5 text-[#DFB872]" />
                        <span>{t(city.label)}</span>
                      </Link>
                    ))}
                  </nav>
                  <SearchPanel />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
