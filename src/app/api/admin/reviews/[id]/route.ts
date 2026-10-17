import { NextResponse } from "next/server";
import { deleteReview, setReviewStatus } from "@/lib/queries";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { invalidateCatalog } from "@/lib/cache";

export const dynamic = "force-dynamic";

/** Admin moderation: approve, reject or delete a submitted review. */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Not authorized." }, { status: 401 });
  }
  const { id } = await params;
  const reviewId = Number(id);
  if (!Number.isFinite(reviewId) || reviewId <= 0) {
    return NextResponse.json({ ok: false, error: "Invalid review id." }, { status: 400 });
  }
  try {
    const body = (await request.json()) as { action?: string };
    if (body.action === "delete") {
      const deleted = await deleteReview(reviewId);
      if (!deleted) return NextResponse.json({ ok: false, error: "Review not found." }, { status: 404 });
      invalidateCatalog();
      return NextResponse.json({ ok: true });
    }
    const status = body.action === "approve" ? "approved" : body.action === "reject" ? "rejected" : null;
    if (!status) {
      return NextResponse.json({ ok: false, error: "Send { action: \"approve\" | \"reject\" | \"delete\" }." }, { status: 400 });
    }
    const updated = await setReviewStatus(reviewId, status);
    if (!updated) return NextResponse.json({ ok: false, error: "Review not found." }, { status: 404 });
    invalidateCatalog();
    return NextResponse.json({ ok: true, review: updated });
  } catch (error) {
    console.error("admin review update failed", error);
    return NextResponse.json({ ok: false, error: "Could not update the review." }, { status: 500 });
  }
}
