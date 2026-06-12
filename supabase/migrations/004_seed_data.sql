-- VISUALSC Production Database Schema - Seed Data
-- Migration: 004_seed_data.sql
-- Created: 2024
-- Purpose: Populate initial LSC Library and demo data
--
-- This migration:
-- 1. Seeds LSC Library categories
-- 2. Seeds LSC Library with sample videos
-- 3. Creates a demo restaurant (optional, for testing)
--
-- IMPORTANT: Update these seeds with your actual data before production deployment

-- ============================================================================
-- SEED LSC LIBRARY CATEGORIES
-- ============================================================================

INSERT INTO public.lsc_library_categories (name, icon, description)
VALUES
  ('Coffee Products', '☕', 'Coffee drinks and espresso-based beverages'),
  ('Bakery Products', '🧁', 'Pastries, cakes, and baked goods'),
  ('Beverages', '🧋', 'Non-coffee drinks and juices'),
  ('Meals & Entrees', '🍽️', 'Main courses and meal options'),
  ('Ingredients & Components', '🥘', 'Individual ingredients and food components'),
  ('Allergens & Safety', '⚠️', 'Allergen information and safety warnings')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- SEED LSC LIBRARY VIDEOS
-- ============================================================================
--
-- Replace video URLs with actual LSC video URLs from your storage
-- Format: https://<project-id>.supabase.co/storage/v1/object/private/lsc-library/<path>

INSERT INTO public.lsc_library (
  category_id,
  title,
  description,
  video_url,
  video_duration,
  keywords,
  status
)
SELECT
  (SELECT id FROM public.lsc_library_categories WHERE name = 'Coffee Products'),
  'Espresso',
  'LSC sign for espresso - strong black coffee',
  'https://example.com/lsc/espresso.mp4',
  15,
  '["espresso", "coffee", "drink"]'::jsonb,
  'active'
WHERE NOT EXISTS (
  SELECT 1 FROM public.lsc_library WHERE title = 'Espresso'
);

INSERT INTO public.lsc_library (
  category_id,
  title,
  description,
  video_url,
  video_duration,
  keywords,
  status
)
SELECT
  (SELECT id FROM public.lsc_library_categories WHERE name = 'Coffee Products'),
  'Cappuccino',
  'LSC sign for cappuccino - espresso with steamed milk',
  'https://example.com/lsc/cappuccino.mp4',
  12,
  '["cappuccino", "coffee", "milk", "drink"]'::jsonb,
  'active'
WHERE NOT EXISTS (
  SELECT 1 FROM public.lsc_library WHERE title = 'Cappuccino'
);

INSERT INTO public.lsc_library (
  category_id,
  title,
  description,
  video_url,
  video_duration,
  keywords,
  status
)
SELECT
  (SELECT id FROM public.lsc_library_categories WHERE name = 'Coffee Products'),
  'Americano',
  'LSC sign for americano - espresso with hot water',
  'https://example.com/lsc/americano.mp4',
  10,
  '["americano", "coffee", "drink"]'::jsonb,
  'active'
WHERE NOT EXISTS (
  SELECT 1 FROM public.lsc_library WHERE title = 'Americano'
);

INSERT INTO public.lsc_library (
  category_id,
  title,
  description,
  video_url,
  video_duration,
  keywords,
  status
)
SELECT
  (SELECT id FROM public.lsc_library_categories WHERE name = 'Bakery Products'),
  'Croissant',
  'LSC sign for croissant - butter pastry',
  'https://example.com/lsc/croissant.mp4',
  14,
  '["croissant", "pastry", "baked", "food"]'::jsonb,
  'active'
WHERE NOT EXISTS (
  SELECT 1 FROM public.lsc_library WHERE title = 'Croissant'
);

INSERT INTO public.lsc_library (
  category_id,
  title,
  description,
  video_url,
  video_duration,
  keywords,
  status
)
SELECT
  (SELECT id FROM public.lsc_library_categories WHERE name = 'Beverages'),
  'Orange Juice',
  'LSC sign for fresh orange juice',
  'https://example.com/lsc/orange-juice.mp4',
  10,
  '["juice", "orange", "beverage", "drink"]'::jsonb,
  'active'
