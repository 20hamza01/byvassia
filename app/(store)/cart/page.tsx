"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart, cartSubtotal } from "@/lib/cart";
import { formatDH } from "@/lib/format";

export default function CartPage() {
  const { lines, remove, setQty } = useCart();
  const subtotal = cartSubtotal(lines);

  return (
    <div className="mx-auto max-w-[1200px] px-6 pb-24 pt-36 md:px-12 md:pt-44">
      <p className="eyebrow">Your bag</p>
      <h1 className="mt-5 font-display text-[clamp(2.6rem,6vw,5rem)] font-light leading-[0.95]">
        Review &amp; checkout
      </h1>

      {lines.length === 0 ? (
        <div className="mt-20 border-t border-line py-24 text-center">
          <p className="font-display text-3xl italic text-taupe">
            Your bag is empty.
          </p>
          <Link href="/shop" className="btn mt-10">
            Discover the collection
          </Link>
        </div>
      ) : (
        <div className="mt-14 grid grid-cols-1 gap-16 lg:grid-cols-[1.6fr_1fr]">
          <ul className="divide-y divide-line border-y border-line">
            {lines.map((l) => (
              <li key={l.productId} className="flex gap-6 py-7">
                <div className="relative h-36 w-28 shrink-0 overflow-hidden bg-ivory-2">
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
                  <div className="flex items-start justify-between gap-4">
                    <Link
                      href={`/shop/${l.slug}`}
                      className="font-display text-2xl"
                    >
                      {l.name}
                    </Link>
                    <button
                      onClick={() => remove(l.productId)}
                      className="eyebrow link-underline !text-[0.62rem] text-taupe"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="flex items-end justify-between">
                    <div className="flex items-center border border-line">
                      <button
                        className="px-4 py-2 text-taupe hover:text-ink"
                        onClick={() => setQty(l.productId, l.qty - 1)}
                        aria-label="Decrease"
                      >
                        −
                      </button>
                      <span className="w-9 text-center text-sm">{l.qty}</span>
                      <button
                        className="px-4 py-2 text-taupe hover:text-ink"
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

          <aside className="h-fit border border-line p-9">
            <h2 className="font-display text-2xl">Summary</h2>
            <div className="mt-7 space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-taupe">Subtotal</span>
                <span>{formatDH(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-taupe">Delivery</span>
                <span className="text-taupe">Confirmed by WhatsApp</span>
              </div>
              <div className="flex justify-between border-t border-line pt-4 font-display text-xl">
                <span>Total</span>
                <span>{formatDH(subtotal)}</span>
              </div>
            </div>
            <Link href="/checkout" className="btn mt-8 w-full">
              Proceed to checkout
            </Link>
            <p className="mt-4 text-center text-xs text-taupe">
              Pay cash on delivery · No card required
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}
