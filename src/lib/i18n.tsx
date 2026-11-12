import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

import { useNavigate, useSearch } from "@tanstack/react-router";
import { DICTIONARY } from "@/locales/all";

export const LANGUAGES = [
  { code: "fr", label: "Français", rtl: false },
  { code: "ar", label: "العربية", rtl: true },
  { code: "en", label: "English", rtl: false },
  { code: "tr", label: "Türkçe", rtl: false },
  { code: "ur", label: "اردو", rtl: true },
  { code: "id", label: "Bahasa Indonesia", rtl: false },
  { code: "es", label: "Español", rtl: false },
  { code: "de", label: "Deutsch", rtl: false },
] as const;

export type Lang = (typeof LANGUAGES)[number]["code"];
/** Translations of one French source string. French is the key itself. */
export type Entry = Partial<Record<Exclude<Lang, "fr">, string>>;
export type Dict = Record<string, Entry>;

const STORAGE_KEY = "miftah-lang";

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (fr: string, vars?: Record<string, string | number>) => string };

const I18nContext = createContext<Ctx | null>(null);

function interpolate(s: string, vars?: Record<string, string | number>) {
  if (!vars) return s;
  return s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const search = useSearch({ from: "__root__" });
  const navigate = useNavigate();
  const lang = LANGUAGES.find((entry) => entry.code === search.lang)?.code ?? "fr";

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  useEffect(() => {
    const info = LANGUAGES.find((l) => l.code === lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = info?.rtl ? "rtl" : "ltr";
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    navigate({ to: ".", search: (previous) => ({ ...previous, lang: l }), replace: true });
    localStorage.setItem(STORAGE_KEY, l);
  }, [navigate]);

  const t = useCallback(
    (fr: string, vars?: Record<string, string | number>) => {
      const s = lang === "fr" ? fr : (DICTIONARY[fr]?.[lang] ?? fr);
      return interpolate(s, vars);
    },
    [lang],
  );

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  return ctx ?? { lang: "fr" as Lang, setLang: () => {}, t: (fr: string, vars?: Record<string, string | number>) => interpolate(fr, vars) };
}

export function useT() {
  return useI18n().t;
}
