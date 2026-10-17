import type { Metadata } from "next";
import { COMPANY_SOCIAL_LINKS, SITE } from "@/lib/constants";
import { ogCard, ogImage } from "@/lib/images";
import type { Post, Project, Property } from "@/db/schema";
import { formatArea, formatPrice } from "@/lib/format";

type MetaInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  keywords?: string[];
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  robots?: Metadata["robots"];
  /** Short context label rendered on the generated social card. */
  ogKicker?: string;
  ogSubtitle?: string;
};

/**
 * Filter and parameter URLs are kept crawlable but excluded from the index so
 * Google does not treat thousands of combinations as duplicate thin pages.
 */
export function listingRobots(hasFilters: boolean): Metadata["robots"] {
  return hasFilters
    ? { index: false, follow: true, googleBot: { index: false, follow: true } }
    : { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } };
}

export function buildMetadata({
  title,
  description,
  path,
  image,
  keywords,
  type = "website",
  publishedTime,
  modifiedTime,
  robots,
  ogKicker,
  ogSubtitle,
}: MetaInput): Metadata {
  const url = `${SITE.url}${path === "/" ? "" : path}`;
  // Pages without their own photography get a branded, title-aware card from
  // the OG route; the homepage uses the hero photograph social card.
  const og =
    image ??
    (path === "/"
      ? ogImage
      : ogCard({ title, subtitle: ogSubtitle ?? description, kicker: ogKicker }));
  return {
    // `absolute` keeps authored titles exactly as written (no double brand suffix).
    title: { absolute: title },
    description,
    keywords,
    robots: robots ?? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE.name,
      locale: SITE.locale,
      type,
      publishedTime,
      ...(modifiedTime ? { modifiedTime } : {}),
      images: [{ url: og, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [og],
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": `${SITE.url}/#organization`,
    name: SITE.name,
    legalName: SITE.company,
    alternateName: ["Properties Pak", "Properties Pak Pakistan"],
    description: SITE.description,
    url: SITE.url,
    email: SITE.companyEmail,
    telephone: SITE.companyPhone,
    logo: {
      "@type": "ImageObject",
      url: `${SITE.url}/icon.png`,
      width: 512,
      height: 512,
    },
    image: `${SITE.url}/images/residence-social.jpg`,
    sameAs: Object.values(SITE.social),
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: SITE.companyPhone,
        email: SITE.companyEmail,
        areaServed: "PK",
        availableLanguage: ["en", "ur"],
      },
      {
        "@type": "ContactPoint",
        contactType: "international enquiries",
        telephone: SITE.companyPhoneUs,
        email: SITE.companyEmail,
        areaServed: ["US", "GB", "AE", "SA"],
        availableLanguage: ["en"],
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Property discovery and investment tools",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Property search across Pakistan" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Property comparison and listing scores" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Mortgage, yield and investment calculators" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Free property listing for owners and agencies" } },
      ],
    },
    knowsLanguage: ["en-PK", "ur-PK"],
    areaServed: [
      { "@type": "Country", name: "Pakistan" },
      { "@type": "City", name: "Lahore" },
      { "@type": "City", name: "Islamabad" },
      { "@type": "City", name: "Karachi" },
      { "@type": "City", name: "Rawalpindi" },
      { "@type": "City", name: "Faisalabad" },
      { "@type": "City", name: "Multan" },
      { "@type": "City", name: "Gujranwala" },
      { "@type": "City", name: "Peshawar" },
    ],
    address: {
      "@type": "PostalAddress",
      addressCountry: "PK",
      addressRegion: "Punjab",
      addressLocality: SITE.companyAddress.city,
    },
    parentOrganization: {
      "@type": "Organization",
      "@id": `${SITE.companyUrl}#organization`,
      name: SITE.company,
      description:
        "WordbitX Software Company is a full-service technology company engineering web platforms, PropTech solutions, custom software & mobile apps in Pakistan and globally.",
      url: SITE.companyUrl,
      email: "info@wordbitxtech.com",
      telephone: SITE.companyPhone,
      sameAs: COMPANY_SOCIAL_LINKS,
      address: {
        "@type": "PostalAddress",
        addressCountry: "PK",
        addressRegion: "Punjab",
        addressLocality: SITE.companyAddress.city,
      },
    },
    slogan: SITE.tagline,
    isAccessibleForFree: true,
    disambiguatingDescription:
      "Properties Pak (propertiespak.com) is Pakistan's property marketplace, engineered by WordbitX Software Company (https://wordbitxtech.com/).",
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    name: SITE.name,
    alternateName: SITE.fullName,
    url: SITE.url,
    description: SITE.description,
    inLanguage: SITE.language,
    publisher: { "@id": `${SITE.url}/#organization` },
    potentialAction: [
      {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE.url}/properties?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    ],
  };
}

