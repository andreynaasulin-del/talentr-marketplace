-- =============================================
-- GIGS TABLE - Vendor Services/Offerings
-- =============================================

-- Create gigs table
CREATE TABLE IF NOT EXISTS gigs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    
    -- Basic Info
    title TEXT NOT NULL,
    category_id TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    short_description TEXT NOT NULL,
    full_description TEXT,
    languages TEXT[] DEFAULT '{RU}',
    
    -- Media
    photos JSONB DEFAULT '[]', -- [{url, order, type}]
    videos JSONB DEFAULT '[]', -- [{url, duration, order, thumbnail}]
    
    -- Pricing
    is_free BOOLEAN DEFAULT false,
    currency TEXT DEFAULT 'ILS',
    pricing_type TEXT DEFAULT 'fixed' CHECK (pricing_type IN ('fixed', 'hourly', 'from')),
    price_amount NUMERIC(10, 2),
    price_includes TEXT,
    addons JSONB DEFAULT '[]', -- [{name, price}]
    
    -- Location
    location_mode TEXT DEFAULT 'city' CHECK (location_mode IN ('city', 'radius', 'countrywide', 'online')),
    base_city TEXT,
    radius_km INTEGER,
    excluded_areas TEXT[] DEFAULT '{}',
    travel_fee NUMERIC(10, 2),
    
    -- Audience
    suitable_for_kids BOOLEAN DEFAULT true,
    age_limit TEXT CHECK (age_limit IN ('none', '16+', '18+')),
    event_types TEXT[] DEFAULT '{}', -- ['birthday', 'wedding', 'corporate', etc.]
    
    -- Details
    duration_minutes INTEGER,
    min_guests INTEGER,
    max_guests INTEGER,
    requirements_text TEXT,
    what_client_needs TEXT,
    
    -- Booking
    booking_method TEXT DEFAULT 'chat' CHECK (booking_method IN ('chat', 'request_slot')),
    lead_time_hours INTEGER DEFAULT 24,
    
    -- Visibility & Status
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'unlisted', 'archived')),
    share_slug TEXT UNIQUE,
    moderation_status TEXT DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'rejected')),
    
    -- Template
    template_id TEXT, -- If created from template
    
    -- Wizard Progress
    current_step INTEGER DEFAULT 0,
    wizard_completed BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ
);

