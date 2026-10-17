import { Section, SectionHeading } from "@/components/section";
import { ReviewForm, Stars } from "@/components/review-form";
import { initialsFor } from "@/components/verified-badge";
import { formatDate } from "@/lib/format";
import type { Review } from "@/db/schema";
import type { ReviewSummary } from "@/lib/queries";

/**
 * Homepage client-reviews block. Only admin-approved reviews are rendered;
 * with none approved yet it invites the first ones instead of inventing
 * testimonials — and no rating markup is emitted until real reviews exist.
 */
export function ClientReviewsSection({ reviews, summary }: { reviews: Review[]; summary: ReviewSummary }) {
  return (
    <Section tone="light" id="client-reviews">
      <div className="ui-container">
        <SectionHeading
          eyebrow="Client reviews"
          title="What buyers, sellers and tenants say"
          description={
            summary.count > 0
              ? `Rated ${summary.average.toFixed(1)} out of 5 from ${summary.count} approved client ${summary.count === 1 ? "review" : "reviews"}. Every review below was submitted on Properties Pak and approved by our team.`
              : "Real experiences from people who bought, sold or rented through Properties Pak. Reviews appear here after our team approves them — nothing is invented."
          }
        />
        {reviews.length > 0 ? (
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {reviews.slice(0, 6).map((review) => (
              <article key={review.id} className="flex h-full flex-col rounded-panel border border-soft bg-white p-6 shadow-soft">
                <Stars rating={review.rating} />
                {review.title && <h3 className="mt-3 font-sans text-[1rem] font-semibold text-navy-900">{review.title}</h3>}
                <p className="mt-2 flex-1 text-[0.9375rem] leading-relaxed text-ink">{review.body}</p>
                <footer className="mt-5 flex items-center gap-3 border-t border-soft pt-4">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-navy-900 font-sans text-[0.8125rem] font-bold text-white">
                    {initialsFor(review.authorName)}
                  </span>
                  <div>
                    <p className="font-sans text-[0.875rem] font-semibold text-navy-900">{review.authorName}</p>
                    <p className="text-[0.75rem] text-ink-muted">
                      {review.authorCity ? `${review.authorCity} · ` : ""}
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                </footer>
              </article>
            ))}
          </div>
        ) : null}
        <div className="mt-8 rounded-panel border border-soft bg-mist p-6 sm:p-8">
          <h3 className="font-sans text-[1.125rem] font-bold text-navy-900">Bought, sold or rented with us? Leave a review</h3>
          <p className="mt-1.5 max-w-2xl text-[0.875rem] leading-relaxed text-ink-muted">
            Your experience helps the next family choose with confidence — and helps good dealers stand out.
          </p>
          <div className="mt-5 max-w-3xl">
            <ReviewForm subject="Properties Pak" />
          </div>
        </div>
      </div>
    </Section>
  );
}
