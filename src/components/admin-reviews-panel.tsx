"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Stars } from "@/components/review-form";
import { formatDate } from "@/lib/format";

type AdminReview = {
  id: number;
  dealerUserId: number | null;
  dealerName: string | null;
  dealerSlug: string | null;
  authorName: string;
  authorCity: string;
  rating: number;
  title: string;
  body: string;
  status: string;
  createdAt: string;
};

/**
 * Review moderation. Nothing a visitor submits is public until it is approved
 * here; approved reviews power the homepage block, dealer profiles and the
 * aggregate rating in dealer schema markup.
 */
export function AdminReviewsPanel() {
  const router = useRouter();
  const [items, setItems] = useState<AdminReview[]>([]);
  const [counts, setCounts] = useState({ total: 0, pending: 0, approved: 0 });
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/reviews");
      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }
      const payload = (await response.json()) as {
        ok?: boolean;
        items?: AdminReview[];
        counts?: { total: number; pending: number; approved: number };
        error?: string;
      };
      if (!response.ok || !payload.ok) {
        setError(payload.error ?? "Could not load reviews.");
        return;
      }
      setItems(payload.items ?? []);
      setCounts(payload.counts ?? { total: 0, pending: 0, approved: 0 });
    } catch {
      setError("Network error. Please refresh and try again.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  async function act(review: AdminReview, action: "approve" | "reject" | "delete") {
    setActing(review.id);
    setError("");
    setNotice("");
    try {
      const response = await fetch(`/api/admin/reviews/${review.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const payload = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !payload.ok) {
        setError(payload.error ?? "Could not update the review.");
        return;
      }
      setNotice(
        action === "approve"
          ? `Review by ${review.authorName} approved — it is now public.`
          : action === "reject"
            ? `Review by ${review.authorName} rejected — it will not be shown.`
            : `Review by ${review.authorName} deleted.`,
      );
      await load();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setActing(null);
    }
  }

  return (
    <div className="min-w-0">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-panel border border-soft bg-white px-5 py-4">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-ink-muted">Reviews submitted</p>
          <p className="mt-1 font-sans text-[1.5rem] font-bold text-navy-900">{counts.total}</p>
        </div>
        <div className={`rounded-panel border px-5 py-4 ${counts.pending > 0 ? "border-amber-300 bg-amber-50" : "border-soft bg-white"}`}>
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-ink-muted">Waiting for approval</p>
          <p className="mt-1 font-sans text-[1.5rem] font-bold text-navy-900">{counts.pending}</p>
        </div>
        <div className="rounded-panel border border-soft bg-white px-5 py-4">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-ink-muted">Approved &amp; public</p>
          <p className="mt-1 font-sans text-[1.5rem] font-bold text-navy-900">{counts.approved}</p>
        </div>
      </div>

      {notice && (
        <p className="mt-4 rounded-xl border border-forest-600/30 bg-forest-50 px-4 py-3 text-[0.8125rem] font-medium text-forest-700">{notice}</p>
      )}
      {error && (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[0.8125rem] font-medium text-red-700">{error}</p>
      )}

      {loading ? (
        <p className="mt-6 text-[0.875rem] text-ink-muted">Loading reviews…</p>
      ) : items.length === 0 ? (
        <p className="mt-6 rounded-panel border border-soft bg-white p-8 text-center text-[0.875rem] text-ink-muted">
          No reviews yet. Reviews submitted on dealer profiles and the homepage appear here for approval first.
        </p>
      ) : (
        <div className="mt-6 grid min-w-0 gap-4">
          {items.map((review) => (
            <article key={review.id} className="min-w-0 rounded-panel border border-soft bg-white p-5 shadow-soft">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Stars rating={review.rating} />
                  {review.title && <h3 className="mt-2 font-sans text-[1rem] font-semibold text-navy-900">{review.title}</h3>}
                  <p className="mt-1.5 text-[0.875rem] leading-relaxed text-ink">{review.body}</p>
                  <p className="mt-2 text-[0.75rem] text-ink-muted">
                    {review.authorName}
                    {review.authorCity ? ` · ${review.authorCity}` : ""} · {formatDate(review.createdAt)} ·{" "}
                    {review.dealerName ? (
                      <>
                        for{" "}
                        {review.dealerSlug ? (
                          <Link href={`/dealers/${review.dealerSlug}`} className="font-semibold text-forest-700 hover:underline">
                            {review.dealerName}
                          </Link>
                        ) : (
                          review.dealerName
                        )}
                      </>
                    ) : (
                      "platform review"
                    )}
                  </p>
                </div>
                <span
                  className={`rounded-md px-2 py-1 text-[0.75rem] font-bold uppercase tracking-[0.1em] ${
                    review.status === "approved"
                      ? "bg-forest-50 text-forest-700"
                      : review.status === "pending"
                        ? "bg-amber-50 text-amber-800"
                        : "bg-red-50 text-red-700"
                  }`}
                >
                  {review.status}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 border-t border-soft pt-4">
                {review.status !== "approved" && (
                  <button type="button" disabled={acting === review.id} onClick={() => act(review, "approve")} className="btn btn-primary">
                    Approve &amp; publish
                  </button>
                )}
                {review.status !== "rejected" && (
                  <button type="button" disabled={acting === review.id} onClick={() => act(review, "reject")} className="btn btn-outline">
                    Reject
                  </button>
                )}
                <button type="button" disabled={acting === review.id} onClick={() => act(review, "delete")} className="btn btn-outline">
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
