import type { Metadata } from "next";
import { MobilePostAdSamples } from "@/components/mobile-post-ad-samples";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Mobile "+" Post Property UI/UX Samples — ${SITE.name}`,
  description:
    "Interactive mobile UI/UX samples for posting a property ad after tapping the '+' button on Properties Pak.",
  alternates: {
    canonical: `${SITE.url}/samples`,
    languages: { "en-PK": `${SITE.url}/samples`, "x-default": `${SITE.url}/samples` },
  },
  openGraph: { url: `${SITE.url}/samples` },
  robots: {
    index: false,
    follow: false,
  },
};

export default function SamplesPage() {
  return <MobilePostAdSamples />;
}
