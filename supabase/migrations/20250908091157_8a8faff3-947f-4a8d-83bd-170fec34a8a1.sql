-- Enable Row Level Security on rent_contacts table
ALTER TABLE public.rent_contacts ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert contact information (for contact forms)
CREATE POLICY "Allow anonymous users to submit contact forms" 
ON public.rent_contacts 
FOR INSERT 
WITH CHECK (true);

-- Only allow authenticated users with admin role to read contact information
-- For now, we'll restrict to authenticated users only since no role system exists
CREATE POLICY "Only authenticated users can read contact information" 
ON public.rent_contacts 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Prevent any updates to contact records to maintain data integrity
CREATE POLICY "No updates allowed on contact records" 
ON public.rent_contacts 
FOR UPDATE 
USING (false);

-- Only allow authenticated users to delete contact records (admin cleanup)
CREATE POLICY "Only authenticated users can delete contact records" 
ON public.rent_contacts 
FOR DELETE 
USING (auth.role() = 'authenticated');