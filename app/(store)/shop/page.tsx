import type { Metadata } from "next";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { BundleOffersBanner } from "@/components/BundleOffers";
import { getActiveProducts } from "@/lib/products";
import { getLocale } from "@/lib/locale-server";
import { getDictionary } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "The Candles",
  description: "The full collection of VASSIA hand-poured soy candles.",
};

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const t = getDictionary(await getLocale());
  const products = await getActiveProducts("CANDLE");

  return (
    <div className="pt-28 md:pt-36">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-6 md:px-12">
        <BundleOffersBanner />
      </div>

      <div className="mx-auto max-w-[1500px] px-5 pb-24 pt-14 sm:px-6 md:px-12 md:pt-20">
      <header className="mb-14 text-center md:mb-16">
        <Reveal>
          <p className="eyebrow eyebrow-tick justify-center !text-[0.62rem]">
            {t.shop.eyebrow}
          </p>
          <h1 className="mt-7 font-display text-[clamp(3rem,12vw,9rem)] font-light leading-[0.86] tracking-[-0.02em]">
            {t.shop.titleA} <span className="text-molten">{t.shop.titleB}</span>
          </h1>
          <p className="mx-auto mt-7 max-w-md font-display text-lg italic leading-relaxed text-ink-soft">
            {t.shop.subtitle}
          </p>
        </Reveal>
      </header>

      {products.length === 0 ? (
        <p className="border-t border-line py-24 text-center font-display text-3xl italic text-taupe">
          {t.shop.empty}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-x-7 gap-y-12 border-t border-line pt-14 sm:grid-cols-2 sm:gap-y-14 lg:grid-cols-3">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
