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

export const Route = createFileRoute("/comptage")({
  head: () => ({
    meta: [
      { title: "Comptage de mots et de lettres — Miftah" },
      {
        name: "description",
        content:
          "Comptez les occurrences d'un mot ou d'une lettre arabe dans le Coran, sourate par sourate, avec les versets et leur traduction française.",
      },
      { property: "og:title", content: "Comptage de mots et de lettres — Miftah" },
      {
        property: "og:description",
        content: "Occurrences d'un mot ou d'une lettre dans le Coran, détaillées par sourate.",
      },
    ],
  }),
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
        title="Comptage de mots et de lettres"
        description="Saisissez un mot arabe pour connaître son nombre d'occurrences dans l'ensemble du Coran et sa répartition par sourate. La fréquence de chaque lettre de l'alphabet est également calculée."
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
  const [wholeWord, setWholeWord] = useState(false);

  const result = useMemo(() => searchTerm(quran, term, wholeWord), [quran, term, wholeWord]);
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
            <span className="mb-2 block font-medium">{t("Mot ou lettre en arabe")}</span>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              dir="rtl"
              className="field arabic w-full text-xl"
              placeholder="الله"
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={wholeWord}
              onChange={(e) => setWholeWord(e.target.checked)}
              className="size-4 accent-[var(--primary)]"
            />
            {t("Mot entier uniquement")}
          </label>
          <button type="submit" className="btn-emerald px-6 py-2.5 font-medium">
            {t("Compter")}
          </button>
        </form>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>{t("Exemples :")}</span>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => {
                setInput(s);
                setTerm(s);
              }}
              className="arabic rounded-md border border-border px-3 py-1 text-base transition-colors hover:bg-secondary"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Occurrences totales" value={formatNumber(result.total)} />
        <StatCard label="Versets concernés" value={formatNumber(result.ayahMatches)} />
        <StatCard label="Sourates concernées" value={formatNumber(result.bySurah.length)} />
      </div>

      {result.total === 0 ? (
        <div className="surface-card p-6 text-muted-foreground">
          {t("Aucune occurrence trouvée pour ce terme.")}
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <div className="surface-card p-6">
            <h2 className="text-xl font-semibold text-primary-deep">{t("Répartition par sourate")}</h2>
            <div className="mt-4 max-h-[480px] space-y-2 overflow-y-auto pr-1">
              {result.bySurah
                .slice()
                .sort((a, b) => b.count - a.count)
                .map((row) => (
                  <div key={row.surah} className="flex items-center gap-3 text-sm">
                    <span className="w-8 shrink-0 text-muted-foreground">{row.surah}</span>
                    <span className="arabic w-32 shrink-0 truncate text-base">{row.surahName}</span>
                    <span className="h-2 flex-1 rounded-full bg-secondary">
                      <span
                        className="block h-2 rounded-full"
                        style={{
                          width: `${(row.count / result.bySurah.reduce((m, r) => Math.max(m, r.count), 1)) * 100}%`,
                          backgroundImage: "var(--gradient-emerald)",
                        }}
                      />
                    </span>
                    <span className="w-10 text-right font-medium">{row.count}</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="surface-card p-6">
            <h2 className="text-xl font-semibold text-primary-deep">
              {t("Versets contenant le terme")}
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                {t("(300 premiers)")}
              </span>
            </h2>
            <div className="mt-4 max-h-[480px] space-y-5 overflow-y-auto pr-1">
              {result.occurrences.map((o) => (
                <article key={`${o.surah}-${o.ayah}`} className="border-b border-border pb-4">
                  <p className="text-xs uppercase tracking-[0.15em] text-gold">
                    {o.count > 1
                      ? t("Sourate {surah}, verset {ayah} · {count} occurrences", {
                          surah: o.surah,
                          ayah: o.ayah,
                          count: o.count,
                        })
                      : t("Sourate {surah}, verset {ayah} · {count} occurrence", {
                          surah: o.surah,
                          ayah: o.ayah,
                          count: o.count,
                        })}
                  </p>
                  <p className="arabic mt-2 text-xl">{o.arabic}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {translationFor(o.surah, o.ayah)}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="surface-card p-6">
        <h2 className="text-xl font-semibold text-primary-deep">
          {t("Fréquence des {n} lettres", { n: ARABIC_LETTERS.length })}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("Part de chaque lettre dans l'ensemble des lettres du texte.")}
        </p>
        <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {frequencies.map((f) => (
            <div key={f.letter} className="flex items-center gap-3 text-sm">
              <span className="arabic w-6 text-xl">{f.letter}</span>
              <span className="h-2 flex-1 rounded-full bg-secondary">
                <span
                  className="block h-2 rounded-full"
                  style={{
                    width: `${(f.count / maxShare) * 100}%`,
                    backgroundImage: "var(--gradient-gold)",
                  }}
                />
              </span>
              <span className="w-20 text-right text-muted-foreground">
                {formatNumber(f.count)}
              </span>
              <span className="w-14 text-right">{f.share.toFixed(2)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
