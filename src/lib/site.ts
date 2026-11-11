export const SITE_URL = "https://miftah-quran.lovable.app";
export const CONTACT_EMAIL = "rootfinsh@gmail.com";
export const DONATE_URL = "";

/** Configuration des comptes de don (PayPal et RedotPay activables simultanément).
 *  - paypal : mettre votre identifiant PayPal.Me (ex: "dabalarbi") ou votre email.
 *  - redotpay : mettre votre lien ou identifiant de paiement RedotPay.
 *  Si un compte est vide (""), le bouton correspondant restera désactivé.
 */
export const DONATE_ACCOUNTS = {
  paypal: "dabalarbi",
  redotpay: "",
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
