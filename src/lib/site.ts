export const SITE_URL = "https://miftah-quran.lovable.app";
export const CONTACT_EMAIL = "rootfinsh@gmail.com";
/** Liens de soutien. À compléter quand les comptes de réception sont créés. */
export const DONATE_URL = "";
/** Configuration des dons : provider et compte (ex. PayPal, BuyMeACoffee, Ko-fi, Tipeee, Stripe, RedotPay).
 *  Tant que account est vide, le bouton « Faire un don » reste désactivé. */
export const DONATE_PROVIDER = "paypal" as const;
export const DONATE_ACCOUNT = "dabalarbi@gmail.com";
export const DONATE_AMOUNTS: number[] = [5, 10, 20, 50];
export const SEO_LANGUAGES = ["fr", "en", "ar"] as const;
export type SeoLanguage = (typeof SEO_LANGUAGES)[number];
export function seoLanguage(value: unknown): SeoLanguage {
  return value === "en" || value === "ar" ? value : "fr";
}
export function localizedURL(path: string, lang: SeoLanguage) {
  return `${SITE_URL}${path}${lang === "fr" ? "" : `?lang=${lang}`}`;
}
