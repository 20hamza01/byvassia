"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Reveal } from "./Reveal";
import { useT } from "./LanguageProvider";
import { formatDH } from "@/lib/format";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Full editorial bundle-pricing section for the landing page.
 * Mirrors the source table exactly: 1 / Duo / Trio / Bundle of 5,
 * with the delivery cost spelled out for each tier.
 */
export function BundleOffers() {
  const { t } = useT();
  const o = t.offers;
  return (
    <section className="relative overflow-hidden bg-ivory">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ember/60 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-ember/40 to-transparent" />
      <div
        className="pointer-events-none absolute -right-[10%] top-1/2 h-[40vw] w-[40vw] -translate-y-1/2 candle-glow opacity-60"
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1500px] px-5 py-24 sm:px-6 md:px-12 md:py-32">
        <Reveal className="text-center md:text-left">
          <p className="eyebrow eyebrow-tick">{o.eyebrow}</p>
          <h2 className="mt-6 max-w-3xl font-display text-[clamp(2.2rem,5.5vw,4.6rem)] font-light leading-[0.96]">
            {o.titleA}{" "}
            <span className="italic text-molten">{o.titleB}</span>
          </h2>
          <p className="mt-7 max-w-xl text-base leading-relaxed text-ink-soft md:mt-8">
            {o.subtitle}
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden border-2 border-ink bg-ink shadow-[0_30px_80px_-50px_rgba(24,19,13,0.4)] sm:grid-cols-2 lg:grid-cols-4">
          {o.cards.map((card, i) => {
            const freeDelivery = i >= 2;
            const isBest = i === 3;
            const isTrio = i === 2;
            const candles = i + (i === 3 ? 2 : 1);
            const perCandle = Math.round(card.price / candles);
            return (
              <motion.article
                key={card.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.85, ease: EASE, delay: i * 0.08 }}
                className={
                  "group relative flex flex-col bg-ivory p-7 transition-colors duration-500 sm:p-8 md:p-9 " +
                  (isBest
                    ? "bg-noir text-ivory"
                    : "hover:bg-ivory-2")
                }
              >
                {(isBest || isTrio) && (
                  <span
                    className={
                      "absolute right-6 top-6 rounded-full px-3 py-1 text-[0.56rem] uppercase tracking-[0.22em] " +
                      (isBest
                        ? "bg-amber text-noir"
                        : "border border-ember bg-ember/10 text-ember")
                    }
                  >
                    {isBest ? o.bestValue : o.freeDelivery}
                  </span>
                )}

                <span
                  className={
                    "font-display text-5xl " +
                    (isBest
                      ? "text-amber"
                      : "text-line group-hover:text-ember")
                  }
                >
                  0{i + 1}
                </span>

                <h3
                  className={
                    "mt-8 font-display text-3xl leading-none " +
                    (isBest ? "text-ivory" : "text-ink")
                  }
                >
                  {card.title}
                </h3>
                <p
                  className={
                    "mt-2 text-xs uppercase tracking-[0.22em] " +
                    (isBest ? "text-amber/80" : "text-ink-soft")
                  }
                >
                  {card.qty}
                </p>

                <div
                  className={
                    "mt-7 border-t pt-6 " +
                    (isBest ? "border-amber/30" : "border-line")
                  }
                >
                  <div className="flex items-baseline gap-2">
                    <span
                      className={
                        "font-display text-[2.4rem] font-light leading-none " +
                        (isBest ? "text-ivory" : "text-ink")
                      }
                    >
                      {formatDH(card.price)}
                    </span>
                    <span
                      className={
                        "text-xs " + (isBest ? "text-ivory/55" : "text-ink-soft")
                      }
                    >
                      ≈ {formatDH(perCandle)}
                      {o.perCandle}
                    </span>
                  </div>
                </div>

                <dl
                  className={
                    "mt-6 flex items-center justify-between text-xs " +
                    (isBest ? "text-ivory/85" : "text-ink")
                  }
                >
                  <dt
                    className={
                      "uppercase tracking-[0.22em] " +
                      (isBest ? "text-ivory/55" : "text-ink-soft")
                    }
                  >
                    {o.deliveryLabel}
                  </dt>
                  <dd
                    className={
                      "font-semibold tracking-[0.18em] " +
                      (freeDelivery
                        ? isBest
                          ? "text-amber"
                          : "text-ember"
                        : isBest
                          ? "text-ivory"
                          : "text-ink")
                    }
                  >
                    {freeDelivery ? o.deliveryFree : o.delivery30}
                  </dd>
                </dl>

                <p
                  className={
                    "mt-6 text-sm font-display italic " +
                    (isBest ? "text-ivory/70" : "text-ink-soft")
                  }
                >
                  {card.note}
                </p>
              </motion.article>
            );
          })}
        </div>

        <Reveal
          delay={0.1}
          className="mt-12 flex flex-col items-center gap-5 text-center md:mt-14"
        >
          <p className="max-w-2xl text-xs leading-relaxed text-ink-soft">
            {o.fineprint}
          </p>
          <Link href="/shop" className="btn">
            {o.shopCta}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/**
 * Compact horizontal banner used at the top of /shop — same numbers, much
 * tighter footprint so it doesn't push the grid below the fold.
 */
export function BundleOffersBanner() {
  const { t } = useT();
  const o = t.offers;
  const tiers = [
    { label: o.cards[0].qty, price: 149, delivery: o.delivery30, free: false },
    { label: o.cards[1].qty, price: 269, delivery: o.delivery30, free: false },
    { label: o.cards[2].qty, price: 379, delivery: o.deliveryFree, free: true },
    { label: o.cards[3].qty, price: 599, delivery: o.deliveryFree, free: true },
  ];
  return (
    <section className="relative overflow-hidden border-2 border-ink bg-ink text-ivory">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          background:
            "radial-gradient(60% 90% at 80% 50%, rgba(240,180,85,0.18), transparent 70%)",
        }}
      />
      <div className="relative mx-auto flex max-w-[1500px] flex-col gap-6 px-5 py-7 sm:px-6 md:flex-row md:items-center md:justify-between md:px-12 md:py-8">
        <div className="md:max-w-xs">
          <p className="eyebrow eyebrow-tick !text-amber/80">{o.eyebrow}</p>
          <h2 className="mt-3 font-display text-2xl font-light leading-tight md:text-3xl">
            {o.titleA}{" "}
            <span className="italic text-molten">{o.titleB}</span>
          </h2>
        </div>

        <ul className="grid flex-1 grid-cols-2 gap-px overflow-hidden rounded-md bg-amber/30 sm:grid-cols-4">
          {tiers.map((tier, i) => (
            <li
              key={tier.label}
              className={
                "flex flex-col gap-1 bg-ink px-4 py-4 " +
                (i === 3 ? "ring-1 ring-inset ring-amber/60" : "")
              }
            >
              <span className="text-[0.58rem] uppercase tracking-[0.24em] text-ivory/55">
                {tier.label}
              </span>
              <span className="font-display text-xl text-ivory">
                {formatDH(tier.price)}
              </span>
              <span
                className={
                  "text-[0.62rem] uppercase tracking-[0.18em] " +
                  (tier.free ? "text-amber" : "text-ivory/55")
                }
              >
                {o.deliveryLabel} · {tier.delivery}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
