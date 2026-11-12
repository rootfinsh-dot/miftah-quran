/** Configuration centralisée de la publicité (AdSense).
 *
 * La publicité reste désactivée tant que Google n'a pas approuvé le site et que
 * les réglages ci-dessous ne sont pas remplis. Deux pré-requis Google :
 *   - un publisher ID valide (format ca-pub-<16 chiffres>) ;
 *   - une plateforme de consentement certifiée (CMP) pour l'EEE/RU/CH.
 * Tant que approved/cmpCertified restent à false, aucun script n'est chargé.
 */

export const advertisingConfig = {
  enabled: false,
  approved: false,
  publisherId: "",
  cmpCertified: false,
} as const;

export type AdvertisingSettings = {
  enabled: boolean;
  approved: boolean;
  publisherId: string;
  cmpCertified: boolean;
};

/** True si la publicité doit réellement être chargée (toutes les conditions vérifiées). */
export function mayLoadAdvertising(
  config: AdvertisingSettings,
  consent: boolean,
): boolean {
  return (
    config.enabled &&
    config.approved &&
    config.cmpCertified &&
    consent &&
    /^ca-pub-\d{16}$/.test(config.publisherId)
  );
}

/** Clé de stockage du consentement publicitaire (localStorage). */
export const CONSENT_STORAGE_KEY = "miftah-privacy-consent";

/** Lit le consentement enregistré. */
export function getConsent(): boolean {
  try {
    return localStorage.getItem(CONSENT_STORAGE_KEY) === "ad-granted";
  } catch {
    return false;
  }
}