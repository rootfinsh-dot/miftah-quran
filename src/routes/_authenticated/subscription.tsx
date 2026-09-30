import { createFileRoute, Link } from "@tanstack/react-router";

import { useAccount } from "@/lib/account";
import { useT } from "@/lib/i18n";
import { formatPrice, planInfo } from "@/lib/plans";

export const Route = createFileRoute("/_authenticated/subscription")({
  head: () => ({
    meta: [
      { title: "Mon abonnement — Miftah" },
      { name: "description", content: "Plan, statut et fonctionnalités de votre abonnement Miftah." },
      { property: "og:title", content: "Mon abonnement — Miftah" },
      { property: "og:description", content: "Gérez votre abonnement Miftah." },
    ],
  }),
  component: Subscription,
});

function Subscription() {
  const t = useT();
  const { user } = Route.useRouteContext();
  const { data } = useAccount(user.id);
  const plan = planInfo(data?.plan?.plan);
  const start = data?.plan?.created_at ? new Date(data.plan.created_at).toLocaleDateString() : "—";

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="text-3xl font-semibold text-primary-deep">{t("Mon abonnement")}</h1>
      <div className="gold-rule mt-3 w-16" />
      <div className="surface-card mt-8 p-6">
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <dt className="text-muted-foreground">{t("Plan actuel")}</dt><dd className="font-semibold">{plan.name}</dd>
          <dt className="text-muted-foreground">{t("Statut")}</dt><dd>{data?.plan?.status ?? "—"}</dd>
          <dt className="text-muted-foreground">{t("Date de début")}</dt><dd>{start}</dd>
          <dt className="text-muted-foreground">{t("Date de renouvellement")}</dt><dd>—</dd>
          <dt className="text-muted-foreground">{t("Prix")}</dt><dd>{formatPrice(plan.price)} / {t("mois")}</dd>
        </dl>
        <h2 className="mt-6 font-semibold text-primary-deep">{t("Fonctionnalités disponibles")}</h2>
        <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
          {plan.features.map((f) => <li key={f}>✓ {t(f)}</li>)}
        </ul>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link to="/paiement" className="btn-emerald px-4 py-2 text-sm font-medium">{t("Passer à un plan supérieur")}</Link>
          <Link to="/pricing" className="rounded-md border border-border px-4 py-2 text-sm hover:bg-secondary">{t("Changer de plan")}</Link>
          <Link to="/paiement" className="rounded-md border border-border px-4 py-2 text-sm hover:bg-secondary">{t("Annuler")}</Link>
        </div>
      </div>
    </div>
  );
}
