
-- 1) Push config: remove admin SELECT (service role bypasses RLS in edge functions)
DROP POLICY IF EXISTS "Admins can read push config" ON public.push_config;

-- Helper to expose ONLY the public VAPID key to the browser
CREATE OR REPLACE FUNCTION public.get_vapid_public_key()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public_key FROM public.push_config WHERE id = 'vapid' LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.get_vapid_public_key() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_vapid_public_key() TO anon, authenticated;

-- 2) user_roles: explicit policies preventing self-elevation
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;

CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can insert roles"
ON public.user_roles FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update roles"
ON public.user_roles FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete roles"
ON public.user_roles FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 3) Lock down internal helper function from direct execution by clients
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated, PUBLIC;
