-- MIGRATION: GIG FIRST ONBOARDING (FULL FIX)
-- 1. Create GIGS table if it doesn't exist
CREATE TABLE IF NOT EXISTS gigs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    owner_user_id UUID REFERENCES auth.users(id),
    vendor_id UUID REFERENCES vendors(id),
    title TEXT,
    category_id TEXT,
    tags TEXT[] DEFAULT '{}',
    short_description TEXT,
    full_description TEXT,
    languages TEXT[] DEFAULT '{}',
    photos JSONB DEFAULT '[]',
    videos JSONB DEFAULT '[]',
    is_free BOOLEAN DEFAULT false,
    currency TEXT DEFAULT 'ILS',
    pricing_type TEXT DEFAULT 'fixed',
    price_amount NUMERIC DEFAULT 0,
    price_includes TEXT,
    addons JSONB DEFAULT '[]',
    location_mode TEXT DEFAULT 'city',
    base_city TEXT,
    radius_km NUMERIC,
    excluded_areas TEXT[] DEFAULT '{}',
    travel_fee NUMERIC,
    suitable_for_kids BOOLEAN DEFAULT true,
    age_limit TEXT,
    event_types TEXT[] DEFAULT '{}',
    duration_minutes NUMERIC,
    min_guests NUMERIC,
    max_guests NUMERIC,
    requirements_text TEXT,
    what_client_needs TEXT,
    booking_method TEXT DEFAULT 'chat',
    lead_time_hours NUMERIC DEFAULT 24,
    status TEXT DEFAULT 'draft',
    share_slug TEXT,
    moderation_status TEXT DEFAULT 'pending',
    template_id TEXT,
    current_step INTEGER DEFAULT 0,
    wizard_completed BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    published_at TIMESTAMPTZ
);

-- 2. Updates vendors status constraint
ALTER TABLE vendors DROP CONSTRAINT IF EXISTS vendors_status_check;
ALTER TABLE vendors ADD CONSTRAINT vendors_status_check 
  CHECK (status IN ('invited', 'gig_created_profile_missing', 'profile_filled_pending_review', 'approved', 'rejected', 'active', 'inactive', 'pending'));

-- 3. Add status_reason to vendors if missing
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS status_reason TEXT;

-- 4. Update gigs status constraint
ALTER TABLE gigs DROP CONSTRAINT IF EXISTS gigs_status_check;
ALTER TABLE gigs ADD CONSTRAINT gigs_status_check 
  CHECK (status IN ('draft', 'pending_review', 'active', 'hidden', 'archived', 'published', 'unlisted'));

-- 5. Enable RLS on Gigs if not enabled
ALTER TABLE gigs ENABLE ROW LEVEL SECURITY;

-- 6. Policies for GIGS (User can read own drafts, Public can read active)
DROP POLICY IF EXISTS "Users can view own gigs" ON gigs;
CREATE POLICY "Users can view own gigs" ON gigs 
  FOR SELECT USING (auth.uid() = owner_user_id);

DROP POLICY IF EXISTS "Public can view active gigs" ON gigs;
CREATE POLICY "Public can view active gigs" ON gigs 
  FOR SELECT USING (status IN ('active', 'published'));

DROP POLICY IF EXISTS "Users can insert own gigs" ON gigs;
CREATE POLICY "Users can insert own gigs" ON gigs 
  FOR INSERT WITH CHECK (auth.uid() = owner_user_id);

DROP POLICY IF EXISTS "Users can update own gigs" ON gigs;
CREATE POLICY "Users can update own gigs" ON gigs 
  FOR UPDATE USING (auth.uid() = owner_user_id);
