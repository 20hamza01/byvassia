"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { useCart, cartSubtotal } from "@/lib/cart";
import { formatDH } from "@/lib/format";

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
  const { lines, clear } = useCart();
  const subtotal = cartSubtotal(lines);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (lines.length === 0) {
      setError("Your bag is empty.");
      return;
    }
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      customerName: String(fd.get("customerName") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
      email: String(fd.get("email") || "").trim() || undefined,
      city: String(fd.get("city") || "").trim(),
      address: String(fd.get("address") || "").trim(),
      notes: String(fd.get("notes") || "").trim() || undefined,
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
        setError(data?.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      // Build the prefilled WhatsApp message and open it.
      const num = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
      const itemLines = lines
        .map((l) => `• ${l.name} ×${l.qty} — ${formatDH(l.priceMAD * l.qty)}`)
        .join("\n");
      const msg =
        `Bonjour VASSIA, je souhaite confirmer ma commande %0A%0A` +
        `*Commande ${data.orderNumber}*%0A` +
        `${encodeURIComponent(itemLines)}%0A%0A` +
        `*Total : ${formatDH(subtotal)}*%0A%0A` +
        `Nom : ${encodeURIComponent(payload.customerName)}%0A` +
        `Téléphone : ${encodeURIComponent(payload.phone)}%0A` +
        `Ville : ${encodeURIComponent(payload.city)}%0A` +
        `Adresse : ${encodeURIComponent(payload.address)}`;
      const waUrl = num
        ? `https://wa.me/${num}?text=${msg}`
        : null;

      clear();
      const params = new URLSearchParams({ order: data.orderNumber });
      if (waUrl) {
        window.open(waUrl, "_blank");
        params.set("wa", "1");
      }
      router.push(`/checkout/confirmed?${params.toString()}`);
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-[1200px] px-6 pb-24 pt-36 md:px-12 md:pt-44">
      <p className="eyebrow">Checkout</p>
      <h1 className="mt-5 font-display text-[clamp(2.4rem,6vw,4.6rem)] font-light leading-[0.95]">
        Cash on delivery
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-taupe">
        No card needed. Place your order below — we confirm the details and
        delivery with you directly on WhatsApp.
      </p>

      {lines.length === 0 ? (
        <div className="mt-16 border-t border-line py-20 text-center">
          <p className="font-display text-3xl italic text-taupe">
            Your bag is empty.
          </p>
          <Link href="/shop" className="btn mt-8">
            Back to the collection
          </Link>
        </div>
      ) : (
        <form
          onSubmit={onSubmit}
          className="mt-14 grid grid-cols-1 gap-16 lg:grid-cols-[1.4fr_1fr]"
        >
          <div className="space-y-10">
            <fieldset className="space-y-7">
              <legend className="eyebrow mb-4">Your details</legend>
              <input
                name="customerName"
                required
                placeholder="Full name"
                className="field"
                autoComplete="name"
              />
              <input
                name="phone"
                required
                placeholder="Phone number"
                className="field"
                inputMode="tel"
                autoComplete="tel"
              />
              <input
                name="email"
                type="email"
                placeholder="Email (optional)"
                className="field"
                autoComplete="email"
              />
            </fieldset>

            <fieldset className="space-y-7">
              <legend className="eyebrow mb-4">Delivery</legend>
              <select name="city" required defaultValue="" className="field">
                <option value="" disabled>
                  Select your city
                </option>
                {MOROCCAN_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <textarea
                name="address"
                required
                rows={3}
                placeholder="Full delivery address"
                className="field resize-none"
              />
              <textarea
                name="notes"
                rows={2}
                placeholder="Order notes (optional)"
                className="field resize-none"
              />
            </fieldset>

            {error && (
              <p className="text-sm text-red-700" role="alert">
                {error}
              </p>
            )}
          </div>

          <aside className="h-fit border border-line p-9">
            <h2 className="font-display text-2xl">Your order</h2>
            <ul className="mt-7 space-y-4 text-sm">
              {lines.map((l) => (
                <li key={l.productId} className="flex justify-between gap-4">
                  <span className="text-ink-soft">
                    {l.name}{" "}
                    <span className="text-taupe">×{l.qty}</span>
                  </span>
                  <span>{formatDH(l.priceMAD * l.qty)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex justify-between border-t border-line pt-5 font-display text-xl">
              <span>Total</span>
              <span>{formatDH(subtotal)}</span>
            </div>
            <button
              type="submit"
              className="btn mt-8 w-full"
              disabled={submitting}
            >
              {submitting ? "Placing order…" : "Place order"}
            </button>
            <p className="mt-4 text-center text-xs leading-relaxed text-taupe">
              You'll be taken to WhatsApp to confirm. Pay on delivery.
            </p>
          </aside>
        </form>
      )}
    </div>
  );
}
