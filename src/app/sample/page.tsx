import type { Metadata } from "next";
import { AgencySamplesShowcase } from "@/components/agency-samples-showcase";
import { Hero } from "@/components/hero";
import { LegacyHero } from "@/components/hero-legacy";
import { HeroSamplesShowcase } from "@/components/hero-samples-showcase";
import { SITE } from "@/lib/constants";
import { DHA_SOCIETY_MAPS, DEEP_ZOOM_MAPS } from "@/lib/map-library";
import { getDealerShowcase, getHeroStats } from "@/lib/queries";

export const metadata: Metadata = {
  title: `Design Samples — Platinum Agency & Hero — ${SITE.name}`,
  description:
    "Compare Platinum Agency section samples (dhaplus-style registered agencies and premium variations) and the Hero Section design samples.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function SamplePage() {
  const [dealers, heroStats] = await Promise.all([getDealerShowcase(16), getHeroStats()]);
  return (
    <>
      <section
        id="current-hero-twilight"
        className="pkr-sample legacy-hero-sample"
        aria-label="Current homepage hero with the twilight villa image"
      >
        <div className="pkr-sample-head">
          <b>Current homepage hero — live layout, new image</b>
          <span>
            The exact hero running on the homepage today (search panel, stats, owner card) with the Twilight Villa
            &amp; city-mountains photograph.
          </span>
        </div>
        <div className="home-page">
          <Hero
            photo="twilight"
            stats={{ ...heroStats, maps: DHA_SOCIETY_MAPS.length + DEEP_ZOOM_MAPS.length }}
          />
        </div>
      </section>
      <section id="previous-hero" className="pkr-sample legacy-hero-sample" aria-label="Previous homepage hero">
        <div className="pkr-sample-head">
          <b>Previous homepage hero</b>
          <span>Lahore golden-hour skyline (Sample 04 · Emerald Luxe) — kept here in case we switch back.</span>
        </div>
        <div className="home-page">
          <LegacyHero />
        </div>
      </section>
      <AgencySamplesShowcase dealers={dealers} />
      <HeroSamplesShowcase />
    </>
  );
}