WHERE NOT EXISTS (
  SELECT 1 FROM public.lsc_library WHERE title = 'Orange Juice'
);

INSERT INTO public.lsc_library (
  category_id,
  title,
  description,
  video_url,
  video_duration,
  keywords,
  status
)
SELECT
  (SELECT id FROM public.lsc_library_categories WHERE name = 'Allergens & Safety'),
  'Contains Gluten',
  'LSC warning sign for gluten allergy',
  'https://example.com/lsc/gluten-warning.mp4',
  8,
  '["gluten", "allergy", "warning", "allergen"]'::jsonb,
  'active'
WHERE NOT EXISTS (
  SELECT 1 FROM public.lsc_library WHERE title = 'Contains Gluten'
);

INSERT INTO public.lsc_library (
  category_id,
  title,
  description,
  video_url,
  video_duration,
  keywords,
  status
)
SELECT
  (SELECT id FROM public.lsc_library_categories WHERE name = 'Allergens & Safety'),
  'Contains Nuts',
  'LSC warning sign for nut allergy',
  'https://example.com/lsc/nuts-warning.mp4',
  8,
  '["nuts", "allergy", "warning", "allergen"]'::jsonb,
  'active'
WHERE NOT EXISTS (
  SELECT 1 FROM public.lsc_library WHERE title = 'Contains Nuts'
);

-- ============================================================================
-- OPTIONAL: SEED DEMO RESTAURANT (Remove in production)
-- ============================================================================
--
-- To test the system, you can create a demo restaurant:
-- Uncomment the section below ONLY for development/testing
--
-- INSERT INTO public.restaurants (
--   name,
--   slug,
--   admin_email,
--   status,
--   description,
--   template_type,
--   trial_start_date,
--   trial_end_date,
--   subscription_status,
--   plan_type
-- )
-- VALUES (
--   'Demo Coffee Shop',
--   'demo-coffee-shop',
--   'demo@visualsc.com',
--   'active',
--   'A demo restaurant for testing VISUALSC',
--   'modern-coffee',
--   NOW(),
--   NOW() + INTERVAL '14 days',
--   'trial',
--   'free'
-- )
-- ON CONFLICT (slug) DO NOTHING;
--
-- Then insert a demo user:
--
-- INSERT INTO public.users (
--   id,
--   restaurant_id,
--   email,
--   role,
--   status,
--   email_verified
-- )
-- SELECT
--   '00000000-0000-0000-0000-000000000001'::uuid,
--   (SELECT id FROM public.restaurants WHERE slug = 'demo-coffee-shop'),
--   'demo@visualsc.com',
--   'admin',
--   'active',
--   true
-- WHERE NOT EXISTS (
--   SELECT 1 FROM public.users WHERE email = 'demo@visualsc.com'
-- );

-- ============================================================================
-- SUMMARY OF SEED DATA
-- ============================================================================
--
-- LSC Library Categories inserted: 6
-- LSC Library Videos inserted: 7
-- Demo Restaurant: 0 (commented out)
-- Demo Users: 0 (commented out)
--
-- The LSC Library is now ready for restaurant use.
-- Restaurants can select videos when creating products.
-- Users can request new LSC translations that Super Admin will record.

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
--
-- Run these queries to verify seed data:
--
-- 1. Verify LSC categories:
--    SELECT id, name, icon FROM public.lsc_library_categories;
--
-- 2. Verify LSC videos:
--    SELECT id, title, description FROM public.lsc_library;
--
-- 3. Check videos per category:
--    SELECT lc.name, COUNT(l.id) as video_count
--    FROM public.lsc_library_categories lc
--    LEFT JOIN public.lsc_library l ON lc.id = l.category_id
--    GROUP BY lc.id, lc.name;

-- ============================================================================
-- NEXT STEPS
-- ============================================================================
--
-- 1. Run this migration in Supabase SQL Editor
-- 2. Verify seed data with queries above
-- 3. Update video_url values with actual LSC video paths
-- 4. Deploy the app and test restaurant creation
-- 5. Generate deployment report (see SUPABASE_DEPLOYMENT_GUIDE.md)
