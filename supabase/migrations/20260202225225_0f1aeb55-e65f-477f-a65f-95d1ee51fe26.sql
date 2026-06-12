-- Create collaboration requests table
CREATE TABLE public.collaboration_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_type TEXT NOT NULL,
  phone TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.collaboration_requests ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public form)
CREATE POLICY "Anyone can submit collaboration requests"
ON public.collaboration_requests
FOR INSERT
WITH CHECK (true);

-- Only admins can read
CREATE POLICY "Admins can view collaboration requests"
ON public.collaboration_requests
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can update (mark as read)
CREATE POLICY "Admins can update collaboration requests"
ON public.collaboration_requests
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete
CREATE POLICY "Admins can delete collaboration requests"
ON public.collaboration_requests
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));