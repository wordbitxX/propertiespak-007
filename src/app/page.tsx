import type { Metadata } from "next";
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
import { DealersSlider } from "@/components/dealers-slider";
import { PopularSearches } from "@/components/popular-searches";
import {
  getCities,
  getCityListingCounts,
  getDealerShowcase,
  getPlatformStats,
  getPropertyCategoryCounts,
  getPosts,
  getPopularSearches,
  getProjects,
  searchProperties,
} from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { HomeExploreProperties } from "@/components/home-explore-properties";
import { RecentProperties } from "@/components/recent-properties";

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

export default async function HomePage() {
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
  ] = await Promise.all([
    getPlatformStats(),
    searchProperties({ featured: true, verified: true, pageSize: 8 }),
    searchProperties({ sort: "newest", pageSize: 16 }),
    getPropertyCategoryCounts(),
    getCities(),
    getCityListingCounts(),
    getProjects(8),
    searchProperties({ category: "commercial", pageSize: 8 }),
    searchProperties({ category: "commercial", pageSize: 1 }),
    searchProperties({ purpose: "rent", pageSize: 1 }),
    getPosts(3),
    getDealerShowcase(48),
    getPopularSearches(),
  ]);

  return (
    <div className="home-page">
      <Hero />

      {/* Keep the dealer showcase and Properties Pak tools near the hero, as in the original layout. */}
      <DealersSlider dealers={showcaseDealers} />
      <ExploreMoreSection />

      <CategoryGrid counts={categoryCounts} />
      <RecentlyAddedProperties properties={discovery.items} />

      {/* Keep featured inventory after the new listings and preserve the separate, locally viewed list. */}
      <FeaturedProperties properties={featured.items} total={featured.total} />
      <RecentProperties />

      {/* Property discovery */}
      <Section tone="mist" id="explore">
        <div className="ui-container">
          <SectionHeading
            eyebrow="Property discovery"
            title="Explore Properties"
            description="Find spaces that match the way you live, work and invest."
            action={{ label: "Advanced search", href: "/properties" }}
          />
          <div className="mt-6 flex flex-wrap gap-2">
            {QUICK_CHIPS.map((chip) => (
              <Link key={chip.href} href={chip.href} className="chip">
                {chip.label}
              </Link>
            ))}
          </div>
          <HomeExploreProperties properties={discovery.items} total={discovery.total} />
          <div className="mt-10 flex justify-center">
            <Link href="/properties" className="btn btn-primary">
              View all {stats.listings} properties
            </Link>
          </div>
        </div>
      </Section>

      {/* Manually scroll every commercial listing, not just the first server page. */}
      <CommercialSection properties={commercialListings.items} total={commercialListings.total} />
      {/* Map access lives exclusively in the header, on desktop and mobile. */}
      <PopularSearches groups={popularSearches} />
      <NewProjectsSection projects={projects} />
      <CityDiscovery cities={cities} counts={cityCounts} />

      <WhyEstateWx listings={stats.listings} cities={stats.cities} />

      <InvestmentSection
        snapshot={{
          projects: stats.projects,
          commercial: commercialCount.total,
          cities: stats.cities,
          rentals: rentalCount.total,
        }}
      />

      <InsightsPreview posts={posts} />
      <CtaSection />
    </div>
  );
}
