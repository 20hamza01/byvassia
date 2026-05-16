"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine } from "./types";

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
