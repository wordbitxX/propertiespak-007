"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  SOCIETY_MAP_CATEGORIES,
  SOCIETY_MAP_CITIES,
  SOCIETY_PDF_MAPS,
  type SocietyMapCategory,
  type SocietyMapCity,
  type SocietyPdfMap,
} from "@/lib/society-pdf-maps";
import { SOCIETY_MAPS } from "@/lib/society-maps";
import { formatArea, formatPriceShort } from "@/lib/format";
import { pinColorFor, type MapProperty } from "@/components/map-view";
import { ResilientImage } from "@/components/resilient-image";
import {
  IconArrowRight,
  IconMap,
  IconPin,
  IconSearch,
  IconShield,
  IconSpark,
} from "@/components/icons";

const LeafletMap = dynamic(
  () => import("@/components/leaflet-map").then((mod) => mod.LeafletMap),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-[420px] place-items-center rounded-xl border border-white/10 bg-[#071E16] text-sm text-white/75 sm:h-[520px]">
        Loading interactive satellite plot-grid map…
      </div>
    ),
  },
);

type BrandIdentity = {
  monogram: string;
  authority: string;
  accentFrom: string;
  accentTo: string;
  badgeBg: string;
  badgeText: string;
  badgeRing: string;
  kind: "dha" | "bahria" | "smart" | "lda" | "lakecity" | "parkview" | "etihad" | "alkabir" | "premier";
};

function getSocietyBrandIdentity(map: SocietyPdfMap): BrandIdentity {
  const s = `${map.society} ${map.title} ${map.category}`.toLowerCase();
  if (s.includes("dha") || map.category === "DHA (Defence)") {
    return {
      monogram: "DHA",
      authority: "Defence Housing Authority",
      accentFrom: "#0B3224",
      accentTo: "#DFB872",
      badgeBg: "linear-gradient(135deg, #072218 0%, #0F4632 100%)",
      badgeText: "#F3D590",
      badgeRing: "rgba(223, 184, 114, 0.55)",
      kind: "dha",
    };
  }
  if (s.includes("bahria") || map.category === "Bahria Town") {
    return {
      monogram: s.includes("orchard") ? "BO" : s.includes("enclave") ? "BE" : "BT",
      authority: "Bahria Town Master Community",
      accentFrom: "#14294B",
      accentTo: "#DFB872",
      badgeBg: "linear-gradient(135deg, #0E2240 0%, #1B3E6F 100%)",
      badgeText: "#F3D590",
      badgeRing: "rgba(223, 184, 114, 0.55)",
      kind: "bahria",
    };
  }
  if (s.includes("smart city") || map.category === "Smart Cities") {
    return {
      monogram: s.includes("capital") ? "CSC" : "LSC",
      authority: "Smart City Master Plan",
      accentFrom: "#0A3A4A",
      accentTo: "#34D399",
      badgeBg: "linear-gradient(135deg, #082F3D 0%, #0E5668 100%)",
      badgeText: "#6EE7B7",
      badgeRing: "rgba(52, 211, 153, 0.5)",
      kind: "smart",
    };
  }
  if (s.includes("lda") || s.includes("division") || map.category === "Master Plans & LDA") {
    return {
      monogram: "LDA",
      authority: "Lahore Development Authority",
      accentFrom: "#1A3826",
      accentTo: "#D4A85D",
      badgeBg: "linear-gradient(135deg, #122B1D 0%, #1F4D33 100%)",
      badgeText: "#F3D590",
      badgeRing: "rgba(212, 168, 93, 0.55)",
      kind: "lda",
    };
  }
  if (s.includes("lake city")) {
    return {
      monogram: "LC",
      authority: "Lake City Holdings",
      accentFrom: "#0C3547",
      accentTo: "#E2BC76",
      badgeBg: "linear-gradient(135deg, #0A2B3A 0%, #145068 100%)",
      badgeText: "#F3D590",
      badgeRing: "rgba(226, 188, 118, 0.55)",
      kind: "lakecity",
    };
  }
  if (s.includes("park view")) {
    return {
      monogram: "PVC",
      authority: "Vision Group · Park View",
      accentFrom: "#0D3B2A",
      accentTo: "#E2BC76",
      badgeBg: "linear-gradient(135deg, #092B1E 0%, #14533B 100%)",
      badgeText: "#F3D590",
      badgeRing: "rgba(226, 188, 118, 0.55)",
      kind: "parkview",
    };
  }
  if (s.includes("etihad")) {
    return {
      monogram: "ET",
      authority: "Etihad Group Developments",
      accentFrom: "#2B2212",
      accentTo: "#DFB872",
      badgeBg: "linear-gradient(135deg, #1E170B 0%, #3E3018 100%)",
      badgeText: "#F3D590",
      badgeRing: "rgba(223, 184, 114, 0.55)",
      kind: "etihad",
    };
  }
  if (s.includes("al kabir") || s.includes("kings town") || s.includes("maryam")) {
    return {
      monogram: "AKT",
      authority: "Al Kabir Developers",
      accentFrom: "#1E293B",
      accentTo: "#DFB872",
      badgeBg: "linear-gradient(135deg, #0F172A 0%, #26354D 100%)",
      badgeText: "#F3D590",
      badgeRing: "rgba(223, 184, 114, 0.55)",
      kind: "alkabir",
    };
  }
  const words = map.society.replace(/[^a-zA-Z0-9 ]/g, "").split(/\s+/).filter(Boolean);
  const initials =
    words.length >= 2
      ? `${words[0][0]}${words[1][0]}`.toUpperCase()
      : map.society.slice(0, 3).toUpperCase();
  return {
    monogram: initials,
    authority: `${map.society} Official Layout`,
    accentFrom: "#0B3224",
    accentTo: "#DFB872",
    badgeBg: "linear-gradient(135deg, #08241A 0%, #124A36 100%)",
    badgeText: "#F3D590",
    badgeRing: "rgba(223, 184, 114, 0.5)",
    kind: "premier",
  };
}

