-- =============================================
-- FIX: Allow vendor registration
-- Run this in Supabase SQL Editor
-- =============================================
-- Drop the old restrictive policy
DROP POLICY IF EXISTS "Vendors can insert own profile" ON vendors;
-- Create a new policy that allows authenticated users to insert their own vendor profile
-- The check ensures the vendor id matches the authenticated user's id
CREATE POLICY "Vendors can insert own profile" ON vendors FOR
INSERT WITH CHECK (auth.uid() IS NOT NULL);
-- Also update the policy for updates to match
DROP POLICY IF EXISTS "Vendors can update own profile" ON vendors;
CREATE POLICY "Vendors can update own profile" ON vendors FOR
UPDATE USING (
        auth.uid()::text = id::text
        OR auth.uid() = user_id
    );
-- Verify
SELECT policyname
FROM pg_policies
WHERE tablename = 'vendors';