"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart, cartSubtotal } from "@/lib/cart";
import { formatDH } from "@/lib/format";
import { useT } from "@/components/LanguageProvider";

export default function CartPage() {
  const { t } = useT();
  const c = t.cart;
  const { lines, remove, setQty } = useCart();
  const subtotal = cartSubtotal(lines);

  return (
    <div className="mx-auto max-w-[1200px] px-5 pb-24 pt-32 sm:px-6 md:px-12 md:pt-44">
      <p className="eyebrow eyebrow-tick">{c.eyebrow}</p>
      <h1 className="mt-5 font-display text-[clamp(2.2rem,6vw,5rem)] font-light leading-[0.95]">
        {c.title}
      </h1>

      {lines.length === 0 ? (
        <div className="mt-16 border-t border-line py-24 text-center md:mt-20">
          <p className="font-display text-3xl italic text-taupe">{c.empty}</p>
          <Link href="/shop" className="btn mt-10">
            {c.discover}
          </Link>
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-12 md:mt-14 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
          <ul className="divide-y divide-line border-y border-line">
            {lines.map((l) => (
              <li key={l.productId} className="flex gap-4 py-6 sm:gap-6 sm:py-7">
                <div className="relative h-32 w-24 shrink-0 overflow-hidden rounded-[0.9rem] bg-ivory-2 sm:h-36 sm:w-28">
                  {l.image && (
                    <Image
                      src={l.image}
                      alt={l.name}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      href={`/shop/${l.slug}`}
                      className="font-display text-xl sm:text-2xl"
                    >
                      {l.name}
                    </Link>
                    <button
                      onClick={() => remove(l.productId)}
                      className="eyebrow link-underline !text-[0.62rem] text-taupe"
                    >
                      {c.remove}
                    </button>
                  </div>
                  <div className="flex items-end justify-between">
                    <div className="flex items-center border border-line">
                      <button
                        className="px-3 py-2 text-taupe hover:text-ink sm:px-4"
                        onClick={() => setQty(l.productId, l.qty - 1)}
                        aria-label={t.product.decrease}
                      >
                        −
                      </button>
                      <span className="w-9 text-center text-sm">{l.qty}</span>
                      <button
                        className="px-3 py-2 text-taupe hover:text-ink sm:px-4"
                        onClick={() => setQty(l.productId, l.qty + 1)}
                        aria-label={t.product.increase}
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

          <aside className="h-fit border border-line p-7 sm:p-9 lg:sticky lg:top-28">
            <h2 className="font-display text-2xl">{c.summary}</h2>
            <div className="mt-7 space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-taupe">{c.subtotal}</span>
                <span>{formatDH(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-taupe">{c.delivery}</span>
                <span className="text-taupe">{c.deliveryValue}</span>
              </div>
              <div className="flex justify-between border-t border-line pt-4 font-display text-xl">
                <span>{c.total}</span>
                <span className="text-molten">{formatDH(subtotal)}</span>
              </div>
            </div>
            <Link href="/checkout" className="btn mt-8 w-full">
              {c.proceed}
            </Link>
            <p className="mt-4 text-center text-xs text-taupe">{c.codNote}</p>
          </aside>
        </div>
      )}
    </div>
  );
}
