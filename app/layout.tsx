import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { getLocale } from "@/lib/locale-server";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: {
    default: "VASSIA — Candles & Scents",
    template: "%s — VASSIA Candles & Scents",
  },
  description:
    "Hand-poured soy candles and scents, made in small batches. Slow-burning, marbled, and scented with intention.",
  openGraph: {
    title: "VASSIA — Candles & Scents",
    description:
      "Hand-poured soy candles and scents, made in small batches.",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  return (
    <html
      lang={locale}
      className={`${cormorant.variable} ${jost.variable}`}
    >
      <body className="grain">{children}</body>
    </html>
  );
}
