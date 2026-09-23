export type Ayah = {
  numberInSurah: number;
  text: string;
};

export type Surah = {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  ayahs: Ayah[];
};

export type QuranEdition = {
  surahs: Surah[];
};

const API = "https://api.alquran.cloud/v1/quran";

async function fetchEdition(id: string): Promise<QuranEdition> {
  const res = await fetch(`${API}/${id}`);
  if (!res.ok) throw new Error("Impossible de charger le texte");
  const json = (await res.json()) as { data: QuranEdition };
  return json.data;
}

export const quranArabicQuery = {
  queryKey: ["quran", "uthmani"] as const,
  queryFn: () => fetchEdition("quran-uthmani"),
  staleTime: Infinity,
  gcTime: Infinity,
};

export const quranFrenchQuery = {
  queryKey: ["quran", "fr"] as const,
  queryFn: () => fetchEdition("fr.hamidullah"),
  staleTime: Infinity,
  gcTime: Infinity,
};

/* ---------- Texte arabe : normalisation ---------- */

const DIACRITICS = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g;

export function stripDiacritics(text: string): string {
  return text.replace(DIACRITICS, "");
}

export function normalizeArabic(text: string): string {
  return stripDiacritics(text)
    .replace(/[\u0622\u0623\u0625\u0627\u0671]/g, "\u0627")
    .replace(/\u0649/g, "\u064A")
    .replace(/\u0629/g, "\u0647")
    .replace(/\u06C0/g, "\u0647")
    .replace(/[^\u0621-\u064A\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function words(text: string): string[] {
  const n = normalizeArabic(text);
  return n.length ? n.split(" ") : [];
}

export function letters(text: string): string[] {
  return normalizeArabic(text).replace(/\s/g, "").split("");
}

/* ---------- Alphabet & valeurs abjad ---------- */

export const ARABIC_LETTERS = [
  "ا","ب","ت","ث","ج","ح","خ","د","ذ","ر","ز","س","ش","ص","ض","ط","ظ","ع","غ","ف",
  "ق","ك","ل","م","ن","ه","و","ي","ء",
];

export const ABJAD: Record<string, number> = {
  ا: 1, ب: 2, ج: 3, د: 4, ه: 5, و: 6, ز: 7, ح: 8, ط: 9,
  ي: 10, ك: 20, ل: 30, م: 40, ن: 50, س: 60, ع: 70, ف: 80, ص: 90,
  ق: 100, ر: 200, ش: 300, ت: 400, ث: 500, خ: 600, ذ: 700, ض: 800, ظ: 900, غ: 1000,
  ء: 1,
};

export function abjadValue(text: string): number {
  return letters(text).reduce((sum, l) => sum + (ABJAD[l] ?? 0), 0);
}

export function abjadBreakdown(text: string): { letter: string; value: number }[] {
  return letters(text).map((letter) => ({ letter, value: ABJAD[letter] ?? 0 }));
}

/* ---------- Statistiques ---------- */

export type SurahStats = {
  number: number;
  name: string;
  frenchName: string;
  revelationType: string;
  ayahCount: number;
  wordCount: number;
  letterCount: number;
  abjad: number;
};

export function computeSurahStats(quran: QuranEdition): SurahStats[] {
  return quran.surahs.map((s) => {
    let wordCount = 0;
    let letterCount = 0;
    let abjad = 0;
    for (const a of s.ayahs) {
      const ls = letters(a.text);
      wordCount += words(a.text).length;
      letterCount += ls.length;
      for (const l of ls) abjad += ABJAD[l] ?? 0;
    }
    return {
      number: s.number,
      name: s.name,
      frenchName: s.englishNameTranslation,
      revelationType: s.revelationType === "Meccan" ? "Mecquoise" : "Médinoise",
      ayahCount: s.ayahs.length,
      wordCount,
      letterCount,
      abjad,
    };
  });
}

/* ---------- Comptage d'occurrences ---------- */

export type Occurrence = {
  surah: number;
  surahName: string;
  ayah: number;
  arabic: string;
  count: number;
};

export type SearchResult = {
  total: number;
  ayahMatches: number;
  bySurah: { surah: number; surahName: string; count: number }[];
  occurrences: Occurrence[];
};

function countIn(haystack: string, needle: string, wholeWord: boolean): number {
  if (!needle) return 0;
  if (wholeWord) return haystack.split(" ").filter((w) => w === needle).length;
  let count = 0;
  let i = haystack.indexOf(needle);
  while (i !== -1) {
    count++;
    i = haystack.indexOf(needle, i + needle.length);
  }
  return count;
}

export function searchTerm(
  quran: QuranEdition,
  term: string,
  wholeWord: boolean,
): SearchResult {
  const needle = normalizeArabic(term);
  const bySurah: SearchResult["bySurah"] = [];
  const occurrences: Occurrence[] = [];
  let total = 0;
  let ayahMatches = 0;

  for (const s of quran.surahs) {
    let surahCount = 0;
    for (const a of s.ayahs) {
      const c = countIn(normalizeArabic(a.text), needle, wholeWord);
      if (c > 0) {
        surahCount += c;
        ayahMatches++;
        if (occurrences.length < 300) {
          occurrences.push({
            surah: s.number,
            surahName: s.name,
            ayah: a.numberInSurah,
            arabic: a.text,
            count: c,
          });
        }
      }
    }
    if (surahCount > 0) {
      bySurah.push({ surah: s.number, surahName: s.name, count: surahCount });
      total += surahCount;
    }
  }

  return { total, ayahMatches, bySurah, occurrences };
}

export function letterFrequencies(
  quran: QuranEdition,
): { letter: string; count: number; share: number }[] {
  const counts = new Map<string, number>();
  let totalLetters = 0;
  for (const s of quran.surahs) {
    for (const a of s.ayahs) {
      for (const l of letters(a.text)) {
        counts.set(l, (counts.get(l) ?? 0) + 1);
        totalLetters++;
      }
    }
  }
  return ARABIC_LETTERS.map((letter) => {
    const count = counts.get(letter) ?? 0;
    return { letter, count, share: totalLetters ? (count / totalLetters) * 100 : 0 };
  }).sort((a, b) => b.count - a.count);
}

/* ---------- Motifs numériques ---------- */

export type Divisibility = {
  label: string;
  value: number;
  divisor: number;
  quotient: number;
  divisible: boolean;
};

export function divisibility(label: string, value: number, divisor: number): Divisibility {
  return {
    label,
    value,
    divisor,
    quotient: Math.floor(value / divisor),
    divisible: value % divisor === 0,
  };
}

export function digitSum(n: number): number {
  return String(Math.abs(n))
    .split("")
    .reduce((s, d) => s + Number(d), 0);
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("fr-FR").format(n);
}
