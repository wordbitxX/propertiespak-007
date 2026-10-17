import { NextResponse } from "next/server";
import { clearVerificationRequest, setUserVerification, updateAdminUserIdentity, type AdminUserProfileInput } from "@/lib/queries";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { invalidateCatalog } from "@/lib/cache";

export const dynamic = "force-dynamic";

const TEXT_LIMITS: Record<keyof AdminUserProfileInput, number> = {
  name: 120,
  agency: 160,
  phone: 32,
  whatsapp: 32,
  bio: 600,
  designation: 120,
  officeAddress: 300,
  citySlug: 80,
  cityName: 80,
  companyPhone: 32,
  companyWebsite: 300,
  companyLogo: 500,
  avatarUrl: 500,
  experience: 160,
  areas: 300,
  role: 20,
  verificationNote: 600,
};

const PROFILE_FIELDS = Object.keys(TEXT_LIMITS) as (keyof AdminUserProfileInput)[];

function optionalUrl(value: string) {
  if (!value) return true;
  return /^https?:\/\//i.test(value) || value.startsWith("/");
}

/**
 * Admin-only account controls: verification plus a complete profile edit —
 * identity, contact, professional details, profile picture and company logo.
 */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Not authorized." }, { status: 401 });
  }

  const { id } = await params;
  const userId = Number(id);
  if (!Number.isFinite(userId) || userId <= 0) {
    return NextResponse.json({ ok: false, error: "Invalid account id." }, { status: 400 });
  }

  try {
    const body = (await request.json()) as Record<string, unknown> & { verified?: boolean; action?: string };

    // Reviewing a request (approved or rejected) clears it from the queue.
    if (body.action === "clear-request") {
      const cleared = await clearVerificationRequest(userId);
      if (!cleared) {
        return NextResponse.json({ ok: false, error: "Account not found." }, { status: 404 });
      }
      return NextResponse.json({ ok: true });
    }

    const hasProfileField = PROFILE_FIELDS.some((field) => Object.prototype.hasOwnProperty.call(body, field));
    if (hasProfileField) {
      const input: AdminUserProfileInput = {};
      for (const field of PROFILE_FIELDS) {
        if (!Object.prototype.hasOwnProperty.call(body, field)) continue;
        const value = body[field];
        if (typeof value !== "string") {
          return NextResponse.json({ ok: false, error: `${field} must be a text value.` }, { status: 400 });
        }
        const trimmed = value.trim();
        if (trimmed.length > TEXT_LIMITS[field]) {
          return NextResponse.json({ ok: false, error: `${field} is too long (max ${TEXT_LIMITS[field]} characters).` }, { status: 400 });
        }
        input[field] = trimmed;
      }
      if (input.name !== undefined && input.name.length < 2) {
        return NextResponse.json({ ok: false, error: "Name must be between 2 and 120 characters." }, { status: 400 });
      }
      if (input.role !== undefined && input.role !== "" && !["member", "dealer", "agency"].includes(input.role)) {
        return NextResponse.json({ ok: false, error: "Role must be member, dealer or agency." }, { status: 400 });
      }
      for (const field of ["companyWebsite", "companyLogo", "avatarUrl"] as const) {
        const value = input[field];
        if (value && !optionalUrl(value)) {
          return NextResponse.json({ ok: false, error: `${field} must be a full URL or an uploaded image path.` }, { status: 400 });
        }
      }

      const updatedIdentity = await updateAdminUserIdentity(userId, input);
      if (!updatedIdentity) {
        return NextResponse.json({ ok: false, error: "Account not found." }, { status: 404 });
      }
      invalidateCatalog();
      return NextResponse.json({ ok: true, user: updatedIdentity });
    }

    const verified =
      typeof body.verified === "boolean"
        ? body.verified
        : body.action === "verify"
          ? true
          : body.action === "unverify"
            ? false
            : null;
    if (verified === null) {
      return NextResponse.json({ ok: false, error: "Send { verified: true } or { verified: false }." }, { status: 400 });
    }

    const updated = await setUserVerification(userId, verified);
    if (!updated) {
      return NextResponse.json({ ok: false, error: "Account not found." }, { status: 404 });
    }
    invalidateCatalog();
    return NextResponse.json({ ok: true, user: updated });
  } catch (error) {
    console.error("admin account update failed", error);
    return NextResponse.json({ ok: false, error: "Could not update the account." }, { status: 500 });
  }
}
