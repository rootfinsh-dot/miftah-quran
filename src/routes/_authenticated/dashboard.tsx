import { createFileRoute, Link } from "@tanstack/react-router";

import { useAccount } from "@/lib/account";
import { useT } from "@/lib/i18n";
import { planInfo } from "@/lib/plans";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Tableau de bord — Miftah" },
      { name: "description", content: "Votre espace personnel Miftah." },
      { property: "og:title", content: "Tableau de bord — Miftah" },
      { property: "og:description", content: "Votre espace personnel Miftah." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const t = useT();
  const { user } = Route.useRouteContext();
  const { data } = useAccount(user.id);
  const plan = planInfo(data?.plan?.plan);
  const soon = ["Mes analyses", "Historique", "Mes rapports", "Mes exports"];

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <h1 className="text-3xl font-semibold text-primary-deep">
        {t("Bonjour")} {data?.profile?.display_name ?? ""}
      </h1>
      <div className="gold-rule mt-3 w-16" />
      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        <div className="surface-card p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">{t("Plan actuel")}</p>
          <p className="mt-2 text-2xl font-semibold text-primary-deep">{data?.isAdmin ? "Admin" : plan.name}</p>
          <Link to="/subscription" className="mt-3 inline-block text-sm text-primary hover:text-gold">{t("Mon abonnement →")}</Link>
        </div>
        <div className="surface-card p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">{t("Analyses sauvegardées")}</p>
          <p className="mt-2 text-2xl font-semibold text-primary-deep">0</p>
        </div>
        <div className="surface-card p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">{t("Mon profil")}</p>
          <Link to="/profil" className="mt-3 inline-block text-sm text-primary hover:text-gold">{t("Modifier le profil →")}</Link>
        </div>
      </div>
      <div className="mt-8 grid gap-3 sm:grid-cols-4">
        {soon.map((s) => (
          <div key={s} className="surface-card p-4 text-sm text-muted-foreground">
            <p className="font-medium text-primary-deep">{t(s)}</p>
            <p className="mt-1 text-xs">{t("Bientôt disponible")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
