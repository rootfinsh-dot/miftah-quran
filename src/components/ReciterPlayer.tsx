import { useState, useEffect, useRef, useCallback } from "react";
import {
  Download,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Globe,
  Music,
  BookOpen,
  AlertTriangle,
  Loader2,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Liste des 114 sourates (numéro, nom, nombre de versets)            */
/* ------------------------------------------------------------------ */
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
  { id: 113, name: "Al-Falaq", ayahs: 5 }, { id: 114, name: "An-Nas", ayahs: 6 },
];

/* ------------------------------------------------------------------ */
/*  Récitateurs (dossiers audio EveryAyah — modernes et classiques)    */
/* ------------------------------------------------------------------ */
const RECITERS = [
  { name: "Mishary Al-Afasy (moderne)", id: "Alafasy_128kbps" },
  { name: "Mishary Al-Afasy (64 kbps)", id: "Alafasy_64kbps" },
  { name: "Abdul Rahman Al-Sudais (moderne)", id: "Sudais_128kbps" },
  { name: "Saud Al-Shuraim (moderne)", id: "Shuraym_128kbps" },
  { name: "Saad Al-Ghamdi (moderne)", id: "Ghamadi_40kbps" },
  { name: "Maher Al-Muaiqly (moderne)", id: "MaherAlMuaiqly128kbps" },
  { name: "Abu Bakr Ash-Shaatree (moderne)", id: "Shatri_128kbps" },
  { name: "Yasser Al-Dosari (moderne)", id: "Yasser_Ad-Dussary_128kbps" },
  { name: "Nasser Al-Qatami (moderne)", id: "Nasser_Alqatami_128kbps" },
  { name: "Ali Al-Hudhaify (classique)", id: "Hudhaify_128kbps" },
  { name: "Mahmoud Khalil Al-Husary (classique)", id: "Husary_128kbps" },
  { name: "Al-Husary (Mujawwad)", id: "Husary_Mujawwad_128kbps" },
  { name: "Mohamed Al-Minshawi (classique)", id: "Minshawi_Murattal_128kbps" },
  { name: "Al-Minshawi (Mujawwad)", id: "Minshawi_Mujawwad_128kbps" },
  { name: "Abdul Basit (Mujawwad, classique)", id: "Abdul_Basit_Mujawwad_128kbps" },
  { name: "Abdul Basit (Murattal, classique)", id: "Abdul_Basit_Murattal_192kbps" },
  { name: "Mohammad Al-Banna (classique)", id: "Muhammad_al_Banna_32kbps" },
  { name: "Ibrahim Al-Akhdar (classique)", id: "Ibrahim_Akhdar_32kbps" },
];

/* ------------------------------------------------------------------ */
/*  Traductions & Tafsir (éditions AlQuran.cloud)                      */
/* ------------------------------------------------------------------ */
const LANGUAGES = [
  { id: "fr.hamidullah", name: "Français — Hamidullah", kind: "traduction" },
  { id: "fr.montada", name: "Français — Montada", kind: "traduction" },
  { id: "en.sahih", name: "English — Sahih International", kind: "traduction" },
  { id: "en.pickthall", name: "English — Pickthall", kind: "traduction" },
  { id: "es.cortes", name: "Español — Cortes", kind: "traduction" },
  { id: "de.aburida", name: "Deutsch — Abu Rida", kind: "traduction" },
  { id: "ja.japanese", name: "日本語 — Japanese", kind: "traduction" },
  { id: "tr.diyanet", name: "Türkçe — Diyanet", kind: "traduction" },
  { id: "ur.jalandhry", name: "اردو — Jalandhry", kind: "traduction" },
  { id: "id.indonesian", name: "Bahasa Indonesia", kind: "traduction" },
  { id: "ru.kuliev", name: "Русский — Kuliev", kind: "traduction" },
  { id: "ar.muyassar", name: "Tafsir Al-Muyassar (arabe)", kind: "tafsir" },
  { id: "ar.jalalayn", name: "Tafsir Al-Jalalayn (arabe)", kind: "tafsir" },
];

/** Types de lecture : un verset / toute la sourate / enchaînement. */
type PlayMode = "ayah" | "surah" | "continue";

