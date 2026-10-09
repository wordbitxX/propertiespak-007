"use client";

import Link from "next/link";
import { IconArrowRight, IconKey } from "@/components/icons";
import { useLanguage } from "@/components/language-provider";
import { ResilientImage } from "@/components/resilient-image";
import { SearchPanel } from "@/components/search-panel";
import { SITE } from "@/lib/constants";
import { heroImage } from "@/lib/images";

const HERO_IMAGE_SOURCES = [
  { type: "image/jpeg", media: "(max-width: 767px)", srcSet: heroImage.mobileSrcSet, sizes: "100vw" },
  { type: "image/jpeg", srcSet: heroImage.desktopSrcSet, sizes: "100vw" },
];

/** A photographic marketplace hero with a dedicated owner callout and search panel. */
export function Hero() {
  const { t, locale } = useLanguage();
  const englishHeadline = (
    <>
      Find Your <span className="hero-headline-accent">Dream</span><br />
      <span className="hero-headline-accent">Property</span><br />
      {t("in Pakistan")}
    </>
  );
  const headline = locale === "en" ? englishHeadline : t("Find Your Dream Property in Pakistan");
  return (
    <section id="home-hero" className="home-hero" aria-labelledby="hero-heading" data-testid="home-hero">
      <ResilientImage
        pictureClassName="hero-photograph"
        pictureSources={HERO_IMAGE_SOURCES}
        srcSet={heroImage.desktopSrcSet}
        fallbackSrc="/images/hero-premium.jpg"
        src={heroImage.desktop}
        sizes="100vw"
        width={1376}
        height={768}
        alt={heroImage.alt}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        className="hero-background-image"
        data-testid="hero-photograph"
      />
      <div className="hero-photograph-shade" aria-hidden="true" />

      <div className="ui-container hero-content">
        <div className="hero-main">
          <div className="hero-search-intro">
            <p className="hero-eyebrow"><span aria-hidden="true" />{t("Pakistan’s Premium Property Marketplace")}</p>
            <h1 id="hero-heading" className="hero-headline" aria-label={t("Find Your Dream Property in Pakistan")}>
              <span className="hero-headline-desktop">{headline}</span>
              <span className="hero-headline-mobile">{headline}</span>
            </h1>
            <p className="hero-description hero-description-desktop">
              {t("Buy, rent or invest across Pakistan.")}
            </p>
            <p className="hero-description hero-description-mobile">
              {t("Buy, rent or invest across Pakistan.")}
            </p>
            <div className="hero-actions hero-actions-desktop">
              <Link href="#featured" className="btn btn-green">{t("Explore Properties")}<IconArrowRight className="h-4 w-4" /></Link>
              <Link href="/projects" className="btn btn-ghost-light">{t("Browse New Projects")}</Link>
            </div>
            <a className="hero-credit" href={SITE.companyUrl} target="_blank" rel="noreferrer noopener">
              {t("Official platform by WordbitX Software Company")}
            </a>
          </div>

          <aside className="hero-owner-card" aria-labelledby="hero-owner-heading">
            <p className="hero-owner-eyebrow"><IconKey className="h-4 w-4" />{t("For property owners")}</p>
            <h2 id="hero-owner-heading">{t("Have a property to sell or rent?")}</h2>
            <p className="hero-owner-copy">
              {t("List it on Properties Pak and reach thousands of buyers and tenants across Pakistan.")}
            </p>
            <ul className="hero-owner-benefits">
              <li>
                <span className="hero-owner-check" aria-hidden="true">✓</span>
                <span>{t("Free listing")}</span>
              </li>
              <li>
                <span className="hero-owner-check" aria-hidden="true">✓</span>
                <span>{t("No hidden charges")}</span>
              </li>
              <li>
                <span className="hero-owner-check" aria-hidden="true">✓</span>
                <span>{t("Reach more buyers and tenants at home and abroad.")}</span>
              </li>
            </ul>
            <div className="hero-owner-actions">
              <Link href="/list-property" className="btn btn-green">
                {t("List Your Property for Free")}<IconArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/contact" className="hero-owner-contact">
                {t("Need help selling or renting? Contact us")}<IconArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </aside>
        </div>

        <div className="home-search-wrap" id="property-search" data-testid="hero-search">
          <SearchPanel />
        </div>
      </div>
    </section>
  );
}
