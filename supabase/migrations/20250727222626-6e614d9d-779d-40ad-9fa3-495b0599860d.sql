-- Enable Row Level Security on long_term_rentals table
ALTER TABLE public.long_term_rentals ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all users to read rental properties
CREATE POLICY "Allow public read access to long_term_rentals" 
ON public.long_term_rentals 
FOR SELECT 
USING (true);

-- Also enable RLS on own_short_term table while we're at it
ALTER TABLE public.own_short_term ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all users to read short term rental properties
CREATE POLICY "Allow public read access to own_short_term" 
ON public.own_short_term 
FOR SELECT 
USING (true);