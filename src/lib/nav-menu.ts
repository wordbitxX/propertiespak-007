import { SOCIETIES } from "@/lib/landing-pages";
import { townsForCity } from "@/lib/towns";

export type NavLink = { label: string; href: string };
export type NavColumn = { title: string; links: NavLink[] };
export type NavMenuDef = { label: string; href: string; columns: NavColumn[] };

/** Cities shown across the header menus (matches the homepage markets). */
const NAV_CITY_SLUGS = [
  "lahore",
  "islamabad",
  "karachi",
  "rawalpindi",
  "faisalabad",
  "multan",
  "gujranwala",
  "peshawar",
];

const NAV_CITY_NAMES: Record<string, string> = {
  lahore: "Lahore",
  islamabad: "Islamabad",
  karachi: "Karachi",
  rawalpindi: "Rawalpindi",
  faisalabad: "Faisalabad",
  multan: "Multan",
  gujranwala: "Gujranwala",
  peshawar: "Peshawar",
};

function cityName(slug: string) {
  return NAV_CITY_NAMES[slug] ?? slug.charAt(0).toUpperCase() + slug.slice(1);
}

/**
 * Every society and town landing for one city, societies first — the header
 * "Areas" menu promises ALL options, so nothing is truncated or hidden behind
 * an "other" bucket. Links point at the live landing pages under
 * `/property-for-sale/<slug>` (societies and towns share that route).
 */
export function areaLinksForCity(citySlug: string): NavLink[] {
  const societyLinks = SOCIETIES.filter((society) => society.citySlug === citySlug).map((society) => ({
    label: society.name,
    href: `/property-for-sale/${society.slug}`,
  }));
  const seen = new Set(societyLinks.map((link) => link.label.toLowerCase()));
  const townLinks = townsForCity(citySlug)
    .filter((town) => !seen.has(town.name.toLowerCase()))
    .map((town) => ({ label: town.name, href: `/property-for-sale/${town.slug}` }));
  return [...societyLinks, ...townLinks];
}

/** Header dropdown definitions. Built server-side so area prose never ships to the client. */
export function buildHeaderNavMenus(): NavMenuDef[] {
  const areaColumns: NavColumn[] = [
    {
      title: "Browse areas",
      links: [
        { label: "All towns & societies", href: "/towns" },
        ...NAV_CITY_SLUGS.map((slug) => ({ label: `${cityName(slug)} areas`, href: `/towns/${slug}` })),
      ],
    },
    ...NAV_CITY_SLUGS.map((slug) => ({
      title: cityName(slug),
      links: areaLinksForCity(slug),
    })).filter((column) => column.links.length > 0),
  ];

  return [
    {
      label: "Agents",
      href: "/dealers",
      columns: [
        {
          title: "Dealers & agencies",
          links: [
            { label: "All agents", href: "/dealers" },
            { label: "List your property", href: "/list-property" },
            { label: "Create an account", href: "/login" },
          ],
        },
        {
          title: "Agents by city",
          links: NAV_CITY_SLUGS.map((slug) => ({
            label: cityName(slug),
            href: `/dealers?city=${slug}`,
          })),
        },
      ],
    },
    {
      label: "New Projects",
      href: "/projects",
      columns: [
        {
          title: "Explore projects",
          links: [
            { label: "All new projects", href: "/projects" },
            { label: "New project listings", href: "/properties/new-projects" },
            { label: "Investment guide", href: "/property-investment-in-pakistan" },
          ],
        },
        {
          title: "Projects by city",
          links: NAV_CITY_SLUGS.map((slug) => ({
            label: cityName(slug),
            href: `/properties/new-projects?city=${slug}`,
          })),
        },
      ],
    },
    {
      label: "Areas",
      href: "/towns",
      columns: areaColumns,
    },
    {
      label: "Blog",
      href: "/blog",
      columns: [
        {
          title: "Guides",
          links: [
            { label: "All property guides", href: "/blog" },
            { label: "Pakistan investment guide", href: "/property-investment-in-pakistan" },
            { label: "Property search topics", href: "/keywords-for-pakistan" },
          ],
        },
        {
          title: "Market data",
          links: [
            { label: "Property price index", href: "/price-index" },
            { label: "Investment calculators", href: "/tools" },
            { label: "Compare properties", href: "/compare" },
          ],
        },
      ],
    },
    {
      label: "About",
      href: "/about",
      columns: [
        {
          title: "Company",
          links: [
            { label: "About Properties Pak", href: "/about" },
            { label: "FAQs", href: "/about#faqs" },
            { label: "Contact us", href: "/contact" },
            { label: "Advertise with us", href: "/advertise" },
          ],
        },
        {
          title: "Platform",
          links: [
            { label: "List your property", href: "/list-property" },
            { label: "Property price index", href: "/price-index" },
            { label: "Society PDF Maps", href: "/maps" },
          ],
        },
      ],
    },
  ];
}

/** Compact mobile-drawer variant: one list of every option per item. */
export function buildMobileNavGroups(): { label: string; href: string; links: NavLink[] }[] {
  return buildHeaderNavMenus().map((menu) => ({
    label: menu.label,
    href: menu.href,
    links: menu.columns.flatMap((column) =>
      column.links.map((link) => ({ ...link, label: column.title === menu.label ? link.label : `${column.title} · ${link.label}` })),
    ),
  }));
}

/** City labels used by menus, kept in one place for translations and tests. */
export function navCityLabels(): string[] {
  return NAV_CITY_SLUGS.map(cityName);
}
