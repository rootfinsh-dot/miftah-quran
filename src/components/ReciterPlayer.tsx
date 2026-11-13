import { useState, useEffect, useRef, useCallback } from "react";
import { Download, Play, Pause, SkipForward, SkipBack, Globe, Music, BookOpen, AlertTriangle, Loader2 } from "lucide-react";

const SURAHS: { id: number; name: string; ayahs: number }[] = [
  { id: 1, name: "Al-Fatiha", ayahs: 7 }, { id: 2, name: "Al-Baqarah", ayahs: 286 },
  { id: 3, name: "Ali 'Imran", ayahs: 200 }, { id: 4, name: "An-Nisa", ayahs: 176 },
  { id: 5, name: "Al-Ma'idah", ayahs: 120 }, { id: 6, name: "Al-An'am", ayahs: 165 },
  { id: 7, name: "Al-A'raf", ayahs: 206 }, { id: 8, name: "Al-Anfal", ayahs: 75 },
  { id: 9, name: "At-Tawbah", ayahs: 129 }, { id: 10, name: "Yunus", ayahs: 109 },
  { id: 11, name: "Hud", ayahs: 123 }, { id: 12, name: "Yusuf", ayahs: 111 },
  { id: 13, name: "Ar-Ra'd", ayahs: 43 }, { id: 14, name: "Ibrahim", ayahs: 52 },
  { id: 15, name: "Al-Hijr", ayahs: 99 }, { id: 16, name: "An-Nahl", ayahs: 128 },
  { id: 17, name: "Al-Isra", ayahs: 111 }, { id: 18, name: "Al-Kahf", ayahs: 110 },
  { id: 19, name: "Maryam", ayahs: 98 }, { id: 20, name: "Ta-Ha", ayahs: 135 },
  { id: 21, name: "Al-Anbiya", ayahs: 112 }, { id: 22, name: "Al-Hajj", ayahs: 78 },
  { id: 23, name: "Al-Mu'minun", ayahs: 118 }, { id: 24, name: "An-Nur", ayahs: 64 },
  { id: 25, name: "Al-Furqan", ayahs: 77 }, { id: 26, name: "Ash-Shu'ara", ayahs: 227 },
  { id: 27, name: "An-Naml", ayahs: 93 }, { id: 28, name: "Al-Qasas", ayahs: 88 },
  { id: 29, name: "Al-'Ankabut", ayahs: 69 }, { id: 30, name: "Ar-Rum", ayahs: 60 },
  { id: 31, name: "Luqman", ayahs: 34 }, { id: 32, name: "As-Sajdah", ayahs: 30 },
  { id: 33, name: "Al-Ahzab", ayahs: 73 }, { id: 34, name: "Saba", ayahs: 54 },
  { id: 35, name: "Fatir", ayahs: 45 }, { id: 36, name: "Ya-Sin", ayahs: 83 },
  { id: 37, name: "As-Saffat", ayahs: 182 }, { id: 38, name: "Sad", ayahs: 88 },
  { id: 39, name: "Az-Zumar", ayahs: 75 }, { id: 40, name: "Ghafir", ayahs: 85 },
  { id: 41, name: "Fussilat", ayahs: 54 }, { id: 42, name: "Ash-Shura", ayahs: 53 },
  { id: 43, name: "Az-Zukhruf", ayahs: 89 }, { id: 44, name: "Ad-Dukhan", ayahs: 59 },
  { id: 45, name: "Al-Jathiyah", ayahs: 37 }, { id: 46, name: "Al-Ahqaf", ayahs: 35 },
  { id: 47, name: "Muhammad", ayahs: 38 }, { id: 48, name: "Al-Fath", ayahs: 29 },
  { id: 49, name: "Al-Hujurat", ayahs: 18 }, { id: 50, name: "Qaf", ayahs: 45 },
  { id: 51, name: "Adh-Dhariyat", ayahs: 60 }, { id: 52, name: "At-Tur", ayahs: 49 },
  { id: 53, name: "An-Najm", ayahs: 62 }, { id: 54, name: "Al-Qamar", ayahs: 55 },
  { id: 55, name: "Ar-Rahman", ayahs: 78 }, { id: 56, name: "Al-Waqi'ah", ayahs: 96 },
  { id: 57, name: "Al-Hadid", ayahs: 29 }, { id: 58, name: "Al-Mujadilah", ayahs: 22 },
  { id: 59, name: "Al-Hashr", ayahs: 24 }, { id: 60, name: "Al-Mumtahanah", ayahs: 13 },
  { id: 61, name: "As-Saff", ayahs: 14 }, { id: 62, name: "Al-Jumu'ah", ayahs: 11 },
  { id: 63, name: "Al-Munafiqun", ayahs: 11 }, { id: 64, name: "At-Taghabun", ayahs: 18 },
  { id: 65, name: "At-Talaq", ayahs: 12 }, { id: 66, name: "At-Tahrim", ayahs: 12 },
  { id: 67, name: "Al-Mulk", ayahs: 30 }, { id: 68, name: "Al-Qalam", ayahs: 52 },
  { id: 69, name: "Al-Haqqah", ayahs: 52 }, { id: 70, name: "Al-Ma'arij", ayahs: 44 },
  { id: 71, name: "Nuh", ayahs: 28 }, { id: 72, name: "Al-Jinn", ayahs: 28 },
  { id: 73, name: "Al-Muzzammil", ayahs: 20 }, { id: 74, name: "Al-Muddaththir", ayahs: 56 },
  { id: 75, name: "Al-Qiyamah", ayahs: 40 }, { id: 76, name: "Al-Insan", ayahs: 31 },
  { id: 77, name: "Al-Mursalat", ayahs: 50 }, { id: 78, name: "An-Naba", ayahs: 40 },
  { id: 79, name: "An-Nazi'at", ayahs: 46 }, { id: 80, name: "'Abasa", ayahs: 42 },
  { id: 81, name: "At-Takwir", ayahs: 29 }, { id: 82, name: "Al-Infitar", ayahs: 19 },
  { id: 83, name: "Al-Mutaffifin", ayahs: 36 }, { id: 84, name: "Al-Inshiqaq", ayahs: 25 },
  { id: 85, name: "Al-Buruj", ayahs: 22 }, { id: 86, name: "At-Tariq", ayahs: 17 },
  { id: 87, name: "Al-A'la", ayahs: 19 }, { id: 88, name: "Al-Ghashiyah", ayahs: 26 },
  { id: 89, name: "Al-Fajr", ayahs: 30 }, { id: 90, name: "Al-Balad", ayahs: 20 },
  { id: 91, name: "Ash-Shams", ayahs: 15 }, { id: 92, name: "Al-Layl", ayahs: 21 },
  { id: 93, name: "Ad-Duha", ayahs: 11 }, { id: 94, name: "Ash-Sharh", ayahs: 8 },
  { id: 95, name: "At-Tin", ayahs: 8 }, { id: 96, name: "Al-'Alaq", ayahs: 19 },
  { id: 97, name: "Al-Qadr", ayahs: 5 }, { id: 98, name: "Al-Bayyinah", ayahs: 8 },
  { id: 99, name: "Az-Zalzalah", ayahs: 8 }, { id: 100, name: "Al-'Adiyat", ayahs: 11 },
  { id: 101, name: "Al-Qari'ah", ayahs: 11 }, { id: 102, name: "At-Takathur", ayahs: 8 },
  { id: 103, name: "Al-'Asr", ayahs: 3 }, { id: 104, name: "Al-Humazah", ayahs: 9 },
  { id: 105, name: "Al-Fil", ayahs: 5 }, { id: 106, name: "Quraysh", ayahs: 4 },
  { id: 107, name: "Al-Ma'un", ayahs: 7 }, { id: 108, name: "Al-Kawthar", ayahs: 3 },
  { id: 109, name: "Al-Kafirun", ayahs: 6 }, { id: 110, name: "An-Nasr", ayahs: 3 },
  { id: 111, name: "Al-Masad", ayahs: 5 }, { id: 112, name: "Al-Ikhlas", ayahs: 4 },
  { id: 113, name: "Al-Falaq", ayahs: 5 }, { id: 114, name: "An-Nas", ayahs: 6 }
];

