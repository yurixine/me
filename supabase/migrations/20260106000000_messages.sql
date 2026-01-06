-- Create the messages table for guestbook/messaging feature
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (anyone can view messages)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'messages' AND policyname = 'Allow public read access') THEN
        CREATE POLICY "Allow public read access" ON public.messages FOR SELECT USING (true);
    END IF;
END $$;

-- Create policy for public insert access (anyone can post messages)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'messages' AND policyname = 'Allow public insert access') THEN
        CREATE POLICY "Allow public insert access" ON public.messages FOR INSERT WITH CHECK (true);
    END IF;
END $$;

-- Create index for efficient pagination (ordered by newest first)
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);

-- Enable realtime for the table
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
EXCEPTION WHEN duplicate_object THEN
    NULL;
END $$;
