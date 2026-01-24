-- =============================================
-- Add missing columns to vendors table
-- Required for vendor confirmation flow
-- =============================================

-- Add 'name' column (new field name, was 'full_name')
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'vendors' AND column_name = 'name'
    ) THEN
        ALTER TABLE vendors ADD COLUMN name TEXT;
    END IF;
END $$;

-- Add 'description' column (new field name, was 'bio')
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'vendors' AND column_name = 'description'
    ) THEN
        ALTER TABLE vendors ADD COLUMN description TEXT;
    END IF;
END $$;

-- Add 'image_url' column (new field name, was 'avatar_url')
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'vendors' AND column_name = 'image_url'
    ) THEN
        ALTER TABLE vendors ADD COLUMN image_url TEXT;
    END IF;
END $$;

-- Add 'instagram_handle' column if missing
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'vendors' AND column_name = 'instagram_handle'
    ) THEN
        ALTER TABLE vendors ADD COLUMN instagram_handle TEXT;
    END IF;
END $$;

-- Add 'website' column if missing
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'vendors' AND column_name = 'website'
    ) THEN
        ALTER TABLE vendors ADD COLUMN website TEXT;
    END IF;
END $$;

-- Add 'portfolio_gallery' column if missing
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'vendors' AND column_name = 'portfolio_gallery'
    ) THEN
        ALTER TABLE vendors ADD COLUMN portfolio_gallery TEXT[] DEFAULT '{}';
    END IF;
END $$;

-- Add 'tags' column if missing
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'vendors' AND column_name = 'tags'
    ) THEN
        ALTER TABLE vendors ADD COLUMN tags TEXT[] DEFAULT '{}';
    END IF;
END $$;

-- Add 'is_active' column if missing
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'vendors' AND column_name = 'is_active'
    ) THEN
        ALTER TABLE vendors ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;
END $$;

-- Add 'is_verified' column if missing
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'vendors' AND column_name = 'is_verified'
    ) THEN
        ALTER TABLE vendors ADD COLUMN is_verified BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Add 'is_featured' column if missing
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'vendors' AND column_name = 'is_featured'
    ) THEN
        ALTER TABLE vendors ADD COLUMN is_featured BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Add 'is_archived' column if missing
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'vendors' AND column_name = 'is_archived'
    ) THEN
        ALTER TABLE vendors ADD COLUMN is_archived BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Add 'status' column if missing
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'vendors' AND column_name = 'status'
    ) THEN
        ALTER TABLE vendors ADD COLUMN status TEXT DEFAULT 'active';
    END IF;
END $$;

-- Migrate existing data from old fields to new fields
UPDATE vendors SET name = full_name WHERE name IS NULL AND full_name IS NOT NULL;
UPDATE vendors SET description = bio WHERE description IS NULL AND bio IS NOT NULL;
UPDATE vendors SET image_url = avatar_url WHERE image_url IS NULL AND avatar_url IS NOT NULL;

-- Verify the changes
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'vendors' 
ORDER BY ordinal_position;
