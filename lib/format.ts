/**
 * Flat fee added when an order is sent as a gift (wrapping + card).
 * Authoritative value — the orders API recomputes the total with this;
 * the client only uses it for display.
 */
export const GIFT_FEE_MAD = 30;

/** Format a whole-dirham amount, e.g. 180 -> "180 DH". */
export function formatDH(amount: number): string {
  return `${new Intl.NumberFormat("fr-MA").format(Math.round(amount))} DH`;
}

/** Parse a stored JSON image array safely. */
export function parseImages(images: string | null | undefined): string[] {
  if (!images) return [];
  try {
    const v = JSON.parse(images);
    return Array.isArray(v) ? v.filter((s) => typeof s === "string") : [];
  } catch {
    return [];
  }
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function splitNotes(scentNotes: string): string[] {
  return scentNotes
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export const CATEGORIES = [
  { value: "CANDLE", label: "Candles" },
  { value: "DIFFUSER", label: "Diffusers" },
  { value: "ACCESSORY", label: "Accessories" },
] as const;

export const ORDER_STATUSES = [
  "NEW",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];
