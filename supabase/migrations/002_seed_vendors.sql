-- =============================================
-- TALENTR MARKETPLACE - SEED VENDORS DATA
-- Run this in Supabase SQL Editor
-- =============================================
-- First, drop the foreign key constraint that links id to users
ALTER TABLE vendors DROP CONSTRAINT IF EXISTS vendors_id_fkey;
-- Add user_id column for auth linking (will be NULL for seed data)
ALTER TABLE vendors
ADD COLUMN IF NOT EXISTS user_id UUID;
-- Insert realistic Israeli vendors
INSERT INTO vendors (
        id,
        full_name,
        email,
        category,
        city,
        rating,
        reviews_count,
        price_from,
        avatar_url,
        bio,
        phone
    )
VALUES -- Photographers
    (
        gen_random_uuid(),
        'Alex Goldstein',
        'alex@talentr.demo',
        'Photographer',
        'Tel Aviv',
        4.9,
        127,
        2500,
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
        'Award-winning wedding photographer with 10+ years experience.',
        '972501234567'
    ),
    (
        gen_random_uuid(),
        'Maya Levinson',
        'maya@talentr.demo',
        'Photographer',
        'Haifa',
        4.8,
        89,
        2000,
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
        'Creative portrait and event photographer.',
        '972521234567'
    ),
    -- DJs
    (
        gen_random_uuid(),
        'DJ Noam',
        'noam@talentr.demo',
        'DJ',
        'Tel Aviv',
        4.9,
        156,
        3000,
        'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80',
        'Professional DJ with 15 years experience.',
        '972531234567'
    ),
    (
        gen_random_uuid(),
        'DJ Amir',
        'amir@talentr.demo',
        'DJ',
        'Jerusalem',
        4.7,
        73,
        2500,
        'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=800&q=80',
        'Middle Eastern and international music specialist.',
        '972541234567'
    ),
    -- MC
    (
        gen_random_uuid(),
        'David Cohen MC',
        'david@talentr.demo',
        'MC',
        'Tel Aviv',
        4.8,
        98,
        2000,
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80',
        'Professional MC. Hebrew, English, Russian.',
        '972551234567'
    ),
    -- Magician
    (
        gen_random_uuid(),
        'Magic Max',
        'max@talentr.demo',
        'Magician',
        'Tel Aviv',
        4.9,
        112,
        1800,
        'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
        'Close-up magic and stage illusions.',
        '972561234567'
    ),
    -- Singer
    (
        gen_random_uuid(),
        'Rachel Voice',
        'rachel@talentr.demo',
        'Singer',
        'Haifa',
        4.8,
        67,
        2500,
        'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
        'Pop, jazz, Israeli classics.',
        '972571234567'
    ),
    -- Musician
    (
        gen_random_uuid(),
        'The Groove Band',
        'groove@talentr.demo',
        'Musician',
        'Tel Aviv',
        4.9,
        145,
        5000,
        'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?auto=format&fit=crop&w=800&q=80',
        '5-piece live band for weddings.',
        '972581234567'
    ),
    -- Videographer
    (
        gen_random_uuid(),
        'CineWed Studio',
        'cinewed@talentr.demo',
        'Videographer',
        'Tel Aviv',
        4.9,
        88,
        4000,
        'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80',
        'Cinematic wedding films. 4K, drone.',
        '972591234567'
    ),
    -- Kids Animator
    (
        gen_random_uuid(),
        'Happy Kids Entertainment',
        'happykids@talentr.demo',
        'Kids Animator',
        'Rishon LeZion',
        4.7,
        94,
        1200,
        'https://images.unsplash.com/photo-1544776193-352d25ca82cd?auto=format&fit=crop&w=800&q=80',
        'Birthday parties, games, face painting.',
        '972601234567'
    ),
    -- Event Decor
    (
        gen_random_uuid(),
        'Bloom & Design',
        'bloom@talentr.demo',
        'Event Decor',
        'Tel Aviv',
        4.8,
        76,
        3500,
        'https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=800&q=80',
        'Floral arrangements and event design.',
        '972611234567'
    ),
    -- Bartender
    (
        gen_random_uuid(),
        'Cocktail Masters',
        'cocktails@talentr.demo',
        'Bartender',
        'Tel Aviv',
        4.8,
        103,
        2000,
        'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80',
        'Professional cocktail bar service.',
        '972621234567'
    );
-- Verify
SELECT full_name,
    category,
    city,
    rating
FROM vendors
ORDER BY rating DESC;