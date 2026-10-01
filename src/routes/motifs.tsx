import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { DataGate, PageHeader, StatCard, useArabicQuran } from "@/components/quran-shell";
import { ProGate, QuotaBadge, SaveAnalysisButton, useQuota } from "@/lib/entitlements";
import { useT } from "@/lib/i18n";
import {
  computeSurahStats,
  digitSum,
  divisibility,
  formatNumber,
  type QuranEdition,
} from "@/lib/quran";

export const Route = createFileRoute("/motifs")({
  head: () => ({
    meta: [
      { title: "Motifs numériques du Coran — Miftah" },
      {
        name: "description",
        content:
          "Divisibilité par 19 et autres diviseurs, symétries entre numéros de sourates et nombres de versets, sommes de chiffres.",
      },
      { property: "og:title", content: "Motifs numériques du Coran — Miftah" },
      {
        property: "og:description",
        content: "Tests de divisibilité, symétries et régularités numériques du texte coranique.",
      },
    ],
  }),
  component: MotifsPage,
});

function MotifsPage() {
  const arabic = useArabicQuran();
  return (
    <div className="pb-10">
      <PageHeader
        eyebrow="Outil 3"
        title="Motifs numériques"
        description="Testez des régularités arithmétiques sur les grandeurs du texte : divisibilité par un nombre de votre choix, correspondances entre numéros de sourates et nombres de versets, sommes de chiffres."
      />
      <DataGate query={arabic}>{(quran) => <Patterns quran={quran} />}</DataGate>
    </div>
  );
}

