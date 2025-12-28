-- Fix: Allow vendors to update bookings (confirm/decline)
-- Run this in Supabase SQL Editor
-- Drop existing update policy if exists
DROP POLICY IF EXISTS "Vendors can update their bookings" ON bookings;
-- Allow vendors to update bookings made TO them (for confirm/decline)
CREATE POLICY "Vendors can update their bookings" ON bookings FOR
UPDATE USING (auth.uid()::text = vendor_id::text);
-- Also ensure client_id comparison works with different UUID formats
DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
CREATE POLICY "Users can view own bookings" ON bookings FOR
SELECT USING (auth.uid()::text = client_id::text);
DROP POLICY IF EXISTS "Users can create own bookings" ON bookings;
CREATE POLICY "Users can create own bookings" ON bookings FOR
INSERT WITH CHECK (auth.uid()::text = client_id::text);
DROP POLICY IF EXISTS "Users can update own bookings" ON bookings;
CREATE POLICY "Users can update own bookings" ON bookings FOR
UPDATE USING (auth.uid()::text = client_id::text);
-- Verify policies
-- SELECT * FROM pg_policies WHERE tablename = 'bookings';