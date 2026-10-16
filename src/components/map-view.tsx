"use client";

import { ResilientImage } from "@/components/resilient-image";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useMemo, useRef, useState } from "react";
import { IconArrowRight, IconClose, IconMap, IconPin } from "@/components/icons";
import { useLanguage } from "@/components/language-provider";
import { formatArea, formatPrice, formatPriceShort } from "@/lib/format";
import { findSocietyMap, layersContaining, type SocietyMapDef } from "@/lib/society-maps";

const LeafletMap = dynamic(() => import("@/components/leaflet-map").then((module) => module.LeafletMap), {
  ssr: false,
  loading: () => (
    <div className="grid h-[380px] place-items-center rounded-xl border border-[#DFB872]/30 bg-[#071E16] text-sm font-medium text-white/80 sm:h-[500px]">
      Loading interactive satellite &amp; property map…
    </div>
  ),
});

export type MapProperty = {
  id: number; slug: string; title: string; cityName: string; locationArea: string;
  price: number; priceUnit: string; lat: number; lng: number; coverImage: string;
  propertyType: string; bedrooms: number; bathrooms: number; areaValue: number; areaUnit: string;
  citySlug?: string; distanceKm?: number;
};

/** Category colour coding for map pins (the selected pin always renders green). */
const APARTMENT_TYPE = /(apartment|penthouse|portion|studio|flat\b|room\b)/i;
const COMMERCIAL_TYPE = /(office|shop|warehouse|industrial|commercial|plaza|factory|building)/i;
const PLOT_TYPE = /\b(plot|file|agricultural)\b/i;
export function pinColorFor(propertyType: string): string {
  if (COMMERCIAL_TYPE.test(propertyType)) return "#d97706";
  if (APARTMENT_TYPE.test(propertyType)) return "#7c3aed";
  if (PLOT_TYPE.test(propertyType)) return "#0e7490";
  return "#0b3d2c";
}

/** Legend for the category colours, shown under multi-pin overview maps. */
function PinLegend() {
  const { t } = useLanguage();
  const items = [
    { color: "#0b3d2c", label: "Houses & villas" },
    { color: "#7c3aed", label: "Apartments" },
    { color: "#d97706", label: "Commercial" },
    { color: "#0e7490", label: "Plots" },
    { color: "#10a456", label: "Selected" },
  ];
  return (
    <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 rounded-xl border border-[#DCE4DF] bg-white/95 px-3.5 py-2 text-[0.73rem] font-semibold text-[#233E32] shadow-sm">
      {items.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-1.5">
          <svg viewBox="0 0 30 41" className="h-3.5 w-auto" aria-hidden="true">
            <path d="M15 0C6.7 0 0 6.7 0 15c0 10.6 15 26 15 26s15-15.4 15-26C30 6.7 23.3 0 15 0z" fill={item.color} />
            <circle cx="15" cy="15" r="6" fill="#fff" />
          </svg>
          {t(item.label)}
        </span>
      ))}
    </div>
  );
}