export function webPageJsonLd(input: {
  name: string;
  description: string;
  path: string;
  about?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE.url}${input.path}#webpage`,
    name: input.name,
    description: input.description,
    url: `${SITE.url}${input.path}`,
    isPartOf: { "@id": `${SITE.url}/#website` },
    publisher: { "@id": `${SITE.url}/#organization` },
    about: (input.about ?? []).map((name) => ({ "@type": "Thing", name })),
    inLanguage: SITE.language,
  };
}

export function breadcrumbJsonLd(items: { name: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE.url}${item.href === "/" ? "" : item.href}`,
    })),
  };
}

/** CollectionPage markup for hub pages that list many properties. */
export function collectionPageJsonLd(input: { name: string; description: string; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE.url}${input.path}#collection`,
    name: input.name,
    description: input.description,
    url: `${SITE.url}${input.path}`,
    isPartOf: { "@id": `${SITE.url}/#website` },
    publisher: { "@id": `${SITE.url}/#organization` },
    inLanguage: SITE.language,
  };
}

/** ItemList markup for curated listing pages (category, city, society hubs). */
export function itemListJsonLd(input: {
  name: string;
  path: string;
  items: { name: string; path: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: input.name,
    url: `${SITE.url}${input.path}`,
    numberOfItems: input.items.length,
    itemListElement: input.items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: `${SITE.url}${item.path}`,
    })),
  };
}

export function propertyJsonLd(property: Property) {
  const url = `${SITE.url}/property/${property.slug}`;
  const isRent = property.purpose === "rent";
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "@id": `${url}#listing`,
    name: property.title,
    url,
    description: property.description,
    image: property.images.slice(0, 4),
    datePosted: property.createdAt instanceof Date ? property.createdAt.toISOString() : undefined,
    numberOfRooms: property.bedrooms || undefined,
    numberOfBathroomsTotal: property.bathrooms || undefined,
    floorSize: {
      "@type": "QuantitativeValue",
      value: property.areaSqft,
      unitCode: "FTK",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: property.address || property.locationArea,
      addressLocality: property.cityName,
      addressRegion: "Pakistan",
      addressCountry: "PK",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: property.lat,
      longitude: property.lng,
    },
    /** Rental listings expose prices as recurring monthly Rent, sales as Offer. */
    ...(isRent
      ? {
          offers: {
            "@type": "Offer",
            price: property.price,
            priceCurrency: "PKR",
            availability: "https://schema.org/InStock",
            url,
            businessFunction: "http://purl.org/goodrelations/v1#LeaseOut",
          },
        }
      : {
          offers: {
            "@type": "Offer",
            price: property.price,
            priceCurrency: "PKR",
            availability: "https://schema.org/InStock",
            url,
            businessFunction: "http://purl.org/goodrelations/v1#Sell",
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: property.price,
              priceCurrency: "PKR",
              referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "C62" },
            },
          },
        }),
    countryOfOrigin: { "@type": "Country", name: "Pakistan" },
    additionalProperty: [
      { "@type": "PropertyValue", name: "Purpose", value: isRent ? "For Rent" : "For Sale" },
      { "@type": "PropertyValue", name: "Property type", value: property.propertyType },
      { "@type": "PropertyValue", name: "City", value: property.cityName },
      { "@type": "PropertyValue", name: "Area", value: property.locationArea },
      {
        "@type": "PropertyValue",
        name: "Price",
        value: `${formatPrice(property.price, property.priceUnit)} · ${formatArea(
          property.areaValue,
          property.areaUnit,
          property.areaSqft,
        )}`,
      },
      { "@type": "PropertyValue", name: "Furnishing", value: property.furnishing },
      { "@type": "PropertyValue", name: "Possession", value: property.possession },
    ],
  };
}

export function projectJsonLd(project: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "ApartmentComplex",
    "@id": `${SITE.url}/projects/${project.slug}#project`,
    name: project.name,
    url: `${SITE.url}/projects/${project.slug}`,
    description: project.description,
    image: [project.coverImage, ...project.images].slice(0, 3),
    address: {
      "@type": "PostalAddress",
      streetAddress: project.location,
      addressLocality: project.cityName,
      addressRegion: "Pakistan",
      addressCountry: "PK",
    },
    geo: { "@type": "GeoCoordinates", latitude: project.lat, longitude: project.lng },
    numberOfAccommodationUnits: project.units || undefined,
  };
}

