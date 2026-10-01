import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ProGate, SaveAnalysisButton } from "@/lib/entitlements";

import {
  DataGate,
  PageHeader,
  StatCard,
  useArabicQuran,
} from "@/components/quran-shell";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useT } from "@/lib/i18n";
import {
  formatNumber,
  languageName,
  letters,
  translationQuery,
  translationsListQuery,
  words,
  type QuranEdition,
  type TranslationEdition,
} from "@/lib/quran";

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
  const t = useT();
  const arabic = useArabicQuran();
  const [edition, setEdition] = useState("fr.hamidullah");
  useEffect(() => {
    const saved = localStorage.getItem("miftah-translation");
    if (saved) setEdition(saved);
  }, []);
  const changeEdition = (id: string) => {
    setEdition(id);
    localStorage.setItem("miftah-translation", id);
  };
  const list = useQuery(translationsListQuery);
  const french = useQuery(translationQuery(edition));
  const current = list.data?.find((e) => e.identifier === edition);
  return (
    <div className="pb-10">
      <PageHeader
        eyebrow="Outil 5"
        title="Comptage par fourchette"
        description="Indiquez une position de départ et une position d'arrivée (sourate et verset) : l'outil compte les versets compris entre les deux, bornes incluses."
      />
      <div className="mx-auto mt-6 max-w-6xl px-5">
        <label className="surface-card flex flex-col gap-2 p-4 sm:flex-row sm:items-center">
          <span className="text-sm font-medium text-primary-deep">{t("Langue de la traduction")}</span>
          <select
            className="rounded-md border border-border bg-background px-3 py-2 text-sm sm:min-w-[22rem]"
            value={edition}
            onChange={(e) => changeEdition(e.target.value)}
          >
            {(list.data ?? [{ identifier: "fr.hamidullah", language: "fr", name: "Hamidullah", englishName: "Hamidullah", direction: "ltr" } as TranslationEdition])
              .slice()
              .sort((a, b) => languageName(a.language).localeCompare(languageName(b.language), "fr"))
              .map((e) => (
                <option key={e.identifier} value={e.identifier}>
                  {languageName(e.language)} — {e.englishName}
                </option>
              ))}
          </select>
          {list.data ? (
            <span className="text-xs text-muted-foreground">{t("{n} traductions disponibles", { n: list.data.length })}</span>
          ) : null}
        </label>
      </div>
      <DataGate query={arabic}>
        {(quran) => (
          <RangeTool
            quran={quran}
            french={french.data}
            label={current ? `${languageName(current.language)} — ${current.englishName}` : "Français — Hamidullah"}
            rtl={current?.direction === "rtl"}
          />
        )}
      </DataGate>
    </div>
  );
}

function clamp(n: number, min: number, max: number) {
  if (Number.isNaN(n)) return min;
  return Math.min(Math.max(n, min), max);
}

type RangeToolProps = { quran: QuranEdition; french: QuranEdition | undefined; label: string; rtl: boolean };

function RangeTool({ quran, french, label, rtl }: RangeToolProps) {
  const t = useT();
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
    const verses: { surah: number; surahName: string; numberInSurah: number; text: string; french: string | undefined }[] = [];
    let ayahs = 0, w = 0, l = 0;
    for (let s = fs; s <= ts; s++) {
      const surah = quran.surahs[s - 1]!;
      const frenchSurah = french?.surahs[s - 1];
      const from = s === fs ? fa : 1;
      const to = s === ts ? ta : surah.ayahs.length;
      const slice = surah.ayahs.slice(from - 1, to);
      ayahs += slice.length;
      for (const a of slice) {
        w += words(a.text).length;
        l += letters(a.text).length;
        verses.push({
          surah: s,
          surahName: surah.name,
          numberInSurah: a.numberInSurah,
          text: a.text,
          french: frenchSurah?.ayahs[a.numberInSurah - 1]?.text,
        });
      }
      rows.push({ number: s, name: surah.name, count: slice.length });
    }
    return { fs, fa, ts, ta, ayahs, w, l, rows, verses };
  }, [quran, french, s1, a1, s2, a2]);

  const input = (labelText: string, value: number, set: (n: number) => void, max: number) => (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-muted-foreground">{labelText}</span>
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

  const surahSelect = (labelText: string, value: number, set: (n: number) => void) => (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-muted-foreground">{labelText}</span>
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
          {surahSelect(t("Sourate de départ"), s1, changeS1)}
          {input(t("Verset (max {n})", { n: maxA(s1) }), a1, setA1, maxA(s1))}
        </div>
        <span className="pb-2 text-2xl text-gold">→</span>
        <div className="flex gap-3">
          {surahSelect(t("Sourate d'arrivée"), s2, changeS2)}
          {input(t("Verset (max {n})", { n: maxA(s2) }), a2, setA2, maxA(s2))}
        </div>
      </div>

      {"error" in result ? (
        <p className="surface-card p-6 text-destructive">{t(result.error)}</p>
      ) : (
        <>
          <p className="text-muted-foreground">
            {t("De {a} ({fs}:{fa}) à {b} ({ts}:{ta}) — bornes incluses", {
              a: quran.surahs[result.fs! - 1]!.name,
              fs: result.fs!,
              fa: result.fa!,
              b: quran.surahs[result.ts! - 1]!.name,
              ts: result.ts!,
              ta: result.ta!,
            })}
          </p>
          <SaveAnalysisButton
            tool="fourchette"
            title={`${t("Fourchette")} ${result.fs}:${result.fa} → ${result.ts}:${result.ta}`}
            params={{ from: `${result.fs}:${result.fa}`, to: `${result.ts}:${result.ta}` }}
            summary={{ ayahs: result.ayahs, words: result.w, letters: result.l }}
          />
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Versets" value={formatNumber(result.ayahs!)} />
            <StatCard label="Mots" value={formatNumber(result.w!)} />
            <StatCard label="Lettres" value={formatNumber(result.l!)} />
          </div>
          <ProGate feature="fourchette.advanced">
          <div className="surface-card overflow-x-auto p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="p-2">{t("N°")}</th>
                  <th className="p-2">{t("Sourate")}</th>
                  <th className="p-2 text-right">{t("Versets comptés")}</th>
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
          </ProGate>
          <div className="surface-card p-5">
            <h2 className="font-display text-xl font-semibold text-primary-deep">
              {t("Texte des versets ({n})", { n: formatNumber(result.verses!.length) })}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("Chaque verset est affiché en arabe suivi de sa traduction ({label}).", { label })}
            </p>
            <div className="mt-4 divide-y divide-border">
              {result.verses!.map((v) => (
                <div key={`${v.surah}:${v.numberInSurah}`} className="py-4">
                  <p className="text-xs font-medium uppercase tracking-[0.15em] text-gold">
                    {v.surah}:{v.numberInSurah} — {v.surahName}
                  </p>
                  <p className="mt-2 font-arabic text-2xl leading-loose" dir="rtl" lang="ar">
                    {v.text}
                  </p>
                  {v.french ? (
                    <p className="mt-2 text-sm text-muted-foreground" dir={rtl ? "rtl" : "ltr"}>{v.french}</p>
                  ) : (
                    <p className="mt-2 text-sm text-muted-foreground italic">
                      {t("Traduction en cours de chargement…")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
