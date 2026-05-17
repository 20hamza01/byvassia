"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { ProductDTO } from "@/lib/types";
import { formatDH, splitNotes } from "@/lib/format";
import { useT } from "./LanguageProvider";

const EASE = [0.22, 1, 0.36, 1] as const;

export function ProductCard({
  product,
  index = 0,
}: {
  product: ProductDTO;
  index?: number;
}) {
  const { t } = useT();
  const notes = splitNotes(product.scentNotes).slice(0, 3).join(" · ");
  const soldOut = product.stock <= 0;
  const lowStock = !soldOut && product.stock <= 6;

  const badge = soldOut
    ? t.card.soldOut
    : product.featured
      ? t.card.bestseller
      : lowStock
        ? t.card.limited
        : null;

  const meta = product.weightG ? `${product.weightG}G` : t.card.soy;

  return (
    <motion.article
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, ease: EASE, delay: (index % 3) * 0.09 }}
      className="group"
    >
      <Link href={`/shop/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem] border border-line/70 bg-ivory-2 transition-colors duration-500 group-hover:border-line">
          {product.images[0] && (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width:768px) 50vw, 33vw"
              className="object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
            />
          )}
          {product.images[1] && (
            <Image
              src={product.images[1]}
              alt=""
              fill
              sizes="(max-width:768px) 50vw, 33vw"
              className="object-cover opacity-0 transition-opacity duration-[900ms] group-hover:opacity-100"
            />
          )}

          {/* Badge pill */}
          {badge && (
            <span className="absolute left-4 top-4 rounded-full border border-line bg-ivory/85 px-3.5 py-1.5 text-[0.56rem] uppercase tracking-[0.22em] text-ink/70 backdrop-blur-sm">
              {badge}
            </span>
          )}

          {/* N° numeral */}
          <span className="absolute right-5 top-4 font-display text-base italic text-ink/45">
            N<span className="align-super text-[0.6em]">o</span>
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <div className="mt-5 px-1">
          <p className="flex items-center gap-2.5 text-[0.58rem] uppercase tracking-[0.26em] text-taupe">
            <span className="inline-block h-1.5 w-1.5 bg-ember" aria-hidden />
            {meta}
          </p>
          <h3 className="mt-2.5 font-display text-[1.7rem] uppercase leading-none tracking-[0.02em] transition-colors duration-300 group-hover:text-ember">
            {product.name}
          </h3>
          {notes && (
            <p className="mt-2 font-display text-base italic text-taupe">
              {notes}
            </p>
          )}

          <div className="mt-5 flex items-end justify-between">
            <span className="text-sm tracking-wide text-ink">
              {formatDH(product.priceMAD)}
            </span>
            <span className="link-underline text-[0.58rem] uppercase tracking-[0.26em] text-ink/70">
              {t.card.discover}
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
