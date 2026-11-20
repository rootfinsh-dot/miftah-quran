"use client";

import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { X, BookOpen, Copy, Check, Type, ChevronLeft, Maximize, Minimize } from "lucide-react";
import { SURAH_LIST } from "@/lib/sourates";

interface Ayah {
  id: number;
  number: number;
  surah: number;
  text: string;
}

interface TafsirItem {
  author: string;
  content: string;
}

interface SurahInfo {
  name: string;
  englishName: string;
  frenchName: string;
  revelationType: "Mecquoise" | "Médinoise";
  ayahCount: number;
}

export function SourateExplorer({
  surahId,
  onClose,
}: {
  surahId: number;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [surahInfo, setSurahInfo] = useState<SurahInfo | null>(null);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [tafsir, setTafsir] = useState<TafsirItem[]>([]);
  const [windowMode, setWindowMode] = useState<"normal" | "maximized">("normal");

  const fetchSurahData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const textRes = await fetch(`https://api.quranpedia.net/v1/mushafs/1/${surahId}`);
      if (!textRes.ok) throw new Error("Impossible de charger le texte de la sourate");

      const textData: any = await textRes.json();
      const ayahArray = Array.isArray(textData) ? textData : textData.ayahs || [];

      const ayahList: Ayah[] = ayahArray.map((a: any) => ({
        id: a.id,
        number: a.number,
        surah: a.surah,
        text: a.text || a.text_html || a.text_unescaped,
      }));

      setAyahs(ayahList);

      const sourate = SURAH_LIST[surahId - 1];
      if (sourate) {
        setSurahInfo({
          name: sourate.name,
          englishName: sourate.englishName,
          frenchName: sourate.frenchName,
          revelationType: sourate.revelationType,
          ayahCount: sourate.ayahCount,
        });
      }

      const tafsirSources = [1, 2, 3, 4, 5];
      const tafsirPromises = tafsirSources.map(async (bookId) => {
        try {
          const tafsirRes = await fetch(`https://api.quranpedia.net/v1/ayah/${surahId}/1/book/${bookId}`);
          if (tafsirRes.ok) {
            const tafsirData: any = await tafsirRes.json();
            const content = tafsirData.content || [];
            const text = content
              .map((c: any) => c.text || "")
              .join("\n\n");
            return {
              author: tafsirData.book?.ar_name || `Source ${bookId}`,
              content: text,
            };
          }
        } catch {
          // Skip failed sources
        }
        return null;
      });

      const results = (await Promise.all(tafsirPromises)).filter((r): r is TafsirItem => r !== null);
      if (results.length > 0) {
        setTafsir(results);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, [surahId]);

  useEffect(() => {
    fetchSurahData();
  }, [fetchSurahData]);

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyAyah = (index: number) => {
    const ayah = ayahs[index];
    if (ayah) {
      navigator.clipboard.writeText(ayah.text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  if (loading) {
    return (
      <Dialog open>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Chargement de la sourate {surahId}…</DialogTitle>
            <DialogDescription>
              Récupération du texte et du tafsir depuis les sources arabes…
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Erreur</DialogTitle>
            <DialogDescription>{error}</DialogDescription>
          </DialogHeader>
          <div className="text-center text-destructive py-4">
            <button
              onClick={fetchSurahData}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/80 transition-colors"
            >
              Réessayer
            </button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const arabicName = surahInfo?.name || `سورة ${surahId}`;
  const frenchName = surahInfo?.frenchName || `Sourate ${surahId}`;
  const englishName = surahInfo?.englishName || `Surah ${surahId}`;
  const revelationType = surahInfo?.revelationType || "Mecqueeze";
  const ayahCount = ayahs.length;

  if (!surahInfo || ayahs.length === 0) {
    return (
      <Dialog open>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Sourate {surahId}</DialogTitle>
            <DialogDescription>
              Chargement des données… ({ayahCount} versets trouvés)
            </DialogDescription>
          </DialogHeader>
          <div className="text-center text-primary-foreground/60 py-8">
            <div className="text-4xl mb-4">⏳</div>
            <p>Chargement des textes et tafsirs…</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open>
        <DialogContent
          className={`sm:max-w-4xl max-h-[90vh] overflow-auto bg-background transition-all duration-300 ${
            windowMode === "maximized" ? "sm:max-w-full max-h-screen overflow-auto" : ""
          }`}
        >
          <DialogHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <DialogTitle className="flex items-center gap-3 text-2xl">
                <span dir="rtl" className="text-2xl font-bold text-black">
                  {arabicName}
                </span>
                <span className="text-sm text-primary-foreground/80">
                  ({revelationType})
                </span>
              </DialogTitle>
              <DialogDescription>
                {frenchName} — {englishName} — {ayahCount} versets
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="p-2 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                aria-label="Fermer"
              >
                <X className="w-5 h-5 text-black" />
              </button>
              {windowMode === "normal" ? (
                <button
                  onClick={() => setWindowMode("maximized")}
                  className="p-2 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  aria-label="Agrandir"
                >
                  <Maximize className="w-5 h-5 text-black" />
                </button>
              ) : (
                <button
                  onClick={() => setWindowMode("normal")}
                  className="p-2 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  aria-label="Réduire"
                >
                  <Minimize className="w-5 h-5 text-black" />
                </button>
              )}
            </div>
          </DialogHeader>

          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Fermer
              </button>
            </div>

            <div className="surface-card rounded-2xl border bg-card p-6">
              <h3 className="text-sm font-semibold text-black mb-4 flex items-center gap-2">
                <Type className="w-4 h-4" />
                Texte arabe intégrial
                <span className="text-xs bg-secondary/10 text-secondary-deep px-2 py-0.5 rounded-full">
                  {ayahCount} versets
                </span>
              </h3>
              <div dir="rtl" className="text-2xl leading-relaxed text-black font-arabic">
                {ayahs.map((ayah, i) => (
                  <button
                    key={ayah.id}
                    onClick={() => handleCopyAyah(i)}
                    className={`mb-3 last:mb-0 w-full text-right transition-colors hover:bg-muted/30 ${copiedIndex === i ? 'text-emerald-600' : 'text-black'}`}
                  >
                    <span className="text-primary-foreground/30 font-arabic text-lg select-none">
                      {ayah.number}
                    </span>
                    <span
                      className="block font-arabic leading-relaxed"
                      dir="rtl"
                      dangerouslySetInnerHTML={{ __html: ayah.text }}
                    />
                  </button>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => {
                    const fullText = ayahs.map((a) => a.text).join("\n\n");
                    navigator.clipboard.writeText(fullText);
                    setCopiedIndex(-1);
                    setTimeout(() => setCopiedIndex(null), 2000);
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors text-sm`}
                >
                  {copiedIndex === -1 ? (
                    <><Check className="w-4 h-4 text-emerald-600" /> Copié !</>
                  ) : (
                    <><Copy className="w-4 h-4" /> Copier le texte</>
                  )}
                </button>
              </div>
            </div>

            {tafsir.map((item, i) => (
              <div key={i} className="surface-card rounded-2xl border bg-card p-6">
                <h3 className="text-sm font-semibold text-black mb-4 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Tafsir — {item.author}
                </h3>
                <div className="text-sm leading-relaxed text-black space-y-4">
                  {item.content ? (
                    <div
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: item.content }}
                    />
                  ) : (
                    <p className="text-primary-foreground/60">Tafsir vide pour cette source.</p>
                  )}
                </div>
              </div>
            ))}

            {tafsir.length === 0 && (
              <div className="surface-card rounded-2xl border bg-card p-6">
                <h3 className="text-sm font-semibold text-primary-foreground/70 mb-4 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Tafsir
                </h3>
                <p className="text-primary-foreground/60">
                  Aucun tafsir disponible pour cette sourate. Les sources arabes sont peut-être en cours de synchronisation.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
