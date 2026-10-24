import type { Metadata } from "next";
import { MobilePostAdSamples } from "@/components/mobile-post-ad-samples";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Mobile "+" Post Property UI/UX Samples — ${SITE.name}`,
  description:
    "Interactive mobile UI/UX samples for posting a property ad after tapping the '+' button on Properties Pak.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SamplesPage() {
  return <MobilePostAdSamples />;
}
