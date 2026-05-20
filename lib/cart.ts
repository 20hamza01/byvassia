"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine } from "./types";
import {
  candleSubtotalWithBundle,
  deliveryFeeFor,
  GIFT_FEE_MAD,
} from "./format";

type CartState = {
  lines: CartLine[];
  isOpen: boolean;
  add: (line: Omit<CartLine, "qty">, qty?: number) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      isOpen: false,
      add: (line, qty = 1) =>
        set((state) => {
          const existing = state.lines.find(
            (l) => l.productId === line.productId,
          );
          if (existing) {
            return {
              isOpen: true,
              lines: state.lines.map((l) =>
                l.productId === line.productId
                  ? { ...l, qty: Math.min(l.stock, l.qty + qty) }
                  : l,
              ),
            };
          }
          return {
            isOpen: true,
            lines: [...state.lines, { ...line, qty: Math.min(line.stock, qty) }],
          };
        }),
      remove: (productId) =>
        set((state) => ({
          lines: state.lines.filter((l) => l.productId !== productId),
        })),
      setQty: (productId, qty) =>
        set((state) => ({
          lines: state.lines
            .map((l) =>
              l.productId === productId
                ? { ...l, qty: Math.max(1, Math.min(l.stock, qty)) }
                : l,
            )
            .filter((l) => l.qty > 0),
        })),
      clear: () => set({ lines: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
    }),
    { name: "vassia-cart", partialize: (s) => ({ lines: s.lines }) },
  ),
);

export function cartCount(lines: CartLine[]): number {
  return lines.reduce((n, l) => n + l.qty, 0);
}

export function cartSubtotal(lines: CartLine[]): number {
  return lines.reduce((n, l) => n + l.qty * l.priceMAD, 0);
}

/** A candle for bundle purposes = anything that isn't an explicit accessory/diffuser. */
function isCandleLine(l: CartLine): boolean {
  const c = (l.category ?? "CANDLE").toUpperCase();
  return c === "CANDLE";
}

/**
 * Full pricing breakdown for the current cart, mirroring the server-side
 * recomputation in /api/orders. Used by every checkout-adjacent view so the
 * customer sees the same numbers the server will compute.
 */
export type CartPricing = {
  candleQty: number;
  /** Sum of catalogue prices for candle lines (pre-bundle). */
  candleRegularMAD: number;
  /** Candle subtotal after bundle pricing. */
  candleSubtotalMAD: number;
  /** Saved vs the catalogue prices, in MAD. */
  bundleSavingsMAD: number;
  bundleApplied: boolean;
  /** Sum of non-candle items (diffusers, accessories). */
  otherSubtotalMAD: number;
  /** Pre-delivery, pre-gift cart subtotal. */
  subtotalMAD: number;
  deliveryMAD: number;
  freeDelivery: boolean;
  giftFeeMAD: number;
  totalMAD: number;
};

export function cartPricing(
  lines: CartLine[],
  opts: { isGift?: boolean } = {},
): CartPricing {
  let candleQty = 0;
  let candleRegularMAD = 0;
  let otherSubtotalMAD = 0;
  for (const l of lines) {
    const lineTotal = l.qty * l.priceMAD;
    if (isCandleLine(l)) {
      candleQty += l.qty;
      candleRegularMAD += lineTotal;
    } else {
      otherSubtotalMAD += lineTotal;
    }
  }
  const {
    subtotalMAD: candleSubtotalMAD,
    savedMAD: bundleSavingsMAD,
    bundleApplied,
  } = candleSubtotalWithBundle(candleQty, candleRegularMAD);
  const subtotalMAD = candleSubtotalMAD + otherSubtotalMAD;
  const deliveryMAD = deliveryFeeFor(candleQty);
  const giftFeeMAD = opts.isGift ? GIFT_FEE_MAD : 0;
  return {
    candleQty,
    candleRegularMAD,
    candleSubtotalMAD,
    bundleSavingsMAD,
    bundleApplied,
    otherSubtotalMAD,
    subtotalMAD,
    deliveryMAD,
    freeDelivery: deliveryMAD === 0 && candleQty > 0,
    giftFeeMAD,
    totalMAD: subtotalMAD + deliveryMAD + giftFeeMAD,
  };
}
