import { ResilientImage } from "@/components/resilient-image";
import Link from "next/link";
import { IconArea, IconArrowRight, IconBath, IconBed, IconEye, IconPin } from "@/components/icons";
import { FavoriteButton } from "@/components/favorite-button";
import { CompareToggle } from "@/components/compare-toggle";
import type { Property } from "@/db/schema";
import { compactPropertyTitle, formatArea, formatNumber, formatPrice } from "@/lib/format";
import { CATEGORY_LABELS } from "@/lib/constants";
import { computePropertyScore, pricePerSqft } from "@/lib/score";
import { BlueTick } from "@/components/verified-badge";
import type { PropertyWithDealer } from "@/lib/queries";

export function purposeBadge(property: Pick<Property, "purpose" | "isNewProject">) {
  if (property.isNewProject) return { label: "New Project", className: "bg-[#0D382A] text-white" };
  if (property.purpose === "rent") return { label: "For Rent", className: "bg-[#0D382A] text-white" };
  return { label: "For Sale", className: "bg-[#0D382A] text-white" };
}

function formatPkrNumeric(price: number | string, purpose: string): { main: string; suffix?: string } {
  const num = typeof price === "number" ? price : Number(price);
  if (!Number.isFinite(num) || num <= 0) {
    return { main: formatPrice(num, purpose === "rent" ? "month" : "total") };
  }
  return {
    main: `PKR ${Math.round(num).toLocaleString("en-US")}`,
    suffix: purpose === "rent" ? " / Month" : undefined,
  };
}

