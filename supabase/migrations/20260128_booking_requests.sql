-- =============================================
-- BOOKING REQUESTS TABLE
-- Client requests to book a gig
-- =============================================

CREATE TABLE IF NOT EXISTS booking_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- References
    gig_id UUID REFERENCES gigs(id) ON DELETE CASCADE,
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    client_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    -- Client Info (for guest bookings without account)
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_phone TEXT,
    client_whatsapp TEXT,
    
    -- Event Details
    event_type TEXT, -- birthday, wedding, corporate, etc.
    event_date DATE,
    event_time TIME,
    event_duration_hours INTEGER,
    event_location TEXT,
    event_city TEXT,
    guests_count INTEGER,
    
    -- Request Details
    message TEXT, -- Client's message/description
    budget_range TEXT, -- e.g. "1000-2000" or "flexible"
    
    -- Status Flow
    status TEXT DEFAULT 'pending' CHECK (status IN (
        'pending',      -- New request, waiting for vendor response
        'viewed',       -- Vendor has seen the request
        'contacted',    -- Vendor contacted client
        'confirmed',    -- Booking confirmed
        'rejected',     -- Vendor declined
        'cancelled',    -- Client cancelled
        'completed'     -- Event happened
    )),
    
    -- Vendor Response
    vendor_response TEXT,
    quoted_price NUMERIC(10, 2),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    viewed_at TIMESTAMPTZ,
    responded_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_booking_requests_gig ON booking_requests(gig_id);
CREATE INDEX IF NOT EXISTS idx_booking_requests_vendor ON booking_requests(vendor_id);
CREATE INDEX IF NOT EXISTS idx_booking_requests_client ON booking_requests(client_user_id);
CREATE INDEX IF NOT EXISTS idx_booking_requests_status ON booking_requests(status);
CREATE INDEX IF NOT EXISTS idx_booking_requests_created ON booking_requests(created_at DESC);

-- Enable RLS
ALTER TABLE booking_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Vendors can view their requests" ON booking_requests;
DROP POLICY IF EXISTS "Clients can view own requests" ON booking_requests;
DROP POLICY IF EXISTS "Anyone can create requests" ON booking_requests;
DROP POLICY IF EXISTS "Vendors can update their requests" ON booking_requests;

-- Vendors can view requests for their gigs
CREATE POLICY "Vendors can view their requests" ON booking_requests
    FOR SELECT USING (
        vendor_id IN (
            SELECT id FROM vendors WHERE owner_user_id = auth.uid()
        )
    );

-- Clients can view their own requests
CREATE POLICY "Clients can view own requests" ON booking_requests
    FOR SELECT USING (client_user_id = auth.uid());

-- Anyone can create a booking request (including guests)
CREATE POLICY "Anyone can create requests" ON booking_requests
    FOR INSERT WITH CHECK (true);

-- Vendors can update their requests
CREATE POLICY "Vendors can update their requests" ON booking_requests
    FOR UPDATE USING (
        vendor_id IN (
            SELECT id FROM vendors WHERE owner_user_id = auth.uid()
        )
    );

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_booking_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_booking_requests_updated_at ON booking_requests;
CREATE TRIGGER update_booking_requests_updated_at
    BEFORE UPDATE ON booking_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_booking_updated_at();
