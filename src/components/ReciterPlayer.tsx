import { useState, useEffect, useRef, useCallback } from "react";
import { Download, Play, Pause, SkipForward, SkipBack, Music, ChevronDown } from "lucide-react";

const SURAH_AYAH_COUNTS = [
  7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128, 111, 110, 98, 135, 112,
  78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30, 73, 54, 45, 83, 182, 88, 75, 85, 54, 53, 89, 59, 37,
  35, 38, 29, 18, 45, 60, 49, 62, 55, 78, 96, 29, 22, 24, 13, 14, 11, 11, 18, 12, 12, 30, 52, 52,
  44, 28, 28, 20, 56, 40, 31, 50, 78, 46, 42, 29, 19, 36, 25, 22, 17, 19, 26, 30, 20, 15, 21, 11, 8,
  8, 19, 5, 8, 8, 11, 11, 8, 3, 9, 5, 4, 7, 3, 6, 3, 5, 4, 5, 6,
];

const SURAHS = SURAH_AYAH_COUNTS.map((ayahs, i) => ({ id: i + 1, ayahs }));

const RECITERS = [
  { id: "Alafasy_128kbps",   name: "Mishary Alafasy" },
  { id: "Alafasy_64kbps",     name: "Mishary Alafasy (64 kbps)" },
  { id: "Abdul_Basit_Murattal_192kbps", name: "Abdul Basit (murattal, 192 kbps)" },
  { id: "Abdul_Basit_Murattal_64kbps",  name: "Abdul Basit (murattal, 64 kbps)" },
  { id: "Abdul_Basit_Mujawwad_128kbps", name: "Abdul Basit (mujawwad, 128 kbps)" },
  { id: "Husary_128kbps",       name: "Mahmoud Khalil Al-Husary" },
  { id: "Husary_Mujawwad_64kbps",   name: "Mahmoud Khalil Al-Husary (mujawwad, 64 kbps)" },
  { id: "Minshawy_Murattal_128kbps",  name: "Mohamed Siddiq Al-Minshawy" },
  { id: "Minshawy_Murattal_64kbps",   name: "Mohamed Siddiq Al-Minshawy (64 kbps)" },
  { id: "Minshawy_Mujawwad_64kbps",   name: "Mohamed Siddiq Al-Minshawy (mujawwad, 64 kbps)" },
  { id: "Abdurrahmaan_As-Sudais_64kbps", name: "Abdurrahman As-Sudais" },
  { id: "Abdurrahmaan_As-Sudais_192kbps", name: "Abdurrahman As-Sudais (192 kbps)" },
  { id: "Saood_ash-Shuraym_64kbps", name: "Saood Ash-Shuraym" },
  { id: "Sahl_Yassin_128kbps",    name: "Sahl Yassin" },
  { id: "Salah_AbdulRahman_Bukhatir_128kbps", name: "Salah Abdulrahman Bukhatir" },
  { id: "Abdullah_Matroud_128kbps", name: "Abdullah Matroud" },
  { id: "Abdullah_Basfar_64kbps", name: "Abdullah Basfar" },
  { id: "Abdullaah_3awwaad_Al-Juhaynee_128kbps", name: "Abdullah Awwad Al-Juhaynee" },
  { id: "Muhsin_Al_Qasim_192kbps", name: "Muhsin Al-Qasim" },
  { id: "Hudhaify_64kbps",        name: "Ali ibn Abdur-Rahman al-Hudhaify" },
  { id: "Hudhaify_128kbps",       name: "Ali ibn Abdur-Rahman al-Hudhaify (128 kbps)" },
  { id: "Ali_Jaber_64kbps",       name: "Ali Jaber" },
  { id: "Ali_Hajjaj_AlSuesy_128kbps", name: "Ali Hajjaj AlSuesy" },
  { id: "Fares_Abbad_64kbps",     name: "Fares Abbad" },
  { id: "Nasser_Alqatami_128kbps", name: "Nasser Alqatami" },
  { id: "Nabil_Rifa3i_48kbps",    name: "Nabil Rifai" },
  { id: "Hani_Rifai_64kbps",      name: "Hani Rifai" },
  { id: "Mohammad_al_Tablaway_64kbps", name: "Mohammad Al-Tablaway" },
  { id: "Muhammad_Ayyoub_64kbps", name: "Muhammad Ayyoub" },
  { id: "Mahmud_ali_al_banna_32kbps", name: "Mahmud Ali Al-Banna" },
  { id: "Ghamadi_40kbps",         name: "Ghamadi" },
  { id: "Ahmed_ibn_ali_al_ajamy_128kbps", name: "Ahmed Ibn Ali Al-Ajamy" },
  { id: "Ibrahim_Akhdar_32kbps",  name: "Ibrahim Akhdar" },
  { id: "Abdullah_Bin_AbdulAziz_192kbps", name: "Abdullah bin AbdulAziz Al-Jasser" },
  { id: "Abdullah_Bin_Aziz_64kbps", name: "Abdullah bin Abdur-Rahman Al-Jasser (64 kbps)" },
  { id: "Husary_Murattal_128kbps",  name: "Mahmoud Khalil Al-Husary (murattal, 128 kbps)" },
  { id: "Husary_Murattal_64kbps",   name: "Mahmoud Khalil Al-Husary (murattal, 64 kbps)" },
  { id: "As-Saleh_Al-Fawzan_128kbps", name: "Saleh Al-Fawzan" },
  { id: "Mohamed_Supposedly_Tabatabaey_128kbps", name: "Mohamed Tabatabaey" },
  { id: "AbdulBaset_Al-Aljameel_128kbps", name: "AbdulBaset Al-Aljameel" },
  { id: "Fuad_Al-Mansour_128kbps", name: "Fuad Al-Mansour" },
  { id: "Shaker_Al-Azami_128kbps",  name: "Shaker Al-Azami" },
  { id: "Abdur-Rahman_Alsudais_128kbps", name: "Abdur Rahman Al-Sudais (128 kbps)" },
  { id: "Muhammad_Metwalli_128kbps", name: "Muhammad Metwalli" },
  { id: "Khalifah_Al-Khalifah_128kbps", name: "Khalifah Al-Khalifah" },
  { id: "Mohammad_Al-West_128kbps",  name: "Mohammad Al West" },
];

