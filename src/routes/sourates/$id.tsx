import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";
import { pageHead } from "@/lib/seo";
import { SURAH_LIST } from "@/lib/sourates";
import { useQuery } from "@tanstack/react-query";
import { fetchSurah, Ayah, QuranEdition, fetchEdition } from "@/lib/quran";

export const Route = createFileRoute("/sourates/$id")({
  head: ({ match }) => pageHead("Détails de la sourate", match.search.lang),
  component: SourateDetail,
});

function SourateDetail() {
  const t = useT();
  const { id } = useParams({ from: "/sourates/$id" }) as { id: string };
  const sourateId = Number(id);

  const sourate = SURAH_LIST.find((s) => s.id === sourateId);

  const { data: arabicQuran, isLoading: arabicLoading, isError: arabicError } = useQuery({
    queryKey: ["quran", "surah", sourateId, "arabic"],
    queryFn: () => fetchSurah(sourateId),
  });

  const { data: frenchQuran, isLoading: frenchLoading, isError: frenchError } = useQuery({
    queryKey: ["quran", "hmm", sourateId, "french"],
    queryFn: () => fetchEdition(`fr.hamidullah/${sourateId}`),
  });

  // L'API fr.hamidullah/<id> retourne soit une edition (QuranEdition) soit une sourate (Surah)
  const surahAr = arabicQuran;
  const ayahsAr = surahAr?.ayahs ?? [];
  const surahFr = frenchQuran ? ("surahs" in frenchQuran ? frenchQuran.surahs?.[0] : frenchQuran) : null;
  const ayahsFr = surahFr?.ayahs ?? [];

  const isLoading = arabicLoading || frenchLoading;
  const isError = arabicError || frenchError;

  if (!sourate) {
    return (
      <div className="surface-card mx-auto max-w-3xl p-12 text-center">
        <h1 className="text-2xl font-bold text-primary-deep">
          {t("Sourate introuvable")}
        </h1>
        <p className="mt-2 text-primary-foreground/70">
          {t("Numéro de sourate invalide.")}
        </p>
        <Link
          to="/sourates"
          className="btn-emerald inline-flex px-6 py-3 mt-4"
        >
          {t("Retour à la liste")}
        </Link>
      </div>
    );
  }

  // Si la requête API est en cours, afficher un indicateur
  if (isLoading) {
    return (
      <div className="surface-card mx-auto max-w-3xl p-10 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
        <p className="mt-3 text-sm text-primary-foreground/70">
          {t("Chargement de la sourate…")}
        </p>
      </div>
    );
  }

  // Si l'erreur, afficher un message
  if (isError) {
    return (
      <div className="surface-card mx-auto max-w-3xl p-10 text-center">
        <h1 className="text-2xl font-bold text-destructive">
          {t("Erreur de chargement")}
        </h1>
        <p className="mt-2 text-primary-foreground/70">
          {t("Impossible de récupérer le texte de la sourate.")}
        </p>
        <Link
          to="/sourates"
          className="btn-emerald inline-flex px-6 py-3 mt-4"
        >
          {t("Réessayer")}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* En-tête de la sourate */}
      <div className="surface-card rounded-3xl border bg-card shadow-lg p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary-deep leading-tight">
              {sourate.frenchName}
            </h1>
            <p className="text-sm text-primary-foreground/60 mt-1">
              {sourate.name}
            </p>
            <p className="text-xs text-primary-foreground/40 mt-1">
              {sourate.englishName}{" "}
              <span className="text-primary-foreground/40">
                {t("traduction: ")}{t(sourate.frenchName)}
              </span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-lg font-bold text-primary-deep/60 bg-primary/5 px-3 py-1.5 rounded-full border border-primary/20">
              {sourate.id}
            </span>
            <span className={`text-xs px-2.5 py-1.5 rounded-full border ${
              sourate.revelationType === "Mecquoise"
                ? "bg-gold-soft/20 text-gold-soft border-gold/30"
                : "bg-secondary/10 text-secondary-deep border-secondary/30"
            }`}>
              {t(sourate.revelationType)}
            </span>
            <span className="text-xs font-medium px-2.5 py-1.5 rounded-full bg-primary/5 text-primary-deep border border-primary/20">
              {sourate.ayahCount} {t("versets")}
            </span>
          </div>
        </div>
      </div>

      {/* Contenu de la sourate : récit et versets */}
      <div className="surface-card rounded-3xl border bg-card shadow-sm p-6">
        <h2 className="text-xl font-bold text-primary-deep mb-4">
          {t("Récitation")}
        </h2>
        <p className="text-sm text-primary-foreground/70 mb-4">
          {t("Sélectionnez un reciteur pour écouter la sourate.")}
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {/* Reciteurs disponibles (mêmes que dans le lecteur) */}
          {[
            { id: "Alafasy", name: "Mishary Alafasy" },
            { id: "Abdul_Basit", name: "Abdul Basit" },
            { id: "Husary", name: "Mahmoud Khalil Al-Husary" },
            { id: "Minshawy", name: "Mohamed Siddiq Al-Minshawy" },
            { id: "As-Sudais", name: "Abdurrahman As-Sudais" },
          ].map((r) => (
            <button
              key={r.id}
              className="surface-card rounded-xl border bg-card p-4 text-left hover:border-gold/40 hover:shadow transition-all"
            >
              <div className="text-sm font-medium text-primary-deep">{r.name}</div>
              <div className="text-xs text-primary-foreground/50 mt-1">
                Sourate {sourateId} — {t("audio")}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Versets */}
      <div className="surface-card rounded-3xl border bg-card shadow-sm p-6">
        <h2 className="text-xl font-bold text-primary-deep mb-4">
          {t("Versets")}
        </h2>
        <div className="space-y-3">
          {Array.from({ length: sourate.ayahCount }, (_, i) => i + 1).map((ayahNumber) => (
            <div key={ayahNumber} className="flex gap-4">
              <div className="text-right">
                <span className="text-xs font-mono text-primary-foreground/40 bg-primary/5 px-2 py-0.5 rounded">
                  {ayahNumber}
                </span>
              </div>
              <div className="text-sm leading-relaxed text-primary-deep">
                {t("Verset " + ayahNumber)}{" "}
                <span className="text-primary-foreground/50">
                  {t("Texte bientôt disponible")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
