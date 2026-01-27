-- Add onboarding_completed flag to vendors table
-- This distinguishes between:
-- 1. New vendors from invite links -> need to complete onboarding wizard
-- 2. Existing vendors -> go directly to dashboard

-- Add the column
ALTER TABLE vendors 
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;

-- Set existing active vendors as completed (they already went through the flow)
UPDATE vendors 
SET onboarding_completed = true 
WHERE status = 'active' 
  AND onboarding_completed IS NOT true;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_vendors_onboarding ON vendors(onboarding_completed);
