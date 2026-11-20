import { createFileRoute, Link } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";
import { pageHead } from "@/lib/seo";
import { Surah, SURAH_LIST } from "@/lib/sourates";

export const Route = createFileRoute("/sourates")({
  head: () => pageHead("Sourates du Coran", "fr"),
  component: SourateIndex,
});

function SourateIndex() {
  const t = useT();
  const surates = SURAH_LIST;

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="surface-card p-6 rounded-3xl border bg-card shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary-deep">
              {t("Sourates du Coran")} <span className="text-primary-foreground/70">({SURAH_LIST.length})</span>
            </h1>
            <p className="text-sm text-primary-foreground/80">
              {t("Toutes les sourates du Coran, classées par numéro de sourate")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-gold-soft/20 text-gold-soft border border-gold/30">
              {t("114 sourates")}
            </span>
            <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-primary/10 text-primary-deep border border-primary/30">
              {t("Mécquises")}
              <span className="ml-1 text-primary-foreground/70">
                {SURAH_LIST.filter((s) => s.revelationType === "Mecquoise").length}
              </span>
            </span>
            <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-secondary/10 text-secondary-deep border border-secondary/30">
              {t("Médinoises")}
              <span className="ml-1 text-primary-foreground/70">
                {SURAH_LIST.filter((s) => s.revelationType === "Médinoise").length}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid gap-3 sm:grid-cols-3 text-center text-sm text-primary-foreground/70">
        <div className="py-2">
          <div className="text-2xl font-bold text-primary-deep">{SURAH_LIST.length}</div>
          <div className="text-xs text-primary-foreground/50">Sourates {t("au total")}</div>
        </div>
        <div className="py-2">
          <div className="text-2xl font-bold text-primary-deep">
            {SURAH_LIST.filter(s => s.revelationType === "Mecquoise").length}
          </div>
          <div className="text-xs text-primary-foreground/50">Sourates Mécquantes</div>
        </div>
        <div className="py-2">
          <div className="text-2xl font-bold text-primary-deep">
            {SURAH_LIST.filter(s => s.revelationType === "Médinoise").length}
          </div>
          <div className="text-xs text-primary-foreground/50">Sourates Médinoises</div>
        </div>
      </div>

      {/* Grille des sourates */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {surates.map((sourate) => (
          <Link
            to="/sourates"
            className="surface-card rounded-2xl border bg-card hover:border-gold/40 hover:shadow-lg transition-all duration-200 p-5 text-left group"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-primary-deep leading-tight">
                  {sourate.frenchName}
                </h3>
                <p className="text-xs text-primary-foreground/60 mt-0.5">
                  {sourate.name}
                </p>
              </div>
              <span className="text-lg font-bold text-primary-deep/60 bg-primary/5 px-2 py-1 rounded">
                {sourate.id}
              </span>
            </div>
            <div className="mt-3 flex items-center gap-3 text-sm">
              <span className="text-xs px-2 py-1 rounded bg-secondary/10 text-secondary-deep">
                {sourate.ayahCount} {t("versets")}
              </span>
              <span className={`text-xs px-2 py-1 rounded $\n                sourate.revelationType === "Mecquoise"
                  ? "bg-gold-soft/20 text-gold-soft border border-gold/30"
                  : "bg-secondary/10 text-secondary-deep border border-secondary/30"
              }`}>
                {t(sourate.revelationType)}
              </span>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-sm text-primary-deep group-hover:gap-2 transition-all">
              <svg className="w-4 h-4 text-primary-foreground/40" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              {t("Explorer")}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
