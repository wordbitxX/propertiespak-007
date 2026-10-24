"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { IconArrowRight } from "@/components/icons";

/** A native horizontal rail with optional paused auto-advancement at every breakpoint. */
export function MobileScrollGrid({
  children,
  label,
  autoPlay = false,
  autoPlayMobileOnly = false,
  autoPlayInterval = 4200,
  autoPlayStartDelay = 0,
  className = "",
  trackClassName = "",
  trackRole,
  trackAriaLabel,
  testId = "scroll-rail",
}: {
  children: ReactNode;
  label: string;
  autoPlay?: boolean;
  autoPlayMobileOnly?: boolean;
  autoPlayInterval?: number;
  autoPlayStartDelay?: number;
  className?: string;
  trackClassName?: string;
  trackRole?: "list";
  trackAriaLabel?: string;
  testId?: string;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const interactionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [position, setPosition] = useState({ left: 0, full: 0, width: 0 });
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [interactionPaused, setInteractionPaused] = useState(false);
  const [mobileViewport, setMobileViewport] = useState(false);
  const activeAutoPlay = autoPlay && (!autoPlayMobileOnly || mobileViewport);

  useEffect(() => {
    if (!autoPlayMobileOnly) return;
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setMobileViewport(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [autoPlayMobileOnly]);

  const measure = useCallback(() => {
    const element = viewportRef.current;
    if (element) setPosition({ left: element.scrollLeft, full: element.scrollWidth, width: element.clientWidth });
  }, []);

  const pauseForUser = useCallback(() => {
    setInteractionPaused(true);
    if (interactionTimerRef.current) clearTimeout(interactionTimerRef.current);
    interactionTimerRef.current = setTimeout(() => {
      interactionTimerRef.current = null;
      setInteractionPaused(false);
    }, 5000);
  }, []);

  useEffect(() => {
    const element = viewportRef.current;
    if (!element) return;
    const frame = requestAnimationFrame(measure);
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    for (const child of Array.from(element.children)) observer.observe(child);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); };
  }, [measure]);

  useEffect(() => () => {
    if (interactionTimerRef.current) clearTimeout(interactionTimerRef.current);
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!activeAutoPlay || !viewport || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let visible = false;
    const visibility = new IntersectionObserver((entries) => {
      visible = entries.some((entry) => entry.isIntersecting);
    }, { threshold: 0.15 });
    visibility.observe(viewport);

    const advance = () => {
      const rail = viewportRef.current;
      if (!rail || !visible || document.hidden || hovered || focused || interactionPaused) return;
      const maxScroll = rail.scrollWidth - rail.clientWidth;
      if (maxScroll <= 2) return;
      if (rail.scrollLeft >= maxScroll - 2) {
        rail.scrollTo({ left: 0, behavior: "smooth" });
        return;
      }
      const card = rail.firstElementChild as HTMLElement | null;
      const gap = parseFloat(getComputedStyle(rail).columnGap || getComputedStyle(rail).gap) || 14;
      rail.scrollBy({ left: (card?.getBoundingClientRect().width ?? 276) + gap, behavior: "smooth" });
    };
    const timer = window.setInterval(advance, autoPlayInterval);
    const initialTimer = autoPlayStartDelay > 0 ? window.setTimeout(advance, autoPlayStartDelay) : null;

    return () => {
      window.clearInterval(timer);
      if (initialTimer) window.clearTimeout(initialTimer);
      visibility.disconnect();
    };
  }, [activeAutoPlay, autoPlayInterval, autoPlayStartDelay, hovered, focused, interactionPaused]);

  function move(direction: -1 | 1) {
    const element = viewportRef.current;
    if (!element) return;
    const card = element.firstElementChild as HTMLElement | null;
    const gap = parseFloat(getComputedStyle(element).columnGap || getComputedStyle(element).gap) || 14;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    element.scrollBy({ left: direction * ((card?.getBoundingClientRect().width ?? 276) + gap), behavior: reducedMotion ? "instant" : "smooth" });
    if (activeAutoPlay) pauseForUser();
  }

  return <div
    className={`mobile-scroll-grid${activeAutoPlay ? " mobile-scroll-grid--autoplay" : ""}${className ? ` ${className}` : ""}`}
    data-testid={testId}
    data-auto-play={activeAutoPlay ? "true" : undefined}
    data-auto-play-interval={activeAutoPlay ? autoPlayInterval : undefined}
    onMouseEnter={() => { if (activeAutoPlay) setHovered(true); }}
    onMouseLeave={() => { if (activeAutoPlay) setHovered(false); }}
    onFocusCapture={() => { if (activeAutoPlay) setFocused(true); }}
    onBlurCapture={(event) => {
      if (activeAutoPlay && !event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
    }}
  >
    <div className="mobile-scroll-toolbar">
      <span>{activeAutoPlay ? "Auto-advances with pauses" : "Swipe to explore"}</span>
      <div className="property-rail-controls">
        <button type="button" aria-label={`Previous ${label.toLowerCase()}`} disabled={position.left < 2} onClick={() => move(-1)}><IconArrowRight className="h-4 w-4 rotate-180" /></button>
        <button type="button" aria-label={`Next ${label.toLowerCase()}`} disabled={position.width > 0 && position.left + position.width >= position.full - 2} onClick={() => move(1)}><IconArrowRight className="h-4 w-4" /></button>
      </div>
    </div>
    <div
      ref={viewportRef}
      role={trackRole ?? "region"}
      aria-label={trackAriaLabel ?? label}
      tabIndex={0}
      onScroll={measure}
      onPointerDown={() => { if (activeAutoPlay) pauseForUser(); }}
      onWheel={() => { if (activeAutoPlay) pauseForUser(); }}
      className={`mobile-scroll-track${trackClassName ? ` ${trackClassName}` : ""}`}
    >{children}</div>
  </div>;
}
