import Link from "next/link";
import { DealerLogo } from "@/components/dealer-logo";
import { agencyDisplayName } from "@/lib/agency-name";
import { BlueTick } from "@/components/verified-badge";
import type { DealerProfile } from "@/lib/queries";

/**
 * /dealers directory card — the same look as the homepage "Verified Agencies
 * in Pakistan" rail (white card, round agency logo, name + blue tick, city,
 * Listings / Verified chips). The whole card is the link to the profile.
 */
export function AgencyDirectoryCard({ dealer }: { dealer: DealerProfile }) {
  const name = agencyDisplayName(dealer);
  const city = dealer.cityName || "Pakistan";
  const listings = dealer.listings ?? 0;
  const verifiedListings = dealer.verifiedListings ?? 0;
  const person = dealer.agency?.trim() && dealer.name?.trim() && dealer.name.trim() !== name ? dealer.name.trim() : null;

  return (
    <Link
      href={dealer.slug ? `/dealers/${dealer.slug}` : "/dealers"}
      className="agx-p1-card dlr-card"
      aria-label={`${name}, ${city} — view agency profile`}
    >
      {!dealer.isVerified && <span className="dlr-review">In review</span>}
      <DealerLogo name={name} logo={dealer.companyLogo} size={104} className="dlr-card-logo" />
      <div className="dlr-card-body">
        <p className="agx-p1-name">
          <span className="truncate">{name}</span>
          {dealer.isVerified && <BlueTick className="h-4 w-4 shrink-0" />}
        </p>
        <p className="agx-p1-city">
          {person ? (
            <>
              {person} <span aria-hidden="true">·</span> {city}
            </>
          ) : (
            city
          )}
        </p>
        <div className="agx-p1-stats">
          <span className="agx-p1-chip">
            <svg viewBox="0 0 20 20" aria-hidden="true" className="agx-p1-chip-icon">
              <path d="M3.5 9.2 10 4l6.5 5.2" />
              <path d="M5.5 8v7.5h9V8" />
              <path d="M8.5 15.5v-4h3v4" />
            </svg>
            <b>{listings}</b>
            <span>{listings === 1 ? "Listing" : "Listings"}</span>
          </span>
          <span className="agx-p1-chip agx-p1-chip--verified">
            <svg viewBox="0 0 20 20" aria-hidden="true" className="agx-p1-chip-icon">
              <path d="M10 2.8 15.6 5v4.4c0 3.6-2.4 6.3-5.6 7.6-3.2-1.3-5.6-4-5.6-7.6V5z" />
              <path d="m7.4 10 1.8 1.8 3.5-3.6" />
            </svg>
            <b>{verifiedListings}</b>
            <span>Verified</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
