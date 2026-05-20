"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex shrink-0 flex-col justify-between border-r border-line bg-ivory-2 px-7 py-9 md:w-64">
      <div>
        <Link href="/admin" className="font-display text-2xl tracking-tight">
          VASSIA
          <span className="mt-1 block text-[0.6rem] uppercase tracking-[0.3em] text-taupe">
            Atelier
          </span>
        </Link>
        <nav className="mt-14 flex flex-col gap-1">
          {LINKS.map((l) => {
            const active =
              l.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className="border-l-2 py-3 pl-4 text-sm transition-colors"
                style={{
                  borderColor: active ? "var(--color-ink)" : "transparent",
                  color: active ? "var(--color-ink)" : "var(--color-taupe)",
                }}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex flex-col gap-4">
        <Link
          href="/"
          target="_blank"
          className="text-xs uppercase tracking-[0.2em] text-taupe hover:text-ink"
        >
          View store ↗
        </Link>
        <button
          onClick={logout}
          className="text-left text-xs uppercase tracking-[0.2em] text-taupe hover:text-ink"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
