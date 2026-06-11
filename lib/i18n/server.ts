import "server-only";
import { cookies } from "next/headers";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, type Locale } from "./config";
import { dictionaries, type Dictionary } from "./dictionaries";

// Locale courante côté serveur (lue depuis le cookie posé par le sélecteur de langue).
export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export async function getDict(): Promise<Dictionary> {
  const locale = await getLocale();
  return dictionaries[locale];
}

export function dictFor(locale: Locale): Dictionary {
  return dictionaries[locale];
}
