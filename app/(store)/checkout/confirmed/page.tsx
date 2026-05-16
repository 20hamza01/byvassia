import Link from "next/link";
import { Suspense } from "react";

function Confirmed({
  order,
  wa,
}: {
  order?: string;
  wa?: string;
}) {
  return (
    <div className="mx-auto flex min-h-[80vh] max-w-[760px] flex-col items-center justify-center px-6 py-40 text-center">
      <p className="eyebrow">Order received</p>
      <h1 className="mt-6 font-display text-[clamp(2.6rem,7vw,5.5rem)] font-light leading-[0.95]">
        Thank you.
      </h1>
      {order && (
        <p className="mt-6 text-sm tracking-[0.2em] text-taupe">
          ORDER {order}
        </p>
      )}
      <p className="mt-8 max-w-md leading-relaxed text-ink-soft">
        {wa
          ? "We've opened WhatsApp so you can confirm your order with us. If it didn't open, message us anytime — we'll arrange delivery and you pay in cash when it arrives."
          : "Your order has been recorded. We'll be in touch shortly to confirm delivery. Payment is cash on delivery."}
      </p>
      <div className="mt-12 flex flex-wrap items-center justify-center gap-5">
        <Link href="/shop" className="btn">
          Continue shopping
        </Link>
        <Link
          href="/"
          className="eyebrow link-underline !text-[0.66rem] text-ink"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}

export default async function ConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; wa?: string }>;
}) {
  const sp = await searchParams;
  return (
    <Suspense>
      <Confirmed order={sp.order} wa={sp.wa} />
    </Suspense>
  );
}