/**
 * Large semi-transparent architectural/heraldic society watermark logo rendered
 * in the right background of each PDF map card.
 */
function SocietyWatermarkLogo({ brand }: { brand: BrandIdentity }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -right-4 -top-3 z-0 h-40 w-40 select-none text-[#0B3224] opacity-[0.075] transition-all duration-300 group-hover:scale-105 group-hover:-rotate-3 group-hover:opacity-[0.14]"
    >
      <svg viewBox="0 0 120 120" className="h-full w-full" fill="none">
        {/* Outer Heraldic Double Seal Ring */}
        <circle cx="60" cy="60" r="54" stroke="currentColor" strokeWidth="2.2" strokeDasharray="4 3" />
        <circle cx="60" cy="60" r="47" stroke="currentColor" strokeWidth="1.6" />

        {brand.kind === "dha" && (
          <>
            {/* DHA Heraldic Shield, Crown Stars & Laurel Crest */}
            <path
              d="M60 18 90 30v26c0 22-13.5 36.5-30 44-16.5-7.5-30-22-30-44V30l30-12Z"
              stroke="currentColor"
              strokeWidth="2.8"
              fill="currentColor"
              fillOpacity="0.08"
            />
            <path d="M60 25 82 34v21c0 16.5-10 27.5-22 33.5-12-6-22-17-22-33.5V34l22-9Z" stroke="currentColor" strokeWidth="1.4" />
            {/* 3 Defence Stars */}
            <polygon points="60,31 62,36 67,36 63,39 64.5,44 60,41 55.5,44 57,39 53,36 58,36" fill="currentColor" />
            <polygon points="46,37 47.5,41 51.5,41 48.5,43.5 49.5,47.5 46,45 42.5,47.5 43.5,43.5 40.5,41 44.5,41" fill="currentColor" />
            <polygon points="74,37 75.5,41 79.5,41 76.5,43.5 77.5,47.5 74,45 70.5,47.5 71.5,43.5 68.5,41 72.5,41" fill="currentColor" />
          </>
        )}

        {brand.kind === "bahria" && (
          <>
            {/* Bahria Town Grand Archway & Royal Crown Emblem */}
            <path
              d="M30 84V46l30-18 30 18v38H74V60c0-8-6-14-14-14s-14 6-14 14v24H30Z"
              stroke="currentColor"
              strokeWidth="2.6"
              fill="currentColor"
              fillOpacity="0.08"
            />
            <path d="M44 34 52 24l8 7 8-7 8 10H44Z" stroke="currentColor" strokeWidth="2.2" fill="currentColor" fillOpacity="0.16" />
            <line x1="24" y1="84" x2="96" y2="84" stroke="currentColor" strokeWidth="2.8" />
          </>
        )}

        {brand.kind === "smart" && (
          <>
            {/* Smart City Globe Grid & Connected Skyline */}
            <ellipse cx="60" cy="60" rx="34" ry="34" stroke="currentColor" strokeWidth="2.2" />
            <ellipse cx="60" cy="60" rx="18" ry="34" stroke="currentColor" strokeWidth="1.6" />
            <line x1="26" y1="60" x2="94" y2="60" stroke="currentColor" strokeWidth="1.6" />
            <line x1="31" y1="44" x2="89" y2="44" stroke="currentColor" strokeWidth="1.3" />
            <line x1="31" y1="76" x2="89" y2="76" stroke="currentColor" strokeWidth="1.3" />
          </>
        )}

        {brand.kind === "lda" && (
          <>
            {/* LDA State Dome & Civic Columns */}
            <path d="M34 46c0-13 11.6-22 26-22s26 9 26 22H34Z" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.1" />
            <line x1="60" y1="16" x2="60" y2="24" stroke="currentColor" strokeWidth="2.5" />
            <rect x="38" y="46" width="8" height="34" stroke="currentColor" strokeWidth="2" />
            <rect x="56" y="46" width="8" height="34" stroke="currentColor" strokeWidth="2" />
            <rect x="74" y="46" width="8" height="34" stroke="currentColor" strokeWidth="2" />
            <line x1="28" y1="82" x2="92" y2="82" stroke="currentColor" strokeWidth="3" />
          </>
        )}

        {(brand.kind === "lakecity" ||
          brand.kind === "parkview" ||
          brand.kind === "etihad" ||
          brand.kind === "alkabir" ||
          brand.kind === "premier") && (
          <>
            {/* Luxury Architectural Crest & Compass Rose */}
            <polygon
              points="60,20 88,36 88,74 60,96 32,74 32,36"
              stroke="currentColor"
              strokeWidth="2.5"
              fill="currentColor"
              fillOpacity="0.07"
            />
            <path d="M40 52 60 36l20 16v24H40V52Z" stroke="currentColor" strokeWidth="2" />
            <path d="M36 82c8-4 16 4 24 0s16 4 24 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </>
        )}

        {/* Bold Monogram Stamp */}
        <rect x="33" y="54" width="54" height="22" rx="6" fill="currentColor" fillOpacity="0.14" />
        <text
          x="60"
          y="69"
          textAnchor="middle"
          fill="currentColor"
          fontSize="14.5"
          fontWeight="900"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="1.5"
        >
          {brand.monogram}
        </text>
      </svg>
    </div>
  );
}

