import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  alternates: {
    canonical: `${SITE.url}/admin`,
    languages: { "en-PK": `${SITE.url}/admin`, "x-default": `${SITE.url}/admin` },
  },
  openGraph: { url: `${SITE.url}/admin` },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return children;
}
