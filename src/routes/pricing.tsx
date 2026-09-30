import { createFileRoute, Link } from "@tanstack/react-router";

import { useUser } from "@/lib/auth";
import { useT } from "@/lib/i18n";
import { PLANS, formatPrice } from "@/lib/plans";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Tarifs — Miftah Free, Pro et Research" },
      { name: "description", content: "Comparez les plans Free, Pro et Research de Miftah." },
      { property: "og:title", content: "Tarifs — Miftah" },
      { property: "og:description", content: "Plans Free, Pro et Research pour l'analyse du texte coranique." },
    ],
  }),
  component: Pricing,
});

function Pricing() {
  const t = useT();
  const { user } = useUser();
  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <h1 className="text-4xl font-semibold text-primary-deep">{t("Choisissez votre plan")}</h1>
      <div className="gold-rule mt-4 w-20" />
      <p className="mt-4 text-sm text-muted-foreground">{t("Les prix sont provisoires. Le paiement en ligne sera bientôt disponible.")}</p>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {PLANS.map((p) => (
          <div key={p.code} className={`surface-card flex flex-col p-6 ${p.highlight ? "ring-2 ring-gold" : ""}`}>
            <h2 className="text-2xl font-semibold text-primary-deep">{p.name}</h2>
            <p className="mt-2 text-3xl font-semibold">
              {formatPrice(p.price)}
              <span className="text-sm font-normal text-muted-foreground"> / {t("mois")}</span>
            </p>
            <ul className="mt-5 flex-1 space-y-2 text-sm text-muted-foreground">
              {p.features.map((f) => (
                <li key={f}>✓ {t(f)}</li>
              ))}
            </ul>
            <Link
              to={p.code === "FREE" ? (user ? "/dashboard" : "/auth") : "/paiement"}
              className="btn-emerald mt-6 px-4 py-2.5 text-center font-medium"
            >
              {t(p.cta)}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
