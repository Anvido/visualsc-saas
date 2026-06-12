-- VISUALSC Production Database Schema - Row Level Security Policies
-- Migration: 002_rls_policies.sql
-- Created: 2024
-- Purpose: Enable and configure RLS for multi-tenant isolation and security
--
-- This migration:
-- 1. Enables RLS on all tables
-- 2. Creates policies for multi-tenant data isolation
-- 3. Enforces Super Admin separation
-- 4. Ensures data privacy at the row level

-- ============================================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================================

ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.allergens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_allergens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lsc_library_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lsc_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_lsc_associations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lsc_translation_requests ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RESTAURANTS TABLE POLICIES
-- ============================================================================

-- Super Admin can see all restaurants
CREATE POLICY restaurants_super_admin_all ON public.restaurants
  FOR ALL
  USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'super_admin'
  );

-- Restaurant admins can see their own restaurant
CREATE POLICY restaurants_admin_own ON public.restaurants
  FOR SELECT
  USING (
    id IN (
      SELECT restaurant_id FROM public.users WHERE id = auth.uid()
    )
  );

-- Restaurant admins can update their own restaurant
CREATE POLICY restaurants_admin_update_own ON public.restaurants
  FOR UPDATE
  USING (
    id IN (
      SELECT restaurant_id FROM public.users WHERE id = auth.uid()
    )
  );

-- ============================================================================
-- USERS TABLE POLICIES
-- ============================================================================

-- Super Admin can see all users
CREATE POLICY users_super_admin_all ON public.users
  FOR ALL
  USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'super_admin'
  );

-- Users can see users in their own restaurant
CREATE POLICY users_see_own_restaurant ON public.users
  FOR SELECT
  USING (
    restaurant_id IN (
      SELECT restaurant_id FROM public.users WHERE id = auth.uid()
    )
  );

-- Users can only read their own profile
CREATE POLICY users_read_own_profile ON public.users
  FOR SELECT
  USING (
    id = auth.uid()
  );

-- ============================================================================
-- CATEGORIES TABLE POLICIES
-- ============================================================================

-- Super Admin can see all categories
CREATE POLICY categories_super_admin_all ON public.categories
  FOR ALL
  USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'super_admin'
  );

-- Users can see categories in their own restaurant
CREATE POLICY categories_restaurant_read ON public.categories
  FOR SELECT
  USING (
    restaurant_id IN (
      SELECT restaurant_id FROM public.users WHERE id = auth.uid()
    )
  );

-- Users can manage categories in their own restaurant
CREATE POLICY categories_restaurant_write ON public.categories
  FOR INSERT
  WITH CHECK (
    restaurant_id IN (
      SELECT restaurant_id FROM public.users WHERE id = auth.uid()
    )
  );

CREATE POLICY categories_restaurant_update ON public.categories
  FOR UPDATE
  USING (
    restaurant_id IN (
      SELECT restaurant_id FROM public.users WHERE id = auth.uid()
    )
  );

CREATE POLICY categories_restaurant_delete ON public.categories
  FOR DELETE
  USING (
    restaurant_id IN (
      SELECT restaurant_id FROM public.users WHERE id = auth.uid()
    )
  );

-- ============================================================================
-- ALLERGENS TABLE POLICIES
-- ============================================================================

-- Super Admin can see all allergens
CREATE POLICY allergens_super_admin_all ON public.allergens
  FOR ALL
  USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'super_admin'
  );

-- Users can see allergens in their own restaurant
CREATE POLICY allergens_restaurant_read ON public.allergens
  FOR SELECT
  USING (
    restaurant_id IN (
      SELECT restaurant_id FROM public.users WHERE id = auth.uid()
    )
  );

-- Users can manage allergens in their own restaurant
CREATE POLICY allergens_restaurant_write ON public.allergens
  FOR INSERT
  WITH CHECK (
    restaurant_id IN (
      SELECT restaurant_id FROM public.users WHERE id = auth.uid()
    )
  );

