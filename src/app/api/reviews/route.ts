import { NextResponse } from "next/server";
import { createReview } from "@/lib/queries";

export const dynamic = "force-dynamic";

/**
 * Public review submission. Every review lands in the admin moderation queue
 * (`status: pending`) — nothing appears on the site, and no rating markup is
 * emitted, until an admin approves it. That keeps spam and fabricated ratings
 * off indexed pages.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const authorName = typeof body.authorName === "string" ? body.authorName.trim() : "";
  const authorCity = typeof body.authorCity === "string" ? body.authorCity.trim() : "";
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const text = typeof body.body === "string" ? body.body.trim() : "";
  const rating = typeof body.rating === "number" ? body.rating : Number(body.rating);
  const dealerUserId =
    typeof body.dealerUserId === "number" && Number.isFinite(body.dealerUserId) && body.dealerUserId > 0
      ? body.dealerUserId
      : null;

  if (authorName.length < 2 || authorName.length > 120) {
    return NextResponse.json({ ok: false, error: "Please enter your name." }, { status: 400 });
  }
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ ok: false, error: "Please choose a rating from 1 to 5 stars." }, { status: 400 });
  }
  if (text.length < 10 || text.length > 1200) {
    return NextResponse.json({ ok: false, error: "Please write a review of at least 10 characters." }, { status: 400 });
  }
  if (authorCity.length > 80 || title.length > 160) {
    return NextResponse.json({ ok: false, error: "One of the fields is too long." }, { status: 400 });
  }

  try {
    const created = await createReview({ dealerUserId, authorName, authorCity, rating, title, body: text });
    if (!created) {
      return NextResponse.json({ ok: false, error: "Could not save your review." }, { status: 500 });
    }
    return NextResponse.json({
      ok: true,
      message: "Thank you — your review is with our team and will appear once it is approved.",
    });
  } catch (error) {
    console.error("review submission failed", error);
    return NextResponse.json({ ok: false, error: "Could not save your review. Please try again." }, { status: 500 });
  }
}
