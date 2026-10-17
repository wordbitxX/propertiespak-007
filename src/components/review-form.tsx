"use client";

import { useState } from "react";
import { IconStarFilled } from "@/components/icons";

/**
 * Public review form. Submissions are moderated: the review only appears on
 * the site (and in rating markup) after an admin approves it.
 */
export function ReviewForm({
  dealerUserId,
  subject,
  compact = false,
}: {
  dealerUserId?: number;
  subject: string;
  compact?: boolean;
}) {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [authorName, setAuthorName] = useState("");
  const [authorCity, setAuthorCity] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setState("sending");
    setError("");
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dealerUserId: dealerUserId ?? null, authorName, authorCity, rating, title, body }),
      });
      const payload = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !payload.ok) {
        setError(payload.error ?? "Could not save your review. Please try again.");
        setState("error");
        return;
      }
      setState("sent");
      setAuthorName("");
      setAuthorCity("");
      setTitle("");
      setBody("");
      setRating(5);
    } catch {
      setError("Network error. Please try again.");
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <p className="rounded-xl border border-forest-600/30 bg-forest-50 px-4 py-3 text-[0.875rem] font-medium text-forest-700" role="status">
        Thank you — your review is with our team and will appear here once it is approved.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className={compact ? "grid gap-3" : "grid gap-3 sm:grid-cols-2"}>
      <div className={compact ? "" : "sm:col-span-2"}>
        <span className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-ink-muted" id="review-rating-label">
          Your rating for {subject}
        </span>
        <div className="mt-1.5 flex items-center gap-1" role="radiogroup" aria-labelledby="review-rating-label">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={rating === star}
              aria-label={`${star} star${star === 1 ? "" : "s"}`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="p-0.5"
            >
              <IconStarFilled className={`h-6 w-6 ${(hover || rating) >= star ? "text-[#DFB872]" : "text-slate-300"}`} />
            </button>
          ))}
          <span className="ml-2 text-[0.8125rem] font-semibold text-navy-900">{rating}/5</span>
        </div>
      </div>
      <div>
        <label className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-ink-muted" htmlFor="review-name">
          Your name
        </label>
        <input id="review-name" value={authorName} onChange={(event) => setAuthorName(event.target.value)} required minLength={2} maxLength={120} className="field mt-1.5" placeholder="e.g. Ahmed Raza" />
      </div>
      <div>
        <label className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-ink-muted" htmlFor="review-city">
          City (optional)
        </label>
        <input id="review-city" value={authorCity} onChange={(event) => setAuthorCity(event.target.value)} maxLength={80} className="field mt-1.5" placeholder="e.g. Lahore" />
      </div>
      <div className={compact ? "" : "sm:col-span-2"}>
        <label className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-ink-muted" htmlFor="review-title">
          Headline (optional)
        </label>
        <input id="review-title" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={160} className="field mt-1.5" placeholder="Sum up your experience" />
      </div>
      <div className={compact ? "" : "sm:col-span-2"}>
        <label className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-ink-muted" htmlFor="review-body">
          Your review
        </label>
        <textarea id="review-body" value={body} onChange={(event) => setBody(event.target.value)} required minLength={10} maxLength={1200} rows={compact ? 3 : 4} className="field mt-1.5" placeholder={`How was your experience with ${subject}?`} />
      </div>
      {error && (
        <p className={`rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[0.8125rem] font-medium text-red-700 ${compact ? "" : "sm:col-span-2"}`} role="alert">
          {error}
        </p>
      )}
      <div className={compact ? "" : "sm:col-span-2"}>
        <button type="submit" disabled={state === "sending"} className="btn btn-primary">
          {state === "sending" ? "Sending…" : "Submit review for approval"}
        </button>
        <p className="mt-2 text-[0.75rem] text-ink-muted">Reviews are checked by our team before they appear, so ratings stay honest.</p>
      </div>
    </form>
  );
}

export function Stars({ rating, className = "h-4 w-4" }: { rating: number; className?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <IconStarFilled key={star} className={`${className} ${rating >= star ? "text-[#DFB872]" : "text-slate-300"}`} />
      ))}
    </span>
  );
}
