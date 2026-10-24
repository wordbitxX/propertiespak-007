"use client";

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { useLanguage } from "@/components/language-provider";
import { budgetRangeLabel, formatBudgetDigits, formatBudgetShort, parseBudget } from "@/lib/budget";
import type { LocationSuggestion } from "@/lib/location-suggest";
import type { NearMeResult } from "@/lib/near-me";

export type LocatedPlace = Extract<NearMeResult, { status: "near" | "city" }>;

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

function Svg({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}
const PinIcon = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.4" />
  </Svg>
);
const CityIcon = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <path d="M3.5 20.5h17M5.5 20.5V9.5l5-3v14M10.5 20.5V4.5l8 3.5v12.5M13.5 10h2M13.5 13.5h2M13.5 17h2M7.5 12.5h1M7.5 16h1" />
  </Svg>
);
const SocietyIcon = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <path d="M3.5 10.5 12 3.8l8.5 6.7M5.5 9v11h13V9M10 20v-5.5h4V20" />
  </Svg>
);
const GridIcon = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <rect x="4" y="4" width="7" height="7" rx="1.2" />
    <rect x="13" y="4" width="7" height="7" rx="1.2" />
    <rect x="4" y="13" width="7" height="7" rx="1.2" />
    <rect x="13" y="13" width="7" height="7" rx="1.2" />
  </Svg>
);
const ChevronIcon = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <path d="m6.5 9.5 5.5 5.5 5.5-5.5" />
  </Svg>
);
/** GPS "locate me" crosshair. */
const LocateIcon = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <circle cx="12" cy="12" r="6.2" />
    <circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none" />
    <path d="M12 2.8v3M12 18.2v3M2.8 12h3M18.2 12h3" />
  </Svg>
);
const CloseIcon = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Svg>
);

function KindIcon({ kind }: { kind: LocationSuggestion["kind"] }) {
  if (kind === "city") return <CityIcon className="hs-opt-icon" />;
  if (kind === "society") return <SocietyIcon className="hs-opt-icon" />;
  if (kind === "phase" || kind === "sector" || kind === "block") return <GridIcon className="hs-opt-icon" />;
  return <PinIcon className="hs-opt-icon" />;
}

