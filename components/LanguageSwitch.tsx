"use client";

import { useT } from "./LanguageProvider";
import type { Locale } from "@/lib/i18n";

const OPTIONS: Locale[] = ["en", "fr"];

export function LanguageSwitch({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useT();

  return (
    <div
      className={`flex items-center gap-1.5 text-[0.62rem] uppercase tracking-[0.24em] ${className}`}
      role="group"
      aria-label="Language"
    >
      {OPTIONS.map((l, i) => (
        <span key={l} className="flex items-center gap-1.5">
          {i > 0 && <span className="opacity-30">/</span>}
          <button
            type="button"
            onClick={() => setLocale(l)}
            aria-pressed={locale === l}
            className="transition-opacity duration-300"
            style={{
              opacity: locale === l ? 1 : 0.45,
              color: locale === l ? "var(--color-ember)" : "inherit",
            }}
          >
            {l.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}
