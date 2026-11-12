import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Lock } from "lucide-react";

import { useUser } from "@/lib/auth";
import { useT } from "@/lib/i18n";
import { PLANS, formatPrice, planInfo, type PlanCode } from "@/lib/plans";
import { paymentsConfig, paymentsEnabled } from "@/lib/payments";
import { pageHead } from "@/lib/seo";

type PaymentSearch = { plan?: PlanCode };

export const Route = createFileRoute("/paiement")({
  head: ({ match }) => pageHead("/paiement", match.search.lang, false),
  validateSearch: (search: Record<string, unknown>): PaymentSearch => {
    const plan = search["plan"];
    return plan === "PRO" || plan === "RESEARCH" || plan === "FREE" ? { plan } : {};
  },
  component: Paiement,
});

function Paiement() {
  const t = useT();
  const { plan } = Route.useSearch();
  const { user } = useUser();
  const selected = planInfo(plan);
  const isFree = selected.price === 0;
  const checkoutReady = paymentsEnabled(paymentsConfig);

  return (
    <div className="mx-auto max-w-lg px-5 py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-gold">Miftah</p>
      <h1 className="mt-3 text-3xl font-semibold text-primary-deep">
        {isFree ? t("Votre accès gratuit") : t("Finaliser votre abonnement")}
      </h1>
      <div className="gold-rule mt-4 w-20" />

      <div className="surface-card mt-8 p-6">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-xl font-semibold text-primary-deep">{selected.name}</h2>
          <p className="text-lg font-semibold">
            {formatPrice(selected.price)}
            {selected.price > 0 && (
              <span className="text-sm font-normal text-muted-foreground"> / {t("mois")}</span>
            )}
          </p>
        </div>

        {isFree && (
          <p className="mt-3 rounded-md border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-primary-deep">
            {t("Aucun paiement n'est requis. Aucun moyen de paiement n'est demandé.")}
          </p>
        )}

        <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
          {selected.features.map((f) => (
            <li key={f} className="flex items-start gap-2">
              <Check className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>{t(f)}</span>
            </li>
          ))}
        </ul>

        {isFree ? (
          <div className="mt-7 flex flex-wrap gap-2">
            <Link to={user ? "/dashboard" : "/auth"} className="btn-emerald px-5 py-2.5 font-medium">
              {user ? t("Accéder à mes outils") : t("Créer un compte gratuit")}
            </Link>
            <Link
              to="/comptage"
              className="rounded-md border border-border px-5 py-2.5 font-medium hover:bg-secondary"
            >
              {t("Utiliser sans compte")}
            </Link>
          </div>
        ) : checkoutReady ? (
          <div className="mt-7">
            <p className="text-sm text-muted-foreground">
              {user
                ? t("Compte : {email}", { email: user.email ?? "—" })
                : t("Créez un compte avant de payer pour activer votre abonnement.")}
            </p>
            <Link
              to={user ? "/pricing" : "/auth"}
              className="btn-emerald mt-4 inline-flex px-5 py-2.5 font-medium"
            >
              {user ? t("Procéder au paiement") : t("Se connecter pour payer")}
            </Link>
          </div>
        ) : (
          <div className="mt-7">
            <p className="flex items-start gap-2 text-sm text-muted-foreground">
              <Lock className="mt-0.5 size-4 shrink-0 text-gold" />
              <span>
                {t(
                  "Le paiement en ligne n'est pas encore ouvert. Vous utilisez déjà gratuitement les outils de base : comptage, statistiques, gématrie et fourchette.",
                )}
              </span>
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link to="/comptage" className="btn-emerald px-5 py-2.5 font-medium">
                {t("Continuer gratuitement")}
              </Link>
              <Link
                to="/pricing"
                className="rounded-md border border-border px-5 py-2.5 font-medium hover:bg-secondary"
              >
                {t("Voir tous les plans")}
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        <Link to="/pricing" className="underline underline-offset-4 hover:text-primary-deep">
          {t("Retour aux tarifs")}
        </Link>
        <span className="mx-2">·</span>
        <Link to="/soutenir" className="underline underline-offset-4 hover:text-primary-deep">
          {t("Soutenir sans abonnement")}
        </Link>
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        {t("Plans disponibles : {list}", { list: PLANS.map((p) => p.name).join(" · ") })}
      </p>
    </div>
  );
}