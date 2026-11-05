import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SITE } from "@/lib/constants";

const canonical = `${SITE.url}/admin/login`;

export const metadata: Metadata = {
  alternates: {
    canonical,
    languages: { "en-PK": canonical, "x-default": canonical },
  },
  openGraph: { url: canonical },
};

export default function AdminLoginLayout({ children }: { children: ReactNode }) {
  return children;
}
