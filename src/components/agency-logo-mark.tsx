/**
 * Deterministic real-estate style logo for agencies that have not uploaded one.
 * The agency name picks one of several marks (roof, skyline, house-key, twin
 * roofs, tower) and a brand palette, so every agency gets a distinct, stable logo.
 */

const PALETTES = [
  { bg: "#0D382A", ink: "#FFFFFF", accent: "#DFB872" }, // emerald + gold
  { bg: "#0F2A4A", ink: "#FFFFFF", accent: "#F2B544" }, // navy + amber
  { bg: "#7A1F2B", ink: "#FFFFFF", accent: "#F1C27D" }, // maroon + sand
  { bg: "#FFFFFF", ink: "#0D382A", accent: "#1F9D62" }, // white + green
  { bg: "#FFFFFF", ink: "#1B2B4B", accent: "#E0613A" }, // white + orange
  { bg: "#123B47", ink: "#FFFFFF", accent: "#5FD3B3" }, // teal
  { bg: "#2B2F36", ink: "#FFFFFF", accent: "#E9B949" }, // charcoal + gold
  { bg: "#FFFFFF", ink: "#5B2A86", accent: "#C79A2E" }, // white + purple
] as const;

function hash(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function initials(name: string) {
  const words = name.split(/[\s&,.-]+/).filter((word) => /[A-Za-z]/.test(word[0] ?? ""));
  return (words.slice(0, 2).map((word) => word[0]!.toUpperCase()).join("") || "PP").slice(0, 2);
}

/** Second word line: the agency's trade word ("ESTATE", "REALTY", "BUILDERS" …). */
function tagline(name: string) {
  const words = name.toUpperCase().split(/[\s&,.-]+/).filter(Boolean);
  const trade = ["ESTATE", "ESTATES", "REALTY", "REAL", "PROPERTIES", "PROPERTY", "BUILDERS", "HOMES", "CONSULTANTS", "CONSULTANCY", "MARKETING", "ASSOCIATES", "DEVELOPERS", "GROUP", "PARTNERS", "ADVISORS"];
  const found = words.find((word) => trade.includes(word));
  if (found === "REAL") return "REAL ESTATE";
  return (found ?? "REAL ESTATE").slice(0, 11);
}

function Mark({ variant, ink, accent }: { variant: number; ink: string; accent: string }) {
  switch (variant) {
    case 0: // roof chevron with chimney
      return (
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M26 44 L50 24 L74 44" stroke={accent} strokeWidth="5" />
          <path d="M64 30 V22 h6 v13" stroke={accent} strokeWidth="4" />
        </g>
      );
    case 1: // skyline
      return (
        <g fill={accent}>
          <rect x="30" y="30" width="10" height="16" rx="1" />
          <rect x="43" y="20" width="13" height="26" rx="1" />
          <rect x="59" y="26" width="11" height="20" rx="1" />
          <g fill={ink} opacity=".55">
            <rect x="46" y="24" width="3" height="3" /><rect x="50" y="24" width="3" height="3" />
            <rect x="46" y="30" width="3" height="3" /><rect x="50" y="30" width="3" height="3" />
            <rect x="46" y="36" width="3" height="3" /><rect x="50" y="36" width="3" height="3" />
          </g>
        </g>
      );
    case 2: // house with key-hole door
      return (
        <g>
          <path d="M30 34 L50 18 L70 34 V46 H30 Z" fill={accent} />
          <circle cx="50" cy="34" r="4" fill={ink} opacity=".9" />
          <path d="M48.5 36 h3 l1 7 h-5 z" fill={ink} opacity=".9" />
        </g>
      );
    case 3: // twin roofs
      return (
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 46 L40 28 L58 46" stroke={accent} strokeWidth="5" />
          <path d="M44 46 L60 30 L78 46" stroke={ink} strokeWidth="4" opacity=".85" />
        </g>
      );
    default: // tower with roof
      return (
        <g>
          <path d="M40 46 V28 L50 18 L60 28 V46 Z" fill={accent} />
          <g fill={ink} opacity=".6">
            <rect x="45" y="30" width="4" height="4" /><rect x="51" y="30" width="4" height="4" />
            <rect x="45" y="37" width="4" height="4" /><rect x="51" y="37" width="4" height="4" />
          </g>
          <path d="M28 46 H72" stroke={accent} strokeWidth="3" strokeLinecap="round" />
        </g>
      );
  }
}

export function AgencyLogoMark({ name, className = "" }: { name: string; className?: string }) {
  const h = hash(name.trim().toLowerCase());
  const palette = PALETTES[h % PALETTES.length];
  const variant = (h >>> 8) % 5;
  const mono = initials(name);
  const line = tagline(name);
  const light = palette.bg === "#FFFFFF";
  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label={`${name} logo`} xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill={palette.bg} />
      {light && <circle cx="50" cy="50" r="47" fill="none" stroke={palette.accent} strokeWidth="2" opacity=".55" />}
      <Mark variant={variant} ink={palette.ink} accent={palette.accent} />
      <text x="50" y="68" textAnchor="middle" fontFamily="'Plus Jakarta Sans', 'Helvetica Neue', Arial, sans-serif" fontWeight="800" fontSize="19" letterSpacing="1" fill={palette.ink}>
        {mono}
      </text>
      <text x="50" y="80" textAnchor="middle" fontFamily="'Plus Jakarta Sans', 'Helvetica Neue', Arial, sans-serif" fontWeight="700" fontSize={line.length > 8 ? 6.2 : 7} letterSpacing="1.4" fill={palette.accent}>
        {line}
      </text>
    </svg>
  );
}
