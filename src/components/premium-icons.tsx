/**
 * Premium icons for the "Explore more on Properties Pak" cards.
 *
 * One consistent set on a 24px grid: white line art (currentColor, 1.6 stroke)
 * with gold details and a soft gold fill (var(--icon-accent)). Every glyph is
 * built to read clearly at ~30px on the deep-green tiles.
 */
type IconProps = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;
/** Soft gold fill behind the line art. */
const wash = { fill: "var(--icon-accent, #DFBE78)", stroke: "none", opacity: 0.32 } as const;
/** Gold line detail. */
const gold = { stroke: "var(--icon-accent, #DFBE78)" } as const;
/** Solid gold shape. */
const solid = { fill: "var(--icon-accent, #DFBE78)", stroke: "none" } as const;

/** Tower crane beside a rising building. */
export function PremiumNewProjects({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <rect x="12" y="9.5" width="8" height="11.5" rx="1" {...wash} />
      <path d="M2.5 21h19" />
      <path d="M12 21V10.5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1V21" />
      <path d="M14.6 12.8h2.8M14.6 15.6h2.8M14.6 18.4h2.8" {...gold} />
      <path d="M6 21V4.2M3 4.2h13M6 2.3 3 4.2M6 2.3l9 1.9" />
      <path d="M13.5 4.2v2.6" {...gold} />
      <path d="M12.6 6.8h1.8l-.3 1.3h-1.2z" {...solid} />
    </svg>
  );
}

/** Safety helmet: construction cost estimate. */
export function PremiumConstruction({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M5 15.5C5 10.3 8.1 6.6 12 6.6s7 3.7 7 8.9z" {...wash} />
      <path d="M5 15.5C5 10.3 8.1 6.6 12 6.6s7 3.7 7 8.9" />
      <path d="M10.1 7.1v5.4M13.9 7.1v5.4" {...gold} />
      <rect x="2.8" y="15.5" width="18.4" height="3" rx="1.3" />
      <path d="M7 21.3h10" {...gold} />
    </svg>
  );
}

/** House with a percentage badge: home finance. */
export function PremiumHomeLoan({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <circle cx="17" cy="17" r="4.6" {...wash} />
      <path d="M2.8 11.3 11 4.8l8.2 6.5" />
      <path d="M5.2 9.7V20h6.3" />
      <path d="M8 13.4h2.4" {...gold} />
      <circle cx="17" cy="17" r="4.6" />
      <path d="m15.1 18.9 3.8-3.8" {...gold} />
      <path d="M15.4 15.4h.01M18.6 18.6h.01" {...gold} strokeWidth="2.2" />
    </svg>
  );
}

/** Folded map with a gold location pin. */
export function PremiumAreaGuide({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="m2.8 7 5.4-2.2 7.6 2.2 5.4-2.2v12.4l-5.4 2.2-7.6-2.2-5.4 2.2z" {...wash} />
      <path d="m2.8 7 5.4-2.2 7.6 2.2 5.4-2.2v12.4l-5.4 2.2-7.6-2.2-5.4 2.2zM8.2 4.8v12.4M15.8 7v12.4" />
      <path d="M12 16.2s-2.9-2.6-2.9-4.9a2.9 2.9 0 0 1 5.8 0c0 2.3-2.9 4.9-2.9 4.9z" {...solid} />
      <circle cx="12" cy="11.3" r="1" fill="#0d3b2a" stroke="none" />
    </svg>
  );
}

/** Plot layout under a magnifying glass. */
export function PremiumPlotFinder({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M4 2.6h4.5v5.9H2.6V4A1.4 1.4 0 0 1 4 2.6z" {...wash} />
      <path d="M14.4 10.6V4A1.4 1.4 0 0 0 13 2.6H4A1.4 1.4 0 0 0 2.6 4v9A1.4 1.4 0 0 0 4 14.4h6.6" />
      <path d="M2.6 8.5h11.8M8.5 2.6v11.8" />
      <circle cx="16" cy="16" r="4.3" {...gold} />
      <path d="M14.2 16h3.6M16 14.2v3.6" {...gold} strokeWidth="1.3" />
      <path d="m19.2 19.2 2.4 2.4" {...gold} strokeWidth="2.2" />
    </svg>
  );
}

/** Rising bars with an upward trend arrow. */
export function PremiumTrends({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <rect x="4.4" y="15" width="3.2" height="6" rx=".7" {...solid} opacity=".35" />
      <rect x="10.4" y="12" width="3.2" height="9" rx=".7" {...solid} opacity=".5" />
      <rect x="16.4" y="9" width="3.2" height="12" rx=".7" {...solid} opacity=".7" />
      <path d="M2.8 21h18.4" />
      <path d="m3.8 12.2 5-4.4 4 2.6 6.8-6.4" />
      <path d="M15.8 4h3.8v3.8" {...gold} strokeWidth="1.8" />
    </svg>
  );
}

/** Calculator with a gold display. */
export function PremiumCalculators({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <rect x="4.8" y="2.6" width="14.4" height="18.8" rx="2.6" />
      <rect x="7.6" y="5.2" width="8.8" height="4" rx=".9" {...solid} />
      <path d="M8.6 12.9h.01M12 12.9h.01M15.4 12.9h.01M8.6 16.2h.01M12 16.2h.01M8.6 19.1h.01M12 19.1h.01" strokeWidth="2.3" />
      <path d="M15.4 16.2v2.9" {...gold} strokeWidth="2.3" />
    </svg>
  );
}

/** Two listing cards with swap arrows. */
export function PremiumCompare({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <rect x="13.4" y="8" width="8" height="12" rx="1.5" {...wash} />
      <rect x="2.6" y="4" width="8" height="12" rx="1.5" />
      <rect x="13.4" y="8" width="8" height="12" rx="1.5" />
      <path d="M5 7.9h3.2M5 10.6h3.2M5 13.2h1.9M15.8 11.9H19M15.8 14.6H19M15.8 17.2h1.9" strokeWidth="1.4" />
      <path d="M11.8 5.4h4.4m-1.5-1.5 1.5 1.5-1.5 1.5M12.2 18.6H7.8m1.5-1.5-1.5 1.5 1.5 1.5" {...gold} />
    </svg>
  );
}
