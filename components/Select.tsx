"use client";

import { useEffect, useRef, useState } from "react";

export type Option = { value: string; label: string };

/**
 * Site-styled dropdown that replaces the native <select> (whose option list
 * can't be themed). Mirrors the editorial aesthetic: ivory panel, hairline
 * dividers, ember active marker. When `name` is set it writes the value into
 * a hidden input so it works inside a <form> via FormData.
 */
export function Select({
  options,
  value,
  onChange,
  placeholder,
  name,
  ariaLabel,
  className = "",
}: {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  name?: string;
  ariaLabel?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      {name && <input type="hidden" name={name} value={value} />}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        className="flex w-full items-center justify-between gap-3 border-b border-line py-3.5 text-left text-[0.95rem] outline-none transition-colors duration-300 focus-visible:border-ember"
      >
        <span className={selected ? "text-ink" : "text-taupe"}>
          {selected ? selected.label : placeholder}
        </span>
        <svg
          width="11"
          height="7"
          viewBox="0 0 11 7"
          fill="none"
          aria-hidden
          className="shrink-0 transition-transform duration-300"
          style={{ transform: open ? "rotate(180deg)" : "none" }}
        >
          <path
            d="M1 1l4.5 4.5L10 1"
            stroke="currentColor"
            strokeWidth="1.2"
            className="text-taupe"
          />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={ariaLabel}
          className="absolute left-0 right-0 z-40 mt-2 max-h-72 origin-top animate-[fadeIn_0.18s_ease] overflow-auto border border-line bg-ivory shadow-[0_22px_50px_-24px_rgba(24,19,13,0.45)]"
        >
          {options.map((o, i) => {
            const active = o.value === value;
            return (
              <li key={o.value} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(o.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 px-5 py-3 text-left text-sm transition-colors duration-200 ${
                    i !== options.length - 1
                      ? "border-b border-line/55"
                      : ""
                  } ${
                    active
                      ? "bg-ivory-2 text-ember"
                      : "text-ink-soft hover:bg-ivory-2 hover:text-ink"
                  }`}
                >
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full transition-colors"
                    style={{
                      background: active
                        ? "var(--color-ember)"
                        : "transparent",
                      boxShadow: active
                        ? "0 0 6px var(--color-amber)"
                        : "none",
                    }}
                    aria-hidden
                  />
                  {o.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
