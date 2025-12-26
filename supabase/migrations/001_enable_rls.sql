-- =============================================
-- TALENTR MARKETPLACE - RLS SECURITY POLICIES
-- Run this in Supabase SQL Editor
-- =============================================
-- ========== STEP 1: Enable RLS on all tables ==========
ALTER TABLE IF EXISTS bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS vendors ENABLE ROW LEVEL SECURITY;
-- ========== STEP 2: Drop existing policies (if any) ==========
DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can create own bookings" ON bookings;
DROP POLICY IF EXISTS "Vendors can view their bookings" ON bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON bookings;
DROP POLICY IF EXISTS "Users manage own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can view own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can insert own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can delete own favorites" ON favorites;
DROP POLICY IF EXISTS "Anyone can view vendors" ON vendors;
DROP POLICY IF EXISTS "Vendors can update own profile" ON vendors;
-- ========== STEP 3: BOOKINGS TABLE POLICIES ==========
-- Users can view only their own bookings (as client)
CREATE POLICY "Users can view own bookings" ON bookings FOR
SELECT USING (auth.uid()::text = client_id);
-- Vendors can view bookings made TO them
CREATE POLICY "Vendors can view their bookings" ON bookings FOR
SELECT USING (auth.uid()::text = vendor_id);
-- Users can create bookings (only for themselves)
CREATE POLICY "Users can create own bookings" ON bookings FOR
INSERT WITH CHECK (auth.uid()::text = client_id);
-- Users can update their own bookings (cancel, etc)
CREATE POLICY "Users can update own bookings" ON bookings FOR
UPDATE USING (auth.uid()::text = client_id);
-- ========== STEP 4: FAVORITES TABLE POLICIES ==========
-- Users can view only their own favorites
CREATE POLICY "Users can view own favorites" ON favorites FOR
SELECT USING (auth.uid()::text = user_id);
-- Users can insert their own favorites
CREATE POLICY "Users can insert own favorites" ON favorites FOR
INSERT WITH CHECK (auth.uid()::text = user_id);
-- Users can delete their own favorites
CREATE POLICY "Users can delete own favorites" ON favorites FOR DELETE USING (auth.uid()::text = user_id);
-- ========== STEP 5: VENDORS TABLE POLICIES ==========
-- Anyone can view vendor profiles (public)
CREATE POLICY "Anyone can view vendors" ON vendors FOR
SELECT USING (true);
-- Vendors can only update their own profile
CREATE POLICY "Vendors can update own profile" ON vendors FOR
UPDATE USING (auth.uid()::text = id);
-- Vendors can insert themselves (registration)
CREATE POLICY "Vendors can insert own profile" ON vendors FOR
INSERT WITH CHECK (auth.uid()::text = id);
-- ========== STEP 6: Verify RLS is enabled ==========
SELECT schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE tablename IN ('bookings', 'favorites', 'vendors');
-- ========== SUCCESS ==========
-- If you see this message, RLS is configured!
-- Tables are now protected by row-level security.