"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconArrowRight, IconClose, IconPin } from "@/components/icons";
import { ResilientImage } from "@/components/resilient-image";
import { formatArea, formatPrice } from "@/lib/format";
import {
  ASSISTANT_QUICK_REPLIES,
  planFor,
  searchReply,
  welcomeReply,
  type AssistantFilters,
  type AssistantListing,
  type AssistantReply,
} from "@/lib/assistant";

type Turn = {
  id: string;
  role: "user" | "assistant";
  reply?: AssistantReply;
};

/** Paths whose phone viewport already pins a Call / WhatsApp bar to the bottom edge. */
const STICKY_BAR_PATHS = [/^\/property\/[^/]+/];

let counter = 0;
const nextId = () => `turn-${++counter}`;

function WordbitXAiOrb({ compact = false }: { compact?: boolean }) {
  return (
    <span className={compact ? "ai-orb ai-orb--compact" : "ai-orb"} aria-hidden="true">
      <span className="ai-orb-pulse" />
      <span className="ai-orb-ring" />
      <span className="ai-orb-core">
        <svg viewBox="0 0 24 24" className="ai-orb-svg" fill="none">
          <path
            className="ai-orb-star-main"
            d="M11.2 2.8 13.1 8.5l5.7 1.9-5.7 1.9-1.9 5.7-1.9-5.7-5.7-1.9 5.7-1.9 1.9-5.7Z"
            fill="currentColor"
          />
          <path
            className="ai-orb-star-sub"
            d="M18.6 14.2l.9 2.5 2.5.9-2.5.9-.9 2.5-.9-2.5-2.5-.9 2.5-.9.9-2.5Z"
            fill="#FEF08A"
          />
          <circle className="ai-orb-dot" cx="5.5" cy="5.5" r="1.4" fill="#86EFAC" />
        </svg>
      </span>
    </span>
  );
}

/**
 * WordbitX-inspired animated AI assistant that answers property questions from
 * this website's own inventory and tools on both mobile and desktop viewports.
 */
