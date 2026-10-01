import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";

import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/lib/auth";
import { useT } from "@/lib/i18n";
import type { PlanCode } from "@/lib/plans";

const RANK: Record<PlanCode, number> = { FREE: 0, PRO: 1, RESEARCH: 2, ADMIN: 3 };

/** Current visitor's plan (visitors count as FREE). */
export function usePlan() {
  const { user, ready } = useUser();
  const q = useQuery({
    queryKey: ["entitlement", user?.id ?? "anon"],
    enabled: ready,
    queryFn: async () => {
      if (!user) return { plan: "FREE" as PlanCode, isAdmin: false };
      const [plan, roles] = await Promise.all([
        supabase.from("user_plans").select("plan").eq("user_id", user.id).maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", user.id),
      ]);
      const isAdmin = (roles.data ?? []).some((r) => r.role === "admin");
      return { plan: (isAdmin ? "ADMIN" : (plan.data?.plan ?? "FREE")) as PlanCode, isAdmin };
    },
  });
  return { user, ready: ready && !q.isPending, plan: q.data?.plan ?? ("FREE" as PlanCode) };
}

export function useFeatures() {
  return useQuery({
    queryKey: ["feature_permissions"],
    staleTime: 5 * 60_000,
    queryFn: async () => {
      const { data } = await supabase.from("feature_permissions").select("*");
      return data ?? [];
    },
  });
}

export function useCanUse(featureKey: string) {
  const { plan, ready } = usePlan();
  const features = useFeatures();
  const f = features.data?.find((x) => x.feature_key === featureKey);
  const required = (f?.required_plan ?? "FREE") as PlanCode;
  return { allowed: RANK[plan] >= RANK[required], required, ready: ready && !features.isPending };
}

/** Lock overlay for content reserved to a higher plan. */
export function ProGate({ feature, children }: { feature: string; children: ReactNode }) {
  const t = useT();
  const { allowed, required, ready } = useCanUse(feature);
  if (!ready || allowed) return <>{children}</>;
  return (
    <div className="relative">
      <div aria-hidden className="pointer-events-none select-none opacity-40 blur-sm">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="surface-card max-w-sm p-6 text-center shadow-lg">
          <p className="text-xs uppercase tracking-widest text-gold">
            {t("Réservé au plan {p}", { p: required === "RESEARCH" ? "Research" : "Pro" })}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("Passez à un plan supérieur pour débloquer cette analyse.")}
          </p>
          <Link to="/pricing" className="btn-emerald mt-4 inline-flex px-4 py-2 text-sm font-medium">
            {t("Voir les tarifs")}
          </Link>
        </div>
      </div>
    </div>
  );
}

const LOCAL_KEY = "miftah-usage";
function todayKey() {
  return new Date().toISOString().slice(0, 10);
}
function localCount(feature: string) {
  try {
    const all = JSON.parse(localStorage.getItem(LOCAL_KEY) ?? "{}");
    return all[todayKey()]?.[feature] ?? 0;
  } catch {
    return 0;
  }
}
function localIncrement(feature: string) {
  const all = (() => {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_KEY) ?? "{}");
    } catch {
      return {};
    }
  })();
  const day = todayKey();
  const next = { [day]: { ...(all[day] ?? {}), [feature]: (all[day]?.[feature] ?? 0) + 1 } };
  localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
}

/** Daily quota for a feature (from feature_permissions.daily_limit). Paid plans are unlimited. */
export function useQuota(featureKey: string) {
  const { user, plan, ready } = usePlan();
  const features = useFeatures();
  const qc = useQueryClient();
  const limit = features.data?.find((x) => x.feature_key === featureKey)?.daily_limit ?? null;
  const unlimited = plan !== "FREE" || limit == null;
  const [tick, setTick] = useState(0);

  const used = useQuery({
    queryKey: ["usage", user?.id ?? "anon", featureKey, todayKey(), tick],
    enabled: ready && !unlimited,
    queryFn: async () => {
      if (!user) return localCount(featureKey) as number;
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const { count } = await supabase
        .from("usage_events")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("feature_key", featureKey)
        .gte("created_at", start.toISOString());
      return count ?? 0;
    },
  });

  const usedN = used.data ?? 0;
  const remaining = unlimited ? Infinity : Math.max(0, (limit ?? 0) - usedN);

  async function consume(): Promise<boolean> {
    if (unlimited) return true;
    if (remaining <= 0) return false;
    if (user) await supabase.from("usage_events").insert({ user_id: user.id, feature_key: featureKey });
    else localIncrement(featureKey);
    setTick((x) => x + 1);
    qc.invalidateQueries({ queryKey: ["usage"] });
    return true;
  }

  return { unlimited, limit, used: usedN, remaining, consume, ready: ready && !features.isPending };
}

export function QuotaBadge({ quota }: { quota: ReturnType<typeof useQuota> }) {
  const t = useT();
  if (!quota.ready || quota.unlimited) return null;
  return (
    <p className="text-xs text-muted-foreground">
      {t("Analyses restantes aujourd'hui : {n} / {m}", { n: quota.remaining, m: quota.limit ?? 0 })}
      {quota.remaining === 0 && (
        <>
          {" — "}
          <Link to="/pricing" className="text-primary hover:text-gold">{t("Passer à Pro")}</Link>
        </>
      )}
    </p>
  );
}

/** Button that saves the current analysis to the user's space. */
export function SaveAnalysisButton({
  tool,
  title,
  params,
  summary,
}: {
  tool: string;
  title: string;
  params: Record<string, unknown>;
  summary: Record<string, unknown>;
}) {
  const t = useT();
  const { user } = useUser();
  const qc = useQueryClient();
  const [state, setState] = useState<"idle" | "saving" | "ok" | "limit" | "error">("idle");

  if (!user)
    return (
      <Link to="/auth" className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-secondary">
        {t("Connectez-vous pour sauvegarder")}
      </Link>
    );

  async function save() {
    setState("saving");
    const { error } = await supabase.from("saved_analyses").insert({
      user_id: user!.id,
      tool,
      title,
      params: params as never,
      summary: summary as never,
    });
    if (error) setState(error.message.includes("SAVE_LIMIT_REACHED") ? "limit" : "error");
    else {
      setState("ok");
      qc.invalidateQueries({ queryKey: ["saved_analyses"] });
    }
  }

  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <button
        onClick={save}
        disabled={state === "saving"}
        className="btn-emerald px-3 py-1.5 text-sm font-medium disabled:opacity-60"
      >
        {state === "saving" ? t("Sauvegarde…") : t("Sauvegarder l'analyse")}
      </button>
      {state === "ok" && <span className="text-sm text-primary">{t("Analyse sauvegardée")}</span>}
      {state === "error" && <span className="text-sm text-destructive">{t("Erreur lors de la sauvegarde")}</span>}
      {state === "limit" && (
        <span className="text-sm text-destructive">
          {t("Limite mensuelle de sauvegardes atteinte.")}{" "}
          <Link to="/pricing" className="underline">{t("Passer à Pro")}</Link>
        </span>
      )}
    </span>
  );
}

export function useSavedAnalyses(userId: string) {
  return useQuery({
    queryKey: ["saved_analyses", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("saved_analyses")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}
