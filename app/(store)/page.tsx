import Link from "next/link";
import Image from "next/image";
import { Hero } from "@/components/Hero";
import { ProductCard } from "@/components/ProductCard";
import { Reveal, RevealImage } from "@/components/Reveal";
import { getFeatured } from "@/lib/products";

// Featured products are admin-managed and live in Neon — render per request
// rather than prerendering at build time.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featured = await getFeatured(3);

  return (
    <>
      <Hero />

      {/* Announcement marquee */}
      <div className="overflow-hidden border-y border-line bg-ivory-2 py-3">
        <div className="marquee-track">
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k} className="flex">
              {[
                "Hand-poured in small batches",
                "100% soy wax",
                "Marbled by hand",
                "Cash on delivery across Morocco",
                "Order by WhatsApp",
              ].map((t) => (
                <span
                  key={t}
                  className="eyebrow mx-8 !text-[0.62rem] !text-ink/55"
                >
                  {t} ·
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* Featured */}
      <section className="mx-auto max-w-[1500px] px-6 py-28 md:px-12 md:py-40">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <p className="eyebrow">The signatures</p>
            <h2 className="mt-5 max-w-xl font-display text-[clamp(2.4rem,5vw,4.5rem)] font-light leading-[0.95]">
              Scents we return to,
              <span className="italic text-taupe"> again and again.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Link
              href="/shop"
              className="eyebrow link-underline !text-[0.66rem] text-ink"
            >
              View all
            </Link>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
          {featured.length === 0 && (
            <p className="text-taupe">
              No products yet — add them in the admin dashboard.
            </p>
          )}
        </div>
      </section>

      {/* Brand story — editorial split */}
      <section className="bg-ink text-ivory">
        <div className="mx-auto grid max-w-[1500px] grid-cols-1 items-stretch md:grid-cols-2">
          <RevealImage className="relative min-h-[60vh] md:min-h-[88vh]">
            <Image
              src="https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=1200&q=85"
              alt="Pouring soy wax by hand in the VASSIA atelier"
              fill
              sizes="50vw"
              className="object-cover"
            />
          </RevealImage>
          <div className="flex items-center px-8 py-24 md:px-20">
            <Reveal>
              <p className="eyebrow !text-ivory/45">The atelier</p>
              <h2 className="mt-6 font-display text-[clamp(2.2rem,4.5vw,4rem)] font-light leading-[1.02]">
                Poured at the edge
                <br />
                <span className="italic text-gold-soft">of warmth.</span>
              </h2>
              <p className="mt-8 max-w-md leading-relaxed text-ivory/65">
                We melt slowly, let the wax cool to exactly where fragrance binds
                best, and pour into warmed glass so the surface sets smooth.
                After a day of curing, each candle is marbled by hand — no two
                are alike.
              </p>
              <Link
                href="/about"
                className="eyebrow link-underline mt-10 inline-block !text-[0.66rem] !text-ivory"
              >
                Read the process
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Scent families */}
      <section className="mx-auto max-w-[1500px] px-6 py-28 md:px-12 md:py-40">
        <Reveal>
          <p className="eyebrow">Find your scent</p>
          <h2 className="mt-5 font-display text-[clamp(2.2rem,5vw,4.5rem)] font-light leading-[0.95]">
            Four ways to read a room.
          </h2>
        </Reveal>
        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {[
            { t: "Warm & Resinous", d: "Amber, oud, tonka" },
            { t: "Green & Fresh", d: "Fig, sea salt, stem" },
            { t: "Floral & Powdery", d: "May rose, peony, musk" },
            { t: "Dark & Smoked", d: "Tobacco, honey, hay" },
          ].map((f, i) => (
            <Reveal
              key={f.t}
              delay={i * 0.06}
              className="bg-ivory p-10 transition-colors duration-500 hover:bg-ivory-2"
            >
              <span className="font-display text-5xl text-line">
                0{i + 1}
              </span>
              <h3 className="mt-10 font-display text-2xl">{f.t}</h3>
              <p className="mt-2 text-xs tracking-wide text-taupe">{f.d}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
