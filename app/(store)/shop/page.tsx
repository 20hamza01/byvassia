import { Suspense } from "react";
import type { Metadata } from "next";
import { ProductCard } from "@/components/ProductCard";
import { ShopFilters } from "@/components/ShopFilters";
import { Reveal } from "@/components/Reveal";
import { getActiveProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop",
  description: "The full collection of VASSIA hand-poured soy candles & scents.",
};

export const dynamic = "force-dynamic";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string }>;
}) {
  const { category = "ALL", sort = "featured" } = await searchParams;
  let products = await getActiveProducts(category);

  if (sort === "price-asc") products.sort((a, b) => a.priceMAD - b.priceMAD);
  else if (sort === "price-desc")
    products.sort((a, b) => b.priceMAD - a.priceMAD);
  else if (sort === "name")
    products.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="mx-auto max-w-[1500px] px-6 pb-24 pt-36 md:px-12 md:pt-44">
      <header className="mb-14">
        <Reveal>
          <p className="eyebrow">The collection</p>
          <h1 className="mt-5 font-display text-[clamp(3rem,7vw,6rem)] font-light leading-[0.92]">
            Every scent,
            <span className="italic text-taupe"> in one place.</span>
          </h1>
        </Reveal>
      </header>

      <Suspense fallback={<div className="h-12 border-b border-line" />}>
        <ShopFilters />
      </Suspense>

      {products.length === 0 ? (
        <p className="py-24 text-center font-display text-3xl italic text-taupe">
          Nothing here yet.
        </p>
      ) : (
        <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
