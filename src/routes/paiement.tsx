import { createFileRoute, Link } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { useT } from "@/lib/i18n";
import { useUser } from "@/lib/auth";
import { PLANS, formatPrice, type PlanCode } from "@/lib/plans";
import { buildDonateURL } from "@/lib/donate";
import { CONTACT_EMAIL, DONATE_ACCOUNTS } from "@/lib/site";

type PaiementSearch = { plan?: PlanCode };

export const Route = createFileRoute("/paiement")({
  validateSearch: (s: Record<string, unknown>): PaiementSearch => {
    const p = String(s["plan"] ?? "").toUpperCase();
    return p === "PRO" || p === "RESEARCH" || p === "FREE" ? { plan: p as PlanCode } : {};
  },
  head: ({ match }) => pageHead("/paiement", (match.search as { lang?: string }).lang, false),
  component: PaiementPage,
});

function PaiementPage() {
  const t = useT();
  const { user } = useUser();
  const { plan: code = "FREE" } = Route.useSearch();
  const plan = PLANS.find((p) => p.code === code) ?? PLANS[0]!;

  if (plan.code === "FREE") {
    return (
      <div className="mx-auto max-w-3xl px-5 py-12">
        <div className="surface-card p-8 text-center">
          <h1 className="text-2xl font-semibold text-primary-deep">{t("Votre accès gratuit")}</h1>
          <div className="gold-rule mx-auto my-4 w-16" />
          <p className="mb-6 text-muted-foreground">{t("Aucun paiement n'est requis.")}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/comptage" className="btn-emerald px-6 py-3 font-medium">
              {t("Utiliser maintenant")}
            </Link>
            <Link
              to="/pricing"
              className="rounded-md border border-border px-6 py-3 hover:bg-secondary"
            >
              {t("Voir les offres payantes")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const ref = user?.email ?? "";
  const paypalUrl = buildDonateURL("paypal", DONATE_ACCOUNTS.paypal, plan.price)?.replace(
    "item_name=Soutien+Miftah+Quran",
    `item_name=${encodeURIComponent(`Miftah ${plan.name} - 1 mois${ref ? ` - ${ref}` : ""}`)}`,
  );

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="text-3xl font-semibold text-primary-deep">{t("Paiement")}</h1>
      <div className="gold-rule mt-3 w-16" />
      <div className="surface-card mt-8 p-8">
        <h2 className="text-2xl font-semibold text-primary-deep">{plan.name}</h2>
        <p className="mt-2 text-3xl font-semibold">
          {formatPrice(plan.price)}{" "}
          <span className="text-sm font-normal text-muted-foreground">/ {t("mois")}</span>
        </p>
        <ul className="mt-5 space-y-1 text-sm text-muted-foreground">
          {plan.features.map((f) => (
            <li key={f}>✓ {t(f)}</li>
          ))}
        </ul>

        {!user ? (
          <div className="mt-6">
            <p className="mb-3 text-sm text-muted-foreground">
              {t("Connectez-vous d'abord pour que votre plan soit activé sur votre compte.")}
            </p>
            <Link to="/auth" className="btn-emerald inline-block px-6 py-3 font-medium">
              {t("Se connecter")}
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {paypalUrl && (
              <a
                href={paypalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-emerald inline-block px-8 py-3 font-medium"
              >
                {t("Payer avec PayPal")} — {formatPrice(plan.price)}
              </a>
            )}
            <div className="rounded-md border border-border p-4 text-sm">
              <p className="font-medium">RedotPay</p>
              <p className="mt-1 font-mono text-muted-foreground">{DONATE_ACCOUNTS.redotpay}</p>
            </div>
            <p className="text-xs text-muted-foreground">
              {t("Après le paiement, envoyez votre reçu à")}{" "}
              <a
                className="underline"
                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Activation ${plan.name} - ${ref}`)}`}
              >
                {CONTACT_EMAIL}
              </a>
              . {t("Votre plan sera activé manuellement sous 24 h.")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
