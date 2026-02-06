-- Category Landing Pages CMS table
-- Stores content for /book/[category] and /become/[category] SEO landing pages

CREATE TABLE IF NOT EXISTS category_landing_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL,                    -- e.g. 'dj', 'magician', 'clown'
  page_type TEXT NOT NULL CHECK (page_type IN ('book', 'become')),
  lang TEXT NOT NULL CHECK (lang IN ('en', 'he')),
  category_type TEXT NOT NULL CHECK (category_type IN ('adult', 'kids')),
  icon TEXT NOT NULL DEFAULT '🎭',

  -- SEO fields
  title TEXT NOT NULL,
  meta_description TEXT NOT NULL,
  h1 TEXT NOT NULL,
  hero_description TEXT NOT NULL,

  -- Description block
  description_what TEXT NOT NULL,
  description_events TEXT NOT NULL,
  description_format TEXT NOT NULL,

  -- Benefits (stored as JSONB array of strings)
  benefits JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- FAQ (stored as JSONB array of {question, answer} objects)
  faq JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Cross-link text
  cross_link_text TEXT NOT NULL,

  -- Metadata
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Ensure unique combination of slug + page_type + lang
  UNIQUE (slug, page_type, lang)
);

-- Enable RLS
ALTER TABLE category_landing_pages ENABLE ROW LEVEL SECURITY;

-- Allow public read access (these are public SEO pages)
CREATE POLICY "Category landing pages are viewable by everyone"
  ON category_landing_pages
  FOR SELECT
  USING (is_active = true);

-- Only admins can modify (via service role key)
CREATE POLICY "Only admins can modify category landing pages"
  ON category_landing_pages
  FOR ALL
  USING (auth.role() = 'service_role');

-- Index for fast lookup
CREATE INDEX idx_category_landing_slug_type_lang
  ON category_landing_pages (slug, page_type, lang)
  WHERE is_active = true;

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_category_landing_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER category_landing_updated_at
  BEFORE UPDATE ON category_landing_pages
  FOR EACH ROW
  EXECUTE FUNCTION update_category_landing_updated_at();
