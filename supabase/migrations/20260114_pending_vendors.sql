-- ====================================
-- PENDING VENDORS & ADMIN SYSTEM
-- Migration for pre-registration workflow
-- ====================================
-- Create update_updated_at_column function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS trigger AS $$ BEGIN new.updated_at = now();
RETURN new;
END;
$$ LANGUAGE plpgsql;
-- 1. PENDING VENDORS TABLE (Pre-created profiles awaiting confirmation)
CREATE TABLE IF NOT EXISTS pending_vendors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    -- Confirmation Token (unique link for each pending vendor)
    confirmation_token UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    confirmation_expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '30 days'),
    -- Source Information
    source_type TEXT NOT NULL CHECK (
        source_type IN ('instagram', 'google', 'manual', 'referral')
    ),
    source_url TEXT,
    -- Instagram profile URL or Google Business URL
    source_data JSONB DEFAULT '{}',
    -- Raw scraped data
    -- Pre-filled Profile Data (from Instagram/Google)
    name TEXT NOT NULL,
    category TEXT CHECK (
        category IN (
            'Photographer',
            'Videographer',
            'DJ',
            'MC',
            'Magician',
            'Singer',
            'Musician',
            'Comedian',
            'Dancer',
            'Bartender',
            'Bar Show',
            'Event Decor',
            'Kids Animator',
            'Face Painter',
            'Piercing/Tattoo',
            'Chef',
            'Model',
            'Influencer',
            'Other'
        )
    ),
    city TEXT,
    -- Contact Info (from scraping)
    email TEXT,
    phone TEXT,
    instagram_handle TEXT,
    website TEXT,
    -- Profile Content
    description TEXT,
    image_url TEXT,
    portfolio_urls TEXT [] DEFAULT '{}',
    -- Array of image URLs from Instagram
    -- Pricing Guess
    price_from INTEGER,
    -- Tags inferred from content
    tags TEXT [] DEFAULT '{}',
    -- Follower/Rating Data
    instagram_followers INTEGER,
    google_rating NUMERIC(2, 1),
    google_reviews_count INTEGER,
    -- Workflow Status
    status TEXT DEFAULT 'pending' CHECK (
        status IN (
            'pending',
            -- Just created, link not sent
            'invited',
            -- Invitation link sent
            'viewed',
            -- Vendor clicked the link
            'confirmed',
            -- Vendor confirmed and became real vendor
            'declined',
            -- Vendor explicitly declined
            'expired' -- Link expired without action
        )
    ),
    -- Outreach Tracking
    invitation_sent_at TIMESTAMP WITH TIME ZONE,
    invitation_method TEXT,
    -- 'email', 'instagram_dm', 'whatsapp'
    reminder_count INTEGER DEFAULT 0,
    last_reminder_at TIMESTAMP WITH TIME ZONE,
    -- Admin Notes
    admin_notes TEXT,
    created_by UUID REFERENCES auth.users(id),
    -- After confirmation, link to real vendor
    converted_vendor_id UUID REFERENCES vendors(id)
);
-- 2. ADMIN USERS TABLE (Track admin permissions)
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    role TEXT DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'moderator')),
    permissions JSONB DEFAULT '{"can_create_pending": true, "can_view_vendors": true, "can_edit_vendors": false, "can_delete": false}'::jsonb,
    is_active BOOLEAN DEFAULT true
);
-- 3. ACTIVITY LOG (Track admin actions)
CREATE TABLE IF NOT EXISTS admin_activity_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    admin_id UUID REFERENCES admin_users(id),
    action TEXT NOT NULL,
    -- 'created_pending', 'sent_invitation', 'approved_vendor', etc.
    target_type TEXT,
    -- 'pending_vendor', 'vendor', 'booking'
    target_id UUID,
    details JSONB DEFAULT '{}'
);
-- ====================================
-- ROW LEVEL SECURITY
-- ====================================
-- Enable RLS
ALTER TABLE pending_vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Admins can manage pending vendors" ON pending_vendors;
DROP POLICY IF EXISTS "Public can view own pending profile via token" ON pending_vendors;
DROP POLICY IF EXISTS "Admins can view admin list" ON admin_users;
DROP POLICY IF EXISTS "Super admins can manage admins" ON admin_users;
DROP POLICY IF EXISTS "Admins can view activity log" ON admin_activity_log;
DROP POLICY IF EXISTS "System can insert activity log" ON admin_activity_log;

