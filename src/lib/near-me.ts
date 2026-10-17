import { nearestSocietyPlace } from "@/lib/society-index";
import { NEAR_RADII } from "@/lib/property-search";

export type ListingPoint = {
  purpose: string;
  citySlug: string;
  cityName: string;
  area: string;
  lat: number;
  lng: number;
};

export type NearMeResult =
  | {
      status: "near";
      lat: number;
      lng: number;
      radiusKm: number;
      count: number;
      /** Human label for where the visitor is, e.g. "Johar Town, Lahore". */
      label: string;
      city: string;
      cityName: string;
    }
  | {
      /** Nothing within 50 km: fall back to the closest city that has listings. */
      status: "city";
      label: string;
      city: string;
      cityName: string;
      count: number;
      distanceKm: number;
    }
  | { status: "outside" }
  | { status: "empty" };

/** Generous Pakistan bounding box — anything outside gets a polite message. */
export function insidePakistan(lat: number, lng: number) {
  return lat >= 23.4 && lat <= 37.2 && lng >= 60.5 && lng <= 77.9;
}

function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(a));
}

/** "Johar Town Phase 1, Lahore" / "Johar Town Lahore" → "Johar Town Phase 1" / "Johar Town". */
function stripCity(area: string, cityName: string) {
  const escaped = cityName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const stripped = area.trim().replace(new RegExp(`[\\s,]+${escaped}$`, "i"), "").trim();
  return stripped || area.trim();
}

/** Enough results to be useful without throwing the radius too wide. */
const ENOUGH = 4;

/**
 * Picks the tightest radius around the visitor that still returns listings,
 * plus a readable name for where they are. Pure function so it is testable.
 */
export function resolveNearMe(lat: number, lng: number, purpose: string | undefined, points: ListingPoint[]): NearMeResult {
  if (!insidePakistan(lat, lng)) return { status: "outside" };
  const pool = purpose === "buy" || purpose === "rent" ? points.filter((point) => point.purpose === purpose) : points;
  if (pool.length === 0) return { status: "empty" };

  const ranked = pool
    .map((point) => ({ point, km: distanceKm(lat, lng, point.lat, point.lng) }))
    .sort((a, b) => a.km - b.km);
  const nearest = ranked[0];

  const maxRadius = NEAR_RADII[NEAR_RADII.length - 1];
  let radiusKm = 0;
  for (const radius of NEAR_RADII) {
    const count = ranked.filter((row) => row.km <= radius).length;
    if (count >= ENOUGH || (radius === maxRadius && count > 0)) {
      radiusKm = radius;
      break;
    }
  }

  if (!radiusKm) {
    // Closest city with inventory, counted the same way the city filter will.
    const cityCount = pool.filter((point) => point.citySlug === nearest.point.citySlug).length;
    return {
      status: "city",
      label: nearest.point.cityName,
      city: nearest.point.citySlug,
      cityName: nearest.point.cityName,
      count: cityCount,
      distanceKm: Math.round(nearest.km),
    };
  }

  // Name the spot: known society / phase first, then the nearest listing area.
  const place = nearestSocietyPlace(lat, lng, undefined, 6);
  let label = "";
  let city = nearest.point.citySlug;
  let cityName = nearest.point.cityName;
  if (place) {
    city = place.area.citySlug;
    cityName = place.area.cityName;
    const name = place.detail?.label ?? place.area.label;
    label = place.area.kind === "city" ? cityName : `${stripCity(name, cityName)}, ${cityName}`;
  } else if (nearest.km <= 3) {
    label = `${stripCity(nearest.point.area, nearest.point.cityName)}, ${nearest.point.cityName}`;
  } else {
    label = nearest.point.cityName;
  }

  return {
    status: "near",
    lat: Math.round(lat * 1e4) / 1e4,
    lng: Math.round(lng * 1e4) / 1e4,
    radiusKm,
    count: ranked.filter((row) => row.km <= radiusKm).length,
    label,
    city,
    cityName,
  };
}
