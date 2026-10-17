"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { IconArrowRight, IconPin } from "@/components/icons";
import { BlueTick } from "@/components/verified-badge";
import { AgencyLogoMark } from "@/components/agency-logo-mark";
import type { DealerProfile } from "@/lib/queries";

/**
 * "Platinum Agency" homepage section — design samples for /sample.
 * Sample P1 follows the dhaplus.com "Registered Agencies in Pakistan" layout
 * (white logo cards, name + city, round arrows); P2–P5 are premium takes.
 */

type Agency = {
  id: string;
  name: string;
  city: string;
  logo: string | null;
  href: string;
  verified: boolean;
  listings: number;
  verifiedListings: number;
  bio: string;
};

function toAgencies(dealers: DealerProfile[]): Agency[] {
  return dealers.map((dealer, index) => ({
    id: `${dealer.id}-${index}`,
    name: dealer.agency?.trim() || dealer.name?.trim() || "Property Advisor",
    city: dealer.cityName || "Pakistan",
    // Agencies show their company logo; without one they get a generated real-estate logo mark.
    logo: dealer.companyLogo || null,
    href: dealer.slug ? `/dealers/${dealer.slug}` : "/dealers",
    verified: Boolean(dealer.isVerified),
    listings: dealer.listings ?? 0,
    verifiedListings: dealer.verifiedListings ?? 0,
    bio: dealer.bio?.trim() || "Verified real estate agency helping buyers, sellers and investors with trusted, documented deals.",
  }));
}

