import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { SITE } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy — Properties Pak",
  description:
    "How Properties Pak collects, uses and protects your information: account data, listings, enquiries, cookies and your choices. Written in plain language, no surprises.",
  path: "/privacy-policy",
});

const SECTIONS: { heading: string; body: string[] }[] = [
  {
    heading: "1. Who we are",
    body: [
      `Properties Pak ("we", "us") is a property marketplace for Pakistan, operated by ${SITE.company} from ${SITE.companyAddress.city}, ${SITE.companyAddress.country}. This policy explains what we collect when you browse listings, create an account, publish a listing or send an enquiry, and the choices you have.`,
    ],
  },
  {
    heading: "2. Information we collect",
    body: [
      "Browsing data: pages visited, search filters used, device type and approximate region derived from server logs. We use this to keep the site fast and to understand which markets matter most.",
      "Account data: when you register as an owner or dealer we store your name, email, phone number, a hashed password (never the plain password), city, agency details and the profile fields you choose to complete.",
      "Listing data: the property details, photos, prices and contact information you submit for publication, plus the reference code we assign to each listing.",
      "Enquiry data: messages sent through contact, lead and newsletter forms, including the name, phone number and email you provide in them.",
      "Optional sign-in data: if you use Continue with Google we receive your Google profile name, email and picture; we never receive your Google password.",
    ],
  },
  {
    heading: "3. How we use it",
    body: [
      "To publish and moderate listings, connect buyers and sellers, respond to enquiries, protect the platform from abuse, and improve search quality. We do not sell personal data to advertisers or data brokers, and we do not use your enquiries to market third-party products.",
    ],
  },
  {
    heading: "4. Cookies and sessions",
    body: [
      "We use a single session cookie to keep you signed in, and strictly-necessary cookies for security and load balancing. Saved properties and language preference are stored against your account or your browser's local storage. There are no third-party advertising cookies.",
    ],
  },
  {
    heading: "5. Where data is processed",
    body: [
      "The platform runs on managed infrastructure (Vercel for compute, a managed Postgres database such as Supabase for storage) in the regions described on our status and documentation pages. Map imagery and society plans are loaded from their original publishers with attribution.",
    ],
  },
  {
    heading: "6. Retention",
    body: [
      "Account and listing data are kept while your account is active. Unpublished or rejected submissions are retained for moderation history. Enquiry messages are kept for up to twenty-four months so we can reference earlier conversations. You can ask for deletion at any time.",
    ],
  },
  {
    heading: "7. Your choices",
    body: [
      "You can review and edit your profile from your account dashboard, unpublish a listing at will, and email us for access, correction or erasure of your personal data. Deleting your account removes your public profile; published listings you choose to keep live become desk-managed listings.",
    ],
  },
  {
    heading: "8. Security",
    body: [
      "Passwords are stored as salted hashes, sessions are signed, database access is pooled and encrypted in transit, and administrative access is limited to named staff. No system is perfectly secure; if an incident affects your data we will publish a notice on this site.",
    ],
  },
  {
    heading: "9. Children",
    body: [
      "The service is intended for adults transacting in property. We do not knowingly collect data from persons under eighteen.",
    ],
  },
  {
    heading: "10. Changes and contact",
    body: [
      "If this policy changes materially we will update the date below and, for account holders, note it in the dashboard. Questions: email the desk at the address in the footer, or write to us through the contact page.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description="Plain-language explanation of what Properties Pak collects, why we collect it, and the controls you have. Last updated October 2026."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Privacy Policy", href: "/privacy-policy" },
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
                  <Link className="font-semibold text-forest-700 hover:underline" href="/terms">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link className="font-semibold text-forest-700 hover:underline" href="/verification">
                    About &amp; Verification
                  </Link>
                </li>
                <li>
                  <Link className="font-semibold text-forest-700 hover:underline" href="/contact">
                    Contact the desk
                  </Link>
                </li>
              </ul>
            </div>
            <p className="px-1 text-[0.78rem] leading-relaxed text-ink-muted">
              This policy is a summary of current practice, not legal advice. For a formal data-protection request,
              contact us in writing and we will respond within thirty days.
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