CREATE POLICY allergens_restaurant_update ON public.allergens
  FOR UPDATE
  USING (
    restaurant_id IN (
      SELECT restaurant_id FROM public.users WHERE id = auth.uid()
    )
  );

CREATE POLICY allergens_restaurant_delete ON public.allergens
  FOR DELETE
  USING (
    restaurant_id IN (
      SELECT restaurant_id FROM public.users WHERE id = auth.uid()
    )
  );

-- ============================================================================
-- PRODUCTS TABLE POLICIES
-- ============================================================================

-- Super Admin can see all products
CREATE POLICY products_super_admin_all ON public.products
  FOR ALL
  USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'super_admin'
  );

-- Users can see products in their own restaurant
CREATE POLICY products_restaurant_read ON public.products
  FOR SELECT
  USING (
    restaurant_id IN (
      SELECT restaurant_id FROM public.users WHERE id = auth.uid()
    )
  );

-- Users can manage products in their own restaurant
CREATE POLICY products_restaurant_write ON public.products
  FOR INSERT
  WITH CHECK (
    restaurant_id IN (
      SELECT restaurant_id FROM public.users WHERE id = auth.uid()
    )
  );

CREATE POLICY products_restaurant_update ON public.products
  FOR UPDATE
  USING (
    restaurant_id IN (
      SELECT restaurant_id FROM public.users WHERE id = auth.uid()
    )
  );

CREATE POLICY products_restaurant_delete ON public.products
  FOR DELETE
  USING (
    restaurant_id IN (
      SELECT restaurant_id FROM public.users WHERE id = auth.uid()
    )
  );

-- ============================================================================
-- PRODUCT_ALLERGENS TABLE POLICIES
-- ============================================================================

-- Super Admin can see all product allergens
CREATE POLICY product_allergens_super_admin_all ON public.product_allergens
  FOR ALL
  USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'super_admin'
  );

-- Users can see product allergens linked to their products
CREATE POLICY product_allergens_read ON public.product_allergens
  FOR SELECT
  USING (
    product_id IN (
      SELECT id FROM public.products WHERE restaurant_id IN (
        SELECT restaurant_id FROM public.users WHERE id = auth.uid()
      )
    )
  );

-- Users can manage product allergens for their products
CREATE POLICY product_allergens_write ON public.product_allergens
  FOR INSERT
  WITH CHECK (
    product_id IN (
      SELECT id FROM public.products WHERE restaurant_id IN (
        SELECT restaurant_id FROM public.users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY product_allergens_delete ON public.product_allergens
  FOR DELETE
  USING (
    product_id IN (
      SELECT id FROM public.products WHERE restaurant_id IN (
        SELECT restaurant_id FROM public.users WHERE id = auth.uid()
      )
    )
  );

-- ============================================================================
-- ORDERS TABLE POLICIES
-- ============================================================================

-- Super Admin can see all orders
CREATE POLICY orders_super_admin_all ON public.orders
  FOR ALL
  USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'super_admin'
  );

-- Users can see orders in their own restaurant
CREATE POLICY orders_restaurant_read ON public.orders
  FOR SELECT
  USING (
    restaurant_id IN (
      SELECT restaurant_id FROM public.users WHERE id = auth.uid()
    )
  );

-- Users can manage orders in their own restaurant
CREATE POLICY orders_restaurant_write ON public.orders
  FOR INSERT
  WITH CHECK (
    restaurant_id IN (
      SELECT restaurant_id FROM public.users WHERE id = auth.uid()
    )
  );

CREATE POLICY orders_restaurant_update ON public.orders
  FOR UPDATE
  USING (
    restaurant_id IN (
      SELECT restaurant_id FROM public.users WHERE id = auth.uid()
    )
  );

-- ============================================================================
-- LSC_LIBRARY_CATEGORIES TABLE POLICIES
-- ============================================================================

-- Everyone can read LSC library categories (public reference data)
CREATE POLICY lsc_categories_read_all ON public.lsc_library_categories
  FOR SELECT
  USING (true);

-- Only Super Admin can insert/update/delete LSC categories
CREATE POLICY lsc_categories_super_admin ON public.lsc_library_categories
  FOR INSERT
  WITH CHECK (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'super_admin'
  );

CREATE POLICY lsc_categories_super_admin_update ON public.lsc_library_categories
  FOR UPDATE
  USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'super_admin'
  );

CREATE POLICY lsc_categories_super_admin_delete ON public.lsc_library_categories
  FOR DELETE
  USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'super_admin'
  );

