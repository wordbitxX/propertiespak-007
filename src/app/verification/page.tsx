import type { Metadata } from "next";
import Link from "next/link";
import { BlueTick } from "@/components/verified-badge";
import { IconShield } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About & Verification — how Properties Pak checks dealers and listings",
  description:
    "What the blue tick and the Verified badge actually mean: dealer identity checks, listing review, what verification does not cover, and how an agency applies for review.",
  path: "/verification",
  keywords: ["verified property dealers Pakistan", "Properties Pak verification", "blue tick dealer"],
});

const STEPS = [
  {
    title: "Identity and agency check",
    copy: "The desk confirms the person behind the account: CNIC-level identity, the agency name they trade under, a reachable office address and a phone number that answers. Only then is the blue tick switched on.",
  },
  {
    title: "Inventory review",
    copy: "Published listings are sampled for real photographs, plausible pricing and consistent location details. Accounts that post phantom or duplicate inventory lose the tick and, on repeat, the account.",
  },
  {
    title: "Listing checks",
    copy: "Every listing that reaches the public site passes a review of its details, photos and price against comparable stock. Owner-submitted listings are labelled as such on their detail page with a public reference code.",
  },
  {
    title: "Periodic re-review",
    copy: "Verification is a date, not a promise for life. Ticks are re-checked periodically and withdrawn when an account stops answering its phone or breaks the listing rules.",
  },
];

const BADGES = [
  {
    icon: "tick",
    label: "Verified dealer",
    copy: "Shown on listings published by an account whose identity, agency and phone number the Properties Pak desk has confirmed. Links to the dealer's public profile with the verification date.",
  },
  {
    icon: "shield",
    label: "Verified / Details checked",
    copy: "Shown when the listing itself passed the desk's detail, photo and price review — including owner-submitted listings from accounts that are not dealers.",
  },
  {
    icon: "none",
    label: "No badge",
    copy: "A listing from a new account still inside its review window. It is live and enquiry-ready, but neither the account nor the listing has completed checks yet — treat it like any open-market advertisement.",
  },
];

export default function VerificationPage() {
  return (
    <>
      <PageHero
        eyebrow="Trust & safety"
        title="About & Verification"
        description="Who we are, what our badges actually certify, and the checks behind them — so you can judge every listing before you commit a token."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "About & Verification", href: "/verification" },
        ]}
      />

      <section className="bg-white py-14 lg:py-20">
        <div className="ui-container max-w-3xl">
          <h2 className="font-sans text-[1.35rem] font-bold text-navy-900">The platform in one paragraph</h2>
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-muted">
            Properties Pak is Pakistan&apos;s property marketplace: live sale and rental listings, new projects,
            commercial space, society maps and investment calculators in one place, built and operated by WordbitX
            Software Company. Listings come from three sources — our own desk, registered dealers and agencies, and
            owners submitting directly — and every source is labelled on the listing so you always know who you are
            talking to.
          </p>

          <h2 className="mt-12 font-sans text-[1.35rem] font-bold text-navy-900">What the badges mean</h2>
          <div className="mt-5 space-y-4">
            {BADGES.map((badge) => (
              <div key={badge.label} className="rounded-panel border border-soft bg-mist p-5">
                <p className="flex items-center gap-2 font-sans text-[1rem] font-bold text-navy-900">
                  {badge.icon === "tick" ? (
                    <BlueTick className="h-4 w-4" />
                  ) : badge.icon === "shield" ? (
                    <IconShield className="h-4 w-4 text-forest-600" />
                  ) : (
                    <span aria-hidden="true" className="grid h-4 w-4 place-items-center rounded-full border border-dashed border-ink-muted/60" />
                  )}
                  {badge.label}
                </p>
                <p className="mt-2 text-[0.9rem] leading-relaxed text-ink-muted">{badge.copy}</p>
              </div>
            ))}
          </div>

          <h2 className="mt-12 font-sans text-[1.35rem] font-bold text-navy-900">How a dealer gets verified</h2>
          <ol className="mt-5 space-y-5">
            {STEPS.map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-navy-900 font-sans text-[0.85rem] font-bold text-white">
                  {index + 1}
                </span>
                <div>
                  <p className="font-sans text-[1rem] font-bold text-navy-900">{step.title}</p>
                  <p className="mt-1.5 text-[0.9rem] leading-relaxed text-ink-muted">{step.copy}</p>
                </div>
              </li>
            ))}
          </ol>

          <h2 className="mt-12 font-sans text-[1.35rem] font-bold text-navy-900">What verification never covers</h2>
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-muted">
            A badge is about identity and listing quality — not about your transaction. Title, society dues, NOCs,
            approvals and possession must be verified independently, in writing, before any token changes hands. Our
            detail pages repeat this warning next to every reference code, and our terms say the same in legal
            language.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/dealers" className="btn btn-primary">
              Browse verified dealers
            </Link>
            <Link href="/contact" className="btn btn-outline">
              Ask the desk about a badge
            </Link>
            <Link href="/terms" className="btn btn-outline">
              Read the terms
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
