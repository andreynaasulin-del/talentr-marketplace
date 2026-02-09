-- Add 'facebook' to allowed source_type values
ALTER TABLE pending_vendors DROP CONSTRAINT IF EXISTS pending_vendors_source_type_check;

ALTER TABLE pending_vendors ADD CONSTRAINT pending_vendors_source_type_check 
CHECK (source_type IN ('instagram', 'google', 'manual', 'referral', 'facebook'));
