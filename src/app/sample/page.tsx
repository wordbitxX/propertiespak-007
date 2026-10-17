import type { Metadata } from "next";
import { AgencySamplesShowcase } from "@/components/agency-samples-showcase";
import { LegacyHero } from "@/components/hero-legacy";
import { HeroSamplesShowcase } from "@/components/hero-samples-showcase";
import { SITE } from "@/lib/constants";
import { getDealerShowcase } from "@/lib/queries";

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
  const dealers = await getDealerShowcase(16);
  return (
    <>
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
