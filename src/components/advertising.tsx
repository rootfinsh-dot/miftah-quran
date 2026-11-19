import { advertisingConfig, AdSenseAdUnits, mayLoadAdvertising } from "@/lib/advertising";

/**
 * Composant publicitaire Google AdSense.
 *
 * Rendu uniquement lorsque toutes les conditions sont réunies
 * (config activée + approuvée + CMP certifié + consentement de l'utilisateur).
 * Quand OK et qu'une unité est déclarée, le script `adsbygoogle.js` et le slot
 * sont chargés côté client.
 */
export function AdvertisingSlot({ consent = false }: { consent?: boolean }) {
  if (!mayLoadAdvertising(advertisingConfig, consent)) return null;

  return (
    <aside aria-label="Advertising" className="mx-auto min-h-24 w-full max-w-6xl px-5 sm:min-h-28">
      <script
        async
        src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
        crossOrigin="anonymous"
      />
      {AdSenseAdUnits.map((ad) => (
        <ins
          key={ad.slot}
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={advertisingConfig.publisherId}
          data-ad-slot={ad.slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ))}
      {AdSenseAdUnits.map((_ad, i) => (
        <script
          key={i}
          src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
          crossOrigin="anonymous"
        />
      ))}
    </aside>
  );
}
