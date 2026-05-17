"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Flame } from "./Flame";
import { useT } from "./LanguageProvider";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const { t } = useT();
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-noir text-ivory">
      {/* Full-bleed candlelit imagery */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.12, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2.2, ease: EASE }}
      >
        <Image
          src="https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?w=1900&q=88"
          alt="A VASSIA soy candle glowing in the dark"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[60%_center] opacity-55"
        />
      </motion.div>

      {/* Atmospheric grading */}
      <div className="absolute inset-0 bg-gradient-to-r from-noir via-noir/85 to-noir/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-noir via-transparent to-noir/55" />
      <div
        className="pointer-events-none absolute right-[6%] top-1/2 h-[58vw] w-[58vw] -translate-y-1/2 candle-glow"
        aria-hidden
      />

      <div className="relative mx-auto grid min-h-[100svh] max-w-[1500px] grid-cols-1 items-center gap-12 px-6 pb-24 pt-36 md:grid-cols-12 md:px-12">
        <div className="md:col-span-7 lg:col-span-7">
          <motion.p
            className="eyebrow eyebrow-tick !text-gold-soft/70"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.4 }}
          >
            {t.hero.eyebrow}
          </motion.p>

          <h1 className="mt-8 font-display text-[clamp(3rem,10vw,9.5rem)] font-light leading-[0.86] tracking-[-0.03em]">
            {t.hero.titleA.split(" ").map((w, i) => (
              <span key={w} className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={{ y: "112%" }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 1.15,
                    ease: EASE,
                    delay: 0.5 + i * 0.12,
                  }}
                >
                  {w}
                </motion.span>
              </span>
            ))}
            <span className="block overflow-hidden">
              <motion.span
                className="block italic text-molten"
                initial={{ y: "112%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.15, ease: EASE, delay: 0.78 }}
              >
                {t.hero.titleB}
              </motion.span>
            </span>
          </h1>

          <motion.p
            className="mt-10 max-w-md text-[1rem] leading-relaxed text-ivory/65"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 1.15 }}
          >
            {t.hero.body}
          </motion.p>

          <motion.div
            className="mt-12 flex flex-wrap items-center gap-7"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 1.3 }}
          >
            <Link href="/shop" className="btn btn-on-dark">
              {t.hero.shop}
            </Link>
            <Link
              href="/about"
              className="eyebrow link-underline !text-[0.66rem] !text-ivory"
            >
              {t.hero.atelier}
            </Link>
          </motion.div>
        </div>

        {/* The flame */}
        <motion.div
          className="hidden md:col-span-5 md:flex md:justify-center"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease: EASE, delay: 0.9 }}
        >
          <div className="relative flex flex-col items-center">
            <Flame className="h-[clamp(160px,22vw,300px)] w-[clamp(95px,13vw,170px)]" />
            {/* the candle */}
            <div className="mt-1 h-44 w-28 rounded-[3px] bg-gradient-to-b from-ivory/85 via-ivory/70 to-ivory/40 shadow-[0_0_60px_-10px_rgba(240,180,85,0.5)] lg:h-56 lg:w-32">
              <div className="mx-auto mt-3 h-px w-12 bg-noir/20" />
            </div>
            <div className="mt-[-6px] h-6 w-40 rounded-[50%] bg-gold-soft/10 blur-md" />
          </div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-9 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.7 }}
      >
        <span className="eyebrow !text-[0.58rem] !text-ivory/45">
          {t.hero.scroll}
        </span>
        <motion.span
          className="block h-10 w-px bg-gradient-to-b from-amber/70 to-transparent"
          animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "top" }}
        />
      </motion.div>
    </section>
  );
}
