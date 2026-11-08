/** No publisher, scripts or slots are supplied until Google approval and a certified CMP are verified. */
export const advertisingConfig = {
  enabled: false,
  approved: false,
  publisherId: "",
  cmpCertified: false,
  slots: { footer: "" },
} as const;

export type AdvertisingSettings = { enabled: boolean; approved: boolean; publisherId: string; cmpCertified: boolean };
export function mayLoadAdvertising(config: AdvertisingSettings, consent: boolean) {
  return config.enabled && config.approved && config.cmpCertified && consent && /^ca-pub-\d{16}$/.test(config.publisherId);
}