-- Add edit_token column to vendors table for magic link access
-- This allows vendors to edit their profile without logging in

ALTER TABLE vendors 
ADD COLUMN IF NOT EXISTS edit_token UUID UNIQUE DEFAULT gen_random_uuid();

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_vendors_edit_token ON vendors(edit_token);

-- Update existing vendors to have edit tokens (if they don't already)
UPDATE vendors 
SET edit_token = gen_random_uuid() 
WHERE edit_token IS NULL;