"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { IconCheck, IconGoogle, IconPin } from "@/components/icons";
import { LocationAutocomplete } from "@/components/location-autocomplete";
import { LocationPicker } from "@/components/location-picker";
import { ResilientImage } from "@/components/resilient-image";
import type { UploadedImage } from "@/components/listing-image-uploader";
import { CITY_CENTERS } from "@/lib/map-engine";

type WizardStep = 0 | 1 | 2 | 3 | 4;
type Purpose = "buy" | "rent";
type KindKey = "house" | "plot" | "flat" | "commercial";

const CITIES = [
  { slug: "lahore", name: "Lahore" },
  { slug: "islamabad", name: "Islamabad" },
  { slug: "karachi", name: "Karachi" },
  { slug: "rawalpindi", name: "Rawalpindi" },
  { slug: "faisalabad", name: "Faisalabad" },
  { slug: "multan", name: "Multan" },
  { slug: "gujranwala", name: "Gujranwala" },
  { slug: "peshawar", name: "Peshawar" },
];

const POPULAR_SOCIETIES: Record<string, string[]> = {
  lahore: ["DHA Phase 6", "DHA Phase 7", "Bahria Town", "Lake City", "Johar Town", "Gulberg", "Park View City"],
  islamabad: ["DHA Phase 2", "Bahria Enclave", "F-7", "F-8", "B-17 Multi Gardens", "Park View City", "G-13"],
  karachi: ["DHA Phase 8", "Bahria Town Karachi", "Clifton", "Gulshan-e-Iqbal", "PECHS", "Scheme 33"],
  rawalpindi: ["Bahria Town Phase 8", "DHA Phase 1", "Chaklala Scheme 3", "Satellite Town", "Gulrez"],
  faisalabad: ["Citi Housing", "Eden Garden", "Canal Road", "Madina Town", "Wapda City"],
  multan: ["DHA Multan", "Wapda Town", "Buch Executive Villas", "Citi Housing", "Model Town"],
  gujranwala: ["DHA Gujranwala", "Citi Housing", "Master City", "DC Colony", "Model Town"],
  peshawar: ["Hayatabad", "DHA Peshawar", "Regi Model Town", "University Town", "Warsak Road"],
};

const KINDS: {
  id: KindKey;
  label: string;
  sub: string;
  category: string;
  defaultType: string;
  subTypes: { label: string; category: string; propertyType: string }[];
}[] = [
  {
    id: "house",
    label: "House / Villa",
    sub: "Ghar, Kothi, Farmhouse",
    category: "house",
    defaultType: "House",
    subTypes: [
      { label: "House", category: "house", propertyType: "House" },
      { label: "Villa", category: "house", propertyType: "Villa" },
      { label: "Farmhouse", category: "farmhouse", propertyType: "Farmhouse" },
    ],
  },
  {
    id: "plot",
    label: "Plot / File",
    sub: "Residential ya Comm. Plot",
    category: "plot",
    defaultType: "Plot",
    subTypes: [
      { label: "Residential Plot", category: "plot", propertyType: "Plot" },
      { label: "Agricultural Land", category: "land", propertyType: "Agricultural Land" },
      { label: "Industrial Land", category: "land", propertyType: "Industrial Land" },
    ],
  },
  {
    id: "flat",
    label: "Flat / Portion",
    sub: "Apartment, Upper / Lower",
    category: "apartment",
    defaultType: "Apartment",
    subTypes: [
      { label: "Apartment", category: "apartment", propertyType: "Apartment" },
      { label: "Upper Portion", category: "apartment", propertyType: "Upper Portion" },
      { label: "Lower Portion", category: "apartment", propertyType: "Lower Portion" },
      { label: "Penthouse", category: "apartment", propertyType: "Penthouse" },
    ],
  },
  {
    id: "commercial",
    label: "Shop / Office",
    sub: "Plaza, Retail, Warehouse",
    category: "shop",
    defaultType: "Shop",
    subTypes: [
      { label: "Shop", category: "shop", propertyType: "Shop" },
      { label: "Office", category: "office", propertyType: "Office" },
      { label: "Commercial Plaza", category: "building", propertyType: "Commercial Building" },
      { label: "Warehouse", category: "warehouse", propertyType: "Warehouse" },
    ],
  },
];

const QUICK_SIZES: { label: string; value: string; unit: "marla" | "kanal" }[] = [
  { label: "3 Marla", value: "3", unit: "marla" },
  { label: "5 Marla", value: "5", unit: "marla" },
  { label: "7 Marla", value: "7", unit: "marla" },
  { label: "10 Marla", value: "10", unit: "marla" },
  { label: "1 Kanal", value: "1", unit: "kanal" },
  { label: "2 Kanal", value: "2", unit: "kanal" },
];

const SELL_CHIPS = [
  { label: "85 Lakh", value: "8500000" },
  { label: "1.5 Crore", value: "15000000" },
  { label: "3.25 Crore", value: "32500000" },
  { label: "6.5 Crore", value: "65000000" },
];

