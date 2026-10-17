import { NextResponse } from "next/server";
import { getAdminReviews } from "@/lib/queries";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

/** Admin moderation queue: every submitted review, pending first. */
export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Not authorized." }, { status: 401 });
  }
  try {
    const items = await getAdminReviews();
    return NextResponse.json({
      ok: true,
      items,
      counts: {
        total: items.length,
        pending: items.filter((item) => item.status === "pending").length,
        approved: items.filter((item) => item.status === "approved").length,
      },
    });
  } catch (error) {
    console.error("admin reviews failed", error);
    return NextResponse.json({ ok: false, error: "Could not load reviews." }, { status: 500 });
  }
}
