import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { DataGate, PageHeader, StatCard, useArabicQuran } from "@/components/quran-shell";
import { useT } from "@/lib/i18n";
import { computeSurahStats, formatNumber, type QuranEdition, type SurahStats } from "@/lib/quran";

export const Route = createFileRoute("/statistiques")({
  head: () => ({
    meta: [
      { title: "Statistiques des sourates — Miftah" },
      {
        name: "description",
        content:
          "Nombre de versets, de mots, de lettres et valeur abjad de chacune des 114 sourates, avec classements et totaux.",
      },
      { property: "og:title", content: "Statistiques des sourates — Miftah" },
      {
        property: "og:description",
        content: "Versets, mots, lettres et valeurs abjad des 114 sourates du Coran.",
      },
    ],
  }),
  component: StatistiquesPage,
});

type SortKey = "number" | "ayahCount" | "wordCount" | "letterCount" | "abjad";

function StatistiquesPage() {
  const arabic = useArabicQuran();
  return (
    <div className="pb-10">
      <PageHeader
        eyebrow="Outil 2"
        title="Statistiques des sourates"
        description="Chaque sourate est mesurée en versets, mots, lettres et valeur numérique. Triez le tableau, filtrez par lieu de révélation et comparez les proportions."
      />
      <DataGate query={arabic}>{(quran) => <Stats quran={quran} />}</DataGate>
    </div>
  );
}

function Stats({ quran }: { quran: QuranEdition }) {
  const t = useT();
  const stats = useMemo(() => computeSurahStats(quran), [quran]);
  const [sort, setSort] = useState<SortKey>("number");
  const [desc, setDesc] = useState(false);
  const [place, setPlace] = useState<"all" | "Mecquoise" | "Médinoise">("all");

  const COLUMNS: { key: SortKey; label: string }[] = [
    { key: "number", label: t("N°") },
    { key: "ayahCount", label: t("Versets") },
    { key: "wordCount", label: t("Mots") },
    { key: "letterCount", label: t("Lettres") },
    { key: "abjad", label: t("Valeur abjad") },
  ];

  const totals = useMemo(
    () =>
      stats.reduce(
        (acc, s) => ({
          ayahs: acc.ayahs + s.ayahCount,
          words: acc.words + s.wordCount,
          letters: acc.letters + s.letterCount,
          abjad: acc.abjad + s.abjad,
        }),
        { ayahs: 0, words: 0, letters: 0, abjad: 0 },
      ),
    [stats],
  );

  const mecquoises = stats.filter((s) => s.revelationType === "Mecquoise").length;

  const rows = useMemo(() => {
    const filtered = place === "all" ? stats : stats.filter((s) => s.revelationType === place);
    const sorted = filtered.slice().sort((a, b) => a[sort] - b[sort]);
    return desc ? sorted.reverse() : sorted;
  }, [stats, sort, desc, place]);

  const maxWords = Math.max(...stats.map((s) => s.wordCount));

  const longest = stats.slice().sort((a, b) => b.ayahCount - a.ayahCount).slice(0, 5);
  const shortest = stats.slice().sort((a, b) => a.ayahCount - b.ayahCount).slice(0, 5);

  return (
    <div className="mx-auto mt-10 max-w-6xl space-y-10 px-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label={t("Sourates")}
          value="114"
          hint={t("{a} mecquoises, {b} médinoises", { a: mecquoises, b: 114 - mecquoises })}
        />
        <StatCard label={t("Versets")} value={formatNumber(totals.ayahs)} hint={t("basmalas d'ouverture incluses dans le texte")} />
        <StatCard label={t("Mots")} value={formatNumber(totals.words)} hint={t("séparés par espaces, texte normalisé")} />
        <StatCard label={t("Lettres")} value={formatNumber(totals.letters)} hint={t("hors diacritiques")} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <TopList title={t("Les 5 sourates les plus longues")} rows={longest} />
        <TopList title={t("Les 5 sourates les plus courtes")} rows={shortest} />
      </div>

      <div className="surface-card p-6">
        <h2 className="text-xl font-semibold text-primary-deep">{t("Nombre de mots par sourate")}</h2>
        <div className="mt-5 flex h-40 items-end gap-[3px]">
          {stats.map((s) => (
            <span
              key={s.number}
              title={t("Sourate {n} — {w} mots", { n: s.number, w: formatNumber(s.wordCount) })}
              className="flex-1 rounded-t-sm transition-opacity hover:opacity-70"
              style={{
                height: `${Math.max((s.wordCount / maxWords) * 100, 1.5)}%`,
                backgroundImage: "var(--gradient-emerald)",
              }}
            />
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">{t("Sourates 1 à 114, de gauche à droite.")}</p>
      </div>

      <div className="surface-card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
          <h2 className="text-xl font-semibold text-primary-deep">{t("Tableau détaillé")}</h2>
          <div className="flex gap-2 text-sm">
            {(["all", "Mecquoise", "Médinoise"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPlace(p)}
                className={`rounded-md border px-3 py-1.5 transition-colors ${
                  place === p
                    ? "border-primary bg-secondary font-medium text-primary-deep"
                    : "border-border hover:bg-secondary"
                }`}
              >
                {p === "all" ? t("Toutes") : p === "Mecquoise" ? t("Mecquoises") : t("Médinoises")}
              </button>
            ))}
          </div>
        </div>
        <div className="max-h-[560px] overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-card">
              <tr className="border-b border-border text-left">
                {COLUMNS.map((c) => (
                  <th key={c.key} className="p-3">
                    <button
                      onClick={() => {
                        if (sort === c.key) setDesc(!desc);
                        else {
                          setSort(c.key);
                          setDesc(true);
                        }
                      }}
                      className="font-semibold text-primary-deep hover:text-gold"
                    >
                      {c.label} {sort === c.key ? (desc ? "↓" : "↑") : ""}
                    </button>
                  </th>
                ))}
                <th className="p-3 font-semibold text-primary-deep">{t("Sourate")}</th>
                <th className="p-3 font-semibold text-primary-deep">{t("Révélation")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => (
                <tr key={s.number} className="border-b border-border/60 hover:bg-secondary/60">
                  <td className="p-3 text-muted-foreground">{s.number}</td>
                  <td className="p-3">{formatNumber(s.ayahCount)}</td>
                  <td className="p-3">{formatNumber(s.wordCount)}</td>
                  <td className="p-3">{formatNumber(s.letterCount)}</td>
                  <td className="p-3">{formatNumber(s.abjad)}</td>
                  <td className="p-3">
                    <span className="arabic text-base">{s.name}</span>
                    <span className="ml-2 text-xs text-muted-foreground">{s.frenchName}</span>
                  </td>
                  <td className="p-3 text-muted-foreground">{s.revelationType === "Mecquoise" ? t("Mecquoise") : t("Médinoise")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function TopList({ title, rows }: { title: string; rows: SurahStats[] }) {
  const t = useT();
  return (
    <div className="surface-card p-6">
      <h2 className="text-xl font-semibold text-primary-deep">{title}</h2>
      <ul className="mt-4 space-y-3 text-sm">
        {rows.map((s) => (
          <li key={s.number} className="flex items-center justify-between gap-3">
            <span>
              <span className="text-muted-foreground">{s.number}. </span>
              <span className="arabic text-base">{s.name}</span>
              <span className="ml-2 text-xs text-muted-foreground">{s.frenchName}</span>
            </span>
            <span className="font-medium">{t("{n} versets", { n: formatNumber(s.ayahCount) })}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
