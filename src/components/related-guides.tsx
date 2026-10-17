import Link from "next/link";
import { IconArrowRight } from "@/components/icons";
import { BLOG_POSTS_2026, type BlogPost2026 } from "@/lib/blog-content-2026";

/**
 * Compact "related guides" strip for hub pages (malls, maps). Purely
 * additive internal links into the editorial cluster.
 */
export function RelatedGuides({
  categories,
  title = "Related guides",
  limit = 6,
}: {
  categories: BlogPost2026["category"][];
  title?: string;
  limit?: number;
}) {
  const guides = BLOG_POSTS_2026.filter((post) => categories.includes(post.category)).slice(0, limit);
  if (guides.length === 0) return null;
  return (
    <section className="related-guides" aria-labelledby="related-guides-title">
      <div className="ui-container">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="related-guides-title" className="font-sans text-[1.2rem] font-bold text-navy-900">
            {title}
          </h2>
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold text-forest-700 hover:underline">
            All guides <IconArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`} className="related-guide-card group">
                <span className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[#8a6729]">{post.category}</span>
                <span className="mt-1.5 block font-sans text-[0.95rem] font-semibold leading-snug text-navy-900">{post.title}</span>
                <span className="mt-2 inline-flex items-center gap-1 text-[0.78rem] font-semibold text-forest-700">
                  {post.readMinutes} min read <IconArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
