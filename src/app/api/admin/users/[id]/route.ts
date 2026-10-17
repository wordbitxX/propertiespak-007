import { NextResponse } from "next/server";
import {
  clearVerificationRequest,
  setUserVerification,
  updateAdminUserProfile,
  type DealerProfileInput,
} from "@/lib/queries";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { invalidateCatalog } from "@/lib/cache";

export const dynamic = "force-dynamic";

/**
 * Admin-only account controls: verification plus the complete public profile
 * (identity, agency, contact details, professional bio and profile pictures)
 * shown on dealer profiles and directory cards.
 */

type TextField = keyof DealerProfileInput;
type ProfileTextKey = Exclude<TextField, "markComplete" | "requestVerification">;

const LIMITS: Partial<Record<TextField, number>> = {
  name: 120,
  whatsapp: 32,
  bio: 600,
  experience: 160,
  areas: 300,
  avatarUrl: 500,
  agency: 160,
  designation: 120,
  officeAddress: 300,
  companyPhone: 32,
  companyWebsite: 300,
  companyLogo: 500,
  verificationNote: 600,
  citySlug: 120,
  cityName: 120,
};

function optionalUrl(value: string) {
  if (!value) return true;
  return /^https?:\/\//i.test(value) || value.startsWith("/");
}

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
    const body = (await request.json()) as Record<string, unknown> & {
      verified?: boolean;
      action?: string;
    };

    // Reviewing a request (approved or rejected) clears it from the queue.
    if (body.action === "clear-request") {
      const cleared = await clearVerificationRequest(userId);
      if (!cleared) {
        return NextResponse.json({ ok: false, error: "Account not found." }, { status: 404 });
      }
      return NextResponse.json({ ok: true });
    }

    // ---- Full profile edit (identity, agency, contact, bio, pictures, role) ----
    const profileKeys: ProfileTextKey[] = [
      "name",
      "agency",
      "designation",
      "bio",
      "experience",
      "areas",
      "whatsapp",
      "officeAddress",
      "companyPhone",
      "companyWebsite",
      "avatarUrl",
      "companyLogo",
      "verificationNote",
      "citySlug",
      "cityName",
    ];
    const hasProfileField =
      profileKeys.some((key) => Object.prototype.hasOwnProperty.call(body, key)) ||
      Object.prototype.hasOwnProperty.call(body, "phone");

    if (hasProfileField || typeof body.role === "string") {
      const input: Partial<DealerProfileInput> & { role?: string; phone?: string } = {};

      for (const key of profileKeys) {
        if (!Object.prototype.hasOwnProperty.call(body, key)) continue;
        const value = body[key];
        if (typeof value !== "string") {
          return NextResponse.json({ ok: false, error: `${key} must be a text value.` }, { status: 400 });
        }
        const limit = LIMITS[key] ?? 600;
        const trimmed = value.trim();
        if (trimmed.length > limit) {
          return NextResponse.json({ ok: false, error: `${key} is too long (max ${limit} characters).` }, { status: 400 });
        }
        if (key === "name" && trimmed.length < 2) {
          return NextResponse.json({ ok: false, error: "Name must be at least 2 characters." }, { status: 400 });
        }
        if ((key === "avatarUrl" || key === "companyLogo" || key === "companyWebsite") && !optionalUrl(trimmed)) {
          return NextResponse.json(
            { ok: false, error: "Website and picture fields must be a URL or a site path." },
            { status: 400 },
          );
        }
        (input as Record<string, unknown>)[key] = trimmed;
      }

      if (Object.prototype.hasOwnProperty.call(body, "phone")) {
        if (typeof body.phone !== "string") {
          return NextResponse.json({ ok: false, error: "phone must be a text value." }, { status: 400 });
        }
        const trimmed = body.phone.trim();
        if (trimmed.length > 32) {
          return NextResponse.json({ ok: false, error: "phone is too long (max 32 characters)." }, { status: 400 });
        }
        input.phone = trimmed;
      }

      if (typeof body.role === "string") {
        if (!["member", "dealer", "agency"].includes(body.role)) {
          return NextResponse.json({ ok: false, error: "Role must be member, dealer or agency." }, { status: 400 });
        }
        input.role = body.role;
      }

      const updated = await updateAdminUserProfile(userId, input);
      if (!updated) {
        return NextResponse.json({ ok: false, error: "Account not found." }, { status: 404 });
      }
      invalidateCatalog();
      return NextResponse.json({ ok: true, user: updated });
    }

    // ---- Verification toggle ----
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