/** Agency logo in a circle; falls back to a platinum monogram when there is no image or it fails. */
function AgencyLogo({ agency, size = 88, tone = "light" }: { agency: Agency; size?: number; tone?: "light" | "dark" }) {
  const [failed, setFailed] = useState(false);
  const showImage = agency.logo && !failed;
  return (
    <span
      className={`agx-logo ${showImage ? "" : "agx-logo--mark"} ${tone === "dark" ? "agx-logo--dark" : ""}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.32) }}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={agency.logo!} alt={`${agency.name} logo`} loading="lazy" draggable={false} onError={() => setFailed(true)} />
      ) : (
        <AgencyLogoMark name={agency.name} className="h-full w-full" />
      )}
    </span>
  );
}

/** Horizontal rail that auto-advances one card at a time and pauses on hover/focus/interaction. */
function useAutoRail(interval = 3400) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [paused, setPaused] = useState(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const step = useCallback(() => {
    const rail = ref.current;
    const card = rail?.firstElementChild as HTMLElement | null;
    if (!rail || !card) return 0;
    const gap = parseFloat(getComputedStyle(rail).columnGap || "0") || 16;
    return card.getBoundingClientRect().width + gap;
  }, []);

  const move = useCallback(
    (direction: -1 | 1) => {
      const rail = ref.current;
      if (!rail) return;
      setPaused(true);
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
      resumeTimer.current = setTimeout(() => setPaused(false), 5000);
      rail.scrollBy({ left: direction * step(), behavior: "smooth" });
    },
    [step],
  );

  useEffect(() => {
    const rail = ref.current;
    if (!rail || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      const max = rail.scrollWidth - rail.clientWidth;
      if (max <= 2) return;
      if (rail.scrollLeft >= max - 2) rail.scrollTo({ left: 0, behavior: "smooth" });
      else rail.scrollBy({ left: step(), behavior: "smooth" });
    }, interval);
    return () => window.clearInterval(timer);
  }, [paused, interval, step]);

  useEffect(() => () => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
  }, []);

  const bind = {
    ref,
    onMouseEnter: () => setPaused(true),
    onMouseLeave: () => setPaused(false),
    onFocus: () => setPaused(true),
    onBlur: () => setPaused(false),
    onTouchStart: () => setPaused(true),
  };
  return { bind, move };
}

function RoundArrows({ move, dark = false }: { move: (direction: -1 | 1) => void; dark?: boolean }) {
  return (
    <div className={`agx-arrows ${dark ? "agx-arrows--dark" : ""}`}>
      <button type="button" aria-label="Previous agencies" onClick={() => move(-1)}>
        <IconArrowRight className="h-4 w-4 rotate-180" />
      </button>
      <button type="button" aria-label="Next agencies" onClick={() => move(1)}>
        <IconArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function PlatinumChip({ dark = false }: { dark?: boolean }) {
  return (
    <span className={`agx-chip ${dark ? "agx-chip--dark" : ""}`}>
      <svg viewBox="0 0 20 20" className="h-3 w-3" fill="currentColor" aria-hidden="true"><path d="M10 1.8l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.42 5.06 17.01 6 11.5 2 7.6l5.53-.8L10 1.8z" /></svg>
      Platinum
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* P1 — dhaplus "Registered Agencies" style → homepage "Verified Agencies" */
/* ------------------------------------------------------------------ */
function SampleClassic({ agencies }: { agencies: Agency[] }) {
  const { bind, move } = useAutoRail(3200);
  return (
    <section className="agx-p1">
      <div className="agx-head">
        <h2 id="verified-agencies-heading" className="agx-serif">Verified Agencies in Pakistan</h2>
        <RoundArrows move={move} />
      </div>
      <div className="agx-rail agx-p1-rail" {...bind} tabIndex={0} aria-label="Verified agencies">
        {agencies.map((agency) => (
          <Link key={agency.id} href={agency.href} className="agx-p1-card" aria-label={`${agency.name}, ${agency.city} — view agency`}>
            <AgencyLogo agency={agency} size={104} />
            <p className="agx-p1-name">
              <span className="truncate">{agency.name}</span>
              {agency.verified && <BlueTick className="h-4 w-4 shrink-0" />}
            </p>
            <p className="agx-p1-city">{agency.city}</p>
            <div className="agx-p1-stats">
              <span className="agx-p1-chip">
                <svg viewBox="0 0 20 20" aria-hidden="true" className="agx-p1-chip-icon">
                  <path d="M3.5 9.2 10 4l6.5 5.2" />
                  <path d="M5.5 8v7.5h9V8" />
                  <path d="M8.5 15.5v-4h3v4" />
                </svg>
                <b>{agency.listings}</b>
                <span>{agency.listings === 1 ? "Listing" : "Listings"}</span>
              </span>
              <span className="agx-p1-chip agx-p1-chip--verified">
                <svg viewBox="0 0 20 20" aria-hidden="true" className="agx-p1-chip-icon">
                  <path d="M10 2.8 15.6 5v4.4c0 3.6-2.4 6.3-5.6 7.6-3.2-1.3-5.6-4-5.6-7.6V5z" />
                  <path d="m7.4 10 1.8 1.8 3.5-3.6" />
                </svg>
                <b>{agency.verifiedListings}</b>
                <span>Verified</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/** Homepage section: the chosen P1 "Verified Agencies" design with live agency data. */
export function VerifiedAgenciesSection({ dealers }: { dealers: DealerProfile[] }) {
  // Only admin-verified agencies, with their real listing / verified-listing counts.
  const agencies = toAgencies(dealers.filter((dealer) => dealer.isVerified)).slice(0, 16);
  if (agencies.length === 0) return null;
  return (
    <section id="home-dealers" className="home-verified-agencies" aria-labelledby="verified-agencies-heading">
      <div className="ui-container">
        <SampleClassic agencies={agencies} />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* P2 — Platinum Luxe (dark emerald + metallic borders)                */
/* ------------------------------------------------------------------ */
function SampleLuxe({ agencies }: { agencies: Agency[] }) {
  const { bind, move } = useAutoRail(3000);
  return (
    <section className="agx-p2">
      <div className="agx-head">
        <div>
          <p className="agx-eyebrow agx-eyebrow--gold">Platinum partners</p>
          <h2 className="agx-title agx-title--light">Platinum Agency</h2>
          <p className="agx-sub agx-sub--light">Pakistan&apos;s top-rated, verified agencies — hand-picked for trusted deals.</p>
        </div>
        <RoundArrows move={move} dark />
      </div>
      <div className="agx-rail agx-p2-rail" {...bind} tabIndex={0} aria-label="Platinum agencies">
        {agencies.map((agency) => (
          <Link key={agency.id} href={agency.href} className="agx-p2-card">
            <div className="agx-p2-inner">
              <PlatinumChip dark />
              <AgencyLogo agency={agency} size={84} tone="dark" />
              <p className="agx-p2-name">
                <span className="truncate">{agency.name}</span>
                {agency.verified && <BlueTick className="h-4 w-4 shrink-0" />}
              </p>
              <p className="agx-p2-city"><IconPin className="h-3.5 w-3.5" /> {agency.city}</p>
              <div className="agx-p2-stats">
                <span><b>{agency.listings}</b> Listings</span>
                <span><b>{agency.verifiedListings}</b> Verified</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* P3 — Silver band cards with stats + CTA                             */
/* ------------------------------------------------------------------ */
function SampleSilverBand({ agencies }: { agencies: Agency[] }) {
  const { bind, move } = useAutoRail(3600);
  return (
    <section className="agx-p3">
      <div className="agx-head">
        <div>
          <p className="agx-eyebrow">Top verified agencies</p>
          <h2 className="agx-title">Platinum Agency</h2>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dealers" className="agx-link">View all agencies <IconArrowRight className="h-3.5 w-3.5" /></Link>
          <RoundArrows move={move} />
        </div>
      </div>
      <div className="agx-rail agx-p3-rail" {...bind} tabIndex={0} aria-label="Platinum agencies">
        {agencies.map((agency) => (
          <article key={agency.id} className="agx-p3-card">
            <div className="agx-p3-band">
              <PlatinumChip />
            </div>
            <div className="agx-p3-logo"><AgencyLogo agency={agency} size={80} /></div>
            <div className="agx-p3-body">
              <p className="agx-p3-name">
                <span className="truncate">{agency.name}</span>
                {agency.verified && <BlueTick className="h-4 w-4 shrink-0" />}
              </p>
              <p className="agx-p3-city"><IconPin className="h-3.5 w-3.5" /> {agency.city}</p>
              <div className="agx-p3-stats">
                <div><b>{agency.listings}</b><span>Listings</span></div>
                <div><b>{agency.verifiedListings}</b><span>Verified</span></div>
                <div><b>{agency.verified ? "Yes" : "—"}</b><span>KYC</span></div>
              </div>
              <Link href={agency.href} className="agx-p3-cta">View agency</Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* P4 — Logo wall marquee (two rows, opposite directions)              */
/* ------------------------------------------------------------------ */
function SampleLogoWall({ agencies }: { agencies: Agency[] }) {
  const half = Math.ceil(agencies.length / 2);
  const rows = [agencies.slice(0, half), agencies.slice(half).length ? agencies.slice(half) : agencies.slice(0, half)];
  return (
    <section className="agx-p4">
      <div className="text-center">
        <p className="agx-eyebrow justify-center">Platinum agency network</p>
        <h2 className="agx-title">Trusted by Pakistan&apos;s Platinum Agencies</h2>
        <p className="agx-sub mx-auto">Every agency below is verified by Properties Pak — hover to pause, click to open the profile.</p>
      </div>
      <div className="agx-p4-rows">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="agx-p4-marquee">
            <div className={`agx-p4-track ${rowIndex === 1 ? "agx-p4-track--reverse" : ""}`}>
              {[...row, ...row].map((agency, index) => (
                <Link key={`${agency.id}-${index}`} href={agency.href} className="agx-p4-tile" aria-hidden={index >= row.length ? true : undefined} tabIndex={index >= row.length ? -1 : undefined}>
                  <AgencyLogo agency={agency} size={56} />
                  <span className="min-w-0">
                    <span className="agx-p4-name">{agency.name}</span>
                    <span className="agx-p4-city">{agency.city}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-7 flex justify-center">
        <Link href="/dealers" className="agx-p4-btn">Browse all agencies <IconArrowRight className="h-4 w-4" /></Link>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* P5 — Spotlight agency + compact rail                                */
/* ------------------------------------------------------------------ */
function SampleSpotlight({ agencies }: { agencies: Agency[] }) {
  const [active, setActive] = useState(0);
  const { bind, move } = useAutoRail(2800);
  const spot = agencies[active] ?? agencies[0];
  if (!spot) return null;
  return (
    <section className="agx-p5">
      <div className="agx-p5-spot">
        <PlatinumChip dark />
        <div className="mt-5 flex items-center gap-4">
          <AgencyLogo agency={spot} size={96} tone="dark" />
          <div className="min-w-0">
            <p className="agx-eyebrow agx-eyebrow--gold">Agency of the week</p>
            <h3 className="agx-p5-name">
              <span className="truncate">{spot.name}</span>
              {spot.verified && <BlueTick className="h-5 w-5 shrink-0" />}
            </h3>
            <p className="agx-p5-city"><IconPin className="h-4 w-4" /> {spot.city}</p>
          </div>
        </div>
        <p className="agx-p5-bio">{spot.bio}</p>
        <div className="agx-p5-stats">
          <div><b>{spot.listings}</b><span>Active listings</span></div>
          <div><b>{spot.verifiedListings}</b><span>Verified listings</span></div>
          <div><b>{spot.verified ? "100%" : "—"}</b><span>Documents checked</span></div>
        </div>
        <Link href={spot.href} className="agx-p5-btn">View agency profile <IconArrowRight className="h-4 w-4" /></Link>
      </div>
      <div className="agx-p5-side">
        <div className="agx-head">
          <div>
            <p className="agx-eyebrow">Platinum agency</p>
            <h2 className="agx-title">More Platinum Agencies</h2>
          </div>
          <RoundArrows move={move} />
        </div>
        <div className="agx-rail agx-p5-rail" {...bind} tabIndex={0} aria-label="Platinum agencies">
          {agencies.map((agency, index) => (
            <button key={agency.id} type="button" onClick={() => setActive(index)} className="agx-p5-card" aria-pressed={index === active}>
              <AgencyLogo agency={agency} size={64} />
              <span className="agx-p5-card-name">{agency.name}</span>
              <span className="agx-p5-card-city">{agency.city}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function SampleFrame({ code, title, note, children }: { code: string; title: string; note: string; children: ReactNode }) {
  return (
    <div className="agx-frame" id={`agency-${code.toLowerCase()}`}>
      <div className="agx-frame-label">
        <span className="agx-frame-code">{code}</span>
        <span className="agx-frame-title">{title}</span>
        <span className="agx-frame-note">{note}</span>
      </div>
      {children}
    </div>
  );
}

export function AgencySamplesShowcase({ dealers }: { dealers: DealerProfile[] }) {
  const agencies = toAgencies(dealers).slice(0, 14);
  return (
    <section className="agx-showcase" aria-labelledby="agency-samples-heading">
      <div className="ui-container">
        <header className="agx-showcase-head">
          <p className="agx-eyebrow">Design samples</p>
          <h1 id="agency-samples-heading" className="agx-title">Platinum Agency — 5 section samples</h1>
          <p className="agx-sub">
            P1 follows the dhaplus.com &ldquo;Registered Agencies in Pakistan&rdquo; layout; P2–P5 are premium variations. All use live agency data,
            auto-scroll with pauses, and fall back to a platinum monogram when an agency has no logo. Pick one and it goes on the homepage.
          </p>
          <nav className="agx-jump" aria-label="Jump to sample">
            {["P1", "P2", "P3", "P4", "P5"].map((code) => (
              <a key={code} href={`#agency-${code.toLowerCase()}`}>{code}</a>
            ))}
          </nav>
        </header>

        {agencies.length === 0 ? (
          <p className="agx-sub">No agency profiles yet — samples will appear once agencies are added.</p>
        ) : (
          <>
            <SampleFrame code="P1" title="Verified Agencies (on homepage)" note="dhaplus registered style · logo cards · stats · View agency button">
              <SampleClassic agencies={agencies} />
            </SampleFrame>
            <SampleFrame code="P2" title="Platinum Luxe" note="dark emerald · metallic platinum borders · gold accents">
              <SampleLuxe agencies={agencies} />
            </SampleFrame>
            <SampleFrame code="P3" title="Silver Band" note="platinum band header · stats · View agency button">
              <SampleSilverBand agencies={agencies} />
            </SampleFrame>
            <SampleFrame code="P4" title="Logo Wall" note="two-row infinite marquee · pauses on hover">
              <SampleLogoWall agencies={agencies} />
            </SampleFrame>
            <SampleFrame code="P5" title="Spotlight" note="featured agency card + clickable compact rail">
              <SampleSpotlight agencies={agencies} />
            </SampleFrame>
          </>
        )}
      </div>
    </section>
  );
}
