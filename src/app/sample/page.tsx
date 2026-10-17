import type { Metadata } from "next";
import { AgencySamplesShowcase } from "@/components/agency-samples-showcase";
import { HeroReplicaSample } from "@/components/hero-replica-sample";
import { HeroSamplesShowcase } from "@/components/hero-samples-showcase";
import { SITE } from "@/lib/constants";
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
      <section id="sample-10" className="pkr-sample" aria-label="Sample 10 — pakproperties.pk hero replica">
        <div className="pkr-sample-head">
          <b>Sample 10 · Hero replica</b>
          <span>Night villa background with a cream Buy / Rent / Sell search card, matching the reference screenshot.</span>
        </div>
        <HeroReplicaSample stats={heroStats} />
      </section>
      <AgencySamplesShowcase dealers={dealers} />
      <HeroSamplesShowcase />
    </>
  );
}
