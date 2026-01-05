-- Create reviews table for real customer reviews
CREATE TABLE IF NOT EXISTS reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (
        rating >= 1
        AND rating <= 5
    ),
    comment TEXT,
    event_type TEXT,
    is_verified BOOLEAN DEFAULT false,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
-- Public can read reviews
CREATE POLICY "Anyone can view reviews" ON reviews FOR
SELECT USING (true);
-- Only authenticated users can insert reviews
CREATE POLICY "Authenticated users can insert reviews" ON reviews FOR
INSERT WITH CHECK (auth.uid() = client_id);
-- Users can only update their own reviews
CREATE POLICY "Users can update own reviews" ON reviews FOR
UPDATE USING (auth.uid() = client_id);
-- Create index for faster vendor lookups
CREATE INDEX idx_reviews_vendor_id ON reviews(vendor_id);
CREATE INDEX idx_reviews_client_id ON reviews(client_id);
-- Update vendor rating when review is added (trigger function)
CREATE OR REPLACE FUNCTION update_vendor_rating() RETURNS TRIGGER AS $$ BEGIN
UPDATE vendors
SET rating = (
        SELECT COALESCE(AVG(rating), 0)
        FROM reviews
        WHERE vendor_id = NEW.vendor_id
    ),
    reviews_count = (
        SELECT COUNT(*)
        FROM reviews
        WHERE vendor_id = NEW.vendor_id
    )
WHERE id = NEW.vendor_id;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Create trigger
DROP TRIGGER IF EXISTS update_vendor_rating_trigger ON reviews;
CREATE TRIGGER update_vendor_rating_trigger
AFTER
INSERT
    OR
UPDATE
    OR DELETE ON reviews FOR EACH ROW EXECUTE FUNCTION update_vendor_rating();