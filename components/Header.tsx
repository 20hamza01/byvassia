"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { LanguageSwitch } from "./LanguageSwitch";
import { useT } from "./LanguageProvider";
import { useCart, cartCount } from "@/lib/cart";

export function Header() {
  const pathname = usePathname();
  const { t } = useT();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lines = useCart((s) => s.lines);
  const openCart = useCart((s) => s.open);

  const NAV = [
    { href: "/shop", label: t.nav.shop },
    { href: "/about", label: t.nav.atelier },
    { href: "/contact", label: t.nav.contact },
  ];

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
  const onDark = !solid;

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-colors duration-700"
      style={{
        backgroundColor: solid ? "rgba(250,246,239,0.88)" : "transparent",
        backdropFilter: solid ? "blur(14px) saturate(1.2)" : "none",
        borderBottom: solid
          ? "1px solid var(--color-line)"
          : "1px solid transparent",
        color: onDark ? "var(--color-ivory)" : "var(--color-ink)",
      }}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-4 md:px-10 md:py-5">
        <nav className="hidden flex-1 items-center gap-9 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="eyebrow link-underline !gap-0 !text-[0.64rem] !tracking-[0.28em]"
              style={{ color: "inherit" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <button
          aria-label={t.nav.menu}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
          className="flex flex-1 items-center md:hidden"
        >
          <span className="flex flex-col gap-[5px]">
            <span
              className="block h-px w-6 transition-all"
              style={{
                background: "currentColor",
                transform: menuOpen
                  ? "translateY(3px) rotate(45deg)"
                  : "none",
              }}
            />
            <span
              className="block h-px w-6 transition-all"
              style={{
                background: "currentColor",
                transform: menuOpen
                  ? "translateY(-3px) rotate(-45deg)"
                  : "none",
              }}
            />
          </span>
        </button>

        <div className="flex flex-1 justify-center">
          <Logo width={138} variant={onDark ? "light" : "dark"} />
        </div>

        <div className="flex flex-1 items-center justify-end gap-4 md:gap-6">
          <LanguageSwitch className="hidden sm:flex" />
          <button
            onClick={openCart}
            className="eyebrow group flex items-center !gap-2 !text-[0.64rem] !tracking-[0.28em]"
            style={{ color: "inherit" }}
            aria-label={`${t.nav.cart}, ${count}`}
          >
            <span className="link-underline hidden sm:inline">
              {t.nav.cart}
            </span>
            <span
              className="inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[0.58rem] leading-none"
              style={{ border: "1px solid currentColor" }}
            >
              {count}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className="overflow-hidden border-t border-line bg-ivory text-ink transition-[max-height] duration-500 md:hidden"
        style={{ maxHeight: menuOpen ? 420 : 0 }}
      >
        <div className="flex flex-col px-6 py-4">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="border-b border-line/60 py-4 font-display text-2xl text-ink"
            >
              {n.label}
            </Link>
          ))}
          <div className="flex items-center justify-between py-5">
            <span className="eyebrow !text-taupe">Langue / Language</span>
            <LanguageSwitch />
          </div>
        </div>
      </div>
    </header>
  );
}
