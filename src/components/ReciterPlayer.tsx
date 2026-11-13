import { useState, useEffect, useRef } from "react";
import { Download, Play, Pause, SkipForward, Globe, BookOpen, Music, Settings2 } from "lucide-react";

const SURAHS = [
  { id: 1, name: "1. Al-Fatiha", ayahs: 7 }, { id: 2, name: "2. Al-Baqarah", ayahs: 286 },
  { id: 3, name: "3. Ali 'Imran", ayahs: 200 }, { id: 4, name: "4. An-Nisa", ayahs: 176 },
  { id: 5, name: "5. Al-Ma'idah", ayahs: 120 }, { id: 6, name: "6. Al-An'am", ayahs: 165 },
  { id: 7, name: "7. Al-A'raf", ayahs: 206 }, { id: 8, name: "8. Al-Anfal", ayahs: 75 },
  { id: 9, name: "9. At-Tawbah", ayahs: 129 }, { id: 10, name: "10. Yunus", ayahs: 109 },
  { id: 11, name: "11. Hud", ayahs: 123 }, { id: 12, name: "12. Yusuf", ayahs: 111 },
  { id: 13, name: "13. Ar-Ra'd", ayahs: 43 }, { id: 14, name: "14. Ibrahim", ayahs: 52 },
  { id: 15, name: "15. Al-Hijr", ayahs: 99 }, { id: 16, name: "16. An-Nahl", ayahs: 128 },
  { id: 17, name: "17. Al-Isra", ayahs: 111 }, { id: 18, name: "18. Al-Kahf", ayahs: 110 },
  { id: 19, name: "19. Maryam", ayahs: 98 }, { id: 20, name: "20. Ta-Ha", ayahs: 135 },
  { id: 21, name: "21. Al-Anbiya", ayahs: 112 }, { id: 22, name: "22. Al-Hajj", ayahs: 78 },
  { id: 23, name: "23. Al-Mu'minun", ayahs: 118 }, { id: 24, name: "24. An-Nur", ayahs: 64 },
  { id: 25, name: "25. Al-Furqan", ayahs: 77 }, { id: 26, name: "26. Ash-Shu'ara", ayahs: 227 },
  { id: 27, name: "27. An-Naml", ayahs: 93 }, { id: 28, name: "28. Al-Qasas", ayahs: 88 },
  { id: 29, name: "29. Al-'Ankabut", ayahs: 69 }, { id: 30, name: "30. Ar-Rum", ayahs: 60 },
  { id: 31, name: "31. Luqman", ayahs: 34 }, { id: 32, name: "32. As-Sajdah", ayahs: 30 },
  { id: 33, name: "33. Al-Ahzab", ayahs: 73 }, { id: 34, name: "34. Saba", ayahs: 54 },
  { id: 35, name: "35. Fatir", ayahs: 45 }, { id: 36, name: "36. Ya-Sin", ayahs: 83 },
  { id: 37, name: "37. As-Saffat", ayahs: 182 }, { id: 38, name: "38. Sad", ayahs: 88 },
  { id: 39, name: "39. Az-Zumar", ayahs: 75 }, { id: 40, name: "40. Ghafir", ayahs: 85 },
  { id: 41, name: "41. Fussilat", ayahs: 54 }, { id: 42, name: "42. Ash-Shura", ayahs: 53 },
  { id: 43, name: "43. Az-Zukhruf", ayahs: 89 }, { id: 44, name: "44. Ad-Dukhan", ayahs: 59 },
  { id: 45, name: "45. Al-Jathiyah", ayahs: 37 }, { id: 46, name: "46. Al-Ahqaf", ayahs: 35 },
  { id: 47, name: "47. Muhammad", ayahs: 38 }, { id: 48, name: "48. Al-Fath", ayahs: 29 },
  { id: 49, name: "49. Al-Hujurat", ayahs: 18 }, { id: 50, name: "50. Qaf", ayahs: 45 },
  { id: 51, name: "51. Adh-Dhariyat", ayahs: 60 }, { id: 52, name: "52. At-Tur", ayahs: 49 },
  { id: 53, name: "53. An-Najm", ayahs: 62 }, { id: 54, name: "54. Al-Qamar", ayahs: 55 },
  { id: 55, name: "55. Ar-Rahman", ayahs: 78 }, { id: 56, name: "56. Al-Waqi'ah", ayahs: 96 },
  { id: 57, name: "57. Al-Hadid", ayahs: 29 }, { id: 58, name: "58. Al-Mujadilah", ayahs: 22 },
  { id: 59, name: "59. Al-Hashr", ayahs: 24 }, { id: 60, name: "60. Al-Mumtahanah", ayahs: 13 },
  { id: 61, name: "61. As-Saff", ayahs: 14 }, { id: 62, name: "62. Al-Jumu'ah", ayahs: 11 },
  { id: 63, name: "63. Al-Munafiqun", ayahs: 11 }, { id: 64, name: "64. At-Taghabun", ayahs: 18 },
  { id: 65, name: "65. At-Talaq", ayahs: 12 }, { id: 66, name: "66. At-Tahrim", ayahs: 12 },
  { id: 67, name: "67. Al-Mulk", ayahs: 30 }, { id: 68, name: "68. Al-Qalam", ayahs: 52 },
  { id: 69, name: "69. Al-Haqqah", ayahs: 52 }, { id: 70, name: "70. Al-Ma'arij", ayahs: 44 },
  { id: 71, name: "71. Nuh", ayahs: 28 }, { id: 72, name: "72. Al-Jinn", ayahs: 28 },
  { id: 73, name: "73. Al-Muzzammil", ayahs: 20 }, { id: 74, name: "74. Al-Muddaththir", ayahs: 56 },
  { id: 75, name: "75. Al-Qiyamah", ayahs: 40 }, { id: 76, name: "76. Al-Insan", ayahs: 31 },
  { id: 77, name: "77. Al-Mursalat", ayahs: 50 }, { id: 78, name: "78. An-Naba", ayahs: 40 },
  { id: 79, name: "79. An-Nazi'at", ayahs: 46 }, { id: 80, name: "80. 'Abasa", ayahs: 42 },
  { id: 81, name: "81. At-Takwir", ayahs: 29 }, { id: 82, name: "82. Al-Infitar", ayahs: 19 },
  { id: 83, name: "83. Al-Mutaffifin", ayahs: 36 }, { id: 84, name: "84. Al-Inshiqaq", ayahs: 25 },
  { id: 85, name: "85. Al-Buruj", ayahs: 22 }, { id: 86, name: "86. At-Tariq", ayahs: 17 },
  { id: 87, name: "87. Al-A'la", ayahs: 19 }, { id: 88, name: "88. Al-Ghashiyah", ayahs: 26 },
  { id: 89, name: "89. Al-Fajr", ayahs: 30 }, { id: 90, name: "90. Al-Balad", ayahs: 20 },
  { id: 91, name: "91. Ash-Shams", ayahs: 15 }, { id: 92, name: "92. Al-Layl", ayahs: 21 },
  { id: 93, name: "93. Ad-Duha", ayahs: 11 }, { id: 94, name: "94. Ash-Sharh", ayahs: 8 },
  { id: 95, name: "95. At-Tin", ayahs: 8 }, { id: 96, name: "96. Al-'Alaq", ayahs: 19 },
  { id: 97, name: "97. Al-Qadr", ayahs: 5 }, { id: 98, name: "98. Al-Bayyinah", ayahs: 8 },
  { id: 99, name: "99. Az-Zalzalah", ayahs: 8 }, { id: 100, name: "100. Al-'Adiyat", ayahs: 11 },
  { id: 101, name: "101. Al-Qari'ah", ayahs: 11 }, { id: 102, name: "102. At-Takathur", ayahs: 8 },
  { id: 103, name: "103. Al-'Asr", ayahs: 3 }, { id: 104, name: "104. Al-Humazah", ayahs: 9 },
  { id: 105, name: "105. Al-Fil", ayahs: 5 }, { id: 106, name: "106. Quraysh", ayahs: 4 },
  { id: 107, name: "107. Al-Ma'un", ayahs: 7 }, { id: 108, name: "108. Al-Kawthar", ayahs: 3 },
  { id: 109, name: "109. Al-Kafirun", ayahs: 6 }, { id: 110, name: "110. An-Nasr", ayahs: 3 },
  { id: 111, name: "111. Al-Masad", ayahs: 5 }, { id: 112, name: "112. Al-Ikhlas", ayahs: 4 },
  { id: 113, name: "113. Al-Falaq", ayahs: 5 }, { id: 114, name: "114. An-Nas", ayahs: 6 }
];