export function articleJsonLd(
  post: Post,
  extras: { updatedAt?: string; wordCount?: number; about?: string[] } = {},
) {
  const url = `${SITE.url}/blog/${post.slug}`;
  const published = post.publishedAt instanceof Date ? post.publishedAt.toISOString() : undefined;
  const image = /^https?:\/\//.test(post.coverImage) ? post.coverImage : `${SITE.url}${post.coverImage}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.title,
    description: post.excerpt,
    image: [image],
    author: { "@type": "Organization", name: post.author, url: `${SITE.url}/about` },
    publisher: { "@id": `${SITE.url}/#organization` },
    datePublished: published,
    dateModified: extras.updatedAt ?? published,
    articleSection: post.category,
    keywords: post.tags.join(", "),
    ...(extras.wordCount ? { wordCount: extras.wordCount } : {}),
    ...(extras.about?.length ? { about: extras.about.map((name) => ({ "@type": "Thing", name })) } : {}),
    inLanguage: SITE.language,
    isAccessibleForFree: true,
    isPartOf: { "@id": `${SITE.url}/#website` },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };
}

/**
 * RealEstateAgent markup for a dealer profile. `aggregateRating` is only
 * emitted when moderated, approved reviews actually exist — never from
 * seeded or estimated numbers.
 */
export function dealerJsonLd(input: {
  slug: string;
  name: string;
  bio?: string;
  email?: string;
  phone?: string;
  agency?: string;
  image?: string;
  isVerified?: boolean;
  cityNames?: string[];
  reviewSummary?: { count: number; average: number };
}) {
  const url = `${SITE.url}/dealers/${input.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": `${url}#agent`,
    name: input.name,
    url,
    description: input.bio || `${input.name} lists property on Properties Pak.`,
    email: input.email || undefined,
    telephone: input.phone || undefined,
    image: input.image || undefined,
    areaServed: (input.cityNames ?? []).map((name) => ({ "@type": "City", name })),
    worksFor: input.agency ? { "@type": "Organization", name: input.agency } : undefined,
    knowsLanguage: ["en-PK", "ur-PK"],
    memberOf: { "@id": `${SITE.url}/#organization` },
    hasCertification: input.isVerified
      ? {
          "@type": "Certification",
          name: "Properties Pak verified dealer",
          description:
            "Identity, agency and contact number confirmed by the Properties Pak team; account holds published property listings.",
        }
      : undefined,
    aggregateRating:
      input.reviewSummary && input.reviewSummary.count > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: input.reviewSummary.average,
            reviewCount: input.reviewSummary.count,
            bestRating: 5,
            worstRating: 1,
          }
        : undefined,
  };
}

/** ShoppingCenter markup for a mall directory page. */
export function mallJsonLd(input: {
  slug: string;
  name: string;
  description: string;
  city: string;
  area: string;
  status: "open" | "upcoming";
  openingDate?: string;
  image?: string;
}) {
  const url = `${SITE.url}/malls/${input.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "ShoppingCenter",
    "@id": `${url}#mall`,
    name: input.name,
    url,
    description: input.description,
    ...(input.image ? { image: input.image.startsWith("http") ? input.image : `${SITE.url}${input.image}` } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: input.area,
      addressLocality: input.city,
      addressCountry: "PK",
    },
    openingDate: input.status === "open" ? input.openingDate : undefined,
    additionalProperty: [
      { "@type": "PropertyValue", name: "Status", value: input.status === "open" ? "Open" : "Coming soon / under construction" },
    ],
  };
}

/** Dataset markup for the Pakistan Property Price Index (linkable data asset). */
export function priceIndexJsonLd(input: { listings: number; cities: number; dateModified: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "@id": `${SITE.url}/pakistan-property-price-index#dataset`,
    name: "Pakistan Property Price Index",
    description:
      "Median asking prices and price per square foot for property in Pakistan, computed from live Properties Pak listings by city, property type and area.",
    url: `${SITE.url}/pakistan-property-price-index`,
    creator: { "@id": `${SITE.url}/#organization` },
    publisher: { "@id": `${SITE.url}/#organization` },
    inLanguage: SITE.language,
    isAccessibleForFree: true,
    dateModified: input.dateModified,
    spatialCoverage: { "@type": "Country", name: "Pakistan" },
    variableMeasured: [
      { "@type": "PropertyValue", name: "Median asking price (PKR)" },
      { "@type": "PropertyValue", name: "Median price per square foot (PKR)" },
      { "@type": "PropertyValue", name: "Median monthly rent (PKR)" },
    ],
    size: `${input.listings} listings across ${input.cities} cities`,
  };
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}
