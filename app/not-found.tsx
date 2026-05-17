import Link from "next/link";
import { getLocale } from "@/lib/locale-server";
import { getDictionary } from "@/lib/i18n";

export default async function NotFound() {
  const t = getDictionary(await getLocale());
  const n = t.notFound;
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="eyebrow eyebrow-tick justify-center">{n.code}</p>
      <h1 className="mt-6 font-display text-[clamp(2.6rem,9vw,7rem)] font-light leading-[0.95]">
        {n.title}
      </h1>
      <p className="mt-6 max-w-sm text-ink-soft">{n.body}</p>
      <Link href="/" className="btn mt-10">
        {n.back}
      </Link>
    </div>
  );
}
