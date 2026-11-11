import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { HandCoins, Heart, Gift, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n";
import { DONATE_ACCOUNT, DONATE_AMOUNTS, DONATE_PROVIDER } from "@/lib/site";
import { buildDonateURL, hasDonation, type DonateConfig, DEFAULT_AMOUNTS } from "@/lib/donate";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/soutenir")({
  head: () => pageHead("/soutenir", "fr"),
  component: Soutenir,
});

function Soutenir() {
  const t = useT();
  const [selected, setSelected] = useState<number>(DEFAULT_AMOUNTS[1] ?? 10);
  const amounts = DONATE_AMOUNTS.length > 0 ? DONATE_AMOUNTS : DEFAULT_AMOUNTS;
  const config: DonateConfig = {
    provider: DONATE_PROVIDER,
    account: DONATE_ACCOUNT,
    amounts,
    currency: "EUR",
    beneficiary: "Miftah",
  };
  const active = hasDonation(config);
  const donateURL = active ? buildDonateURL(config, selected) : null;
  const displayAmount = (a: number) => `${a} €`;

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-gold">Miftah</p>
      <h1 className="mt-3 text-4xl font-semibold text-primary-deep">{t("Soutenir Miftah")}</h1>
      <div className="gold-rule mt-5 w-20" />
      <p className="mt-5 text-base leading-7 text-muted-foreground">
        {t(
          "Miftah est un projet éducatif indépendant, ouvert et sans publicité. Votre soutien aide à couvrir l'hébergement et à financer le développement des outils. Aucune somme n'est obligatoire : tout le site reste libre.",
        )}
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        {/* Carte Dons */}
        <div className="surface-card flex flex-col p-6">
          <Gift className="size-7 text-gold" />
          <h2 className="mt-4 text-xl font-semibold text-primary-deep">{t("Dons")}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {t("Faites un don du montant de votre choix pour soutenir le projet.")}
          </p>

          {active && (
            <div className="mt-4">
              <div className="flex flex-wrap gap-2" role="group" aria-label={t("Choisir un montant")}>
                {amounts.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setSelected(a)}
                    className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                      selected === a
                        ? "border-gold bg-gold/15 text-primary-deep"
                        : "border-border text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    {displayAmount(a)}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                {t("Montant choisi : {amount}", { amount: displayAmount(selected) })}
              </p>
              {donateURL ? (
                <a
                  href={donateURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-emerald mt-4 flex items-center justify-center gap-2 px-4 py-2.5 font-medium"
                >
                  <Check className="size-4" />
                  {t("Faire un don")}
                </a>
              ) : (
                <Button variant="outline" className="mt-4" disabled>
                  {t("Bientôt disponible")}
                </Button>
              )}
            </div>
          )}

          {!active && (
            <Button variant="outline" className="mt-4" disabled>
              {t("Bientôt disponible")}
            </Button>
          )}
        </div>

        {/* Carte Abonnement */}
        <div className="surface-card flex flex-col p-6">
          <HandCoins className="size-7 text-gold" />
          <h2 className="mt-4 text-xl font-semibold text-primary-deep">{t("Abonnement")}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {t("Les plans Pro et Research financeront durablement le projet.")}
          </p>
          <Link to="/pricing" className="btn-emerald mt-5 text-center px-4 py-2.5 font-medium">
            {t("Voir les tarifs")}
          </Link>
        </div>

        {/* Carte Partager */}
        <div className="surface-card flex flex-col p-6">
          <Heart className="size-7 text-gold" />
          <h2 className="mt-4 text-xl font-semibold text-primary-deep">{t("Partager")}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {t("Recommandez Miftah à des proches qui étudient le texte coranique.")}
          </p>
          <Link to="/" className="btn-emerald mt-5 text-center px-4 py-2.5 font-medium">
            {t("Découvrir les outils")}
          </Link>
        </div>
      </div>
    </div>
  );
}