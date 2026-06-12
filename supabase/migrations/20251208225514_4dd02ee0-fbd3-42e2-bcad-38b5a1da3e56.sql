-- Create site_content table for editable page content
CREATE TABLE public.site_content (
  id TEXT PRIMARY KEY,
  section TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create portfolio_videos table for managing videos
CREATE TABLE public.portfolio_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  platform TEXT NOT NULL DEFAULT 'Instagram',
  views TEXT NOT NULL DEFAULT '0',
  video_url TEXT,
  thumbnail_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user roles enum and table
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on all tables
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function for checking admin role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS Policies for site_content
-- Anyone can read site content (public website)
CREATE POLICY "Anyone can read site content" 
ON public.site_content 
FOR SELECT 
USING (true);

-- Only admins can modify site content
CREATE POLICY "Admins can insert site content" 
ON public.site_content 
FOR INSERT 
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update site content" 
ON public.site_content 
FOR UPDATE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete site content" 
ON public.site_content 
FOR DELETE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for portfolio_videos
-- Anyone can read visible videos (public website)
CREATE POLICY "Anyone can read visible videos" 
ON public.portfolio_videos 
FOR SELECT 
USING (is_visible = true OR public.has_role(auth.uid(), 'admin'));

-- Only admins can modify videos
CREATE POLICY "Admins can insert videos" 
ON public.portfolio_videos 
FOR INSERT 
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update videos" 
ON public.portfolio_videos 
FOR UPDATE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete videos" 
ON public.portfolio_videos 
FOR DELETE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_roles
-- Users can view their own roles
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

-- Only admins can manage roles
CREATE POLICY "Admins can manage roles" 
ON public.user_roles 
FOR ALL 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_site_content_updated_at
BEFORE UPDATE ON public.site_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_portfolio_videos_updated_at
BEFORE UPDATE ON public.portfolio_videos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default portfolio videos
INSERT INTO public.portfolio_videos (title, category, platform, views, sort_order) VALUES
('Instagram Reel', 'Εστιατόριο', 'Instagram', '125K', 1),
('TikTok Promo', 'Κομμωτήριο', 'TikTok', '89K', 2),
('Instagram Reel', 'Καφέ', 'Instagram', '210K', 3),
('TikTok Ad', 'Γυμναστήριο', 'TikTok', '156K', 4),
('Instagram Story', 'Boutique', 'Instagram', '78K', 5),
('TikTok Viral', 'Πιτσαρία', 'TikTok', '340K', 6);

-- Insert default site content
INSERT INTO public.site_content (id, section, content) VALUES
('hero', 'hero', '{"headline": "Κάνουμε την επιχείρησή σου VIRAL.", "subheadline": "Content Marketing Agency για τοπικές επιχειρήσεις – δημιουργούμε στρατηγικά, viral βιντεάκια που αυξάνουν πελάτες και έσοδα.", "cta": "Book a demo", "stat1_value": "50+", "stat1_label": "Επιχειρήσεις", "stat2_value": "1M+", "stat2_label": "Views", "stat3_value": "100%", "stat3_label": "Αφοσίωση"}'),
('services', 'services', '{"title": "Τι Παρέχουμε", "subtitle": "Ολοκληρωμένες λύσεις content marketing για να ξεχωρίσει η επιχείρησή σου"}'),
('why_us', 'why_us', '{"title": "Δεν είμαστε απλά ένα agency", "subtitle": "Είμαστε η ομάδα που θα κάνει την επιχείρησή σου να ξεχωρίσει στο digital κόσμο.", "stat1_value": "5x", "stat1_label": "Περισσότερο Reach", "stat2_value": "48h", "stat2_label": "Απάντηση", "stat3_value": "0", "stat3_label": "Hidden Fees"}'),
('portfolio', 'portfolio', '{"title": "Οι Δουλειές Μας", "subtitle": "Viral videos που έφεραν πραγματικά αποτελέσματα"}'),
('contact', 'contact', '{"title": "Μίλα μας για την επιχείρησή σου", "subtitle": "Είμαστε έτοιμοι να ακούσουμε τις ανάγκες σου και να σου προτείνουμε τη σωστή στρατηγική. Η πρώτη συμβουλευτική είναι δωρεάν.", "phone": "+30 694 123 4567", "email": "hello@saintmedia.gr", "location": "Αθήνα, Ελλάδα"}');