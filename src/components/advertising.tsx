import { useEffect, useRef } from "react";

import { advertisingConfig, mayLoadAdvertising, getConsent } from "@/lib/advertising";

/**
 * Emplacement publicitaire (AdSense). Ne charge le script Google et n'affiche
 * le slot que si :
 *   - la publicité est activée et approuvée (advertisingConfig) ;
 *   - le publisher ID est valide (ca-pub-… ) ;
 *   - une CMP certifiée est active ;
 *   - le visiteur a donné son consentement.
 * Tant que ces conditions ne sont pas réunies, le composant ne rend rien.
 */
export function AdvertisingSlot({ consent = false }: { consent?: boolean }) {
  const shouldLoad = mayLoadAdvertising(advertisingConfig, consent);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!shouldLoad) return;
    const pubId = advertisingConfig.publisherId;
    if (!pubId || !containerRef.current) return;

    // Charge le script AdSense une seule fois au niveau du document.
    const existing = document.querySelector('script[data-miftah-adsense]');
    if (!existing) {
      const script = document.createElement("script");
      script.setAttribute("data-miftah-adsense", "true");
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pubId}`;
      script.async = true;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    }

    const slot = document.createElement("ins");
    slot.className = "adsbygoogle";
    slot.style.display = "block";
    slot.dataset.adClient = pubId;
    slot.dataset.adSlot = `miftah-footer-${Date.now()}`;
    slot.dataset.adFormat = "auto";
    slot.dataset.adFullWidthResponsive = "true";
    containerRef.current.appendChild(slot);
    containerRef.current.setAttribute("data-ad-ready", "true");
    return;
  }, [shouldLoad]);

  if (!shouldLoad) return null;
  return <aside aria-label="Advertising" className="mx-auto w-full max-w-6xl px-5 py-4"><div ref={containerRef} className="min-h-24 w-full sm:min-h-28" /></aside>;
}