const RENT_CHIPS = [
  { label: "45 Thousand", value: "45000" },
  { label: "85 Thousand", value: "85000" },
  { label: "1.5 Lakh", value: "150000" },
  { label: "3 Lakh", value: "300000" },
];

const QUICK_FEATURE_TAGS = [
  "Corner Property",
  "Park Facing",
  "Main Boulevard",
  "Brand New",
  "Gas Available",
  "Solar Installed",
  "Servant Quarter",
  "Gated Security",
  "LDA / CDA Approved",
];

function formatPkrWords(raw: string): string {
  const digits = Number(raw.replace(/[^\d]/g, ""));
  if (!digits || Number.isNaN(digits)) return "Amount likhein — Crore / Lakh khud ban jayega";
  if (digits >= 10_000_000) {
    const crore = digits / 10_000_000;
    return `= PKR ${crore % 1 === 0 ? crore.toFixed(0) : crore.toFixed(2).replace(/\.?0+$/, "")} Crore`;
  }
  if (digits >= 100_000) {
    const lakh = digits / 100_000;
    return `= PKR ${lakh % 1 === 0 ? lakh.toFixed(0) : lakh.toFixed(2).replace(/\.?0+$/, "")} Lakh`;
  }
  if (digits >= 1_000) {
    const thousand = digits / 1_000;
    return `= PKR ${thousand % 1 === 0 ? thousand.toFixed(0) : thousand.toFixed(1)} Thousand`;
  }
  return `= PKR ${digits.toLocaleString("en-PK")}`;
}

