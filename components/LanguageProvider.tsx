"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  DEFAULT_LOCALE,
  LANG_COOKIE,
  getDictionary,
  type Dict,
  type Locale,
} from "@/lib/i18n";

type Ctx = {
  locale: Locale;
  t: Dict;
  setLocale: (l: Locale) => void;
};

const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useCallback(
    (l: Locale) => {
      setLocaleState(l);
      // 1 year, site-wide.
      document.cookie = `${LANG_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`;
      // Re-render server components with the new locale.
      router.refresh();
    },
    [router],
  );

  const value = useMemo<Ctx>(
    () => ({ locale, t: getDictionary(locale), setLocale }),
    [locale, setLocale],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useT(): Ctx {
  const ctx = useContext(LanguageContext);
  if (ctx) return ctx;
  // Safe fallback if used outside a provider (e.g. admin).
  return {
    locale: DEFAULT_LOCALE,
    t: getDictionary(DEFAULT_LOCALE),
    setLocale: () => {},
  };
}
