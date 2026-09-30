import { createFileRoute, Link } from "@tanstack/react-router";

import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/paiement")({
  head: () => ({
    meta: [
      { title: "Paiement bientôt disponible — Miftah" },
      { name: "description", content: "Les abonnements Pro et Research de Miftah seront bientôt disponibles." },
      { property: "og:title", content: "Paiement bientôt disponible — Miftah" },
      { property: "og:description", content: "Les abonnements Pro et Research arrivent bientôt." },
    ],
  }),
  component: () => {
    const t = useT();
    return (
      <div className="mx-auto max-w-lg px-5 py-20 text-center">
        <div className="surface-card p-8">
          <h1 className="text-3xl font-semibold text-primary-deep">{t("Paiement bientôt disponible")}</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            {t("Les abonnements payants ne sont pas encore ouverts. Aucun paiement n'a été effectué. Vous pouvez continuer avec la version gratuite.")}
          </p>
          <Link to="/pricing" className="btn-emerald mt-6 inline-flex px-5 py-2.5 font-medium">{t("Retour aux tarifs")}</Link>
        </div>
      </div>
    );
  },
});
