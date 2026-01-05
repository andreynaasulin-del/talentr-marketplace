-- =============================================
-- TALENTR MARKETPLACE - CREATE TABLES + RLS
-- Run this in Supabase SQL Editor
-- =============================================
-- ========== STEP 1: Create missing tables ==========
-- Create favorites table if not exists
CREATE TABLE IF NOT EXISTS favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    vendor_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, vendor_id)
);
-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_vendor_id ON favorites(vendor_id);
-- ========== STEP 2: Enable RLS on tables ==========
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
-- ========== STEP 3: Drop existing policies (clean slate) ==========
DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can create own bookings" ON bookings;
DROP POLICY IF EXISTS "Vendors can view their bookings" ON bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can view own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can insert own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can delete own favorites" ON favorites;
DROP POLICY IF EXISTS "Anyone can view vendors" ON vendors;
DROP POLICY IF EXISTS "Vendors can update own profile" ON vendors;
DROP POLICY IF EXISTS "Vendors can insert own profile" ON vendors;
-- ========== STEP 4: BOOKINGS TABLE POLICIES ==========
-- Users can view only their own bookings (as client)
CREATE POLICY "Users can view own bookings" ON bookings FOR
SELECT USING (auth.uid() = client_id::uuid);
-- Vendors can view bookings made TO them
CREATE POLICY "Vendors can view their bookings" ON bookings FOR
SELECT USING (auth.uid() = vendor_id::uuid);
-- Users can create bookings (only for themselves)
CREATE POLICY "Users can create own bookings" ON bookings FOR
INSERT WITH CHECK (auth.uid() = client_id::uuid);
-- Users can update their own bookings (cancel, etc)
CREATE POLICY "Users can update own bookings" ON bookings FOR
UPDATE USING (auth.uid() = client_id::uuid);
-- ========== STEP 5: FAVORITES TABLE POLICIES ==========
-- Users can view only their own favorites
CREATE POLICY "Users can view own favorites" ON favorites FOR
SELECT USING (auth.uid() = user_id);
-- Users can insert their own favorites
CREATE POLICY "Users can insert own favorites" ON favorites FOR
INSERT WITH CHECK (auth.uid() = user_id);
-- Users can delete their own favorites
CREATE POLICY "Users can delete own favorites" ON favorites FOR DELETE USING (auth.uid() = user_id);
-- ========== STEP 6: VENDORS TABLE POLICIES ==========
-- Anyone can view vendor profiles (public)
CREATE POLICY "Anyone can view vendors" ON vendors FOR
SELECT USING (true);
-- Vendors can only update their own profile
CREATE POLICY "Vendors can update own profile" ON vendors FOR
UPDATE USING (auth.uid() = id);
-- Vendors can insert themselves (registration)
CREATE POLICY "Vendors can insert own profile" ON vendors FOR
INSERT WITH CHECK (auth.uid() = id);
-- ========== DONE ==========
-- RLS is now configured!