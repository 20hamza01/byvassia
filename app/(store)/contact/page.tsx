import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { getLocale } from "@/lib/locale-server";
import { getDictionary } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Contact",
  description: "Reach VASSIA Candles & Scents — order or ask by WhatsApp.",
};

export default async function ContactPage() {
  const t = getDictionary(await getLocale());
  const c = t.contact;
  const num = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const ig = process.env.NEXT_PUBLIC_INSTAGRAM || "#";
  const mail =
    process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@vassiacandles.com";
  const waHref = num
    ? `https://wa.me/${num}?text=${encodeURIComponent("Bonjour VASSIA,")}`
    : "#";

  const cards = [
    { label: c.whatsapp, value: c.whatsappValue, href: waHref, ext: true },
    { label: c.instagram, value: "@vassiacandles", href: ig, ext: true },
    { label: c.email, value: mail, href: `mailto:${mail}`, ext: false },
  ];

  return (
    <div className="mx-auto max-w-[1100px] px-5 pb-28 pt-32 sm:px-6 md:px-12 md:pt-52">
      <Reveal>
        <p className="eyebrow eyebrow-tick">{c.eyebrow}</p>
        <h1 className="mt-6 font-display text-[clamp(2.6rem,8.5vw,7rem)] font-light leading-[0.9]">
          {c.titleA}
          <span className="italic text-molten"> {c.titleB}</span>
        </h1>
        <p className="mt-8 max-w-lg leading-relaxed text-ink-soft">
          {c.body}
        </p>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
        {cards.map((card, i) => (
          <Reveal key={card.label} delay={i * 0.07} className="group bg-ivory">
            <a
              href={card.href}
              target={card.ext ? "_blank" : undefined}
              rel={card.ext ? "noreferrer" : undefined}
              className="block p-8 transition-colors duration-500 hover:bg-noir md:p-10"
            >
              <p className="eyebrow eyebrow-tick !text-taupe transition-colors duration-500 group-hover:!text-gold-soft/60">
                {card.label}
              </p>
              <p className="mt-8 font-display text-2xl transition-colors duration-500 group-hover:text-ivory">
                {card.value}
              </p>
              <span className="link-underline mt-6 inline-block text-xs tracking-[0.2em] text-taupe transition-colors duration-500 group-hover:text-ember">
                {c.open}
              </span>
            </a>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <div className="mt-16 border-t border-line pt-10 text-sm text-taupe md:mt-20">
          <p>{c.codNote}</p>
        </div>
      </Reveal>
    </div>
  );
}
