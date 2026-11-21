import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import { useT } from "@/lib/i18n";
import { pageHead } from "@/lib/seo";
import { Surah, SURAH_LIST } from "@/lib/sourates";
import { SourateExplorer } from "@/components/SourateExplorer";
import { X, Search, SortAsc, BookOpen } from "lucide-react";

export const Route = createFileRoute("/sourates")({
  head: () => pageHead("Sourates du Coran", "fr"),
  component: SourateIndex,
});

interface ExplorerState {
  isOpen: boolean;
  surahId: number;
}

function SourateIndex() {
  const t = useT();
  const [explorer, setExplorer] = useState<ExplorerState | null>(null);

  // Load saved explorer state from localStorage
  useState(() => {
    try {
      const saved = localStorage.getItem("explorer_state");
      if (saved) {
        setExplorer(JSON.parse(saved));
      }
    } catch {
      // Ignore storage errors
    }
  });

  const openExplorer = (id: number) => {
    setExplorer({ isOpen: true, surahId: id });
    try {
      localStorage.setItem("explorer_state", JSON.stringify({ isOpen: true, surahId: id }));
    } catch {
      // Ignore storage errors
    }
  };

  const closeExplorer = () => {
    setExplorer({ isOpen: false, surahId: 0 });
    try {
      localStorage.setItem("explorer_state", JSON.stringify({ isOpen: false, surahId: 0 }));
    } catch {
      // Ignore storage errors
    }
  };

  const surates = SURAH_LIST;

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="surface-card p-6 rounded-3xl border bg-card shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4 flex-col gap-2 sm:flex-row">
          <div>
            <h1 className="text-3xl font-bold text-primary-deep">
              {t("Sourates du Coran")}
              <span className="text-primary-foreground/70"> ({surates.length})</span>
            </h1>
            <p className="text-sm text-primary-foreground/80 mt-1">
              {t("Toutes les sourates du Coran, classées par numéro de sourate")}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-gold-soft/20 text-gold-soft border border-gold/30">
              {t("114 sourates")}
            </span>
            <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-primary/10 text-primary-deep border border-primary/30">
              {t("Mécquises")}
              <span className="ml-1 text-primary-foreground/70">
                {surates.filter((s) => s.revelationType === "Mecquoise").length}
              </span>
            </span>
            <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-secondary/10 text-secondary-deep border border-secondary/30">
              {t("Médinoises")}
              <span className="ml-1 text-primary-foreground/70">
                {surates.filter((s) => s.revelationType === "Médinoise").length}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid gap-3 sm:grid-cols-3 text-center text-sm text-primary-foreground/70">
        <div className="py-2">
          <div className="text-2xl font-bold text-primary-deep">{surates.length}</div>
          <div className="text-xs text-primary-foreground/50">Sourates {t("au total")}</div>
        </div>
        <div className="py-2">
          <div className="text-2xl font-bold text-primary-deep">
            {surates.filter((s) => s.revelationType === "Mecquoise").length}
          </div>
          <div className="text-xs text-primary-foreground/50">Sourates Mécquantes</div>
        </div>
        <div className="py-2">
          <div className="text-2xl font-bold text-primary-deep">
            {surates.filter((s) => s.revelationType === "Médinoise").length}
          </div>
          <div className="text-xs text-primary-foreground/50">Sourates Médinoises</div>
        </div>
      </div>

      {/* Grille des sourates */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {surates.map((sourate) => (
          <div
            key={sourate.id}
            className="surface-card rounded-2xl border bg-card hover:border-gold/40 hover:shadow-lg transition-all duration-200 p-5 text-left cursor-pointer"
            onClick={() => openExplorer(sourate.id)}
            tabIndex={0}
            role="button"
            aria-label={`Explorer la sourate ${sourate.frenchName}`}
          >
            <div className="flex items-start justify-between gap-3 flex-wrap gap-2">
              <div>
                <h3 className="text-lg font-bold text-primary-deep leading-tight">
                  {sourate.frenchName}
                </h3>
                <p className="text-xs text-primary-foreground/60 mt-0.5" dir="rtl">
                  {sourate.name}
                </p>
              </div>
              <span className="text-lg font-bold text-primary-deep/60 bg-primary/5 px-2 py-1 rounded">
                {sourate.id}
              </span>
            </div>
            <div className="mt-3 flex items-center gap-3 text-sm text-primary-foreground/80">
              <span className="text-xs px-2 py-1 rounded bg-secondary/10 text-secondary-deep">
                {sourate.ayahCount} {t("versets")}
              </span>
              <span
                className={`text-xs px-2 py-1 rounded $\n
                  sourate.revelationType === "Mecquoise"\n
                    ? "bg-gold-soft/20 text-gold-soft border border-gold/30"\n
                    : "bg-secondary/10 text-secondary-deep border border-secondary/30"
                `}
              >
                {t(sourate.revelationType)}
              </span>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-sm text-primary-deep group-hover:gap-2 transition-all">
              <BookOpen className="w-4 h-4 text-primary-foreground/40" />
              {t("Explorer")}
            </div>
          </div>
        ))}
      </div>

      {explorer?.isOpen && (
        <SourateExplorer surahId={explorer.surahId} onClose={closeExplorer} />
      )}

      <Outlet />
    </div>
  );
}
