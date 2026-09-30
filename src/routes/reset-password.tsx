import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Nouveau mot de passe — Miftah" },
      { name: "description", content: "Définissez un nouveau mot de passe pour votre compte Miftah." },
      { property: "og:title", content: "Nouveau mot de passe — Miftah" },
      { property: "og:description", content: "Définissez un nouveau mot de passe pour votre compte Miftah." },
    ],
  }),
  component: ResetPage,
});

function ResetPage() {
  const t = useT();
  const navigate = useNavigate();
  const [pw, setPw] = useState("");
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password: pw });
    if (error) return setErr(error.message);
    navigate({ to: "/dashboard" });
  }

  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <form onSubmit={submit} className="surface-card space-y-4 p-8">
        <h1 className="text-3xl font-semibold text-primary-deep">{t("Nouveau mot de passe")}</h1>
        <input type="password" required minLength={6} value={pw} onChange={(e) => setPw(e.target.value)} className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm" />
        {err && <p className="text-sm text-destructive">{err}</p>}
        <button className="btn-emerald w-full px-4 py-2.5 font-medium">{t("Enregistrer")}</button>
      </form>
    </div>
  );
}
