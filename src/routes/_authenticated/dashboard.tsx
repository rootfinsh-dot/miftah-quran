import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { useAccount } from "@/lib/account";
import { useSavedAnalyses } from "@/lib/entitlements";
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

const TOOL_LINK: Record<string, "/motifs" | "/fourchette"> = {
  motifs: "/motifs",
  fourchette: "/fourchette",
};

function Dashboard() {
  const t = useT();
  const qc = useQueryClient();
  const { user } = Route.useRouteContext();
  const { data } = useAccount(user.id);
  const saved = useSavedAnalyses(user.id);
  const plan = planInfo(data?.plan?.plan);
  const items = saved.data ?? [];
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const thisMonth = items.filter((i) => new Date(i.created_at) >= monthStart).length;
  const isFree = !data?.isAdmin && (data?.plan?.plan ?? "FREE") === "FREE";

  async function remove(id: string) {
    await supabase.from("saved_analyses").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["saved_analyses"] });
  }

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
          <p className="mt-2 text-2xl font-semibold text-primary-deep">{items.length}</p>
          {isFree && (
            <p className="mt-1 text-xs text-muted-foreground">
              {t("Ce mois-ci : {n} / {m}", { n: thisMonth, m: 10 })}
            </p>
          )}
        </div>
        <div className="surface-card p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">{t("Mon profil")}</p>
          <Link to="/profil" className="mt-3 inline-block text-sm text-primary hover:text-gold">{t("Modifier le profil →")}</Link>
        </div>
      </div>

      <div className="surface-card mt-8 p-6">
        <h2 className="text-xl font-semibold text-primary-deep">{t("Mes analyses et historique")}</h2>
        {saved.isPending ? (
          <p className="mt-4 text-sm text-muted-foreground">{t("Chargement…")}</p>
        ) : items.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            {t("Aucune analyse sauvegardée. Utilisez le bouton « Sauvegarder l'analyse » dans les outils Motifs ou Fourchette.")}
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {items.map((i) => (
              <li key={i.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                <div>
                  <p className="font-medium text-primary-deep">{i.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(i.created_at).toLocaleString()} · {Object.entries((i.summary ?? {}) as Record<string, unknown>)
                      .filter(([, v]) => typeof v === "number" || typeof v === "string")
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(" · ")}
                  </p>
                </div>
                <div className="flex gap-2">
                  {TOOL_LINK[i.tool] && (
                    <Link to={TOOL_LINK[i.tool]!} className="rounded-md border border-border px-3 py-1 hover:bg-secondary">
                      {t("Ouvrir l'outil")}
                    </Link>
                  )}
                  <button onClick={() => remove(i.id)} className="rounded-md px-3 py-1 text-destructive hover:bg-secondary">
                    {t("Supprimer")}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
