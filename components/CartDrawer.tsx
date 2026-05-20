"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useCart, cartPricing } from "@/lib/cart";
import { formatDH, FREE_DELIVERY_CANDLES } from "@/lib/format";
import { useT } from "./LanguageProvider";

const EASE = [0.22, 1, 0.36, 1] as const;

export function CartDrawer() {
  const { t } = useT();
  const { lines, isOpen, close, remove, setQty } = useCart();
  const pricing = cartPricing(lines);
  const candlesUntilFreeDelivery = Math.max(
    0,
    FREE_DELIVERY_CANDLES - pricing.candleQty,
  );

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
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-[440px] flex-col border-l border-line bg-ivory shadow-[-30px_0_60px_-30px_rgba(24,19,13,0.4)]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.6, ease: EASE }}
            aria-label="Shopping bag"
          >
            <div className="flex items-center justify-between border-b border-line px-7 py-6">
              <h2 className="font-display text-2xl">{t.drawer.title}</h2>
              <button
                onClick={close}
                className="eyebrow link-underline !text-[0.66rem]"
              >
                {t.drawer.close}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-7">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <p className="font-display text-3xl italic text-taupe">
                    {t.drawer.empty}
                  </p>
                  <Link
                    href="/shop"
                    onClick={close}
                    className="btn mt-8"
                  >
                    {t.drawer.discover}
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
                            aria-label={t.drawer.remove}
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
              <div className="border-t border-line bg-ivory-2/50 px-7 py-6">
                {pricing.bundleApplied && (
                  <div className="-mx-1 mb-4 flex items-center justify-between rounded-md border border-ember/30 bg-ember/[0.07] px-3 py-2 text-[0.66rem] uppercase tracking-[0.18em] text-ember">
                    <span>{t.drawer.bundleApplied}</span>
                    <span className="font-semibold tracking-normal">
                      − {formatDH(pricing.bundleSavingsMAD)}
                    </span>
                  </div>
                )}
                <dl className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-ink-soft">{t.drawer.subtotal}</dt>
                    <dd className="text-ink">{formatDH(pricing.subtotalMAD)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink-soft">{t.drawer.delivery}</dt>
                    <dd
                      className={
                        pricing.freeDelivery
                          ? "font-semibold tracking-[0.14em] text-ember"
                          : "text-ink"
                      }
                    >
                      {pricing.freeDelivery
                        ? t.drawer.deliveryFree
                        : formatDH(pricing.deliveryMAD)}
                    </dd>
                  </div>
                </dl>
                <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
                  <span className="eyebrow eyebrow-tick !text-ink/85">
                    {t.drawer.total}
                  </span>
                  <span className="font-display text-2xl text-molten">
                    {formatDH(pricing.totalMAD)}
                  </span>
                </div>
                {candlesUntilFreeDelivery > 0 && pricing.candleQty > 0 && (
                  <p className="mt-3 text-xs leading-relaxed text-ember">
                    {t.drawer.addOneForFree(candlesUntilFreeDelivery)}
                  </p>
                )}
                <p className="mt-3 text-xs text-ink-soft">
                  {t.drawer.deliveryNote}
                </p>
                <Link
                  href="/checkout"
                  onClick={close}
                  className="btn mt-5 w-full"
                >
                  {t.drawer.checkout}
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
