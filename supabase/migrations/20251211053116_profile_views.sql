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
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profile_views' AND policyname = 'Allow public read access') THEN
        CREATE POLICY "Allow public read access" ON public.profile_views FOR SELECT USING (true);
    END IF;
END $$;

-- Create policy for public update access (for incrementing views)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profile_views' AND policyname = 'Allow public update access') THEN
        CREATE POLICY "Allow public update access" ON public.profile_views FOR UPDATE USING (true);
    END IF;
END $$;

-- Insert the initial row with a fixed UUID
INSERT INTO public.profile_views (id, view_count)
VALUES ('00000000-0000-0000-0000-000000000001', 0)
ON CONFLICT (id) DO NOTHING;

-- Enable realtime for the table (ignore if already added)
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.profile_views;
EXCEPTION WHEN duplicate_object THEN
    NULL;
END $$;
