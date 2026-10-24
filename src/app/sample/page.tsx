import type { Metadata } from "next";
import Link from "next/link";
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
      <div className="bg-[#08251C] px-4 py-4 pt-[calc(var(--site-header-height)+14px)] text-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#dfbe78]/35 bg-white/5 px-4 py-3.5">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#dfbe78]">New Mobile UX Lab</span>
            <p className="mt-0.5 text-sm font-semibold text-white">
              Looking for the Mobile &ldquo;+&rdquo; Post Property UI/UX Samples?
            </p>
          </div>
          <Link
            href="/samples"
            className="inline-flex min-h-[40px] items-center rounded-full bg-[#0e8255] px-4 text-xs font-bold text-white shadow-sm hover:bg-[#129965]"
          >
            Open /samples →
          </Link>
        </div>
      </div>
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
