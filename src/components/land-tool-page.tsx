import Link from "next/link";
import type { ReactNode } from "react";
import { PageHero } from "@/components/page-hero";
import { Section, SectionHeading } from "@/components/section";
import { JsonLd } from "@/components/json-ld";
import { faqJsonLd, webPageJsonLd } from "@/lib/seo";
import { TOOLS_MENU } from "@/lib/map-library";

export type LandToolFaq = { question: string; answer: string };

/** Shared layout for the stand-alone land & finance tools (area converter, plot size, Islamic financing). */
export function LandToolPage({
  slug,
  eyebrow,
  title,
  description,
  keywords,
  faqs,
  aside,
  children,
}: {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  keywords: string[];
  faqs: LandToolFaq[];
  aside?: ReactNode;
  children: ReactNode;
}) {
  const path = `/tools/${slug}`;
  const others = TOOLS_MENU.filter((tool) => tool.href !== path && tool.href !== "/tools");

  return (
    <>
      <JsonLd data={webPageJsonLd({ name: title, description, path, about: keywords })} />
      <JsonLd data={faqJsonLd(faqs)} />
      <PageHero
        eyebrow={eyebrow}
        title={title}
        description={description}
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Tools", href: "/tools" },
          { name: eyebrow, href: path },
        ]}
      />

      <Section tone="light">
        <div className="ui-container">{children}</div>
      </Section>

      {aside && (
        <Section tone="mist">
          <div className="ui-container">{aside}</div>
        </Section>
      )}

      <Section tone={aside ? "light" : "mist"}>
        <div className="ui-container">
          <SectionHeading eyebrow="Questions" title={`${eyebrow} FAQs`} />
          <div className="mt-6 grid gap-3 lg:grid-cols-2">
            {faqs.map((faq) => (
              <details key={faq.question} className="group rounded-panel border border-soft bg-white px-5 py-4 shadow-soft">
                <summary className="cursor-pointer list-none font-sans text-[0.9375rem] font-semibold text-navy-900">
                  {faq.question}
                </summary>
                <p className="mt-2.5 text-[0.875rem] leading-relaxed text-ink-muted">{faq.answer}</p>
              </details>
            ))}
          </div>

          <div className="mt-10">
            <h2 className="font-sans text-[1.05rem] font-semibold text-navy-900">Other Properties Pak tools</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {others.map((tool) => (
                <Link key={tool.href} href={tool.href} className="chip">
                  {tool.label}
                </Link>
              ))}
              <Link href="/tools" className="chip">
                All tools
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
