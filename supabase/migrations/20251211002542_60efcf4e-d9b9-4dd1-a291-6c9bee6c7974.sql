-- Create packages table
CREATE TABLE public.packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price text NOT NULL,
  description text NOT NULL,
  features text[] NOT NULL DEFAULT '{}',
  is_popular boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;

-- RLS policies for packages
CREATE POLICY "Anyone can read visible packages" 
ON public.packages 
FOR SELECT 
USING ((is_visible = true) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert packages" 
ON public.packages 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update packages" 
ON public.packages 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete packages" 
ON public.packages 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create contact_submissions table
CREATE TABLE public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  business text,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a contact form
CREATE POLICY "Anyone can submit contact form" 
ON public.contact_submissions 
FOR INSERT 
WITH CHECK (true);

-- Only admins can read submissions
CREATE POLICY "Admins can read submissions" 
ON public.contact_submissions 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update submissions (mark as read)
CREATE POLICY "Admins can update submissions" 
ON public.contact_submissions 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete submissions
CREATE POLICY "Admins can delete submissions" 
ON public.contact_submissions 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at on packages
CREATE TRIGGER update_packages_updated_at
BEFORE UPDATE ON public.packages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default packages
INSERT INTO public.packages (name, price, description, features, is_popular, sort_order) VALUES
('Starter', '299', 'Ιδανικό για μικρές επιχειρήσεις που ξεκινούν', ARRAY['2 Reels / μήνα', 'Βασικό editing', '1 πλατφόρμα (Instagram ή TikTok)', 'Μηνιαία αναφορά'], false, 0),
('Growth', '599', 'Για επιχειρήσεις που θέλουν να αναπτυχθούν', ARRAY['4 Reels / μήνα', 'Premium editing & effects', '2 πλατφόρμες', 'Content strategy', 'Εβδομαδιαία αναφορά', 'Priority support'], true, 1),
('Pro', '999', 'Πλήρης διαχείριση για μέγιστα αποτελέσματα', ARRAY['8 Reels / μήνα', 'Cinematic editing', 'Όλες οι πλατφόρμες', 'Full content strategy', 'Influencer collaborations', '24/7 support', 'Monthly strategy call'], false, 2);