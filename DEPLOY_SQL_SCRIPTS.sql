-- VISUALSC Deployment SQL Scripts
-- Run these in Supabase SQL Editor in order

-- ============================================================
-- SCRIPT 1: Verify Database Schema Deployed
-- ============================================================
-- Run this to verify tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Expected result: 8 tables
-- ✓ restaurants
-- ✓ users
-- ✓ categories
-- ✓ products
-- ✓ allergens
-- ✓ product_allergens
-- ✓ lsc_videos
-- ✓ orders


-- ============================================================
-- SCRIPT 2: Verify LSC Coffee Club Restaurant Exists
-- ============================================================
SELECT id, name, slug FROM restaurants WHERE slug = 'lsc-coffee-club';

-- Expected result: 1 row
-- id: [some uuid]
-- name: LSC Coffee Club
-- slug: lsc-coffee-club


-- ============================================================
-- SCRIPT 3: Create Test Users
-- ============================================================
-- Run this ONCE to create admin and owner users

INSERT INTO users (restaurant_id, email, password_hash, role, status)
SELECT 
  id,
  'admin@visualsc.co',
  '$2a$10$N9qo8uLOickgx2ZMRZoM2eIjZAgcg7b3XeKeUxWdeS86E36CHhzPm',
  'super_admin',
  'active'
FROM restaurants 
WHERE slug = 'lsc-coffee-club'
LIMIT 1;

INSERT INTO users (restaurant_id, email, password_hash, role, status)
SELECT 
  id,
  'owner@lsccoffeeclub.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoM2eIjZAgcg7b3XeKeUxWdeS86E36CHhzPm',
  'admin',
  'active'
FROM restaurants 
WHERE slug = 'lsc-coffee-club'
LIMIT 1;

-- Expected result: 2 rows inserted


-- ============================================================
-- SCRIPT 4: Verify Users Created
-- ============================================================
SELECT email, role, status FROM users;

-- Expected result: 2 rows
-- admin@visualsc.co | super_admin | active
-- owner@lsccoffeeclub.com | admin | active

-- Password for both: password


-- ============================================================
-- SCRIPT 5: Add Sample Products
-- ============================================================
-- Run this to add 6 sample coffee products

WITH restaurant AS (
  SELECT id FROM restaurants WHERE slug = 'lsc-coffee-club'
),
espresso_cat AS (
  SELECT id FROM categories WHERE name = 'Espresso' AND restaurant_id = (SELECT id FROM restaurant)
),
bebidas_cat AS (
  SELECT id FROM categories WHERE name = 'Bebidas Frías' AND restaurant_id = (SELECT id FROM restaurant)
)

INSERT INTO products (restaurant_id, category_id, name, description, price, status) VALUES
-- Espresso drinks
((SELECT id FROM restaurant), (SELECT id FROM espresso_cat), 'Café Americano', 'Espresso con agua caliente', 5000.00, 'active'),
((SELECT id FROM restaurant), (SELECT id FROM espresso_cat), 'Espresso', 'Espresso puro', 3000.00, 'active'),
((SELECT id FROM restaurant), (SELECT id FROM espresso_cat), 'Cappuccino', 'Espresso con leche espumosa', 6000.00, 'active'),
((SELECT id FROM restaurant), (SELECT id FROM espresso_cat), 'Latte', 'Espresso con mucha leche', 6500.00, 'active'),

-- Cold drinks
((SELECT id FROM restaurant), (SELECT id FROM bebidas_cat), 'Café Helado', 'Café frío con hielo', 6000.00, 'active'),
((SELECT id FROM restaurant), (SELECT id FROM bebidas_cat), 'Agua Fría', 'Agua con hielo', 2000.00, 'active');

-- Expected result: 6 rows inserted


-- ============================================================
-- SCRIPT 6: Verify Products Created
-- ============================================================
SELECT name, price, status FROM products WHERE restaurant_id = (SELECT id FROM restaurants WHERE slug = 'lsc-coffee-club');

-- Expected result: 6 rows with all products


-- ============================================================
-- SCRIPT 7: Add Allergens to Café Americano
-- ============================================================
-- Associate Leche and Gluten with Café Americano

