import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { DataGate, PageHeader, StatCard, useArabicQuran } from "@/components/quran-shell";
import { formatNumber, letters, words, type QuranEdition } from "@/lib/quran";

export const Route = createFileRoute("/fourchette")({
  head: () => ({
    meta: [
      { title: "Compter les versets d'une fourchette — Miftah" },
      {
        name: "description",
        content:
          "Saisissez une sourate et un verset de début et de fin pour compter les versets, mots et lettres de la plage choisie.",
      },
      { property: "og:title", content: "Compter les versets d'une fourchette — Miftah" },
      {
        property: "og:description",
        content: "Comptez les versets entre deux positions du Coran saisies manuellement.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FourchettePage,
});

function FourchettePage() {
  const arabic = useArabicQuran();
  return (
    <div className="pb-10">
      <PageHeader
        eyebrow="Outil 5"
        title="Comptage par fourchette"
        description="Indiquez une position de départ et une position d'arrivée (sourate et verset) : l'outil compte les versets compris entre les deux, bornes incluses."
      />
      <DataGate query={arabic}>{(quran) => <RangeTool quran={quran} />}</DataGate>
    </div>
  );
}

function clamp(n: number, min: number, max: number) {
  if (Number.isNaN(n)) return min;
  return Math.min(Math.max(n, min), max);
}

function RangeTool({ quran }: { quran: QuranEdition }) {
  const [s1, setS1] = useState(1);
  const [a1, setA1] = useState(1);
  const [s2, setS2] = useState(2);
  const [a2, setA2] = useState(286);

  const result = useMemo(() => {
    const fs = clamp(s1, 1, 114);
    const ts = clamp(s2, 1, 114);
    const fa = clamp(a1, 1, quran.surahs[fs - 1]!.ayahs.length);
    const ta = clamp(a2, 1, quran.surahs[ts - 1]!.ayahs.length);
    const start = fs * 1000 + fa;
    const end = ts * 1000 + ta;
    if (start > end) return { error: "La position de départ doit précéder la position d'arrivée." };
    const rows: { number: number; name: string; count: number }[] = [];
    let ayahs = 0, w = 0, l = 0;
    for (let s = fs; s <= ts; s++) {
      const surah = quran.surahs[s - 1]!;
      const from = s === fs ? fa : 1;
      const to = s === ts ? ta : surah.ayahs.length;
      const slice = surah.ayahs.slice(from - 1, to);
      ayahs += slice.length;
      for (const a of slice) {
        w += words(a.text).length;
        l += letters(a.text).length;
      }
      rows.push({ number: s, name: surah.name, count: slice.length });
    }
    return { fs, fa, ts, ta, ayahs, w, l, rows };
  }, [quran, s1, a1, s2, a2]);

  const input = (label: string, value: number, set: (n: number) => void, max: number) => (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <input
        type="number"
        min={1}
        max={max}
        value={value}
        onChange={(e) => set(parseInt(e.target.value, 10))}
        className="w-28 rounded-md border border-border bg-background px-3 py-2"
      />
    </label>
  );

  const maxA = (s: number) => quran.surahs[clamp(s, 1, 114) - 1]!.ayahs.length;

  const changeS1 = (n: number) => {
    setS1(n);
    setA1((a) => Math.min(a, maxA(n)));
  };
  const changeS2 = (n: number) => {
    setS2(n);
    setA2((a) => Math.min(a, maxA(n)));
  };

  const surahSelect = (label: string, value: number, set: (n: number) => void) => (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => set(parseInt(e.target.value, 10))}
        className="max-w-56 rounded-md border border-border bg-background px-3 py-2"
      >
        {quran.surahs.map((s) => (
          <option key={s.number} value={s.number}>
            {s.number}. {s.name} ({s.englishNameTranslation})
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <div className="mx-auto mt-8 max-w-6xl space-y-6 px-5">
      <div className="surface-card flex flex-wrap items-end gap-6 p-6">
        <div className="flex gap-3">
          {surahSelect("Sourate de départ", s1, changeS1)}
          {input(`Verset (max ${maxA(s1)})`, a1, setA1, maxA(s1))}
        </div>
        <span className="pb-2 text-2xl text-gold">→</span>
        <div className="flex gap-3">
          {surahSelect("Sourate d'arrivée", s2, changeS2)}
          {input(`Verset (max ${maxA(s2)})`, a2, setA2, maxA(s2))}
        </div>
      </div>

      {"error" in result ? (
        <p className="surface-card p-6 text-destructive">{result.error}</p>
      ) : (
        <>
          <p className="text-muted-foreground">
            De {quran.surahs[result.fs! - 1]!.name} ({result.fs}:{result.fa}) à{" "}
            {quran.surahs[result.ts! - 1]!.name} ({result.ts}:{result.ta}) — bornes incluses
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Versets" value={formatNumber(result.ayahs!)} />
            <StatCard label="Mots" value={formatNumber(result.w!)} />
            <StatCard label="Lettres" value={formatNumber(result.l!)} />
          </div>
          <div className="surface-card overflow-x-auto p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="p-2">N°</th>
                  <th className="p-2">Sourate</th>
                  <th className="p-2 text-right">Versets comptés</th>
                </tr>
              </thead>
              <tbody>
                {result.rows!.map((r) => (
                  <tr key={r.number} className="border-t border-border">
                    <td className="p-2">{r.number}</td>
                    <td className="p-2 font-arabic" dir="rtl">{r.name}</td>
                    <td className="p-2 text-right">{r.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
