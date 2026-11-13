import { pageHead } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { DataGate, PageHeader, StatCard, useArabicQuran, useFrenchQuran } from "@/components/quran-shell";
import { useT } from "@/lib/i18n";
import {
  ARABIC_LETTERS,
  formatNumber,
  letterFrequencies,
  searchTerm,
  type QuranEdition,
} from "@/lib/quran";
import { searchQuranWords } from "@/lib/quran-search";

export const Route = createFileRoute("/comptage")({
  head: ({ match }) => pageHead("/comptage", match.search.lang, true),
  component: ComptagePage,
});

const SUGGESTIONS = ["الله", "يوم", "شهر", "رحمة", "صلاة", "بحر", "بر"];

function ComptagePage() {
  const arabic = useArabicQuran();
  const french = useFrenchQuran();
  const t = useT();

  return (
    <div className="pb-10">
      <PageHeader
        eyebrow="Outil 1"
        title="Comptage de mots et de lettres (Avancé)"
        description="Saisissez un mot arabe pour connaître ses occurrences exactes et celles de toutes ses formes dérivées dans le Coran."
      />
      <DataGate query={arabic}>
        {(quran) => <Counter quran={quran} translation={french.data} />}
      </DataGate>
    </div>
  );
}

function Counter({
  quran,
  translation,
}: {
  quran: QuranEdition;
  translation: QuranEdition | undefined;
}) {
  const t = useT();
  const [input, setInput] = useState("الله");
  const [term, setTerm] = useState("الله");

  // Conversion du format QuranEdition en tableau plat pour le moteur de recherche
  const quranWords = useMemo(() => {
    const list: any[] = [];
    quran.surahs.forEach((s) => {
      s.ayahs.forEach((a) => {
        a.text.split(" ").forEach((w) => {
          list.push({ surah: s.id, ayah: a.id, word: w, text: a.text });
        });
      });
    });
    return list;
  }, [quran]);

  const result = useMemo(() => searchQuranWords(term, quranWords), [term, quranWords]);
  const frequencies = useMemo(() => letterFrequencies(quran), [quran]);
  const maxShare = frequencies[0]?.count ?? 1;

  const translationFor = (surah: number, ayah: number) =>
    translation?.surahs[surah - 1]?.ayahs[ayah - 1]?.text ?? "";

  return (
    <div className="mx-auto mt-10 max-w-6xl space-y-10 px-5">
      <div className="surface-card p-6">
        <form
          className="flex flex-wrap items-end gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            setTerm(input.trim());
          }}
        >
          <label className="flex-1 min-w-[240px] text-sm">
            <span className="mb-2 block font-medium">{t("Mot ou racine en arabe")}</span>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              dir="rtl"
              className="field arabic w-full text-xl"
              placeholder="الله"
            />
          </label>
          <button type="submit" className="btn-emerald px-6 py-2.5 font-medium">
            {t("Chercher et Compter")}
          </button>
        </form>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Occurrences du mot exact" value={formatNumber(result.matches.length)} />
        <StatCard label="Occurrences des dérivés (racine)" value={formatNumber(result.rootMatches.length)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
          {/* Mots exacts */}
          <div className="surface-card p-6">
            <h2 className="text-xl font-semibold text-primary-deep">{t("Occurrences exactes")}</h2>
            <div className="mt-4 max-h-[480px] space-y-5 overflow-y-auto pr-1">
              {result.matches.map((o) => (
                <article key={`${o.surah}-${o.ayah}-${o.word}`} className="border-b border-border pb-4">
                  <p className="text-xs text-gold">Sourate {o.surah}, verset {o.ayah}</p>
                  <p className="arabic mt-2 text-xl">{o.text}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{translationFor(o.surah, o.ayah)}</p>
                </article>
              ))}
            </div>
          </div>

          {/* Dérivés */}
          <div className="surface-card p-6">
            <h2 className="text-xl font-semibold text-primary-deep">{t("Formes dérivées de la racine")}</h2>
            <div className="mt-4 max-h-[480px] space-y-5 overflow-y-auto pr-1">
              {result.rootMatches.map((o) => (
                <article key={`${o.surah}-${o.ayah}-${o.word}`} className="border-b border-border pb-4">
                  <p className="text-xs text-emerald-600">Sourate {o.surah}, verset {o.ayah} - <span className="arabic">{o.word}</span></p>
                  <p className="arabic mt-2 text-xl">{o.text}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{translationFor(o.surah, o.ayah)}</p>
                </article>
              ))}
            </div>
          </div>
      </div>
    </div>
  );
}