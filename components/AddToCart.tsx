"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";
import type { ProductDTO } from "@/lib/types";

export function AddToCart({ product }: { product: ProductDTO }) {
  const add = useCart((s) => s.add);
  const [qty, setQty] = useState(1);
  const soldOut = product.stock <= 0;

  return (
    <div className="mt-10">
      <div className="flex items-stretch gap-4">
        <div className="flex items-center border border-ink">
          <button
            className="px-4 py-3 text-taupe hover:text-ink"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
            disabled={soldOut}
          >
            −
          </button>
          <span className="w-10 text-center text-sm">{qty}</span>
          <button
            className="px-4 py-3 text-taupe hover:text-ink"
            onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
            aria-label="Increase quantity"
            disabled={soldOut}
          >
            +
          </button>
        </div>

        <button
          className="btn flex-1"
          disabled={soldOut}
          onClick={() =>
            add(
              {
                productId: product.id,
                slug: product.slug,
                name: product.name,
                priceMAD: product.priceMAD,
                image: product.images[0] ?? "",
                stock: product.stock,
              },
              qty,
            )
          }
        >
          {soldOut ? "Sold out" : "Add to bag"}
        </button>
      </div>
      {!soldOut && product.stock <= 6 && (
        <p className="mt-4 text-xs tracking-wide text-taupe">
          Only {product.stock} left — small batch.
        </p>
      )}
    </div>
  );
}
