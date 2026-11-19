import { useState, useEffect, useRef, useCallback } from "react";
import { Download, Play, Pause, SkipForward, SkipBack, Music } from "lucide-react";

const SURAH_AYAH_COUNTS = [
  7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128, 111, 110, 98, 135, 112,
  78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30, 73, 54, 45, 83, 182, 88, 75, 85, 54, 53, 89, 59, 37,
  35, 38, 29, 18, 45, 60, 49, 62, 55, 78, 96, 29, 22, 24, 13, 14, 11, 11, 18, 12, 12, 30, 52, 52,
  44, 28, 28, 20, 56, 40, 31, 50, 78, 46, 42, 29, 19, 36, 25, 22, 17, 19, 26, 30, 20, 15, 21, 11, 8,
  8, 19, 5, 8, 8, 11, 11, 8, 3, 9, 5, 4, 7, 3, 6, 3, 5, 4, 5, 6,
];

const SURAHS = SURAH_AYAH_COUNTS.map((ayahs, i) => ({ id: i + 1, ayahs }));

const RECITERS = [
  { id: "Alafasy_128kbps", name: "Mishary Alafasy" },
  { id: "Abdul_Basit_Murattal_192kbps", name: "Abdul Basit" },
  { id: "Husary_128kbps", name: "Al-Husary" },
  { id: "Minshawy_Murattal_128kbps", name: "Al-Minshawy" },
];

export function ReciterPlayer() {
  const [surahId, setSurahId] = useState(1);
  const [ayahId, setAyahId] = useState(1);
  const [reciterId, setReciterId] = useState(RECITERS[0]?.id ?? "Alafasy_128kbps");
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentSurah = SURAHS.find((s) => s.id === surahId) ?? { id: 1, ayahs: 7 };
  const audioUrl = `https://everyayah.com/data/${reciterId}/${String(surahId).padStart(3, "0")}${String(ayahId).padStart(3, "0")}.mp3`;

  // --- CORRECTION : Forcer la lecture à chaque changement de verset ---
  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(console.error);
    }
  }, [surahId, ayahId, reciterId, isPlaying]);

  const handleNext = useCallback(() => {
    if (ayahId < currentSurah.ayahs) {
      setAyahId((prev) => prev + 1);
    } else if (surahId < 114) {
      setSurahId((prev) => prev + 1);
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
        <button
          onClick={() => setAyahId((a) => Math.max(1, a - 1))}
          className="p-3 bg-gray-100 rounded-full"
        >
          <SkipBack className="text-black" />
        </button>
        <button
          onClick={() => {
            setIsPlaying(!isPlaying);
          }}
          className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center"
        >
          {isPlaying ? <Pause /> : <Play />}
        </button>
        <button onClick={handleNext} className="p-3 bg-gray-100 rounded-full">
          <SkipForward className="text-black" />
        </button>
      </div>

      <p className="text-center text-sm font-bold text-black">
        Sourate {surahId} : Verset {ayahId}
      </p>
    </div>
  );
}
