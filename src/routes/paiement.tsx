import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useMemo } from "react";
import { useT } from "@/lib/i18n";
import { paymentsConfig, paymentsEnabled } from "@/lib/payments";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/paiement")({
  component: PaiementPage,
});

type PaiementSearch = { plan?: string };

function PaiementPage() {
  const t = useT();
  const search = useSearch({ from: "/paiement" }) as PaiementSearch;
  const plan = search.plan || "FREE";

  const enabled = useMemo(() => paymentsEnabled(paymentsConfig), []);

  const plans = {
    FREE: {
      name: t("Gratuit"),
      price: "0 €",
      features: ["Comptage de mots/lettres", "Statistiques des sourates", "Gématrie abjad", "Comptage par fourchette"],
    },
    PRO: {
      name: t("Pro"),
      price: "9 €/mois",
      features: ["Tout l'offre gratuite", "Analyses avancées", "Export des données", "Support prioritaire"],
    },
    RESEARCH: {
      name: t("Research"),
      price: "19 €/mois",
      features: ["Tout l'offre Pro", "Motifs numériques illimités", "Accès API", "Collaboration"],
    },
  } as const;

  const currentPlan = plans[plan as keyof typeof plans] || plans.FREE;

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <h1 className="text-3xl font-bold text-primary-deep mb-2">
        {t("Paiement")}
      </h1>
      <p className="text-muted-foreground mb-8">
        {t("Plan sélectionné")} : <strong>{currentPlan.name}</strong> — {currentPlan.price}
      </p>

      {/* Cas 1 : FREE */}
      {plan === "FREE" && (
        <div className="surface-card p-8 text-center">
          <div className="text-5xl mb-4">🎁</div>
          <h2 className="text-2xl font-semibold text-primary-deep mb-2">
            {t("Votre accès gratuit")}
          </h2>
          <div className="gold-rule mx-auto my-4 w-16" />
          <p className="text-muted-foreground mb-6">
            {t("Aucun paiement n'est requis.")}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/comptage" className="btn-emerald px-6 py-3 font-medium">
              {t("Utiliser maintenant")}
            </Link>
            <Link to="/pricing" className="px-6 py-3 rounded-md border border-border hover:bg-secondary">
              {t("Voir les offres payantes")}
            </Link>
          </div>
        </div>
      )}

      {/* Cas 2 : Paiement configuré (PRO/RESEARCH) */}
      {plan !== "FREE" && enabled && (
        <div className="surface-card p-8">
          <h2 className="text-2xl font-semibold text-primary-deep mb-2">
            {currentPlan.name}
          </h2>
          <p className="text-4xl font-bold text-gold mb-6">{currentPlan.price}</p>
          <ul className="mb-8 space-y-2">
            {currentPlan.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm">
                <span className="text-emerald-600">✓</span> {f}
              </li>
            ))}
          </ul>

          <a
            href={paymentsConfig.successUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-emerald inline-block px-8 py-3 font-medium text-center"
          >
            {t("Payer maintenant")}
          </a>
          <p className="mt-4 text-xs text-muted-foreground">
            {t("Vous serez redirigé vers le secure checkout.")}
          </p>
        </div>
      )}

      {/* Cas 3 : Paiement non configuré (PRO/RESEARCH) */}
      {plan !== "FREE" && !enabled && (
        <div className="surface-card p-8 text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-2xl font-semibold text-primary-deep mb-2">
            {t("Paiement pas encore ouvert")}
          </h2>
          <p className="text-muted-foreground mb-6">
            {t("Le paiement en ligne pour le plan")} {currentPlan.name} {t("n'est pas encore disponible.")}
          </p>
          <div className="gold-rule mx-auto my-4 w-16" />
          <p className="text-muted-foreground mb-6">
            {t("Vous utilisez déjà gratuitement les outils de base : comptage, statistiques, gématrie et fourchette.")}
          </p>
          <Link to="/pricing" className="btn-emerald px-6 py-3 font-medium">
            {t("Retour aux offres")}
          </Link>
        </div>
      )}
    </div>
  );
}