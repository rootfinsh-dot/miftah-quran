import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n";

export function PrivacySettings() {
  const [open, setOpen] = useState(false);
  const t = useT();
  return <>
    <Button variant="ghost" size="sm" onClick={() => setOpen(true)}><ShieldCheck />{t("Réglages de confidentialité")}</Button>
    {open && <div className="fixed inset-0 z-[70] flex items-center justify-center bg-foreground/40 p-5" onClick={() => setOpen(false)}>
      <section role="dialog" aria-modal="true" aria-labelledby="privacy-title" className="relative w-full max-w-lg rounded-md border border-border bg-card p-6 shadow-lg" onClick={(event) => event.stopPropagation()} onKeyDown={(event) => event.key === "Escape" && setOpen(false)}>
        <Button autoFocus variant="ghost" size="icon" className="absolute end-3 top-3" aria-label={t("Fermer")} onClick={() => setOpen(false)}><X /></Button>
        <h2 id="privacy-title" className="pe-9 text-2xl text-primary-deep">{t("Réglages de confidentialité")}</h2>
        <p className="mt-5 text-sm leading-6 text-muted-foreground">{t("La publicité et le suivi publicitaire sont désactivés. Aucun consentement publicitaire n'est demandé ou enregistré.")}</p>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{t("Les préférences de langue et la session de connexion utilisent le stockage nécessaire au fonctionnement du site.")}</p>
        <Button variant="outline" className="mt-5" onClick={() => { localStorage.removeItem("miftah-privacy-consent"); setOpen(false); }}>{t("Maintenir la publicité désactivée")}</Button>
        <Button asChild variant="link" className="mt-3"><Link to="/privacy" onClick={() => setOpen(false)}>{t("Politique de confidentialité")}</Link></Button>
      </section>
    </div>}
  </>;
}