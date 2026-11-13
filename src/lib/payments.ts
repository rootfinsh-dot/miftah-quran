/** Configuration des paiements (abonnements Pro / Research). */

export type PaymentProvider = "redotpay" | "stripe";

export const paymentsConfig = {
  enabled: true,
  provider: "redotpay" as PaymentProvider,
  /** Clé temporaire pour activer l'interface. Remplacez par votre vraie clé dès réception. */
  apiKey: "DEMO_KEY_ACTIVATE_UI",
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
  return config.enabled && config.apiKey.trim().length > 0;
}
