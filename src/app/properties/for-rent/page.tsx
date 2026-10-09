import { SEARCH_FILTER_KEYS } from "@/lib/property-search";
import type { Metadata } from "next";
import { ListingView, type RawSearchParams } from "@/components/listing-view";
import { PROPERTY_TYPES } from "@/lib/constants";
import { buildMetadata, listingRobots } from "@/lib/seo";

const baseMetadata: Metadata = buildMetadata({
  title: "Houses, Flats & Furnished Apartments for Rent in Pakistan",
  description:
    "Find houses, flats and furnished apartments for rent across Pakistan. Filter by city, bedroom count, monthly rent and furnishing; availability depends on current listings.",
  path: "/properties/for-rent",
  keywords: [
    "houses for rent Lahore",
    "apartments for rent Islamabad",
    "flats on rent Pakistan",
    "furnished apartments for rent Pakistan",
    "2 bedroom flat for rent Pakistan",
    "property for rent Pakistan",
  ],
});

const FILTER_KEYS = SEARCH_FILTER_KEYS;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}): Promise<Metadata> {
  const raw = await searchParams;
  const hasFilters = FILTER_KEYS.some((key) => {
    const value = raw[key];
    return Array.isArray(value) ? value.length > 0 : Boolean(value);
  });
  return { ...baseMetadata, robots: listingRobots(hasFilters) };
}

export default async function ForRentPage({ searchParams }: { searchParams: Promise<RawSearchParams> }) {
  const raw = await searchParams;
  return (
    <ListingView
      eyebrow="For rent"
      title="Property for Rent in Pakistan"
      description="Browse houses, flats, portions and furnished apartments for rent. Filter by bedroom count, area and furnishing, then compare monthly rent with similar units in the same society."
      crumbs={[
        { name: "Home", href: "/" },
        { name: "Properties", href: "/properties" },
        { name: "For Rent", href: "/properties/for-rent" },
      ]}
      basePath="/properties/for-rent"
      raw={raw}
      fixed={{ purpose: "rent" }}
      purposeKind="rent"
      typeOptions={[...PROPERTY_TYPES]}
    />
  );
}
