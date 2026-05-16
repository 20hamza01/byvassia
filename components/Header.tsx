"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { useCart, cartCount } from "@/lib/cart";

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/shop?category=CANDLE", label: "Candles" },
  { href: "/about", label: "Atelier" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lines = useCart((s) => s.lines);
  const openCart = useCart((s) => s.open);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setMenuOpen(false), [pathname]);

  const count = mounted ? cartCount(lines) : 0;
  const onHome = pathname === "/";
  const solid = scrolled || !onHome || menuOpen;

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-colors duration-700"
      style={{
        backgroundColor: solid ? "rgba(250,246,239,0.92)" : "transparent",
        backdropFilter: solid ? "blur(10px)" : "none",
        borderBottom: solid ? "1px solid var(--color-line)" : "1px solid transparent",
      }}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-5 md:px-10">
        <nav className="hidden flex-1 items-center gap-9 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.label}
              href={n.href}
              className="eyebrow link-underline !text-[0.66rem] !tracking-[0.26em] text-ink"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <button
          aria-label="Menu"
          onClick={() => setMenuOpen((o) => !o)}
          className="flex flex-1 items-center md:hidden"
        >
          <span className="flex flex-col gap-[5px]">
            <span className="block h-px w-6 bg-ink" />
            <span className="block h-px w-6 bg-ink" />
          </span>
        </button>

        <div className="flex flex-1 justify-center">
          <Logo width={148} />
        </div>

        <div className="flex flex-1 items-center justify-end gap-6">
          <Link
            href="/about"
            className="eyebrow link-underline hidden !text-[0.66rem] !tracking-[0.26em] text-ink lg:inline"
          >
            Journal
          </Link>
          <button
            onClick={openCart}
            className="eyebrow group flex items-center gap-2 !text-[0.66rem] !tracking-[0.26em] text-ink"
            aria-label={`Cart, ${count} items`}
          >
            <span className="link-underline">Cart</span>
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full border border-ink px-1 text-[0.6rem] leading-none">
              {count}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className="overflow-hidden border-t border-line bg-ivory transition-[max-height] duration-500 md:hidden"
        style={{ maxHeight: menuOpen ? 320 : 0 }}
      >
        <div className="flex flex-col gap-1 px-6 py-6">
          {NAV.map((n) => (
            <Link
              key={n.label}
              href={n.href}
              className="border-b border-line/60 py-4 font-display text-2xl text-ink"
            >
              {n.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
