-- Create function to update timestamps (if it doesn't exist)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create property inquiries table to store inquiry submissions
CREATE TABLE public.property_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  property_id TEXT NOT NULL,
  property_title TEXT NOT NULL,
  property_ref TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.property_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to submit inquiries (insert only)
CREATE POLICY "Allow anonymous users to submit property inquiries" 
ON public.property_inquiries 
FOR INSERT 
WITH CHECK (true);

-- Only authenticated users (admins) can view inquiries
CREATE POLICY "Only authenticated users can view property inquiries" 
ON public.property_inquiries 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- No updates or deletes allowed for regular operations
CREATE POLICY "No updates allowed on property inquiries" 
ON public.property_inquiries 
FOR UPDATE 
USING (false);

CREATE POLICY "Only authenticated users can delete property inquiries" 
ON public.property_inquiries 
FOR DELETE 
USING (auth.role() = 'authenticated');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_property_inquiries_updated_at
BEFORE UPDATE ON public.property_inquiries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for better performance on common queries
CREATE INDEX idx_property_inquiries_property_id ON public.property_inquiries(property_id);
CREATE INDEX idx_property_inquiries_created_at ON public.property_inquiries(created_at DESC);
CREATE INDEX idx_property_inquiries_email ON public.property_inquiries(email);