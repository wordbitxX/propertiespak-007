"use client";

import { useState } from "react";
import { AgencyLogoMark } from "@/components/agency-logo-mark";

/**
 * One logo treatment for agencies everywhere on the site (homepage rail,
 * /dealers, dealer profiles, listing contact cards). An uploaded logo wins;
 * without one — or if it fails to load — the agency gets its deterministic
 * real-estate logo mark, so the same agency always shows the same logo.
 */
export function DealerLogo({
  name,
  logo,
  size = 88,
  className = "",
}: {
  name: string;
  logo?: string | null;
  size?: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(logo) && !failed;
  return (
    <span
      className={`agx-logo ${showImage ? "" : "agx-logo--mark"} ${className}`.trim()}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.32) }}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logo!} alt={`${name} logo`} loading="lazy" draggable={false} onError={() => setFailed(true)} />
      ) : (
        <AgencyLogoMark name={name} className="h-full w-full" />
      )}
    </span>
  );
}

