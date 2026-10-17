"use client";

import { useLanguage } from "@/components/language-provider";

/**
 * Floating badges on the property card image: the purpose pill plus the
 * white "Verified" pill (sky-blue text) for trusted listings. The old
 * "From agent" / "From owner" source pill was removed per product decision.
 */
export function PropertyCardBadges({
  purposeLabel,
  purposeClassName,
  verified = false,
  compact = false,
}: {
  purposeLabel: string;
  purposeClassName?: string;
  /** Kept optional for callers that still pass it; the source pill is gone. */
  fromLabel?: string;
  verified?: boolean;
  compact?: boolean;
}) {
  const { t } = useLanguage();
  return (
    <div
      className={`pointer-events-none absolute left-2.5 flex flex-col items-start gap-1.5 z-10 ${compact ? "top-2.5" : "top-3.5"}`}
    >
      <span
        className={`rounded-md px-2 py-1 text-[0.72rem] font-semibold tracking-wide shadow-sm ${purposeClassName ?? "bg-[#0D382A] text-white"}`}
      >
        {purposeLabel}
      </span>
      {verified && (
        <span
          className="inline-flex items-center gap-1 rounded-md border border-sky-200 bg-white px-2 py-1 text-[0.72rem] font-semibold text-sky-500 shadow-sm"
          title={t("Verified")}
        >
          <svg viewBox="0 0 16 16" className="h-3 w-3 text-sky-500" aria-hidden="true">
            <circle cx="8" cy="8" r="7" fill="currentColor" opacity="0.14" />
            <path
              d="M4.8 8.3l2 2 4.4-4.6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {t("Verified")}
        </span>
      )}
    </div>
  );
}
