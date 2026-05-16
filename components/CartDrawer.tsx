"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useCart, cartSubtotal } from "@/lib/cart";
import { formatDH } from "@/lib/format";

const EASE = [0.22, 1, 0.36, 1] as const;

export function CartDrawer() {
  const { lines, isOpen, close, remove, setQty } = useCart();
  const subtotal = cartSubtotal(lines);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-ink/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={close}
          />
          <motion.aside
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-[440px] flex-col bg-ivory"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.6, ease: EASE }}
            aria-label="Shopping bag"
          >
            <div className="flex items-center justify-between border-b border-line px-7 py-6">
              <h2 className="font-display text-2xl">Your Bag</h2>
              <button
                onClick={close}
                className="eyebrow link-underline !text-[0.66rem]"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-7">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <p className="font-display text-3xl italic text-taupe">
                    Your bag is empty
                  </p>
                  <Link
                    href="/shop"
                    onClick={close}
                    className="btn mt-8"
                  >
                    Discover the collection
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-line">
                  {lines.map((l) => (
                    <li key={l.productId} className="flex gap-4 py-6">
                      <div className="relative h-28 w-20 shrink-0 overflow-hidden bg-ivory-2">
                        {l.image && (
                          <Image
                            src={l.image}
                            alt={l.name}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex justify-between gap-3">
                          <Link
                            href={`/shop/${l.slug}`}
                            onClick={close}
                            className="font-display text-xl leading-tight"
                          >
                            {l.name}
                          </Link>
                          <button
                            onClick={() => remove(l.productId)}
                            aria-label="Remove"
                            className="text-taupe transition-colors hover:text-ink"
                          >
                            ×
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center border border-line">
                            <button
                              className="px-3 py-1 text-taupe hover:text-ink"
                              onClick={() => setQty(l.productId, l.qty - 1)}
                              aria-label="Decrease"
                            >
                              −
                            </button>
                            <span className="w-7 text-center text-sm">
                              {l.qty}
                            </span>
                            <button
                              className="px-3 py-1 text-taupe hover:text-ink"
                              onClick={() => setQty(l.productId, l.qty + 1)}
                              aria-label="Increase"
                            >
                              +
                            </button>
                          </div>
                          <span className="text-sm tracking-wide">
                            {formatDH(l.priceMAD * l.qty)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <div className="border-t border-line px-7 py-7">
                <div className="flex items-center justify-between">
                  <span className="eyebrow">Subtotal</span>
                  <span className="font-display text-2xl">
                    {formatDH(subtotal)}
                  </span>
                </div>
                <p className="mt-2 text-xs text-taupe">
                  Delivery confirmed with you by WhatsApp.
                </p>
                <Link
                  href="/checkout"
                  onClick={close}
                  className="btn mt-6 w-full"
                >
                  Checkout
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
