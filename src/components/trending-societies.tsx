"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import { IconArrowRight } from "@/components/icons";

type SocietyRailItem = {
  name: string;
  city: string;
  href: string;
  logo: string;
  logoClass: string;
};

/** Keep this rail intentionally curated: the four original entries plus the six requested additions. */
const SOCIETIES: SocietyRailItem[] = [
  { name: "DHA", city: "Lahore", href: "/property-for-sale/dha-lahore", logo: "/images/societies/dha-lahore.webp?v=3", logoClass: "dha" },
  { name: "Bahria Town", city: "Lahore", href: "/property-for-sale/bahria-town-lahore", logo: "/images/societies/bahria-town.webp?v=3", logoClass: "bahria" },
  { name: "Lake City", city: "Lahore", href: "/property-for-sale/lake-city-lahore", logo: "/images/societies/lake-city.webp?v=3", logoClass: "lake-city" },
  { name: "Al-Kabir Town", city: "Lahore", href: "/property-for-sale/al-kabir-town-lahore", logo: "/images/societies/al-kabir-town.webp?v=3", logoClass: "al-kabir" },
  { name: "Etihad Town", city: "Lahore", href: "/property-for-sale/etihad-town-lahore", logo: "/images/societies/etihad-town.webp?v=3", logoClass: "etihad" },
  // Kings Town is an Al-Kabir Town Phase 3 community; its supplied mark is the developer's logo.
  { name: "Kings Town", city: "Lahore", href: "/property-for-sale/kings-town-lahore", logo: "/images/societies/kings-town.webp?v=3", logoClass: "kings" },
  { name: "New Lahore City", city: "Lahore", href: "/property-for-sale/new-lahore-city", logo: "/images/societies/new-lahore-city-official.webp?v=3", logoClass: "new-lahore-city" },
  // Jubilee Town and LDA Avenue use the LDA mark because they are LDA-developed schemes.
  { name: "Jubilee Town", city: "Lahore", href: "/property-for-sale/jubilee-town-lahore", logo: "/images/societies/jubilee-town.webp?v=3", logoClass: "jubilee" },
  { name: "Valencia Town", city: "Lahore", href: "/property-for-sale/valencia-town-lahore", logo: "/images/societies/valencia-town.webp?v=3", logoClass: "valencia" },
  { name: "LDA Avenue", city: "Lahore", href: "/property-for-sale/lda-avenue-lahore", logo: "/images/societies/lda-avenue.webp?v=3", logoClass: "lda-avenue" },
];

const LOOP_SOCIETIES = [...SOCIETIES, ...SOCIETIES];

/** Calm luxury cadence: pause clearly on each card, then glide one card with a cushioned ease. */
const INITIAL_HOLD_MS = 1600;
const STEP_HOLD_MS = 2300;
const STEP_GLIDE_MS = 680;
const ARROW_GLIDE_MS = 520;

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

type GlideState = {
  active: boolean;
  from: number;
  to: number;
  start: number;
  duration: number;
};