-- PENDING VENDORS: Only admins can see and manage
CREATE POLICY "Admins can manage pending vendors" ON pending_vendors FOR ALL USING (
    auth.uid() IN (
        SELECT user_id
        FROM admin_users
        WHERE is_active = true
    )
);
-- Special: Allow public access via confirmation token (for the confirmation page)
CREATE POLICY "Public can view own pending profile via token" ON pending_vendors FOR
SELECT USING (
        -- This will be checked in the API route with the token
        true
    );
-- ADMIN USERS: Self-view or super_admin
CREATE POLICY "Admins can view admin list" ON admin_users FOR
SELECT USING (
        auth.uid() IN (
            SELECT user_id
            FROM admin_users
            WHERE is_active = true
        )
    );
CREATE POLICY "Super admins can manage admins" ON admin_users FOR ALL USING (
    auth.uid() IN (
        SELECT user_id
        FROM admin_users
        WHERE role = 'super_admin'
            AND is_active = true
    )
);
-- ACTIVITY LOG: Only admins can view
CREATE POLICY "Admins can view activity log" ON admin_activity_log FOR
SELECT USING (
        auth.uid() IN (
            SELECT user_id
            FROM admin_users
            WHERE is_active = true
        )
    );
CREATE POLICY "System can insert activity log" ON admin_activity_log FOR
INSERT WITH CHECK (true);
-- ====================================
-- INDEXES
-- ====================================
CREATE INDEX IF NOT EXISTS idx_pending_vendors_status ON pending_vendors(status);
CREATE INDEX IF NOT EXISTS idx_pending_vendors_token ON pending_vendors(confirmation_token);
CREATE INDEX IF NOT EXISTS idx_pending_vendors_source ON pending_vendors(source_type);
CREATE INDEX IF NOT EXISTS idx_pending_vendors_created ON pending_vendors(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_users_user ON admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_admin ON admin_activity_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created ON admin_activity_log(created_at DESC);
-- ====================================
-- FUNCTIONS
-- ====================================
-- Auto-update updated_at for pending_vendors
DROP TRIGGER IF EXISTS update_pending_vendors_updated_at ON pending_vendors;
CREATE TRIGGER update_pending_vendors_updated_at BEFORE
UPDATE ON pending_vendors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- Function to convert pending vendor to real vendor
CREATE OR REPLACE FUNCTION convert_pending_to_vendor(pending_id UUID, user_id_param UUID DEFAULT NULL) RETURNS UUID AS $$
DECLARE pending_record pending_vendors %ROWTYPE;
new_vendor_id UUID;
BEGIN -- Get the pending vendor
SELECT * INTO pending_record
FROM pending_vendors
WHERE id = pending_id;
IF pending_record IS NULL THEN RAISE EXCEPTION 'Pending vendor not found';
END IF;
IF pending_record.status = 'confirmed' THEN RAISE EXCEPTION 'Already confirmed';
END IF;
-- Insert into vendors table
INSERT INTO vendors (
        user_id,
        name,
        category,
        city,
        description,
        image_url,
        phone,
        email,
        website,
        price_from,
        tags,
        is_verified,
        is_active
    )
VALUES (
        user_id_param,
        pending_record.name,
        COALESCE(pending_record.category, 'Other'),
        COALESCE(pending_record.city, 'Tel Aviv'),
        pending_record.description,
        pending_record.image_url,
        pending_record.phone,
        pending_record.email,
        pending_record.website,
        COALESCE(pending_record.price_from, 0),
        pending_record.tags,
        false,
        -- Will be verified after review
        true
    )
RETURNING id INTO new_vendor_id;
-- Update pending vendor status
UPDATE pending_vendors
SET status = 'confirmed',
    converted_vendor_id = new_vendor_id,
    updated_at = now()
WHERE id = pending_id;
RETURN new_vendor_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;