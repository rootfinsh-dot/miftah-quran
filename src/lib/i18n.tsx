import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

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
  const [lang, setLangState] = useState<Lang>("fr");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (saved && LANGUAGES.some((l) => l.code === saved)) setLangState(saved);
  }, []);

  useEffect(() => {
    const info = LANGUAGES.find((l) => l.code === lang)!;
    document.documentElement.lang = lang;
    document.documentElement.dir = info.rtl ? "rtl" : "ltr";
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem(STORAGE_KEY, l);
  }, []);

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
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}

export function useT() {
  return useI18n().t;
}
