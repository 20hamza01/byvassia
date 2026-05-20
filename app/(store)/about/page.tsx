import Link from "next/link";
import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { getLocale } from "@/lib/locale-server";
import { getDictionary } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "The Atelier",
  description:
    "How VASSIA candles are made — slow soy pours, hand marbling, small batches.",
};

export default async function AboutPage() {
  const t = getDictionary(await getLocale());
  const a = t.about;

  return (
    <div className="pt-28">
      {/* Intro */}
      <section className="mx-auto max-w-[1200px] px-5 py-20 text-center sm:px-6 md:px-12 md:py-36">
        <Reveal>
          <p className="eyebrow eyebrow-tick justify-center">{a.eyebrow}</p>
          <h1 className="mx-auto mt-7 max-w-4xl font-display text-[clamp(2.2rem,7.5vw,6.2rem)] font-light leading-[1]">
            {a.titleA}
            <span className="italic text-molten"> {a.titleB}</span>
          </h1>
          <p className="mx-auto mt-10 max-w-xl leading-relaxed text-ink-soft">
            {a.intro}
          </p>
        </Reveal>
      </section>

      {/* Process */}
      <section className="mx-auto max-w-[1500px] px-5 py-20 sm:px-6 md:px-12 md:py-40">
        <Reveal>
          <p className="eyebrow eyebrow-tick">{a.processEyebrow}</p>
          <h2 className="mt-6 max-w-2xl font-display text-[clamp(2rem,5vw,4.2rem)] font-light leading-[1]">
            {a.processTitleA}{" "}
            <span className="italic text-molten">{a.processTitleB}</span>
          </h2>
        </Reveal>
        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {a.steps.map((s, i) => (
            <Reveal
              key={s.t}
              delay={i * 0.07}
              className="group bg-ivory p-8 transition-colors duration-500 hover:bg-noir md:p-10"
            >
              <span className="font-display text-5xl text-line transition-colors duration-500 group-hover:text-ember">
                0{i + 1}
              </span>
              <h3 className="mt-10 font-display text-2xl transition-colors duration-500 group-hover:text-ivory md:mt-12">
                {s.t}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft transition-colors duration-500 group-hover:text-ivory/60">
                {s.d}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Statement */}
      <section className="relative overflow-hidden bg-noir text-ivory">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[50vw] w-[50vw] -translate-x-1/2 -translate-y-1/2 candle-glow"
          aria-hidden
        />
        <div className="relative mx-auto max-w-[1000px] px-5 py-24 text-center sm:px-6 md:py-44">
          <Reveal>
            <span className="font-display text-6xl text-molten">“</span>
            <p className="mt-2 font-display text-[clamp(1.7rem,4.2vw,3.6rem)] font-light italic leading-[1.25]">
              {a.quote}
            </p>
            <p className="eyebrow eyebrow-tick mt-12 justify-center !text-gold-soft/55">
              {a.quoteBy}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[900px] px-5 py-24 text-center sm:px-6 md:py-40">
        <Reveal>
          <h2 className="font-display text-[clamp(2rem,5.5vw,3.8rem)] font-light">
            {a.ctaTitleA}{" "}
            <span className="italic text-molten">{a.ctaTitleB}</span>
          </h2>
          <Link href="/shop" className="btn mt-10">
            {a.ctaButton}
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
