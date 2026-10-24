import Link from "next/link";
import { ResilientImage } from "@/components/resilient-image";
import { IconArrowRight } from "@/components/icons";
import { MobileScrollGrid } from "@/components/mobile-scroll-grid";

type SocietyRailItem = {
  name: string;
  href: string;
  logo: string;
  logoClass: string;
};

/** Keep this rail intentionally curated: the four original entries plus the six requested additions. */
const SOCIETIES: SocietyRailItem[] = [
  { name: "DHA", href: "/property-for-sale/dha-lahore", logo: "/images/societies/dha-lahore.webp", logoClass: "dha" },
  { name: "Bahria Town", href: "/property-for-sale/bahria-town-lahore", logo: "/images/societies/bahria-town.webp", logoClass: "bahria" },
  { name: "Lake City", href: "/property-for-sale/lake-city-lahore", logo: "/images/societies/lake-city.webp", logoClass: "lake-city" },
  { name: "Al-Kabir Town", href: "/property-for-sale/al-kabir-town-lahore", logo: "/images/societies/al-kabir-town.webp", logoClass: "al-kabir" },
  { name: "Etihad Town", href: "/property-for-sale/etihad-town-lahore", logo: "/images/societies/etihad-town.webp", logoClass: "etihad" },
  // Kings Town is an Al-Kabir Town Phase 3 community; its supplied mark is the developer's logo.
  { name: "Kings Town", href: "/property-for-sale/kings-town-lahore", logo: "/images/societies/kings-town.webp", logoClass: "kings" },
  { name: "New Lahore City", href: "/property-for-sale/new-lahore-city", logo: "/images/societies/new-lahore-city-official.webp", logoClass: "new-lahore-city" },
  // Jubilee Town and LDA Avenue use the LDA mark because they are LDA-developed schemes.
  { name: "Jubilee Town", href: "/property-for-sale/jubilee-town-lahore", logo: "/images/societies/jubilee-town.webp", logoClass: "jubilee" },
  { name: "Valencia Town", href: "/property-for-sale/valencia-town-lahore", logo: "/images/societies/valencia-town.webp", logoClass: "valencia" },
  { name: "LDA Avenue", href: "/property-for-sale/lda-avenue-lahore", logo: "/images/societies/lda-avenue.webp", logoClass: "lda-avenue" },
];

export function TrendingSocieties() {
  return (
    <section className="home-societies-section" aria-labelledby="home-societies-heading">
      <div className="ui-container">
        <div className="home-mobile-section-heading">
          <div>
            <p className="home-mobile-eyebrow">Explore Pakistan&apos;s communities</p>
            <h2 id="home-societies-heading">Trending Societies</h2>
          </div>
          <Link href="/towns" className="home-mobile-view-all">
            View All <IconArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <MobileScrollGrid
          label="Trending Lahore housing societies"
          autoPlay
          autoPlayMobileOnly
          autoPlayInterval={5200}
          autoPlayStartDelay={4900}
          className="home-societies-autoplay"
          trackClassName="home-societies-rail"
          trackRole="list"
          trackAriaLabel="Trending Lahore housing societies"
          testId="trending-societies-rail"
        >
          {SOCIETIES.map((society) => (
            <Link
              key={society.href}
              href={society.href}
              className="home-society-card"
              role="listitem"
              aria-label={society.name}
            >
              <span
                className={`home-society-image home-society-image--${society.logoClass}`}
                style={society.logoClass === "new-lahore-city" ? { backgroundColor: "#fff", borderColor: "#e3eae5" } : undefined}
              >
                <ResilientImage
                  src={society.logo}
                  alt=""
                  aria-hidden="true"
                  width={160}
                  height={160}
                  loading="lazy"
                  decoding="async"
                  className="home-society-logo"
                />
              </span>
              <span className="home-society-copy">
                <span className="home-society-name">{society.name}</span>
              </span>
            </Link>
          ))}
        </MobileScrollGrid>
      </div>
    </section>
  );
}
