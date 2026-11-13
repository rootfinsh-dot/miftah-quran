/** Configuration des paiements (abonnements Pro / Research).
 *
 * Les paiements restent désactivés tant qu'un provider n'est pas configuré.
 * Deux providers sont prévus : RedotPay et Stripe. Tu n'actives qu'un seul.
 * `enabled: false` tant que tu n'as pas de compte chez le provider et les clés API.
 */

export type PaymentProvider = "redotpay" | "stripe";

export const paymentsConfig = {
  enabled: true,
  provider: "redotpay" as PaymentProvider,
  /** Clé API / clé publique du provider. À renseigner quand le compte est créé. */
  apiKey: "",
  /** URL de retour après paiement réussie. */
  successUrl: "https://miftah-quran.lovable.app/soutenir",
  /** URL de retour en cas d'annulation. */
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