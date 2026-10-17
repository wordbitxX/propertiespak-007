import { getAllPostSlugs } from "@/lib/queries";
import { renderUrlSet, xmlResponse } from "@/lib/sitemap-xml";
import { BLOG_POSTS_2026_BY_SLUG } from "@/lib/blog-content-2026";

export const dynamic = "force-dynamic";

export async function GET() {
  const posts = await getAllPostSlugs();
  return xmlResponse(
    renderUrlSet([
      { path: "/blog", changeFrequency: "weekly", priority: 0.7 },
      ...posts.map((post) => ({
        path: `/blog/${post.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.7,
        // Only articles with a real, tracked edit date publish <lastmod>.
        lastModified: BLOG_POSTS_2026_BY_SLUG.get(post.slug)?.updatedAt,
      })),
    ]),
  );
}