export function ReciterPlayer() {
  const [surahId, setSurahId] = useState(1);
  const [ayahId, setAyahId] = useState(1);
  const [reciterId, setReciterId] = useState(RECITERS[0]?.id ?? "Alafasy_128kbps");
  const [isPlaying, setIsPlaying] = useState(false);
  const [showReciterDropdown, setShowReciterDropdown] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentSurah = SURAHS.find((s) => s.id === surahId) ?? { id: 1, ayahs: 7 };
  const audioUrl = `https://everyayah.com/data/${reciterId}/${String(surahId).padStart(3, "0")}${String(ayahId).padStart(3, "0")}.mp3`;

  // Force playback on surah/ayah/reciter change
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
      {/* En-tête : titre + sélecteur de reciteur */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <h2 className="text-lg font-bold text-primary-deep flex items-center gap-2">
          <Music className="w-5 h-5 text-gold-soft" />
          Lecteur de Coran
        </h2>
        <div className="relative">
          <button
            type="button"
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-card text-sm font-medium text-primary-deep hover:bg-muted/50 transition-colors"
            onClick={() => setShowReciterDropdown((v) => !v)}
            aria-label="Choisir un reciteur"
          >
            <span>{RECITERS.find((r) => r.id === reciterId)?.name ?? "Reciteur"}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showReciterDropdown ? "rotate-180" : ""}`} />
          </button>
          {showReciterDropdown && (
            <div className="absolute end-0 top-12 z-50 w-80 max-h-80 overflow-auto rounded-xl border border-border bg-card shadow-lg p-2">
              {RECITERS.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted/50 text-sm text-primary-deep"
                  onClick={() => {
                    setReciterId(r.id);
                    setShowReciterDropdown(false);
                  }}
                >
                  <span className="font-medium">{r.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lecteur audio */}
      <audio
        ref={audioRef}
        key={audioUrl}
        src={audioUrl}
        controls
        className="w-full mb-6"
      />

      {/* Contrôles */}
      <div className="flex items-center justify-center gap-6 mb-6">
        <button
          onClick={() => setAyahId((a) => Math.max(1, a - 1))}
          className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
          aria-label="Verset précédent"
        >
          <SkipBack className="text-black" />
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center hover:bg-emerald-700 transition-colors"
        >
          {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
        </button>
        <button
          onClick={handleNext}
          className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
          aria-label="Verset suivant"
        >
          <SkipForward className="text-black" />
        </button>
      </div>

      {/* Indication de verset */}
      <p className="text-center text-sm font-bold text-black">
        Sourate {surahId} : Verset {ayahId} / {currentSurah.ayahs}
      </p>
    </div>
  );
}
