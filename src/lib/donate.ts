/** Configuration des dons. Chaque provider est piloté par une URL ou un identifiant.
 * Aucun provider n'est activé par défaut : renseigne la valeur dans src/lib/site.ts
 * (DONATE_PROVIDER + DONATE_ACCOUNT) pour activer le bouton de don. */

export type DonateProvider =
  | "paypal"
  | "buy-me-a-coffee"
  | "ko-fi"
  | "tipeee"
  | "stripe"
  | "redotpay"
  | "custom";

export interface DonateConfig {
  provider: DonateProvider;
  /** Identifiant ou URL de base du provider (ex: nom d'utilisateur, email, clé). */
  account: string;
  /** Montants prédéfinis en euros, dans l'ordre d'affichage. */
  amounts?: number[];
  /** Devise, par défaut EUR. */
  currency?: string;
  /** Nom affiché au donateur. */
  beneficiary?: string;
}

/** Montants prédéfinis par défaut. */
export const DEFAULT_AMOUNTS = [5, 10, 20, 50];

/** Construit l'URL de paiement selon le provider et le montant. */
export function buildDonateURL(config: DonateConfig, amount: number): string | null {
  const currency = (config.currency || "EUR").toUpperCase();
  const acc = config.account.trim();
  if (!acc) return null;

  switch (config.provider) {
    case "paypal": {
      // Bouton PayPal "Donner" : on redirige vers la page de paiement PayPal.
      const params = new URLSearchParams({
        cmd: "_donations",
        business: acc,
        item_name: config.beneficiary || "Miftah",
        currency,
        amount: String(amount),
        no_shipping: "1",
        no_note: "1",
        tax: "0",
        return: "https://miftah-quran.lovable.app/soutenir",
        cancel_return: "https://miftah-quran.lovable.app/soutenir",
      });
      return `https://www.paypal.com/cgi-bin/webscr?${params.toString()}`;
    }
    case "buy-me-a-coffee":
      return `https://www.buymeacoffee.com/${encodeURIComponent(acc)}?currency=${currency}&custom=${amount}`;
    case "ko-fi":
      return `https://ko-fi.com/${encodeURIComponent(acc)}?currency=${currency}&amount=${amount}`;
    case "tipeee":
      return `https://www.tipeee.com/donate/${encodeURIComponent(acc)}?amount=${amount}&currency=${currency}`;
    case "stripe":
      // Redirection vers une page d'checkout Stripe (URL fournie par le créateur).
      return acc.includes("?") ? `${acc}&amount=${amount}` : `${acc}?amount=${amount}`;
    case "redotpay":
      // RedotPay : URL de checkout fournie par le merchant (à compléter).
      return acc.includes("?") ? `${acc}&amount=${amount}` : `${acc}?amount=${amount}`;
    case "custom":
    default:
      return acc;
  }
}

/** True si un provider est configuré et utilisable. */
export function hasDonation(config: DonateConfig | null): config is DonateConfig {
  return !!config && !!config.provider && !!config.account.trim();
}