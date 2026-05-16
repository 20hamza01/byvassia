"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Warm candle glow behind the imagery */}
      <div className="pointer-events-none absolute right-[-10%] top-1/4 h-[60vw] w-[60vw] candle-glow" />

      <div className="mx-auto grid min-h-screen max-w-[1500px] grid-cols-1 items-center gap-10 px-6 pt-28 md:grid-cols-12 md:px-12">
        <div className="md:col-span-6 lg:col-span-5">
          <motion.p
            className="eyebrow"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.1 }}
          >
            Hand-poured soy · Small batch
          </motion.p>

          <h1 className="mt-7 font-display text-[clamp(3.4rem,9vw,8rem)] font-light leading-[0.92] tracking-[-0.02em]">
            {["Light", "the", "quiet"].map((w, i) => (
              <motion.span
                key={w}
                className="block overflow-hidden"
              >
                <motion.span
                  className="block"
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.1, ease: EASE, delay: 0.2 + i * 0.12 }}
                >
                  {w}
                </motion.span>
              </motion.span>
            ))}
            <motion.span
              className="block overflow-hidden italic text-taupe"
            >
              <motion.span
                className="block"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.1, ease: EASE, delay: 0.56 }}
              >
                hours.
              </motion.span>
            </motion.span>
          </h1>

          <motion.p
            className="mt-9 max-w-md text-[0.95rem] leading-relaxed text-ink-soft"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.9 }}
          >
            Soy candles poured slowly by hand, marbled as they cure, and scented
            with intention. Made in small batches — never rushed.
          </motion.p>

          <motion.div
            className="mt-11 flex flex-wrap items-center gap-5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 1.05 }}
          >
            <Link href="/shop" className="btn">
              Shop the collection
            </Link>
            <Link
              href="/about"
              className="eyebrow link-underline !text-[0.66rem] text-ink"
            >
              Our atelier
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="relative md:col-span-6 md:col-start-7"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 1.5, ease: EASE, delay: 0.35 }}
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?w=1400&q=85"
              alt="A VASSIA soy candle, hand-poured and marbled"
              fill
              priority
              sizes="(max-width:768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <motion.div
            className="absolute -bottom-8 -left-8 hidden aspect-square w-40 overflow-hidden border-8 border-ivory md:block lg:w-52"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: EASE, delay: 1.1 }}
          >
            <Image
              src="https://images.unsplash.com/photo-1608181831718-c9ffd8728e0a?w=600&q=85"
              alt=""
              fill
              sizes="220px"
              className="object-cover"
            />
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.4 }}
      >
        <span className="eyebrow !text-[0.6rem]">Scroll</span>
      </motion.div>
    </section>
  );
}
