"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { useCart, cartSubtotal } from "@/lib/cart";
import { formatDH, GIFT_FEE_MAD } from "@/lib/format";
import { useT } from "@/components/LanguageProvider";
import { Select } from "@/components/Select";

const MOROCCAN_CITIES = [
  "Casablanca",
  "Rabat",
  "Marrakech",
  "Tanger",
  "Fès",
  "Agadir",
  "Meknès",
  "Oujda",
  "Kénitra",
  "Tétouan",
  "Other",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { t } = useT();
  const c = t.checkout;
  const { lines, clear } = useCart();
  const subtotal = cartSubtotal(lines);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState("");
  const [isGift, setIsGift] = useState(false);
  const [giftMessage, setGiftMessage] = useState("");
  const giftFee = isGift ? GIFT_FEE_MAD : 0;
  const total = subtotal + giftFee;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (lines.length === 0) {
      setError(c.errEmpty);
      return;
    }
    if (!city) {
      setError(c.selectCity);
      return;
    }
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      customerName: String(fd.get("customerName") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
      email: String(fd.get("email") || "").trim() || undefined,
      city,
      address: String(fd.get("address") || "").trim(),
      notes: String(fd.get("notes") || "").trim() || undefined,
      isGift,
      giftMessage: isGift ? giftMessage.trim() || undefined : undefined,
      items: lines.map((l) => ({ productId: l.productId, qty: l.qty })),
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? c.errGeneric);
        setSubmitting(false);
        return;
      }

      // Build the prefilled WhatsApp message and open it.
      const num = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
      const itemLines = lines
        .map((l) => `• ${l.name} ×${l.qty} — ${formatDH(l.priceMAD * l.qty)}`)
        .join("\n");
      const giftBlock = isGift
        ? `%0A🎁 ${encodeURIComponent(
            `${c.giftWrapping} (+${formatDH(GIFT_FEE_MAD)})`,
          )}%0A` +
          (payload.giftMessage
            ? `${encodeURIComponent(`Message : ${payload.giftMessage}`)}%0A`
            : "")
        : "";
      const msg =
        `Bonjour VASSIA, je souhaite confirmer ma commande %0A%0A` +
        `*Commande ${data.orderNumber}*%0A` +
        `${encodeURIComponent(itemLines)}%0A` +
        giftBlock +
        `%0A*Total : ${formatDH(data.totalMAD ?? total)}*%0A%0A` +
        `Nom : ${encodeURIComponent(payload.customerName)}%0A` +
        `Téléphone : ${encodeURIComponent(payload.phone)}%0A` +
        `Ville : ${encodeURIComponent(payload.city)}%0A` +
        `Adresse : ${encodeURIComponent(payload.address)}`;
      const waUrl = num ? `https://wa.me/${num}?text=${msg}` : null;

      clear();
      const params = new URLSearchParams({ order: data.orderNumber });
      if (waUrl) {
        window.open(waUrl, "_blank");
        params.set("wa", "1");
      }
      router.push(`/checkout/confirmed?${params.toString()}`);
    } catch {
      setError(c.errNetwork);
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-[1200px] px-5 pb-24 pt-32 sm:px-6 md:px-12 md:pt-44">
      <p className="eyebrow eyebrow-tick">{c.eyebrow}</p>
      <h1 className="mt-5 font-display text-[clamp(2.2rem,6vw,4.6rem)] font-light leading-[0.95]">
        {c.title}
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-taupe">
        {c.intro}
      </p>

      {lines.length === 0 ? (
        <div className="mt-16 border-t border-line py-20 text-center">
          <p className="font-display text-3xl italic text-taupe">
            {c.emptyBag}
          </p>
          <Link href="/shop" className="btn mt-8">
            {c.backToCollection}
          </Link>
        </div>
      ) : (
        <form
          onSubmit={onSubmit}
          className="mt-12 grid grid-cols-1 gap-12 md:mt-14 lg:grid-cols-[1.4fr_1fr] lg:gap-16"
        >
          <div className="space-y-10 order-2 lg:order-1">
            <fieldset className="space-y-7">
              <legend className="eyebrow eyebrow-tick mb-4">
                {c.yourDetails}
              </legend>
              <input
                name="customerName"
                required
                placeholder={c.fullName}
                className="field"
                autoComplete="name"
              />
              <input
                name="phone"
                required
                placeholder={c.phone}
                className="field"
                inputMode="tel"
                autoComplete="tel"
              />
              <input
                name="email"
                type="email"
                placeholder={c.email}
                className="field"
                autoComplete="email"
              />
            </fieldset>

            <fieldset className="space-y-7">
              <legend className="eyebrow eyebrow-tick mb-4">
                {c.delivery}
              </legend>
              <Select
                name="city"
                value={city}
                onChange={setCity}
                placeholder={c.selectCity}
                ariaLabel={c.selectCity}
                options={MOROCCAN_CITIES.map((x) => ({
                  value: x,
                  label: x,
                }))}
              />
              <textarea
                name="address"
                required
                rows={3}
                placeholder={c.address}
                className="field resize-none"
              />
              <textarea
                name="notes"
                rows={2}
                placeholder={c.notes}
                className="field resize-none"
              />
            </fieldset>

            <fieldset>
              <legend className="eyebrow eyebrow-tick mb-5">
                {c.giftLegend}
              </legend>
              <button
                type="button"
                role="switch"
                aria-checked={isGift}
                onClick={() => setIsGift((g) => !g)}
                className="flex w-full items-center justify-between gap-4 border border-line p-5 text-left transition-colors duration-300 hover:border-ember"
              >
                <span>
                  <span className="block font-display text-xl">
                    {c.giftTitle}
                  </span>
                  <span className="mt-1 block text-xs text-taupe">
                    {c.giftDesc(formatDH(GIFT_FEE_MAD))}
                  </span>
                </span>
                <span
                  className="relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300"
                  style={{
                    background: isGift
                      ? "var(--color-ember)"
                      : "var(--color-line)",
                  }}
                  aria-hidden
                >
                  <span
                    className="absolute top-0.5 h-5 w-5 rounded-full bg-ivory transition-all duration-300"
                    style={{ left: isGift ? "1.5rem" : "0.125rem" }}
                  />
                </span>
              </button>

              {isGift && (
                <textarea
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  rows={3}
                  maxLength={300}
                  placeholder={c.giftMessage}
                  className="field mt-5 resize-none"
                />
              )}
            </fieldset>

            {error && (
              <p className="text-sm text-red-700" role="alert">
                {error}
              </p>
            )}
          </div>

          <aside className="order-1 h-fit border border-line p-7 sm:p-9 lg:order-2 lg:sticky lg:top-28">
            <h2 className="font-display text-2xl">{c.yourOrder}</h2>
            <ul className="mt-7 space-y-4 text-sm">
              {lines.map((l) => (
                <li key={l.productId} className="flex justify-between gap-4">
                  <span className="text-ink-soft">
                    {l.name} <span className="text-taupe">×{l.qty}</span>
                  </span>
                  <span>{formatDH(l.priceMAD * l.qty)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-6 space-y-2.5 border-t border-line pt-5 text-sm">
              <div className="flex justify-between">
                <dt className="text-taupe">{c.subtotal}</dt>
                <dd>{formatDH(subtotal)}</dd>
              </div>
              {isGift && (
                <div className="flex justify-between">
                  <dt className="text-taupe">{c.giftWrapping}</dt>
                  <dd>{formatDH(giftFee)}</dd>
                </div>
              )}
              <div className="flex justify-between text-taupe">
                <dt>{c.deliveryRow}</dt>
                <dd>{c.deliveryValue}</dd>
              </div>
            </dl>
            <div className="mt-4 flex justify-between border-t border-line pt-4 font-display text-xl">
              <span>{c.total}</span>
              <span className="text-molten">{formatDH(total)}</span>
            </div>
            <button
              type="submit"
              className="btn mt-8 w-full"
              disabled={submitting}
            >
              {submitting ? c.placing : c.placeOrder}
            </button>
            <p className="mt-4 text-center text-xs leading-relaxed text-taupe">
              {c.waNote}
            </p>
          </aside>
        </form>
      )}
    </div>
  );
}
