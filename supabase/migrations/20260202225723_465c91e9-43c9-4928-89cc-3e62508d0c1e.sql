-- Add name column to collaboration_requests
ALTER TABLE public.collaboration_requests 
ADD COLUMN name TEXT;