export const SITE_URL = "https://quran-math.lovable.app";
export const CONTACT_EMAIL = "rootfinsh@gmail.com";
export const SEO_LANGUAGES = ["fr", "en", "ar"] as const;
export type SeoLanguage = (typeof SEO_LANGUAGES)[number];
export function seoLanguage(value: unknown): SeoLanguage {
  return value === "en" || value === "ar" ? value : "fr";
}
export function localizedURL(path: string, lang: SeoLanguage) {
  return `${SITE_URL}${path}${lang === "fr" ? "" : `?lang=${lang}`}`;
}