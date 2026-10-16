"use client";

import { IconLogo, IconLogoMark } from "@/components/icons";
import { useLanguage } from "@/components/language-provider";
import { SITE } from "@/lib/constants";

/**
 * Official Properties Pak brand lockup across desktop header, mobile header,
 * mobile navigation drawer, and footer. Always preserves the space between
 * "Properties" and "Pak".
 */
export function BrandLockup({
  light = false,
  large = false,
  compact = false,
  adaptive = false,
  transparent = false,
}: {
  light?: boolean;
  large?: boolean;
  compact?: boolean;
  adaptive?: boolean;
  transparent?: boolean;
}) {
  const { t } = useLanguage();
  if (adaptive) {
    return (
      <span className={`brand-lockup brand-lockup--adaptive ${compact ? "brand-lockup--compact" : ""} ${large ? "brand-lockup--large" : ""}`}>
        <IconLogoMark className="brand-lockup-mark brand-lockup-mark--bare" />
        <IconLogoMark className="brand-lockup-mark brand-lockup-mark--tile" />
        <span className="min-w-0">
          <span className="brand-lockup-name">
            Properties{" "}
            <span className="brand-lockup-accent">Pak</span>
          </span>
          <span className="brand-lockup-tagline">{t(SITE.tagline)}</span>
        </span>
      </span>
    );
  }
  const Logo = transparent ? IconLogoMark : IconLogo;
  return (
    <span className={`brand-lockup ${compact ? "brand-lockup--compact" : ""} ${large ? "brand-lockup--large" : ""}`}>
      <Logo className="brand-lockup-mark" />
      <span className="min-w-0">
        <span className={`brand-lockup-name ${light ? "text-white" : "text-navy-900"}`}>
          Properties{" "}
          <span className={light ? "text-[#10A456]" : "text-forest-700"}>Pak</span>
        </span>
        <span className={`brand-lockup-tagline ${light ? "text-white/70" : "text-ink-muted"}`}>{t(SITE.tagline)}</span>
      </span>
    </span>
  );
}
