/** Configuration multi-providers pour les dons (PayPal standardisé sans restriction + RedotPay). */

export type DonateProvider = "paypal" | "redotpay" | "buy-me-a-coffee" | "ko-fi" | "stripe" | "custom";

export interface DonateConfig {
  provider: DonateProvider;
  account: string;
  amounts?: number[];
  currency?: string;
  beneficiary?: string;
}

export const DEFAULT_AMOUNTS = [5, 10, 20, 50];

/** Construit l'URL de paiement ou retourne les instructions. */
export function buildDonateURL(provider: DonateProvider, account: string, amount: number, currency = "EUR"): string | null {
  const acc = account.trim();
  if (!acc) return null;
  const cur = currency.toUpperCase();

  switch (provider) {
    case "paypal": {
      // UTILISATION DE LA COMMANDE _xclick (Standard) au lieu de _donations (Restrictif)
      const params = new URLSearchParams({
        cmd: "_xclick",
        business: acc, // Votre email
        item_name: "Soutien Miftah Quran",
        currency_code: cur,
        amount: String(amount),
        no_shipping: "1",
        no_note: "1",
        return: "https://miftah-quran.lovable.app/soutenir",
        cancel_return: "https://miftah-quran.lovable.app/soutenir",
      });
      return `https://www.paypal.com/cgi-bin/webscr?${params.toString()}`;
    }
    case "redotpay":
      return null;
    case "buy-me-a-coffee":
      return `https://www.buymeacoffee.com/${encodeURIComponent(acc)}?currency=${cur}&custom=${amount}`;
    case "ko-fi":
      return `https://ko-fi.com/${encodeURIComponent(acc)}?currency=${cur}&amount=${amount}`;
    case "stripe":
      return acc.includes("?") ? `${acc}&amount=${amount}` : `${acc}?amount=${amount}`;
    case "custom":
    default:
      return acc;
  }
}
