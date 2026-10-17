import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { AgencyDirectoryCard } from "@/components/agency-directory-card";
import { PageHero } from "@/components/page-hero";
import { BlueTick } from "@/components/verified-badge";
import { getCities, getDealerCount, getDealers } from "@/lib/queries";
import { buildMetadata, breadcrumbJsonLd, collectionPageJsonLd, itemListJsonLd } from "@/lib/seo";
import { SITE } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "Verified Property Dealers & Agencies in Pakistan | Properties Pak",
  description:
    "Browse verified property dealers and agencies on Properties Pak. Every blue-tick profile is an account whose identity and contact details were checked by our team and that has live property listings in Lahore, Islamabad, Karachi and other cities.",
  path: "/dealers",
  keywords: [
    "verified property dealers Pakistan",
    "property agents Lahore",
    "real estate agencies Islamabad",
    "property dealers Karachi",
    "plot dealers Pakistan",
    "blue tick property dealer",
  ],
});

export default async function DealersPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string }>;
}) {
  const { city } = await searchParams;
  const [everyDealer, cities, dealerCount] = await Promise.all([
    getDealers({ limit: 60 }),
    getCities(),
    getDealerCount(),
  ]);
  const allDealers = city ? await getDealers({ city, limit: 48 }) : everyDealer;

  const verifiedTotal = everyDealer.filter((dealer) => dealer.isVerified).length;
  const listingTotal = everyDealer.reduce((sum, dealer) => sum + (dealer.listings ?? 0), 0);
  const verifiedListingTotal = everyDealer.reduce((sum, dealer) => sum + (dealer.verifiedListings ?? 0), 0);
  const dealersPerCity = new Map<string, number>();
  for (const dealer of everyDealer) {
    if (dealer.citySlug) dealersPerCity.set(dealer.citySlug, (dealersPerCity.get(dealer.citySlug) ?? 0) + 1);
  }
  const cityPills = cities
    .filter((item) => dealersPerCity.has(item.slug))
    .map((item) => ({ slug: item.slug, name: item.name, count: dealersPerCity.get(item.slug) ?? 0 }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  const cityName = city ? (cities.find((item) => item.slug === city)?.name ?? city) : null;
  const shownVerified = allDealers.filter((dealer) => dealer.isVerified).length;

  const stats = [
    { value: dealerCount, label: "Agencies & dealers" },
    { value: verifiedTotal, label: "Blue-tick verified" },
    { value: listingTotal, label: "Live listings" },
    { value: verifiedListingTotal, label: "Verified listings" },
  ];

  return (
    <div className="lux-theme">
      <JsonLd
        data={collectionPageJsonLd({
          name: "Verified property dealers and agencies",
          description:
            "Dealer directory on Properties Pak: verified agencies and individual sellers with published property listings.",
          path: "/dealers",
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", href: "/" },
          { name: "Dealers", href: "/dealers" },
        ])}
      />
      {allDealers.length > 0 && (
        <JsonLd
          data={itemListJsonLd({
            name: "Verified dealers on Properties Pak",
            path: "/dealers",
            items: allDealers.slice(0, 24).map((dealer) => ({
              name: dealer.isVerified ? `${dealer.name} — verified dealer` : dealer.name,
              path: `/dealers/${dealer.slug}`,
            })),
          })}
        />
      )}

      <PageHero
        eyebrow="Dealer directory"
        title="Verified Property Dealers & Agencies"
        description={`${dealerCount} agencies and dealers publish property on Properties Pak. Profiles carrying the blue tick have had their identity, agency and phone number checked by our team.`}
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Dealers", href: "/dealers" },
        ]}
      >
        <dl className="dlr-stats">
          {stats.map((stat) => (
            <div key={stat.label} className="dlr-stat">
              <dt>{stat.label}</dt>
              <dd>{stat.value.toLocaleString("en-PK")}</dd>
            </div>
          ))}
        </dl>
      </PageHero>

      <section className="dlr-directory" aria-labelledby="dealer-directory-heading">
        <div className="ui-container">
          <div className="agx-p1 dlr-panel">
            <div className="dlr-head">
              <div>
                <p className="dlr-kicker">
                  <BlueTick className="h-4 w-4" /> {shownVerified} verified {shownVerified === 1 ? "agency" : "agencies"}
                  {cityName ? ` in ${cityName}` : ""}
                </p>
                <h2 id="dealer-directory-heading" className="agx-serif">
                  {cityName ? `Verified Agencies in ${cityName}` : "Verified Agencies in Pakistan"}
                </h2>
              </div>
              <nav className="dlr-filter" aria-label="Filter agencies by city">
                <Link href="/dealers" className={`dlr-pill ${!city ? "is-active" : ""}`} aria-current={!city ? "page" : undefined}>
                  All cities <span>{everyDealer.length}</span>
                </Link>
                {cityPills.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/dealers?city=${item.slug}`}
                    className={`dlr-pill ${city === item.slug ? "is-active" : ""}`}
                    aria-current={city === item.slug ? "page" : undefined}
                  >
                    {item.name} <span>{item.count}</span>
                  </Link>
                ))}
              </nav>
            </div>

            {allDealers.length === 0 ? (
              <div className="dlr-empty">
                <h3>No agency profiles in this city yet</h3>
                <p>
                  Agency profiles appear here as soon as an account publishes its first property. Register, submit a listing
                  and your profile becomes part of this directory.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Link href="/list-property" className="btn btn-primary">
                    List your property
                  </Link>
                  <Link href="/dealers" className="btn btn-outline">
                    View all cities
                  </Link>
                </div>
              </div>
            ) : (
              <ul className="dlr-grid" aria-label="Agency profiles">
                {allDealers.map((dealer) => (
                  <li key={dealer.id}>
                    <AgencyDirectoryCard dealer={dealer} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      <section className="dlr-how" aria-labelledby="dealer-verification-heading">
        <div className="ui-container">
          <div className="dlr-how-head">
            <p className="dlr-kicker dlr-kicker--gold">How verification works</p>
            <h2 id="dealer-verification-heading" className="agx-serif">
              What the blue tick means on Properties Pak
            </h2>
            <p>
              The tick is not a paid badge and it is not automatic. It is switched on from the admin workspace after our
              team has confirmed the account behind the listings.
            </p>
          </div>
          <ol className="dlr-steps">
            <li className="dlr-step">
              <span className="dlr-step-no">01</span>
              <span className="dlr-step-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M12 3.2 19 6v5.2c0 4.3-2.9 7.6-7 9.2-4.1-1.6-7-4.9-7-9.2V6z" />
                  <path d="m8.8 12 2.2 2.2 4.3-4.4" />
                </svg>
              </span>
              <h3>Identity &amp; contact confirmed</h3>
              <p>
                We verify the name, agency and working phone number against the account before switching the tick on. The
                same number is used for the listing&rsquo;s calls and WhatsApp enquiries.
              </p>
            </li>
            <li className="dlr-step">
              <span className="dlr-step-no">02</span>
              <span className="dlr-step-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="8.2" />
                  <path d="M12 7.6V12l3 2" />
                </svg>
              </span>
              <h3>New accounts marked &ldquo;In review&rdquo;</h3>
              <p>
                Any registered account that lists a property appears in this directory. Until our team verifies it, the
                profile is clearly marked as in review rather than silently removed.
              </p>
            </li>
            <li className="dlr-step">
              <span className="dlr-step-no">03</span>
              <span className="dlr-step-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M4 10.4 12 4l8 6.4" />
                  <path d="M6.4 9v10.4h11.2V9" />
                  <path d="M12 12.2v4.4M9.8 14.4h4.4" />
                </svg>
              </span>
              <h3>List, then get verified</h3>
              <p>
                <Link href="/list-property">Publish a property</Link> with your account and our team reviews it. Approved
                listings and a confirmed phone number earn the blue tick from the admin side.
              </p>
            </li>
          </ol>
        </div>
      </section>

      <section className="dlr-cta-wrap">
        <div className="ui-container">
          <div className="dlr-cta">
            <div aria-hidden="true" className="inner-hero-photo dlr-cta-photo" />
            <div className="dlr-cta-inner">
              <p className="dlr-kicker dlr-kicker--gold">For agencies</p>
              <h2>Get your agency verified on Properties Pak</h2>
              <p>
                Publish your inventory under one account and your agency profile carries the blue tick across every listing,
                search result and enquiry. Verification is free — it depends on a confirmed contact number and a clean
                listing record, not on an advertising package.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/list-property" className="btn btn-green">
                  Publish a listing
                </Link>
                <Link href="/contact" className="btn btn-ghost-light">
                  Talk to {SITE.company}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
