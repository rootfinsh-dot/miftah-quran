import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Connexion — Miftah" },
      { name: "description", content: "Créez un compte ou connectez-vous à Miftah." },
      { property: "og:title", content: "Connexion — Miftah" },
      { property: "og:description", content: "Créez un compte ou connectez-vous à Miftah." },
    ],
  }),
  component: AuthPage,
});

type Mode = "login" | "signup" | "forgot";

function AuthPage() {
  const t = useT();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/dashboard" });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((e, s) => {
      if (e === "SIGNED_IN" && s) navigate({ to: "/dashboard" });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin, data: { display_name: name } },
        });
        if (error) throw error;
        setMsg(t("Vérifiez votre boîte mail pour confirmer votre compte."));
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setMsg(t("Un lien de réinitialisation vous a été envoyé."));
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
    if (r.error) setErr(r.error.message ?? String(r.error));
  }

  const title = mode === "login" ? "Connexion" : mode === "signup" ? "Créer un compte" : "Mot de passe oublié";
  const input = "w-full rounded-md border border-border bg-card px-3 py-2 text-sm";

  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <div className="surface-card p-8">
        <h1 className="text-3xl font-semibold text-primary-deep">{t(title)}</h1>
        <div className="gold-rule mt-3 w-16" />
        <form onSubmit={submit} className="mt-6 space-y-4">
          {mode === "signup" && (
            <input className={input} placeholder={t("Nom affiché")} value={name} onChange={(e) => setName(e.target.value)} />
          )}
          <input className={input} type="email" required placeholder={t("E-mail")} value={email} onChange={(e) => setEmail(e.target.value)} />
          {mode !== "forgot" && (
            <input className={input} type="password" required minLength={6} placeholder={t("Mot de passe")} value={password} onChange={(e) => setPassword(e.target.value)} />
          )}
          {err && <p className="text-sm text-destructive">{err}</p>}
          {msg && <p className="text-sm text-primary">{msg}</p>}
          <button disabled={busy} className="btn-emerald w-full px-4 py-2.5 font-medium">
            {t(mode === "login" ? "Se connecter" : mode === "signup" ? "S'inscrire" : "Envoyer le lien")}
          </button>
        </form>
        {mode !== "forgot" && (
          <button onClick={google} className="mt-3 w-full rounded-md border border-border bg-card px-4 py-2.5 text-sm font-medium hover:bg-secondary">
            {t("Continuer avec Google")}
          </button>
        )}
        <div className="mt-6 flex flex-wrap justify-between gap-2 text-sm text-muted-foreground">
          {mode !== "login" && <button onClick={() => setMode("login")} className="hover:text-primary">{t("Déjà un compte ? Se connecter")}</button>}
          {mode !== "signup" && <button onClick={() => setMode("signup")} className="hover:text-primary">{t("Créer un compte")}</button>}
          {mode === "login" && <button onClick={() => setMode("forgot")} className="hover:text-primary">{t("Mot de passe oublié ?")}</button>}
        </div>
      </div>
    </div>
  );
}
