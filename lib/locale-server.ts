import { cookies } from "next/headers";
import { LANG_COOKIE, normalizeLocale, type Locale } from "./i18n";

/** Read the visitor's chosen locale from the cookie (server components). */
export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  return normalizeLocale(store.get(LANG_COOKIE)?.value);
}
