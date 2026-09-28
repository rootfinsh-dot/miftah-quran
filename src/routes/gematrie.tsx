import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { DataGate, PageHeader, StatCard, useArabicQuran, useFrenchQuran } from "@/components/quran-shell";
import { useT } from "@/lib/i18n";
import {
  ABJAD,
  abjadBreakdown,
  abjadValue,
  formatNumber,
  words,
  type QuranEdition,
} from "@/lib/quran";

export const Route = createFileRoute("/gematrie")({
  head: () => ({
    meta: [
      { title: "Gématrie et valeurs abjad — Miftah" },
      {
        name: "description",
        content:
          "Calculez la valeur numérique abjad d'un mot arabe ou d'un verset du Coran, lettre par lettre.",
      },
      { property: "og:title", content: "Gématrie et valeurs abjad — Miftah" },
      {
        property: "og:description",
        content: "Valeur numérique abjad des mots et des versets du Coran, détaillée lettre à lettre.",
      },
    ],
  }),
  component: GematriePage,
});

function GematriePage() {
  const arabic = useArabicQuran();
  const french = useFrenchQuran();
  return (
    <div className="pb-10">
      <PageHeader
        eyebrow="Outil 4"
        title="Gématrie (valeurs abjad)"
        description="Chaque lettre arabe porte une valeur numérique selon la table abjad classique. Calculez la valeur d'un texte libre ou d'un verset précis du Coran."
      />
      <DataGate query={arabic}>
        {(quran) => <Gematria quran={quran} translation={french.data} />}
      </DataGate>
    </div>
  );
}

function Gematria({
  quran,
  translation,
}: {
  quran: QuranEdition;
  translation: QuranEdition | undefined;
}) {
  const t = useT();
  const [text, setText] = useState("بسم الله الرحمن الرحيم");
  const [surahNumber, setSurahNumber] = useState(1);
  const [ayahNumber, setAyahNumber] = useState(1);

  const breakdown = useMemo(() => abjadBreakdown(text), [text]);
  const total = useMemo(() => abjadValue(text), [text]);
  const perWord = useMemo(
    () => words(text).map((w) => ({ word: w, value: abjadValue(w) })),
    [text],
  );

  const surah = quran.surahs[surahNumber - 1];
  const ayahCount = surah?.ayahs.length ?? 1;
  const safeAyah = Math.min(Math.max(ayahNumber, 1), ayahCount);
  const ayah = surah?.ayahs[safeAyah - 1];
  const ayahValue = ayah ? abjadValue(ayah.text) : 0;
  const ayahTranslation = translation?.surahs[surahNumber - 1]?.ayahs[safeAyah - 1]?.text ?? "";

  return (
    <div className="mx-auto mt-10 max-w-6xl space-y-10 px-5">
      <div className="surface-card p-6">
        <label className="block text-sm">
          <span className="mb-2 block font-medium">{t("Texte arabe à évaluer")}</span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            dir="rtl"
            rows={3}
            className="field arabic w-full text-xl"
          />
        </label>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <StatCard label="Valeur abjad totale" value={formatNumber(total)} />
          <StatCard label="Lettres comptées" value={formatNumber(breakdown.length)} />
          <StatCard label="Mots" value={formatNumber(perWord.length)} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="surface-card p-6">
          <h2 className="text-xl font-semibold text-primary-deep">{t("Détail lettre par lettre")}</h2>
          <div className="mt-4 flex flex-wrap gap-2" dir="rtl">
            {breakdown.map((b, i) => (
              <span
                key={`${b.letter}-${i}`}
                className="flex min-w-12 flex-col items-center rounded-md border border-border bg-secondary/50 px-2 py-1"
              >
                <span className="arabic text-xl">{b.letter}</span>
                <span className="text-xs text-muted-foreground">{b.value}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="surface-card p-6">
          <h2 className="text-xl font-semibold text-primary-deep">{t("Valeur par mot")}</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {perWord.map((w, i) => (
              <li
                key={`${w.word}-${i}`}
                className="flex items-center justify-between border-b border-border/60 pb-2"
              >
                <span className="arabic text-lg">{w.word}</span>
                <span className="font-medium">{formatNumber(w.value)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="surface-card p-6">
        <h2 className="text-xl font-semibold text-primary-deep">{t("Valeur d'un verset")}</h2>
        <div className="mt-4 flex flex-wrap items-end gap-4 text-sm">
          <label>
            <span className="mb-2 block font-medium">{t("Sourate")}</span>
            <select
              value={surahNumber}
              onChange={(e) => {
                setSurahNumber(Number(e.target.value));
                setAyahNumber(1);
              }}
              className="field w-64"
            >
              {quran.surahs.map((s) => (
                <option key={s.number} value={s.number}>
                  {s.number}. {s.englishName}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="mb-2 block font-medium">{t("Verset (1 – {n})", { n: ayahCount })}</span>
            <input
              type="number"
              min={1}
              max={ayahCount}
              value={ayahNumber}
              onChange={(e) => setAyahNumber(Number(e.target.value) || 1)}
              className="field w-28"
            />
          </label>
          <button
            onClick={() => ayah && setText(ayah.text)}
            className="btn-emerald px-5 py-2.5 font-medium"
          >
            {t("Analyser ce verset ci-dessus")}
          </button>
        </div>
        {ayah ? (
          <div className="mt-6 border-t border-border pt-5">
            <p className="arabic text-2xl">{ayah.text}</p>
            <p className="mt-3 text-sm text-muted-foreground">{ayahTranslation}</p>
            <p className="mt-4 font-display text-2xl text-primary-deep">
              {t("Valeur abjad : {n}", { n: formatNumber(ayahValue) })}
            </p>
          </div>
        ) : null}
      </div>

      <div className="surface-card p-6">
        <h2 className="text-xl font-semibold text-primary-deep">{t("Table abjad de référence")}</h2>
        <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-9">
          {Object.entries(ABJAD)
            .filter(([letter]) => letter !== "ء")
            .map(([letter, value]) => (
              <div
                key={letter}
                className="flex flex-col items-center rounded-md border border-border py-2"
              >
                <span className="arabic text-2xl">{letter}</span>
                <span className="text-xs text-muted-foreground">{value}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
