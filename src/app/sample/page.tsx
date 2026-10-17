import type { Metadata } from "next";
import { AgencySamplesShowcase } from "@/components/agency-samples-showcase";
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
      <AgencySamplesShowcase dealers={dealers} />
      <HeroSamplesShowcase />
    </>
  );
}
