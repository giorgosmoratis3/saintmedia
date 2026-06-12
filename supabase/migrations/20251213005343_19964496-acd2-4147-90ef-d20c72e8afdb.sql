-- Create storage bucket for portfolio videos
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio-videos', 'portfolio-videos', true);

-- Allow anyone to view videos
CREATE POLICY "Anyone can view portfolio videos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'portfolio-videos');

-- Only admins can upload videos
CREATE POLICY "Admins can upload portfolio videos"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'portfolio-videos' AND public.has_role(auth.uid(), 'admin'));

-- Only admins can update videos
CREATE POLICY "Admins can update portfolio videos"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'portfolio-videos' AND public.has_role(auth.uid(), 'admin'));

-- Only admins can delete videos
CREATE POLICY "Admins can delete portfolio videos"
ON storage.objects
FOR DELETE
USING (bucket_id = 'portfolio-videos' AND public.has_role(auth.uid(), 'admin'));