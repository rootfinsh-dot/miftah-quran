import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, SkipForward, SkipBack } from "lucide-react";
import { Button } from "@/components/ui/button";

const DEFAULT_RECITER = "Alafasy_128kbps";
// Verified against https://api.alquran.cloud/v1/meta (surahs.references).
const SURAH_AYAH_COUNTS = [
  7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99,
  128, 111, 110, 98, 135, 112, 78, 118, 64, 77, 227, 93, 88, 69, 60,
  34, 30, 73, 54, 45, 83, 182, 88, 75, 85, 54, 53, 89, 59, 37, 35,
  38, 29, 18, 45, 60, 49, 62, 55, 78, 96, 29, 22, 24, 13, 14, 11,
  11, 18, 12, 12, 30, 52, 52, 44, 28, 28, 20, 56, 40, 31, 50, 78,
  46, 42, 29, 19, 36, 25, 22, 17, 19, 26, 30, 20, 15, 21, 11, 8,
  8, 19, 5, 8, 8, 11, 11, 8, 3, 9, 5, 4, 7, 3, 6, 3, 5, 4, 5, 6,
];

export function ReciterPlayer() {
  const [surahId, setSurahId] = useState(1);
  const [ayahId, setAyahId] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const ayahCount = SURAH_AYAH_COUNTS[surahId - 1] ?? 7;
  const audioUrl = `https://everyayah.com/data/${DEFAULT_RECITER}/${String(surahId).padStart(3, '0')}${String(ayahId).padStart(3, '0')}.mp3`;

  // --- CORRECTION : Forcer la lecture à chaque changement de verset ---
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch(() => {
        if (audioRef.current === audio && !audio.paused) return;
        if (audioRef.current === audio) setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [audioUrl, isPlaying]);

  const handleNext = useCallback(() => {
    if (ayahId < ayahCount) {
        setAyahId(prev => prev + 1);
    } else if (surahId < SURAH_AYAH_COUNTS.length) {
        setSurahId(prev => prev + 1);
        setAyahId(1);
    } else {
        setIsPlaying(false);
    }
  }, [ayahId, surahId, ayahCount]);

  return (
    <div className="surface-card p-6 border max-w-3xl mx-auto my-8 text-foreground">
      <audio
        ref={audioRef}
        key={audioUrl}
        src={audioUrl}
        controls
        onEnded={handleNext}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => setIsPlaying(false)}
        className="w-full mb-6"
      />

      <div className="flex items-center justify-center gap-6 mb-6">
        <Button variant="secondary" size="icon" aria-label="Verset précédent" title="Verset précédent" onClick={() => setAyahId(a => Math.max(1, a - 1))}><SkipBack /></Button>
        <Button size="icon" aria-label={isPlaying ? "Pause" : "Lecture"} title={isPlaying ? "Pause" : "Lecture"} onClick={() => { setIsPlaying(!isPlaying); }} className="w-16 h-16 rounded-full">
            {isPlaying ? <Pause /> : <Play />}
        </Button>
        <Button variant="secondary" size="icon" aria-label="Verset suivant" title="Verset suivant" onClick={handleNext}><SkipForward /></Button>
      </div>

      <p className="text-center text-sm font-bold">Sourate {surahId} : Verset {ayahId}</p>
    </div>
  );
}
