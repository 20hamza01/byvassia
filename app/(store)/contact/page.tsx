import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Contact",
  description: "Reach VASSIA Candles & Scents — order or ask by WhatsApp.",
};

export default function ContactPage() {
  const num = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const ig = process.env.NEXT_PUBLIC_INSTAGRAM || "#";
  const mail =
    process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@vassiacandles.com";
  const waHref = num
    ? `https://wa.me/${num}?text=${encodeURIComponent("Bonjour VASSIA,")}`
    : "#";

  return (
    <div className="mx-auto max-w-[1100px] px-6 pb-32 pt-36 md:px-12 md:pt-52">
      <Reveal>
        <p className="eyebrow">Contact</p>
        <h1 className="mt-6 font-display text-[clamp(2.8rem,8vw,6.5rem)] font-light leading-[0.95]">
          Let's talk
          <span className="italic text-taupe"> scent.</span>
        </h1>
        <p className="mt-8 max-w-lg leading-relaxed text-ink-soft">
          The fastest way to order or ask a question is WhatsApp — we reply
          personally. You can also find us on Instagram or by email.
        </p>
      </Reveal>

      <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
        {[
          { label: "WhatsApp", value: "Message us", href: waHref, ext: true },
          { label: "Instagram", value: "@vassiacandles", href: ig, ext: true },
          { label: "Email", value: mail, href: `mailto:${mail}`, ext: false },
        ].map((c, i) => (
          <Reveal key={c.label} delay={i * 0.07} className="bg-ivory">
            <a
              href={c.href}
              target={c.ext ? "_blank" : undefined}
              rel={c.ext ? "noreferrer" : undefined}
              className="block p-10 transition-colors duration-500 hover:bg-ivory-2"
            >
              <p className="eyebrow">{c.label}</p>
              <p className="mt-8 font-display text-2xl">{c.value}</p>
              <span className="link-underline mt-6 inline-block text-xs tracking-[0.2em] text-taupe">
                OPEN →
              </span>
            </a>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <div className="mt-20 border-t border-line pt-10 text-sm text-taupe">
          <p>
            Orders are delivered across Morocco with cash on delivery. Delivery
            times and fees are confirmed with you directly when you order.
          </p>
        </div>
      </Reveal>
    </div>
  );
}
