import { ResilientImage } from "@/components/resilient-image";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { IconArrowRight } from "@/components/icons";
import { JsonLd } from "@/components/json-ld";
import { KeywordLinks } from "@/components/keyword-links";
import { LeadForm } from "@/components/lead-form";
import { Section, SectionHeading } from "@/components/section";
import { formatDate } from "@/lib/format";
import { getPostBySlug, getPosts } from "@/lib/queries";
import { keywordsForTags } from "@/lib/keyword-catalog";
import { articleJsonLd, buildMetadata, faqJsonLd } from "@/lib/seo";
import { ArticleBody, countWords, extractHeadings } from "@/components/article-body";
import { getBlogExtras } from "@/lib/blog-content-2026";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    return buildMetadata({
      title: "Article not found",
      description: "This insight is no longer available on Properties Pak.",
      path: "/blog",
    });
  }
  const extras = getBlogExtras(post.slug);
  return buildMetadata({
    title: extras?.seoTitle ?? post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.coverImage,
    type: "article",
    publishedTime: post.publishedAt instanceof Date ? post.publishedAt.toISOString() : undefined,
    modifiedTime: extras?.updatedAt ? new Date(extras.updatedAt).toISOString() : undefined,
    keywords: post.tags,
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const extras = getBlogExtras(post.slug);
  // Show "Updated" only for a real edit made after the publish day.
  const updatedAt =
    extras?.updatedAt && post.publishedAt instanceof Date && new Date(extras.updatedAt).getTime() - post.publishedAt.getTime() > 86_400_000
      ? new Date(extras.updatedAt)
      : null;
  const headings = extractHeadings(post.body);
  const tagSet = new Set(post.tags.map((tag) => tag.toLowerCase()));
  // Related articles: same category first, then shared tags, then newest.
  const related = (await getPosts(60))
    .filter((item) => item.slug !== post.slug)
    .map((item, index) => ({
      item,
      score:
        (item.category === post.category ? 3 : 0) +
        item.tags.filter((tag) => tagSet.has(tag.toLowerCase())).length -
        index / 1000,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ item }) => item);

  return (
    <>
      <section className="relative isolate overflow-hidden bg-navy-950 pb-16 pt-28 lg:pb-20 lg:pt-36">
        <div className="ui-container relative z-10">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Insights", href: "/blog" },
              { name: post.title, href: `/blog/${post.slug}` },
            ]}
          />
          <div className="mt-7 max-w-3xl">
            <p className="eyebrow text-forest-400">
              <span className="h-[1px] w-6 bg-current opacity-70" />
              {post.category}
            </p>
            <h1 className="display-2 mt-4 text-white ew-fade-up">{post.title}</h1>
            <p className="lede mt-5 text-white/70">{post.excerpt}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.8125rem] text-white/55">
              <span>{post.author}</span>
              <span>
                <time dateTime={post.publishedAt instanceof Date ? post.publishedAt.toISOString() : undefined}>
                  {formatDate(post.publishedAt)}
                </time>
              </span>
              {updatedAt && (
                <span>
                  Updated <time dateTime={updatedAt.toISOString()}>{formatDate(updatedAt)}</time>
                </span>
              )}
              <span>{post.readMinutes} min read</span>
            </div>
          </div>
        </div>
      </section>

      <Section tone="light">
        <div className="ui-container grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          <article>
            <div className="overflow-hidden rounded-panel bg-soft">
              <ResilientImage
                src={post.coverImage}
                alt={post.title}
                width={1400}
                height={900}
                fetchPriority="high"
                decoding="async"
                className="h-[280px] w-full object-cover lg:h-[420px]"
              />
            </div>
            {extras && extras.keyTakeaways.length > 0 && (
              <div className="article-takeaways mt-8" aria-labelledby="key-takeaways">
                <h2 id="key-takeaways" className="font-sans text-[1.05rem] font-semibold text-navy-900">
                  Key takeaways
                </h2>
                <ul className="mt-3 space-y-2">
                  {extras.keyTakeaways.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {headings.length >= 3 && (
              <nav className="article-toc mt-6" aria-label="In this article">
                <p className="font-sans text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-ink-muted">
                  In this article
                </p>
                <ol className="mt-3 grid gap-1.5 sm:grid-cols-2">
                  {headings.map((heading) => (
                    <li key={heading.id}>
                      <a href={`#${heading.id}`}>{heading.text}</a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}
            <ArticleBody body={post.body} />
            {extras && extras.faqs.length > 0 && (
              <section className="mt-12" aria-labelledby="faqs">
                <h2 id="faqs" className="article-h2">
                  Frequently asked questions
                </h2>
                <div className="mt-5 divide-y divide-soft rounded-panel border border-soft bg-white">
                  {extras.faqs.map((faq) => (
                    <details key={faq.question} className="article-faq group px-5 py-4">
                      <summary className="cursor-pointer list-none font-sans text-[0.98rem] font-semibold text-navy-900">
                        {faq.question}
                      </summary>
                      <p className="mt-3 text-[0.95rem] leading-relaxed text-ink">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}
            <div className="article-author mt-10">
              <span className="article-author-mark" aria-hidden="true">PP</span>
              <div>
                <p className="font-sans text-[0.95rem] font-semibold text-navy-900">{post.author}</p>
                <p className="mt-1 text-[0.85rem] leading-relaxed text-ink-muted">
                  Researched and reviewed by the Properties Pak editorial desk in Lahore. Facts are checked against
                  our live listings, society maps and mall directory, and articles are updated when rules or projects
                  change. <Link href="/about#how-we-work" className="article-link">How we research</Link> ·{" "}
                  <Link href="/contact" className="article-link">Report a correction</Link>
                </p>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link key={tag} href={`/properties?q=${encodeURIComponent(tag)}`} className="chip">
                  {tag}
                </Link>
              ))}
            </div>

            {post.links.length > 0 && (
              <div className="mt-10 rounded-panel border border-soft bg-white p-6 shadow-soft">
                <h2 className="font-sans text-[1.05rem] font-semibold text-navy-900">
                  Related pages, markets and tools
                </h2>
                <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-muted">
                  Continue from this guide into the matching market pages and calculators.
                </p>
                <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {post.links.map((link) => (
                    <li key={`${link.href}-${link.label}`}>
                      <Link
                        href={link.href}
                        className="group flex items-center justify-between gap-3 rounded-xl border border-soft bg-mist/60 px-4 py-3 text-[0.875rem] font-medium text-navy-900 transition-colors hover:border-navy-800 hover:bg-white"
                      >
                        {link.label}
                        <IconArrowRight className="h-4 w-4 shrink-0 text-forest-600 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-10 rounded-panel border border-soft bg-mist p-6">
              <p className="font-sans text-[1rem] font-semibold text-navy-900">Continue your research</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href="/properties" className="btn btn-primary">
                  Browse live listings
                </Link>
                <Link href="/tools" className="btn btn-outline">
                  Run the numbers
                </Link>
              </div>
            </div>
          </article>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <LeadForm
              variant="contact"
              heading="Talk to an advisor"
              description="If any part of this article applies to your plan, our advisory desk can review your specific options."
              source={`blog-${post.slug}`}
            />
          </aside>
        </div>
      </Section>

      <KeywordLinks
        links={keywordsForTags(post.tags, 12)}
        tone="light"
        title="Properties and searches mentioned in this guide"
        description="Follow a term straight into live Pakistan property inventory, area guides and calculators."
      />

      {related.length > 0 && (
        <Section tone="mist">
          <div className="ui-container">
            <SectionHeading eyebrow="Keep reading" title="Related insights" action={{ label: "All insights", href: "/blog" }} />
            <div className="mt-9 grid gap-5 md:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/blog/${item.slug}`}
                  className="group flex flex-col rounded-panel border border-soft bg-white p-5 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card"
                >
                  <span className="eyebrow text-forest-700">{item.category}</span>
                  <span className="mt-3 font-sans text-[1rem] font-semibold leading-snug text-navy-900">{item.title}</span>
                  <span className="mt-2 text-[0.8125rem] text-ink-muted">{item.readMinutes} min read</span>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold text-forest-700">
                    Read article <IconArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </Section>
      )}

      <JsonLd
        data={articleJsonLd(post, {
          updatedAt: extras?.updatedAt ? new Date(extras.updatedAt).toISOString() : undefined,
          wordCount: countWords(post.body),
          about: post.tags,
        })}
      />
      {extras && extras.faqs.length > 0 && <JsonLd data={faqJsonLd(extras.faqs)} />}
    </>
  );
}
