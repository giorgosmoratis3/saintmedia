-- Create partner_logos table for marquee logos
CREATE TABLE public.partner_logos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.partner_logos ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (logos are public)
CREATE POLICY "Partner logos are publicly viewable"
ON public.partner_logos
FOR SELECT
USING (true);

-- Create policy for admin insert
CREATE POLICY "Admins can insert partner logos"
ON public.partner_logos
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create policy for admin update
CREATE POLICY "Admins can update partner logos"
ON public.partner_logos
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Create policy for admin delete
CREATE POLICY "Admins can delete partner logos"
ON public.partner_logos
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_partner_logos_updated_at
BEFORE UPDATE ON public.partner_logos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();