"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { BrandLockup } from "@/components/brand-lockup";
import { beginRecentSearch } from "@/lib/recent-properties";
import { NavigationDialog } from "@/components/navigation-dialog";
import { PropertySearchFilters } from "@/components/property-search-filters";
import { HeaderPropertyMap } from "@/components/header-property-map";
import {
  defaultPropertySearch,
  propertySearchFromParams,
  propertySearchHref,
  type PropertySearchState,
} from "@/lib/property-search";
import {
  IconArrowRight,
  IconChevronDown,
  IconClose,
  IconHeart,
  IconMenu,
  IconSearch,
  IconUser,
  IconMap,
  IconCompass,
} from "@/components/icons";
import { useFavorites } from "@/components/favorites-provider";
import { useLanguage } from "@/components/language-provider";
import { SITE } from "@/lib/constants";

const CITY_LINKS = ["Lahore", "Islamabad", "Karachi", "Rawalpindi", "Faisalabad", "Multan"];
const PROPERTY_LINKS = [
  { label: "Buy Property", href: "/properties/for-sale" },
  { label: "Rent Property", href: "/properties/for-rent" },
  { label: "Sell / List Property", href: "/list-property" },
  { label: "Houses for sale", href: "/properties/for-sale?category=house" },
  { label: "Apartments for rent", href: "/properties/for-rent?type=Apartment" },
  { label: "Plots & files", href: "/properties?category=plot" },
  { label: "Offices & retail", href: "/properties/commercial" },
  { label: "All properties", href: "/properties" },
];

