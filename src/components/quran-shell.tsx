import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { useT } from "@/lib/i18n";
import { quranArabicQuery, quranFrenchQuery, type QuranEdition } from "@/lib/quran";

export function useArabicQuran() {
  return useQuery(quranArabicQuery);
}

export function useFrenchQuran() {
  return useQuery(quranFrenchQuery);
}

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  const t = useT();
  return (
    <div className="mx-auto max-w-6xl px-5 pt-12">
      <p className="text-xs uppercase tracking-[0.25em] text-gold">{t(eyebrow)}</p>
      <h1 className="mt-3 text-4xl font-semibold text-primary-deep sm:text-5xl">{t(title)}</h1>
      <div className="gold-rule mt-4 w-20" />
      <p className="mt-4 max-w-2xl text-muted-foreground">{t(description)}</p>
    </div>
  );
}

export function DataGate({
  query,
  children,
}: {
  query: { isPending: boolean; isError: boolean; data: QuranEdition | undefined };
  children: (data: QuranEdition) => ReactNode;
}) {
  const t = useT();
  if (query.isPending) {
    return (
      <div className="surface-card mx-auto mt-10 max-w-6xl p-10 text-center text-muted-foreground">
        <div className="mx-auto mb-4 h-6 w-6 animate-spin rounded-full border-2 border-border border-t-primary" />
        {t("Chargement du texte coranique…")}
      </div>
    );
  }
  if (query.isError || !query.data) {
    return (
      <div className="surface-card mx-auto mt-10 max-w-6xl p-10 text-center text-destructive">
        {t("Le texte n'a pas pu être chargé. Vérifiez votre connexion et rechargez la page.")}
      </div>
    );
  }
  return <>{children(query.data)}</>;
}

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  const t = useT();
  return (
    <div className="surface-card p-5">
      <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">{t(label)}</p>
      <p className="mt-2 font-display text-3xl font-semibold text-primary-deep">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{t(hint)}</p> : null}
    </div>
  );
}
