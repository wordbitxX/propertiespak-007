"use client";

import { usePathname } from "next/navigation";
import { IconWhatsApp } from "@/components/icons";
import { SITE } from "@/lib/constants";

/** Paths whose phone viewport already pins a Call / WhatsApp bar to the bottom edge. */
const STICKY_BAR_PATHS = [/^\/property\/[^/]+/];

/** wa.me wants the number in international format, digits only. */
const WHATSAPP_NUMBER = SITE.companyPhone.replace(/[^0-9]/g, "");

function whatsappHref(pathname: string) {
  const greeting = "Assalam o Alaikum! I found Properties Pak and would like help with a property.";
  const page = pathname && pathname !== "/" ? `\n\nPage: ${SITE.url}${pathname}` : "";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(greeting + page)}`;
}

/** Floating WhatsApp icon button shown on every public page. */
export function WhatsAppFloat() {
  const pathname = usePathname() ?? "/";

  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/auth") ||
    pathname === "/login"
  ) {
    return null;
  }

  const hasStickyBar = STICKY_BAR_PATHS.some((pattern) => pattern.test(pathname));

  return (
    <a
      href={whatsappHref(pathname)}
      target="_blank"
      rel="noopener noreferrer"
      className="wa-float"
      data-sticky-bar={hasStickyBar ? "true" : undefined}
      aria-label={`Chat with Properties Pak on WhatsApp, ${SITE.companyPhone}`}
      data-testid="whatsapp-float"
      title="Chat on WhatsApp"
    >
      <span className="wa-float-icon" aria-hidden="true">
        <span className="wa-float-pulse" />
        <IconWhatsApp className="wa-float-svg" />
      </span>
    </a>
  );
}
