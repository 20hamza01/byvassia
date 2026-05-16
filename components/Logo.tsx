import Image from "next/image";
import Link from "next/link";

/**
 * Brand wordmark. Uses the processed transparent PNGs from /public/brand
 * (run `npm run logo`). Falls back gracefully to a styled text wordmark if
 * the asset has not been generated yet.
 */
export function Logo({
  variant = "dark",
  className = "",
  width = 168,
}: {
  variant?: "dark" | "light";
  className?: string;
  width?: number;
}) {
  const src = variant === "light" ? "/brand/logo-light.png" : "/brand/logo.png";
  return (
    <Link
      href="/"
      aria-label="VASSIA Candles & Scents — home"
      className={`inline-flex items-center ${className}`}
    >
      <Image
        src={src}
        alt="VASSIA Candles & Scents"
        width={width}
        height={Math.round((width * 10) / 16)}
        priority
        className="h-auto w-auto select-none"
        style={{ width }}
      />
    </Link>
  );
}