export function PropertyCard({
  property,
  priority = false,
  className = "",
  compact = false,
}: {
  property: Property | PropertyWithDealer;
  priority?: boolean;
  className?: string;
  compact?: boolean;
}) {
  const dealerVerified = Boolean((property as PropertyWithDealer).dealerVerified);
  const listingVerified = dealerVerified || Boolean(property.verified);
  const badge = purposeBadge(property);
  const score = computePropertyScore(property);
  const pps = pricePerSqft(property);
  const pkr = formatPkrNumeric(property.price, property.purpose);
  const areaLabel =
    property.areaSqft > 0
      ? `${Math.round(property.areaSqft).toLocaleString("en-US")} Sq Ft`
      : formatArea(property.areaValue, property.areaUnit);
  const titleClass = compact
    ? "line-clamp-1 min-h-[1.35em] text-[0.95rem]"
    : "line-clamp-2 text-[1.0625rem]";

  return (
    <article
      className={[
        "group relative flex h-full min-w-0 max-w-full flex-col overflow-hidden rounded-xl border border-[#E6EAE7] bg-white shadow-[0_6px_22px_-14px_rgba(8,34,26,0.18)] transition-all duration-300 hover:-translate-y-1 hover:border-[#C9D6CE] hover:shadow-[0_16px_34px_-18px_rgba(8,34,26,0.28)]",
        className,
      ].join(" ")}
    >
      <Link
        href={`/property/${property.slug}`}
        className={`zoom-frame relative block overflow-hidden bg-soft ${compact ? "aspect-[16/10]" : "aspect-[4/3]"}`}
      >
        <ResilientImage
          src={property.coverImage || property.images[0] || "/images/fallbacks/property-1-hd.webp"}
          alt={`${property.title} — ${property.propertyType} in ${property.locationArea}, ${property.cityName}`}
          width={1200}
          height={800}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="h-full w-full object-cover"
        />
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      </Link>

      <div
        className={`absolute flex flex-wrap items-center gap-1.5 ${
          compact ? "left-2.5 top-2.5 max-w-[calc(100%-60px)]" : "left-3.5 top-3.5"
        }`}
      >
        <span
          className={`rounded-md px-2.5 py-1 font-sans text-[0.7rem] font-semibold tracking-[0.03em] shadow-sm ${badge.className}`}
        >
          {badge.label}
        </span>
        {!compact && listingVerified && (
          <span className="inline-flex items-center gap-1 rounded-md bg-white/95 px-2 py-1 font-sans text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[#0D382A] shadow-sm">
            <BlueTick className="h-3.5 w-3.5" /> {dealerVerified ? "Verified dealer" : "Verified"}
          </span>
        )}
      </div>

      <div className={`absolute flex flex-col gap-1.5 ${compact ? "right-2.5 top-2.5" : "right-3.5 top-3.5"}`}>
        <FavoriteButton propertyId={property.id} title={property.title} />
        {!compact && <CompareToggle propertyId={property.id} title={property.title} />}
      </div>

      <div className={`flex min-w-0 flex-1 flex-col ${compact ? "p-3.5" : "p-5"}`}>
        <h3 className={`font-sans font-bold leading-snug text-[#0D261D] ${titleClass}`}>
          <Link href={`/property/${property.slug}`} className="transition-colors hover:text-[#136F46]">
            {compact ? compactPropertyTitle(property.title) : property.title}
          </Link>
        </h3>

        <p className={`mt-1 flex items-center gap-1 text-[#66776E] ${compact ? "text-[0.76rem]" : "text-[0.84rem]"}`}>
          {!compact && <IconPin className="h-3.5 w-3.5 shrink-0 text-[#0D382A]" />}
          <span className="truncate">
            {compact ? property.cityName : `${property.locationArea}, ${property.cityName}`}
          </span>
        </p>

        <div className="property-card-price-block mt-2 flex min-w-0 flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
          <p className={`font-sans font-bold leading-tight tracking-[-0.02em] text-[#0D261D] ${compact ? "text-[0.95rem]" : "text-[1.2rem]"}`}>
            {pkr.main}
            {pkr.suffix && <span className="text-[0.75rem] font-medium text-[#66776E]">{pkr.suffix}</span>}
          </p>
          <span className="sr-only">{property.propertyType}</span>
        </div>

        {!compact && (
          <p className="mt-1.5 text-[0.75rem] text-ink-muted">
            {pps > 0 ? `≈ PKR ${pps.toLocaleString("en-PK")} / sq ft` : CATEGORY_LABELS[property.category] ?? property.propertyType}
            {" · "}
            <span className="font-semibold text-[#0D382A]">Score {score.overall}/10</span>
          </p>
        )}

        <div className="mt-auto pt-2.5">
          <div className="hairline border-[#EBF0EC]" />
          <div
            className={`flex flex-wrap items-center justify-between gap-y-1 font-medium text-[#4F6158] ${
              compact ? "mt-2.5 gap-x-2 text-[0.72rem]" : "mt-3 gap-x-3.5 text-[0.8rem]"
            }`}
          >
            <span className="inline-flex items-center gap-1 whitespace-nowrap">
              <IconBed className="h-3.5 w-3.5 text-[#687A71]" /> {property.bedrooms ?? 0} Beds
            </span>
            <span className="inline-flex items-center gap-1 whitespace-nowrap">
              <IconBath className="h-3.5 w-3.5 text-[#687A71]" /> {property.bathrooms ?? 0} Baths
            </span>
            <span className="inline-flex items-center gap-1 whitespace-nowrap">
              <IconArea className="h-3.5 w-3.5 text-[#687A71]" /> {areaLabel}
            </span>
          </div>

          {!compact && (
            <div className="mt-3.5 flex items-center justify-between gap-3">
              <Link
                href={`/property/${property.slug}`}
                className="inline-flex items-center gap-1.5 font-sans text-[0.84rem] font-semibold text-[#0D382A] transition-colors hover:text-[#B8893D]"
              >
                View Details
                <IconArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <span className="flex items-center gap-3 text-[0.75rem] text-ink-muted">
                {property.negotiable && <span className="hidden sm:inline">Negotiable</span>}
                <span className="inline-flex items-center gap-1">
                  <IconEye className="h-3.5 w-3.5" /> {formatNumber(property.views)}
                </span>
              </span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export function PropertyRow({ property }: { property: Property }) {
  const badge = purposeBadge(property);
  return (
    <article className="group flex gap-4 rounded-xl border border-soft bg-white p-3 transition-all duration-300 hover:border-[#C9D6CE] hover:shadow-card">
      <Link
        href={`/property/${property.slug}`}
        className="zoom-frame relative block h-[104px] w-[140px] shrink-0 overflow-hidden rounded-lg bg-soft"
      >
        <ResilientImage
          src={property.coverImage}
          alt={`${property.title}, ${property.locationArea}`}
          width={420}
          height={312}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
        <span className={`absolute left-2 top-2 rounded-md px-1.5 py-0.5 text-[0.7rem] font-semibold ${badge.className}`}>
          {badge.label}
        </span>
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="font-sans text-[1rem] font-bold leading-none text-[#0D261D]">
          {formatPrice(property.price, property.priceUnit)}
        </p>
        <h3 className="mt-1.5 line-clamp-2 text-[0.9375rem] font-semibold leading-snug text-[#0D261D]">
          <Link href={`/property/${property.slug}`} className="hover:text-[#0D382A]">
            {property.title}
          </Link>
        </h3>
        <p className="mt-1 flex items-center gap-1.5 truncate text-[0.8125rem] text-ink-muted">
          <IconPin className="h-3.5 w-3.5 text-[#0D382A]" />
          {property.locationArea}, {property.cityName}
        </p>
        <p className="mt-auto pt-2 text-[0.75rem] font-medium text-ink-muted">
          {CATEGORY_LABELS[property.category] ?? property.propertyType}
          {property.bedrooms > 0 ? ` · ${property.bedrooms} beds` : ""} · {formatArea(property.areaValue, property.areaUnit)}
        </p>
      </div>
    </article>
  );
}
