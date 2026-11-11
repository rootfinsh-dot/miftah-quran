export const SITE_URL = "https://miftah-quran.lovable.app";
export const CONTACT_EMAIL = "rootfinsh@gmail.com";
export const DONATE_URL = "";

/** Configuration des comptes de don.
 *  - paypal : mettre votre email (ex: "dabalarbi@gmail.com").
 *  - redotpay : mettre votre UID et Surnom pour instructions.
 */
export const DONATE_ACCOUNTS = {
  paypal: "dabalarbi@gmail.com",
  redotpay: "UID: 1471439889 | Surnom: larbiou",
};

export const DONATE_AMOUNTS: number[] = [5, 10, 20, 50];
export const SEO_LANGUAGES = ["fr", "en", "ar"] as const;
export type SeoLanguage = (typeof SEO_LANGUAGES)[number];
export function seoLanguage(value: unknown): SeoLanguage {
  return value === "en" || value === "ar" ? value : "fr";
}
export function localizedURL(path: string, lang: SeoLanguage) {
  return `${SITE_URL}${path}${lang === "fr" ? "" : `?lang=${lang}`}`;
}
