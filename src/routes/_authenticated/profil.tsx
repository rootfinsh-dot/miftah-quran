import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { useAccount } from "@/lib/account";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/profil")({
  head: () => ({
    meta: [
      { title: "Mon profil — Miftah" },
      { name: "description", content: "Modifiez votre profil Miftah." },
      { property: "og:title", content: "Mon profil — Miftah" },
      { property: "og:description", content: "Modifiez votre profil Miftah." },
    ],
  }),
  component: Profil,
});

function Profil() {
  const t = useT();
  const qc = useQueryClient();
  const { user } = Route.useRouteContext();
  const { data } = useAccount(user.id);
  const [name, setName] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (data?.profile?.display_name) setName(data.profile.display_name);
  }, [data?.profile?.display_name]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from("profiles").update({ display_name: name, updated_at: new Date().toISOString() }).eq("user_id", user.id);
    setMsg(error ? error.message : t("Profil enregistré."));
    qc.invalidateQueries({ queryKey: ["account", user.id] });
  }

  return (
    <div className="mx-auto max-w-md px-5 py-12">
      <form onSubmit={save} className="surface-card space-y-4 p-8">
        <h1 className="text-3xl font-semibold text-primary-deep">{t("Mon profil")}</h1>
        <p className="text-sm text-muted-foreground">{user.email}</p>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("Nom affiché")} className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm" />
        {msg && <p className="text-sm text-primary">{msg}</p>}
        <button className="btn-emerald w-full px-4 py-2.5 font-medium">{t("Enregistrer")}</button>
      </form>
    </div>
  );
}
