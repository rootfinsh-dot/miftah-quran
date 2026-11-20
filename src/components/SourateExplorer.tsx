"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { X, BookOpen, Copy, Check, Type } from "lucide-react";

interface Ayah {
  id: number;
  number: number;
  surah: number;
  text: string;
}

interface Tafsir {
  text: string;
  part: number;
  page: number;
  ayahs: string;
}

interface SurahData {
  surah: {
    id: number;
    name: string;
    english_name: string;
    french_name: string;
    revelation_type: string;
    ayahs: Ayah[];
  };
  tafsir: {
    author: string;
    content: string;
  }[];
}

export function SourateExplorer({ surahId }: { surahId: number }) {
  const [data, setData] = useState<SurahData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch surah text from Quranpedia API
        const textRes = await fetch(`https://api.quranpedia.net/v1/mushafs/1/${surahId}`);
        if (!textRes.ok) throw new Error("Impossible de charger le texte");
        const textData: any = await textRes.json();

        // Fetch tafsir from multiple sources
        // We'll fetch one source for now (Ibn Kathir) to keep it simple
        const tafsirRes = await fetch(`https://api.quranpedia.net/v1/ayah/${surahId}/1/book/1`);
        if (!tafsirRes.ok) throw new Error("Impossible de charger le tafsir");
        const tafsirData: any = await tafsirRes.json();

        setData({
          surah: textData.surahs[0],
          tafsir: [{
            author: tafsirData.book.ar_name,
            content: tafsirData.content.map((c: any) => c.text).join("\n\n")
          }]
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur de chargement");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [surahId]);

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (data?.surah.ayahs && data.surah.ayahs.length > 0) {
      const fullText = data.surah.ayahs.map(a => a.text).join("\n\n");
      navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <Dialog open>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Chargement…</DialogTitle>
            <DialogDescription>
              Chargement du texte et du tafsir de la sourate {surahId}…
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
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Erreur</DialogTitle>
            <DialogDescription>{error}</DialogDescription>
          </DialogHeader>
          <div className="text-center text-destructive py-4">
            Veuillez réessayer plus tard.
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!data) return null;

  const surah = data.surah;
  const arabicName = surah.name || "";
  const frenchName = surah.french_name || "";
  const englishName = surah.english_name || "";
  const revelationType = surah.revelation_type || "";
  const ayahs = surah.ayahs || [];
  const tafsirContent = data.tafsir?.[0]?.content || "";

  return (
    <Dialog open>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-3">
              <span dir="rtl" className="text-2xl font-bold text-primary-deep">
                {arabicName}
              </span>
              <span className="text-sm text-primary-foreground/60">
                ({revelationType})
              </span>
            </div>
          </DialogTitle>
          <DialogDescription>
            {frenchName} — {englishName} — {ayahs.length} versets
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Texte arabe */}
          <div className="surface-card rounded-2xl border bg-card p-6">
            <h3 className="text-sm font-semibold text-primary-foreground/70 mb-4 flex items-center gap-2">
              <Type className="w-4 h-4" />
              Texte arabe intégral
            </h3>
            <div dir="rtl" className="text-2xl leading-relaxed text-primary-deep font-arabic">
              {ayahs.map((ayah) => (
                <p key={ayah.id} className="mb-2 last:mb-0">{ayah.text}</p>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleCopy}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors text-sm"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copié !" : "Copier le texte"}
              </button>
            </div>
          </div>

          {/* Tafsir */}
          <div className="surface-card rounded-2xl border bg-card p-6">
            <h3 className="text-sm font-semibold text-primary-foreground/70 mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Tafsir ({data.tafsir?.[0]?.author || "Source"})
            </h3>
            <div className="text-sm leading-relaxed text-primary-deep space-y-4">
              {tafsirContent ? (
                <div className="prose prose-sm max-w-none text-primary-foreground/80">
                  {tafsirContent.split("\n\n").map((paragraph: string, i: number) => (
                    <p key={i} className="mb-3 last:mb-0">{paragraph}</p>
                  ))}
                </div>
              ) : (
                <p className="text-primary-foreground/60">Aucun tafsir disponible pour cette sourate.</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
