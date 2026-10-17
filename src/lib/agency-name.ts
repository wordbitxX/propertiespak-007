/** Display name used for an agency's logo and card title (server- and client-safe). */
export function agencyDisplayName(dealer: { agency?: string | null; name?: string | null }) {
  return dealer.agency?.trim() || dealer.name?.trim() || "Property Advisor";
}
