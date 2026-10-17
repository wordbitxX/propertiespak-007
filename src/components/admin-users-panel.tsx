"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { BlueTick, UnverifiedChip, initialsFor } from "@/components/verified-badge";
import { IconCheck, IconClose, IconSearch } from "@/components/icons";
import { ResilientImage } from "@/components/resilient-image";
import type { DealerProfile } from "@/lib/queries";
import { formatDate } from "@/lib/format";

type Filter = "all" | "verified" | "unverified" | "dealers" | "requested";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All accounts" },
  { key: "dealers", label: "Has listings" },
  { key: "verified", label: "Verified" },
  { key: "unverified", label: "Not verified" },
  { key: "requested", label: "Verification requests" },
];

/** Complete editable profile — everything the public dealer page can show. */
type ProfileDraft = {
  name: string;
  agency: string;
  designation: string;
  role: string;
  phone: string;
  whatsapp: string;
  companyPhone: string;
  companyWebsite: string;
  officeAddress: string;
  areas: string;
  experience: string;
  bio: string;
  verificationNote: string;
  cityName: string;
  avatarUrl: string;
  companyLogo: string;
};

function draftFrom(user: DealerProfile): ProfileDraft {
  return {
    name: user.name ?? "",
    agency: user.agency ?? "",
    designation: user.designation ?? "",
    role: user.role ?? "member",
    phone: user.phone ?? "",
    whatsapp: user.whatsapp ?? "",
    companyPhone: user.companyPhone ?? "",
    companyWebsite: user.companyWebsite ?? "",
    officeAddress: user.officeAddress ?? "",
    areas: user.areas ?? "",
    experience: user.experience ?? "",
    bio: user.bio ?? "",
    verificationNote: user.verificationNote ?? "",
    cityName: user.cityName ?? "",
    avatarUrl: user.avatarUrl ?? "",
    companyLogo: user.companyLogo ?? "",
  };
}

/**
 * Admin controls for dealer verification and the complete public profile.
 * Every account is listed with its listing footprint; admins can verify or
 * unverify it and edit the whole profile — identity, agency, contact details,
 * professional bio and the profile photo / company logo.
 */
