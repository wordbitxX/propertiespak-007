import { ResilientImage } from "@/components/resilient-image";
import Link from "next/link";
import { IconArrowRight, IconPin } from "@/components/icons";
import { MobileScrollGrid } from "@/components/mobile-scroll-grid";
import { PropertyRail } from "@/components/property-rail";
import { PropertyCard } from "@/components/property-card";
import { TranslatedText } from "@/components/translated-text";
import type { MapProperty } from "@/components/map-view";
import { ResponsiveHomeMap } from "@/components/responsive-home-map";
import { Reveal } from "@/components/reveal";
import { Section, SectionHeading } from "@/components/section";
import type { City, Post, Project, Property } from "@/db/schema";
import { formatPrice } from "@/lib/format";
import { SITE } from "@/lib/constants";

function withCityFilter(href: string, citySlug?: string) {
  if (!citySlug) return href;
  const [path, query = ""] = href.split("?");
  const params = new URLSearchParams(query);
  params.set("city", citySlug);
  return `${path}?${params.toString()}`;
}

const CATEGORY_TILES = [
  {
    key: "houses",
    label: "Houses",
    subtitle: "Villas & homes",
    href: "/properties?category=house",
    image: "/images/categories/houses-hd.webp",
    countKeys: ["house", "farmhouse"],
  },
  {
    key: "apartments",
    label: "Apartments",
    subtitle: "Modern flats",
    href: "/properties?category=apartment",
    image: "/images/categories/apartments-hd.webp",
    countKeys: ["apartment", "penthouse"],
  },
  {
    key: "plots",
    label: "Plots",
    subtitle: "Files & land",
    href: "/properties?category=plot",
    image: "/images/categories/plots-hd.webp",
    countKeys: ["plot", "land", "plot_file", "plot_form", "agricultural_land", "commercial_plot", "industrial_land"],
  },
  {
    key: "commercial",
    label: "Commercial",
    subtitle: "Shops & offices",
    href: "/properties/commercial",
    image: "/images/categories/commercial-hd.webp",
    countKeys: ["office", "shop", "building", "warehouse", "commercial", "factory", "other"],
  },
  {
    key: "projects",
    label: "New Projects",
    subtitle: "New launches",
    href: "/projects",
    image: "/images/categories/new-projects-hd.webp",
    countKeys: [],
  },
  {
    key: "societies",
    label: "Towns & Societies",
    subtitle: "Area guides",
    href: "/towns",
    image: "/images/categories/towns-societies-hd.webp",
    countKeys: [],
  },
] as const;

