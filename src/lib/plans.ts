/** Configuration centrale des plans. Prix provisoires, modifiables ici. */
export type PlanCode = "FREE" | "PRO" | "RESEARCH" | "ADMIN";

export const PLANS = [
  {
    code: "FREE" as const,
    name: "Free",
    price: 0,
    cta: "Commencer gratuitement",
    features: [
      "Comptage",
      "Statistiques",
      "Gématrie simple",
      "Fourchette",
      "Accès limité aux motifs numériques",
      "Nombre limité de sauvegardes",
    ],
  },
  {
    code: "PRO" as const,
    name: "Pro",
    price: 7.99,
    cta: "Passer à Pro",
    highlight: true,
    features: [
      "Toutes les fonctions Free",
      "Motifs numériques avancés",
      "Analyse avancée",
      "Comparaison",
      "Statistiques avancées",
      "Abjad avancé",
      "Graphiques avancés",
      "Sauvegarde étendue et historique",
      "Export PDF, CSV, XLSX",
    ],
  },
  {
    code: "RESEARCH" as const,
    name: "Research",
    price: 19.99,
    cta: "Choisir Research",
    features: [
      "Toutes les fonctions Pro",
      "Analyses personnalisées",
      "Paramètres avancés",
      "Rapports de recherche",
      "Export JSON",
      "Fonctionnalités de reproductibilité",
      "Futures fonctionnalités API",
    ],
  },
];

export const CURRENCY = "€";
export function formatPrice(p: number) {
  return p === 0 ? `0 ${CURRENCY}` : `${p.toFixed(2).replace(".", ",")} ${CURRENCY}`;
}
export function planInfo(code: PlanCode | null | undefined) {
  return PLANS.find((p) => p.code === code) ?? PLANS[0]!;
}
