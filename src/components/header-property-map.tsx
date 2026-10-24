"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { IconArrowRight, IconClose, IconMap, IconPin, IconSliders, IconSpark } from "@/components/icons";
import { useLanguage } from "@/components/language-provider";
import type { MapProperty } from "@/components/map-view";
import { CITY_CENTERS } from "@/lib/map-engine";
import { CATEGORY_LABELS } from "@/lib/constants";
import { SEARCH_CITIES } from "@/lib/property-search";
import { SOCIETY_MAPS } from "@/lib/society-maps";

const MapView = dynamic(() => import("@/components/map-view").then((module) => module.MapView), {
  ssr: false,
  loading: () => <div className="header-map-loading">Loading interactive satellite property map…</div>,
});

const PAKISTAN_CENTER = { lat: 31.4697, lng: 74.4100 };

function nearestSearchCity(lat: number, lng: number) {
  const radians = Math.PI / 180;
  const candidates = SEARCH_CITIES.flatMap((city) => {
    const center = CITY_CENTERS[city.slug];
    if (!center) return [];
    const dLat = (center.lat - lat) * radians;
    const dLng = (center.lng - lng) * radians;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat * radians) * Math.cos(center.lat * radians) * Math.sin(dLng / 2) ** 2;
    return [{ ...city, distanceKm: 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) }];
  }).sort((a, b) => a.distanceKm - b.distanceKm);
  return candidates[0] && candidates[0].distanceKm <= 140 ? candidates[0] : null;
}

