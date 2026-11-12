import { advertisingConfig, mayLoadAdvertising } from "@/lib/advertising";
export function AdvertisingSlot({ consent = false }: { consent?: boolean }) {
 if (!mayLoadAdvertising(advertisingConfig, consent)) return null;
 return <aside aria-label="Advertising" className="mx-auto min-h-24 w-full max-w-6xl px-5 sm:min-h-28" />;
}
