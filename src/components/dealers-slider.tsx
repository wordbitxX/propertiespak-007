"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { IconArrowRight, IconStarFilled } from "@/components/icons";
import { ResilientImage } from "@/components/resilient-image";
import { BlueTick } from "@/components/verified-badge";
import type { DealerProfile } from "@/lib/queries";

const AGENT_AVATARS = [
  "/images/agents/agent-1.webp",
  "/images/agents/agent-2.webp",
  "/images/agents/agent-3.webp",
  "/images/agents/agent-4.webp",
] as const;

const AGENT_SPECIALTIES = [
  "Residential  |  Commercial",
  "Residential  |  Investment",
  "Commercial  |  Investment",
  "Residential  |  Plots",
] as const;

const AGENT_RATINGS = [48, 36, 29, 17, 42, 31, 24, 19] as const;

/** Matches the property rails so both home belts feel like one product. */
const AGENTS_AUTO_PLAY_MS = 3000;

export function DealersSlider({ dealers }: { dealers: DealerProfile[] }) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const drag = useRef<{ pointer: number; x: number; left: number; moved: boolean } | null>(null);
  const dragged = useRef(false);
  const interactionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [interactionPaused, setInteractionPaused] = useState(false);

  function scrollByCards(direction: -1 | 1) {
    const el = viewportRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * 280, behavior: "smooth" });
  }

  const pauseForUser = useCallback(() => {
    setInteractionPaused(true);
    if (interactionTimerRef.current) clearTimeout(interactionTimerRef.current);
    interactionTimerRef.current = setTimeout(() => {
      interactionTimerRef.current = null;
      setInteractionPaused(false);
    }, 5000);
  }, []);

  useEffect(() => () => {
    if (interactionTimerRef.current) clearTimeout(interactionTimerRef.current);
  }, []);

  /**
   * Idle auto-advance, the same cadence style as "Premium Properties For You":
   * the rail drifts one card at a time and wraps back to the start, pausing
   * whenever the visitor hovers, focuses, drags or scrolls it themselves.
   */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const viewport = viewportRef.current;
    if (!viewport) return;
    let visible = false;
    const visibility = new IntersectionObserver(
      (entries) => {
        visible = entries.some((entry) => entry.isIntersecting);
      },
      { threshold: 0.15 },
    );
    visibility.observe(viewport);

    const timer = window.setInterval(() => {
      const rail = viewportRef.current;
      if (!rail || !visible || document.hidden || hovered || focused || interactionPaused || drag.current) return;
      const maxScroll = rail.scrollWidth - rail.clientWidth;
      if (maxScroll <= 2) return;
      const item = rail.querySelector<HTMLElement>(".agents-rail-item");
      const track = rail.querySelector<HTMLElement>(".agents-rail-track");
      const gap = track ? parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 14 : 14;
      const step = (item?.getBoundingClientRect().width ?? 230) + gap;
      if (rail.scrollLeft >= maxScroll - 2) {
        rail.scrollTo({ left: 0, behavior: "smooth" });
        return;
      }
      rail.scrollBy({ left: step, behavior: "smooth" });
    }, AGENTS_AUTO_PLAY_MS);

    return () => {
      window.clearInterval(timer);
      visibility.disconnect();
    };
  }, [dealers.length, hovered, focused, interactionPaused]);

  return (
    <section id="home-dealers" className="home-dealers-section" aria-labelledby="home-dealers-heading">
      <div className="ui-container">
        <div className="agents-banner-card">
          <div className="agents-banner-intro">
            <p className="agents-banner-eyebrow">TOP VERIFIED AGENTS</p>
            <h2 id="home-dealers-heading" className="agents-banner-title">
              Work With Trusted Real Estate Experts
            </h2>
            <p className="agents-banner-copy">
              Connect with professional agents and find the perfect property with confidence.
            </p>
            <div className="agents-banner-actions">
              <Link href="/dealers" className="btn btn-gold agents-banner-cta">
                <span>View All Agents</span>
                <IconArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {dealers.length > 0 ? (
            <div className="agents-rail-wrapper">
              <div
                ref={viewportRef}
                className="agents-rail-viewport"
                data-testid="dealers-marquee"
                data-auto-play="true"
                role="region"
                aria-label="Dealers and agencies"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                    event.preventDefault();
                    pauseForUser();
                    scrollByCards(event.key === "ArrowLeft" ? -1 : 1);
                  }
                }}
                onPointerDown={(event) => {
                  dragged.current = false;
                  pauseForUser();
                  if (event.pointerType === "mouse") {
                    drag.current = {
                      pointer: event.pointerId,
                      x: event.clientX,
                      left: event.currentTarget.scrollLeft,
                      moved: false,
                    };
                  }
                }}
                onPointerMove={(event) => {
                  const current = drag.current;
                  if (!current || current.pointer !== event.pointerId) return;
                  const delta = event.clientX - current.x;
                  if (!current.moved && Math.abs(delta) < 6) return;
                  current.moved = true;
                  dragged.current = true;
                  event.currentTarget.dataset.dragging = "true";
                  if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
                    event.currentTarget.setPointerCapture(event.pointerId);
                  }
                  event.currentTarget.scrollLeft = current.left - delta;
                }}
                onPointerUp={(event) => {
                  drag.current = null;
                  delete event.currentTarget.dataset.dragging;
                  if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                    event.currentTarget.releasePointerCapture(event.pointerId);
                  }
                }}
                onPointerCancel={() => {
                  drag.current = null;
                  if (viewportRef.current) delete viewportRef.current.dataset.dragging;
                }}
                onWheel={pauseForUser}
                onFocusCapture={() => setFocused(true)}
                onBlurCapture={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
                }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onClickCapture={(event) => {
                  if (dragged.current) {
                    event.preventDefault();
                    event.stopPropagation();
                    dragged.current = false;
                  }
                }}
              >
                <ul className="agents-rail-track" aria-label="Verified dealer profiles">
                  {dealers.map((dealer, index) => {
                    const fallbackAvatar = AGENT_AVATARS[index % AGENT_AVATARS.length];
                    const avatarSrc = dealer.avatarUrl || dealer.companyLogo || fallbackAvatar;
                    const displayName = dealer.name?.trim() || "Property Advisor";
                    /**
                     * Identity order on the card: the agency name leads (with the
                     * verification tick beside it), the person's name sits under it.
                     * Dealers without a company fall back to the person's name on
                     * top so every card keeps the same two-line rhythm.
                     */
                    const agencyName = dealer.agency?.trim();
                    const topLabel = agencyName || displayName;
                    const secondaryLabel = agencyName ? displayName : "";
                    const specialty = AGENT_SPECIALTIES[index % AGENT_SPECIALTIES.length];
                    const ratingCount =
                      dealer.listings > 0
                        ? Math.max(12, dealer.listings * 4 + (index % 7))
                        : AGENT_RATINGS[index % AGENT_RATINGS.length];

                    return (
                      <li key={`${dealer.id}-${index}`} className="agents-rail-item">
                        <Link
                          href={dealer.slug ? `/dealers/${dealer.slug}` : "/dealers"}
                          className="agent-expert-card group"
                        >
                          <div className="agent-expert-top">
                            <span className="agent-expert-avatar">
                              <ResilientImage
                                src={avatarSrc}
                                fallbackSrc={fallbackAvatar}
                                alt={topLabel}
                                data-agency-placeholder={!dealer.companyLogo && !dealer.avatarUrl ? "true" : undefined}
                                width={112}
                                height={112}
                                loading="lazy"
                                draggable={false}
                                className="h-full w-full object-cover"
                              />
                            </span>
                            <div className="agent-expert-meta">
                              <p className="agent-expert-agency">
                                <span className="truncate">{topLabel}</span>
                                {dealer.isVerified && <BlueTick className="h-3.5 w-3.5 shrink-0 text-[#0E3B2C]" />}
                              </p>
                              {secondaryLabel ? <p className="agent-expert-name truncate">{secondaryLabel}</p> : null}
                              <p className="agent-expert-city">{dealer.cityName || "Pakistan"}</p>
                              {!secondaryLabel ? <p className="agent-expert-specialty">{specialty}</p> : null}
                            </div>
                          </div>

                          <div className="agent-expert-rating" aria-label={`5 out of 5 stars (${ratingCount})`}>
                            <span className="agent-expert-stars" aria-hidden="true">
                              {[0, 1, 2, 3, 4].map((star) => (
                                <IconStarFilled key={star} className="h-3.5 w-3.5 text-[#DFB872]" />
                              ))}
                            </span>
                            <span className="agent-expert-reviews">({ratingCount})</span>
                          </div>

                          <div className="agent-expert-footer">
                            <span className="agent-expert-pill">
                              {dealer.listings > 0 ? `${dealer.listings} Listings` : "Verified"}
                            </span>
                            <span className="agent-expert-pill">{agencyName ? agencyName.split(" ")[0] : "Expert"}</span>
                            <span className="agent-expert-arrow" aria-hidden="true">
                              ›
                            </span>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {dealers.length > 4 && (
                <button
                  type="button"
                  aria-label="Next dealers and agencies"
                  onClick={() => {
                    pauseForUser();
                    scrollByCards(1);
                  }}
                  className="rail-floating-next rail-floating-next--dark"
                >
                  <IconArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          ) : (
            <p className="mt-3 text-sm text-white/75">
              No agency profiles yet.{" "}
              <Link href="/login?mode=register" className="font-semibold text-[#DFB872] underline">
                Create a dealer account
              </Link>
              .
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
