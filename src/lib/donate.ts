/** Configuration multi-providers pour les dons (PayPal avec email + RedotPay avec infos). */

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
      // Utilisation du lien de paiement direct PayPal avec email
      const params = new URLSearchParams({
        cmd: "_donations",
        business: acc, // Ici, l'email fonctionne directement
        item_name: "Miftah Quran",
        currency: cur,
        amount: String(amount),
        no_shipping: "1",
        no_note: "1",
      });
      return `https://www.paypal.com/cgi-bin/webscr?${params.toString()}`;
    }
    case "redotpay":
      // RedotPay ne propose pas de lien de don direct via URL web.
      // On retourne une URL vide pour que le bouton affiche des instructions (voir soutenir.tsx)
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