const RECITERS = [
  { name: "Mishary Rashid Al-Afasy", id: "Alafasy_128kbps" },
  { name: "Mahmoud Khalil Al-Husary", id: "Husary_128kbps" },
  { name: "Abdul Basit (Mujawwad)", id: "Abdul_Basit_Mujawwad_128kbps" },
  { name: "Mohamed Siddiq Al-Minshawi", id: "Minshawi_Murattal_128kbps" },
];

const LANGUAGES = [
  { id: "fr.hamidullah", name: "Français (Hamidullah)" },
  { id: "en.sahih", name: "English (Sahih Intl)" },
  { id: "es.cortes", name: "Español (Cortes)" },
  { id: "de.aburida", name: "Deutsch (Abu Rida)" },
  { id: "ja.japanese", name: "日本語 (Japanese)" },
  { id: "ar.jalalayn", name: "Tafsir Al-Jalalayn (Arabe)" },
  { id: "ar.muyassar", name: "Tafsir Al-Muyassar (Arabe)" },
];

export function ReciterPlayer() {
  const [surahId, setSurahId] = useState(1);
  const [ayahId, setAyahId] = useState(1);
  const [reciterId, setReciterId] = useState(RECITERS[0].id);
  const [translationId, setTranslationId] = useState(LANGUAGES[0].id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [textData, setTextData] = useState({ arabic: "", translation: "" });
  const audioRef = useRef<HTMLAudioElement>(null);

  // Charger le texte et la traduction depuis l'API
  useEffect(() => {
    fetch(`https://api.alquran.cloud/v3/ayah/${surahId}:${ayahId}/editions/quran-uthmani,${translationId}`)
      .then(res => res.json())
      .then(data => {
        if (data.data) {
          setTextData({
            arabic: data.data[0].text,
            translation: data.data[1].text
          });
        }
      });
  }, [surahId, ayahId, translationId]);

  const handleNext = () => {
    const currentSurah = SURAHS.find(s => s.id === surahId);
    if (ayahId < (currentSurah?.ayahs || 0)) {
      setAyahId(prev => prev + 1);
    } else if (surahId < 114) {
      setSurahId(prev => prev + 1);
      setAyahId(1);
    } else {
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const audioUrl = `https://everyayah.com/data/${reciterId}/${String(surahId).padStart(3, '0')}${String(ayahId).padStart(3, '0')}.mp3`;
  const currentSurahObj = SURAHS.find(s => s.id === surahId) || SURAHS[0];

  return (
    <div className="surface-card p-0 rounded-3xl border-2 border-emerald-500/20 overflow-hidden shadow-2xl bg-white max-w-2xl mx-auto my-8">
      {/* Zone d'affichage du texte (Sous-titres) */}
      <div className="bg-emerald-950 p-8 sm:p-12 text-center min-h-[300px] flex flex-col justify-center gap-6 relative">
        <div className="absolute top-4 left-0 right-0 flex justify-center gap-2">
           <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full uppercase tracking-widest font-bold">
             Sourate {surahId} : Verset {ayahId}
           </span>
        </div>
        <p className="arabic text-3xl sm:text-4xl leading-[2.5] text-white drop-shadow-sm font-medium rtl">
          {textData.arabic || "..."}
        </p>
        <p className="text-emerald-200/70 text-base sm:text-lg italic leading-relaxed max-w-lg mx-auto">
          {textData.translation || "Chargement..."}
        </p>
      </div>

      <div className="p-6 bg-white">
        {/* Contrôles de sélection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="space-y-1">
             <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1 ml-1">
               <Globe className="w-3 h-3" /> Langue / Tafsir
             </label>
             <select
               value={translationId}
               onChange={(e) => setTranslationId(e.target.value)}
               className="w-full p-3 rounded-xl border-2 border-gray-100 bg-gray-50 text-black font-semibold outline-none focus:border-emerald-500 transition-all text-sm"
             >
               {LANGUAGES.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
             </select>
          </div>
          <div className="space-y-1">
             <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1 ml-1">
               <Music className="w-3 h-3" /> Récitateur
             </label>
             <select
               value={reciterId}
               onChange={(e) => setReciterId(e.target.value)}
               className="w-full p-3 rounded-xl border-2 border-gray-100 bg-gray-50 text-black font-semibold outline-none focus:border-emerald-500 transition-all text-sm"
             >
               {RECITERS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
             </select>
          </div>
        </div>

        {/* Sélection Sourate/Verset */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <select
            value={surahId}
            onChange={(e) => { setSurahId(Number(e.target.value)); setAyahId(1); }}
            className="p-3 rounded-xl border-2 border-gray-100 bg-gray-50 text-black font-bold outline-none text-sm"
          >
            {SURAHS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select
            value={ayahId}
            onChange={(e) => setAyahId(Number(e.target.value))}
            className="p-3 rounded-xl border-2 border-gray-100 bg-gray-50 text-black font-bold outline-none text-sm"
          >
            {Array.from({ length: currentSurahObj.ayahs }, (_, i) => i + 1).map(n => (
              <option key={n} value={n}>Verset {n}</option>
            ))}
          </select>
        </div>

        {/* Lecteur Audio invisible */}
        <audio
          ref={audioRef}
          key={audioUrl}
          src={audioUrl}
          onEnded={handleNext}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          autoPlay={isPlaying}
        />

        {/* Barre de contrôle principale */}
        <div className="flex items-center gap-6">
           <button
             onClick={togglePlay}
             className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-xl hover:bg-emerald-700 hover:scale-105 active:scale-95 transition-all"
           >
             {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
           </button>

           <div className="flex-1 flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">En cours de lecture</span>
              <span className="text-black font-black text-lg truncate">{currentSurahObj.name}</span>
           </div>

           <button
             onClick={handleNext}
             className="p-4 text-emerald-600 hover:bg-emerald-50 rounded-full transition-all active:scale-90"
             title="Verset suivant"
           >
              <SkipForward className="w-6 h-6" />
           </button>

           <a
             href={audioUrl}
             target="_blank"
             rel="noopener noreferrer"
             className="p-4 text-gray-300 hover:text-emerald-600 transition-all"
             title="Télécharger MP3"
           >
              <Download className="w-6 h-6" />
           </a>
        </div>
      </div>
    </div>
  );
}
