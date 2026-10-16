import type { Metadata } from "next";
import { HeroSamplesShowcase } from "@/components/hero-samples-showcase";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Hero Section Samples (10 Variations) — ${SITE.name}`,
  description:
    "Compare 10 Hero Section design samples: 5 featuring the Lahore Skyline at Golden Hour and 5 featuring the Sunset Villa overlooking Islamabad.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SamplePage() {
  return <HeroSamplesShowcase />;
}
