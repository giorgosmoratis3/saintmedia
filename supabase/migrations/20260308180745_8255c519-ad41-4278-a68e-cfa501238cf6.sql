
ALTER TABLE public.collaboration_requests 
  ALTER COLUMN phone DROP NOT NULL,
  ADD COLUMN message text;
