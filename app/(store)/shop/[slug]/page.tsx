import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, getRelated } from "@/lib/products";
import { formatDH, splitNotes } from "@/lib/format";
import { AddToCart } from "@/components/AddToCart";
import { ProductCard } from "@/components/ProductCard";
import { Reveal, RevealImage } from "@/components/Reveal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return { title: "Not found" };
  return { title: p.name, description: p.description };
}

const CARE = [
  "Trim the wick to 5–6 mm before every burn.",
  "First burn: let the melt pool reach the edge — about one hour.",
  "Keep away from drafts; never burn for more than four hours.",
  "Stop burning when 10 mm of wax remains.",
];

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || product.status !== "ACTIVE") notFound();

  const notes = splitNotes(product.scentNotes);
  const related = await getRelated(slug, product.category, 3);

  return (
    <div className="pt-28 md:pt-32">
      <div className="mx-auto max-w-[1500px] px-6 md:px-12">
        <Link
          href="/shop"
          className="eyebrow link-underline !text-[0.64rem] text-taupe"
        >
          ← Back to collection
        </Link>

        <div className="mt-8 grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-20">
          {/* Gallery */}
          <div className="flex flex-col gap-4">
            <RevealImage className="relative aspect-[4/5] w-full overflow-hidden bg-ivory-2">
              {product.images[0] && (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width:768px) 100vw, 50vw"
                  className="object-cover"
                />
              )}
            </RevealImage>
            {product.images.length > 1 && (
              <div className="grid grid-cols-2 gap-4">
                {product.images.slice(1, 3).map((src, i) => (
                  <div
                    key={i}
                    className="relative aspect-square overflow-hidden bg-ivory-2"
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      sizes="25vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Detail */}
          <div className="md:py-8">
            <Reveal>
              <p className="eyebrow">
                {product.category === "CANDLE"
                  ? "Soy candle"
                  : product.category === "DIFFUSER"
                    ? "Reed diffuser"
                    : "Accessory"}
              </p>
              <h1 className="mt-5 font-display text-[clamp(2.6rem,6vw,5rem)] font-light leading-[0.95]">
                {product.name}
              </h1>
              <p className="mt-6 text-2xl font-light tracking-wide text-ink-soft">
                {formatDH(product.priceMAD)}
              </p>

              <p className="mt-9 max-w-md leading-relaxed text-ink-soft">
                {product.description}
              </p>

              {notes.length > 0 && notes[0] !== "—" && (
                <div className="mt-9">
                  <p className="eyebrow">Scent notes</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {notes.map((n) => (
                      <span
                        key={n}
                        className="border border-line px-4 py-2 text-xs tracking-wide text-ink-soft"
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <AddToCart product={product} />

              <dl className="mt-12 grid grid-cols-2 gap-y-5 border-t border-line pt-8 text-sm">
                {product.weightG && (
                  <>
                    <dt className="text-taupe">Fill weight</dt>
                    <dd className="text-right">{product.weightG} g</dd>
                  </>
                )}
                {product.burnTime && (
                  <>
                    <dt className="text-taupe">Burn time</dt>
                    <dd className="text-right">{product.burnTime}</dd>
                  </>
                )}
                <dt className="text-taupe">Wax</dt>
                <dd className="text-right">100% soy</dd>
                <dt className="text-taupe">Made</dt>
                <dd className="text-right">By hand, small batch</dd>
              </dl>
            </Reveal>
          </div>
        </div>

        {/* Care guidance */}
        {product.category === "CANDLE" && (
          <section className="mt-28 grid grid-cols-1 gap-12 border-t border-line pt-16 md:grid-cols-[0.4fr_1fr] md:gap-20">
            <Reveal>
              <h2 className="font-display text-3xl font-light">
                Burn it well
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <ol className="grid grid-cols-1 gap-px overflow-hidden border border-line bg-line sm:grid-cols-2">
                {CARE.map((c, i) => (
                  <li key={i} className="bg-ivory p-8">
                    <span className="font-display text-4xl text-line">
                      0{i + 1}
                    </span>
                    <p className="mt-5 text-sm leading-relaxed text-ink-soft">
                      {c}
                    </p>
                  </li>
                ))}
              </ol>
            </Reveal>
          </section>
        )}

        {/* Related */}
        {related.length > 0 && (
          <section className="mb-8 mt-28">
            <Reveal>
              <p className="eyebrow">You may also like</p>
            </Reveal>
            <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
