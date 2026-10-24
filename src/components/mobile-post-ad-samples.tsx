"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type SampleId = "wizard" | "sheet" | "express" | "preview";
type Purpose = "sell" | "rent";
type PropKind = "house" | "plot" | "flat" | "commercial";

const SAMPLES: {
  id: SampleId;
  badge: string;
  shortTitle: string;
  title: string;
  tagline: string;
  bestFor: string;
}[] = [
  {
    id: "wizard",
    badge: "Sample 01 ★ Recommended",
    shortTitle: "01 · 3-Step Guided",
    title: "Guided 3-Step Simple Wizard",
    tagline: "Ek waqt mein sirf 1 asaan sawal — zero confusion, 60 seconds mein ad live.",
    bestFor: "Best for non-technical owners & mobile-first conversion",
  },
  {
    id: "sheet",
    badge: "Sample 02 · Motion Sheet",
    shortTitle: "02 · + Bottom Sheet",
    title: "Instant '+' Popup Action Sheet",
    tagline: "+ dabate hi native app jaisa smooth sheet khulta hai (Sell, Rent ya WhatsApp).",
    bestFor: "Best immediate experience right after tapping '+'",
  },
  {
    id: "express",
    badge: "Sample 03 · 1-Screen Tap",
    shortTitle: "03 · 1-Page Express",
    title: "45-Second One-Screen Tap Form",
    tagline: "Sab kuch ek hi clean white screen par — typing kam, 1-tap buttons zyada.",
    bestFor: "Best for dealers & repeat sellers who post fast",
  },
  {
    id: "preview",
    badge: "Sample 04 · Live Ad Card",
    shortTitle: "04 · Live Preview",
    title: "Live Property Card Builder",
    tagline: "Upar apna ad live banta hua dekhein — user ko foran samajh aata hai ad kaisa dikhega.",
    bestFor: "Best visual confidence for first-time homeowners",
  },
];

const PROP_KINDS: { id: PropKind; label: string; sub: string }[] = [
  { id: "house", label: "House / Villa", sub: "Ghar ya Kothi" },
  { id: "plot", label: "Plot / File", sub: "Residential / Comm." },
  { id: "flat", label: "Flat / Portion", sub: "Apartment / Portion" },
  { id: "commercial", label: "Shop / Office", sub: "Plaza / Showroom" },
];

const CITY_SOCIETIES: Record<string, string[]> = {
  Lahore: ["DHA Phase 6", "DHA Phase 7", "Bahria Town", "Lake City", "Johar Town", "Gulberg"],
  Islamabad: ["DHA Phase 2", "Bahria Enclave", "F-7 / F-8", "B-17 Multi", "Park View City", "G-13"],
  Karachi: ["DHA Phase 8", "Bahria Town Karachi", "Clifton", "Gulshan-e-Iqbal", "PECHS", "Scheme 33"],
  Rawalpindi: ["Bahria Town Ph 8", "DHA Phase 1", "Chaklala Scheme 3", "Satellite Town", "Gulrez"],
};

const SIZES = ["3 Marla", "5 Marla", "7 Marla", "10 Marla", "1 Kanal", "2 Kanal"];

const SELL_PRICE_CHIPS = [
  { label: "85 Lakh", value: "8500000" },
  { label: "1.5 Crore", value: "15000000" },
  { label: "3.25 Crore", value: "32500000" },
  { label: "6.5 Crore", value: "65000000" },
];

const RENT_PRICE_CHIPS = [
  { label: "45 Thousand", value: "45000" },
  { label: "85 Thousand", value: "85000" },
  { label: "1.5 Lakh", value: "150000" },
  { label: "3 Lakh", value: "300000" },
];

function formatPkrWords(raw: string): string {
  const digits = Number(raw.replace(/[^\d]/g, ""));
  if (!digits || Number.isNaN(digits)) return "Enter amount — Crore / Lakh auto dikhega";
  if (digits >= 10_000_000) {
    const crore = digits / 10_000_000;
    return `PKR ${crore % 1 === 0 ? crore.toFixed(0) : crore.toFixed(2).replace(/\.?0+$/, "")} Crore`;
  }
  if (digits >= 100_000) {
    const lakh = digits / 100_000;
    return `PKR ${lakh % 1 === 0 ? lakh.toFixed(0) : lakh.toFixed(2).replace(/\.?0+$/, "")} Lakh`;
  }
  if (digits >= 1_000) {
    const thousand = digits / 1_000;
    return `PKR ${thousand % 1 === 0 ? thousand.toFixed(0) : thousand.toFixed(1)} Thousand`;
  }
  return `PKR ${digits.toLocaleString("en-PK")}`;
}

