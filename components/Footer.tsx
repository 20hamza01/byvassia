import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  const ig = process.env.NEXT_PUBLIC_INSTAGRAM || "#";
  const mail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@vassiacandles.com";
  return (
    <footer className="relative mt-32 bg-ink text-ivory">
      <div className="mx-auto max-w-[1400px] px-6 py-20 md:px-10 md:py-28">
        <div className="grid gap-14 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo variant="light" width={190} />
            <p className="mt-7 max-w-xs font-display text-xl italic leading-relaxed text-ivory/70">
              Hand-poured soy candles, made slowly and in small batches.
            </p>
          </div>

          <div>
            <p className="eyebrow !text-ivory/45">Explore</p>
            <ul className="mt-6 space-y-3 text-sm text-ivory/80">
              <li><Link className="link-underline" href="/shop">All products</Link></li>
              <li><Link className="link-underline" href="/shop?category=CANDLE">Candles</Link></li>
              <li><Link className="link-underline" href="/shop?category=DIFFUSER">Diffusers</Link></li>
              <li><Link className="link-underline" href="/about">The atelier</Link></li>
            </ul>
          </div>

          <div>
            <p className="eyebrow !text-ivory/45">Contact</p>
            <ul className="mt-6 space-y-3 text-sm text-ivory/80">
              <li><a className="link-underline" href={`mailto:${mail}`}>{mail}</a></li>
              <li><a className="link-underline" href={ig} target="_blank" rel="noreferrer">Instagram</a></li>
              <li><Link className="link-underline" href="/contact">Order by WhatsApp</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-start justify-between gap-4 border-t border-ivory/15 pt-8 text-[0.7rem] uppercase tracking-[0.22em] text-ivory/40 md:flex-row md:items-center">
          <span>© {new Date().getFullYear()} VASSIA Candles &amp; Scents</span>
          <span>Made slowly · Poured by hand</span>
        </div>
      </div>
    </footer>
  );
}
