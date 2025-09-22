-- Create new table resales_new_devs with same structure as new_resales
CREATE TABLE public.resales_new_devs (
    property_id text NOT NULL,
    status text,
    currency text,
    development_name text,
    urbanisation_name text,
    province text,
    town text,
    area text,
    description text,
    embedding text,
    description_translated text,
    summary_translated text,
    type text,
    baths integer,
    surface_area jsonb,
    has_garden boolean,
    has_garage boolean,
    features jsonb,
    views jsonb,
    listed_date timestamp with time zone,
    beds integer,
    longitude numeric,
    id integer,
    images jsonb,
    price numeric,
    status_date timestamp without time zone,
    latitude numeric,
    has_pool boolean
);

-- Enable Row Level Security
ALTER TABLE public.resales_new_devs ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (same as new_resales)
CREATE POLICY "Allow anonymous users to read resales_new_devs" 
ON public.resales_new_devs 
FOR SELECT 
USING (true);

CREATE POLICY "Allow authenticated users to read resales_new_devs" 
ON public.resales_new_devs 
FOR SELECT 
USING (true);