/** Bolds the part of `label` that matches what the user typed. */
function Highlight({ label, query }: { label: string; query: string }) {
  const q = query.trim();
  if (!q) return <>{label}</>;
  const lower = label.toLowerCase();
  const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);
  // Prefer a word-start match, fall back to any match of the first token.
  let start = -1;
  let length = 0;
  for (const token of tokens) {
    const wordStart = lower.search(new RegExp(`(^|[^a-z0-9])${token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`));
    const index = wordStart >= 0 ? (wordStart === 0 && lower.startsWith(token) ? 0 : wordStart + 1) : lower.indexOf(token);
    if (index >= 0) {
      start = index;
      length = token.length;
      break;
    }
  }
  if (start < 0) return <>{label}</>;
  return (
    <>
      {label.slice(0, start)}
      <mark>{label.slice(start, start + length)}</mark>
      {label.slice(start + length)}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Location field with live suggestions                                */
/* ------------------------------------------------------------------ */

const GEO_MESSAGES = {
  denied: "Location access is blocked. Allow it from your browser's address bar, or type an area.",
  failed: "We couldn't detect your location. Please try again or type an area.",
  unsupported: "Your browser can't share its location. Please type a city or area.",
  outside: "You seem to be outside Pakistan. Type a city or area to search.",
  empty: "No listings are live right now. Please try again later.",
} as const;

export function HeroLocationField({
  value,
  onChange,
  onPick,
  purpose,
  onLocate,
  searchPlaceholder = "Enter city or area",
}: {
  value: string;
  onChange: (value: string) => void;
  onPick: (suggestion: LocationSuggestion | null) => void;
  /** Sent to the near-me resolver so the radius is sized for sale or rent listings. */
  purpose: string;
  onLocate: (place: LocatedPlace) => void;
  searchPlaceholder?: string;
}) {
  const { t } = useLanguage();
  const id = useId();
  const listId = `${id}-list`;
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const cache = useRef(new Map<string, LocationSuggestion[]>());
  const [items, setItems] = useState<LocationSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  /** Query the current `items` belong to ("" = the popular list). */
  const [itemsQuery, setItemsQuery] = useState("");
  const [locating, setLocating] = useState(false);
  const [note, setNote] = useState("");
  /** Latest typed text, read by handlers that can fire before React re-renders. */
  const valueRef = useRef(value);
  const timer = useRef<number | null>(null);
  const controller = useRef<AbortController | null>(null);

  // Suggestions for `text`: instant from cache, otherwise a short debounced fetch.
  const request = useCallback((text: string) => {
    const key = text.trim().toLowerCase();
    if (timer.current) window.clearTimeout(timer.current);
    controller.current?.abort();
    const cached = cache.current.get(key);
    if (cached) {
      setItems(cached);
      setItemsQuery(key);
      setActive(-1);
      return;
    }
    timer.current = window.setTimeout(async () => {
      const current = new AbortController();
      controller.current = current;
      try {
        const response = await fetch(`/api/locations/suggest?q=${encodeURIComponent(key)}`, { signal: current.signal });
        const data = (await response.json()) as { results?: LocationSuggestion[] };
        const results = data.results ?? [];
        cache.current.set(key, results);
        setItems(results);
        setItemsQuery(key);
        setActive(-1);
      } catch {
        /* aborted or offline — keep the previous list */
      }
    }, key ? 110 : 0);
  }, []);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
      controller.current?.abort();
    },
    [],
  );

  useEffect(() => {
    const onDocument = (event: MouseEvent | TouchEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocument);
    document.addEventListener("touchstart", onDocument, { passive: true });
    return () => {
      document.removeEventListener("mousedown", onDocument);
      document.removeEventListener("touchstart", onDocument);
    };
  }, []);

  /** Browser geolocation → nearest named area + a radius that has listings. */
  const locate = useCallback(() => {
    setOpen(false);
    setNote("");
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setNote(GEO_MESSAGES.unsupported);
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `/api/locations/near?lat=${latitude.toFixed(5)}&lng=${longitude.toFixed(5)}&purpose=${encodeURIComponent(purpose)}`,
          );
          const result = (await response.json()) as NearMeResult;
          if (result.status === "near" || result.status === "city") {
            valueRef.current = result.label;
            onLocate(result);
          } else {
            setNote(result.status === "outside" ? GEO_MESSAGES.outside : result.status === "empty" ? GEO_MESSAGES.empty : GEO_MESSAGES.failed);
          }
        } catch {
          setNote(GEO_MESSAGES.failed);
        } finally {
          setLocating(false);
        }
      },
      (error) => {
        setLocating(false);
        setNote(error.code === error.PERMISSION_DENIED ? GEO_MESSAGES.denied : GEO_MESSAGES.failed);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 300000 },
    );
  }, [onLocate, purpose]);

  const pick = useCallback(
    (suggestion: LocationSuggestion) => {
      valueRef.current = suggestion.label;
      onChange(suggestion.label);
      onPick(suggestion);
      setOpen(false);
      setActive(-1);
    },
    [onChange, onPick],
  );

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!open && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
      setOpen(true);
      request(valueRef.current);
      return;
    }
    if (!open) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => Math.min(items.length - 1, index + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => Math.max(-1, index - 1));
    } else if (event.key === "Enter" && active >= 0 && items[active]) {
      event.preventDefault();
      pick(items[active]);
    } else if (event.key === "Escape" || event.key === "Tab") {
      setOpen(false);
    }
  }

  const showList = open && (items.length > 0 || !itemsQuery);
  const heading = itemsQuery ? t("Suggestions") : t("Popular locations");

  return (
    <div ref={wrapRef} className="pkr-field pkr-field--location hs-wrap">
      <label className="pkr-field-label" htmlFor={`${id}-input`}>
        {t("Location")}
      </label>
      <span className="pkr-field-control">
        <input
          ref={inputRef}
          id={`${id}-input`}
          type="text"
          value={value}
          onChange={(event) => {
            valueRef.current = event.target.value;
            onChange(event.target.value);
            onPick(null);
            request(event.target.value);
            setNote("");
            setOpen(true);
          }}
          onFocus={() => {
            setOpen(true);
            request(valueRef.current);
          }}
          onKeyDown={onKeyDown}
          placeholder={locating ? t("Detecting your location…") : t(searchPlaceholder)}
          aria-busy={locating}
          autoComplete="off"
          spellCheck={false}
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
        />
        <span className="hs-field-actions">
          {value ? (
            <button
              type="button"
              className="hs-clear"
              aria-label={t("Clear location")}
              // Keep focus in the input so its onFocus doesn't re-run with the old text.
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                valueRef.current = "";
                onChange("");
                onPick(null);
                request("");
                setNote("");
                setOpen(true);
                inputRef.current?.focus();
              }}
            >
              <CloseIcon className="h-3.5 w-3.5" />
            </button>
          ) : (
            <PinIcon className="pkr-field-icon hs-field-pin" />
          )}
          <button
            type="button"
            className={`hs-locate${locating ? " is-busy" : ""}`}
            onClick={locate}
            disabled={locating}
            aria-label={t("Use my current location")}
            title={t("Use my current location")}
          >
            {locating ? <span className="hs-spinner" aria-hidden="true" /> : <LocateIcon className="hs-locate-icon" />}
          </button>
        </span>
      </span>

      {note && (
        <p className="hs-note" role="alert">
          <span>{t(note)}</span>
          <button type="button" aria-label={t("Dismiss")} onClick={() => setNote("")}>
            <CloseIcon className="h-3 w-3" />
          </button>
        </p>
      )}

      {showList && (
        <div className="hs-panel hs-panel--location">
          {!itemsQuery && (
            <button
              type="button"
              className="hs-near-opt"
              onMouseDown={(event) => event.preventDefault()}
              onClick={locate}
            >
              <span className="hs-near-icon">
                <LocateIcon className="h-[1.05rem] w-[1.05rem]" />
              </span>
              <span className="hs-opt-text">
                <span className="hs-opt-label">{t("Use my current location")}</span>
                <span className="hs-opt-detail">{t("Show properties near me")}</span>
              </span>
            </button>
          )}
          {items.length > 0 && <p className="hs-panel-title">{heading}</p>}
          <ul id={listId} role="listbox" aria-label={heading} className="hs-options">
            {items.map((item, index) => (
              <li
                key={item.id}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={index === active}
                className={`hs-opt${index === active ? " is-active" : ""}`}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setActive(index)}
                onClick={() => pick(item)}
              >
                <KindIcon kind={item.kind} />
                <span className="hs-opt-text">
                  <span className="hs-opt-label">
                    <Highlight label={item.label} query={value} />
                  </span>
                  <span className="hs-opt-detail">{item.detail}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Budget field: presets + custom min / max                            */
/* ------------------------------------------------------------------ */

type Preset = { label: string; value: string };

function amountHint(text: string, t: (value: string) => string) {
  const amount = parseBudget(text);
  if (amount === null) return { ok: true, amount: null, hint: "" };
  if (Number.isNaN(amount)) return { ok: false, amount: null, hint: t("Try 500000, 50 lakh or 1.5 crore") };
  return { ok: true, amount, hint: `PKR ${formatBudgetDigits(amount)} · ${formatBudgetShort(amount)}` };
}

export function HeroBudgetField({
  presets,
  minPrice,
  maxPrice,
  onChange,
}: {
  presets: readonly Preset[];
  minPrice: string;
  maxPrice: string;
  onChange: (min: string, max: string) => void;
}) {
  const { t } = useLanguage();
  const id = useId();
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const minRef = useRef<HTMLInputElement | null>(null);
  const [open, setOpen] = useState(false);
  const [minText, setMinText] = useState("");
  const [maxText, setMaxText] = useState("");

  useEffect(() => {
    const onDocument = (event: MouseEvent | TouchEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocument);
    document.addEventListener("touchstart", onDocument, { passive: true });
    return () => {
      document.removeEventListener("mousedown", onDocument);
      document.removeEventListener("touchstart", onDocument);
    };
  }, []);

  const min = minPrice ? Number(minPrice) : null;
  const max = maxPrice ? Number(maxPrice) : null;
  const activePreset = presets.find((preset) => preset.value === `${minPrice}-${maxPrice}`);
  const display = activePreset ? t(activePreset.label) : budgetRangeLabel(min, max) || t("Any price");

  const minState = amountHint(minText, t);
  const maxState = amountHint(maxText, t);
  const canApply = minState.ok && maxState.ok;

  function openPanel() {
    // Prefill the inputs with the current custom range (presets stay as chips).
    setMinText(min && !activePreset ? String(min) : "");
    setMaxText(max && !activePreset ? String(max) : "");
    setOpen(true);
    window.setTimeout(() => minRef.current?.focus({ preventScroll: true }), 30);
  }

  function apply() {
    if (!canApply) return;
    let low = minState.amount;
    let high = maxState.amount;
    if (low && high && low > high) [low, high] = [high, low];
    onChange(low ? String(low) : "", high ? String(high) : "");
    setOpen(false);
  }

  function choosePreset(preset: Preset) {
    const [low = "", high = ""] = preset.value.split("-");
    onChange(low === "0" ? "" : low, high);
    setOpen(false);
  }

  const onInputKey = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      apply();
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  };

  const hasValue = Boolean(minPrice || maxPrice);

  return (
    <div ref={wrapRef} className="pkr-field hs-wrap">
      <span className="pkr-field-label" id={`${id}-label`}>
        {t("Your budget")}
      </span>
      <span className="pkr-field-control">
        <button
          type="button"
          className={`hs-budget-trigger${hasValue ? " has-value" : ""}`}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-labelledby={`${id}-label ${id}-value`}
          onClick={() => (open ? setOpen(false) : openPanel())}
        >
          <span id={`${id}-value`}>{display}</span>
        </button>
        <ChevronIcon className={`pkr-field-chevron hs-chevron${open ? " is-open" : ""}`} />
      </span>

      {open && (
        <div className="hs-panel hs-panel--budget" role="dialog" aria-label={t("Choose your budget")}>
          <p className="hs-panel-title">{t("Custom budget (PKR)")}</p>
          <div className="hs-budget-inputs">
            <label className="hs-budget-input">
              <span>{t("Min")}</span>
              <input
                ref={minRef}
                inputMode="decimal"
                placeholder={t("e.g. 500000")}
                value={minText}
                onChange={(event) => setMinText(event.target.value)}
                onKeyDown={onInputKey}
                aria-invalid={!minState.ok}
              />
              <small className={minState.ok ? "" : "is-error"}>{minState.hint || "\u00a0"}</small>
            </label>
            <span className="hs-budget-dash" aria-hidden="true">–</span>
            <label className="hs-budget-input">
              <span>{t("Max")}</span>
              <input
                inputMode="decimal"
                placeholder={t("e.g. 1 crore")}
                value={maxText}
                onChange={(event) => setMaxText(event.target.value)}
                onKeyDown={onInputKey}
                aria-invalid={!maxState.ok}
              />
              <small className={maxState.ok ? "" : "is-error"}>{maxState.hint || "\u00a0"}</small>
            </label>
          </div>

          <p className="hs-panel-title hs-panel-title--sub">{t("Quick picks")}</p>
          <div className="hs-chips">
            {presets.map((preset) => (
              <button
                key={preset.value}
                type="button"
                className={`hs-chip${activePreset?.value === preset.value ? " is-active" : ""}`}
                onClick={() => choosePreset(preset)}
              >
                {t(preset.label)}
              </button>
            ))}
          </div>

          <div className="hs-budget-actions">
            <button
              type="button"
              className="hs-link"
              onClick={() => {
                setMinText("");
                setMaxText("");
                onChange("", "");
                setOpen(false);
              }}
            >
              {t("Any price")}
            </button>
            <button type="button" className="hs-apply" onClick={apply} disabled={!canApply}>
              {t("Apply")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
