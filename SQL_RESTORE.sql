-- FULL DATABASE RESTORE SCRIPT
-- Run this to create the missing tables

-- 1. Create VENDORS table
CREATE TABLE IF NOT EXISTS vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    user_id UUID REFERENCES auth.users(id),
    name TEXT NOT NULL,
    full_name TEXT, -- legacy support
    category TEXT DEFAULT 'Other',
    city TEXT DEFAULT 'Tel Aviv',
    description TEXT,
    bio TEXT, -- legacy support
    image_url TEXT,
    avatar_url TEXT, -- legacy support
    email TEXT,
    phone TEXT,
    instagram_handle TEXT,
    website TEXT,
    price_from NUMERIC DEFAULT 0,
    portfolio_gallery TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    rating NUMERIC DEFAULT 0,
    reviews_count INTEGER DEFAULT 0,
    edit_token TEXT, -- For magic link editing
    is_active BOOLEAN DEFAULT true,
    is_archived BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'active'
);

-- 2. Create PENDING_VENDORS table (if not exists)
CREATE TABLE IF NOT EXISTS pending_vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    confirmation_token TEXT UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
    confirmation_expires_at TIMESTAMPTZ DEFAULT (now() + interval '7 days'),
    source_type TEXT DEFAULT 'manual',
    source_url TEXT,
    source_data JSONB DEFAULT '{}',
    name TEXT NOT NULL,
    category TEXT,
    city TEXT,
    email TEXT,
    phone TEXT,
    instagram_handle TEXT,
    website TEXT,
    description TEXT,
    image_url TEXT,
    portfolio_urls TEXT[] DEFAULT '{}',
    price_from NUMERIC DEFAULT 0,
    tags TEXT[] DEFAULT '{}',
    instagram_followers INTEGER,
    status TEXT DEFAULT 'pending', -- pending, invited, viewed, confirmed, declined, expired
    invitation_sent_at TIMESTAMPTZ,
    invitation_method TEXT,
    converted_vendor_id UUID REFERENCES vendors(id),
    admin_notes TEXT,
    created_by UUID
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE pending_vendors ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies (Open access for now to fix issues)
-- Allow public read of vendors
DROP POLICY IF EXISTS "Public Read Vendors" ON vendors;
CREATE POLICY "Public Read Vendors" ON vendors FOR SELECT USING (true);

-- Allow public read of pending vendors (for confirmation page)
DROP POLICY IF EXISTS "Public Read Pending Vendors" ON pending_vendors;
CREATE POLICY "Public Read Pending Vendors" ON pending_vendors FOR SELECT USING (true);

-- Allow updates/inserts (You might want to restrict this later)
DROP POLICY IF EXISTS "Public Update Pending Vendors" ON pending_vendors;
CREATE POLICY "Public Update Pending Vendors" ON pending_vendors FOR ALL USING (true);

-- 5. Fix Storage Permissions (Bucket creation)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('vendor-photos', 'vendor-photos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 6. Storage Policies
DROP POLICY IF EXISTS "Public Access Vendor Photos" ON storage.objects;
CREATE POLICY "Public Access Vendor Photos" ON storage.objects
FOR SELECT USING ( bucket_id = 'vendor-photos' );

DROP POLICY IF EXISTS "Authenticated Upload Vendor Photos" ON storage.objects;
CREATE POLICY "Authenticated Upload Vendor Photos" ON storage.objects
FOR INSERT WITH CHECK ( bucket_id = 'vendor-photos' );