export function AiAssistant() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [turns, setTurns] = useState<Turn[]>(() => [
    { id: nextId(), role: "assistant", reply: welcomeReply() },
  ]);
  const [pending, setPending] = useState(false);
  const [draft, setDraft] = useState("");
  const [filters, setFilters] = useState<AssistantFilters | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const logRef = useRef<HTMLDivElement | null>(null);
  const hasStickyBar = STICKY_BAR_PATHS.some((pattern) => pattern.test(pathname));

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [turns, pending]);

  async function send(message: string) {
    const text = message.trim();
    if (!text || pending) return;
    setDraft("");
    setTurns((current) => [...current, { id: nextId(), role: "user", reply: { text } }]);
    setPending(true);
    await new Promise((resolve) => setTimeout(resolve, 420));
    const plan = planFor(text, filters);
    let reply: AssistantReply;
    if (plan.kind === "search") {
      try {
        const response = await fetch(`/api/properties?${plan.query}&pageSize=4`);
        const payload = (await response.json()) as {
          ok?: boolean;
          items?: AssistantListing[];
          total?: number;
        };
        const items = payload.ok && Array.isArray(payload.items) ? payload.items : [];
        reply = searchReply(plan, items, payload.total ?? items.length);
        setFilters(plan.filters);
      } catch {
        reply = {
          text: "I couldn't reach the listings service just now. Please try again in a moment.",
        };
      }
    } else {
      reply = plan.reply;
    }
    setTurns((current) => [...current, { id: nextId(), role: "assistant", reply }]);
    setPending(false);
  }

  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/auth") ||
    pathname === "/login"
  ) {
    return null;
  }

  return (
    <div
      className="ai-assistant"
      data-open={open ? "true" : undefined}
      data-sticky-bar={hasStickyBar ? "true" : undefined}
    >
      {open && (
        <section
          id="ai-assistant-panel"
          className="ai-panel"
          role="dialog"
          aria-label="Properties Pak AI assistant"
          aria-modal="false"
        >
          <header className="ai-panel-head">
            <WordbitXAiOrb compact />
            <span className="ai-panel-title">
              <span className="ai-panel-title-row">
                <strong>Properties Pak AI</strong>
                <span className="ai-header-badge">
                  <span className="ai-live-dot" />
                  LIVE
                </span>
              </span>
              <span>WordbitX AI · Instant listings, prices &amp; tools</span>
            </span>
            <button
              type="button"
              className="ai-panel-close"
              aria-label="Close the assistant"
              onClick={() => setOpen(false)}
            >
              <IconClose className="h-4 w-4" />
            </button>
          </header>

          <div
            className="ai-log"
            ref={logRef}
            role="log"
            aria-live="polite"
            aria-label="Assistant conversation"
          >
            {turns.map((turn) => (
              <article key={turn.id} className={`ai-turn ai-turn--${turn.role}`}>
                <p className="ai-bubble">{turn.reply?.text}</p>
                {turn.reply?.links && turn.reply.links.length > 0 && (
                  <ul className="ai-links">
                    {turn.reply.links.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} onClick={() => setOpen(false)}>
                          <span>{link.label}</span>
                          {link.note && <em>{link.note}</em>}
                          <IconArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                {turn.reply?.listings && turn.reply.listings.length > 0 && (
                  <ul className="ai-listings">
                    {turn.reply.listings.map((property) => (
                      <li key={property.id}>
                        <Link
                          href={`/property/${property.slug}`}
                          onClick={() => setOpen(false)}
                        >
                          <ResilientImage
                            src={property.coverImage || "/images/property-placeholder.svg"}
                            alt=""
                            width={120}
                            height={90}
                            loading="lazy"
                            decoding="async"
                            className="ai-listing-image"
                          />
                          <span className="ai-listing-body">
                            <strong>{property.title}</strong>
                            <span className="ai-listing-price">
                              {formatPrice(property.price, property.priceUnit)}
                            </span>
                            <span className="ai-listing-meta">
                              <IconPin className="h-3 w-3" />
                              {property.locationArea}, {property.cityName}
                              {property.areaValue > 0 &&
                                ` · ${formatArea(property.areaValue, property.areaUnit)}`}
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                {turn.reply?.moreHref && (
                  <Link
                    className="ai-more"
                    href={turn.reply.moreHref}
                    onClick={() => setOpen(false)}
                  >
                    {turn.reply.moreLabel ?? "View all"}
                    <IconArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </article>
            ))}
            {pending && (
              <article className="ai-turn ai-turn--assistant">
                <p
                  className="ai-bubble ai-bubble--typing"
                  aria-label="The assistant is searching"
                >
                  <span />
                  <span />
                  <span />
                </p>
              </article>
            )}
          </div>

          {turns.length <= 1 && (
            <ul className="ai-chips" aria-label="Suggested questions">
              {ASSISTANT_QUICK_REPLIES.map((chip) => (
                <li key={chip}>
                  <button type="button" onClick={() => void send(chip)}>
                    {chip}
                  </button>
                </li>
              ))}
            </ul>
          )}

          <form
            className="ai-composer"
            onSubmit={(event) => {
              event.preventDefault();
              void send(draft);
            }}
          >
            <label className="sr-only" htmlFor="ai-assistant-input">
              Ask about properties, prices or tools
            </label>
            <input
              id="ai-assistant-input"
              ref={inputRef}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ask AI about properties, prices or areas…"
              autoComplete="off"
              enterKeyHint="send"
            />
            <button
              type="submit"
              disabled={!draft.trim() || pending}
              aria-label="Send your question"
            >
              <IconArrowRight className="h-4 w-4" />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        className={`ai-launcher ${open ? "ai-launcher--open" : ""}`}
        aria-expanded={open}
        aria-controls="ai-assistant-panel"
        aria-label={
          open
            ? "Close the Properties Pak AI assistant"
            : "Open the Properties Pak Ask AI assistant"
        }
        title={open ? "Close assistant" : "Ask AI Assistant"}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="ai-launcher-glow" aria-hidden="true" />
        <span className="ai-launcher-shimmer" aria-hidden="true" />
        {open ? (
          <span className="ai-launcher-close-icon" aria-hidden="true">
            <IconClose className="h-5 w-5" />
          </span>
        ) : (
          <>
            <WordbitXAiOrb />
            <span className="ai-launcher-label">
              <span className="ai-launcher-title">
                Ask AI
                <span className="ai-live-dot" aria-hidden="true" />
              </span>
              <span className="ai-launcher-subtitle">Instant Finder</span>
            </span>
          </>
        )}
      </button>
    </div>
  );
}