export function AdminUsersPanel() {
  const router = useRouter();
  const [items, setItems] = useState<DealerProfile[]>([]);
  const [counts, setCounts] = useState({ total: 0, verified: 0, dealers: 0, profiles: 0, requested: 0 });
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<number | null>(null);
  const [uploading, setUploading] = useState<"avatar" | "logo" | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<ProfileDraft | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/users");
      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }
      const payload = (await response.json()) as {
        ok?: boolean;
        items?: DealerProfile[];
        counts?: { total: number; verified: number; dealers: number; profiles: number; requested: number };
        error?: string;
      };
      if (!response.ok || !payload.ok) {
        setError(payload.error ?? "Could not load accounts.");
        return;
      }
      setItems(payload.items ?? []);
      setCounts(payload.counts ?? { total: 0, verified: 0, dealers: 0, profiles: 0, requested: 0 });
    } catch {
      setError("Network error. Please refresh and try again.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  function set<K extends keyof ProfileDraft>(key: K, value: ProfileDraft[K]) {
    setDraft((current) => (current ? { ...current, [key]: value } : current));
  }

  async function setVerification(user: DealerProfile, verified: boolean) {
    setActing(user.id);
    setError("");
    setNotice("");
    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verified }),
      });
      const payload = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !payload.ok) {
        setError(payload.error ?? "Could not update verification.");
        return;
      }
      setNotice(
        verified
          ? `${user.name} is now verified — the blue tick shows on the profile, their listings and their property cards.`
          : `${user.name} is no longer verified — the tick has been removed site-wide.`,
      );
      await load();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setActing(null);
    }
  }

  async function clearRequest(user: DealerProfile) {
    setActing(user.id);
    setError("");
    setNotice("");
    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "clear-request" }),
      });
      const payload = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !payload.ok) {
        setError(payload.error ?? "Could not clear the request.");
        return;
      }
      setNotice(`Verification request for ${user.name} marked as reviewed.`);
      await load();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setActing(null);
    }
  }

  /** Uploads a profile photo or company logo, then stores its media URL. */
  async function uploadImage(file: File | undefined, kind: "avatar" | "logo") {
    if (!file) return;
    setUploading(kind);
    setError("");
    try {
      const form = new FormData();
      form.append("images", file);
      const response = await fetch("/api/media/upload", { method: "POST", body: form });
      const payload = (await response.json()) as { ok?: boolean; images?: { url: string }[]; error?: string };
      if (!response.ok || !payload.ok || !payload.images?.length) {
        setError(payload.error ?? "Could not upload that image.");
        return;
      }
      set(kind === "avatar" ? "avatarUrl" : "companyLogo", payload.images[0].url);
      setNotice(`${kind === "avatar" ? "Profile photo" : "Company logo"} uploaded — save the form to apply it.`);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(null);
    }
  }

  async function saveProfile(user: DealerProfile) {
    if (!draft) return;
    const name = draft.name.trim();
    if (name.length < 2) {
      setError("Public name must be at least 2 characters.");
      return;
    }
    if (name.length > 120 || draft.agency.trim().length > 160) {
      setError("Name or agency is too long. Please shorten it and try again.");
      return;
    }

    setActing(user.id);
    setError("");
    setNotice("");
    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: draft.name.trim(),
          agency: draft.agency.trim(),
          designation: draft.designation.trim(),
          role: draft.role,
          phone: draft.phone.trim(),
          whatsapp: draft.whatsapp.trim(),
          companyPhone: draft.companyPhone.trim(),
          companyWebsite: draft.companyWebsite.trim(),
          officeAddress: draft.officeAddress.trim(),
          areas: draft.areas.trim(),
          experience: draft.experience.trim(),
          bio: draft.bio.trim(),
          verificationNote: draft.verificationNote.trim(),
          cityName: draft.cityName.trim(),
          avatarUrl: draft.avatarUrl.trim(),
          companyLogo: draft.companyLogo.trim(),
        }),
      });
      const payload = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !payload.ok) {
        setError(payload.error ?? "Could not update the profile.");
        return;
      }
      setEditingId(null);
      setDraft(null);
      setNotice(`Profile updated for ${name} — changes are live on the public dealer profile.`);
      await load();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setActing(null);
    }
  }

  const visible = items.filter((user) => {
    if (filter === "verified" && !user.isVerified) return false;
    if (filter === "unverified" && user.isVerified) return false;
    if (filter === "dealers" && user.listings === 0) return false;
    if (filter === "requested" && !(user.verificationRequestedAt && !user.isVerified)) return false;
    if (query.trim()) {
      const term = query.trim().toLowerCase();
      const haystack =
        `${user.name} ${user.email} ${user.cityName} ${user.agency} ${user.designation} ${user.areas} ${user.whatsapp} ${user.companyPhone}`.toLowerCase();
      if (!haystack.includes(term)) return false;
    }
    return true;
  });

  return (
    <div className="min-w-0">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-panel border border-soft bg-white px-5 py-4">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-ink-muted">Registered accounts</p>
          <p className="mt-1 font-sans text-[1.5rem] font-bold text-navy-900">{counts.total}</p>
        </div>
        <div className="rounded-panel border border-soft bg-white px-5 py-4">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-ink-muted">Accounts with listings</p>
          <p className="mt-1 font-sans text-[1.5rem] font-bold text-navy-900">{counts.dealers}</p>
        </div>
        <div className="rounded-panel border border-soft bg-white px-5 py-4">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-ink-muted">Verified (blue tick)</p>
          <p className="mt-1 flex items-center gap-2 font-sans text-[1.5rem] font-bold text-navy-900">
            {counts.verified} <BlueTick className="h-5 w-5" />
          </p>
        </div>
        <div className="rounded-panel border border-soft bg-white px-5 py-4">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-ink-muted">Profiles completed</p>
          <p className="mt-1 font-sans text-[1.5rem] font-bold text-navy-900">{counts.profiles}</p>
        </div>
        <div className={`rounded-panel border px-5 py-4 ${counts.requested > 0 ? "border-amber-300 bg-amber-50" : "border-soft bg-white"}`}>
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-ink-muted">Verification requests</p>
          <p className="mt-1 font-sans text-[1.5rem] font-bold text-navy-900">{counts.requested}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Account filters">
          {FILTERS.map((item) => (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={filter === item.key}
              onClick={() => setFilter(item.key)}
              className={`rounded-[10px] border px-4 py-2.5 font-sans text-[0.8125rem] font-semibold transition-colors ${
                filter === item.key ? "border-navy-800 bg-navy-800 text-white" : "border-soft bg-white text-navy-900 hover:border-navy-800"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="relative min-w-[240px] flex-1 sm:max-w-xs">
          <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, email or city"
            className="field pl-9"
            aria-label="Search accounts"
          />
        </div>
      </div>

      {notice && (
        <p className="mt-4 rounded-xl border border-forest-600/30 bg-forest-50 px-4 py-3 text-[0.8125rem] font-medium text-forest-700">
          {notice}
        </p>
      )}
      {error && (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[0.8125rem] font-medium text-red-700">{error}</p>
      )}

      {loading ? (
        <p className="mt-6 text-[0.875rem] text-ink-muted">Loading accounts…</p>
      ) : visible.length === 0 ? (
        <p className="mt-6 rounded-panel border border-soft bg-white p-8 text-center text-[0.875rem] text-ink-muted">
          No accounts match this view.
        </p>
      ) : (
        <div className="mt-6 grid min-w-0 gap-4">
          {visible.map((user) => (
            <article key={user.id} className="min-w-0 rounded-panel border border-soft bg-white p-5 shadow-soft">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-4">
                  <span className="relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full bg-navy-900 font-sans text-[0.9375rem] font-bold text-white">
                    {user.avatarUrl ? (
                      <ResilientImage src={user.avatarUrl} alt={user.name} width={96} height={96} className="h-full w-full object-cover" />
                    ) : (
                      initialsFor(user.name)
                    )}
                    {user.isVerified && (
                      <span className="absolute -bottom-0.5 -right-0.5 grid h-5 w-5 place-items-center rounded-full border-2 border-white bg-white">
                        <BlueTick className="h-4 w-4" />
                      </span>
                    )}
                  </span>
                  <div className="min-w-0">
                    <h3 className="flex flex-wrap items-center gap-2 font-sans text-[1rem] font-semibold text-navy-900">
                      {user.name}
                      {user.isVerified ? <BlueTick className="h-4 w-4" /> : <UnverifiedChip />}
                      <span className="rounded-md bg-mist px-2 py-0.5 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-ink-muted">
                        {user.role}
                      </span>
                    </h3>
                    <p className="mt-1 break-words text-[0.8125rem] text-ink-muted">
                      {user.email}
                      {user.phone ? ` · ${user.phone}` : ""}
                    </p>
                    <p className="mt-1 text-[0.75rem] text-ink-muted">
                      {user.cityName || "City not set"}
                      {user.agency ? ` · ${user.agency}` : ""} · Registered {formatDate(user.createdAt)}
                      {user.slug ? (
                        <>
                          {" · "}
                          <Link href={`/dealers/${user.slug}`} className="font-semibold text-forest-700 hover:underline">
                            public profile
                          </Link>
                        </>
                      ) : null}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="text-right">
                    <p className="font-sans text-[1.25rem] font-bold leading-none text-navy-900">{user.listings}</p>
                    <p className="mt-1 text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-ink-muted">
                      {user.listings === 1 ? "listing" : "listings"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-sans text-[1.25rem] font-bold leading-none text-navy-900">{user.verifiedListings}</p>
                    <p className="mt-1 text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-ink-muted">checked</p>
                  </div>
                  <button
                    type="button"
                    aria-expanded={editingId === user.id}
                    aria-controls={editingId === user.id ? `admin-user-edit-${user.id}` : undefined}
                    disabled={acting === user.id}
                    onClick={() => {
                      if (editingId === user.id) {
                        setEditingId(null);
                        setDraft(null);
                      } else {
                        setEditingId(user.id);
                        setDraft(draftFrom(user));
                        setError("");
                        setNotice("");
                      }
                    }}
                    className="btn btn-outline"
                  >
                    {editingId === user.id ? "Close editor" : "Edit full profile"}
                  </button>
                  <button
                    type="button"
                    disabled={acting === user.id}
                    onClick={() => setVerification(user, !user.isVerified)}
                    className={user.isVerified ? "btn btn-outline" : "btn btn-primary"}
                  >
                    {user.isVerified ? (
                      <>
                        <IconClose className="h-4 w-4" /> Unverify
                      </>
                    ) : (
                      <>
                        <IconCheck className="h-4 w-4" /> Verify &amp; add blue tick
                      </>
                    )}
                  </button>
                </div>
              </div>

              {editingId === user.id && draft && (
                <form
                  id={`admin-user-edit-${user.id}`}
                  onSubmit={(event) => {
                    event.preventDefault();
                    void saveProfile(user);
                  }}
                  className="mt-4 rounded-xl border border-forest-600/25 bg-forest-50 p-4"
                >
                  {/* Profile pictures */}
                  <div className="flex flex-wrap items-start gap-6">
                    <div>
                      <p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-ink-muted">Profile photo</p>
                      <div className="mt-2 flex items-center gap-3">
                        <span className="grid h-16 w-16 place-items-center overflow-hidden rounded-full border border-soft bg-white font-sans text-[0.875rem] font-bold text-navy-900">
                          {draft.avatarUrl ? (
                            <ResilientImage src={draft.avatarUrl} alt="" width={128} height={128} className="h-full w-full object-cover" />
                          ) : (
                            initialsFor(draft.name || user.name)
                          )}
                        </span>
                        <div className="flex flex-col gap-1.5">
                          <label className="cursor-pointer rounded-lg border border-navy-800/20 bg-white px-3 py-1.5 text-center text-[0.75rem] font-semibold text-navy-900 hover:border-navy-800">
                            {uploading === "avatar" ? "Uploading…" : "Upload photo"}
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp,image/avif"
                              className="hidden"
                              disabled={uploading !== null}
                              onChange={(event) => {
                                void uploadImage(event.target.files?.[0], "avatar");
                                event.target.value = "";
                              }}
                            />
                          </label>
                          {draft.avatarUrl && (
                            <button
                              type="button"
                              onClick={() => set("avatarUrl", "")}
                              className="rounded-lg border border-soft bg-white px-3 py-1.5 text-[0.75rem] font-semibold text-ink-muted hover:border-red-300 hover:text-red-600"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-ink-muted">Company logo</p>
                      <div className="mt-2 flex items-center gap-3">
                        <span className="grid h-16 w-24 place-items-center overflow-hidden rounded-lg border border-soft bg-white">
                          {draft.companyLogo ? (
                            <ResilientImage src={draft.companyLogo} alt="" width={192} height={128} className="h-full w-full object-contain" />
                          ) : (
                            <span className="text-[0.7rem] font-semibold text-ink-muted">No logo</span>
                          )}
                        </span>
                        <div className="flex flex-col gap-1.5">
                          <label className="cursor-pointer rounded-lg border border-navy-800/20 bg-white px-3 py-1.5 text-center text-[0.75rem] font-semibold text-navy-900 hover:border-navy-800">
                            {uploading === "logo" ? "Uploading…" : "Upload logo"}
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp,image/avif"
                              className="hidden"
                              disabled={uploading !== null}
                              onChange={(event) => {
                                void uploadImage(event.target.files?.[0], "logo");
                                event.target.value = "";
                              }}
                            />
                          </label>
                          {draft.companyLogo && (
                            <button
                              type="button"
                              onClick={() => set("companyLogo", "")}
                              className="rounded-lg border border-soft bg-white px-3 py-1.5 text-[0.75rem] font-semibold text-ink-muted hover:border-red-300 hover:text-red-600"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Identity */}
                  <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <div>
                      <label className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-ink-muted" htmlFor={`admin-user-name-${user.id}`}>
                        Public name
                      </label>
                      <input
                        id={`admin-user-name-${user.id}`}
                        value={draft.name}
                        onChange={(event) => set("name", event.target.value)}
                        maxLength={120}
                        minLength={2}
                        required
                        className="field mt-1.5"
                      />
                    </div>
                    <div>
                      <label className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-ink-muted" htmlFor={`admin-user-agency-${user.id}`}>
                        Agency / company name
                      </label>
                      <input
                        id={`admin-user-agency-${user.id}`}
                        value={draft.agency}
                        onChange={(event) => set("agency", event.target.value)}
                        maxLength={160}
                        className="field mt-1.5"
                        placeholder="Leave blank for an individual dealer"
                      />
                    </div>
                    <div>
                      <label className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-ink-muted" htmlFor={`admin-user-designation-${user.id}`}>
                        Designation
                      </label>
                      <input
                        id={`admin-user-designation-${user.id}`}
                        value={draft.designation}
                        onChange={(event) => set("designation", event.target.value)}
                        maxLength={120}
                        className="field mt-1.5"
                        placeholder="e.g. Sales Director"
                      />
                    </div>
                    <div>
                      <label className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-ink-muted" htmlFor={`admin-user-role-${user.id}`}>
                        Account role
                      </label>
                      <select
                        id={`admin-user-role-${user.id}`}
                        value={draft.role}
                        onChange={(event) => set("role", event.target.value)}
                        className="field mt-1.5"
                      >
                        <option value="member">member</option>
                        <option value="dealer">dealer</option>
                        <option value="agency">agency</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-ink-muted" htmlFor={`admin-user-city-${user.id}`}>
                        City
                      </label>
                      <input
                        id={`admin-user-city-${user.id}`}
                        value={draft.cityName}
                        onChange={(event) => set("cityName", event.target.value)}
                        maxLength={120}
                        className="field mt-1.5"
                        placeholder="e.g. Lahore"
                      />
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <div>
                      <label className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-ink-muted" htmlFor={`admin-user-phone-${user.id}`}>
                        Phone
                      </label>
                      <input
                        id={`admin-user-phone-${user.id}`}
                        value={draft.phone}
                        onChange={(event) => set("phone", event.target.value)}
                        maxLength={32}
                        className="field mt-1.5"
                      />
                    </div>
                    <div>
                      <label className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-ink-muted" htmlFor={`admin-user-whatsapp-${user.id}`}>
                        WhatsApp
                      </label>
                      <input
                        id={`admin-user-whatsapp-${user.id}`}
                        value={draft.whatsapp}
                        onChange={(event) => set("whatsapp", event.target.value)}
                        maxLength={32}
                        className="field mt-1.5"
                      />
                    </div>
                    <div>
                      <label className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-ink-muted" htmlFor={`admin-user-company-phone-${user.id}`}>
                        Company phone
                      </label>
                      <input
                        id={`admin-user-company-phone-${user.id}`}
                        value={draft.companyPhone}
                        onChange={(event) => set("companyPhone", event.target.value)}
                        maxLength={32}
                        className="field mt-1.5"
                      />
                    </div>
                    <div>
                      <label className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-ink-muted" htmlFor={`admin-user-website-${user.id}`}>
                        Company website
                      </label>
                      <input
                        id={`admin-user-website-${user.id}`}
                        value={draft.companyWebsite}
                        onChange={(event) => set("companyWebsite", event.target.value)}
                        maxLength={300}
                        className="field mt-1.5"
                        placeholder="https://example.com"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-ink-muted" htmlFor={`admin-user-address-${user.id}`}>
                        Office address
                      </label>
                      <input
                        id={`admin-user-address-${user.id}`}
                        value={draft.officeAddress}
                        onChange={(event) => set("officeAddress", event.target.value)}
                        maxLength={300}
                        className="field mt-1.5"
                      />
                    </div>
                  </div>

                  {/* Professional */}
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-ink-muted" htmlFor={`admin-user-areas-${user.id}`}>
                        Areas dealt in
                      </label>
                      <input
                        id={`admin-user-areas-${user.id}`}
                        value={draft.areas}
                        onChange={(event) => set("areas", event.target.value)}
                        maxLength={300}
                        className="field mt-1.5"
                        placeholder="e.g. DHA, Bahria Town, Gulberg"
                      />
                    </div>
                    <div>
                      <label className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-ink-muted" htmlFor={`admin-user-experience-${user.id}`}>
                        Experience
                      </label>
                      <input
                        id={`admin-user-experience-${user.id}`}
                        value={draft.experience}
                        onChange={(event) => set("experience", event.target.value)}
                        maxLength={160}
                        className="field mt-1.5"
                        placeholder="e.g. 9 years in DHA and Bahria Town"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-ink-muted" htmlFor={`admin-user-bio-${user.id}`}>
                        Bio
                      </label>
                      <textarea
                        id={`admin-user-bio-${user.id}`}
                        value={draft.bio}
                        onChange={(event) => set("bio", event.target.value)}
                        maxLength={600}
                        rows={3}
                        className="field mt-1.5"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-ink-muted" htmlFor={`admin-user-note-${user.id}`}>
                        Verification notes
                      </label>
                      <textarea
                        id={`admin-user-note-${user.id}`}
                        value={draft.verificationNote}
                        onChange={(event) => set("verificationNote", event.target.value)}
                        maxLength={600}
                        rows={2}
                        className="field mt-1.5"
                        placeholder="Documents or notes from the verification request"
                      />
                    </div>
                  </div>

                  <p className="mt-2 text-[0.75rem] text-ink-muted">
                    The complete profile — photos included — appears on the public dealer profile and the agency directory.
                  </p>
                  <div className="mt-4 flex flex-wrap justify-end gap-2">
                    <button
                      type="button"
                      disabled={acting === user.id}
                      onClick={() => {
                        setEditingId(null);
                        setDraft(null);
                      }}
                      className="btn btn-outline"
                    >
                      Cancel
                    </button>
                    <button type="submit" disabled={acting === user.id || uploading !== null} className="btn btn-primary">
                      {acting === user.id ? "Saving…" : "Save changes"}
                    </button>
                  </div>
                </form>
              )}

              <div className="mt-4 grid gap-x-6 gap-y-3 border-t border-soft pt-4 text-[0.75rem] sm:grid-cols-2 xl:grid-cols-3">
                <div>
                  <p className="font-semibold uppercase tracking-[0.1em] text-ink-muted">Profile</p>
                  <p className="mt-1 text-navy-900">
                    {user.profileCompletedAt ? `Completed ${formatDate(user.profileCompletedAt)}` : "Not completed"}
                    {user.verificationRequestedAt && !user.isVerified
                      ? ` · verification requested ${formatDate(user.verificationRequestedAt)}`
                      : ""}
                  </p>
                </div>
                <div>
                  <p className="font-semibold uppercase tracking-[0.1em] text-ink-muted">Agency / designation</p>
                  <p className="mt-1 text-navy-900">
                    {user.agency || "—"}
                    {user.designation ? ` · ${user.designation}` : ""}
                  </p>
                </div>
                <div>
                  <p className="font-semibold uppercase tracking-[0.1em] text-ink-muted">WhatsApp / company phone</p>
                  <p className="mt-1 text-navy-900">
                    {user.whatsapp || "—"}
                    {user.companyPhone ? ` · ${user.companyPhone}` : ""}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <p className="font-semibold uppercase tracking-[0.1em] text-ink-muted">Areas you deal in</p>
                  <p className="mt-1 text-navy-900">{user.areas || "—"}</p>
                </div>
                <div>
                  <p className="font-semibold uppercase tracking-[0.1em] text-ink-muted">Experience</p>
                  <p className="mt-1 text-navy-900">{user.experience || "—"}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="font-semibold uppercase tracking-[0.1em] text-ink-muted">Office address</p>
                  <p className="mt-1 text-navy-900">{user.officeAddress || "—"}</p>
                </div>
                <div>
                  <p className="font-semibold uppercase tracking-[0.1em] text-ink-muted">Company website</p>
                  <p className="mt-1 break-words text-navy-900">
                    {user.companyWebsite ? (
                      <a href={user.companyWebsite} target="_blank" rel="noopener noreferrer" className="font-semibold text-forest-700 hover:underline">
                        {user.companyWebsite}
                      </a>
                    ) : (
                      "—"
                    )}
                  </p>
                </div>
                {(user.bio || user.verificationNote) && (
                  <div className="sm:col-span-2 xl:col-span-3">
                    <p className="font-semibold uppercase tracking-[0.1em] text-ink-muted">Bio / verification notes</p>
                    {user.bio && <p className="mt-1 text-navy-900">{user.bio}</p>}
                    {user.verificationNote && <p className="mt-1 text-ink-muted">Verification: {user.verificationNote}</p>}
                  </div>
                )}
              </div>

              {user.verificationRequestedAt && !user.isVerified && (
                <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3">
                  <p className="text-[0.8125rem] font-medium text-amber-800">
                    This account asked to be verified{user.verificationNote ? " and supplied notes above" : ""}.
                  </p>
                  <button
                    type="button"
                    disabled={acting === user.id}
                    onClick={() => clearRequest(user)}
                    className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-[0.75rem] font-semibold text-amber-800 hover:border-amber-500"
                  >
                    Mark as reviewed
                  </button>
                </div>
              )}

              {user.listings > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-soft pt-4">
                  <Link
                    href={`/properties?q=${encodeURIComponent(user.email)}`}
                    className="text-[0.75rem] font-semibold text-forest-700 hover:underline"
                  >
                    Listings on the marketplace
                  </Link>
                  {user.isVerified && user.verifiedAt && (
                    <span className="text-[0.75rem] text-ink-muted">Verified {formatDate(user.verifiedAt)}</span>
                  )}
                  {!user.isVerified && user.listings > 0 && (
                    <span className="text-[0.75rem] text-ink-muted">
                      Verify to show the blue tick on the profile and every listing this account publishes.
                    </span>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