function CategoryMiniIcon({ kind }: { kind: (typeof CATEGORY_TILES)[number]["key"] }) {
  switch (kind) {
    case "houses":
      return (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true" className="category-compact-badge-svg">
          <path d="M3.5 11 12 4l8.5 7M5.5 9.5V19a1.2 1.2 0 0 0 1.2 1.2h10.6a1.2 1.2 0 0 0 1.2-1.2V9.5M9.8 20.2v-5.2h4.4v5.2" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "apartments":
      return (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true" className="category-compact-badge-svg">
          <path d="M5 20V5a1.4 1.4 0 0 1 1.4-1.4h7.2A1.4 1.4 0 0 1 15 5v15M15 9.5h3A1.4 1.4 0 0 1 19.4 11v9M3.5 20h17M8.2 7.5h1.4M11.2 7.5h1.4M8.2 11h1.4M11.2 11h1.4M8.2 14.5h1.4M11.2 14.5h1.4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "plots":
      return (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true" className="category-compact-badge-svg">
          <path d="M4.5 6.5 10 4.5l4.5 2 5-2v13l-5 2-4.5-2-5.5 2v-13ZM10 4.5v13M14.5 6.5v13" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "commercial":
      return (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true" className="category-compact-badge-svg">
          <path d="M4 9.5 5.6 4.5h12.8L20 9.5M5.2 10v9a1.3 1.3 0 0 0 1.3 1.3h11a1.3 1.3 0 0 0 1.3-1.3v-9M9.8 20.3v-5h4.4v5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "projects":
      return (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true" className="category-compact-badge-svg">
          <path d="M4 20h16M7.5 20V7.5h12M7.5 4v16M4.5 7.5h15l-3-3.5h-9M16.5 7.5v4.2" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "societies":
      return (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true" className="category-compact-badge-svg">
          <path d="M12 20.5s6.2-5.3 6.2-10.3a6.2 6.2 0 1 0-12.4 0c0 5 6.2 10.3 6.2 10.3Z" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.9" />
        </svg>
      );
  }
}

export function CategoryGrid({ counts, citySlug }: { counts: Record<string, number>; citySlug?: string }) {
  return (
    <section id="property-categories" className="home-categories-section" aria-labelledby="categories-heading">
      <div className="ui-container">
        <div className="category-showcase-card category-showcase-card--compact">
          <div className="category-showcase-header">
            <div className="category-showcase-heading-copy">
              <p className="category-showcase-eyebrow">
                <TranslatedText text="BROWSE BY CATEGORY" />
              </p>
              <h2 id="categories-heading" className="category-showcase-title">
                <TranslatedText text="Explore Properties by Category" />
              </h2>
            </div>
            <Link href={withCityFilter("/properties", citySlug)} className="category-showcase-viewall">
              <span>
                <TranslatedText text="View All Categories" />
              </span>
              <IconArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div
            className="category-compact-grid"
            data-testid="home-type-rail"
            role="region"
            aria-label="Property categories"
          >
            {CATEGORY_TILES.map((tile) => {
              const count = tile.countKeys.reduce((total, key) => total + (counts[key] ?? 0), 0);
              const fallbackSrc = tile.image.replace(/-hd\.webp$/, ".webp");
              return (
                <Link key={tile.key} href={withCityFilter(tile.href, citySlug)} className="category-compact-box group">
                  <span className="category-compact-thumb">
                    <ResilientImage
                      src={tile.image}
                      fallbackSrc={fallbackSrc}
                      alt={tile.label}
                      width={360}
                      height={220}
                      loading="lazy"
                      decoding="async"
                      className="category-compact-img"
                    />
                    <span className="category-compact-badge" aria-hidden="true">
                      <CategoryMiniIcon kind={tile.key} />
                    </span>
                  </span>
                  <span className="category-compact-copy">
                    <span className="category-compact-title">
                      <TranslatedText text={tile.label} />
                    </span>
                    <span className="category-compact-sub">
                      {count > 0 ? `${count} ${count === 1 ? "Property" : "Properties"}` : tile.subtitle}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export function FeaturedProperties({ properties, total, citySlug }: { properties: Property[]; total: number; citySlug?: string }) {
  if (properties.length === 0) return null;
  return (
    <section id="featured" className="home-featured-section" aria-labelledby="featured-heading">
      <div className="ui-container">
        <div className="featured-showcase-card">
          <div className="featured-showcase-intro">
            <p className="featured-showcase-eyebrow">
              <TranslatedText text="FEATURED PROPERTIES" />
            </p>
            <h2 id="featured-heading" className="featured-showcase-title">
              <TranslatedText text="Premium Properties For You" />
            </h2>
            <p className="featured-showcase-copy">
              <TranslatedText text="Explore handpicked properties in the most desirable locations across Pakistan." />
            </p>
            <div className="featured-showcase-actions">
              <Link href={withCityFilter("/properties?featured=1&verified=1", citySlug)} className="featured-showcase-cta">
                <span>
                  <TranslatedText text="View All Properties" />
                </span>
                <IconArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <div className="featured-showcase-rail">
            <PropertyRail
              initialProperties={properties}
              initialTotal={total}
              query={withCityFilter("/properties?featured=1&verified=1", citySlug).split("?")[1]}
              label="Featured properties"
              autoPlay
              cardVariant="featured"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function listedTime(createdAt: Date | string) {
  const timestamp = new Date(createdAt).getTime();
  if (!Number.isFinite(timestamp)) return "Listed recently";
  const minutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60_000));
  if (minutes < 1) return "Listed just now";
  if (minutes < 60) return `Listed ${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Listed ${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  const days = Math.floor(hours / 24);
  return `Listed ${days} ${days === 1 ? "day" : "days"} ago`;
}

function RecentPropertyCard({ property }: { property: Property }) {
  return <PropertyCard property={property} compact mobileFeaturedLook dateLabel={listedTime(property.createdAt)} />;
}

export function RecentlyAddedProperties({ properties, citySlug }: { properties: Property[]; citySlug?: string }) {
  if (properties.length === 0) return null;
  return (
    <Section tone="light" id="recently-added" className="recently-added-section">
      <div className="ui-container">
        <div className="section-card-surface">
          <SectionHeading
            eyebrow="Just listed"
            title="Recently Added Properties"
            description="Fresh listings from verified dealers and property owners."
            action={{ label: "View all", href: withCityFilter("/properties?sort=newest", citySlug) }}
          />
          <MobileScrollGrid
            label="Recently added properties"
            autoPlay
            className="home-horizontal-rail home-recent-rail"
            testId="recently-added-rail"
          >
            {properties.slice(0, 8).map((property) => (
              <div key={property.id}>
                <RecentPropertyCard property={property} />
              </div>
            ))}
          </MobileScrollGrid>
        </div>
      </div>
    </Section>
  );
}

const LOCAL_CITY_IMAGES: Record<string, string> = {
  lahore: "/images/cities/lahore-hd.webp",
  islamabad: "/images/cities/islamabad-hd.webp",
  karachi: "/images/cities/karachi-hd.webp",
  rawalpindi: "/images/cities/rawalpindi-hd.webp",
  faisalabad: "/images/cities/faisalabad-hd.webp",
  multan: "/images/cities/multan-hd.webp",
  gujranwala: "/images/cities/gujranwala-hd.webp",
  peshawar: "/images/cities/peshawar-hd.webp",
};

export function CityDiscovery({ cities, counts }: { cities: City[]; counts: Map<string, number> }) {
  const featured = cities.slice(0, 6);
  if (featured.length === 0) return null;

  return (
    <Section tone="light" id="markets">
      <div className="ui-container">
        <div className="section-card-surface">
          <SectionHeading
            eyebrow="Explore Popular Cities"
            title="Find Properties in Your Favorite City"
            mobileTitle="Popular Cities"
            description="Find the best properties in Pakistan's top cities"
            action={{ label: "View All Cities", href: "/properties" }}
          />
          <MobileScrollGrid label="Popular cities" className="home-city-rail" testId="city-discovery-rail">
            {featured.map((city, index) => {
              const count = counts.get(city.slug) ?? 0;
              const cityImg = LOCAL_CITY_IMAGES[city.slug] ?? city.imageUrl;
              const cityFallback = cityImg.replace(/\.webp$/, ".jpg");
              return (
                <Reveal key={city.slug} delay={index * 45} className="city-discovery-item">
                  <Link
                    href={`/city/${city.slug}`}
                    className="zoom-frame group relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-xl bg-[#0B2A20] p-4 shadow-sm"
                  >
                    <ResilientImage
                      src={cityImg}
                      fallbackSrc={cityFallback}
                      alt={city.imageAlt || `${city.name} property market`}
                      width={1200}
                      height={768}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                    />
                    <span className="absolute inset-0 bg-gradient-to-t from-[#061A13]/92 via-[#08241B]/28 to-transparent" />
                    <div className="relative flex items-end justify-between gap-2">
                      <div className="min-w-0">
                        <span className="block truncate font-sans text-[1.12rem] font-bold leading-tight tracking-[-0.02em] text-white">
                          {city.name}
                        </span>
                        <span className="mt-1 block text-[0.75rem] font-medium text-white/85">
                          {count > 0 ? `${count.toLocaleString("en-PK")} Properties` : city.province}
                        </span>
                      </div>
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/25 bg-white/10 text-white transition-colors group-hover:border-[#DFB872] group-hover:bg-[#DFB872] group-hover:text-[#0A251C]">
                        <IconArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </MobileScrollGrid>
        </div>
      </div>
    </Section>
  );
}

/** Internal-linking hub: connects the homepage to the deeper SEO landing pages. */
export function MarketHub({
  cities,
  typeLinks,
  societyLinks,
}: {
  cities: { name: string; slug: string }[];
  typeLinks: { label: string; href: string }[];
  societyLinks: { label: string; href: string }[];
}) {
  return (
    <Section tone="mist" id="markets-index">
      <div className="ui-container">
        <SectionHeading
          eyebrow="Browse by market"
          title="Property across Pakistan's major markets"
          description="Browse city markets, property types and area guides."
          action={{ label: "All listings", href: "/properties" }}
        />
        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          <div>
            <h3 className="font-sans text-[0.875rem] font-bold uppercase tracking-[0.14em] text-[#0D261D]">
              Cities · for sale
            </h3>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5">
              {cities.map((city) => (
                <li key={`sale-${city.slug}`}>
                  <Link
                    href={`/property-for-sale-in-${city.slug}`}
                    className="text-[0.875rem] text-ink transition-colors hover:text-[#0D382A]"
                  >
                    {city.name}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="mt-7 font-sans text-[0.875rem] font-bold uppercase tracking-[0.14em] text-[#0D261D]">
              Cities · for rent
            </h3>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5">
              {cities.slice(0, 6).map((city) => (
                <li key={`rent-${city.slug}`}>
                  <Link
                    href={`/property-for-rent-in-${city.slug}`}
                    className="text-[0.875rem] text-ink transition-colors hover:text-[#0D382A]"
                  >
                    {city.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-sans text-[0.875rem] font-bold uppercase tracking-[0.14em] text-[#0D261D]">
              Property types
            </h3>
            <ul className="mt-4 space-y-2.5">
              {typeLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[0.875rem] text-ink transition-colors hover:text-[#0D382A]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-sans text-[0.875rem] font-bold uppercase tracking-[0.14em] text-[#0D261D]">
              Popular locations
            </h3>
            <ul className="mt-4 space-y-2.5">
              {societyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[0.875rem] text-ink transition-colors hover:text-[#0D382A]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/property-investment-in-pakistan"
              className="mt-6 inline-flex items-center gap-2 font-sans text-[0.875rem] font-semibold text-[#0D382A] hover:text-[#B8893D]"
            >
              Pakistan property investment guide <IconArrowRight className="h-4 w-4" />
            </Link>
            <div className="mt-4 rounded-xl border border-soft bg-white p-3 text-[0.8125rem] text-ink-muted">
              <span>Looking to build a custom real estate portal like Properties Pak? </span>
              <a
                href={SITE.companyUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="WordbitX Software Company — PropTech Development"
                className="font-semibold text-[#0D382A] hover:underline"
              >
                Explore PropTech Solutions by WordbitX &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

export function NewProjectsSection({ projects, citySlug }: { projects: Project[]; citySlug?: string }) {
  if (projects.length === 0) return null;
  return (
    <Section tone="mist" id="projects">
      <div className="ui-container">
        <div className="section-card-surface">
          <SectionHeading
            eyebrow="New developments"
            title="New Housing Projects"
            mobileTitle="New Projects"
            description="Compare locations, payment plans and handover details."
            action={{ label: "View all", href: withCityFilter("/projects", citySlug) }}
          />
          <MobileScrollGrid label="New housing projects" autoPlay className="home-project-rail" testId="project-rail">
            {projects.slice(0, 8).map((project) => (
              <div key={project.slug} className="home-project-item">
                <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-[#E6EAE7] bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="zoom-frame relative block aspect-[16/10] overflow-hidden bg-soft"
                  >
                    <ResilientImage
                      src={project.coverImage}
                      alt={`${project.name} — ${project.projectType} in ${project.location}`}
                      width={1200}
                      height={750}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                    <span className="pointer-events-none absolute inset-0 hidden bg-gradient-to-t from-black/30 via-transparent to-transparent max-md:block" />
                    <span className="home-project-badge-desktop absolute left-3.5 top-3.5 rounded-md bg-[#0B2A20]/90 px-2.5 py-1 font-sans text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[#DFB872] backdrop-blur-sm">
                      {project.status}
                    </span>
                  </Link>
                  <div className="home-project-pills-mobile pointer-events-none absolute left-2.5 top-2.5 hidden flex-wrap items-center gap-1.5">
                    <span className="rounded-full bg-[#0D382A] px-2.5 py-[3px] font-sans text-[0.7rem] font-semibold text-white shadow-sm">
                      {project.status}
                    </span>
                  </div>
                  <div className="home-project-content flex flex-1 flex-col p-5">
                    <h3 className="home-project-title font-sans text-[1.05rem] font-bold text-[#0D261D]">
                      <Link href={`/projects/${project.slug}`} className="hover:text-[#0D382A]">
                        {project.name}
                      </Link>
                    </h3>
                    <p className="home-project-location mt-1.5 flex items-center gap-1.5 text-[0.84rem] text-[#66776E]">
                      <IconPin className="h-4 w-4 text-[#0D382A]" /> {project.location}
                    </p>
                    <dl className="home-project-specs mt-4 space-y-2 text-[0.8125rem]">
                      <div className="flex justify-between gap-3">
                        <dt className="text-[#66776E]">Developer</dt>
                        <dd className="text-right font-medium text-[#0D261D]">{project.developer}</dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-[#66776E]">Project type</dt>
                        <dd className="text-right font-medium text-[#0D261D]">{project.projectType}</dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-[#66776E]">Handover</dt>
                        <dd className="text-right font-medium text-[#0D261D]">{project.completion}</dd>
                      </div>
                    </dl>
                    <div className="mt-auto pt-5">
                      <div className="hairline pt-4">
                        <p className="home-project-price font-sans text-[1.02rem] font-bold text-[#0D261D]">
                          Starting from {formatPrice(project.startingPrice)}
                        </p>
                        <Link
                          href={`/projects/${project.slug}`}
                          className="home-project-explore mt-3 inline-flex items-center gap-1.5 font-sans text-[0.84rem] font-semibold text-[#0D382A] hover:text-[#B8893D]"
                        >
                          Explore Project
                          <IconArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="home-project-body-mobile hidden min-w-0 flex-1 flex-col">
                    <div className="flex min-w-0 items-center justify-between gap-2">
                      <p className="min-w-0 truncate font-sans text-[1rem] font-bold leading-tight tracking-[-0.02em] text-[#0D261D]">
                        {formatPrice(project.startingPrice)}
                      </p>
                      <span className="property-card-type-detail-pill hidden" aria-label={`Project type: ${project.projectType}`}>
                        <span className="property-card-type-detail-dot" aria-hidden="true" />
                        <span className="truncate">{project.projectType}</span>
                      </span>
                    </div>
                    <h3 className="mt-1.5 line-clamp-2 font-sans text-[0.93rem] font-bold leading-snug text-[#0D261D]">
                      <Link href={`/projects/${project.slug}`} className="transition-colors hover:text-[#136F46]">
                        {project.name} • {project.location}
                      </Link>
                    </h3>
                    <div className="mt-auto pt-2.5">
                      <div className="hairline border-[#EBF0EC]" />
                      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-[0.72rem] font-medium text-[#4F6158]">
                        <span className="truncate">{project.developer}</span>
                        <span className="whitespace-nowrap">Handover {project.completion}</span>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </MobileScrollGrid>
        </div>
      </div>
    </Section>
  );
}

export function CommercialSection({ properties, total, citySlug }: { properties: Property[]; total: number; citySlug?: string }) {
  return (
    <Section tone="light" id="commercial">
      <div className="ui-container">
        <div className="section-card-surface">
          <SectionHeading title="Commercial Properties" mobileTitle="Commercial" action={{ label: "View all", href: withCityFilter("/properties/commercial", citySlug) }} />
          {properties.length ? (
            <PropertyRail
              initialProperties={properties}
              initialTotal={total}
              query={withCityFilter("/properties?category=commercial", citySlug).split("?")[1]}
              label="Commercial properties"
              autoPlay
              mobileFeaturedLook
            />
          ) : (
            <p className="mt-4 text-sm text-ink-muted">No commercial listings available yet.</p>
          )}
        </div>
      </div>
    </Section>
  );
}

export function MapSection({
  properties,
  center,
  cities,
  zoom = 6,
}: {
  properties: MapProperty[];
  center: { lat: number; lng: number };
  cities: { name: string; slug: string }[];
  zoom?: number;
}) {
  return (
    <Section tone="mist" id="map" className="home-desktop-map-section">
      <div className="ui-container">
        <SectionHeading
          title="Discover Properties by Location"
          description="Browse areas and tap a pin to see the property."
          action={{ label: "Open listings with map", href: "/properties" }}
        />
        <div className="mt-6 flex flex-wrap gap-2">
          {cities.map((city) => (
            <Link key={city.slug} href={`/properties?city=${city.slug}`} className="chip">
              {city.name}
            </Link>
          ))}
        </div>
        <div className="mt-6">
          <ResponsiveHomeMap properties={properties} center={center} zoom={zoom} />
        </div>
        <p className="mt-4 text-[0.75rem] leading-relaxed text-ink-muted">
          Imagery © Google · Society layouts © ioi Technologies / DHA Plus. Markers are positioned at society level and
          are indicative only — confirm exact plot location during a site visit.
        </p>
      </div>
    </Section>
  );
}

export function InsightsPreview({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;
  return (
    <Section tone="light" id="insights">
      <div className="ui-container">
        <div className="section-card-surface">
          <SectionHeading
            eyebrow="Property insights"
            title="Property Guides"
            description="Practical advice on buying, renting and property documents."
            action={{ label: "All insights", href: "/blog" }}
          />
          <MobileScrollGrid label="Property guides" className="guides-rail">
            {posts.slice(0, 3).map((post, index) => (
              <Reveal key={post.slug} delay={index * 60}>
                <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#E6EAE7] bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="zoom-frame relative block aspect-[16/10] overflow-hidden bg-soft"
                  >
                    <ResilientImage
                      src={post.coverImage}
                      alt={post.title}
                      width={1200}
                      height={750}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute left-3.5 top-3.5 rounded-md bg-[#0B2A20]/90 px-2.5 py-1 font-sans text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[#DFB872]">
                      {post.category}
                    </span>
                  </Link>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-sans text-[1.04rem] font-semibold leading-snug text-[#0D261D]">
                      <Link href={`/blog/${post.slug}`} className="hover:text-[#0D382A]">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="mt-3 line-clamp-3 text-[0.85rem] leading-relaxed text-[#5F7067]">{post.excerpt}</p>
                    <div className="mt-auto pt-5">
                      <div className="hairline pt-4 text-[0.75rem] font-medium text-[#687A71]">
                        {post.author} · {post.readMinutes} min read
                      </div>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </MobileScrollGrid>
        </div>
      </div>
    </Section>
  );
}
