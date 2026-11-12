import { useState } from "react";
import { Download } from "lucide-react"; // Importation de l'icône

const RECITERS = [
  { name: "Mishary Al-Afasy", id: "ar.alafasy" },
  { name: "Mahmoud Al-Husary", id: "ar.alhusary" },
  { name: "Abdul Basit", id: "ar.abdulbasit" },
  { name: "Mohamed Al-Minshawi", id: "ar.minshawi" },
];

interface ReciterPlayerProps {
  ayahNumber: number;
}

export function ReciterPlayer({ ayahNumber }: ReciterPlayerProps) {
  const [reciterId, setReciterId] = useState(RECITERS[0].id);
  const audioUrl = `https://cdn.alquran.cloud/media/audio/ayah/${reciterId}/${ayahNumber}`;

  return (
    <div className="surface-card p-4 rounded-xl border mt-4">
      <label className="block text-sm font-medium mb-2 text-muted-foreground">
        Lecteur audio :
      </label>
      <select
        value={reciterId}
        onChange={(e) => setReciterId(e.target.value)}
        className="w-full mb-4 p-2 rounded-lg border bg-background text-sm"
      >
        {RECITERS.map((r) => (
          <option key={r.id} value={r.id}>{r.name}</option>
        ))}
      </select>

      <audio key={audioUrl} controls className="w-full h-10 mb-3">
        <source src={audioUrl} type="audio/mp3" />
        Votre navigateur ne supporte pas la lecture audio.
      </audio>

      {/* Bouton de téléchargement */}
      <a
        href={audioUrl}
        download={`recitation_${reciterId}_ayah${ayahNumber}.mp3`}
        className="flex items-center justify-center gap-2 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-all"
      >
        <Download className="w-4 h-4" /> Télécharger ce verset
      </a>
    </div>
  );
}
