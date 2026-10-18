import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { SITE } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service — Properties Pak",
  description:
    "The agreement between you and Properties Pak: what the marketplace does and does not guarantee, listing rules, dealer obligations, intellectual property and liability.",
  path: "/terms",
});

const SECTIONS: { heading: string; body: string[] }[] = [
  {
    heading: "1. The agreement",
    body: [
      `These terms govern your use of ${SITE.url} and every sub-page, tool and API of the Properties Pak marketplace, operated by ${SITE.company}. By browsing, creating an account, publishing a listing or sending an enquiry you accept these terms. If you use the platform on behalf of an agency, you confirm you may bind that agency.`,
    ],
  },
  {
    heading: "2. What the platform is",
    body: [
      "Properties Pak is a listing and discovery marketplace. We publish property information supplied by owners, dealers and our own desk, together with maps, calculators and editorial guides. We are not a party to any sale, rent or investment contract concluded between users, and we do not hold client money, titles or deposits.",
    ],
  },
  {
    heading: "3. What we do not guarantee",
    body: [
      "Prices, yields, scores and market figures are published indicators, not valuations or advice. Verification badges confirm identity and listing review only — they are not a warranty of title, dues, possession, approvals or build quality. Always verify title documents, society dues, NOCs and possession independently, in writing, before paying any token or advance.",
    ],
  },
  {
    heading: "4. Accounts and conduct",
    body: [
      "You must provide accurate contact details, keep your credentials secret, and use one account per person or agency. You may not scrape the database at volume, resell listing data, upload unlawful or infringing material, impersonate another person or agency, post duplicate or phantom listings, or use enquiries for spam.",
    ],
  },
  {
    heading: "5. Listings",
    body: [
      "By submitting a listing you confirm you are authorised to advertise the property, that the details and photographs are accurate to your knowledge, and that you grant us a non-exclusive licence to publish, format and translate them on the platform. We may edit for clarity, reject, unpublish or hold any listing for review without prior notice, and we assign every listing a public reference code.",
    ],
  },
  {
    heading: "6. Dealer verification",
    body: [
      "The blue tick on a dealer profile means our desk confirmed the account's identity, agency and phone number on the date shown. It is reviewed periodically and may be withdrawn. Verified dealers remain responsible for every listing they publish; verification is not an endorsement of any specific transaction.",
    ],
  },
  {
    heading: "7. Intellectual property",
    body: [
      "The platform's design, code, editorial content, calculators and databases are ours or our licensors'. Society maps and plan imagery remain the property of their original publishers and are shown with attribution and a link to the source. You may quote short extracts with a link; systematic reproduction requires written permission.",
    ],
  },
  {
    heading: "8. Liability",
    body: [
      "The service is provided as-is. To the maximum extent permitted by law we are not liable for indirect losses, for transactions concluded off-platform, or for decisions taken on the basis of published indicators. Nothing in these terms limits liability that cannot be limited under applicable law.",
    ],
  },
  {
    heading: "9. Governing law",
    body: [
      "These terms are governed by the laws of the Islamic Republic of Pakistan; courts in Lahore, Punjab have jurisdiction. If a clause is unenforceable, the remainder continues in force.",
    ],
  },
  {
    heading: "10. Changes",
    body: [
      "We may update these terms as the platform evolves. Material changes take effect fourteen days after being posted on this page, and account holders see a notice in their dashboard. Continued use after the effective date accepts the new terms.",
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms of Service"
        description="The agreement between you and Properties Pak, in readable form. Last updated October 2026."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Terms of Service", href: "/terms" },
        ]}
      />
      <section className="bg-white py-14 lg:py-20">
        <div className="ui-container grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="max-w-3xl space-y-8">
            {SECTIONS.map((section) => (
              <div key={section.heading}>
                <h2 className="font-sans text-[1.15rem] font-bold text-navy-900">{section.heading}</h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)} className="mt-3 text-[0.9375rem] leading-relaxed text-ink-muted">
                    {paragraph}
                  </p>
                ))}
              </div>
            ))}
          </div>
          <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-panel border border-soft bg-mist p-5">
              <h2 className="font-sans text-[0.95rem] font-bold text-navy-900">Related pages</h2>
              <ul className="mt-3 space-y-2 text-[0.875rem] text-ink-muted">
                <li>
                  <Link className="font-semibold text-forest-700 hover:underline" href="/privacy-policy">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link className="font-semibold text-forest-700 hover:underline" href="/verification">
                    About &amp; Verification
                  </Link>
                </li>
                <li>
                  <Link className="font-semibold text-forest-700 hover:underline" href="/dealers">
                    Verified dealers
                  </Link>
                </li>
              </ul>
            </div>
            <p className="px-1 text-[0.78rem] leading-relaxed text-ink-muted">
              These terms are a practical summary for users of the marketplace. For licensing or partnership
              questions, contact the desk through the contact page.
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
