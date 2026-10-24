"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { HeaderPropertyMap } from "@/components/header-property-map";
import { NavigationDialog } from "@/components/navigation-dialog";
import { IconBuilding, IconMap, IconSearch } from "@/components/icons";
import { useLanguage } from "@/components/language-provider";

function HomeGlyph() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3.5 10 8.5-6.5 8.5 6.5M5.5 9v11h13V9M10 20v-5.5h4V20" /></svg>;
}

function PlusGlyph() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5v17M3.5 12h17" /></svg>;
}

export function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();
  const [mapOpen, setMapOpen] = useState(false);
  const [mapQuery, setMapQuery] = useState("");

  // Property pages use their own persistent Call/WhatsApp action bar on phones.
  if (pathname.startsWith("/admin") || pathname.startsWith("/property/")) return null;

  const items = [
    { label: "Home", href: "/", icon: <HomeGlyph /> },
    { label: "Search", href: "/properties", icon: <IconSearch /> },
    { label: "List Property", href: "/list-property", icon: <PlusGlyph />, prominent: true },
    { label: "Agents", href: "/dealers", icon: <IconBuilding /> },
    { label: "Map", href: "/maps", icon: <IconMap /> },
  ];

  return (
    <nav className="mobile-bottom-nav" aria-label={t("Primary mobile navigation")} data-testid="mobile-bottom-nav">
      {items.map((item) => {
        const active = item.label === "Map"
          ? mapOpen || pathname.startsWith("/maps")
          : item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        const className = `mobile-bottom-nav-item${item.prominent ? " mobile-bottom-nav-item--prominent" : ""}${active ? " is-active" : ""}`;
        const content = (
          <>
            <span className="mobile-bottom-nav-icon">{item.icon}</span>
            {!item.prominent && <span className="mobile-bottom-nav-label">{t(item.label)}</span>}
          </>
        );

        if (item.label === "Map") {
          return (
            <button
              key={item.label}
              type="button"
              className={className}
              aria-label={t("Map")}
              aria-expanded={mapOpen}
              data-testid="mobile-nav-map"
              onClick={() => {
                setMapQuery(window.location.search.slice(1));
                setMapOpen(true);
              }}
            >
              {content}
            </button>
          );
        }

        return (
          <Link
            key={item.label}
            href={item.href}
            className={className}
            aria-label={t(item.label)}
            aria-current={active ? "page" : undefined}
            data-testid={`mobile-nav-${item.label.toLowerCase().replaceAll(" ", "-")}`}
          >
            {content}
          </Link>
        );
      })}
      {mapOpen && (
        <NavigationDialog
          label={t("Property map")}
          className="property-map-dialog"
          onDismiss={() => setMapOpen(false)}
        >
          <HeaderPropertyMap
            initialQuery={mapQuery}
            onClose={() => setMapOpen(false)}
            onFilters={(query) => {
              setMapOpen(false);
              router.push(query ? `/properties?${query}` : "/properties");
            }}
          />
        </NavigationDialog>
      )}
    </nav>
  );
}
