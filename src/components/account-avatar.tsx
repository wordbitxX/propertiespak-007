"use client";

import { useState } from "react";
import { DealerLogo } from "@/components/dealer-logo";
import { agencyDisplayName } from "@/lib/agency-name";

/** Show the actual profile photo, then the same agency identity as the public site. */
export function AccountAvatar({ user, size = 48 }: {
  user: { name: string; agency?: string | null; avatarUrl?: string | null; companyLogo?: string | null };
  size?: number;
}) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const photo = user.avatarUrl?.trim();
  if (photo && photo !== failedUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={photo} alt={`${user.name} profile photo`} width={size * 2} height={size * 2}
        loading="lazy" className="h-full w-full rounded-full object-cover" onError={() => setFailedUrl(photo)} />
    );
  }
  // No unrelated stock/property photo, and no writes to the stored profile.
  return <DealerLogo key={user.companyLogo} name={agencyDisplayName(user)} logo={user.companyLogo?.trim()} size={size} />;
}