/**
 * Crisp emblem avatar badge rendered at the top-left of every society PDF map card.
 */
function SocietyCrestBadge({ brand }: { brand: BrandIdentity }) {
  return (
    <div
      className="relative grid h-12 w-12 shrink-0 place-items-center rounded-xl shadow-md transition-transform duration-200 group-hover:scale-105"
      style={{
        background: brand.badgeBg,
        color: brand.badgeText,
        boxShadow: `inset 0 0 0 1.5px ${brand.badgeRing}, 0 8px 18px -8px rgba(7, 31, 23, 0.45)`,
      }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 44 44" className="h-10 w-10" fill="none">
        <circle cx="22" cy="22" r="19" stroke="currentColor" strokeOpacity="0.32" strokeWidth="1" strokeDasharray="2 2" />
        <path
          d="M22 5 35 10.5v11.5c0 9.4-5.7 15.6-13 19-7.3-3.4-13-9.6-13-19V10.5L22 5Z"
          stroke="currentColor"
          strokeOpacity="0.65"
          strokeWidth="1.3"
          fill="currentColor"
          fillOpacity="0.1"
        />
        <text
          x="22"
          y="25.5"
          textAnchor="middle"
          fill="currentColor"
          fontSize={brand.monogram.length >= 3 ? "9.5" : "11"}
          fontWeight="900"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="0.6"
        >
          {brand.monogram}
        </text>
      </svg>
    </div>
  );
}

export function MapsExplorer({
  initialProperties = [],
}: {
  initialProperties?: MapProperty[];
}) {
  const [query, setQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<"all" | SocietyMapCity>("all");
  const [selectedCategory, setSelectedCategory] = useState<"all" | SocietyMapCategory>("all");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [previewMap, setPreviewMap] = useState<SocietyPdfMap | null>(null);
  const [activeLiveSlug, setActiveLiveSlug] = useState<string>("phase-6-lahore");
  const [allProperties, setAllProperties] = useState<MapProperty[]>(initialProperties);
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
  const [focusOverride, setFocusOverride] = useState<{
    slug: string;
    lat: number;
    lng: number;
    zoom: number;
  } | null>(null);

  useEffect(() => {
    if (initialProperties.length > 0) return;
    let cancelled = false;
    void fetch("/api/properties?view=map")
      .then((res) => res.json())
      .then((data: { ok?: boolean; items?: MapProperty[] }) => {
        if (!cancelled && data.ok && Array.isArray(data.items)) {
          setAllProperties(data.items);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [initialProperties.length]);

  const activeLiveSociety = useMemo(
    () => SOCIETY_MAPS.find((s) => s.slug === activeLiveSlug) ?? SOCIETY_MAPS[0],
    [activeLiveSlug],
  );

  const liveCenter = useMemo(() => {
    if (focusOverride && focusOverride.slug === activeLiveSociety.slug) {
      return { lat: focusOverride.lat, lng: focusOverride.lng, zoom: focusOverride.zoom };
    }
    const firstLayer = activeLiveSociety?.layers[0];
    if (!firstLayer) return { lat: 31.4697, lng: 74.4484, zoom: 14 };
    const [north, east, south, west] = firstLayer.bounds;
    return {
      lat: (north + south) / 2,
      lng: (east + west) / 2,
      zoom: 14,
    };
  }, [activeLiveSociety, focusOverride]);

  /**
   * Properties located in the active society's city/area so listed properties
   * appear directly marked on the Live Society Plot-Grid Map.
   */
  const societyAreaProperties = useMemo(() => {
    const citySlug = activeLiveSociety.citySlug.toLowerCase();
    const firstLayer = activeLiveSociety.layers[0];
    const [n, e, s, w] = firstLayer ? firstLayer.bounds : [31.55, 74.55, 31.35, 74.35];
    const south = Math.min(n, s);
    const north = Math.max(n, s);
    const west = Math.min(e, w);
    const east = Math.max(e, w);

    const inCity = allProperties.filter(
      (p) =>
        (p.citySlug && p.citySlug.toLowerCase() === citySlug) ||
        p.cityName.toLowerCase() === citySlug,
    );

    const pool = inCity.length > 0 ? inCity : allProperties;

    // Sort so properties inside or closest to the active society phase appear first
    const centerLat = (north + south) / 2;
    const centerLng = (east + west) / 2;
    return [...pool].sort((a, b) => {
      const aMatch = activeLiveSociety.match.test(a.locationArea) ? 0 : 1;
      const bMatch = activeLiveSociety.match.test(b.locationArea) ? 0 : 1;
      if (aMatch !== bMatch) return aMatch - bMatch;
      const dA = Math.hypot(a.lat - centerLat, a.lng - centerLng);
      const dB = Math.hypot(b.lat - centerLat, b.lng - centerLng);
      return dA - dB;
    });
  }, [allProperties, activeLiveSociety]);

  const livePins = useMemo(
    () =>
      societyAreaProperties.map((property) => ({
        id: property.id,
        lat: property.lat,
        lng: property.lng,
        title: property.title,
        subtitle: `${formatArea(property.areaValue, property.areaUnit)} ${property.propertyType} · ${property.locationArea}, ${property.cityName}`,
        href: `/property/${property.slug}`,
        price: formatPriceShort(property.price, property.priceUnit),
        image: property.coverImage,
        color: pinColorFor(property.propertyType),
        active: property.id === selectedPropertyId,
      })),
    [societyAreaProperties, selectedPropertyId],
  );

  const cityCounts = useMemo(() => {
    const counts: Record<string, number> = { all: SOCIETY_PDF_MAPS.length };
    for (const city of SOCIETY_MAP_CITIES) {
      counts[city] = SOCIETY_PDF_MAPS.filter((m) => m.city === city).length;
    }
    return counts;
  }, []);

  const filteredMaps = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SOCIETY_PDF_MAPS.filter((item) => {
      if (selectedCity !== "all" && item.city !== selectedCity) return false;
      if (selectedCategory !== "all" && item.category !== selectedCategory) return false;
      if (featuredOnly && !item.featured) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.society.toLowerCase().includes(q) ||
        item.city.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.phasesOrSectors.toLowerCase().includes(q)
      );
    });
  }, [query, selectedCity, selectedCategory, featuredOnly]);

  return (
    <div className="space-y-10">
      {/* 1. Interactive Satellite + Plot-Grid Map Viewer with Marked Listed Properties */}
      <div
        id="live-society-plot-map"
        className="overflow-hidden rounded-2xl border border-[#DFB872]/40 p-5 text-white shadow-[0_24px_54px_-22px_rgba(5,24,17,0.45)] sm:p-7"
        style={{
          background: "linear-gradient(135deg, #061D15 0%, #0B2E21 55%, #071E16 100%)",
        }}
      >
        <div className="flex flex-col gap-4 border-b border-white/12 pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="inline-flex items-center gap-1.5 text-[0.68rem] font-extrabold uppercase tracking-[0.2em] text-[#F3D590]">
                <IconMap className="h-3.5 w-3.5" />
                Interactive Google Satellite + Plot Number Overlay
              </p>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#4ADE80]/40 bg-[#22C55E]/15 px-2.5 py-0.5 text-[0.65rem] font-extrabold uppercase tracking-[0.12em] text-[#86EFAC]">
                <span className="h-2 w-2 rounded-full bg-[#4ADE80]" />
                {livePins.length} Listed Properties Marked on Map
              </span>
            </div>
            <h2 className="mt-1.5 font-sans text-[1.35rem] font-extrabold tracking-[-0.02em] text-white sm:text-[1.65rem]">
              Live Society Plot-Grid &amp; Property Map ({activeLiveSociety.name})
            </h2>
            <p className="mt-1 text-[0.84rem] text-white/78">
              Inspect exact plot numbers, sector boundaries, and{" "}
              <strong className="font-semibold text-[#F3D590]">
                live listed properties marked with price pins
              </strong>{" "}
              across {activeLiveSociety.name} and surrounding areas.
            </p>
          </div>
          <div className="w-full lg:w-[340px]">
            <label
              htmlFor="live-society-select"
              className="mb-1.5 block text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#F3D590]"
            >
              Switch Interactive Society Overlay ({SOCIETY_MAPS.length} Available)
            </label>
            <select
              id="live-society-select"
              value={activeLiveSlug}
              onChange={(e) => {
                setActiveLiveSlug(e.target.value);
                setSelectedPropertyId(null);
                setFocusOverride(null);
              }}
              className="h-11 w-full rounded-xl border border-[#DFB872]/45 bg-[#09281D] px-3.5 text-[0.84rem] font-bold text-white focus:border-[#F3D590] focus:outline-none"
            >
              {SOCIETY_MAPS.map((soc) => (
                <option key={soc.slug} value={soc.slug} className="bg-[#09281D] text-white">
                  {soc.name} ({soc.citySlug.toUpperCase()})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Pills for Popular Interactive Maps */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#F3D590]">
            Quick Jump:
          </span>
          {[
            { slug: "phase-6-lahore", label: "DHA Lahore Ph 6" },
            { slug: "phase-7-lahore", label: "DHA Lahore Ph 7" },
            { slug: "phase-8-lahore", label: "DHA Lahore Ph 8" },
            { slug: "phase-9-prism-lahore", label: "DHA Ph 9 Prism" },
            { slug: "phase-5-lahore", label: "DHA Lahore Ph 5" },
            { slug: "phase-2-islamabad", label: "DHA Islamabad Ph 2" },
            { slug: "phase-5-islamabad", label: "DHA Islamabad Ph 5" },
            { slug: "dha-defence-karachi", label: "DHA Karachi Ph 1–8" },
            { slug: "dha-multan-multan", label: "DHA Multan" },
            { slug: "dha-bahawalpur-bahawalpur", label: "DHA Bahawalpur" },
          ].map((item) => (
            <button
              key={item.slug}
              type="button"
              onClick={() => {
                setActiveLiveSlug(item.slug);
                setSelectedPropertyId(null);
                setFocusOverride(null);
              }}
              className={`rounded-full px-3 py-1 text-[0.73rem] font-bold transition ${
                activeLiveSlug === item.slug
                  ? "bg-gradient-to-r from-[#E2BC76] to-[#D4A85D] text-[#120D05]"
                  : "border border-white/15 bg-white/8 text-white/85 hover:border-[#F3D590]/50 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Interactive Satellite + Plot Grid + Property Pins Map */}
        <div className="mt-4 overflow-hidden rounded-xl border border-white/15">
          <LeafletMap
            key={activeLiveSociety.slug}
            center={{ lat: liveCenter.lat, lng: liveCenter.lng }}
            zoom={liveCenter.zoom}
            heightClass="h-[440px] sm:h-[540px]"
            allowFullscreen
            pins={livePins}
            autoOpenActive
            society={activeLiveSociety}
            onPinSelect={(id) => setSelectedPropertyId(Number(id))}
            header={{
              label: "Interactive Plot-Grid & Property Map",
              title: activeLiveSociety.name,
              subtitle: `${livePins.length} properties marked · ${activeLiveSociety.layers.length} sector plot overlay(s)`,
            }}
          />
        </div>

        {/* Listed Properties in This Society / City Strip */}
        {societyAreaProperties.length > 0 && (
          <div className="mt-5 rounded-xl border border-white/12 bg-white/[0.05] p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#4ADE80] shadow-[0_0_8px_#4ADE80]" />
                <p className="text-[0.76rem] font-extrabold uppercase tracking-[0.14em] text-[#F3D590]">
                  Listed Properties Marked in {activeLiveSociety.citySlug.toUpperCase()} &amp;{" "}
                  {activeLiveSociety.name} ({societyAreaProperties.length})
                </p>
              </div>
              <Link
                href={`/city/${activeLiveSociety.citySlug}`}
                className="inline-flex items-center gap-1 text-[0.75rem] font-bold text-[#F3D590] hover:underline"
              >
                View all {activeLiveSociety.citySlug} listings
                <IconArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-1.5 pt-1">
              {societyAreaProperties.slice(0, 12).map((prop) => {
                const isSelected = prop.id === selectedPropertyId;
                return (
                  <div
                    key={prop.id}
                    className={`flex w-[275px] shrink-0 flex-col justify-between rounded-xl border p-2.5 transition ${
                      isSelected
                        ? "border-[#F3D590] bg-[#0F3D2B] shadow-md"
                        : "border-white/12 bg-[#082419]/90 hover:border-[#DFB872]/50"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <ResilientImage
                        src={prop.coverImage || "/images/property-placeholder.svg"}
                        alt={prop.title}
                        width={96}
                        height={72}
                        loading="lazy"
                        className="h-14 w-18 shrink-0 rounded-lg object-cover ring-1 ring-white/15"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-sans text-[0.82rem] font-extrabold text-[#F3D590]">
                          PKR {formatPriceShort(prop.price, prop.priceUnit)}
                        </p>
                        <Link
                          href={`/property/${prop.slug}`}
                          className="mt-0.5 line-clamp-1 block text-[0.78rem] font-bold text-white hover:text-[#F3D590]"
                        >
                          {prop.title}
                        </Link>
                        <p className="mt-0.5 truncate text-[0.7rem] text-white/70">
                          {prop.locationArea}, {prop.cityName}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-2">
                      <span className="text-[0.68rem] font-semibold text-white/75">
                        {formatArea(prop.areaValue, prop.areaUnit)} · {prop.propertyType}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPropertyId(prop.id);
                          setFocusOverride({
                            slug: activeLiveSociety.slug,
                            lat: prop.lat,
                            lng: prop.lng,
                            zoom: 15,
                          });
                        }}
                        className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-[#E2BC76] to-[#D4A85D] px-2.5 py-1 text-[0.68rem] font-extrabold text-[#120D05] transition hover:brightness-105"
                      >
                        <IconPin className="h-3 w-3" />
                        Locate on Map
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 2. Filter & Search Control Panel for 57 PDF Maps */}
      <div className="overflow-hidden rounded-2xl border border-[#D8C7A0]/55 bg-white shadow-[0_22px_50px_-24px_rgba(7,31,23,0.16)]">
        <div
          className="border-b border-[#DFB872]/25 px-5 py-5 sm:px-7"
          style={{
            background: "linear-gradient(135deg, #061D15 0%, #0C3124 58%, #071F17 100%)",
          }}
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="inline-flex items-center gap-1.5 text-[0.68rem] font-extrabold uppercase tracking-[0.2em] text-[#F3D590]">
                <IconSpark className="h-3.5 w-3.5" />
                High-Resolution Society Maps Library ({SOCIETY_PDF_MAPS.length} Official PDFs)
              </p>
              <h2 className="mt-1 font-sans text-[1.25rem] font-extrabold tracking-[-0.02em] text-white sm:text-[1.45rem]">
                Download Official PDF Maps by City, Developer or Phase
              </h2>
            </div>

            {/* Search Input */}
            <div className="relative w-full lg:w-[390px]">
              <IconSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#F3D590]" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search DHA Phase 9 Prism, Bahria, LDA, Lake City..."
                aria-label="Search society PDF maps"
                className="h-11 w-full rounded-xl border border-[#DFB872]/40 bg-white/10 pl-10 pr-4 text-[0.84rem] font-medium text-white placeholder:text-white/60 focus:border-[#F3D590] focus:bg-white/15 focus:outline-none"
              />
            </div>
          </div>

          {/* City Filter Pills */}
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/10 pt-3">
            <span className="mr-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#F3D590]">
              City:
            </span>
            <button
              type="button"
              onClick={() => setSelectedCity("all")}
              className={`rounded-full px-3.5 py-1.5 text-[0.75rem] font-bold transition ${
                selectedCity === "all"
                  ? "bg-gradient-to-r from-[#E2BC76] to-[#D4A85D] text-[#120D05] shadow-sm"
                  : "border border-white/15 bg-white/8 text-white/85 hover:border-[#DFB872]/50 hover:text-white"
              }`}
            >
              All Cities ({cityCounts.all})
            </button>
            {SOCIETY_MAP_CITIES.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => setSelectedCity(city)}
                className={`rounded-full px-3.5 py-1.5 text-[0.75rem] font-semibold transition ${
                  selectedCity === city
                    ? "bg-gradient-to-r from-[#E2BC76] to-[#D4A85D] text-[#120D05] font-bold shadow-sm"
                    : "border border-white/15 bg-white/8 text-white/85 hover:border-[#DFB872]/50 hover:text-white"
                }`}
              >
                {city} ({cityCounts[city] ?? 0})
              </button>
            ))}
          </div>
        </div>

        {/* Category & Featured Sub-bar */}
        <div className="flex flex-col gap-3 bg-[#F6F3EB] px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-[0.68rem] font-extrabold uppercase tracking-[0.15em] text-[#5B6D63]">
              Developer / Authority:
            </span>
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`rounded-lg px-3 py-1.5 text-[0.74rem] font-bold transition ${
                selectedCategory === "all"
                  ? "bg-[#0B3224] text-[#F3D590]"
                  : "border border-[#DDE3DF] bg-white text-[#17362A] hover:border-[#DFB872]"
              }`}
            >
              All Societies
            </button>
            {SOCIETY_MAP_CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-lg px-3 py-1.5 text-[0.74rem] font-semibold transition ${
                  selectedCategory === category
                    ? "bg-[#0B3224] text-[#F3D590] font-bold"
                    : "border border-[#DDE3DF] bg-white text-[#17362A] hover:border-[#DFB872]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <button
              type="button"
              onClick={() => setFeaturedOnly((v) => !v)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[0.74rem] font-bold transition ${
                featuredOnly
                  ? "border-[#B8893D] bg-[#FBF7EE] text-[#9A6F2B]"
                  : "border-[#DDE3DF] bg-white text-[#355145] hover:border-[#DFB872]"
              }`}
            >
              <IconSpark className="h-3.5 w-3.5 text-[#B8893D]" />
              Major Master Plans Only
            </button>
            {(query || selectedCity !== "all" || selectedCategory !== "all" || featuredOnly) && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setSelectedCity("all");
                  setSelectedCategory("all");
                  setFeaturedOnly(false);
                }}
                className="text-[0.75rem] font-bold text-[#9A6F2B] underline-offset-4 hover:underline"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <p className="text-[0.88rem] font-semibold text-[#233E32]">
          Showing <span className="font-extrabold text-[#0B3224]">{filteredMaps.length}</span> of{" "}
          {SOCIETY_PDF_MAPS.length} downloadable high-resolution society PDF maps
        </p>
        <p className="inline-flex items-center gap-1.5 text-[0.78rem] font-medium text-[#52655B]">
          <IconShield className="h-4 w-4 text-[#0F5A3E]" />
          Official society emblems · Direct high-res PDF downloads · Plot numbers included
        </p>
      </div>

      {/* 3. Premium Society PDF Map Cards Grid with Transparent Watermark Logos */}
      {filteredMaps.length === 0 ? (
        <div className="rounded-2xl border border-[#DCE3DF] bg-white p-10 text-center">
          <p className="font-sans text-[1.1rem] font-bold text-[#0D281E]">
            No society map matched your current filter.
          </p>
          <p className="mt-1 text-[0.86rem] text-[#5B6D63]">
            Try clearing your search term or selecting &ldquo;All Cities&rdquo; to view all{" "}
            {SOCIETY_PDF_MAPS.length} PDF maps.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSelectedCity("all");
              setSelectedCategory("all");
              setFeaturedOnly(false);
            }}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#0B3224] px-4 py-2.5 text-[0.82rem] font-bold text-[#F3D590]"
          >
            Show all {SOCIETY_PDF_MAPS.length} maps
          </button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMaps.map((map) => {
            const brand = getSocietyBrandIdentity(map);
            return (
              <article
                key={map.id}
                id={map.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#D5DED8] bg-gradient-to-br from-white via-[#FCFBF8] to-[#F4F1E8] p-5 shadow-[0_14px_34px_-18px_rgba(7,31,23,0.18)] transition-all duration-250 hover:-translate-y-1 hover:border-[#DFB872] hover:shadow-[0_24px_48px_-18px_rgba(7,31,23,0.28)]"
              >
                {/* Top Metallic Accent Strip */}
                <span
                  aria-hidden="true"
                  className=" absolute inset-x-0 top-0 h-1.5"
                  style={{
                    background: `linear-gradient(90deg, ${brand.accentFrom} 0%, ${brand.accentTo} 50%, ${brand.accentFrom} 100%)`,
                  }}
                />

                {/* Subtle Blueprint Grid Overlay */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-[0.035]"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, #0B3224 1px, transparent 1px), linear-gradient(to bottom, #0B3224 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                />

                {/* Large Transparent Society Watermark Logo in Background */}
                <SocietyWatermarkLogo brand={brand} />

                <div className="relative z-10">
                  {/* Top Row: Society Crest Badge + City & Authority Pills */}
                  <div className="flex items-start justify-between gap-3 pt-1">
                    <div className="flex items-center gap-3">
                      <SocietyCrestBadge brand={brand} />
                      <div>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#0B3224] px-2.5 py-0.5 text-[0.63rem] font-extrabold uppercase tracking-[0.12em] text-[#F3D590]">
                          <IconPin className="h-2.5 w-2.5 text-[#F3D590]" />
                          {map.city}
                        </span>
                        <p className="mt-1 text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[#61746A]">
                          {brand.authority}
                        </p>
                      </div>
                    </div>

                    <span className="shrink-0 rounded-lg border border-[#E2D3B3] bg-[#FBF7EE]/90 px-2.5 py-1 text-[0.65rem] font-extrabold text-[#9A6F2B] shadow-2xs">
                      {map.category}
                    </span>
                  </div>

                  {/* Title & Society */}
                  <h3 className="mt-4 font-sans text-[1.05rem] font-extrabold leading-snug text-[#092218] transition-colors group-hover:text-[#0F4C35]">
                    {map.title}
                  </h3>

                  {/* Sector / Phase Detail Box */}
                  <div className="mt-2.5 rounded-xl border border-[#E2E8E4] bg-white/80 px-3 py-2 backdrop-blur-[2px]">
                    <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.12em] text-[#7A8B82]">
                      Phases &amp; Sectors Covered
                    </p>
                    <p className="mt-0.5 text-[0.79rem] font-semibold leading-relaxed text-[#2A3F35]">
                      {map.phasesOrSectors}
                    </p>
                  </div>
                </div>

                <div className="relative z-10 mt-5 border-t border-[#E3EAE5] pt-3.5">
                  <div className="mb-3 flex items-center justify-between text-[0.7rem] font-semibold text-[#5C6E64]">
                    <span className="inline-flex items-center gap-1.5 font-bold text-[#0F5A3E]">
                      <span className="h-2 w-2 rounded-full bg-[#18A96B]" />
                      {map.updatedTag}
                    </span>
                    <Link
                      href={`/city/${map.citySlug}`}
                      className="font-extrabold text-[#9A6F2B] hover:underline"
                    >
                      Properties in {map.city.split(" ")[0]} →
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setPreviewMap(map)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#0B3224]/25 bg-white px-3 py-2.5 text-[0.78rem] font-extrabold text-[#0B3224] shadow-2xs transition hover:border-[#0B3224] hover:bg-[#EDF3F0]"
                    >
                      <IconMap className="h-3.5 w-3.5 text-[#0F5A3E]" />
                      Preview Map
                    </button>
                    <a
                      href={map.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#0B3224] to-[#134E38] px-3 py-2.5 text-[0.78rem] font-extrabold text-[#F3D590] shadow-sm transition hover:from-[#0F4230] hover:to-[#186347]"
                    >
                      Download PDF
                      <IconArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Interactive PDF Preview Modal */}
      {previewMap && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={previewMap.title}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#04120D]/80 p-3 backdrop-blur-sm sm:p-6"
          onClick={() => setPreviewMap(null)}
        >
          <div
            className="flex h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-[#DFB872]/45 bg-[#071E16] text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/12 px-5 py-4">
              <div>
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#F3D590]">
                  {previewMap.city} · {previewMap.category}
                </p>
                <h3 className="font-sans text-[1.05rem] font-extrabold text-white sm:text-[1.2rem]">
                  {previewMap.title}
                </h3>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <Link
                  href={`/properties?q=${encodeURIComponent(previewMap.society)}`}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 text-[0.78rem] font-bold text-white transition hover:border-[#F3D590] hover:text-[#F3D590]"
                >
                  View Society Listings
                </Link>
                <a
                  href={previewMap.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#E2BC76] to-[#D4A85D] px-4 py-2 text-[0.78rem] font-extrabold text-[#120D05]"
                >
                  Open / Download Full PDF
                  <IconArrowRight className="h-3.5 w-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewMap(null)}
                  className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-[0.78rem] font-bold text-white/85 hover:bg-white/20"
                >
                  Close ✕
                </button>
              </div>
            </div>

            <div className="relative flex-1 bg-[#0C261D]">
              <iframe
                src={previewMap.pdfUrl}
                title={previewMap.title}
                className="h-full w-full border-0"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 bg-[#061A13] px-5 py-3 text-[0.76rem] text-white/75">
              <span>{previewMap.phasesOrSectors}</span>
              <span>
                If your browser blocks embedded PDFs, click{" "}
                <a
                  href={previewMap.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#F3D590] underline"
                >
                  Open / Download Full PDF
                </a>{" "}
                to view in full resolution.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