const DESKTOP_NAV_ITEMS = [
  { label: "Agents", href: "/dealers" },
  { label: "New Projects", href: "/projects" },
  { label: "Areas", href: "/towns" },
  { label: "Maps", href: "/maps" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

type Panel = "menu" | "search" | "map" | null;

function LanguageSwitch({ mobile = false }: { mobile?: boolean }) {
  const { locale, setLocale, t } = useLanguage();
  if (mobile) {
    const targetLocale = locale === "en" ? "ur" : "en";
    return (
      <button
        type="button"
        data-testid="header-language-mobile"
        className="header-action header-language-mobile"
        aria-label={t(locale === "en" ? "Switch to Urdu" : "Switch to English")}
        title={t(locale === "en" ? "Switch to Urdu" : "Switch to English")}
        onClick={() => setLocale(targetLocale)}
      >
        <span className="header-language-value" lang={targetLocale}>
          {targetLocale === "ur" ? "اردو" : "EN"}
        </span>
      </button>
    );
  }
  return (
    <div className="header-language-switch" role="group" aria-label={t("Choose language")}>
      <button
        type="button"
        lang="en"
        aria-label="English"
        aria-pressed={locale === "en"}
        onClick={() => setLocale("en")}
      >
        EN
      </button>
      <button
        type="button"
        lang="ur"
        aria-label="اردو"
        aria-pressed={locale === "ur"}
        onClick={() => setLocale("ur")}
      >
        اردو
      </button>
    </div>
  );
}

export function SiteHeader({ isAuthenticated = false }: { isAuthenticated?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [panel, setPanel] = useState<Panel>(null);
  const [panelPath, setPanelPath] = useState(pathname);
  const [megaOpen, setMegaOpen] = useState(false);
  const [drawerPropOpen, setDrawerPropOpen] = useState(true);
  const [searchDefaults, setSearchDefaults] = useState<PropertySearchState>(() => defaultPropertySearch());
  const [mapQuery, setMapQuery] = useState("");
  const megaRef = useRef<HTMLDivElement | null>(null);
  const dialogTriggerRef = useRef<HTMLElement | null>(null);
  const { count } = useFavorites();
  const solid = scrolled || pathname.startsWith("/admin");
  const accountHref = isAuthenticated ? "/account" : "/login";
  const dismiss = useCallback(() => setPanel(null), []);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 36);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  if (panelPath !== pathname) {
    setPanelPath(pathname);
    setPanel(null);
    setMegaOpen(false);
  }

  useEffect(() => {
    if (!megaOpen) return;
    const outside = (event: PointerEvent) => {
      if (!megaRef.current?.contains(event.target as Node)) setMegaOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMegaOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [megaOpen]);

  function openPanel(next: Exclude<Panel, null>, trigger?: HTMLElement) {
    if (trigger) dialogTriggerRef.current = trigger;
    setMegaOpen(false);
    const params = new URLSearchParams(window.location.search);
    if (pathname.includes("/for-rent")) params.set("purpose", "rent");
    else if (pathname.includes("/for-sale")) params.set("purpose", "buy");
    if (pathname.includes("/properties/commercial")) params.set("category", "commercial");
    if (pathname.includes("/properties/new-projects")) params.set("newProjects", "1");
    if (next === "search") {
      setSearchDefaults(propertySearchFromParams(params, pathname.includes("/for-rent") ? "rent" : "buy"));
    } else if (next === "map") {
      setMapQuery(params.toString());
    }
    setPanel(next);
  }

  function search(state: PropertySearchState) {
    dismiss();
    const href = propertySearchHref(state);
    beginRecentSearch(href);
    router.push(href);
  }

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-navy-900"
      >
        Skip to content
      </a>
      <header
        data-testid="site-header"
        data-surface={solid ? "solid" : "overlay"}
        className={`site-header ${solid ? "site-header--solid" : "site-header--overlay"}`}
      >
        <div className="header-utility-bar">
          <div className="ui-container">
            <Link href="/contact">{t("Help & Support")}</Link>
            <span className="header-utility-separator" aria-hidden="true">
              |
            </span>
            <Link href="/advertise">{t("Advertise on Properties Pak")}</Link>
            <span className="header-utility-separator" aria-hidden="true">
              |
            </span>
            <LanguageSwitch />
          </div>
        </div>

        <div className="ui-container header-inner">
          <Link href="/" className="header-brand" aria-label={`${SITE.name} — ${SITE.tagline}`}>
            <BrandLockup adaptive compact />
          </Link>

          <nav className="header-desktop-nav" aria-label="Primary">
            <div
              ref={megaRef}
              className="relative"
              onMouseEnter={() => setMegaOpen(true)}
              onMouseLeave={() => setMegaOpen(false)}
            >
              <Link
                href="/properties"
                data-active={pathname.startsWith("/properties") || pathname === "/list-property"}
                aria-expanded={megaOpen}
                aria-controls="property-shortcuts"
                onClick={() => setMegaOpen(false)}
                className="nav-link inline-flex min-h-11 items-center gap-1"
              >
                {t("Property")}
                <IconChevronDown className={`h-3.5 w-3.5 transition-transform ${megaOpen ? "rotate-180" : ""}`} />
              </Link>
              {megaOpen && (
                <div id="property-shortcuts" className="absolute left-0 top-full z-50 w-[700px] pt-2">
                  <div className="grid grid-cols-3 gap-6 rounded-xl border border-[#E4E8E5] bg-white p-6 text-[#0C261D] shadow-panel">
                    <div>
                      <p className="eyebrow text-[#0E3B2C]">{t("Buy · Rent · Sell")}</p>
                      <ul className="mt-3 space-y-1">
                        {PROPERTY_LINKS.map((link) => (
                          <li key={link.href}>
                            <Link
                              href={link.href}
                              onClick={() => setMegaOpen(false)}
                              className="block rounded py-1.5 text-[0.8125rem] font-medium hover:text-[#B8893D]"
                            >
                              {t(link.label)}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="border-l border-soft pl-5">
                      <p className="eyebrow text-[#0E3B2C]">{t("By city")}</p>
                      <ul className="mt-3 space-y-1">
                        {CITY_LINKS.map((city) => (
                          <li key={city}>
                            <Link
                              href={`/city/${city.toLowerCase()}`}
                              onClick={() => setMegaOpen(false)}
                              className="block py-1.5 text-[0.8125rem] font-medium hover:text-[#B8893D]"
                            >
                              {city}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="border-l border-soft pl-5">
                      <p className="eyebrow text-[#0E3B2C]">{t("Plan your move")}</p>
                      <ul className="mt-3 space-y-1.5">
                        {[
                          { label: "Society PDF Maps", href: "/maps" },
                          { label: "Compare properties", href: "/compare" },
                          { label: "Investment tools", href: "/tools" },
                          { label: "Property guides & Blog", href: "/blog" },
                          { label: "Pakistan investment guide", href: "/property-investment-in-pakistan" },
                          { label: "Property search topics", href: "/keywords-for-pakistan" },
                        ].map((link) => (
                          <li key={link.href}>
                            <Link
                              href={link.href}
                              onClick={() => setMegaOpen(false)}
                              className="block py-1.5 text-[0.8125rem] font-medium hover:text-[#B8893D]"
                            >
                              {t(link.label)}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {DESKTOP_NAV_ITEMS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-active={pathname === link.href || pathname.startsWith(`${link.href}/`)}
                className="nav-link"
              >
                {t(link.label)}
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            <button
              type="button"
              data-testid="header-map"
              onClick={(event) => openPanel("map", event.currentTarget)}
              aria-label={t("Open property map")}
              aria-haspopup="dialog"
              className="header-action header-map-action"
            >
              <IconMap className="h-[18px] w-[18px]" />
            </button>
            <a
              href="https://lahorerealestate.com/all/"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="header-map-external"
              className="header-action header-map-external-link"
              aria-label={t("Open Lahore Real Estate map in a new tab")}
              title={t("Open Lahore Real Estate map in a new tab")}
            >
              <IconCompass className="h-[18px] w-[18px]" aria-hidden="true" />
            </a>
            <button
              type="button"
              onClick={(event) => openPanel("search", event.currentTarget)}
              aria-label={t("Search properties")}
              aria-haspopup="dialog"
              className="header-action header-search-action"
            >
              <IconSearch className="h-[18px] w-[18px]" />
            </button>
            <Link
              href="/favorites"
              data-testid="header-saved"
              aria-label={`${t("Saved properties")}${count ? `, ${count} ${t("saved")}` : ""}`}
              className="header-action header-saved-action"
            >
              <IconHeart className="h-[18px] w-[18px]" />
              <span className="header-action-caption">{t("Saved")}</span>
              {count > 0 && <span className="header-saved-count">{count > 99 ? "99+" : count}</span>}
            </Link>
            <LanguageSwitch mobile />

            <Link
              href="/list-property"
              data-testid="header-sell-property"
              aria-label={t("Sell a property")}
              title={t("Sell a property")}
              className="header-list-property"
            >
              <span className="header-list-property-flag" aria-hidden="true">
                SELL
              </span>
              {t("List Property")}
            </Link>

            <Link href={accountHref} className="header-account">
              {t(isAuthenticated ? "Account" : "Sign In / Register")}
            </Link>

            <button
              type="button"
              data-testid="header-menu"
              onClick={(event) => openPanel("menu", event.currentTarget)}
              aria-label={t("Open menu")}
              aria-haspopup="dialog"
              aria-expanded={panel === "menu"}
              className="header-action header-menu-action"
            >
              <IconMenu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {panel === "menu" && (
        <NavigationDialog key="menu" label={t("Main menu")} onDismiss={dismiss} triggerRef={dialogTriggerRef}>
          <div className="navigation-drawer">
            <div className="navigation-panel-heading bg-[#082219] text-white">
              <Link href="/" onClick={dismiss} aria-label="Properties Pak home" className="header-brand">
                <BrandLockup adaptive compact />
              </Link>
              <button
                type="button"
                data-dialog-initial
                onClick={dismiss}
                aria-label={t("Close menu")}
                className="dialog-close !bg-white/10 !text-white hover:!bg-white/20"
              >
                <IconClose className="h-5 w-5" />
              </button>
            </div>
            <div className="navigation-drawer-scroll">
              <button type="button" onClick={() => openPanel("search")} className="menu-search-shortcut">
                <IconSearch className="h-[18px] w-[18px] text-[#0E3B2C]" />
                <span>{t("Search city, society or property")}</span>
                <IconArrowRight className="ml-auto h-4 w-4" />
              </button>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Link href="/favorites" onClick={dismiss} className="menu-shortcut">
                  <IconHeart className="h-4 w-4" />
                  {t("Saved")}
                  {count > 0 && (
                    <span className="ml-auto rounded-full bg-forest-50 px-2 py-0.5 text-xs text-forest-700">
                      {count}
                    </span>
                  )}
                </Link>
                <Link href="/compare" onClick={dismiss} className="menu-shortcut">
                  {t("Compare properties")} <IconArrowRight className="ml-auto h-4 w-4" />
                </Link>
              </div>
              <nav aria-label="Mobile navigation" className="mt-5">
                {/* Property Dropdown inside Mobile Drawer (same as Desktop) */}
                <div className="border-b border-soft">
                  <button
                    type="button"
                    aria-expanded={drawerPropOpen}
                    onClick={() => setDrawerPropOpen((v) => !v)}
                    className="mobile-nav-link w-full !border-b-0"
                  >
                    <span>{t("Property")}</span>
                    <IconChevronDown
                      className={`h-4 w-4 text-[#0E3B2C] transition-transform ${drawerPropOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {drawerPropOpen && (
                    <div className="mb-3 grid grid-cols-2 gap-1.5 rounded-xl bg-[#F4F7F5] p-2.5">
                      {PROPERTY_LINKS.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={dismiss}
                          className="rounded-lg bg-white px-3 py-2 text-[0.78rem] font-semibold text-[#0C261D] shadow-xs transition hover:text-[#0E3B2C]"
                        >
                          {t(link.label)}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {DESKTOP_NAV_ITEMS.map((link) => (
                  <Link
                    key={`${link.label}-${link.href}`}
                    href={link.href}
                    onClick={dismiss}
                    aria-current={pathname === link.href ? "page" : undefined}
                    className="mobile-nav-link"
                  >
                    <span>{t(link.label)}</span>
                    <IconArrowRight className="h-4 w-4 text-[#0E3B2C]" />
                  </Link>
                ))}
              </nav>
              <div className="mt-6">
                <p className="eyebrow text-ink-muted">{t("Explore cities")}</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {CITY_LINKS.map((city) => (
                    <Link
                      key={city}
                      href={`/city/${city.toLowerCase()}`}
                      onClick={dismiss}
                      className="menu-city-link"
                    >
                      {city}
                    </Link>
                  ))}
                </div>
              </div>
              <Link
                href="/tools"
                onClick={dismiss}
                className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#0E3B2C]"
              >
                {t("Open investment tools")} <IconArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="navigation-drawer-footer">
              <Link href="/list-property" onClick={dismiss} className="btn btn-gold min-h-12 w-full">
                {t("List Your Property")} <IconArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={accountHref}
                onClick={dismiss}
                className="mt-2 flex min-h-11 items-center justify-center gap-2 text-[0.875rem] font-semibold text-[#0C261D]"
              >
                <IconUser className="h-4 w-4" />
                {t(isAuthenticated ? "My account" : "Sign In / Register")}
              </Link>
            </div>
          </div>
        </NavigationDialog>
      )}

      {panel === "search" && (
        <NavigationDialog
          key="search"
          label={t("Search properties")}
          className="property-filter-dialog"
          onDismiss={dismiss}
          triggerRef={dialogTriggerRef}
        >
          <PropertySearchFilters initialState={searchDefaults} onClose={dismiss} onSearch={search} />
        </NavigationDialog>
      )}
      {panel === "map" && (
        <NavigationDialog
          key="map"
          label={t("Property map")}
          className="property-map-dialog"
          onDismiss={dismiss}
          triggerRef={dialogTriggerRef}
        >
          <HeaderPropertyMap
            initialQuery={mapQuery}
            onClose={dismiss}
            onFilters={(query) => {
              setSearchDefaults(propertySearchFromParams(new URLSearchParams(query)));
              setPanel("search");
            }}
          />
        </NavigationDialog>
      )}
    </>
  );
}