export function TrendingSocieties() {
  const railRef = useRef<HTMLDivElement | null>(null);
  const hoveredCardRef = useRef<boolean>(false);
  const manualPauseUntilRef = useRef<number>(0);
  const holdUntilRef = useRef<number>(0);
  const glideRef = useRef<GlideState>({
    active: false,
    from: 0,
    to: 0,
    start: 0,
    duration: STEP_GLIDE_MS,
  });

  const getStepMetrics = useCallback(() => {
    const rail = railRef.current;
    if (!rail || rail.children.length <= SOCIETIES.length) {
      return { step: 0, half: 0 };
    }
    const first = rail.children[0] as HTMLElement;
    const second = rail.children[1] as HTMLElement | undefined;
    const mid = rail.children[SOCIETIES.length] as HTMLElement;
    const step = second ? second.offsetLeft - first.offsetLeft : first.offsetWidth + 16;
    const half = mid.offsetLeft - first.offsetLeft;
    return { step, half };
  }, []);

  const pauseForManual = useCallback((ms = 2600) => {
    const now = performance.now();
    glideRef.current.active = false;
    manualPauseUntilRef.current = now + ms;
    holdUntilRef.current = now + ms;
  }, []);

  const scrollByDirection = useCallback(
    (direction: -1 | 1) => {
      const rail = railRef.current;
      if (!rail) return;
      const { step, half } = getStepMetrics();
      if (step <= 0 || half <= 0) return;

      const now = performance.now();
      let current = rail.scrollLeft;

      if (direction < 0 && current < step * 2) {
        current += half;
        rail.scrollLeft = current;
      } else if (direction > 0 && current >= half) {
        current -= half;
        rail.scrollLeft = current;
      }

      const currentSlot = Math.round(current / step);
      const targetSlot = Math.max(0, currentSlot + direction * 2);

      manualPauseUntilRef.current = 0;
      glideRef.current = {
        active: true,
        from: current,
        to: targetSlot * step,
        start: now,
        duration: ARROW_GLIDE_MS,
      };
      holdUntilRef.current = now + ARROW_GLIDE_MS + STEP_HOLD_MS;
    },
    [getStepMetrics],
  );

  useEffect(() => {
    holdUntilRef.current = performance.now() + INITIAL_HOLD_MS;
    let rafId = 0;

    const tick = (now: number) => {
      const el = railRef.current;
      if (el && !document.hidden) {
        const glide = glideRef.current;

        if (glide.active) {
          const progress = Math.min(1, Math.max(0, (now - glide.start) / glide.duration));
          const eased = easeInOutCubic(progress);
          const nextLeft = glide.from + (glide.to - glide.from) * eased;

          if (progress >= 1) {
            const { half } = getStepMetrics();
            const settled = half > 0 && glide.to >= half ? glide.to - half : glide.to;
            el.scrollLeft = settled;
            glide.active = false;
            holdUntilRef.current = Math.max(holdUntilRef.current, now + STEP_HOLD_MS);
          } else {
            el.scrollLeft = nextLeft;
          }
        } else if (hoveredCardRef.current || now < manualPauseUntilRef.current) {
          holdUntilRef.current = Math.max(holdUntilRef.current, now + 900);
        } else if (now >= holdUntilRef.current) {
          const { step, half } = getStepMetrics();
          if (step > 0 && half > 0) {
            let current = el.scrollLeft;
            if (current >= half) {
              current -= half;
              el.scrollLeft = current;
            }
            const nextSlot = Math.round(current / step) + 1;
            glideRef.current = {
              active: true,
              from: current,
              to: nextSlot * step,
              start: now,
              duration: STEP_GLIDE_MS,
            };
          } else {
            holdUntilRef.current = now + 800;
          }
        }
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [getStepMetrics]);

  return (
    <section className="home-societies-section" aria-labelledby="home-societies-heading">
      <div className="ui-container">
        <div className="home-societies-showcase">
          <div className="home-mobile-section-heading">
            <div className="home-societies-heading-copy">
              <p className="home-mobile-eyebrow">Explore Pakistan&apos;s Premier Communities</p>
              <h2 id="home-societies-heading">Trending Societies</h2>
            </div>
            <div className="home-societies-actions">
              <Link href="/towns" className="home-mobile-view-all">
                <span>View All Societies</span>
                <IconArrowRight className="h-3.5 w-3.5" />
              </Link>
              <div className="home-societies-nav">
                <button
                  type="button"
                  className="home-societies-nav-btn"
                  aria-label="Previous trending societies"
                  onClick={() => scrollByDirection(-1)}
                >
                  <IconArrowRight className="h-4 w-4 rotate-180" />
                </button>
                <button
                  type="button"
                  className="home-societies-nav-btn"
                  aria-label="Next trending societies"
                  onClick={() => scrollByDirection(1)}
                >
                  <IconArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="home-societies-autoplay" data-testid="trending-societies-rail">
            <div
              ref={railRef}
              role="list"
              aria-label="Trending Lahore housing societies"
              tabIndex={0}
              onPointerDown={() => pauseForManual(2800)}
              onTouchStart={() => pauseForManual(2800)}
              onWheel={() => pauseForManual(2200)}
              className="home-societies-rail"
            >
              {LOOP_SOCIETIES.map((society, index) => {
                const isClone = index >= SOCIETIES.length;
                return (
                  <Link
                    key={`${society.href}-${index}`}
                    href={society.href}
                    className="home-society-card"
                    role={isClone ? undefined : "listitem"}
                    aria-hidden={isClone ? "true" : undefined}
                    tabIndex={isClone ? -1 : undefined}
                    aria-label={isClone ? undefined : `${society.name}, ${society.city}`}
                    onMouseEnter={() => {
                      hoveredCardRef.current = true;
                    }}
                    onMouseLeave={() => {
                      hoveredCardRef.current = false;
                    }}
                    onFocus={() => {
                      hoveredCardRef.current = true;
                    }}
                    onBlur={() => {
                      hoveredCardRef.current = false;
                    }}
                  >
                    <span className={`home-society-image home-society-image--${society.logoClass}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={society.logo}
                        alt=""
                        aria-hidden="true"
                        width={96}
                        height={96}
                        loading="eager"
                        decoding="async"
                        draggable={false}
                        className="home-society-logo"
                      />
                    </span>
                    <span className="home-society-copy">
                      <span className="home-society-name">{society.name}</span>
                      <span className="home-society-meta">{society.city}</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
