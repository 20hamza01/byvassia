import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Reveal, RevealImage } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "The Atelier",
  description:
    "How VASSIA candles are made — slow soy pours, hand marbling, small batches.",
};

const STEPS = [
  {
    n: "01",
    t: "Slow melt",
    d: "Soy wax is melted gently and stirred — never whipped — so no air is folded in.",
  },
  {
    n: "02",
    t: "Bound at warmth",
    d: "We let the wax cool to the exact temperature where fragrance binds best before scenting.",
  },
  {
    n: "03",
    t: "Poured into warmed glass",
    d: "Jars are pre-warmed so the surface sets smooth — no sinkholes, no wet spots.",
  },
  {
    n: "04",
    t: "Marbled by hand",
    d: "After a day of curing, each candle is marbled individually. No two are the same.",
  },
];

export default function AboutPage() {
  return (
    <div className="pt-28">
      {/* Intro */}
      <section className="mx-auto max-w-[1200px] px-6 py-24 text-center md:px-12 md:py-36">
        <Reveal>
          <p className="eyebrow">The atelier</p>
          <h1 className="mx-auto mt-7 max-w-4xl font-display text-[clamp(2.6rem,7vw,6rem)] font-light leading-[1]">
            We make candles the slow way —
            <span className="italic text-taupe"> because it shows.</span>
          </h1>
          <p className="mx-auto mt-10 max-w-xl leading-relaxed text-ink-soft">
            VASSIA is a small studio devoted to soy candles and scents. Every
            piece is poured by hand, in batches small enough to watch over, and
            finished with a marble that only the slow method allows.
          </p>
        </Reveal>
      </section>

      <RevealImage className="relative h-[55vh] w-full md:h-[80vh]">
        <Image
          src="https://images.unsplash.com/photo-1596433809252-c9b0f7a92429?w=1600&q=85"
          alt="The VASSIA atelier"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </RevealImage>

      {/* Process */}
      <section className="mx-auto max-w-[1500px] px-6 py-24 md:px-12 md:py-40">
        <Reveal>
          <p className="eyebrow">The process</p>
          <h2 className="mt-5 max-w-2xl font-display text-[clamp(2rem,4.5vw,4rem)] font-light leading-[1]">
            Four steps, none of them rushed.
          </h2>
        </Reveal>
        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden border border-line bg-line md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.07} className="bg-ivory p-10">
              <span className="font-display text-5xl text-line">{s.n}</span>
              <h3 className="mt-12 font-display text-2xl">{s.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                {s.d}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Statement */}
      <section className="bg-ink text-ivory">
        <div className="mx-auto max-w-[1000px] px-6 py-28 text-center md:py-44">
          <Reveal>
            <p className="font-display text-[clamp(1.8rem,4vw,3.4rem)] font-light italic leading-[1.25]">
              “Curing takes one to two weeks for the best scent throw. We don't
              shorten it. Good things are worth the wait.”
            </p>
            <p className="eyebrow mt-12 !text-ivory/45">VASSIA Candles &amp; Scents</p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[900px] px-6 py-28 text-center md:py-40">
        <Reveal>
          <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-light">
            Find your scent.
          </h2>
          <Link href="/shop" className="btn mt-10">
            Shop the collection
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
