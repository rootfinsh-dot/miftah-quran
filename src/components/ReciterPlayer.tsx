import { useState, useEffect, useRef, useCallback } from "react";
import { Download, Play, Pause, SkipForward, SkipBack, Music } from "lucide-react";

// ... (SURAHS et RECITERS identiques) ...

export function ReciterPlayer() {
  const [surahId, setSurahId] = useState(1);
  const [ayahId, setAyahId] = useState(1);
  const [reciterId, setReciterId] = useState(RECITERS[0].id);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentSurah = SURAHS.find(s => s.id === surahId) || SURAHS[0];
  const audioUrl = `https://everyayah.com/data/${reciterId}/${String(surahId).padStart(3, '0')}${String(ayahId).padStart(3, '0')}.mp3`;

  // --- CORRECTION : Forcer la lecture à chaque changement de verset ---
  useEffect(() => {
    if (isPlaying && audioRef.current) {
        audioRef.current.play().catch(console.error);
    }
  }, [surahId, ayahId, reciterId, isPlaying]);

  const handleNext = useCallback(() => {
    if (ayahId < currentSurah.ayahs) {
        setAyahId(prev => prev + 1);
    } else if (surahId < 114) {
        setSurahId(prev => prev + 1);
        setAyahId(1);
    } else {
        setIsPlaying(false);
    }
  }, [ayahId, surahId, currentSurah]);

  return (
    <div className="surface-card p-6 rounded-3xl border shadow-xl bg-white max-w-3xl mx-auto my-8">
      <audio
        ref={audioRef}
        key={audioUrl}
        src={audioUrl}
        controls
        onEnded={handleNext}
        className="w-full mb-6"
      />

      <div className="flex items-center justify-center gap-6 mb-6">
        <button onClick={() => setAyahId(a => Math.max(1, a - 1))} className="p-3 bg-gray-100 rounded-full"><SkipBack className="text-black" /></button>
        <button onClick={() => { setIsPlaying(!isPlaying); }} className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center">
            {isPlaying ? <Pause /> : <Play />}
        </button>
        <button onClick={handleNext} className="p-3 bg-gray-100 rounded-full"><SkipForward className="text-black" /></button>
      </div>

      <p className="text-center text-sm font-bold text-black">Sourate {surahId} : Verset {ayahId}</p>
    </div>
  );
}
