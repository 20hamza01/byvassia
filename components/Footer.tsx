"use client";

import Link from "next/link";
import { Logo } from "./Logo";
import { useT } from "./LanguageProvider";

export function Footer() {
  const { t } = useT();
  const ig = process.env.NEXT_PUBLIC_INSTAGRAM || "#";
  const mail =
    process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@vassiacandles.com";

  return (
    <footer className="relative mt-28 overflow-hidden bg-noir text-ivory md:mt-32">
      <div
        className="pointer-events-none absolute -bottom-1/3 left-1/2 h-[60vw] w-[90vw] -translate-x-1/2 candle-glow"
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-28">
        <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-[1.5fr_1fr_1fr] md:gap-14">
          <div className="sm:col-span-2 md:col-span-1">
            <Logo variant="light" width={190} />
            <p className="mt-7 max-w-xs font-display text-xl italic leading-relaxed text-ivory/65">
              {t.footer.tagline}
            </p>
            <p className="eyebrow eyebrow-tick mt-8 !text-gold-soft/55">
              {t.footer.poured}
            </p>
          </div>

          <div>
            <p className="eyebrow !text-ivory/40">{t.footer.explore}</p>
            <ul className="mt-7 space-y-3 text-sm text-ivory/75">
              <li>
                <Link className="link-underline" href="/shop">
                  {t.footer.theCandles}
                </Link>
              </li>
              <li>
                <Link className="link-underline" href="/about">
                  {t.footer.theAtelier}
                </Link>
              </li>
              <li>
                <Link className="link-underline" href="/contact">
                  {t.footer.contact}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="eyebrow !text-ivory/40">{t.footer.contactLabel}</p>
            <ul className="mt-7 space-y-3 text-sm text-ivory/75">
              <li>
                <a className="link-underline" href={`mailto:${mail}`}>
                  {mail}
                </a>
              </li>
              <li>
                <a
                  className="link-underline"
                  href={ig}
                  target="_blank"
                  rel="noreferrer"
                >
                  Instagram
                </a>
              </li>
              <li>
                <Link className="link-underline" href="/contact">
                  {t.footer.orderWa}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="mt-16 select-none overflow-hidden border-t border-ivory/12 pt-10 md:mt-20"
          aria-hidden
        >
          <p className="bg-gradient-to-b from-ivory/12 to-ivory/[0.02] bg-clip-text font-display text-[clamp(3rem,18vw,16rem)] font-light leading-none tracking-[-0.03em] text-transparent">
            VASSIA
          </p>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 text-[0.66rem] uppercase tracking-[0.22em] text-ivory/35 md:flex-row md:items-center md:tracking-[0.24em]">
          <span>
            © {new Date().getFullYear()} VASSIA {t.footer.rights}
          </span>
          <span>{t.footer.madeSlowly}</span>
        </div>
      </div>
    </footer>
  );
}
