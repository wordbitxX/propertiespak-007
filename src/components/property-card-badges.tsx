"use client";

import { useLanguage } from "@/components/language-provider";

/**
 * Card image badges (purpose, "From agent / From owner", "Verified"). This row
 * is a client island so the labels follow the Urdu/English toggle while the
 * card itself stays server-rendered.
 */
export function PropertyCardBadges({
  purposeLabel,
  purposeClassName,
  fromLabel,
  verified,
  compact = false,
}: {
  purposeLabel: string;
  purposeClassName: string;
  fromLabel: string;
  verified: boolean;
  compact?: boolean;
}) {
  const { t } = useLanguage();
  return (
    <div
      className={`absolute flex flex-wrap items-center gap-1.5 ${
        compact ? "left-2.5 top-2.5 max-w-[calc(100%-64px)]" : "left-3.5 top-3.5"
      }`}
    >
      <span
        className={`rounded-md px-2.5 py-1 font-sans text-[0.7rem] font-semibold tracking-[0.03em] shadow-sm ${purposeClassName} shrink-0 whitespace-nowrap`}
      >
        {t(purposeLabel)}
      </span>
      <span className="shrink-0 whitespace-nowrap rounded-md bg-[#E9CD9B] px-2.5 py-1 font-sans text-[0.7rem] font-semibold tracking-[0.03em] text-[#4A3413] shadow-sm">
        {t(fromLabel)}
      </span>
      {verified && (
        <span className="inline-flex shrink-0 whitespace-nowrap items-center gap-1 rounded-md bg-[#2E9E5B] px-2.5 py-1 font-sans text-[0.7rem] font-bold tracking-[0.03em] text-white shadow-sm">
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-3.5 w-3.5">
            <circle cx="8" cy="8" r="7" fill="white" fillOpacity="0.22" />
            <path d="M4.6 8.2l2.2 2.2 4.6-4.6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t("Verified")}
        </span>
      )}
    </div>
  );
}
