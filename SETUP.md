# Setup Guide for yurixine's Profile Site

## 1. Create a New Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" or sign in if you already have an account
3. Click "New Project"
4. Fill in the details:
   - **Name**: `yurixine-profile` (or any name you prefer)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the closest to your location
5. Click "Create new project" and wait for it to initialize

## 2. Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** (gear icon) > **API**
2. Copy the following values:
   - **Project URL**: This is your `VITE_SUPABASE_URL`
   - **anon public key**: This is your `VITE_SUPABASE_PUBLISHABLE_KEY`
   - **Project Reference ID**: This is your `VITE_SUPABASE_PROJECT_ID`

## 3. Create the Database Table

1. Go to **SQL Editor** in your Supabase dashboard
2. Click "New query"
3. Paste the following SQL and click "Run":

```sql
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
```

## 4. Enable Realtime (Optional - for live view count updates)

1. Go to **Database** > **Replication**
2. Under "Supabase Realtime", find `profile_views` table
3. Toggle it ON to enable realtime updates

## 5. Create Your .env File

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Supabase credentials:
   ```
   VITE_SUPABASE_PROJECT_ID="your-project-id"
   VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-public-key"
   VITE_SUPABASE_URL="https://your-project-id.supabase.co"
   ```

## 6. (Optional) Set Up SteamGridDB for Game Icons

If you want game icons to display when playing games:

1. Go to [https://www.steamgriddb.com](https://www.steamgriddb.com)
2. Sign in and go to **Profile** > **Preferences** > **API**
3. Generate an API key
4. Add it to your `.env`:
   ```
   STEAMGRIDDB_API_KEY="your-steamgriddb-api-key"
   ```

5. Deploy the Edge Function to Supabase:
   - Install Supabase CLI
   - Run `supabase functions deploy steamgriddb-icon`
   - Set the secret: `supabase secrets set STEAMGRIDDB_API_KEY=your-key`

## 7. Install Dependencies and Run

```bash
npm install
npm run dev
```

Visit `http://localhost:8080` to see your site!

## 8. Deploy to GitHub Pages

1. Create a new GitHub repository
2. Push your code to the repository
3. Run:
   ```bash
   npm run deploy
   ```

Your site will be live at `https://yourusername.github.io/me/`

## Customization

### Update Your Social Links
Edit `src/components/SocialIcons.tsx` to add your:
- Discord server invite link
- Instagram profile
- Spotify profile

### Update the Greeting
Edit `src/pages/Index.tsx` and change the greeting text from "hello there!" to whatever you prefer.

### Change Background
In `src/pages/Index.tsx`, update `BACKGROUND_CONFIG` to use a custom image or video.
