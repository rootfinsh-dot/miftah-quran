import { createFileRoute, Link } from "@tanstack/react-router";

import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Miftah — analyse mathématique du Coran" },
      {
        name: "description",
        content:
          "Analysez le texte coranique : comptage de mots et de lettres, statistiques des sourates, motifs numériques et valeurs abjad.",
      },
      { property: "og:title", content: "Miftah — analyse mathématique du Coran" },
      {
        property: "og:description",
        content:
          "Comptages, statistiques, motifs numériques et gématrie du texte coranique, avec traduction française.",
      },
    ],
  }),
  component: Index,
});

const CARDS = [
  {
    to: "/comptage" as const,
    title: "Comptage de mots et lettres",
    text: "Cherchez un mot ou une lettre en arabe et obtenez ses occurrences, sourate par sourate, avec les versets concernés et leur traduction.",
  },
  {
    to: "/statistiques" as const,
    title: "Statistiques des sourates",
    text: "Versets, mots, lettres et valeur abjad de chaque sourate, avec classements, diagrammes et comparaison Mecque / Médine.",
  },
  {
    to: "/motifs" as const,
    title: "Motifs numériques",
    text: "Testez la divisibilité par 19 ou tout autre diviseur, explorez les sourates dont le numéro égale leur nombre de versets et d'autres symétries.",
  },
  {
    to: "/gematrie" as const,
    title: "Gématrie (abjad)",
    text: "Calculez la valeur numérique d'un mot ou d'un verset, lettre par lettre, selon la table abjad classique.",
  },
  {
    to: "/fourchette" as const,
    title: "Comptage par fourchette",
    text: "Saisissez une sourate et un verset de début et de fin pour compter les versets, mots et lettres de la plage choisie.",
  },
];

function Index() {
  const t = useT();
  return (
    <div>
      <section className="emerald-panel relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 70% 60%, white 1px, transparent 1px)",
            backgroundSize: "48px 48px, 64px 64px",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-5 py-20 sm:py-28">
          <p className="text-xs uppercase tracking-[0.3em] text-gold-soft">
            {t("Lecture quantitative du texte")}
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight sm:text-6xl">
            {t("Mesurer, compter et comparer le texte du Coran")}
          </h1>
          <p className="mt-6 max-w-2xl text-base text-primary-foreground/85 sm:text-lg">
            {t(
              "Miftah calcule directement sur le texte arabe intégral (recension Uthmani) et affiche la traduction française à côté de chaque verset. Toutes les analyses sont transparentes et reproductibles.",
            )}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/comptage" className="btn-emerald border border-gold/40 px-6 py-3 font-medium">
              {t("Lancer une analyse")}
            </Link>
            <Link
              to="/statistiques"
              className="inline-flex items-center rounded-md border border-primary-foreground/30 px-6 py-3 font-medium transition-colors hover:bg-primary-foreground/10"
            >
              {t("Voir les statistiques")}
            </Link>
          </div>
          <p className="arabic mt-12 text-2xl text-gold-soft">
            وَكُلَّ شَىْءٍ أَحْصَيْنَٰهُ كِتَٰبًا
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="text-3xl font-semibold text-primary-deep">{t("Quatre outils d'analyse")}</h2>
        <div className="gold-rule mt-4 w-20" />
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {CARDS.map((card) => (
            <Link
              key={card.to}
              to={card.to}
              className="surface-card group p-6 transition-transform hover:-translate-y-1"
            >
              <h3 className="text-xl font-semibold text-primary-deep">{t(card.title)}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t(card.text)}</p>
              <span className="mt-5 inline-block text-sm font-medium text-primary group-hover:text-gold">
                {t("Ouvrir →")}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-8">
        <div className="surface-card p-8">
          <h2 className="text-2xl font-semibold text-primary-deep">{t("Comment les comptages sont faits")}</h2>
          <ul className="mt-5 space-y-3 text-sm leading-relaxed text-muted-foreground">
            <li>
              {t(
                "Les signes diacritiques et les allongements sont retirés avant comparaison, et les variantes de l'alif sont unifiées : les résultats ne dépendent donc pas de la vocalisation.",
              )}
            </li>
            <li>
              {t(
                "Un mot est une suite de caractères séparée par des espaces ; vous pouvez choisir la recherche exacte (mot entier) ou partielle (racine incluse dans un mot).",
              )}
            </li>
            <li>
              {t("Les valeurs numériques suivent la table abjad classique (ا=1, ب=2, ج=3, … غ=1000).")}
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
