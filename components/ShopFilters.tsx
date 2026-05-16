"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CATEGORIES } from "@/lib/format";

export function ShopFilters() {
  const router = useRouter();
  const sp = useSearchParams();
  const active = sp.get("category") ?? "ALL";
  const sort = sp.get("sort") ?? "featured";

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(sp.toString());
    if (value === "ALL" || value === "featured") next.delete(key);
    else next.set(key, value);
    router.push(`/shop?${next.toString()}`, { scroll: false });
  }

  const tabs = [{ value: "ALL", label: "All" }, ...CATEGORIES];

  return (
    <div className="flex flex-col gap-6 border-b border-line pb-6 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap gap-x-8 gap-y-3">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => setParam("category", t.value)}
            className="eyebrow link-underline !text-[0.68rem] transition-colors"
            style={{
              color:
                active === t.value
                  ? "var(--color-ink)"
                  : "var(--color-taupe)",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      <select
        value={sort}
        onChange={(e) => setParam("sort", e.target.value)}
        className="eyebrow cursor-pointer border-none bg-transparent !text-[0.66rem] text-ink outline-none"
        aria-label="Sort products"
      >
        <option value="featured">Sort — Featured</option>
        <option value="price-asc">Price — Low to high</option>
        <option value="price-desc">Price — High to low</option>
        <option value="name">Name — A to Z</option>
      </select>
    </div>
  );
}