function Patterns({ quran }: { quran: QuranEdition }) {
  const stats = useMemo(() => computeSurahStats(quran), [quran]);
  const [divisor, setDivisor] = useState(19);
  const [draft, setDraft] = useState(19);
  const [blocked, setBlocked] = useState(false);
  const quota = useQuota("motifs.basic");
  const tr = useT();
  async function apply(n: number) {
    setDraft(n);
    if (n === divisor) return;
    const ok = await quota.consume();
    setBlocked(!ok);
    if (ok) setDivisor(n);
  }

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

  const d = Math.max(2, divisor);
  const globalTests = [
    divisibility("Nombre de sourates", 114, d),
    divisibility("Total des versets", totals.ayahs, d),
    divisibility("Total des mots", totals.words, d),
    divisibility("Total des lettres", totals.letters, d),
    divisibility("Somme des numéros de sourates (1+2+…+114)", (114 * 115) / 2, d),
  ];

  const surahsDivisible = stats.filter((s) => s.ayahCount % d === 0);
  const selfMatching = stats.filter((s) => s.number === s.ayahCount);
  const evenVerses = stats.filter((s) => s.ayahCount % 2 === 0).length;
  const parityMatch = stats.filter((s) => s.number % 2 === s.ayahCount % 2).length;

  return (
    <div className="mx-auto mt-10 max-w-6xl space-y-10 px-5">
      <div className="surface-card p-6">
        <label className="block text-sm">
          <span className="mb-2 block font-medium">Diviseur à tester</span>
          <input
            type="number"
            min={2}
            value={draft}
            onChange={(e) => setDraft(Number(e.target.value) || 2)}
            onKeyDown={(e) => e.key === "Enter" && apply(Math.max(2, draft))}
            className="field w-40 text-lg"
          />
        </label>
        <button onClick={() => apply(Math.max(2, draft))} className="btn-emerald mt-3 px-4 py-2 text-sm font-medium">
          {tr("Tester")}
        </button>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          {[7, 11, 19, 114].map((n) => (
            <button
              key={n}
              onClick={() => apply(n)}
              className="rounded-md border border-border px-3 py-1 transition-colors hover:bg-secondary"
            >
              {n}
            </button>
          ))}
        </div>
        <div className="mt-4 space-y-2">
          <QuotaBadge quota={quota} />
          {blocked && (
            <p className="text-sm text-destructive">{tr("Limite quotidienne atteinte pour les motifs numériques.")}</p>
          )}
          <SaveAnalysisButton
            tool="motifs"
            title={`${tr("Motifs numériques")} — ${tr("diviseur")} ${d}`}
            params={{ divisor: d }}
            summary={{ divisor: d, divisible: globalTests.filter((g) => g.divisible).map((g) => g.label), surahs: surahsDivisible.length }}
          />
        </div>
      </div>

      <div className="surface-card p-6">
        <h2 className="text-xl font-semibold text-primary-deep">
          Divisibilité des grandeurs globales par {d}
        </h2>
        <div className="mt-5 space-y-3">
          {globalTests.map((t) => (
            <div
              key={t.label}
              className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3 text-sm"
            >
              <span>{t.label}</span>
              <span className="flex items-center gap-4">
                <span className="text-muted-foreground">{formatNumber(t.value)}</span>
                <span className="text-muted-foreground">
                  {formatNumber(t.value)} ÷ {d} = {formatNumber(t.value / d).replace(",", ",")}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    t.divisible
                      ? "bg-secondary text-primary-deep"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {t.divisible ? "multiple exact" : "non multiple"}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label={`Sourates dont le nombre de versets est multiple de ${d}`}
          value={formatNumber(surahsDivisible.length)}
        />
        <StatCard
          label="Sourates dont le numéro égale le nombre de versets"
          value={formatNumber(selfMatching.length)}
        />
        <StatCard label="Sourates à nombre de versets pair" value={formatNumber(evenVerses)} />
        <StatCard
          label="Sourates où numéro et versets ont la même parité"
          value={formatNumber(parityMatch)}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="surface-card p-6">
          <h2 className="text-xl font-semibold text-primary-deep">
            Versets multiples de {d}
          </h2>
          <div className="mt-4 max-h-80 space-y-2 overflow-y-auto pr-1 text-sm">
            {surahsDivisible.length === 0 ? (
              <p className="text-muted-foreground">Aucune sourate ne correspond.</p>
            ) : (
              surahsDivisible.map((s) => (
                <div key={s.number} className="flex justify-between border-b border-border/60 pb-2">
                  <span>
                    <span className="text-muted-foreground">{s.number}. </span>
                    <span className="arabic text-base">{s.name}</span>
                  </span>
                  <span>
                    {s.ayahCount} = {d} × {s.ayahCount / d}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <ProGate feature="motifs.advanced">
        <div className="surface-card p-6">
          <h2 className="text-xl font-semibold text-primary-deep">Symétries remarquables</h2>
          <div className="mt-4 space-y-3 text-sm">
            {selfMatching.map((s) => (
              <div key={s.number} className="flex justify-between border-b border-border/60 pb-2">
                <span>
                  <span className="arabic text-base">{s.name}</span>
                  <span className="ml-2 text-xs text-muted-foreground">{s.frenchName}</span>
                </span>
                <span>
                  numéro {s.number} = {s.ayahCount} versets
                </span>
              </div>
            ))}
            <div className="flex justify-between border-b border-border/60 pb-2">
              <span>Somme des chiffres du total des versets</span>
              <span>{digitSum(totals.ayahs)}</span>
            </div>
            <div className="flex justify-between border-b border-border/60 pb-2">
              <span>Somme des chiffres du total des mots</span>
              <span>{digitSum(totals.words)}</span>
            </div>
            <div className="flex justify-between">
              <span>Somme des chiffres du total des lettres</span>
              <span>{digitSum(totals.letters)}</span>
            </div>
          </div>
        </div>
        </ProGate>
      </div>

      <p className="text-sm text-muted-foreground">
        Note de méthode : les régularités numériques dépendent fortement des conventions de
        comptage (recension du texte, inclusion des basmalas, traitement des lettres jointes).
        Les chiffres ci-dessus sont ceux du texte Uthmani tel que normalisé par ce site.
      </p>
    </div>
  );
}