const RECITERS = [
  { name: "Mishary Al-Afasy", id: "Alafasy_128kbps" },
  { name: "Al-Husary", id: "Husary_128kbps" },
  { name: "Abdul Basit (Mujawwad)", id: "Abdul_Basit_Mujawwad_128kbps" },
  { name: "Al-Minshawi (Murattal)", id: "Minshawi_Murattal_128kbps" },
  { name: "Al-Sudais", id: "Sudais_128kbps" },
  { name: "Saad Al-Ghamdi", id: "Ghamadi_40kbps" },
];

const LANGUAGES = [
  { id: "fr.hamidullah", name: "Français (Hamidullah)", kind: "traduction" },
  { id: "en.sahih", name: "English (Sahih)", kind: "traduction" },
  { id: "ar.jalalayn", name: "Tafsir Al-Jalalayn", kind: "tafsir" },
  { id: "ar.ibnkathir", name: "Tafsir Ibn Kathir", kind: "tafsir" },
  { id: "ar.tabari", name: "Tafsir Al-Tabari", kind: "tafsir" },
  { id: "ar.qurtubi", name: "Tafsir Al-Qurtubi", kind: "tafsir" },
  { id: "ar.saadi", name: "Tafsir Al-Saadi", kind: "tafsir" },
  { id: "ar.baghawi", name: "Tafsir Al-Baghawi", kind: "tafsir" },
];