-- Create gig_templates table for "спроектированные" gigs
CREATE TABLE IF NOT EXISTS gig_templates (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category_id TEXT NOT NULL,
    icon TEXT,
    description_blocks JSONB DEFAULT '[]',
    required_fields TEXT[] DEFAULT '{}',
    suggested_tags TEXT[] DEFAULT '{}',
    suggested_price_min NUMERIC(10, 2),
    suggested_price_max NUMERIC(10, 2),
    media_hints JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_gigs_owner ON gigs(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_gigs_vendor ON gigs(vendor_id);
CREATE INDEX IF NOT EXISTS idx_gigs_status ON gigs(status);
CREATE INDEX IF NOT EXISTS idx_gigs_category ON gigs(category_id);
CREATE INDEX IF NOT EXISTS idx_gigs_share_slug ON gigs(share_slug);
CREATE INDEX IF NOT EXISTS idx_gigs_created ON gigs(created_at DESC);

-- Enable RLS
ALTER TABLE gigs ENABLE ROW LEVEL SECURITY;
ALTER TABLE gig_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view own gigs" ON gigs;
DROP POLICY IF EXISTS "Users can create own gigs" ON gigs;
DROP POLICY IF EXISTS "Users can update own gigs" ON gigs;
DROP POLICY IF EXISTS "Public can view published gigs" ON gigs;
DROP POLICY IF EXISTS "Public can view unlisted by slug" ON gigs;
DROP POLICY IF EXISTS "Anyone can view templates" ON gig_templates;

-- Owner can manage their gigs
CREATE POLICY "Users can view own gigs" ON gigs 
    FOR SELECT USING (auth.uid() = owner_user_id);

CREATE POLICY "Users can create own gigs" ON gigs 
    FOR INSERT WITH CHECK (auth.uid() = owner_user_id);

CREATE POLICY "Users can update own gigs" ON gigs 
    FOR UPDATE USING (auth.uid() = owner_user_id);

-- Public can view published gigs
CREATE POLICY "Public can view published gigs" ON gigs 
    FOR SELECT USING (status = 'published' AND moderation_status = 'approved');

-- Anyone viewing by share slug
CREATE POLICY "Public can view unlisted by slug" ON gigs 
    FOR SELECT USING (share_slug IS NOT NULL);

-- Templates are public
CREATE POLICY "Anyone can view templates" ON gig_templates 
    FOR SELECT USING (is_active = true);

-- Auto-update updated_at
DROP TRIGGER IF EXISTS update_gigs_updated_at ON gigs;
CREATE TRIGGER update_gigs_updated_at 
    BEFORE UPDATE ON gigs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default templates
INSERT INTO gig_templates (id, name, category_id, icon, description_blocks, required_fields, suggested_tags, suggested_price_min, suggested_price_max)
VALUES
    ('dj-set', 'DJ Set', 'DJ', '🎧', 
     '[{"title": "Music Style", "placeholder": "House, Techno, Hip-Hop, Pop..."}, {"title": "Equipment", "placeholder": "Own controller, speakers, lights..."}, {"title": "What is included", "placeholder": "Soundcheck, custom playlist..."}]',
     '{"short_description", "duration_minutes"}', 
     '{"wedding", "corporate", "club", "party"}',
     2000, 8000),
     
    ('standup', 'Stand-up Comedy', 'Comedian', '🎤',
     '[{"title": "Format", "placeholder": "Stand-up, improv, roast..."}, {"title": "Topics", "placeholder": "Everyday life, observational, corporate..."}, {"title": "Interaction", "placeholder": "Crowd work, audience participation..."}]',
     '{"short_description", "duration_minutes", "age_limit"}',
     '{"corporate", "birthday", "private"}',
     3000, 15000),
     
    ('magician', 'Magician / Illusionist', 'Magician', '🎩',
     '[{"title": "Show Type", "placeholder": "Close-up, stage show, kids magic..."}, {"title": "Props", "placeholder": "Cards, coins, levitation..."}, {"title": "Features", "placeholder": "Interactive, humor, dramatic..."}]',
     '{"short_description", "duration_minutes", "suitable_for_kids"}',
     '{"kids", "birthday", "corporate", "wedding"}',
     1500, 10000),
     
    ('photographer', 'Photography / Reportage', 'Photographer', '📸',
     '[{"title": "Specialization", "placeholder": "Wedding, portrait, events..."}, {"title": "What includes", "placeholder": "Retouching, album, raw files..."}, {"title": "Equipment", "placeholder": "Canon/Sony, lenses, lighting..."}]',
     '{"short_description"}',
     '{"wedding", "portrait", "event", "family"}',
     1000, 5000),
     
    ('bartender', 'Bartender Show / Cocktails', 'Bartender', '🍸',
     '[{"title": "Format", "placeholder": "Flair show, cocktail bar, workshop..."}, {"title": "Menu", "placeholder": "Classic, signature, mocktails..."}, {"title": "Equipment", "placeholder": "Portable bar, glassware, ice..."}]',
     '{"short_description", "age_limit"}',
     '{"wedding", "corporate", "birthday", "party"}',
     2500, 8000),
     
    ('singer', 'Live Vocals', 'Singer', '🎵',
     '[{"title": "Repertoire", "placeholder": "Pop, jazz, classical, covers..."}, {"title": "Format", "placeholder": "Solo, with band, backing tracks..."}, {"title": "Equipment", "placeholder": "Own / venue provided..."}]',
     '{"short_description", "duration_minutes"}',
     '{"wedding", "corporate", "restaurant", "private"}',
     3000, 15000),
     
    ('kids-animator', 'Kids Animator', 'Kids Animator', '🎈',
     '[{"title": "Characters", "placeholder": "Princesses, superheroes, clowns..."}, {"title": "Program", "placeholder": "Games, quests, bubbles show..."}, {"title": "Age Group", "placeholder": "3-6 years, 7-10 years..."}]',
     '{"short_description", "duration_minutes", "max_guests"}',
     '{"birthday", "kids", "family"}',
     800, 3000)
ON CONFLICT (id) DO NOTHING;
