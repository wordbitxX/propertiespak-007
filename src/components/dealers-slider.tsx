"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { IconArrowRight } from "@/components/icons";
import { ResilientImage } from "@/components/resilient-image";
import { BlueTick } from "@/components/verified-badge";
import { useLanguage } from "@/components/language-provider";
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

const AGENTS_AUTO_SCROLL_MS = 3200;

export function DealersSlider({ dealers }: { dealers: DealerProfile[] }) {
  const { t } = useLanguage();
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const drag = useRef<{ pointer: number; x: number; left: number; moved: boolean } | null>(null);
  const dragged = useRef(false);
  const interactionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [interactionPaused, setInteractionPaused] = useState(false);

  const pauseForUser = useCallback(() => {
    setInteractionPaused(true);
    if (interactionTimerRef.current) clearTimeout(interactionTimerRef.current);
    interactionTimerRef.current = setTimeout(() => {
      interactionTimerRef.current = null;
      setInteractionPaused(false);
    }, 5000);
  }, []);

  function scrollByCards(direction: -1 | 1) {
    const el = viewportRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * 280, behavior: "smooth" });
  }

  useEffect(() => () => {
    if (interactionTimerRef.current) clearTimeout(interactionTimerRef.current);
  }, []);

  /**
   * Auto-scroll, mirroring the Premium Properties rail: the experts rail
   * drifts one card at a time while it is on screen, pauses on hover, focus
   * or any manual interaction (resuming after 5 s), wraps back to the start
   * at the end, and never runs for visitors who prefer reduced motion.
   */
  useEffect(() => {
    if (dealers.length <= 1 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
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
      const track = rail.querySelector<HTMLElement>(".agents-rail-track");
      const card = rail.querySelector<HTMLElement>(".agents-rail-item");
      const gap = track ? parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 14 : 14;
      const step = (card?.getBoundingClientRect().width ?? 280) + gap;
      if (rail.scrollLeft >= maxScroll - 2) {
        rail.scrollTo({ left: 0, behavior: "smooth" });
        return;
      }
      rail.scrollBy({ left: step, behavior: "smooth" });
    }, AGENTS_AUTO_SCROLL_MS);

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
            <p className="agents-banner-eyebrow">TOP VERIFIED AGENCIES</p>
            <h2 id="home-dealers-heading" className="agents-banner-title">
              Platinum Agency
            </h2>
            <p className="agents-banner-copy">
              Pakistan’s top-rated, verified real estate agencies — hand-picked for trusted, hassle-free deals.
            </p>
            <div className="agents-banner-actions">
              <Link href="/dealers" className="btn btn-gold agents-banner-cta">
                <span>View All Agencies</span>
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
                data-auto-scroll="true"
                role="region"
                aria-label="Dealers and agencies"
                tabIndex={0}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onFocusCapture={() => setFocused(true)}
                onBlurCapture={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
                }}
                onWheel={() => pauseForUser()}
                onKeyDown={(event) => {
                  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                    event.preventDefault();
                    scrollByCards(event.key === "ArrowLeft" ? -1 : 1);
                  }
                }}
                onPointerDown={(event) => {
                  dragged.current = false;
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
                    const displayName = dealer.name?.trim() || dealer.agency?.trim() || "Property Advisor";
                    const specialty = AGENT_SPECIALTIES[index % AGENT_SPECIALTIES.length];

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
                                alt={displayName}
                                data-agency-placeholder={!dealer.companyLogo && !dealer.avatarUrl ? "true" : undefined}
                                width={112}
                                height={112}
                                loading="lazy"
                                draggable={false}
                                className="h-full w-full object-cover"
                              />
                            </span>
                            <div className="agent-expert-meta">
                              <p className="agent-expert-name">
                                <span className="truncate">{displayName}</span>
                                {dealer.isVerified && <BlueTick className="h-3.5 w-3.5 shrink-0 text-[#0E3B2C]" />}
                              </p>
                              <p className="agent-expert-city">{dealer.cityName || "Pakistan"}</p>
                              <p className="agent-expert-specialty">{specialty}</p>
                            </div>
                          </div>

                          <div className="agent-expert-rating">
                            <span className="agent-expert-reviews">
                              {dealer.isVerified ? "Verified by Properties Pak" : "Profile in review"}
                              {dealer.verifiedListings > 0 ? ` · ${dealer.verifiedListings} verified listings` : ""}
                            </span>
                          </div>

                          <div className="agent-expert-footer">
                            <span className="agent-expert-pill">
                              {dealer.listings > 0 ? `${dealer.listings} Listings` : "Verified"}
                            </span>
                            <span className="agent-expert-pill">{dealer.agency?.split(" ")[0] || "Expert"}</span>
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
                  onClick={() => scrollByCards(1)}
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