WITH cafe_americano AS (
  SELECT id FROM products 
  WHERE name = 'Café Americano' 
  AND restaurant_id = (SELECT id FROM restaurants WHERE slug = 'lsc-coffee-club')
),
leche AS (
  SELECT id FROM allergens WHERE name = 'Leche'
),
gluten AS (
  SELECT id FROM allergens WHERE name = 'Gluten'
)

INSERT INTO product_allergens (product_id, allergen_id) VALUES
((SELECT id FROM cafe_americano), (SELECT id FROM leche)),
((SELECT id FROM cafe_americano), (SELECT id FROM gluten));

-- Expected result: 2 rows inserted


-- ============================================================
-- SCRIPT 8: Verify Allergen Association
-- ============================================================
SELECT 
  p.name as product,
  a.name as allergen,
  a.icon
FROM product_allergens pa
JOIN products p ON pa.product_id = p.id
JOIN allergens a ON pa.allergen_id = a.id
WHERE p.restaurant_id = (SELECT id FROM restaurants WHERE slug = 'lsc-coffee-club');

-- Expected result: 2 rows
-- Café Americano | Leche | 🥛
-- Café Americano | Gluten | 🌾


-- ============================================================
-- SCRIPT 9: View All Allergens Available
-- ============================================================
SELECT name, icon, color FROM allergens;

-- Expected result: 7 rows
-- Leche | 🥛 | #87CEEB
-- Gluten | 🌾 | #DAA520
-- Maní | 🥜 | #8B4513
-- Nueces | 🌳 | #A0522D
-- Huevo | 🥚 | #F0E68C
-- Mariscos | 🦐 | #FF6347
-- Azúcar Agregada | 🍬 | #FF69B4


-- ============================================================
-- SCRIPT 10: View Complete Setup Status
-- ============================================================
-- Run this to see complete setup

SELECT 
  'Restaurants' as resource,
  COUNT(*) as count
FROM restaurants
UNION ALL
SELECT 'Users', COUNT(*) FROM users
UNION ALL
SELECT 'Categories', COUNT(*) FROM categories WHERE restaurant_id = (SELECT id FROM restaurants WHERE slug = 'lsc-coffee-club')
UNION ALL
SELECT 'Products', COUNT(*) FROM products WHERE restaurant_id = (SELECT id FROM restaurants WHERE slug = 'lsc-coffee-club')
UNION ALL
SELECT 'Allergens', COUNT(*) FROM allergens
UNION ALL
SELECT 'Product-Allergen links', COUNT(*) FROM product_allergens;

-- Expected result:
-- Restaurants | 1
-- Users | 2
-- Categories | 6
-- Products | 6
-- Allergens | 7
-- Product-Allergen links | 2


-- ============================================================
-- SCRIPT 11: Test API Data (Run After Backend Connected)
-- ============================================================
-- After backend is deployed, these queries show what the API should return

-- API endpoint: GET /api/products/lsc-coffee-club
SELECT 
  p.id,
  p.name,
  p.description,
  p.price,
  c.name as category,
  c.icon,
  COALESCE(json_agg(a.*) FILTER (WHERE a.id IS NOT NULL), '[]') as allergens
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN product_allergens pa ON p.id = pa.product_id
LEFT JOIN allergens a ON pa.allergen_id = a.id
WHERE p.restaurant_id = (SELECT id FROM restaurants WHERE slug = 'lsc-coffee-club')
AND p.status = 'active'
GROUP BY p.id, p.name, p.description, p.price, c.name, c.icon
ORDER BY c.name;

-- This shows what should appear on the public menu


-- ============================================================
-- TROUBLESHOOTING SCRIPTS
-- ============================================================

-- Check if credentials are set correctly
-- Run this to verify tables are accessible
SELECT COUNT(*) as test FROM users;

-- If this works, your Supabase is connected correctly

-- Check product creation by restaurant
SELECT 
  r.name as restaurant,
  COUNT(p.id) as product_count
FROM products p
RIGHT JOIN restaurants r ON p.restaurant_id = r.id
GROUP BY r.id, r.name;

-- Should show: LSC Coffee Club | 6

-- Check user authentication setup
SELECT email, role, status, created_at FROM users ORDER BY created_at DESC;

-- Should show your 2 test users

-- ============================================================
-- END OF SCRIPTS
-- ============================================================