export function HeaderPropertyMap({
  initialQuery = "",
  onClose,
  onFilters,
}: {
  initialQuery?: string;
  onClose: () => void;
  onFilters: (query: string) => void;
}) {
  const { t } = useLanguage();
  const prefix = useId();
  const initial = useMemo(() => new URLSearchParams(initialQuery), [initialQuery]);
  const [city, setCity] = useState(initial.get("city") ?? "lahore");
  const [purpose, setPurpose] = useState(initial.get("purpose") ?? "");
  const [category, setCategory] = useState(initial.get("category") ?? "");
  const [societySlug, setSocietySlug] = useState<string>("");
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{
    key: string;
    items: MapProperty[];
    total: number;
    error: string;
  }>({ key: "", items: [], total: 0, error: "" });
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationNotice, setLocationNotice] = useState("");
  const [locatedCenter, setLocatedCenter] = useState<{ lat: number; lng: number } | null>(null);
  const cityManuallySelectedRef = useRef(false);

  const activeSociety = useMemo(
    () => (societySlug ? SOCIETY_MAPS.find((s) => s.slug === societySlug) ?? null : null),
    [societySlug],
  );

  const societyCenter = useMemo(() => {
    const firstLayer = activeSociety?.layers[0];
    if (!firstLayer) return null;
    const [north, east, south, west] = firstLayer.bounds;
    return { lat: (north + south) / 2, lng: (east + west) / 2, zoom: 14 };
  }, [activeSociety]);

  const query = useMemo(() => {
    const params = new URLSearchParams(initial);
    params.set("view", "map");
    params.delete("page");
    params.delete("pageSize");
    if (city) params.set("city", city);
    else params.delete("city");
    if (city !== (initial.get("city") ?? "")) {
      params.delete("town");
      params.delete("townExact");
    }
    if (purpose) params.set("purpose", purpose);
    else params.delete("purpose");
    if (purpose !== (initial.get("purpose") ?? "")) {
      params.delete("minPrice");
      params.delete("maxPrice");
    }
    if (category) params.set("category", category);
    else params.delete("category");
    if (category !== (initial.get("category") ?? "")) {
      params.delete("type");
      params.delete("beds");
      params.delete("baths");
    }
    return params.toString();
  }, [initial, city, purpose, category]);

  const loading = result.key !== query;
  const cityCenter = CITY_CENTERS[city];
  const center = societyCenter ?? locatedCenter ?? cityCenter ?? PAKISTAN_CENTER;
  const zoom = societyCenter
    ? societyCenter.zoom
    : locatedCenter
      ? cityCenter?.zoom ?? 13
      : cityCenter?.zoom ?? 12;
  const listParams = new URLSearchParams(query);
  listParams.delete("view");

  function selectCity(value: string) {
    const selectedCity = SEARCH_CITIES.find((item) => item.slug === value);
    cityManuallySelectedRef.current = true;
    setCity(value);
    setSocietySlug("");
    setLocatedCenter(null);
    setLocationLoading(false);
    setLocationNotice(
      value
        ? t("Showing {city} property locations.").replace(
            "{city}",
            selectedCity?.name ?? t("selected city"),
          )
        : t("Showing property locations across Pakistan."),
    );
  }

  function applyLocatedCity(lat: number, lng: number) {
    const nearbyCity = nearestSearchCity(lat, lng);
    if (!nearbyCity) {
      setCity("");
      setSocietySlug("");
      setLocatedCenter(null);
      setLocationNotice(
        t("We couldn't match your location to a listed city, so the map is showing Pakistan."),
      );
      return;
    }
    cityManuallySelectedRef.current = false;
    setCity(nearbyCity.slug);
    setSocietySlug("");
    setLocatedCenter({ lat, lng });
    setLocationNotice(t("Showing {city} around your location.").replace("{city}", nearbyCity.name));
  }

  function requestLocation() {
    if (!navigator.geolocation) {
      selectCity("");
      setLocationNotice(t("Location is unavailable in this browser. Showing Pakistan."));
      return;
    }
    cityManuallySelectedRef.current = false;
    setLocationLoading(true);
    setLocationNotice(t("Waiting for location permission…"));
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationLoading(false);
        if (cityManuallySelectedRef.current) return;
        applyLocatedCity(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        setLocationLoading(false);
        if (cityManuallySelectedRef.current) return;
        setLocationNotice(
          t(
            error.code === 1
              ? "Location permission wasn't enabled."
              : "Couldn't get your location.",
          ),
        );
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  }

  useEffect(() => {
    const controller = new AbortController();
    void fetch(`/api/properties?${query}`, { signal: controller.signal })
      .then(async (response) => {
        const data = (await response.json()) as {
          ok?: boolean;
          items?: MapProperty[];
          total?: number;
        };
        if (!response.ok || !data.ok || !Array.isArray(data.items)) {
          throw new Error("Unable to load mapped listings.");
        }
        if (!controller.signal.aborted) {
          setResult({
            key: query,
            items: data.items,
            total: data.total ?? data.items.length,
            error: "",
          });
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setResult((current) => ({
            ...current,
            key: query,
            error: "Could not load listings. Please try again.",
          }));
        }
      });
    return () => controller.abort();
  }, [query, attempt]);

  return (
    <div className="header-map-panel">
      {/* Executive Dark Emerald & Gold Map Header */}
      <div className="header-map-heading">
        <div className="header-map-heading-brand flex min-w-0 items-center gap-3">
          <span className="header-map-heading-icon grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#DFB872]/45 bg-[#09281D] text-[#F3D590] shadow-sm">
            <IconMap className="h-5 w-5" />
          </span>
          <div className="header-map-heading-copy min-w-0">
            <div className="header-map-heading-copy-main">
              <h2 className="header-map-title">{t("Interactive Property & Satellite Map")}</h2>
              <span className="header-map-count inline-flex items-center gap-1 rounded-full border border-[#DFB872]/40 bg-white/10 px-2.5 py-0.5 text-[0.65rem] font-extrabold uppercase tracking-[0.14em] text-[#F3D590]">
                <IconSpark className="h-3 w-3" />
                {result.items.length} Plotted
              </span>
            </div>
            <p className="hidden truncate text-[0.73rem] text-white/75 sm:block">
              {locationNotice ||
                "Satellite imagery, street maps, society plot-grid overlays & live verified listings"}
            </p>
          </div>
        </div>

        <div className="header-map-heading-actions">
          <button
            type="button"
            onClick={requestLocation}
            disabled={locationLoading}
            className="header-map-btn-ghost header-map-nearby-action"
            title="Center map near my current location"
          >
            <IconPin className="h-3.5 w-3.5 text-[#F3D590]" />
            <span>{locationLoading ? t("Locating…") : t("Near Me")}</span>
          </button>
          <Link href="/maps" onClick={onClose} className="header-map-btn-gold header-map-pdf-action">
            <span>{t("57 PDF Maps")}</span>
            <IconArrowRight className="h-3.5 w-3.5" />
          </Link>
          <button
            type="button"
            onClick={() => onFilters(listParams.toString())}
            className="header-map-btn-ghost header-map-filters-action"
          >
            <IconSliders className="h-3.5 w-3.5" />
            <span>{t("Filters")}</span>
          </button>
          <Link
            href={`/properties${listParams.size ? `?${listParams}` : ""}`}
            onClick={onClose}
            className="header-map-btn-ghost header-map-list-action"
          >
            <span>{t("List view")}</span>
          </Link>
          <button
            type="button"
            data-dialog-initial
            onClick={onClose}
            aria-label={t("Close property map")}
            className="dialog-close header-map-close"
          >
            <IconClose className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Unified Executive Filter & Quick City Bar */}
      <div className="header-map-toolbar">
        {/* Quick City Pills */}
        <div className="header-map-city-pills" role="group" aria-label="Select city on map">
          <button
            type="button"
            onClick={() => selectCity("")}
            className={`header-map-city-pill ${city === "" ? "is-active" : ""}`}
          >
            All Pakistan
          </button>
          {SEARCH_CITIES.map((item) => (
            <button
              key={item.slug}
              type="button"
              onClick={() => selectCity(item.slug)}
              className={`header-map-city-pill ${city === item.slug ? "is-active" : ""}`}
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* Dropdowns for City, Purpose, Property Category & Live Society Plot Overlay */}
        <div className="header-map-filters">
          <div>
            <label htmlFor={`${prefix}-city`}>{t("City")}</label>
            <select
              id={`${prefix}-city`}
              value={city}
              onChange={(event) => selectCity(event.target.value)}
            >
              <option value="">All Pakistan</option>
              {SEARCH_CITIES.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={`${prefix}-purpose`}>{t("Purpose")}</label>
            <select
              id={`${prefix}-purpose`}
              value={purpose}
              onChange={(event) => setPurpose(event.target.value)}
            >
              <option value="">{t("Sale & Rent")}</option>
              <option value="buy">{t("For Sale")}</option>
              <option value="rent">{t("For Rent")}</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${prefix}-property`}>{t("Property")}</label>
            <select
              id={`${prefix}-property`}
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="">{t("All properties")}</option>
              <option value="homes">{t("Homes")}</option>
              <option value="plot">{t("Plots")}</option>
              <option value="commercial">{t("Commercial")}</option>
              {category && !["homes", "plot", "commercial"].includes(category) && (
                <option value={category}>{t(CATEGORY_LABELS[category] ?? category)}</option>
              )}
            </select>
          </div>
          <div>
            <label htmlFor={`${prefix}-society`}>{t("Plot-Grid Overlay")}</label>
            <select
              id={`${prefix}-society`}
              value={societySlug}
              onChange={(event) => {
                const slug = event.target.value;
                setSocietySlug(slug);
                const found = SOCIETY_MAPS.find((s) => s.slug === slug);
                if (found && SEARCH_CITIES.some((c) => c.slug === found.citySlug)) {
                  setCity(found.citySlug);
                }
              }}
            >
              <option value="">Auto (By Selected Pin)</option>
              {SOCIETY_MAPS.map((soc) => (
                <option key={soc.slug} value={soc.slug}>
                  {soc.name} ({soc.citySlug.toUpperCase()})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="header-map-content" aria-busy={loading}>
        {result.error ? (
          <div className="header-map-loading">
            <p>{t(result.error)}</p>
            <button
              className="btn btn-outline"
              type="button"
              onClick={() => {
                setResult((current) => ({ ...current, key: "" }));
                setAttempt((current) => current + 1);
              }}
            >
              {t("Retry")}
            </button>
          </div>
        ) : result.key || result.items.length ? (
          <>
            {!loading && !result.items.length && (
              <p className="header-map-empty">
                {t("No listings match these filters. Try another city, purpose or property type.")}
              </p>
            )}
            <MapView
              properties={result.items}
              center={center}
              zoom={zoom}
              autoFit={!societyCenter && !locatedCenter}
              fullScreen
              societyOverride={activeSociety}
              onLocate={(lat, lng) => applyLocatedCity(lat, lng)}
            />
          </>
        ) : (
          <div className="header-map-loading">{t("Loading properties and satellite map…")}</div>
        )}
      </div>

      <p className="header-map-disclaimer">
        <span className="hidden sm:inline">
          {t("Drag to pan; scroll or use +/− to zoom. Switch between Satellite & Street layers at top-right of the map.")}{" "}
        </span>
        <span className="sm:hidden">{t("Drag to pan or pinch to zoom.")} </span>
        {t("Pin locations are approximate; confirm the exact address before a site visit.")}
      </p>
    </div>
  );
}
