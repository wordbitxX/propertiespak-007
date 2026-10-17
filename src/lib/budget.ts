/**
 * Budget helpers for free-typed PKR amounts.
 *
 * Buyers in Pakistan type budgets many ways — "500000", "5,00,000", "5 lakh",
 * "5 lac", "1.5 crore", "1.5cr", "50k", "2 million". `parseBudget` turns all
 * of them into a rupee number; `formatBudgetShort` turns a number back into
 * the familiar "5 Lakh" / "1.5 Crore" wording.
 */

const UNITS: { pattern: RegExp; factor: number }[] = [
  { pattern: /^(arab|arb|billion|bn|b)$/, factor: 1_000_000_000 },
  { pattern: /^(crore|crores|cror|crs?|c)$/, factor: 10_000_000 },
  { pattern: /^(million|millions|mn|m)$/, factor: 1_000_000 },
  { pattern: /^(lakh|lakhs|lac|lacs|lak|l)$/, factor: 100_000 },
  { pattern: /^(thousand|hazar|hazaar|k)$/, factor: 1_000 },
];

/** Returns rupees, `null` for empty input, or `NaN` when the text is not a budget. */
export function parseBudget(input: string): number | null {
  const text = input.toLowerCase().replace(/rs\.?|pkr|rupees?/g, "").replace(/,/g, "").trim();
  if (!text) return null;
  const match = text.match(/^(\d+(?:\.\d+)?)\s*([a-z]*)$/);
  if (!match) return Number.NaN;
  const value = parseFloat(match[1]);
  const unit = match[2];
  if (!unit) return Math.round(value);
  const found = UNITS.find((entry) => entry.pattern.test(unit));
  return found ? Math.round(value * found.factor) : Number.NaN;
}

function trimNumber(value: number) {
  return Number(value.toFixed(2)).toString();
}

/** 500000 → "5 Lakh", 15000000 → "1.5 Crore", 75000 → "75 Thousand". */
export function formatBudgetShort(amount: number): string {
  if (amount >= 1_000_000_000) return `${trimNumber(amount / 1_000_000_000)} Arab`;
  if (amount >= 10_000_000) return `${trimNumber(amount / 10_000_000)} Crore`;
  if (amount >= 100_000) return `${trimNumber(amount / 100_000)} Lakh`;
  if (amount >= 1_000) return `${trimNumber(amount / 1_000)} Thousand`;
  return amount.toLocaleString("en-PK");
}

/** 500000 → "5,00,000" (South-Asian digit grouping). */
export function formatBudgetDigits(amount: number): string {
  return amount.toLocaleString("en-IN");
}

/** Label for a min/max pair, e.g. "5 Lakh – 1 Crore", "From 50 Lakh", "Up to 2 Crore". */
export function budgetRangeLabel(min: number | null, max: number | null): string {
  if (min && max) return `${formatBudgetShort(min)} – ${formatBudgetShort(max)}`;
  if (min) return `From ${formatBudgetShort(min)}`;
  if (max) return `Up to ${formatBudgetShort(max)}`;
  return "";
}
