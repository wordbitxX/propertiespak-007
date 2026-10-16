"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useLanguage } from "@/components/language-provider";
import { IconChevronDown, IconSearch, IconSliders } from "@/components/icons";
import { beginRecentSearch } from "@/lib/recent-properties";
import { NavigationDialog } from "@/components/navigation-dialog";
import { PropertySearchFilters } from "@/components/property-search-filters";
import { BUDGETS_BUY, BUDGETS_RENT } from "@/lib/constants";
import {
  COMMERCIAL_SEARCH_TYPES,
  defaultPropertySearch,
  HOME_SEARCH_TYPES,
  PLOT_SEARCH_TYPES,
  propertySearchHref,
  searchTypeLabel,
  SEARCH_CITIES,
  type PropertySearchState,
  type SearchGroup,
} from "@/lib/property-search";

type HeroTab = "buy" | "rent" | "new-projects" | "commercial" | "towns" | "plots";

const HERO_TABS: { id: HeroTab; label: string }[] = [
  { id: "buy", label: "Buy" },
  { id: "rent", label: "Rent" },
  { id: "new-projects", label: "New Projects" },
  { id: "commercial", label: "Commercial" },
  { id: "towns", label: "Towns" },
  { id: "plots", label: "Plots" },
];

const GROUP_TYPES: Record<SearchGroup, readonly string[]> = {
  all: [...HOME_SEARCH_TYPES, ...PLOT_SEARCH_TYPES, ...COMMERCIAL_SEARCH_TYPES],
  homes: HOME_SEARCH_TYPES,
  plot: PLOT_SEARCH_TYPES,
  commercial: COMMERCIAL_SEARCH_TYPES,
};

function heroTypeLabel(type: string) {
  if (type === "Apartment") return "Apartment";
  if (type === "Farmhouse") return "Farm House";
  if (type === "Plot") return "Residential Plot";
  if (type === "Commercial Building") return "Commercial Plaza";
  return searchTypeLabel(type);
}

export function SearchPanel() {
  const { t } = useLanguage();
  const router = useRouter();
  const [state, setState] = useState<PropertySearchState>(() => defaultPropertySearch());
  const [activeTab, setActiveTab] = useState<HeroTab>("buy");
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const budgets = state.purpose === "rent" ? BUDGETS_RENT : BUDGETS_BUY;
  const budget = state.minPrice || state.maxPrice ? `${state.minPrice}-${state.maxPrice}` : "";

  function selectTab(tab: HeroTab) {
    setActiveTab(tab);
    if (tab === "buy") {
      setState((current) => ({
        ...current,
        purpose: "buy",
        group: "all",
        type: "",
        newProjects: false,
        minPrice: "",
        maxPrice: "",
      }));
    } else if (tab === "rent") {
      setState((current) => ({
        ...current,
        purpose: "rent",
        group: "all",
        type: "",
        newProjects: false,
        minPrice: "",
        maxPrice: "",
      }));
    } else if (tab === "new-projects") {
      setState((current) => ({
        ...current,
        purpose: "buy",
        group: "all",
        type: "",
        newProjects: true,
      }));
    } else if (tab === "commercial") {
      setState((current) => ({
        ...current,
        purpose: "buy",
        group: "commercial",
        type: "",
        newProjects: false,
      }));
    } else if (tab === "plots") {
      setState((current) => ({
        ...current,
        purpose: "buy",
        group: "plot",
        type: "",
        newProjects: false,
      }));
    } else if (tab === "towns") {
      setState((current) => ({
        ...current,
        purpose: "buy",
        group: "all",
        type: "",
        newProjects: false,
      }));
    }
  }

  function search(next: PropertySearchState) {
    setState(next);
    setOpen(false);
    if (activeTab === "towns" && !next.type && !next.minPrice && !next.maxPrice) {
      const townUrl = next.city ? `/towns/${next.city}` : "/towns";
      router.push(townUrl);
      return;
    }
    const href = propertySearchHref(next);
    beginRecentSearch(href);
    router.push(href);
  }

  return (
    <div className="property-search-panel">
      <div className="property-search-modes">
        <div className="property-search-tabs" role="tablist" aria-label={t("Search purpose")}>
          {HERO_TABS.map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => selectTab(tab.id)}
                className={`property-search-tab-pill ${isSelected ? "is-active" : ""}`}
              >
                {t(tab.label)}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={(event) => {
            triggerRef.current = event.currentTarget;
            setOpen(true);
          }}
          className="property-search-advanced-top"
        >
          <IconSliders className="h-3.5 w-3.5" />
          <span>{t("All filters")}</span>
        </button>
      </div>

      <form
        className="property-search-form"
        aria-label={t("Search properties")}
        onSubmit={(event) => {
          event.preventDefault();
          search(state);
        }}
      >
        <div className="property-search-field property-search-field--location">
          <label htmlFor="hero-city">{t("City")}</label>
          <div className="property-search-select-wrap">
            <select
              id="hero-city"
              value={state.city}
              onChange={(event) => setState((current) => ({ ...current, city: event.target.value, town: "" }))}
            >
              <option value="">{t("Select City")}</option>
              {SEARCH_CITIES.map((city) => (
                <option key={city.slug} value={city.slug}>
                  {city.name}
                </option>
              ))}
            </select>
            <IconChevronDown className="property-search-select-chevron h-4 w-4" />
          </div>
        </div>

        <div className="property-search-field property-search-field--type">
          <label htmlFor="hero-type">{t("Property Type") || "Property Type"}</label>
          <div className="property-search-select-wrap">
            <select
              id="hero-type"
              value={state.type}
              onChange={(event) => setState((current) => ({ ...current, type: event.target.value }))}
            >
              <option value="">{t("All Types")}</option>
              {GROUP_TYPES[state.group].map((type) => (
                <option key={type} value={type}>
                  {t(heroTypeLabel(type))}
                </option>
              ))}
            </select>
            <IconChevronDown className="property-search-select-chevron h-4 w-4" />
          </div>
        </div>

        <div className="property-search-field property-search-field--budget">
          <label htmlFor="hero-budget">
            {t("Budget")} (PKR{state.purpose === "rent" ? ` / ${t("month")}` : ""})
          </label>
          <div className="property-search-select-wrap">
            <select
              id="hero-budget"
              value={budget}
              onChange={(event) => {
                const [min = "", max = ""] = event.target.value ? event.target.value.split("-") : ["", ""];
                setState((current) => ({ ...current, minPrice: min, maxPrice: max }));
              }}
            >
              <option value="">{t("Any Budget")}</option>
              {budgets.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            <IconChevronDown className="property-search-select-chevron h-4 w-4" />
          </div>
        </div>

        <div className="property-search-buttons">
          <button type="submit" className="btn hero-search-submit">
            <IconSearch className="h-4 w-4" />
            <span>{t("Search")}</span>
          </button>
          <span className="sr-only">{t("Search by city, society, property type or budget.")}</span>
        </div>
      </form>

      {open && (
        <NavigationDialog
          label={t("Search properties")}
          className="property-filter-dialog"
          onDismiss={() => setOpen(false)}
          triggerRef={triggerRef}
        >
          <PropertySearchFilters initialState={state} onClose={() => setOpen(false)} onSearch={search} />
        </NavigationDialog>
      )}
    </div>
  );
}
