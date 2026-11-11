/** Configuration multi-providers pour les dons (PayPal corrigé sans restriction + RedotPay). */

export type DonateProvider = "paypal" | "redotpay" | "buy-me-a-coffee" | "ko-fi" | "stripe" | "custom";

export interface DonateConfig {
  provider: DonateProvider;
  account: string;
  amounts?: number[];
  currency?: string;
  beneficiary?: string;
}

export const DEFAULT_AMOUNTS = [5, 10, 20, 50];

/** Construit l'URL de paiement selon le provider et le montant. */
export function buildDonateURL(provider: DonateProvider, account: string, amount: number, currency = "EUR"): string | null {
  const acc = account.trim();
  if (!acc) return null;
  const cur = currency.toUpperCase();

  switch (provider) {
    case "paypal": {
      // Si c'est un identifiant PayPal.Me (sans @), utilise le lien direct PayPal.Me (évite l'erreur de pays)
      if (!acc.includes("@")) {
        return `https://paypal.me/${encodeURIComponent(acc)}/${amount}${cur}`;
      }
      // Sinon lien de don standard
      const params = new URLSearchParams({
        cmd: "_donations",
        business: acc,
        item_name: "Miftah Quran",
        currency: cur,
        amount: String(amount),
        no_shipping: "1",
        no_note: "1",
      });
      return `https://www.paypal.com/cgi-bin/webscr?${params.toString()}`;
    }
    case "redotpay":
      return acc.includes("?") ? `${acc}&amount=${amount}` : `${acc}?amount=${amount}`;
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
