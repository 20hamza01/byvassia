/**
 * Flat fee added when an order is sent as a gift (wrapping + card).
 * Authoritative value — the orders API recomputes the total with this;
 * the client only uses it for display.
 */
export const GIFT_FEE_MAD = 30;

/** Flat delivery fee in MAD. Waived above FREE_DELIVERY_CANDLES. */
export const DELIVERY_FEE_MAD = 30;

/** Number of candles required to unlock free delivery (Trio offer and up). */
export const FREE_DELIVERY_CANDLES = 3;

/**
 * Bundle tiers — fixed prices that apply to any combination of CANDLE-category
 * products. Ordered largest → smallest so a greedy match always gives the
 * customer the best price.
 */
export const CANDLE_BUNDLES = [
  { qty: 5, priceMAD: 599, key: "bundle5" as const },
  { qty: 3, priceMAD: 379, key: "trio" as const },
  { qty: 2, priceMAD: 269, key: "duo" as const },
  { qty: 1, priceMAD: 149, key: "single" as const },
] as const;

export type BundleKey = (typeof CANDLE_BUNDLES)[number]["key"];

/**
 * Apply tiered bundle pricing to a candle quantity. Greedy: largest bundle
 * first, then the remainder. Returns the bundle subtotal and a breakdown of
 * which tiers were applied.
 */
export function bundlePriceFor(qty: number): {
  totalMAD: number;
  breakdown: { key: BundleKey; qty: number; priceMAD: number; count: number }[];
} {
  let remaining = Math.max(0, Math.floor(qty));
  let totalMAD = 0;
  const breakdown: {
    key: BundleKey;
    qty: number;
    priceMAD: number;
    count: number;
  }[] = [];
  for (const tier of CANDLE_BUNDLES) {
    if (remaining <= 0) break;
    const count = Math.floor(remaining / tier.qty);
    if (count > 0) {
      totalMAD += count * tier.priceMAD;
      remaining -= count * tier.qty;
      breakdown.push({
        key: tier.key,
        qty: tier.qty,
        priceMAD: tier.priceMAD,
        count,
      });
    }
  }
  return { totalMAD, breakdown };
}

/**
 * Compute the candle subtotal: the minimum of regular price and the best
 * bundle price. The bundle should never penalise a customer whose candles
 * happen to be priced below the tier price.
 */
export function candleSubtotalWithBundle(
  candleQty: number,
  candleRegularSubtotalMAD: number,
): { subtotalMAD: number; savedMAD: number; bundleApplied: boolean } {
  if (candleQty <= 0) {
    return { subtotalMAD: 0, savedMAD: 0, bundleApplied: false };
  }
  const { totalMAD: bundleTotal } = bundlePriceFor(candleQty);
  if (bundleTotal < candleRegularSubtotalMAD) {
    return {
      subtotalMAD: bundleTotal,
      savedMAD: candleRegularSubtotalMAD - bundleTotal,
      bundleApplied: true,
    };
  }
  return {
    subtotalMAD: candleRegularSubtotalMAD,
    savedMAD: 0,
    bundleApplied: false,
  };
}

/** Delivery fee given a candle quantity; free at the Trio threshold. */
export function deliveryFeeFor(candleQty: number): number {
  return candleQty >= FREE_DELIVERY_CANDLES ? 0 : DELIVERY_FEE_MAD;
}

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
