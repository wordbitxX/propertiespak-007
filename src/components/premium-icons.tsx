/**
 * Premium duotone icons for the "Explore more on Properties Pak" cards.
 * Line art uses currentColor; the soft accent fill uses var(--icon-accent).
 */
type IconProps = { className?: string };
const base = { viewBox: "0 0 32 32", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const accent = { fill: "var(--icon-accent, #DFB872)", stroke: "none" } as const;
const gold = { stroke: "var(--icon-accent, #DFB872)" } as const;

export function PremiumNewProjects({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <rect x="6" y="12" width="9" height="15" rx="1.2" {...accent} opacity=".57" />
      <path d="M4 27h24M7 27V12h8v15M17 27V7h9v20" />
      <path d="M10 16h2M10 20h2M20 11h3M20 15h3M20 19h3M20 23h3" {...gold} />
      <path d="M21 7V4M26 4h-9" />
    </svg>
  );
}
export function PremiumConstruction({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M7 17a9 9 0 0 1 18 0" {...accent} opacity=".57" />
      <path d="M5 19h22M7 17a9 9 0 0 1 18 0" />
      <path d="M13 9.5V15M19 9.5V15M16 8v7" {...gold} />
      <rect x="6" y="22" width="9" height="5" rx="1" />
      <rect x="17" y="22" width="9" height="5" rx="1" />
    </svg>
  );
}
export function PremiumHomeLoan({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <circle cx="22" cy="21" r="6" {...accent} opacity=".60" />
      <path d="M4 15 14 7l10 8M7 13v13h7" />
      <circle cx="22" cy="21" r="6" />
      <path {...gold} d="M22 18v6M20.3 19.6c0-.9.8-1.4 1.7-1.4s1.8.4 1.8 1.3c0 1.9-3.5 1-3.5 2.9 0 .9.8 1.4 1.8 1.4s1.7-.5 1.7-1.4" />
    </svg>
  );
}
export function PremiumAreaGuide({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M4 8l7-3 10 3 7-3v19l-7 3-10-3-7 3z" {...accent} opacity=".47" />
      <path d="M4 8l7-3 10 3 7-3v19l-7 3-10-3-7 3zM11 5v19M21 8v19" />
      <circle cx="16" cy="15" r="2.6" {...gold} />
    </svg>
  );
}
export function PremiumPlotFinder({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <rect x="15" y="15" width="7" height="7" {...accent} opacity=".60" />
      <rect x="5" y="5" width="22" height="22" rx="2" />
      <path d="M5 15h22M15 5v22M22 15v12" />
      <path d="M10 9.5a2.5 2.5 0 1 1 0 .01M10 12v0" {...gold} />
    </svg>
  );
}
export function PremiumTrends({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M5 26l7-8 5 4 10-11v15z" {...accent} opacity=".52" />
      <path d="M5 26h22M5 26V6" />
      <path d="M5 22l7-8 5 4 10-11" />
      <path d="M22 7h5v5" {...gold} />
    </svg>
  );
}
export function PremiumCalculators({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <rect x="9" y="6" width="14" height="6" rx="1" {...accent} opacity=".60" />
      <rect x="6" y="3" width="20" height="26" rx="3" />
      <rect x="9" y="6" width="14" height="6" rx="1" {...gold} />
      <path d="M10.5 17h.01M16 17h.01M21.5 17h.01M10.5 21.5h.01M16 21.5h.01M21.5 21.5v4M10.5 25.5h.01M16 25.5h.01" strokeWidth="2.6" />
    </svg>
  );
}
export function PremiumCompare({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <rect x="17" y="8" width="11" height="17" rx="2" {...accent} opacity=".57" />
      <rect x="4" y="5" width="11" height="17" rx="2" />
      <rect x="17" y="8" width="11" height="17" rx="2" />
      <path d="M7 10h5M7 14h5M20 13h5M20 17h5M13 27l3 2 3-2" {...gold} />
    </svg>
  );
}
