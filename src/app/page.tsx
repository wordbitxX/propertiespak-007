import type { Metadata } from "next";
import { DEEP_ZOOM_MAPS, DHA_SOCIETY_MAPS } from "@/lib/map-library";
import Link from "next/link";
import { Hero } from "@/components/hero";
import { Section, SectionHeading } from "@/components/section";
import { ExploreMoreSection } from "@/components/explore-more-section";
import {
  CategoryGrid,
  CityDiscovery,
  CommercialSection,
  FeaturedProperties,
  InsightsPreview,
  NewProjectsSection,
  RecentlyAddedProperties,
} from "@/components/sections-discovery";
import { CtaSection, InvestmentSection, WhyEstateWx } from "@/components/sections-editorial";
import { VerifiedAgenciesSection } from "@/components/agency-samples-showcase";
import { PopularSearches } from "@/components/popular-searches";
import {
  getApprovedReviews,
  getCities,
  getCityListingCounts,
  getDealerShowcase,
  getHeroStats,
  getPlatformStats,
  getPropertyCategoryCounts,
  getPosts,
  getPopularSearches,
  getProjects,
  getReviewSummary,
  searchProperties,
} from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { ClientReviewsSection } from "@/components/reviews-section";
import { HomeExploreProperties } from "@/components/home-explore-properties";
import { RecentProperties } from "@/components/recent-properties";
import { TrendingSocieties } from "@/components/trending-societies";
import { SEARCH_CITIES } from "@/lib/property-search";

export const metadata: Metadata = buildMetadata({
  title: "Properties Pak — Property for Sale & Rent in Pakistan | Pakistan Real Estate",
  description:
    "Properties Pak is Pakistan's property marketplace: browse houses, apartments, plots, commercial property and new housing projects for sale and rent in Lahore, Islamabad, Karachi, Rawalpindi, Faisalabad, Multan, Gujranwala and Peshawar — with map search, price filters and investment calculators.",
  path: "/",
  keywords: [
    "real estate Pakistan",
    "property for sale Pakistan",
    "property for rent Pakistan",
    "houses for sale Lahore",
    "apartments for sale Islamabad",
    "plots for sale Karachi",
    "commercial property Pakistan",
    "new projects Pakistan",
  ],
});

const QUICK_CHIPS = [
  { label: "Featured listings", href: "/properties?featured=1" },
  { label: "Houses for sale", href: "/properties/for-sale?type=House" },
  { label: "Apartments for rent", href: "/properties/for-rent?type=Apartment" },
  { label: "Commercial space", href: "/properties/commercial" },
  { label: "Plots & files", href: "/properties?category=plot" },
];

function withCityFilter(href: string, city?: string) {
  if (!city) return href;
  const [path, query = ""] = href.split("?");
  const params = new URLSearchParams(query);
  params.set("city", city);
  return `${path}?${params.toString()}`;
}

type HomePageProps = { searchParams: Promise<{ city?: string | string[] }> };

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const rawCity = Array.isArray(params.city) ? params.city[0] : params.city;
  const citySlug = SEARCH_CITIES.some((city) => city.slug === rawCity) ? rawCity : undefined;
  const [
    stats,
    featured,
    discovery,
    categoryCounts,
    cities,
    cityCounts,
    projects,
    commercialListings,
    commercialCount,
    rentalCount,
    posts,
    showcaseDealers,
    popularSearches,
    clientReviews,
    reviewSummary,
    heroStats,
  ] = await Promise.all([
    getPlatformStats(),
    searchProperties({ featured: true, verified: true, pageSize: 8, city: citySlug }),
    searchProperties({ sort: "newest", pageSize: 16, city: citySlug }),
    getPropertyCategoryCounts(citySlug),
    getCities(),
    getCityListingCounts(),
    getProjects(8, false, citySlug),
    searchProperties({ category: "commercial", pageSize: 8, city: citySlug }),
    searchProperties({ category: "commercial", pageSize: 1, city: citySlug }),
    searchProperties({ purpose: "rent", pageSize: 1, city: citySlug }),
    getPosts(3),
    getDealerShowcase(48),
    getPopularSearches(),
    getApprovedReviews({ limit: 6 }),
    getReviewSummary(),
    getHeroStats(citySlug),
  ]);

  // "Premium Properties For You" is an admin-verified rail: only listings the
  // admin team has verified (and featured) may appear here. There is
  // deliberately no fallback to unverified inventory — if nothing qualifies,
  // the section hides instead of quietly showing unchecked listings.
  const featuredItems = featured.items;
  const featuredTotal = featured.total;

  return (
    <div className="home-page">
      <Hero key={citySlug ?? "global"} stats={{ ...heroStats, maps: DHA_SOCIETY_MAPS.length + DEEP_ZOOM_MAPS.length }} citySlug={citySlug} />

      {/* Desktop keeps its original premium-first order; mobile reorders these two rails. */}
      <div className="home-featured-societies-order">
        <FeaturedProperties properties={featuredItems} total={featuredTotal} citySlug={citySlug} />
        <TrendingSocieties />
      </div>
      <CategoryGrid counts={categoryCounts} citySlug={citySlug} />

      {/* Desktop keeps Titanium Partners right below CategoryGrid; mobile places it below Recent & Explore Properties. */}
      <div className="home-dealers-discovery-order">
        <VerifiedAgenciesSection dealers={showcaseDealers} />

        {/* Fresh inventory and browse tools stay close to the premium listings. */}
        <RecentlyAddedProperties properties={discovery.items} citySlug={citySlug} />
        {/* 6. Property Discovery */}
        <Section tone="mist" id="explore">
          <div className="ui-container">
            <div className="section-card-surface">
              <SectionHeading
                eyebrow="Property discovery"
                title="Explore Properties"
                description="Find spaces that match the way you live, work and invest."
                action={{ label: "View all", href: withCityFilter("/properties", citySlug) }}
              />
              <div className="mt-5 flex flex-wrap gap-2">
                {QUICK_CHIPS.map((chip) => (
                  <Link key={chip.href} href={withCityFilter(chip.href, citySlug)} className="chip">
                    {chip.label}
                  </Link>
                ))}
              </div>
              <HomeExploreProperties properties={discovery.items} total={discovery.total} citySlug={citySlug} />
              <div className="mt-8 flex justify-center">
                <Link href={withCityFilter("/properties", citySlug)} className="btn btn-primary">
                  View all {heroStats.listings} properties
                </Link>
              </div>
            </div>
          </div>
        </Section>

        <RecentProperties citySlug={citySlug} />
      </div>

      {/* 7. Commercial and New Projects */}
      <CommercialSection properties={commercialListings.items} total={commercialListings.total} citySlug={citySlug} />
      <NewProjectsSection projects={projects} citySlug={citySlug} />

      {/* Additional area discovery follows the project rail. */}
      <ExploreMoreSection />
      <CityDiscovery cities={cities} counts={cityCounts} />
      <PopularSearches groups={popularSearches} />

      {/* 8. Editorial, Investment Snapshot, Guides & Closing CTA */}
      <WhyEstateWx listings={stats.listings} cities={stats.cities} />

      <InvestmentSection
        snapshot={{
          projects: citySlug ? projects.length : stats.projects,
          commercial: commercialCount.total,
          cities: stats.cities,
          rentals: rentalCount.total,
        }}
      />

      <InsightsPreview posts={posts} />

      {/* Client reviews (admin-approved only) & review submission */}
      <ClientReviewsSection reviews={clientReviews} summary={reviewSummary} />

      <CtaSection />
    </div>
  );
}
