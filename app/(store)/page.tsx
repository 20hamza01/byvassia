import Link from "next/link";
import Image from "next/image";
import { Hero } from "@/components/Hero";
import { ProductCard } from "@/components/ProductCard";
import { Reveal, RevealImage } from "@/components/Reveal";
import { getFeatured } from "@/lib/products";
import { getLocale } from "@/lib/locale-server";
import { getDictionary } from "@/lib/i18n";

// Featured products are admin-managed and live in Neon — render per request
// rather than prerendering at build time.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const t = getDictionary(await getLocale());
  const featured = await getFeatured(3);

  return (
    <>
      <Hero />

      {/* Announcement marquee */}
      <div className="overflow-hidden border-y border-line bg-ivory-2 py-3">
        <div className="marquee-track">
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k} className="flex">
              {t.marquee.map((text) => (
                <span
                  key={text}
                  className="mx-6 inline-flex items-center gap-6 text-[0.6rem] uppercase tracking-[0.28em] text-ink/55 sm:mx-7 sm:gap-7 sm:text-[0.62rem] sm:tracking-[0.3em]"
                >
                  {text}
                  <span className="text-ember">✦</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* Featured */}
      <section className="mx-auto max-w-[1500px] px-5 py-24 sm:px-6 md:px-12 md:py-40">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <p className="eyebrow eyebrow-tick">{t.home.signaturesEyebrow}</p>
            <h2 className="mt-6 max-w-2xl font-display text-[clamp(2.2rem,5.5vw,4.8rem)] font-light leading-[0.95]">
              {t.home.signaturesTitleA}
              <span className="italic text-molten">
                {" "}
                {t.home.signaturesTitleB}
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Link
              href="/shop"
              className="eyebrow link-underline !gap-0 !text-[0.66rem] text-ink"
            >
              {t.home.viewAll} →
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-x-7 gap-y-12 sm:grid-cols-2 sm:gap-y-16 lg:grid-cols-3">
          {featured.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
          {featured.length === 0 && (
            <p className="text-taupe">{t.home.noProducts}</p>
          )}
        </div>
      </section>

      {/* Brand story — editorial split */}
      <section className="relative overflow-hidden bg-noir text-ivory">
        <div
          className="pointer-events-none absolute -left-[10%] top-1/3 h-[40vw] w-[40vw] candle-glow"
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-[1500px] grid-cols-1 items-stretch md:grid-cols-2">
          <RevealImage className="relative min-h-[52vh] md:min-h-[92vh]">
            <Image
              src="https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=1200&q=85"
              alt="Pouring soy wax by hand in the VASSIA atelier"
              fill
              sizes="(max-width:768px) 100vw, 50vw"
              className="object-cover opacity-90"
            />
            <span className="absolute inset-0 bg-gradient-to-r from-transparent to-noir/60" />
          </RevealImage>
          <div className="flex items-center px-6 py-20 sm:px-8 md:px-20 md:py-24">
            <Reveal>
              <p className="eyebrow eyebrow-tick !text-gold-soft/60">
                {t.home.atelierEyebrow}
              </p>
              <h2 className="mt-7 font-display text-[clamp(2rem,5vw,4.4rem)] font-light leading-[1.02]">
                {t.home.atelierTitleA}
                <br />
                <span className="italic text-molten">
                  {t.home.atelierTitleB}
                </span>
              </h2>
              <p className="mt-8 max-w-md leading-relaxed text-ivory/65">
                {t.home.atelierBody}
              </p>
              <Link
                href="/about"
                className="eyebrow link-underline mt-10 inline-block !gap-0 !text-[0.66rem] !text-ivory"
              >
                {t.home.atelierLink} →
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Scent families */}
      <section className="mx-auto max-w-[1500px] px-5 py-24 sm:px-6 md:px-12 md:py-40">
        <Reveal>
          <p className="eyebrow eyebrow-tick">{t.home.familiesEyebrow}</p>
          <h2 className="mt-6 font-display text-[clamp(2rem,5.5vw,4.8rem)] font-light leading-[0.95]">
            {t.home.familiesTitleA}{" "}
            <span className="italic text-molten">
              {t.home.familiesTitleB}
            </span>
          </h2>
        </Reveal>
        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {t.home.families.map((f, i) => (
            <Reveal
              key={f.t}
              delay={i * 0.06}
              className="group relative bg-ivory p-8 transition-colors duration-500 hover:bg-noir md:p-10"
            >
              <span className="font-display text-5xl text-line transition-colors duration-500 group-hover:text-ember">
                0{i + 1}
              </span>
              <h3 className="mt-10 font-display text-2xl transition-colors duration-500 group-hover:text-ivory">
                {f.t}
              </h3>
              <p className="mt-2 text-xs tracking-wide text-taupe transition-colors duration-500 group-hover:text-ivory/55">
                {f.d}
              </p>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