function KindSvg({ kind }: { kind: KindKey }) {
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

export function MobileListingWizard({
  signedIn: initiallySignedIn,
  googleEnabled,
  whatsappNumber,
  initialName = "",
  initialEmail = "",
  initialPhone = "",
}: {
  signedIn: boolean;
  googleEnabled: boolean;
  whatsappNumber: string;
  initialName?: string;
  initialEmail?: string;
  initialPhone?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [step, setStep] = useState<WizardStep>(0);
  const [purpose, setPurpose] = useState<Purpose>("buy");
  const [kind, setKind] = useState<KindKey>("house");
  const [category, setCategory] = useState<string>("house");
  const [propertyType, setPropertyType] = useState<string>("House");

  // Step 1 — Location & Map Pin
  const [citySlug, setCitySlug] = useState<string>("lahore");
  const [locationArea, setLocationArea] = useState<string>("");
  const [skipSocietyQuery, setSkipSocietyQuery] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [lat, setLat] = useState<number>(CITY_CENTERS.lahore.lat);
  const [lng, setLng] = useState<number>(CITY_CENTERS.lahore.lng);
  const [showMapPin, setShowMapPin] = useState<boolean>(false);

  // Step 2 — Size, Price & Property Specs
  const [areaValue, setAreaValue] = useState<string>("10");
  const [areaUnit, setAreaUnit] = useState<"marla" | "kanal" | "sqft">("marla");
  const [bedrooms, setBedrooms] = useState<string>("4");
  const [bathrooms, setBathrooms] = useState<string>("4");
  const [parking, setParking] = useState<string>("1");
  const [furnishing, setFurnishing] = useState<string>("Unfurnished");
  const [possession, setPossession] = useState<string>("Available");
  const [price, setPrice] = useState<string>("");
  const [paymentType, setPaymentType] = useState<"cash" | "installments">("cash");
  const [negotiable, setNegotiable] = useState<boolean>(true);

  // Step 3 — Photos, Title, Features & Description
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [customTitle, setCustomTitle] = useState<string>("");
  const [titleEdited, setTitleEdited] = useState<boolean>(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [description, setDescription] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string>("");

  // Step 4 — Owner Contact + Automatic Account Creation
  const [name, setName] = useState<string>(initialName);
  const [phone, setPhone] = useState<string>(initialPhone);
  const [email, setEmail] = useState<string>(initialEmail);
  const [createAccount, setCreateAccount] = useState<boolean>(!initiallySignedIn);
  const [password, setPassword] = useState<string>("");

  // Submission result & Account feedback
  const [stepError, setStepError] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [doneRefId, setDoneRefId] = useState<number | null>(null);
  const [doneSubmitted, setDoneSubmitted] = useState<boolean>(false);
  const [accountCreated, setAccountCreated] = useState<boolean>(false);
  const [isSignedInNow, setIsSignedInNow] = useState<boolean>(initiallySignedIn);
  const [emailAlreadyRegistered, setEmailAlreadyRegistered] = useState<boolean>(false);

  const cityObj = CITIES.find((c) => c.slug === citySlug) ?? CITIES[0];
  const activeKindMeta = KINDS.find((k) => k.id === kind) ?? KINDS[0];
  const societies = POPULAR_SOCIETIES[citySlug] ?? POPULAR_SOCIETIES.lahore;
  const priceChips = purpose === "buy" ? SELL_CHIPS : RENT_CHIPS;
  const cleanWaDigits = whatsappNumber.replace(/[^\d]/g, "");

  const unitLabel = areaUnit === "kanal" ? "Kanal" : areaUnit === "sqft" ? "Sq.ft" : "Marla";
  const actionLabel = purpose === "rent" ? "Rent" : "Sale";
  const suggestedTitle = `${areaValue || "10"} ${unitLabel} ${propertyType} for ${actionLabel} in ${locationArea.trim() || cityObj.name}`;
  const title = titleEdited ? customTitle : suggestedTitle;

  function selectKind(next: KindKey) {
    setKind(next);
    const meta = KINDS.find((k) => k.id === next) ?? KINDS[0];
    setCategory(meta.category);
    setPropertyType(meta.defaultType);
    if (next === "plot") {
      setBedrooms("0");
      setBathrooms("0");
      setParking("0");
      setFurnishing("Not applicable");
    } else if (bedrooms === "0") {
      setBedrooms("4");
      setBathrooms("4");
      setParking("1");
      setFurnishing("Unfurnished");
    }
  }

  function selectCity(slug: string) {
    setCitySlug(slug);
    const center = CITY_CENTERS[slug];
    if (center) {
      setLat(center.lat);
      setLng(center.lng);
    }
    setStepError("");
  }

  async function pickQuickSociety(soc: string) {
    setSkipSocietyQuery(soc);
    setLocationArea(soc);
    setStepError("");
    try {
      const params = new URLSearchParams({ q: soc, city: citySlug, cityName: cityObj.name });
      const res = await fetch(`/api/geocode?${params}`);
      const data = (await res.json()) as { results?: { lat: number; lng: number }[] };
      const first = data.results?.[0];
      if (first?.lat && first?.lng) {
        setLat(Math.round(first.lat * 1e5) / 1e5);
        setLng(Math.round(first.lng * 1e5) / 1e5);
      }
    } catch {
      // City center fallback stays set
    }
  }

  function toggleTag(tag: string) {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  function goStep2() {
    if (!locationArea.trim()) {
      setStepError("Please Society ya Area ka naam likhein ya neeche chips se select karein.");
      return;
    }
    setStepError("");
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goStep3() {
    const numericPrice = Number(price.replace(/[^\d]/g, ""));
    if (!numericPrice || numericPrice <= 0) {
      setStepError(purpose === "buy" ? "Please property ki Asking Price likhein." : "Please Monthly Rent likhein.");
      return;
    }
    if (!Number(areaValue) || Number(areaValue) <= 0) {
      setStepError("Please property ka Area / Size likhein.");
      return;
    }
    setStepError("");
    setStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goStep4() {
    if (images.length === 0) {
      setStepError("Kam az kam 1 property photo zaroor upload karein.");
      return;
    }
    if (!title.trim() || title.trim().length < 8) {
      setStepError("Property title kam az kam 8 characters ka hona chahiye.");
      return;
    }
    setStepError("");
    setStep(4);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleUploadFiles(files: FileList | null) {
    if (!files?.length) return;
    const remaining = Math.max(0, 12 - images.length);
    const selected = Array.from(files).slice(0, remaining);
    if (selected.length === 0) {
      setStepError("Maximum 12 photos upload ho sakti hain.");
      return;
    }
    setUploading(true);
    setStepError("");
    try {
      const formData = new FormData();
      for (const file of selected) formData.append("images", file);
      const res = await fetch("/api/media/upload", { method: "POST", body: formData });
      const data = (await res.json()) as { ok?: boolean; error?: string; images?: UploadedImage[] };
      if (!res.ok || !data.ok) {
        setStepError(data.error ?? "Photo upload nahi ho saki, dobara try karein.");
        return;
      }
      setImages((prev) => [...prev, ...(data.images ?? [])].slice(0, 12));
    } catch {
      setStepError("Internet check kar ke photo dobara upload karein.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handlePublish() {
    if (!name.trim()) {
      setStepError("Please apna Full Name likhein.");
      return;
    }
    if (!phone.trim()) {
      setStepError("Please apna Mobile ya WhatsApp number likhein.");
      return;
    }
    const trimmedEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setStepError("Please apna valid Email address likhein (isi par aapka account aur ad status save hoga).");
      return;
    }
    if (!isSignedInNow && createAccount && password.length < 6) {
      setStepError("Account banane ke liye kam az kam 6 characters ka password likhein.");
      return;
    }

    setSubmitting(true);
    setStepError("");
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: trimmedEmail,
          phone: phone.trim(),
          title: title.trim(),
          purpose,
          category,
          propertyType,
          citySlug,
          cityName: cityObj.name,
          locationArea: locationArea.trim(),
          address: address.trim(),
          lat,
          lng,
          price: Number(price.replace(/[^\d]/g, "")),
          paymentType,
          videoUrl: videoUrl.trim(),
          negotiable,
          bedrooms: kind === "plot" ? 0 : Number(bedrooms.replace(/[^\d]/g, "")) || 0,
          bathrooms: kind === "plot" ? 0 : Number(bathrooms.replace(/[^\d]/g, "")) || 0,
          areaValue: Number(areaValue),
          areaUnit,
          parking: kind === "plot" ? 0 : Number(parking.replace(/[^\d]/g, "")) || 0,
          furnishing,
          possession,
          description: description.trim(),
          features: selectedTags.join(", "),
          amenities: "",
          imageUrls: images.map((img) => img.url),
          createAccount: !isSignedInNow && createAccount,
          password: !isSignedInNow && createAccount ? password : "",
        }),
      });
      const payload = (await res.json()) as {
        ok?: boolean;
        error?: string;
        id?: number;
        accountCreated?: boolean;
        signedIn?: boolean;
        emailAlreadyRegistered?: boolean;
      };
      if (!res.ok || !payload.ok) {
        setStepError(payload.error ?? "Ad submit nahi ho saka, please dobara try karein.");
        setSubmitting(false);
        return;
      }
      setDoneRefId(payload.id ?? null);
      setAccountCreated(Boolean(payload.accountCreated));
      setIsSignedInNow(Boolean(payload.signedIn));
      setEmailAlreadyRegistered(Boolean(payload.emailAlreadyRegistered));
      setDoneSubmitted(true);
      setSubmitting(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setStepError("Network error — internet check kar ke dobara button dabayein.");
      setSubmitting(false);
    }
  }

  function resetWizard() {
    setDoneSubmitted(false);
    setDoneRefId(null);
    setStep(0);
    setPrice("");
    setImages([]);
    setSelectedTags([]);
    setDescription("");
    setVideoUrl("");
    setCustomTitle("");
    setTitleEdited(false);
    setStepError("");
  }

  return (
    <section className="mlw-shell md:hidden" aria-label="Post Your Property">
      <div className="mlw-container">
        {doneSubmitted ? (
          <div className="pps-success-card mlw-card">
            <div className="pps-success-badge">
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="m5 12.5 4.5 4.5L19 7.5" />
              </svg>
            </div>
            <span className="pps-pill-gold">
              {doneRefId ? `Submission #${doneRefId} · Sent to Admin` : "Sent to Admin Review"}
            </span>
            <h1 className="pps-success-title">Mubarak! Ad Admin Review Mein Chala Gaya</h1>

            {accountCreated && (
              <div className="mlw-account-status mlw-account-status--ok">
                <b>✓ Aapka Properties Pak Account Ban Gaya Hai!</b>
                <p>
                  Aap <strong>{email}</strong> se login ho chuke hain. Ye property aapke{" "}
                  <strong>My Account Dashboard</strong> mein track ho rahi hai — Admin approval ke baad aapka public
                  Dealer Profile bhi active ho jayega.
                </p>
              </div>
            )}

            {!accountCreated && isSignedInNow && (
              <div className="mlw-account-status mlw-account-status--ok">
                <b>✓ Linked to Your Account</b>
                <p>
                  Ye property aapke <strong>My Account → Your Listings</strong> mein save ho gayi hai aur Admin team ke
                  paas tamam details &amp; photos पहुंच chuki hain.
                </p>
              </div>
            )}

            {emailAlreadyRegistered && (
              <div className="mlw-account-status mlw-account-status--warn">
                <b>Email Pehle Se Registered Hai</b>
                <p>
                  Ad Admin queue mein save ho gaya hai, lekin <strong>{email}</strong> par pehle se account maujood hai.{" "}
                  <Link href="/login" className="underline font-bold">
                    Sign In
                  </Link>{" "}
                  kar ke apne dashboard se link karein.
                </p>
              </div>
            )}

            <p className="pps-success-copy">
              <strong>{title}</strong> ({formatPkrWords(price).replace(/^=\s*/, "")}) Admin verification ke baad live ho
              jayegi.
            </p>

            <div className="pps-success-summary">
              <div>
                <span>Ref ID</span>
                <b>#{doneRefId ?? "Pending"}</b>
              </div>
              <div>
                <span>Photos</span>
                <b>{images.length} Saved</b>
              </div>
              <div>
                <span>Account</span>
                <b>{isSignedInNow ? "Active ✓" : "Guest"}</b>
              </div>
            </div>

            <div className="grid gap-2.5">
              {isSignedInNow && (
                <Link href="/account" className="pps-primary-btn">
                  Open My Account Dashboard →
                </Link>
              )}
              <button
                type="button"
                onClick={resetWizard}
                className={isSignedInNow ? "pps-secondary-btn" : "pps-primary-btn"}
              >
                Post Another Property
              </button>
              <Link href="/" className="pps-secondary-btn">
                Back to Home
              </Link>
            </div>
          </div>
        ) : step === 0 ? (
          <div className="pps-step-anim mlw-card">
            <div className="pps-welcome-hero">
              <span className="pps-pill-emerald">Free Property Listing · Verified</span>
              <h1 className="mlw-hero-h1">Apni Property Ka Ad Lagayein</h1>
              <p>Asaan step-by-step flow — aapka Account aur Admin Review dono ek sath:</p>
            </div>

            {/* Signed-in or Quick Account Banner right on Screen 0 */}
            {isSignedInNow ? (
              <div className="mlw-signed-pill">
                <IconCheck className="h-4 w-4 shrink-0 text-[#0b7650]" />
                <span>
                  Signed in as <b>{initialName || initialEmail || "Member"}</b> — ad seedha aapke{" "}
                  <Link href="/account" className="underline font-bold text-[#0b7650]">
                    Dashboard
                  </Link>{" "}
                  mein jayega.
                </span>
              </div>
            ) : (
              <div className="mlw-auth-strip">
                <span>Naya account aakhri step mein khud ban jayega</span>
                <Link href="/login?returnTo=/list-property" className="mlw-signin-link">
                  Sign In
                </Link>
              </div>
            )}

            <div className="pps-intent-stack">
              <button
                type="button"
                className="pps-intent-card"
                onClick={() => {
                  setPurpose("buy");
                  setStepError("");
                  setStep(1);
                }}
              >
                <span className="pps-intent-icon pps-intent-icon--emerald">
                  <KindSvg kind="house" />
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
                  setStepError("");
                  setStep(1);
                }}
              >
                <span className="pps-intent-icon pps-intent-icon--gold">
                  <KindSvg kind="flat" />
                </span>
                <span className="pps-intent-body">
                  <b>Rent Out Property</b>
                  <small>Verified family ya corporate tenant dhoondein</small>
                </span>
                <span className="pps-intent-arrow">→</span>
              </button>
            </div>

            {!isSignedInNow && googleEnabled && (
              <Link href="/api/auth/google?returnTo=/list-property" className="mlw-google-btn">
                <IconGoogle className="h-4 w-4 shrink-0" />
                <span>1-Tap Sign In with Google</span>
              </Link>
            )}

            <div className="pps-wa-assist">
              <div>
                <span className="pps-wa-tag">Need Help?</span>
                <h2>Form bharne mein madad chahiye?</h2>
                <p>Hamari team ko WhatsApp par photos aur details bhej kar bhi listing karwa sakte hain.</p>
              </div>
              <a
                href={`https://wa.me/${cleanWaDigits}?text=${encodeURIComponent(
                  "Assalam o Alaikum, mujhe Properties Pak par apni property ka free ad lagwana hai.",
                )}`}
                target="_blank"
                rel="noreferrer"
                className="pps-wa-btn"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        ) : (
          <div className="pps-step-anim mlw-card">
            <h1 className="sr-only">List Your Property</h1>

            <div className="pps-wizard-top">
              <button
                type="button"
                onClick={() => {
                  setStepError("");
                  setStep((prev) => (prev > 0 ? ((prev - 1) as WizardStep) : 0));
                }}
                className="pps-back-btn"
              >
                ← Back
              </button>
              <span className="pps-step-count">Step {step} of 4</span>
              <span className="pps-mode-pill">{purpose === "buy" ? "For Sale" : "For Rent"}</span>
            </div>

            <div className="pps-progress-track" aria-hidden="true">
              <div className="pps-progress-fill" style={{ width: `${(step / 4) * 100}%` }} />
            </div>

            {stepError && (
              <div role="alert" className="mlw-error-banner">
                {stepError}
              </div>
            )}

            {/* STEP 1: PROPERTY TYPE, LOCATION & MAP PIN */}
            {step === 1 && (
              <div className="pps-form-stack">
                <div>
                  <label className="pps-label">1. Property Category chunein</label>
                  <div className="pps-kind-grid">
                    {KINDS.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => selectKind(item.id)}
                        className={`pps-kind-card${kind === item.id ? " is-selected" : ""}`}
                      >
                        <span className="pps-kind-icon">
                          <KindSvg kind={item.id} />
                        </span>
                        <b>{item.label}</b>
                        <small>{item.sub}</small>
                      </button>
                    ))}
                  </div>

                  {activeKindMeta.subTypes.length > 1 && (
                    <div className="pps-chip-scroll">
                      {activeKindMeta.subTypes.map((st) => (
                        <button
                          key={st.label}
                          type="button"
                          onClick={() => {
                            setCategory(st.category);
                            setPropertyType(st.propertyType);
                          }}
                          className={`pps-chip pps-chip--sm${propertyType === st.propertyType ? " is-selected" : ""}`}
                        >
                          {st.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="pps-label">2. City chunein *</label>
                  <div className="pps-chip-row">
                    {CITIES.map((c) => (
                      <button
                        key={c.slug}
                        type="button"
                        onClick={() => selectCity(c.slug)}
                        className={`pps-chip${citySlug === c.slug ? " is-selected" : ""}`}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="pps-label" htmlFor="mlw-society">
                    3. Society / Phase / Sector *
                  </label>
                  <LocationAutocomplete
                    id="mlw-society"
                    value={locationArea}
                    onChange={(val) => {
                      setSkipSocietyQuery("");
                      setLocationArea(val);
                      if (stepError) setStepError("");
                    }}
                    onSelect={(s) => {
                      setSkipSocietyQuery(s.label);
                      setLocationArea(s.label);
                      if (s.lat && s.lng) {
                        setLat(Math.round(s.lat * 1e5) / 1e5);
                        setLng(Math.round(s.lng * 1e5) / 1e5);
                      }
                      setStepError("");
                    }}
                    citySlug={citySlug}
                    cityName={cityObj.name}
                    placeholder={`Type DHA, Bahria, Sector in ${cityObj.name}...`}
                    skipQuery={skipSocietyQuery}
                    className="mlw-autocomplete"
                  />
                  <div className="pps-chip-scroll">
                    {societies.map((soc) => (
                      <button
                        key={soc}
                        type="button"
                        onClick={() => pickQuickSociety(soc)}
                        className={`pps-chip pps-chip--sm${locationArea === soc ? " is-selected" : ""}`}
                      >
                        {soc}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="pps-label" htmlFor="mlw-address">
                    Block / Street / Plot No. <span className="font-normal text-[#6a7d73]">(For Admin Verification)</span>
                  </label>
                  <input
                    id="mlw-address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Block C, Plot 147, 60-ft Road"
                    className="pps-input"
                  />
                </div>

                {/* Collapsible Exact Satellite Map Pin (saves exact lat/lng for Admin!) */}
                <div className="mlw-map-accordion">
                  <button
                    type="button"
                    onClick={() => setShowMapPin((v) => !v)}
                    className="mlw-map-toggle"
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <IconPin className="h-4 w-4 shrink-0 text-[#0b7650]" />
                      <span className="truncate">
                        {showMapPin
                          ? "Hide Satellite Map Pin"
                          : `Map Pin Set (${lat.toFixed(3)}, ${lng.toFixed(3)}) · Tap to Adjust`}
                      </span>
                    </span>
                    <b>{showMapPin ? "Done" : "Pin Map"}</b>
                  </button>

                  {showMapPin && (
                    <div className="mt-2.5 overflow-hidden rounded-xl border border-[#dce6e0]">
                      <LocationPicker
                        lat={lat}
                        lng={lng}
                        citySlug={citySlug}
                        cityName={cityObj.name}
                        locationQuery={[locationArea, address].filter(Boolean).join(", ")}
                        plotLabel={address.trim() || locationArea.trim() || "Property location"}
                        plotSubtitle={`${areaValue} ${areaUnit} ${propertyType}`}
                        onChange={(pickedLat, pickedLng) => {
                          setLat(pickedLat);
                          setLng(pickedLng);
                        }}
                        onLocationLabel={(lbl) => {
                          setSkipSocietyQuery(lbl);
                          setLocationArea(lbl);
                        }}
                        autoLocate
                      />
                    </div>
                  )}
                </div>

                <button type="button" onClick={goStep2} className="pps-primary-btn">
                  Next: Size, Price &amp; Specs →
                </button>
              </div>
            )}

            {/* STEP 2: SIZE, PRICE & ROOM SPECS */}
            {step === 2 && (
              <div className="pps-form-stack">
                <div>
                  <label className="pps-label">1. Property Area / Size *</label>
                  <div className="pps-chip-grid-3">
                    {QUICK_SIZES.map((qs) => {
                      const selected = areaValue === qs.value && areaUnit === qs.unit;
                      return (
                        <button
                          key={qs.label}
                          type="button"
                          onClick={() => {
                            setAreaValue(qs.value);
                            setAreaUnit(qs.unit);
                            setStepError("");
                          }}
                          className={`pps-chip${selected ? " is-selected" : ""}`}
                        >
                          {qs.label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mlw-custom-size-row">
                    <input
                      type="number"
                      inputMode="decimal"
                      min="1"
                      value={areaValue}
                      onChange={(e) => setAreaValue(e.target.value)}
                      placeholder="Custom size"
                      aria-label="Property size"
                      className="pps-input"
                    />
                    <select
                      value={areaUnit}
                      onChange={(e) => setAreaUnit(e.target.value as "marla" | "kanal" | "sqft")}
                      aria-label="Area unit"
                      className="pps-input"
                    >
                      <option value="marla">Marla</option>
                      <option value="kanal">Kanal</option>
                      <option value="sqft">Sq.ft</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="pps-label" htmlFor="mlw-price">
                    2. {purpose === "buy" ? "Asking Price (PKR) *" : "Monthly Rent (PKR) *"}
                  </label>
                  <div className="pps-price-box">
                    <span className="pps-price-prefix">PKR</span>
                    <input
                      id="mlw-price"
                      type="text"
                      inputMode="numeric"
                      value={price}
                      onChange={(e) => {
                        setPrice(e.target.value.replace(/[^\d]/g, ""));
                        if (stepError) setStepError("");
                      }}
                      placeholder={purpose === "buy" ? "e.g. 32500000" : "e.g. 85000"}
                      className="pps-price-input"
                    />
                  </div>
                  <div className="pps-price-helper">{formatPkrWords(price)}</div>
                  <div className="pps-chip-scroll">
                    {priceChips.map((chip) => (
                      <button
                        key={chip.value}
                        type="button"
                        onClick={() => {
                          setPrice(chip.value);
                          setStepError("");
                        }}
                        className={`pps-chip pps-chip--sm${price === chip.value ? " is-selected" : ""}`}
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mlw-inline-checks">
                  {purpose === "buy" && (
                    <div className="pps-segmented">
                      <button
                        type="button"
                        onClick={() => setPaymentType("cash")}
                        className={paymentType === "cash" ? "is-active" : ""}
                      >
                        Cash Payment
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentType("installments")}
                        className={paymentType === "installments" ? "is-active" : ""}
                      >
                        Installments
                      </button>
                    </div>
                  )}

                  <label className="mlw-check-row">
                    <input
                      type="checkbox"
                      checked={negotiable}
                      onChange={(e) => setNegotiable(e.target.checked)}
                      className="h-4 w-4 accent-[#0b7650]"
                    />
                    <span>Price is negotiable (Kami-beshi mumkin hai)</span>
                  </label>
                </div>

                {kind !== "plot" && (
                  <>
                    <div>
                      <label className="pps-label">3. Bedrooms &amp; Bathrooms</label>
                      <div className="pps-chip-scroll">
                        {["1", "2", "3", "4", "5", "6"].map((b) => (
                          <button
                            key={`bed-${b}`}
                            type="button"
                            onClick={() => setBedrooms(b)}
                            className={`pps-chip pps-chip--sm${bedrooms === b ? " is-selected" : ""}`}
                          >
                            {b} Bed
                          </button>
                        ))}
                      </div>
                      <div className="pps-chip-scroll mt-2">
                        {["1", "2", "3", "4", "5", "6"].map((b) => (
                          <button
                            key={`bath-${b}`}
                            type="button"
                            onClick={() => setBathrooms(b)}
                            className={`pps-chip pps-chip--sm${bathrooms === b ? " is-selected" : ""}`}
                          >
                            {b} Bath
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pps-two-col">
                      <div>
                        <label className="pps-label" htmlFor="mlw-furnishing">
                          Furnishing
                        </label>
                        <select
                          id="mlw-furnishing"
                          value={furnishing}
                          onChange={(e) => setFurnishing(e.target.value)}
                          className="pps-input"
                        >
                          {["Unfurnished", "Semi-furnished", "Fully furnished", "Fitted", "Bare shell"].map((o) => (
                            <option key={o} value={o}>
                              {o}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="pps-label" htmlFor="mlw-parking">
                          Car Parking
                        </label>
                        <select
                          id="mlw-parking"
                          value={parking}
                          onChange={(e) => setParking(e.target.value)}
                          className="pps-input"
                        >
                          <option value="0">None</option>
                          <option value="1">1 Car</option>
                          <option value="2">2 Cars</option>
                          <option value="3">3+ Cars</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="pps-label" htmlFor="mlw-possession">
                    Possession Status
                  </label>
                  <select
                    id="mlw-possession"
                    value={possession}
                    onChange={(e) => setPossession(e.target.value)}
                    className="pps-input"
                  >
                    {["Available", "Immediate", "Within 1 month", "Within 3 months", "On completion"].map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>

                <button type="button" onClick={goStep3} className="pps-primary-btn">
                  Next: Photos &amp; Details →
                </button>
              </div>
            )}

            {/* STEP 3: PHOTOS, AUTO-TITLE, FEATURES & DESCRIPTION */}
            {step === 3 && (
              <div className="pps-form-stack">
                <div>
                  <label className="pps-label">1. Property Photos * (Camera ya Gallery)</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    multiple
                    className="sr-only"
                    onChange={(e) => handleUploadFiles(e.target.files)}
                  />
                  <button
                    type="button"
                    disabled={uploading || images.length >= 12}
                    onClick={() => fileInputRef.current?.click()}
                    className="pps-upload-box"
                  >
                    <span className="pps-upload-circle">{uploading ? "…" : "+"}</span>
                    <b>
                      {uploading
                        ? "Original Quality Photos Upload Ho Rahi Hain…"
                        : images.length > 0
                          ? `Add More Photos (${images.length}/12 Uploaded)`
                          : "Tap to Upload Property Photos"}
                    </b>
                    <small>Pehli photo cover banegi · Clear original photos jaldi approve hoti hain</small>
                  </button>

                  {images.length > 0 && (
                    <div className="mlw-photo-grid">
                      {images.map((img, idx) => (
                        <div key={img.id} className="mlw-photo-thumb">
                          <ResilientImage
                            src={img.url}
                            alt={`Property photo ${idx + 1}`}
                            width={240}
                            height={180}
                            className="h-full w-full object-cover"
                          />
                          {idx === 0 && <span className="mlw-cover-tag">Cover</span>}
                          <button
                            type="button"
                            aria-label="Remove photo"
                            onClick={() => setImages((prev) => prev.filter((item) => item.id !== img.id))}
                            className="mlw-remove-photo"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="pps-label" htmlFor="mlw-title">
                    2. Ad Title * <span className="font-normal text-[#6a7d73]">(Auto-filled, aap edit kar sakte hain)</span>
                  </label>
                  <input
                    id="mlw-title"
                    type="text"
                    value={title}
                    onChange={(e) => {
                      setTitleEdited(true);
                      setCustomTitle(e.target.value);
                      if (stepError) setStepError("");
                    }}
                    className="pps-input"
                  />
                </div>

                <div>
                  <label className="pps-label">3. Key Features (1-Tap Select)</label>
                  <div className="pps-chip-row">
                    {QUICK_FEATURE_TAGS.map((tag) => {
                      const active = selectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag(tag)}
                          className={`pps-chip pps-chip--sm${active ? " is-selected" : ""}`}
                        >
                          {active ? `✓ ${tag}` : `+ ${tag}`}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="pps-label" htmlFor="mlw-desc">
                    4. Property Description <span className="font-normal text-[#6a7d73]">(Optional)</span>
                  </label>
                  <textarea
                    id="mlw-desc"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Facing, road width, nearby park/mosque, transfer/allotment status…"
                    className="pps-input py-2.5"
                  />
                </div>

                <div>
                  <label className="pps-label" htmlFor="mlw-video">
                    YouTube / Video Tour Link <span className="font-normal text-[#6a7d73]">(Optional)</span>
                  </label>
                  <input
                    id="mlw-video"
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className="pps-input"
                  />
                </div>

                <button type="button" onClick={goStep4} className="pps-primary-btn">
                  Next: Account &amp; Submit →
                </button>
              </div>
            )}

            {/* STEP 4: OWNER DETAILS + ACCOUNT CREATION + ADMIN SUBMISSION */}
            {step === 4 && (
              <div className="pps-form-stack">
                <div>
                  <label className="pps-label" htmlFor="mlw-name">
                    1. Full Name (Owner / Agent) *
                  </label>
                  <input
                    id="mlw-name"
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (stepError) setStepError("");
                    }}
                    placeholder="e.g. Ahmed Khan"
                    className="pps-input"
                  />
                </div>

                <div>
                  <label className="pps-label" htmlFor="mlw-phone">
                    2. Phone / WhatsApp Number *
                  </label>
                  <input
                    id="mlw-phone"
                    type="tel"
                    inputMode="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (stepError) setStepError("");
                    }}
                    placeholder="+92 300 1234567"
                    className="pps-input"
                  />
                </div>

                <div>
                  <label className="pps-label" htmlFor="mlw-email">
                    3. Email Address *
                  </label>
                  <input
                    id="mlw-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (stepError) setStepError("");
                    }}
                    placeholder="you@email.com"
                    className="pps-input"
                  />
                </div>

                {/* ACCOUNT CREATION & DASHBOARD LINKING BOX */}
                <div className="mlw-account-box">
                  {isSignedInNow ? (
                    <div className="flex items-start gap-2.5">
                      <IconCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#0b7650]" />
                      <div>
                        <b className="block text-[0.84rem] text-[#0d261d]">
                          Aap Signed In Hain — Ad Seedha Aapke Account Mein Jayega
                        </b>
                        <p className="mt-1 text-[0.75rem] leading-relaxed text-[#52665c]">
                          Submit karte hi ye listing aapke <strong>/account Dashboard</strong> aur{" "}
                          <strong>Admin Verification Queue</strong> dono mein save ho jayegi.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <label className="flex cursor-pointer items-start gap-2.5">
                        <input
                          type="checkbox"
                          checked={createAccount}
                          onChange={(e) => setCreateAccount(e.target.checked)}
                          className="mt-0.5 h-4 w-4 shrink-0 accent-[#0b7650]"
                        />
                        <span>
                          <b className="block text-[0.84rem] text-[#0d261d]">
                            Mera Properties Pak Account Bhi Bana Dein (Recommended)
                          </b>
                          <span className="mt-1 block text-[0.74rem] leading-relaxed text-[#52665c]">
                            Ek hi step mein aapka <strong>Owner / Dealer Account</strong> ban jayega aur login ho jayega
                            — aap apne dashboard mein ad ka status, buyer enquiries aur verified{" "}
                            <strong>Blue Tick Profile</strong> track kar sakenge.
                          </span>
                        </span>
                      </label>

                      {createAccount && (
                        <div className="mt-3 pt-3 border-t border-[#dce8e1]">
                          <label className="pps-label" htmlFor="mlw-password">
                            Set Account Password * <span className="font-normal text-[#6a7d73]">(Min 6 characters)</span>
                          </label>
                          <input
                            id="mlw-password"
                            type="password"
                            minLength={6}
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value);
                              if (stepError) setStepError("");
                            }}
                            placeholder="Create password (6+ characters)"
                            className="pps-input"
                          />
                          <p className="mt-2 text-[0.72rem] text-[#596d63]">
                            Pehle se account hai? Apna purana password likh dein ya{" "}
                            <Link href="/login?returnTo=/list-property" className="font-bold text-[#0b7650] underline">
                              Sign In
                            </Link>{" "}
                            karein — ad aapke usi account se jud jayega.
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <button
                  type="button"
                  disabled={submitting || uploading}
                  onClick={handlePublish}
                  className="pps-primary-btn"
                >
                  {submitting
                    ? "Saving Account & Sending to Admin…"
                    : !isSignedInNow && createAccount
                      ? "Create Account & Submit Ad for Approval →"
                      : "Submit Ad for Admin Approval →"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
