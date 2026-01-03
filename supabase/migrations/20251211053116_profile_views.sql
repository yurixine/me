-- Create the profile_views table for view counting
CREATE TABLE IF NOT EXISTS public.profile_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    view_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.profile_views ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access" ON public.profile_views
    FOR SELECT USING (true);

-- Create policy for public update access (for incrementing views)
CREATE POLICY "Allow public update access" ON public.profile_views
    FOR UPDATE USING (true);

-- Insert the initial row with a fixed UUID
INSERT INTO public.profile_views (id, view_count)
VALUES ('00000000-0000-0000-0000-000000000001', 0)
ON CONFLICT (id) DO NOTHING;

-- Enable realtime for the table
ALTER PUBLICATION supabase_realtime ADD TABLE public.profile_views;