function KindIcon({ kind }: { kind: PropKind }) {
  if (kind === "house") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 10.5 9-7 9 7" />
        <path d="M5.5 9.5V20h13V9.5" />
        <path d="M10 20v-5.5h4V20" />
      </svg>
    );
  }
  if (kind === "plot") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
        <path d="M3.5 12h17M12 4.5v15" />
      </svg>
    );
  }
  if (kind === "flat") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="3.5" width="14" height="17" rx="2" />
        <path d="M9 7.5h2M13 7.5h2M9 11.5h2M13 11.5h2M9 15.5h2M13 15.5h2" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 9.5h16v10.5H4z" />
      <path d="m3 9.5 2-5h14l2 5" />
      <path d="M10 20v-5h4v5" />
    </svg>
  );
}

export function MobilePostAdSamples() {
  const [activeSample, setActiveSample] = useState<SampleId>("wizard");

  // Shared interactive demo state so switching samples keeps user selections natural
  const [purpose, setPurpose] = useState<Purpose>("sell");
  const [kind, setKind] = useState<PropKind>("house");
  const [city, setCity] = useState<string>("Lahore");
  const [society, setSociety] = useState<string>("DHA Phase 6");
  const [size, setSize] = useState<string>("10 Marla");
  const [beds, setBeds] = useState<string>("4");
  const [price, setPrice] = useState<string>("32500000");
  const [phone, setPhone] = useState<string>("0300 1234567");
  const [ownerName, setOwnerName] = useState<string>("Ali Raza");
  const [demoPhotos, setDemoPhotos] = useState<number>(3);
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Sample 01 wizard step: 0 = welcome chooser, 1 = property/location, 2 = size/price, 3 = photos/contact
  const [wizardStep, setWizardStep] = useState<0 | 1 | 2 | 3>(0);

  // Sample 02 bottom sheet open/step
  const [sheetOpen, setSheetOpen] = useState<boolean>(true);
  const [sheetStage, setSheetStage] = useState<"menu" | "quickform">("menu");

  const currentMeta = useMemo(
    () => SAMPLES.find((item) => item.id === activeSample) ?? SAMPLES[0],
    [activeSample],
  );

  const societies = CITY_SOCIETIES[city] ?? CITY_SOCIETIES.Lahore;
  const priceChips = purpose === "sell" ? SELL_PRICE_CHIPS : RENT_PRICE_CHIPS;
  const formattedPrice = formatPkrWords(price);

  function selectCity(nextCity: string) {
    setCity(nextCity);
    const firstSociety = (CITY_SOCIETIES[nextCity] ?? [])[0] ?? "";
    setSociety(firstSociety);
  }

  function handleSelectSample(id: SampleId) {
    setActiveSample(id);
    setSubmitted(false);
    if (id === "wizard") setWizardStep(0);
    if (id === "sheet") {
      setSheetOpen(true);
      setSheetStage("menu");
    }
  }

  function renderSuccessCard(onReset: () => void) {
    return (
      <div className="pps-success-card">
        <div className="pps-success-badge">
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="m5 12.5 4.5 4.5L19 7.5" />
          </svg>
        </div>
        <span className="pps-pill-gold">Ad Received · Under Quick Review</span>
        <h3 className="pps-success-title">Mubarak! Aapki Property Submit Ho Gayi</h3>
        <p className="pps-success-copy">
          <strong>{size} {PROP_KINDS.find((k) => k.id === kind)?.label}</strong> in{" "}
          <strong>{society}, {city}</strong> ({formattedPrice}) hamari team verify kar ke live kar degi.
        </p>
        <div className="pps-success-summary">
          <div>
            <span>Purpose</span>
            <b>{purpose === "sell" ? "For Sale" : "For Rent"}</b>
          </div>
          <div>
            <span>Photos</span>
            <b>{demoPhotos} Added</b>
          </div>
          <div>
            <span>WhatsApp</span>
            <b>{phone || "0300 1234567"}</b>
          </div>
        </div>
        <button type="button" onClick={onReset} className="pps-primary-btn">
          Test Flow Again
        </button>
      </div>
    );
  }

  return (
    <div className="pps-page">
      {/* Top sticky sample switcher bar — thumb-friendly horizontal pills on mobile */}
      <div className="pps-switcher-bar">
        <div className="pps-switcher-inner">
          <div className="pps-switcher-topline">
            <div>
              <span className="pps-eyebrow">Mobile &ldquo;+&rdquo; Post Ad UI/UX Lab</span>
              <h1 className="pps-heading">Choose How &ldquo;+&rdquo; Works on Mobile</h1>
            </div>
            <Link href="/list-property" className="pps-current-link">
              Current Page
            </Link>
          </div>

          <div className="pps-tabs" role="tablist" aria-label="Post Property UI Samples">
            {SAMPLES.map((sample) => {
              const active = sample.id === activeSample;
              return (
                <button
                  key={sample.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => handleSelectSample(sample.id)}
                  className={`pps-tab${active ? " is-active" : ""}`}
                >
                  {sample.shortTitle}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Explain banner for currently selected sample */}
      <div className="pps-stage-wrap">
        <div className="pps-meta-banner">
          <span className="pps-meta-badge">{currentMeta.badge}</span>
          <h2 className="pps-meta-title">{currentMeta.title}</h2>
          <p className="pps-meta-tagline">{currentMeta.tagline}</p>
        </div>

        {/* Phone Stage (full-width native feel on mobile <=767px; sleek 392px phone frame on desktop) */}
        <div className="pps-phone-frame">
          {/* SAMPLE 01: GUIDED 3-STEP WIZARD */}
          {activeSample === "wizard" && (
            <div className="pps-screen">
              {submitted ? (
                renderSuccessCard(() => {
                  setSubmitted(false);
                  setWizardStep(0);
                })
              ) : wizardStep === 0 ? (
                <div className="pps-step-anim">
                  <div className="pps-welcome-hero">
                    <span className="pps-pill-emerald">Free Property Listing · 60 Sec</span>
                    <h3>Apni Property Ka Ad Lagayein</h3>
                    <p>Sirf 3 asaan steps — batayein aap kya karna chahte hain:</p>
                  </div>

                  <div className="pps-intent-stack">
                    <button
                      type="button"
                      className="pps-intent-card"
                      onClick={() => {
                        setPurpose("sell");
                        setPrice("32500000");
                        setWizardStep(1);
                      }}
                    >
                      <span className="pps-intent-icon pps-intent-icon--emerald">
                        <KindIcon kind="house" />
                      </span>
                      <span className="pps-intent-body">
                        <b>Sell My Property</b>
                        <small>Ghar, Plot, Flat ya Shop sale pe lagayein</small>
                      </span>
                      <span className="pps-intent-arrow">→</span>
                    </button>

                    <button
                      type="button"
                      className="pps-intent-card"
                      onClick={() => {
                        setPurpose("rent");
                        setPrice("85000");
                        setWizardStep(1);
                      }}
                    >
                      <span className="pps-intent-icon pps-intent-icon--gold">
                        <KindIcon kind="flat" />
                      </span>
                      <span className="pps-intent-body">
                        <b>Rent Out Property</b>
                        <small>Verified family ya corporate tenant dhoondein</small>
                      </span>
                      <span className="pps-intent-arrow">→</span>
                    </button>
                  </div>

                  <div className="pps-wa-assist">
                    <div>
                      <span className="pps-wa-tag">Zero Form Option</span>
                      <h4>Form nahi bharna? WhatsApp kar dein!</h4>
                      <p>Photos aur details WhatsApp bhejein — hamari team khud aapka free ad laga degi.</p>
                    </div>
                    <a
                      href="https://wa.me/923251888841?text=Assalam%20o%20Alaikum%2C%20mujhe%20Properties%20Pak%20par%20apni%20property%20ka%20ad%20lagwana%20hai."
                      target="_blank"
                      rel="noreferrer"
                      className="pps-wa-btn"
                    >
                      Send on WhatsApp
                    </a>
                  </div>
                </div>
              ) : (
                <div className="pps-step-anim">
                  {/* Top Step Progress Header */}
                  <div className="pps-wizard-top">
                    <button
                      type="button"
                      onClick={() => setWizardStep((prev) => (prev > 0 ? ((prev - 1) as 0 | 1 | 2 | 3) : 0))}
                      className="pps-back-btn"
                    >
                      ← Back
                    </button>
                    <span className="pps-step-count">Step {wizardStep} of 3</span>
                    <span className="pps-mode-pill">{purpose === "sell" ? "For Sale" : "For Rent"}</span>
                  </div>

                  <div className="pps-progress-track" aria-hidden="true">
                    <div className="pps-progress-fill" style={{ width: `${(wizardStep / 3) * 100}%` }} />
                  </div>

                  {wizardStep === 1 && (
                    <div className="pps-form-stack">
                      <div>
                        <label className="pps-label">1. Konsi property hai?</label>
                        <div className="pps-kind-grid">
                          {PROP_KINDS.map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setKind(item.id)}
                              className={`pps-kind-card${kind === item.id ? " is-selected" : ""}`}
                            >
                              <span className="pps-kind-icon">
                                <KindIcon kind={item.id} />
                              </span>
                              <b>{item.label}</b>
                              <small>{item.sub}</small>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="pps-label">2. Shehar chunein (City)</label>
                        <div className="pps-chip-row">
                          {Object.keys(CITY_SOCIETIES).map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => selectCity(c)}
                              className={`pps-chip${city === c ? " is-selected" : ""}`}
                            >
                              {c}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="pps-label">3. Society / Area</label>
                        <input
                          type="text"
                          value={society}
                          onChange={(e) => setSociety(e.target.value)}
                          placeholder="Type DHA, Bahria, Gulberg..."
                          className="pps-input"
                        />
                        <div className="pps-chip-scroll">
                          {societies.map((soc) => (
                            <button
                              key={soc}
                              type="button"
                              onClick={() => setSociety(soc)}
                              className={`pps-chip pps-chip--sm${society === soc ? " is-selected" : ""}`}
                            >
                              {soc}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button type="button" onClick={() => setWizardStep(2)} className="pps-primary-btn">
                        Next: Size &amp; Price →
                      </button>
                    </div>
                  )}

                  {wizardStep === 2 && (
                    <div className="pps-form-stack">
                      <div>
                        <label className="pps-label">1. Property Size chunein</label>
                        <div className="pps-chip-grid-3">
                          {SIZES.map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setSize(s)}
                              className={`pps-chip${size === s ? " is-selected" : ""}`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>

                      {kind !== "plot" && (
                        <div>
                          <label className="pps-label">2. Bedrooms</label>
                          <div className="pps-chip-row">
                            {["1", "2", "3", "4", "5", "6+"].map((b) => (
                              <button
                                key={b}
                                type="button"
                                onClick={() => setBeds(b)}
                                className={`pps-chip${beds === b ? " is-selected" : ""}`}
                              >
                                {b} Bed
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="pps-label">
                          {purpose === "sell" ? "Demand Price (PKR)" : "Monthly Rent (PKR)"}
                        </label>
                        <div className="pps-price-box">
                          <span className="pps-price-prefix">PKR</span>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={price}
                            onChange={(e) => setPrice(e.target.value.replace(/[^\d]/g, ""))}
                            placeholder="32500000"
                            className="pps-price-input"
                          />
                        </div>
                        <div className="pps-price-helper">{formattedPrice}</div>
                        <div className="pps-chip-scroll">
                          {priceChips.map((chip) => (
                            <button
                              key={chip.value}
                              type="button"
                              onClick={() => setPrice(chip.value)}
                              className={`pps-chip pps-chip--sm${price === chip.value ? " is-selected" : ""}`}
                            >
                              {chip.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button type="button" onClick={() => setWizardStep(3)} className="pps-primary-btn">
                        Next: Photos &amp; Phone →
                      </button>
                    </div>
                  )}

                  {wizardStep === 3 && (
                    <div className="pps-form-stack">
                      <div>
                        <label className="pps-label">1. Property Photos (Camera ya Gallery)</label>
                        <button
                          type="button"
                          onClick={() => setDemoPhotos((n) => (n >= 6 ? 1 : n + 1))}
                          className="pps-upload-box"
                        >
                          <span className="pps-upload-circle">+</span>
                          <b>Tap to Add Photos from Phone</b>
                          <small>{demoPhotos} demo photos attached · Tap to add more</small>
                        </button>
                      </div>

                      <div>
                        <label className="pps-label">2. Aapka Naam</label>
                        <input
                          type="text"
                          value={ownerName}
                          onChange={(e) => setOwnerName(e.target.value)}
                          placeholder="Full Name"
                          className="pps-input"
                        />
                      </div>

                      <div>
                        <label className="pps-label">3. Mobile / WhatsApp Number</label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="0300 1234567"
                          className="pps-input"
                        />
                      </div>

                      <div className="mlw-account-box">
                        <b className="block text-[0.83rem] text-[#0d261d]">
                          4. Auto Account Creation + Admin Verification
                        </b>
                        <p className="mt-1 mb-2.5 text-[0.73rem] leading-relaxed text-[#52665c]">
                          Email + Password dalte hi aapka <strong>Owner/Dealer Account</strong> khud ban kar login ho
                          jata hai aur ad seedha <strong>Admin Dashboard</strong> + aapke <strong>/account</strong> dono
                          mein save hota hai.
                        </p>
                        <div className="grid gap-2">
                          <input
                            type="email"
                            defaultValue="ahmed@example.com"
                            placeholder="Email address *"
                            className="pps-input"
                          />
                          <input
                            type="password"
                            defaultValue="password123"
                            placeholder="Create password (6+ chars) *"
                            className="pps-input"
                          />
                        </div>
                      </div>

                      <button type="button" onClick={() => setSubmitted(true)} className="pps-primary-btn">
                        Create Account &amp; Submit to Admin ✓
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* SAMPLE 02: INSTANT "+" BOTTOM SHEET MOTION */}
          {activeSample === "sheet" && (
            <div className="pps-sheet-stage">
              <div className="pps-mock-bg">
                <div className="pps-mock-bg-card">
                  <span>Live Motion Simulation</span>
                  <h3>Jab user neeche gol &ldquo;+&rdquo; button dabayega:</h3>
                  <p>
                    Page reload ya lamba form khulne ke bajaye upar ek luxury spring bottom-sheet slide hoti hai jahan
                    se user 1 tap mein Sell, Rent ya WhatsApp choose karta hai.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setSheetStage("menu");
                      setSheetOpen(true);
                    }}
                    className="pps-replay-btn"
                  >
                    {sheetOpen ? "Replay + Sheet Animation" : "Tap + to Open Sheet"}
                  </button>
                </div>

                {/* Mini simulated circular + button */}
                <div className="pps-mini-nav-demo">
                  <span>Home</span>
                  <span>Search</span>
                  <button
                    type="button"
                    aria-label="Toggle demo sheet"
                    onClick={() => {
                      setSubmitted(false);
                      setSheetStage("menu");
                      setSheetOpen((v) => !v);
                    }}
                    className={`pps-demo-fab${sheetOpen ? " is-open" : ""}`}
                  >
                    +
                  </button>
                  <span>Agents</span>
                  <span>Map</span>
                </div>
              </div>

              {sheetOpen && (
                <div className="pps-sheet-overlay">
                  <div className="pps-bottom-sheet">
                    <div className="pps-sheet-handle" />
                    <div className="pps-sheet-head">
                      <div>
                        <span className="pps-pill-emerald">Post Free Ad</span>
                        <h4>Add Your Property</h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSheetOpen(false)}
                        className="pps-sheet-close"
                        aria-label="Close sheet"
                      >
                        ✕
                      </button>
                    </div>

                    {submitted ? (
                      renderSuccessCard(() => {
                        setSubmitted(false);
                        setSheetStage("menu");
                      })
                    ) : sheetStage === "menu" ? (
                      <div className="pps-intent-stack">
                        <button
                          type="button"
                          className="pps-intent-card"
                          onClick={() => {
                            setPurpose("sell");
                            setPrice("32500000");
                            setSheetStage("quickform");
                          }}
                        >
                          <span className="pps-intent-icon pps-intent-icon--emerald">
                            <KindIcon kind="house" />
                          </span>
                          <span className="pps-intent-body">
                            <b>Sell Property</b>
                            <small>House, Plot, Flat ya Commercial bechein</small>
                          </span>
                          <span className="pps-intent-arrow">→</span>
                        </button>

                        <button
                          type="button"
                          className="pps-intent-card"
                          onClick={() => {
                            setPurpose("rent");
                            setPrice("85000");
                            setSheetStage("quickform");
                          }}
                        >
                          <span className="pps-intent-icon pps-intent-icon--gold">
                            <KindIcon kind="flat" />
                          </span>
                          <span className="pps-intent-body">
                            <b>Rent Out Property</b>
                            <small>Monthly kiraye ke liye ad lagayein</small>
                          </span>
                          <span className="pps-intent-arrow">→</span>
                        </button>

                        <a
                          href="https://wa.me/923251888841?text=Assalam%20o%20Alaikum%2C%20mujhe%20property%20ad%20lagwana%20hai."
                          target="_blank"
                          rel="noreferrer"
                          className="pps-intent-card pps-intent-card--wa"
                        >
                          <span className="pps-intent-icon pps-intent-icon--wa">WA</span>
                          <span className="pps-intent-body">
                            <b>WhatsApp Pe Bhejein (Easy)</b>
                            <small>Photos bhejein — team khud ad post karegi</small>
                          </span>
                          <span className="pps-intent-arrow">→</span>
                        </a>
                      </div>
                    ) : (
                      <div className="pps-form-stack">
                        <div className="pps-chip-row">
                          {PROP_KINDS.map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setKind(item.id)}
                              className={`pps-chip${kind === item.id ? " is-selected" : ""}`}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                        <div className="pps-two-col">
                          <select value={city} onChange={(e) => selectCity(e.target.value)} className="pps-input">
                            {Object.keys(CITY_SOCIETIES).map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                          <select value={size} onChange={(e) => setSize(e.target.value)} className="pps-input">
                            {SIZES.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>
                        <input
                          type="text"
                          value={society}
                          onChange={(e) => setSociety(e.target.value)}
                          placeholder="Society / Block (e.g. DHA Phase 6)"
                          className="pps-input"
                        />
                        <div>
                          <div className="pps-price-box">
                            <span className="pps-price-prefix">PKR</span>
                            <input
                              type="text"
                              inputMode="numeric"
                              value={price}
                              onChange={(e) => setPrice(e.target.value.replace(/[^\d]/g, ""))}
                              className="pps-price-input"
                            />
                          </div>
                          <div className="pps-price-helper">{formattedPrice}</div>
                        </div>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="WhatsApp Number (03xx xxxxxxx)"
                          className="pps-input"
                        />
                        <div className="pps-two-col">
                          <button type="button" onClick={() => setSheetStage("menu")} className="pps-secondary-btn">
                            ← Back
                          </button>
                          <button type="button" onClick={() => setSubmitted(true)} className="pps-primary-btn">
                            Post Ad ✓
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SAMPLE 03: ONE-SCREEN EXPRESS TAP FORM */}
          {activeSample === "express" && (
            <div className="pps-screen">
              {submitted ? (
                renderSuccessCard(() => setSubmitted(false))
              ) : (
                <div className="pps-form-stack pps-step-anim">
                  <div className="pps-segmented">
                    <button
                      type="button"
                      onClick={() => {
                        setPurpose("sell");
                        setPrice("32500000");
                      }}
                      className={purpose === "sell" ? "is-active" : ""}
                    >
                      Bechna Hai (Sell)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPurpose("rent");
                        setPrice("85000");
                      }}
                      className={purpose === "rent" ? "is-active" : ""}
                    >
                      Kiraye Pe (Rent)
                    </button>
                  </div>

                  <div>
                    <label className="pps-label">Property Type</label>
                    <div className="pps-kind-grid">
                      {PROP_KINDS.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setKind(item.id)}
                          className={`pps-kind-card${kind === item.id ? " is-selected" : ""}`}
                        >
                          <span className="pps-kind-icon">
                            <KindIcon kind={item.id} />
                          </span>
                          <b>{item.label}</b>
                          <small>{item.sub}</small>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="pps-label">City &amp; Society</label>
                    <div className="pps-chip-scroll">
                      {Object.keys(CITY_SOCIETIES).map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => selectCity(c)}
                          className={`pps-chip pps-chip--sm${city === c ? " is-selected" : ""}`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={society}
                      onChange={(e) => setSociety(e.target.value)}
                      placeholder="Society / Area (e.g. DHA Phase 6)"
                      className="pps-input mt-2"
                    />
                  </div>

                  <div>
                    <label className="pps-label">Quick Size Tap</label>
                    <div className="pps-chip-grid-3">
                      {SIZES.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSize(s)}
                          className={`pps-chip${size === s ? " is-selected" : ""}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="pps-label">Demand Price</label>
                    <div className="pps-price-box">
                      <span className="pps-price-prefix">PKR</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={price}
                        onChange={(e) => setPrice(e.target.value.replace(/[^\d]/g, ""))}
                        className="pps-price-input"
                      />
                    </div>
                    <div className="pps-price-helper">{formattedPrice}</div>
                  </div>

                  <div className="pps-express-photo-strip">
                    <button
                      type="button"
                      onClick={() => setDemoPhotos((n) => (n >= 6 ? 1 : n + 1))}
                      className="pps-express-photo-btn"
                    >
                      + Add Photos ({demoPhotos})
                    </button>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="WhatsApp 03xx..."
                      className="pps-input"
                    />
                  </div>

                  <button type="button" onClick={() => setSubmitted(true)} className="pps-primary-btn">
                    Lagayein Free Ad (45 Sec) →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* SAMPLE 04: LIVE PROPERTY CARD BUILDER */}
          {activeSample === "preview" && (
            <div className="pps-screen">
              {submitted ? (
                renderSuccessCard(() => setSubmitted(false))
              ) : (
                <div className="pps-form-stack pps-step-anim">
                  {/* Live updating mini luxury card */}
                  <div className="pps-live-card">
                    <div
                      className="pps-live-photo"
                      style={{
                        backgroundImage: `linear-gradient(180deg, rgba(6, 26, 19, .38) 0%, rgba(6, 26, 19, .12) 100%), url("/images/categories/${
                          kind === "plot"
                            ? "plots-hd.webp"
                            : kind === "flat"
                              ? "apartments-hd.webp"
                              : kind === "commercial"
                                ? "commercial-hd.webp"
                                : "houses-hd.webp"
                        }")`,
                      }}
                    >
                      <span className="pps-live-status">{purpose === "sell" ? "For Sale" : "For Rent"}</span>
                      <span className="pps-live-photo-count">{demoPhotos} Photos</span>
                    </div>
                    <div className="pps-live-body">
                      <div className="pps-live-price-row">
                        <b>{formattedPrice.startsWith("PKR") ? formattedPrice : "PKR 3.25 Crore"}</b>
                        <span className="pps-live-type-pill">
                          <i />
                          {PROP_KINDS.find((k) => k.id === kind)?.label.split(" / ")[0]}
                        </span>
                      </div>
                      <h4>
                        {size} {PROP_KINDS.find((k) => k.id === kind)?.label.split(" / ")[0]} in {society || "DHA"}
                      </h4>
                      <p>
                        {society || "Select Society"}, {city}
                        {kind !== "plot" ? ` · ${beds} Beds` : " · Direct Owner"}
                      </p>
                    </div>
                  </div>

                  <div className="pps-segmented">
                    <button
                      type="button"
                      onClick={() => {
                        setPurpose("sell");
                        setPrice("32500000");
                      }}
                      className={purpose === "sell" ? "is-active" : ""}
                    >
                      For Sale
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPurpose("rent");
                        setPrice("85000");
                      }}
                      className={purpose === "rent" ? "is-active" : ""}
                    >
                      For Rent
                    </button>
                  </div>

                  <div className="pps-chip-scroll">
                    {PROP_KINDS.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setKind(item.id)}
                        className={`pps-chip pps-chip--sm${kind === item.id ? " is-selected" : ""}`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>

                  <div className="pps-two-col">
                    <select value={city} onChange={(e) => selectCity(e.target.value)} className="pps-input">
                      {Object.keys(CITY_SOCIETIES).map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <select value={size} onChange={(e) => setSize(e.target.value)} className="pps-input">
                      {SIZES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <input
                    type="text"
                    value={society}
                    onChange={(e) => setSociety(e.target.value)}
                    placeholder="Society / Block"
                    className="pps-input"
                  />

                  <div className="pps-price-box">
                    <span className="pps-price-prefix">PKR</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={price}
                      onChange={(e) => setPrice(e.target.value.replace(/[^\d]/g, ""))}
                      className="pps-price-input"
                    />
                  </div>

                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="WhatsApp Number"
                    className="pps-input"
                  />

                  <button type="button" onClick={() => setSubmitted(true)} className="pps-primary-btn">
                    Looks Great — Publish My Ad ✓
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
