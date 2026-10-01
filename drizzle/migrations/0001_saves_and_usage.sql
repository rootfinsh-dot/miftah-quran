CREATE TABLE public.saved_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  tool text NOT NULL,
  title text NOT NULL,
  params jsonb NOT NULL DEFAULT '{}'::jsonb,
  summary jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.saved_analyses TO authenticated;
GRANT ALL ON public.saved_analyses TO service_role;
ALTER TABLE public.saved_analyses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own saves read" ON public.saved_analyses FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own saves insert" ON public.saved_analyses FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own saves delete" ON public.saved_analyses FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE INDEX saved_analyses_user_idx ON public.saved_analyses(user_id, created_at DESC);

CREATE TABLE public.usage_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  feature_key text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.usage_events TO authenticated;
GRANT ALL ON public.usage_events TO service_role;
ALTER TABLE public.usage_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own usage read" ON public.usage_events FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own usage insert" ON public.usage_events FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE INDEX usage_events_user_idx ON public.usage_events(user_id, feature_key, created_at DESC);

-- Enforce Free monthly save limit server-side
CREATE OR REPLACE FUNCTION public.enforce_save_limit()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE p plan_tier; lim int; n int;
BEGIN
  SELECT plan INTO p FROM public.user_plans WHERE user_id = NEW.user_id;
  IF public.has_role(NEW.user_id, 'admin') OR COALESCE(p,'FREE') <> 'FREE' THEN RETURN NEW; END IF;
  SELECT monthly_limit INTO lim FROM public.feature_permissions WHERE feature_key = 'saves';
  IF lim IS NULL THEN RETURN NEW; END IF;
  SELECT count(*) INTO n FROM public.saved_analyses WHERE user_id = NEW.user_id AND created_at >= date_trunc('month', now());
  IF n >= lim THEN RAISE EXCEPTION 'SAVE_LIMIT_REACHED'; END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER saved_analyses_limit BEFORE INSERT ON public.saved_analyses FOR EACH ROW EXECUTE FUNCTION public.enforce_save_limit();