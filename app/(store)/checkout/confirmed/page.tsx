import Link from "next/link";
import { Suspense } from "react";
import { getLocale } from "@/lib/locale-server";
import { getDictionary, type Dict } from "@/lib/i18n";

function Confirmed({
  t,
  order,
  wa,
}: {
  t: Dict;
  order?: string;
  wa?: string;
}) {
  const c = t.confirmed;
  return (
    <div className="mx-auto flex min-h-[80vh] max-w-[760px] flex-col items-center justify-center px-6 py-32 text-center md:py-40">
      <p className="eyebrow eyebrow-tick">{c.eyebrow}</p>
      <h1 className="mt-6 font-display text-[clamp(2.6rem,7vw,5.5rem)] font-light leading-[0.95]">
        {c.title}
      </h1>
      {order && (
        <p className="mt-6 text-sm tracking-[0.2em] text-taupe">
          {c.order} {order}
        </p>
      )}
      <p className="mt-8 max-w-md leading-relaxed text-ink-soft">
        {wa ? c.withWa : c.noWa}
      </p>
      <div className="mt-12 flex flex-wrap items-center justify-center gap-5">
        <Link href="/shop" className="btn">
          {c.continue}
        </Link>
        <Link
          href="/"
          className="eyebrow link-underline !text-[0.66rem] text-ink"
        >
          {c.backHome}
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
  const t = getDictionary(await getLocale());
  return (
    <Suspense>
      <Confirmed t={t} order={sp.order} wa={sp.wa} />
    </Suspense>
  );
}