export function ReciterPlayer() {
  const [surahId, setSurahId] = useState(1);
  const [ayahId, setAyahId] = useState(1);
  const [reciterId, setReciterId] = useState(RECITERS[0].id);
  const [translationId, setTranslationId] = useState(LANGUAGES[0].id);
  const [mode, setMode] = useState<"ayah" | "surah" | "continue">("surah");
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState({ arabic: "", translation: "" });

  const audioRef = useRef<HTMLAudioElement>(null);
  const currentSurah = SURAHS.find(s => s.id === surahId) || SURAHS[0];

  useEffect(() => {
    fetch(`https://api.alquran.cloud/v1/ayah/${surahId}:${ayahId}/editions/quran-uthmani,${translationId}`)
      .then(res => res.json())
      .then(data => {
        if (data?.data && data.data.length >= 2) {
          setText({ arabic: data.data[0].text, translation: data.data[1].text });
        }
      });
  }, [surahId, ayahId, translationId]);

  const handleNext = useCallback(() => {
    if (mode === "ayah") {
      setIsPlaying(false);
      return;
    }

    if (ayahId < currentSurah.ayahs) {
      setAyahId(prev => prev + 1);
    } else if (surahId < 114) {
      setSurahId(prev => prev + 1);
      setAyahId(1);
    } else {
      setIsPlaying(false);
    }
  }, [ayahId, surahId, currentSurah, mode]);

  const audioUrl = `https://everyayah.com/data/${reciterId}/${String(surahId).padStart(3, '0')}${String(ayahId).padStart(3, '0')}.mp3`;

  return (
    <div className="surface-card p-8 rounded-3xl border shadow-xl bg-white max-w-3xl mx-auto my-8">
      <div className="bg-emerald-950 p-10 rounded-2xl text-center mb-8">
        <p className="arabic text-3xl text-white mb-6 leading-loose">{text.arabic || "..."}</p>
        <p className="text-emerald-200 text-lg italic">{text.translation || "Chargement..."}</p>
      </div>

      <div className="flex items-center justify-center gap-6 mb-8">
        <button onClick={() => setAyahId(Math.max(1, ayahId - 1))} className="p-4 rounded-full bg-gray-100"><SkipBack/></button>
        <button onClick={() => { audioRef.current?.play(); setIsPlaying(true); }} className="w-20 h-20 bg-emerald-600 rounded-full text-white flex items-center justify-center"><Play size={32}/></button>
        <button onClick={handleNext} className="p-4 rounded-full bg-gray-100"><SkipForward/></button>
      </div>

      <audio ref={audioRef} key={audioUrl} src={audioUrl} controls autoPlay={isPlaying} onEnded={handleNext} className="w-full mb-8" />

      <div className="grid grid-cols-2 gap-4">
        <select value={surahId} onChange={(e) => {setSurahId(Number(e.target.value)); setAyahId(1)}} className="p-3 border rounded-xl">{SURAHS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select>
        <select value={translationId} onChange={(e) => setTranslationId(e.target.value)} className="p-3 border rounded-xl">{LANGUAGES.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}</select>
      </div>
    </div>
  );
}
