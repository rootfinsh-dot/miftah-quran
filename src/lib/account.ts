import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";

export function useAccount(userId: string) {
  return useQuery({
    queryKey: ["account", userId],
    queryFn: async () => {
      const [profile, plan, roles] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", userId).maybeSingle(),
        supabase.from("user_plans").select("*").eq("user_id", userId).maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", userId),
      ]);
      return {
        profile: profile.data,
        plan: plan.data,
        isAdmin: (roles.data ?? []).some((r) => r.role === "admin"),
      };
    },
  });
}