const pad3 = (n: number) => String(n).padStart(3, "0");

const formatTime = (s: number) => {
  if (!Number.isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, "0")}`;
};

/* ------------------------------------------------------------------ */
/*  Chargement du texte : AlQuran.cloud puis secours Quran.com        */
/* ------------------------------------------------------------------ */
async function fetchAyahText(surah: number, ayah: number, translation: string) {
  const ref = `${surah}:${ayah}`;

  // 1) AlQuran.cloud v1 (éditions multiples)
  try {
    const res = await fetch(
      `https://api.alquran.cloud/v1/ayah/${ref}/editions/quran-uthmani,${translation}`,
    );
    if (res.ok) {
      const json = await res.json();
      const arr = json?.data;
      if (Array.isArray(arr) && arr.length >= 2) {
        return {
          arabic: arr[0]?.text ?? "",
          translation: arr[1]?.text ?? "",
          source: "alquran.cloud",
        };
      }
    }
  } catch {
    /* on tente le secours */
  }

  // 2) Secours : texte arabe seul via Quran.com
  try {
    const res = await fetch(
      `https://api.quran.com/api/v4/verses/by_key/${ref}?fields=text_uthmani&language=fr`,
    );
    if (res.ok) {
      const json = await res.json();
      const v = json?.verse;
      if (v?.text_uthmani) {
        return {
          arabic: v.text_uthmani,
          translation:
            "Traduction momentanément indisponible (le texte arabe est affiché).",
          source: "quran.com",
        };
      }
    }
  } catch {
    /* échec total */
  }

  return null;
}

