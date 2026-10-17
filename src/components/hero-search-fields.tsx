"use client";

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { useLanguage } from "@/components/language-provider";
import { budgetRangeLabel, formatBudgetDigits, formatBudgetShort, parseBudget } from "@/lib/budget";
import type { LocationSuggestion } from "@/lib/location-suggest";

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

export function HeroLocationField({
  value,
  onChange,
  onPick,
}: {
  value: string;
  onChange: (value: string) => void;
  onPick: (suggestion: LocationSuggestion | null) => void;
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

  const pick = useCallback(
    (suggestion: LocationSuggestion) => {
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
      request(value);
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

  const showList = open && items.length > 0;
  const heading = value.trim() ? t("Suggestions") : t("Popular locations");

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
            onChange(event.target.value);
            onPick(null);
            request(event.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            setOpen(true);
            request(value);
          }}
          onKeyDown={onKeyDown}
          placeholder={t("Enter city or area")}
          autoComplete="off"
          spellCheck={false}
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
        />
        {value ? (
          <button
            type="button"
            className="hs-clear"
            aria-label={t("Clear location")}
            onClick={() => {
              onChange("");
              onPick(null);
              request("");
              setOpen(true);
              inputRef.current?.focus();
            }}
          >
            <CloseIcon className="h-3.5 w-3.5" />
          </button>
        ) : (
          <PinIcon className="pkr-field-icon" />
        )}
      </span>

      {showList && (
        <div className="hs-panel hs-panel--location">
          <p className="hs-panel-title">{heading}</p>
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
