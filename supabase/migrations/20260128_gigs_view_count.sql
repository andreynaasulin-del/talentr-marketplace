-- Add view_count column to gigs table for analytics
ALTER TABLE gigs ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- Create index for sorting by popularity
CREATE INDEX IF NOT EXISTS idx_gigs_view_count ON gigs(view_count DESC);
