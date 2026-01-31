-- RUN THIS IN SUPABASE SQL EDITOR TO FIX VENDOR CONFIRMATION

-- 1. Add missing columns to vendors table
ALTER TABLE vendors 
ADD COLUMN IF NOT EXISTS instagram_handle TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS portfolio_gallery TEXT[];

-- 2. Ensure images and avatars are compatible (if not already)
ALTER TABLE vendors 
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 3. Fix permissions for vendor-photos bucket (if it exists)
-- This ensures the images uploaded are actually viewable
INSERT INTO storage.buckets (id, name, public) 
VALUES ('vendor-photos', 'vendor-photos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 4. Add policy to allow public read of vendor photos
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Public Access Vendor Photos'
    ) THEN
        CREATE POLICY "Public Access Vendor Photos" ON storage.objects
        FOR SELECT USING ( bucket_id = 'vendor-photos' );
    END IF;
END $$;

-- 5. Add policy to allow authenticated users (and maybe anon for now?) to upload
-- STRICTER: Only authenticated users can upload
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Authenticated Upload Vendor Photos'
    ) THEN
        CREATE POLICY "Authenticated Upload Vendor Photos" ON storage.objects
        FOR INSERT WITH CHECK ( bucket_id = 'vendor-photos' AND auth.role() = 'authenticated' );
    END IF;
END $$;

-- Allow anon upload if needed (for confirmation page without login)
-- UNCOMMENT IF USERS GET UPLOAD ERRORS WITHOUT BEING LOGGED IN
-- DO $$
-- BEGIN
--     IF NOT EXISTS (
--         SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Anon Upload Vendor Photos'
--     ) THEN
--         CREATE POLICY "Anon Upload Vendor Photos" ON storage.objects
--         FOR INSERT WITH CHECK ( bucket_id = 'vendor-photos' );
--     END IF;
-- END $$;
