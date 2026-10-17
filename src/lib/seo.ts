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

export function articleJsonLd(post: Post) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${SITE.url}/blog/${post.slug}#article`,
    headline: post.title,
    description: post.excerpt,
    image: [post.coverImage],
    author: { "@type": "Organization", name: post.author, url: `${SITE.url}/about` },
    publisher: { "@id": `${SITE.url}/#organization` },
    datePublished: post.publishedAt instanceof Date ? post.publishedAt.toISOString() : undefined,
    inLanguage: SITE.language,
    isPartOf: { "@id": `${SITE.url}/#website` },
    mainEntityOfPage: `${SITE.url}/blog/${post.slug}`,
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

/**
 * Data-derived FAQ for a listing page. Every answer is computed from the
 * listing row itself — nothing is invented — and the same array is rendered
 * as visible FAQ content and passed to `faqJsonLd`.
 */
export function propertyFaqs(property: Property) {
  const isRent = property.purpose === "rent";
  const priceLine = `${formatPrice(property.price, property.priceUnit)}${
    property.negotiable ? " — the owner has marked the price negotiable." : "."
  }`;
  const sizeLine =
    property.areaSqft > 0
      ? `${formatArea(property.areaValue, property.areaUnit, property.areaSqft)} (${Math.round(property.areaSqft).toLocaleString("en-US")} sq ft).`
      : `${formatArea(property.areaValue, property.areaUnit)}.`;
  const roomsLine =
    property.bedrooms > 0 || property.bathrooms > 0
      ? `${property.title} has ${property.bedrooms} bedroom${property.bedrooms === 1 ? "" : "s"} and ${property.bathrooms} bathroom${property.bathrooms === 1 ? "" : "s"}.`
      : `${property.title} is a ${property.propertyType.toLowerCase()} listing without a bedroom count — contact the poster for layout details.`;

  return [
    {
      question: `What is the price of ${property.title}?`,
      answer: `The listed price is ${priceLine}${isRent ? " Rent is quoted per month." : ""}`,
    },
    {
      question: `Where is ${property.title} located?`,
      answer: `It sits in ${property.locationArea}, ${property.cityName}, Pakistan${property.address ? ` — ${property.address}` : ""}. The listing page shows the exact map location and nearby properties.`,
    },
    {
      question: `How many rooms does ${property.title} have?`,
      answer: roomsLine,
    },
    {
      question: `How big is ${property.title}?`,
      answer: `The built-up / land size is ${sizeLine}`,
    },
    {
      question: `How do I enquire about ${property.title}?`,
      answer: `Open the listing on Properties Pak and use the enquiry form, call the listed contact, or send a WhatsApp message. Property viewings can be scheduled through the same listing.`,
    },
  ];
}

/** FAQ for editorial guide pages, built from the post's own metadata. */
export function guideFaqs(post: Post) {
  return [
    {
      question: `What does this guide cover?`,
      answer: post.excerpt,
    },
    {
      question: `Which topics are included?`,
      answer: `This Properties Pak guide covers ${post.tags.join(", ")}. It is written for buyers, tenants and investors researching property in Pakistan.`,
    },
    {
      question: `Who publishes this guide and how current is it?`,
      answer: `It is published by ${post.author} on Properties Pak, Pakistan's property marketplace. Guides are reviewed against live market listings and platform data.`,
    },
    {
      question: `Where can I get personal advice?`,
      answer: `Create a free Properties Pak account to shortlist properties and message verified agents, or contact the Properties Pak team directly for help with buying, renting or listing a property.`,
    },
  ];
}
