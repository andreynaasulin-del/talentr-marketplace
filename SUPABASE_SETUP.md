# Supabase Setup Instructions

## 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub or create an account
4. Click "New Project"
5. Fill in:
   - **Name**: talentr
   - **Database Password**: (create a strong password)
   - **Region**: Choose closest to Israel (e.g., Europe West)
6. Click "Create new project"

## 2. Get API Keys

1. In your Supabase project dashboard, go to **Settings** (gear icon) → **API**
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon public** key (under "Project API keys")

## 3. Update Environment Variables

Open `.env.local` in your project and replace with your actual values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 4. Configure Authentication

### Enable Email/Password Auth:
1. Go to **Authentication** → **Providers**
2. Make sure **Email** is enabled
3. Configure email templates if needed

### Enable Google OAuth (Optional):
1. Go to **Authentication** → **Providers**
2. Find **Google** and click to configure
3. You'll need to:
   - Create a Google Cloud Project
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `https://your-project-id.supabase.co/auth/v1/callback`
4. Copy Client ID and Client Secret to Supabase

## 5. Configure Redirect URLs

1. Go to **Authentication** → **URL Configuration**
2. Add these to **Redirect URLs**:
   - `http://localhost:3000/auth/callback`
   - `https://yourdomain.com/auth/callback` (for production)

## 6. Restart Development Server

After updating `.env.local`:

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

## 7. Test Authentication

1. Go to `http://localhost:3000/signup`
2. Create an account with email/password
3. Check your email for confirmation link
4. Click the link to verify
5. Go to `http://localhost:3000/signin`
6. Sign in with your credentials
7. You should be redirected to `/dashboard`

## Troubleshooting

### "Invalid API key"
- Make sure you copied the **anon public** key, not the service role key
- Check that there are no extra spaces in `.env.local`

### Email not sending
- Go to **Authentication** → **Email Templates**
- Check spam folder
- For production, configure a custom SMTP server

### Google OAuth not working
- Make sure redirect URI is exactly: `https://your-project-id.supabase.co/auth/v1/callback`
- Check that Google OAuth is enabled in Supabase
- Verify Client ID and Secret are correct

## Database Schema (Optional)

To extend user profiles, you can create a `profiles` table:

```sql
-- Run this in Supabase SQL Editor
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  role text check (role in ('client', 'vendor')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table profiles enable row level security;

-- Create policy to allow users to read their own profile
create policy "Users can view own profile"
  on profiles for select
  using ( auth.uid() = id );

-- Create policy to allow users to update their own profile
create policy "Users can update own profile"
  on profiles for update
  using ( auth.uid() = id );
```

## 8. Setup Vendors Database

To set up the complete vendors database:

1. Go to **SQL Editor** in Supabase Dashboard
2. Run `supabase/schema.sql` first - this creates all tables
3. Run `supabase/seed.sql` second - this adds sample vendor data

The schema includes:
- **vendors** - All service providers
- **bookings** - Client booking requests
- **reviews** - Vendor reviews
- **portfolio_images** - Vendor portfolio

All tables have Row Level Security (RLS) enabled for secure access.

## 9. Switch from Mock to Real Data

After running the SQL scripts, update your imports:

```typescript
// OLD (mock data)
import { getVendorById } from '@/data/mockData';

// NEW (real Supabase data)
import { getVendorById } from '@/lib/vendors';
```

Note: The Supabase functions are async, so you'll need to handle them with `await` or `.then()`.

