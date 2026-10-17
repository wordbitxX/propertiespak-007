"use client";

import Link from "next/link";
import { IconArrowRight, IconPin } from "@/components/icons";
import { useLanguage } from "@/components/language-provider";
import { ResilientImage } from "@/components/resilient-image";
import { SearchPanel } from "@/components/search-panel";
import { SITE } from "@/lib/constants";

/** Sample 04 — Lahore Skyline at Golden Hour (Emerald Luxe & Mint Accent). */
const HERO_IMAGE_SRC = "/images/hero-lahore-skyline.jpg";
const HERO_IMAGE_ALT = "Lahore skyline at golden hour with high-rise towers, a tree-lined avenue and the setting sun";
const HERO_IMAGE_SOURCES = [
  { type: "image/avif", srcSet: "/images/hero-lahore-skyline.avif 1672w", sizes: "100vw" },
  { type: "image/webp", srcSet: "/images/hero-lahore-skyline.webp 1672w", sizes: "100vw" },
  { type: "image/jpeg", srcSet: `${HERO_IMAGE_SRC} 1672w`, sizes: "100vw" },
];

const HERO_FEATURED_CITIES = [
  { label: "Lahore", href: "/city/lahore" },
  { label: "Islamabad", href: "/city/islamabad" },
  { label: "Karachi", href: "/city/karachi" },
  { label: "Peshawar", href: "/city/peshawar" },
] as const;

/**
 * The previous homepage hero (Sample 04 — Lahore golden-hour skyline, Emerald Luxe & Mint accent),
 * kept on /sample so it can be brought back later.
 */
export function LegacyHero() {
  const { t, locale } = useLanguage();
  const englishHeadline = (
    <>
      Find Your <span className="hero-headline-accent">Dream Property</span>
      <br />
      in Pakistan
    </>
  );
  const headline = locale === "en" ? englishHeadline : t("Find Your Dream Property in Pakistan");

  return (
    <div className="hero-section-wrapper hero-variant--emerald-luxe">
      <section className="home-hero" aria-labelledby="hero-heading">
        <ResilientImage
          pictureClassName="hero-photograph"
          pictureSources={HERO_IMAGE_SOURCES}
          srcSet={`${HERO_IMAGE_SRC} 1672w`}
          fallbackSrc={HERO_IMAGE_SRC}
          src={HERO_IMAGE_SRC}
          sizes="100vw"
          width={1672}
          height={941}
          alt={HERO_IMAGE_ALT}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="hero-background-image"
          style={{ objectPosition: "center 45%" }}
          data-testid="hero-photograph"
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
              <h1 id="hero-heading" className="hero-headline" aria-label={t("Find Your Dream Property in Pakistan")}>
                <span className="hero-headline-desktop">{headline}</span>
                <span className="hero-headline-mobile">{headline}</span>
              </h1>
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

              <div className="hero-actions hero-actions-desktop">
                <Link href="#featured" className="btn hero-cta-primary">
                  <span>{t("Explore Properties")}</span>
                  <IconArrowRight className="h-4 w-4 shrink-0" />
                </Link>
                <Link href="/dealers" className="btn hero-cta-secondary">
                  <span>{t("Find an Agent")}</span>
                </Link>
              </div>

              <p className="hero-signature">{t("Better Homes. Bigger Dreams.")}</p>
              <a className="hero-credit" href={SITE.companyUrl} target="_blank" rel="noreferrer noopener">
                {t("Official platform by WordbitX Software Company")}
              </a>
            </div>

            <aside className="hero-owner-glass-card" aria-labelledby="hero-owner-heading">
              <p className="hero-owner-glass-eyebrow">{t("For property owners")}</p>
              <h2 id="hero-owner-heading" className="hero-owner-glass-title">
                List it free. Reach thousands.
              </h2>
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
          {HERO_FEATURED_CITIES.map((city) => (
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
  );
}
