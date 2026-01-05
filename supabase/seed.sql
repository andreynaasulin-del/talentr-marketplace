-- ====================================
-- TALENTR SEED DATA
-- Run this AFTER schema.sql in Supabase SQL Editor
-- ====================================

-- Insert mock vendors based on mockData.ts
INSERT INTO vendors (id, name, category, city, rating, reviews_count, price_from, image_url, tags, description, phone, is_verified, is_active, is_featured)
VALUES
-- PHOTOGRAPHERS
('00000000-0000-0000-0000-000000000001', 'David Cohen Photography', 'Photographer', 'Tel Aviv', 4.9, 127, 2500, 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80', ARRAY['Wedding', 'Bar Mitzvah', 'Corporate'], 'Professional wedding and event photographer with 10+ years experience', '972501234567', true, true, true),

('00000000-0000-0000-0000-000000000005', 'Sarah Photography Studio', 'Photographer', 'Haifa', 4.9, 211, 2200, 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80', ARRAY['Wedding', 'Engagement', 'Family'], 'Capturing authentic emotions and timeless moments', '972521234567', true, true, false),

-- VIDEOGRAPHERS
('00000000-0000-0000-0000-000000000011', 'CineMotion Studios', 'Videographer', 'Jerusalem', 4.8, 98, 3500, 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80', ARRAY['Wedding', 'Bar Mitzvah', 'Corporate'], 'Cinematic wedding films and event videography with drone footage', '972531234567', true, true, false),

('00000000-0000-0000-0000-000000000012', 'Frame by Frame Productions', 'Videographer', 'Tel Aviv', 4.9, 156, 4000, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80', ARRAY['Wedding', 'Engagement', 'Gala'], 'Award-winning videographers creating emotional event stories', '972541234567', true, true, true),

-- DJs
('00000000-0000-0000-0000-000000000002', 'DJ Noam - Electronic Vibes', 'DJ', 'Tel Aviv', 4.8, 94, 3000, 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?auto=format&fit=crop&w=800&q=80', ARRAY['Wedding', 'Birthday', 'Club Night'], 'High-energy DJ specializing in EDM and Top 40 hits', '972551234567', true, true, true),

('00000000-0000-0000-0000-000000000006', 'DJ Avi Mix', 'DJ', 'Haifa', 4.6, 67, 2800, 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80', ARRAY['Wedding', 'Corporate', 'Private Party'], 'Versatile DJ with extensive music library and professional equipment', NULL, true, true, false),

-- MCs
('00000000-0000-0000-0000-000000000003', 'Yael Levi - Master of Ceremonies', 'MC', 'Haifa', 5.0, 156, 1800, 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80', ARRAY['Wedding', 'Bar Mitzvah', 'Corporate'], 'Charismatic host making your event unforgettable', NULL, true, true, true),

('00000000-0000-0000-0000-000000000007', 'Ron Mizrahi - The Voice', 'MC', 'Tel Aviv', 4.8, 102, 2000, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80', ARRAY['Wedding', 'Corporate', 'Gala'], 'Professional event host with bilingual capabilities (Hebrew/English)', NULL, true, true, false),

-- MAGICIANS
('00000000-0000-0000-0000-000000000004', 'Magic Eli', 'Magician', 'Tel Aviv', 4.7, 83, 1500, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80', ARRAY['Birthday', 'Bar Mitzvah', 'Kids Party'], 'Award-winning magician specializing in close-up and stage magic', NULL, true, true, false),

('00000000-0000-0000-0000-000000000008', 'Wonderland Magic Show', 'Magician', 'Haifa', 4.9, 145, 1700, 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80', ARRAY['Birthday', 'Bar Mitzvah', 'Corporate'], 'Interactive magic shows that engage audiences of all ages', NULL, true, true, true),

-- SINGERS
('00000000-0000-0000-0000-000000000013', 'Noa Vocal Performance', 'Singer', 'Tel Aviv', 4.9, 134, 2500, 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=800&q=80', ARRAY['Wedding', 'Corporate', 'Gala'], 'Professional vocalist with repertoire from jazz to pop classics', NULL, true, true, true),

('00000000-0000-0000-0000-000000000014', 'David Sings - Live Events', 'Singer', 'Jerusalem', 4.7, 89, 2200, 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80', ARRAY['Wedding', 'Bar Mitzvah', 'Private Party'], 'Soulful voice bringing emotions to every celebration', NULL, true, true, false),

-- MUSICIANS
('00000000-0000-0000-0000-000000000015', 'Strings of Elegance', 'Musician', 'Tel Aviv', 5.0, 167, 1800, 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=80', ARRAY['Wedding', 'Engagement', 'Corporate'], 'Violin and saxophone duo creating sophisticated ambiance', NULL, true, true, true),

('00000000-0000-0000-0000-000000000016', 'Jazz Ensemble Live', 'Musician', 'Haifa', 4.8, 122, 3500, 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?auto=format&fit=crop&w=800&q=80', ARRAY['Wedding', 'Gala', 'Corporate'], 'Live jazz band for upscale events and celebrations', NULL, true, true, false),

-- EVENT DECOR
('00000000-0000-0000-0000-000000000025', 'Dream Decorations', 'Event Decor', 'Tel Aviv', 5.0, 234, 3000, 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80', ARRAY['Wedding', 'Bar Mitzvah', 'Corporate'], 'Transforming venues into magical spaces with premium decor', NULL, true, true, true),

-- KIDS ANIMATORS
('00000000-0000-0000-0000-000000000027', 'Happy Kids Entertainment', 'Kids Animator', 'Rishon LeZion', 4.9, 276, 800, 'https://images.unsplash.com/photo-1514415008039-efa173293080?auto=format&fit=crop&w=800&q=80', ARRAY['Birthday', 'Brit Milah', 'Kids Party'], 'Professional kids entertainers with games, music, and fun', NULL, true, true, true),

-- BARTENDERS
('00000000-0000-0000-0000-000000000021', 'Mixology Masters', 'Bartender', 'Tel Aviv', 4.9, 201, 1500, 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80', ARRAY['Wedding', 'Corporate', 'Private Party'], 'Professional bartenders crafting signature cocktails for events', NULL, true, true, false),

-- CHEFS
('00000000-0000-0000-0000-000000000033', 'Gourmet Bites Catering', 'Chef', 'Tel Aviv', 5.0, 342, 5000, 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&q=80', ARRAY['Wedding', 'Corporate', 'Gala'], 'Premium catering with Michelin-star trained chefs', NULL, true, true, true);

-- Verify insert
SELECT COUNT(*) as total_vendors FROM vendors;