/* ------------------------------------------------------------------ */
/*  Composant                                                          */
/* ------------------------------------------------------------------ */
export function ReciterPlayer() {
  const [surahId, setSurahId] = useState(1);
  const [ayahId, setAyahId] = useState(1);
  const [reciterId, setReciterId] = useState(RECITERS[0].id);
  const [translationId, setTranslationId] = useState(LANGUAGES[0].id);
  const [mode, setMode] = useState<PlayMode>("surah");

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [text, setText] = useState<{ arabic: string; translation: string }>({
    arabic: "",
    translation: "",
  });
  const [loadingText, setLoadingText] = useState(true);
  const [textError, setTextError] = useState<string | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);
  const requestId = useRef(0);

  const currentSurah = SURAHS.find((s) => s.id === surahId) ?? SURAHS[0];
  const audioUrl = `https://everyayah.com/data/${reciterId}/${pad3(surahId)}${pad3(ayahId)}.mp3`;

  /* -------- Chargement du texte / tafsir -------- */
  useEffect(() => {
    const myId = ++requestId.current;
    setLoadingText(true);
    setTextError(null);

    fetchAyahText(surahId, ayahId, translationId).then((result) => {
      if (requestId.current !== myId) return; // réponse obsolète
      if (result) {
        setText({ arabic: result.arabic, translation: result.translation });
      } else {
        setText({ arabic: "", translation: "" });
        setTextError(
          "Impossible de charger le texte. Vérifiez votre connexion Internet, puis changez de verset pour réessayer.",
        );
      }
      setLoadingText(false);
    });
  }, [surahId, ayahId, translationId]);

  /* -------- Navigation -------- */
  const goNext = useCallback(
    (auto = false) => {
      const surah = SURAHS.find((s) => s.id === surahId) ?? SURAHS[0];

      if (auto && mode === "ayah") {
        setIsPlaying(false);
        return;
      }

      if (ayahId < surah.ayahs) {
        setAyahId((a) => a + 1);
        return;
      }

      // fin de la sourate
      if (auto && mode === "surah") {
        setIsPlaying(false);
        return;
      }

      if (surahId < 114) {
        setSurahId((s) => s + 1);
        setAyahId(1);
      } else {
        setIsPlaying(false);
      }
    },
    [surahId, ayahId, mode],
  );

  const goPrev = () => {
    if (ayahId > 1) {
      setAyahId((a) => a - 1);
      return;
    }
    if (surahId > 1) {
      const prev = SURAHS.find((s) => s.id === surahId - 1) ?? SURAHS[0];
      setSurahId((s) => s - 1);
      setAyahId(prev.ayahs);
    }
  };

  const togglePlay = () => {
    const el = audioRef.current;
    if (!el) return;
    if (isPlaying) el.pause();
    else void el.play();
  };

  /* -------- Lecture automatique au changement de piste -------- */
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    if (isPlaying) {
      el.play().catch(() => {
        setAudioError(
          "La lecture n'a pas pu démarrer. Cliquez à nouveau sur Lecture.",
        );
        setIsPlaying(false);
      });
    }
  }, [audioUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  const startSurah = () => {
    setAyahId(1);
    setMode("surah");
    setIsPlaying(true);
  };

  const seek = (value: number) => {
    const el = audioRef.current;
    if (!el) return;
    el.currentTime = value;
    setCurrentTime(value);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  /* ------------------------------------------------------------------ */
  return (
    <div className="w-full">
      <div className="surface-card mx-auto w-full max-w-5xl overflow-hidden rounded-3xl border-2 border-emerald-600/20 bg-white shadow-2xl">
        {/* ============ ZONE DE TEXTE (SOUS-TITRES + TAFSIR) ============ */}
        <div className="relative flex min-h-[340px] flex-col justify-center gap-6 bg-emerald-950 px-5 py-10 text-center sm:min-h-[420px] sm:px-12 sm:py-14">
          <div className="absolute inset-x-0 top-4 flex justify-center">
            <span className="rounded-full bg-emerald-500/20 px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-300">
              Sourate {surahId} · {currentSurah.name} · Verset {ayahId} / {currentSurah.ayahs}
            </span>
          </div>

          {loadingText ? (
            <div className="flex flex-col items-center gap-3 text-emerald-200/70">
              <Loader2 className="h-7 w-7 animate-spin" />
              <p className="text-sm">Chargement du texte…</p>
            </div>
          ) : textError ? (
            <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-xl bg-amber-500/10 p-5 text-amber-200">
              <AlertTriangle className="h-6 w-6" />
              <p className="text-sm leading-relaxed">{textError}</p>
            </div>
          ) : (
            <>
              <p
                dir="rtl"
                className="arabic text-2xl leading-[2.4] text-white sm:text-3xl md:text-4xl md:leading-[2.3]"
              >
                {text.arabic}
              </p>
              <div className="mx-auto h-px w-24 bg-emerald-400/30" />
              <p className="mx-auto max-w-3xl text-sm italic leading-relaxed text-emerald-100/80 sm:text-base">
                {text.translation}
              </p>
            </>
          )}
        </div>

        {/* ============ BARRE DE CONTRÔLE ============ */}
        <div className="bg-white p-5 sm:p-7">
          {audioError && (
            <div className="mb-4 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-800">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{audioError}</span>
            </div>
          )}

          {/* Progression */}
          <div className="mb-5">
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={currentTime}
              onChange={(e) => seek(Number(e.target.value))}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-emerald-100 accent-emerald-600"
              style={{
                background: `linear-gradient(to right, #059669 ${progress}%, #d1fae5 ${progress}%)`,
              }}
              aria-label="Progression de la lecture"
            />
            <div className="mt-1.5 flex justify-between text-[11px] font-medium text-gray-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Boutons principaux — zone agrandie */}
          <div className="flex items-center justify-center gap-4 sm:gap-8">
            <button
              onClick={goPrev}
              className="rounded-full p-3 text-gray-400 transition hover:bg-emerald-50 hover:text-emerald-600 active:scale-90"
              aria-label="Verset précédent"
            >
              <SkipBack className="h-6 w-6" />
            </button>

            <button
              onClick={togglePlay}
              className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xl transition hover:scale-105 hover:bg-emerald-700 active:scale-95 sm:h-24 sm:w-24"
              aria-label={isPlaying ? "Pause" : "Lecture"}
            >
              {isPlaying ? (
                <Pause className="h-9 w-9 sm:h-10 sm:w-10" />
              ) : (
                <Play className="ml-1 h-9 w-9 sm:h-10 sm:w-10" />
              )}
            </button>

            <button
              onClick={() => goNext(false)}
              className="rounded-full p-3 text-gray-400 transition hover:bg-emerald-50 hover:text-emerald-600 active:scale-90"
              aria-label="Verset suivant"
            >
              <SkipForward className="h-6 w-6" />
            </button>
          </div>

          {/* Mode de lecture */}
          <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {[
              { key: "ayah" as PlayMode, label: "Verset seul" },
              { key: "surah" as PlayMode, label: "Sourate entière" },
              { key: "continue" as PlayMode, label: "Enchaîner tout" },
            ].map((m) => (
              <button
                key={m.key}
                onClick={() => setMode(m.key)}
                className={`rounded-xl border-2 px-3 py-2.5 text-xs font-bold transition ${
                  mode === m.key
                    ? "border-emerald-600 bg-emerald-600 text-white shadow"
                    : "border-gray-100 bg-gray-50 text-gray-600 hover:border-emerald-300"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Bouton "lire toute la sourate" */}
          <button
            onClick={startSurah}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-emerald-600 bg-white py-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50 active:scale-[0.99]"
          >
            <BookOpen className="h-4 w-4" />
            Lire {currentSurah.name} en entier (à partir du verset 1)
          </button>

          {/* Sélecteurs */}
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 ml-1 flex items-center gap-1 text-[10px] font-bold uppercase text-gray-400">
                <Globe className="h-3 w-3" /> Langue / Tafsir
              </label>
              <select
                value={translationId}
                onChange={(e) => setTranslationId(e.target.value)}
                className="w-full rounded-xl border-2 border-gray-100 bg-gray-50 p-3 text-sm font-semibold text-black outline-none transition focus:border-emerald-500"
              >
                <optgroup label="Traductions">
                  {LANGUAGES.filter((l) => l.kind === "traduction").map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Tafsir (exégèse)">
                  {LANGUAGES.filter((l) => l.kind === "tafsir").map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div>
              <label className="mb-1 ml-1 flex items-center gap-1 text-[10px] font-bold uppercase text-gray-400">
                <Music className="h-3 w-3" /> Récitateur
              </label>
              <select
                value={reciterId}
                onChange={(e) => {
                  setReciterId(e.target.value);
                  setAudioError(null);
                }}
                className="w-full rounded-xl border-2 border-gray-100 bg-gray-50 p-3 text-sm font-semibold text-black outline-none transition focus:border-emerald-500"
              >
                {RECITERS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <select
              value={surahId}
              onChange={(e) => {
                setSurahId(Number(e.target.value));
                setAyahId(1);
              }}
              className="rounded-xl border-2 border-gray-100 bg-gray-50 p-3 text-sm font-bold text-black outline-none transition focus:border-emerald-500"
            >
              {SURAHS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.id}. {s.name}
                </option>
              ))}
            </select>

            <select
              value={ayahId}
              onChange={(e) => setAyahId(Number(e.target.value))}
              className="rounded-xl border-2 border-gray-100 bg-gray-50 p-3 text-sm font-bold text-black outline-none transition focus:border-emerald-500"
            >
              {Array.from({ length: currentSurah.ayahs }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  Verset {n}
                </option>
              ))}
            </select>
          </div>

          {/* Téléchargement */}
          <a
            href={audioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-md transition hover:bg-emerald-700 active:scale-[0.99]"
          >
            <Download className="h-4 w-4" /> Télécharger ce verset (MP3)
          </a>

          <p className="mt-3 text-center text-[10px] uppercase tracking-widest text-gray-300">
            Audio : EveryAyah · Texte : AlQuran.cloud
          </p>
        </div>
      </div>

      {/* Lecteur audio technique (masqué : l'interface ci-dessus fait office de lecteur) */}
      <audio
        ref={audioRef}
        key={audioUrl}
        src={audioUrl}
        preload="metadata"
        className="hidden"
        onLoadedMetadata={(e) => {
          setDuration(e.currentTarget.duration);
          setAudioError(null);
        }}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onEnded={() => goNext(true)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() =>
          setAudioError(
            "Aucun fichier audio pour ce verset chez ce récitateur. Choisissez-en un autre dans la liste.",
          )
        }
      />
    </div>
  );
}
