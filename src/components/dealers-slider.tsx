"use client";

import Link from "next/link";
import { useRef } from "react";
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

export function DealersSlider({ dealers }: { dealers: DealerProfile[] }) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const drag = useRef<{ pointer: number; x: number; left: number; moved: boolean } | null>(null);
  const dragged = useRef(false);

  function scrollByCards(direction: -1 | 1) {
    const el = viewportRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * 280, behavior: "smooth" });
  }

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
                role="region"
                aria-label="Dealers and agencies"
                tabIndex={0}
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
