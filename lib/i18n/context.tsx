"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Locale } from "./config";
import type { Dictionary } from "./dictionaries";

type LocaleCtx = { locale: Locale; t: Dictionary };

// La valeur réelle est toujours fournie par le provider (seedé côté serveur).
const Ctx = createContext<LocaleCtx | null>(null);

export function LocaleProvider({
  locale,
  dict,
  children,
}: {
  locale: Locale;
  dict: Dictionary;
  children: ReactNode;
}) {
  return <Ctx.Provider value={{ locale, t: dict }}>{children}</Ctx.Provider>;
}

export function useLocale(): LocaleCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLocale must be used within <LocaleProvider>");
  return ctx;
}
