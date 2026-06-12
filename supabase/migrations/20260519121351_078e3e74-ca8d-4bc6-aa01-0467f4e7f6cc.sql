
CREATE TABLE public.homepage_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  video_url TEXT,
  thumbnail_url TEXT,
  frame_type TEXT NOT NULL DEFAULT 'iphone',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.homepage_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read visible homepage projects"
ON public.homepage_projects FOR SELECT
USING (is_visible = true OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert homepage projects"
ON public.homepage_projects FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update homepage projects"
ON public.homepage_projects FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete homepage projects"
ON public.homepage_projects FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_homepage_projects_updated_at
BEFORE UPDATE ON public.homepage_projects
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