-- ============================================================================
-- LSC_LIBRARY TABLE POLICIES
-- ============================================================================

-- Everyone can read LSC library (public reference data)
CREATE POLICY lsc_library_read_all ON public.lsc_library
  FOR SELECT
  USING (true);

-- Only Super Admin can insert/update/delete LSC videos
CREATE POLICY lsc_library_super_admin ON public.lsc_library
  FOR INSERT
  WITH CHECK (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'super_admin'
  );

CREATE POLICY lsc_library_super_admin_update ON public.lsc_library
  FOR UPDATE
  USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'super_admin'
  );

CREATE POLICY lsc_library_super_admin_delete ON public.lsc_library
  FOR DELETE
  USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'super_admin'
  );

-- ============================================================================
-- PRODUCT_LSC_ASSOCIATIONS TABLE POLICIES
-- ============================================================================

-- Super Admin can see all associations
CREATE POLICY product_lsc_assoc_super_admin_all ON public.product_lsc_associations
  FOR ALL
  USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'super_admin'
  );

-- Users can see LSC associations for their products
CREATE POLICY product_lsc_assoc_read ON public.product_lsc_associations
  FOR SELECT
  USING (
    product_id IN (
      SELECT id FROM public.products WHERE restaurant_id IN (
        SELECT restaurant_id FROM public.users WHERE id = auth.uid()
      )
    )
  );

-- Users can create LSC associations for their products
CREATE POLICY product_lsc_assoc_write ON public.product_lsc_associations
  FOR INSERT
  WITH CHECK (
    product_id IN (
      SELECT id FROM public.products WHERE restaurant_id IN (
        SELECT restaurant_id FROM public.users WHERE id = auth.uid()
      )
    )
  );

-- Users can delete LSC associations for their products
CREATE POLICY product_lsc_assoc_delete ON public.product_lsc_associations
  FOR DELETE
  USING (
    product_id IN (
      SELECT id FROM public.products WHERE restaurant_id IN (
        SELECT restaurant_id FROM public.users WHERE id = auth.uid()
      )
    )
  );

-- ============================================================================
-- LSC_TRANSLATION_REQUESTS TABLE POLICIES
-- ============================================================================

-- Super Admin can see all translation requests
CREATE POLICY lsc_requests_super_admin_all ON public.lsc_translation_requests
  FOR ALL
  USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'super_admin'
  );

-- Users can see their own translation requests
CREATE POLICY lsc_requests_read ON public.lsc_translation_requests
  FOR SELECT
  USING (
    restaurant_id IN (
      SELECT restaurant_id FROM public.users WHERE id = auth.uid()
    )
  );

-- Users can create translation requests for their restaurant
CREATE POLICY lsc_requests_create ON public.lsc_translation_requests
  FOR INSERT
  WITH CHECK (
    restaurant_id IN (
      SELECT restaurant_id FROM public.users WHERE id = auth.uid()
    )
  );

-- Users can update their own translation requests (Super Admin updates status)
CREATE POLICY lsc_requests_update ON public.lsc_translation_requests
  FOR UPDATE
  USING (
    restaurant_id IN (
      SELECT restaurant_id FROM public.users WHERE id = auth.uid()
    )
    OR
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'super_admin'
  );

-- ============================================================================
-- SUMMARY OF RLS POLICIES
-- ============================================================================
-- Tables with RLS enabled: 11
-- Total policies created: 35+
-- Security model:
--   - Multi-tenant isolation via restaurant_id
--   - Super Admin has unrestricted access
--   - Regular admins limited to their restaurant
--   - LSC Library is centralized and read-only for regular users
-- Next step: Run 003_storage_setup.sql (or configure buckets manually in UI)
