CREATE TYPE public.app_role AS ENUM ('admin');
CREATE TYPE public.plan_tier AS ENUM ('FREE','PRO','RESEARCH','ADMIN');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  display_name text,
  avatar_url text,
  language text DEFAULT 'fr',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile read" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.user_plans (
  user_id uuid PRIMARY KEY,
  plan public.plan_tier NOT NULL DEFAULT 'FREE',
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.user_plans TO authenticated;
GRANT ALL ON public.user_plans TO service_role;
ALTER TABLE public.user_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own plan read" ON public.user_plans FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own roles read" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE TABLE public.feature_permissions (
  feature_key text PRIMARY KEY,
  required_plan public.plan_tier NOT NULL DEFAULT 'FREE',
  enabled boolean NOT NULL DEFAULT true,
  daily_limit integer,
  monthly_limit integer
);
GRANT SELECT ON public.feature_permissions TO anon, authenticated;
GRANT ALL ON public.feature_permissions TO service_role;
ALTER TABLE public.feature_permissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read" ON public.feature_permissions FOR SELECT TO anon, authenticated USING (true);
INSERT INTO public.feature_permissions (feature_key, required_plan, daily_limit, monthly_limit) VALUES
 ('comptage.basic','FREE',NULL,NULL),
 ('comptage.compare','PRO',NULL,NULL),
 ('statistiques.basic','FREE',NULL,NULL),
 ('statistiques.advanced','PRO',NULL,NULL),
 ('motifs.basic','FREE',20,NULL),
 ('motifs.advanced','PRO',NULL,NULL),
 ('gematrie.basic','FREE',NULL,NULL),
 ('gematrie.advanced','PRO',NULL,NULL),
 ('fourchette.basic','FREE',NULL,NULL),
 ('fourchette.advanced','PRO',NULL,NULL),
 ('analyse_avancee','PRO',NULL,NULL),
 ('comparaison','PRO',NULL,NULL),
 ('saves','FREE',NULL,10),
 ('export.json','RESEARCH',NULL,NULL);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email,'@',1)));
  INSERT INTO public.user_plans (user_id, plan) VALUES (NEW.id, 'FREE');
  RETURN NEW;
END $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();