export function MapView({
  properties,
  center,
  zoom = 14,
  className = "",
  mapTitle,
  mapSubtitle,
  nearby = false,
  autoFit = false,
  fullScreen = false,
  societyOverride = null,
  onLocate,
}: {
  properties: MapProperty[];
  center: { lat: number; lng: number };
  zoom?: number;
  className?: string;
  mapTitle?: string;
  mapSubtitle?: string;
  nearby?: boolean;
  autoFit?: boolean;
  fullScreen?: boolean;
  societyOverride?: SocietyMapDef | null;
  onLocate?: (lat: number, lng: number, accuracy: number) => void;
}) {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<number | null>(
    nearby || fullScreen ? null : properties[0]?.id ?? null,
  );
  const listRef = useRef<HTMLUListElement | null>(null);
  const datasetKey = useMemo(
    () => properties.map((property) => `${property.id}:${property.lat}:${property.lng}`).join("|"),
    [properties],
  );
  const [focus, setFocus] = useState<{ key: string; lat: number; lng: number; zoom: number } | null>(null);
  const focused = focus?.key === datasetKey ? focus : null;
  const active = properties.find((property) => property.id === selected);
  const society = useMemo(() => {
    if (societyOverride) return societyOverride;
    if (!active) return null;
    const found = findSocietyMap(active.locationArea, active.citySlug);
    if (!found) return null;
    const containing = layersContaining(found, active.lat, active.lng);
    return containing.length > 0 && containing.length < found.layers.length
      ? { ...found, layers: containing }
      : found;
  }, [active, societyOverride]);

  const pins = useMemo(
    () =>
      properties.map((property) => ({
        id: property.id,
        lat: property.lat,
        lng: property.lng,
        title: property.title,
        subtitle: `${formatArea(property.areaValue, property.areaUnit)} ${property.propertyType} · ${property.locationArea}, ${property.cityName}`,
        href: `/property/${property.slug}`,
        price: formatPriceShort(property.price, property.priceUnit),
        image: property.coverImage,
        color: pinColorFor(property.propertyType),
        active: property.id === selected,
      })),
    [properties, selected],
  );

  return (
    <div
      className={`grid min-w-0 gap-4 lg:grid-cols-[minmax(0,2.25fr)_minmax(340px,1fr)] ${fullScreen ? "map-view-fullscreen" : ""} ${className}`}
      data-testid={nearby ? "nearby-property-map" : "property-market-map"}
    >
      <div className="map-view-canvas min-w-0">
        <LeafletMap
          center={focused ?? center}
          zoom={focused?.zoom ?? zoom}
          clusterPins={false}
          heightClass={
            fullScreen
              ? "h-[45dvh] min-h-[270px] lg:h-[calc(100dvh-236px)]"
              : "h-[420px] sm:h-[580px]"
          }
          allowFullscreen={!fullScreen}
          pins={pins}
          fitToPins={(nearby || autoFit) && !societyOverride && !focused}
          autoOpenActive
          society={society}
          header={
            fullScreen
              ? null
              : {
                  label: nearby ? "Nearby properties" : "Property map",
                  subtitle: mapSubtitle ?? active?.locationArea,
                  title: mapTitle,
                }
          }
          onPinSelect={(id) => setSelected(Number(id))}
          onLocate={onLocate}
        />
        {!nearby && properties.length > 1 && <PinLegend />}
        {active && !fullScreen && (
          <div className="mt-3 flex min-w-0 gap-3 rounded-xl border border-soft bg-white p-3 shadow-sm">
            <ResilientImage
              src={active.coverImage || "/images/property-placeholder.svg"}
              alt={active.title}
              width={160}
              height={120}
              loading="lazy"
              className="h-16 w-20 shrink-0 rounded-lg object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="font-sans text-[0.9375rem] font-bold text-navy-900">
                {formatPrice(active.price, propertyPriceUnit(active.priceUnit))}
              </p>
              <Link
                href={`/property/${active.slug}`}
                className="mt-1 block text-[0.8125rem] font-semibold leading-5 text-navy-900 hover:text-forest-700"
              >
                {active.title}
              </Link>
              <p className="mt-1 text-[0.75rem] text-ink-muted">
                {active.locationArea}, {active.cityName}
              </p>
            </div>
          </div>
        )}
      </div>

      <div
        className={`map-view-list flex h-full min-w-0 flex-col rounded-2xl border border-[#D8C7A0]/55 bg-white p-2.5 shadow-soft ${fullScreen ? "map-view-list--horizontal" : ""}`}
      >
        <div className="flex items-center justify-between gap-2 border-b border-[#EBEFE9] px-3 py-2.5">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#0B3224] text-[#F3D590]">
              <IconMap className="h-3.5 w-3.5 shrink-0" />
            </span>
            <div>
              <p className="text-[0.74rem] font-extrabold uppercase tracking-[0.1em] text-[#0B281D]">
                {t(nearby ? "Nearby listings" : "Properties on map")}
              </p>
              <p className="text-[0.68rem] font-medium text-[#5A6D63]">
                {properties.length} verified location{properties.length === 1 ? "" : "s"} plotted
              </p>
            </div>
          </div>
          {(fullScreen || selected !== null) && (
            <div className="map-view-list-controls">
              {fullScreen && (
                <>
                  <button
                    type="button"
                    aria-label={t("Previous properties on map")}
                    title={t("Scroll properties left")}
                    onClick={() =>
                      listRef.current?.scrollBy({
                        left: -300,
                        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                          ? "auto"
                          : "smooth",
                      })
                    }
                  >
                    <IconArrowRight className="h-4 w-4 rotate-180" />
                  </button>
                  <button
                    type="button"
                    aria-label={t("Next properties on map")}
                    title={t("Scroll properties right")}
                    onClick={() =>
                      listRef.current?.scrollBy({
                        left: 300,
                        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                          ? "auto"
                          : "smooth",
                      })
                    }
                  >
                    <IconArrowRight className="h-4 w-4" />
                  </button>
                </>
              )}
              {selected !== null && (
                <button
                  type="button"
                  aria-label={t("Clear map selection")}
                  onClick={() => setSelected(null)}
                  title="Clear selected property"
                  className="map-view-list-clear"
                >
                  <IconClose className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>

        <ul
          ref={listRef}
          className={`map-view-list-track max-h-[600px] min-h-0 flex-1 space-y-2 overflow-y-auto pt-2 ${fullScreen ? "map-view-list-track--horizontal" : ""}`}
        >
          {properties.map((property) => (
            <li
              key={property.id}
              data-selected={property.id === selected ? "true" : undefined}
              onMouseEnter={fullScreen ? undefined : () => setSelected(property.id)}
              className={`map-view-list-card min-w-0 rounded-xl border p-2.5 transition-all duration-150 ${
                property.id === selected
                  ? "border-[#DFB872] bg-[#FBF7EE] shadow-sm"
                  : "border-[#E3EAE6] bg-white hover:border-[#B8CDBE] hover:bg-[#F8FBF9]"
              }`}
            >
              <div className="flex min-w-0 items-start gap-3">
                <ResilientImage
                  src={property.coverImage || "/images/property-placeholder.svg"}
                  alt=""
                  width={140}
                  height={110}
                  loading="lazy"
                  className="h-16 w-20 shrink-0 rounded-lg object-cover ring-1 ring-black/5"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="font-sans text-[0.84rem] font-extrabold text-[#0B3224]">
                      PKR {formatPriceShort(property.price, property.priceUnit)}
                    </span>
                    <span className="rounded bg-[#0B3224]/8 px-1.5 py-0.5 text-[0.65rem] font-bold text-[#0F4C35]">
                      {property.propertyType}
                    </span>
                  </div>
                  <Link
                    href={`/property/${property.slug}`}
                    className="mt-1 line-clamp-1 block text-[0.8125rem] font-bold leading-snug text-[#0B2219] hover:text-[#9A6F2B]"
                  >
                    {property.title}
                  </Link>
                  <p className="mt-0.5 truncate text-[0.73rem] text-[#5B6D63]">
                    {property.locationArea}, {property.cityName}
                  </p>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[#ECEFEC] pt-1.5">
                <span className="text-[0.72rem] font-semibold text-[#53665C]">
                  {typeof property.distanceKm === "number"
                    ? `${property.distanceKm < 0.1 ? "Under 100 m" : `${property.distanceKm.toFixed(1)} km`} away`
                    : `${formatArea(property.areaValue, property.areaUnit)}${property.bedrooms > 0 ? ` · ${property.bedrooms} Bed` : ""}`}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSelected(property.id);
                    setFocus({ key: datasetKey, lat: property.lat, lng: property.lng, zoom: 16 });
                  }}
                  className="inline-flex items-center gap-1 rounded-lg bg-[#0B3224] px-2.5 py-1 text-[0.7rem] font-bold text-[#F3D590] transition hover:bg-[#124A36]"
                >
                  <IconPin className="h-3 w-3" /> {t("Show on map")}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function propertyPriceUnit(unit: string) {
  return unit || "PKR";
}
