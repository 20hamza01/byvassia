"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { ProductDTO } from "@/lib/types";
import { formatDH, splitNotes } from "@/lib/format";

const EASE = [0.22, 1, 0.36, 1] as const;

export function ProductCard({
  product,
  index = 0,
}: {
  product: ProductDTO;
  index?: number;
}) {
  const notes = splitNotes(product.scentNotes).slice(0, 3).join(" · ");
  const soldOut = product.stock <= 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, ease: EASE, delay: (index % 3) * 0.08 }}
      className="group"
    >
      <Link href={`/shop/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-ivory-2">
          {product.images[0] && (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width:768px) 50vw, 33vw"
              className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
            />
          )}
          {product.images[1] && (
            <Image
              src={product.images[1]}
              alt=""
              fill
              sizes="(max-width:768px) 50vw, 33vw"
              className="object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            />
          )}
          <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/15 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
          {product.featured && !soldOut && (
            <span className="eyebrow absolute left-4 top-4 !text-[0.6rem] !text-ink/70">
              Signature
            </span>
          )}
          {soldOut && (
            <span className="eyebrow absolute left-4 top-4 !text-[0.6rem]">
              Sold out
            </span>
          )}
        </div>

        <div className="mt-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-2xl leading-none">
              {product.name}
            </h3>
            <p className="mt-2 text-xs tracking-wide text-taupe">{notes}</p>
          </div>
          <span className="mt-1 shrink-0 text-sm tracking-wide">
            {formatDH(product.priceMAD)}
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
