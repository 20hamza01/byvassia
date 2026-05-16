import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-6 font-display text-[clamp(3rem,9vw,7rem)] font-light leading-[0.95]">
        Lost the scent.
      </h1>
      <p className="mt-6 max-w-sm text-ink-soft">
        This page doesn't exist — but the collection still does.
      </p>
      <Link href="/" className="btn mt-10">
        Back home
      </Link>
    </div>
  );
}
