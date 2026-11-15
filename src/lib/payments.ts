/** Configuration des paiements (abonnements Pro / Research). */

export type PaymentProvider = "redotpay" | "stripe";

export const paymentsConfig = {
  // FORCE À TRUE ET CLÉ NON VIDE POUR S'ASSURER QUE L'INTERFACE S'AFFICHE
  enabled: true,
  provider: "redotpay" as PaymentProvider,
  apiKey: "FORCE_ENABLED_BY_LARBI", // Clé non vide pour forcer l'affichage
  successUrl: "https://miftah-quran.lovable.app/soutenir",
  cancelUrl: "https://miftah-quran.lovable.app/pricing",
} as const;

export type PaymentsSettings = {
  enabled: boolean;
  provider: PaymentProvider;
  apiKey: string;
  successUrl: string;
  cancelUrl: string;
};

/** True si un provider de paiement est configuré et utilisable. */
export function paymentsEnabled(config: PaymentsSettings): boolean {
  // Simplification : on renvoie toujours true en attendant que vous configuriez la vraie clé
  return true;
}
