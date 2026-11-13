/**
 * Moteur de recherche avancé pour Miftah Quran.
 *
 * Permet de chercher :
 *  1. Un mot exact (ex: "كَتَبَ")
 *  2. Une racine trilittère (ex: "كتب")
 *  3. Tous les dérivés d'une racine (كاتب، مكتوب، مكتبة, ...)
 */

// Suppression des diacritiques (harakat) pour la comparaison
export function stripDiacritics(text: string): string {
  return text.replace(/[ً-ْٰـ]/g, "");
}

// Extraction de la racine trilittère (lettres de base)
export function extractRoot(word: string): string {
  const cleaned = stripDiacritics(word).replace(/[آ-ئبةت-خر-زكلمنهؠءﻻﻷﻵﻱﻹﻳﻻ]/g, "");
  return cleaned;
}

export interface QuranWord {
  surah: number;
  ayah: number;
  word: string;
  text: string;
}

export interface SearchResult {
  matches: QuranWord[];
  rootMatches: QuranWord[];
  total: number;
}

/**
 * Cherche un mot et toutes ses formes dérivées dans le texte coranique.
 */
export function searchQuranWords(
  query: string,
  quranText: QuranWord[]
): SearchResult {
  const cleanedQuery = stripDiacritics(query).trim();
  const root = extractRoot(cleanedQuery);

  const exactMatches: QuranWord[] = [];
  const rootMatches: QuranWord[] = [];

  for (const item of quranText) {
    const itemWord = stripDiacritics(item.word);
    const itemRoot = extractRoot(itemWord);

    if (itemWord === cleanedQuery) {
      exactMatches.push(item);
    } else if (itemRoot === root && itemWord !== cleanedQuery) {
      rootMatches.push(item);
    }
  }

  return {
    matches: exactMatches,
    rootMatches,
    total: exactMatches.length + rootMatches.length,
  };
}