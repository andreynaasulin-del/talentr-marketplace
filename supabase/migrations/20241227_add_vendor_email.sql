-- Add email column to vendors table for notifications
ALTER TABLE vendors
ADD COLUMN IF NOT EXISTS email TEXT;
-- Update vendors table to store email from user registration
-- This allows us to send booking notifications to vendors
-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_vendors_email ON vendors(email);
-- Comment explaining the column
COMMENT ON COLUMN vendors.email IS 'Vendor contact email for booking notifications';