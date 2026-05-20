import Link from "next/link";
import { Hero } from "@/components/Hero";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { Flame } from "@/components/Flame";
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
          <Reveal className="relative flex min-h-[52vh] items-center justify-center px-6 py-20 md:min-h-[92vh] md:py-0">
            <span
              className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(240,180,85,0.18), rgba(217,122,50,0.06) 50%, transparent 75%)",
                filter: "blur(20px)",
              }}
              aria-hidden
            />
            <div className="relative flex flex-col items-center">
              <Flame className="h-[clamp(170px,20vw,280px)] w-[clamp(100px,12vw,160px)]" />
              <div className="mt-1 h-48 w-28 rounded-[3px] bg-gradient-to-b from-ivory/85 via-ivory/70 to-ivory/40 shadow-[0_0_70px_-10px_rgba(240,180,85,0.5)] lg:h-60 lg:w-32">
                <div className="mx-auto mt-3 h-px w-12 bg-noir/20" />
              </div>
              <div className="mt-[-6px] h-6 w-40 rounded-[50%] bg-gold-soft/10 blur-md" />
            </div>
          </Reveal>
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
