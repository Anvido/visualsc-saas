-- VISUALSC Production Database Schema - Initial Schema
-- Migration: 001_initial_schema.sql
-- Created: 2024
-- Purpose: Create core tables and infrastructure
--
-- This migration:
-- 1. Creates all core tables (restaurants, users, categories, products, allergens, orders)
-- 2. Creates LSC Library master tables
-- 3. Creates indexes for performance
-- 4. Establishes all foreign key relationships
--
-- IMPORTANT: RLS policies are applied in 002_rls_policies.sql
-- IMPORTANT: Seed data is applied in 004_seed_data.sql

-- ============================================================================
-- EXTENSIONS
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- RESTAURANTS - Multi-tenant organizations
CREATE TABLE public.restaurants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  admin_email VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'archived')),
  
  -- Branding
  logo_url TEXT,
  banner_url TEXT,
  color_primary VARCHAR(7) DEFAULT '#1F3F70',
  color_accent VARCHAR(7) DEFAULT '#F0B233',
  primary_color VARCHAR(7) DEFAULT '#1F3F70',
  secondary_color VARCHAR(7) DEFAULT '#F0B233',
  font_family VARCHAR(80) DEFAULT 'Inter',
  display_mode VARCHAR(20) DEFAULT 'traditional' CHECK (display_mode IN ('traditional', 'lsc')),
  
  -- Restaurant Information
  description TEXT,
  address VARCHAR(500),
  phone VARCHAR(20),
  whatsapp VARCHAR(20),
  email_contact VARCHAR(255),
  website VARCHAR(500),
  instagram_url VARCHAR(500),
  facebook_url VARCHAR(500),
  tiktok_url VARCHAR(500),
  business_hours JSONB, -- {"Monday": {"open": "09:00", "close": "18:00"}, ...}
  welcome_message TEXT,
  
  -- Menu Configuration
  template_type VARCHAR(50) NOT NULL DEFAULT 'accessibility-first' CHECK (template_type IN ('modern-coffee', 'gourmet', 'fast-casual', 'accessibility-first')),
  menu_sync_enabled BOOLEAN NOT NULL DEFAULT true,
  
  -- Trial & Subscription
  trial_start_date TIMESTAMP WITH TIME ZONE,
  trial_end_date TIMESTAMP WITH TIME ZONE,
  subscription_status VARCHAR(20) NOT NULL DEFAULT 'trial' CHECK (subscription_status IN ('trial', 'active', 'expired', 'cancelled')),
  plan_type VARCHAR(50) NOT NULL DEFAULT 'free' CHECK (plan_type IN ('free', 'pro', 'enterprise')),
  product_count INTEGER DEFAULT 0,
  
  -- Audit
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- USERS - Linked to Supabase Auth
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(20) NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  email_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- CATEGORIES - Menu categories per restaurant
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(10),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ALLERGENS - Restaurant-specific allergen definitions
CREATE TABLE public.allergens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(10) DEFAULT '⚠️',
  color VARCHAR(7) DEFAULT '#FF6B6B',
  description TEXT,
  is_system BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(restaurant_id, name)
);

-- PRODUCTS - Menu items
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  ingredients JSONB DEFAULT '[]',
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  featured BOOLEAN DEFAULT false,
  lsc_library_id UUID REFERENCES public.lsc_library(id) ON DELETE SET NULL,
  preparation_time_minutes INTEGER,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- PRODUCT_ALLERGENS - Many-to-many junction
CREATE TABLE public.product_allergens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  allergen_id UUID NOT NULL REFERENCES public.allergens(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(product_id, allergen_id)
);

-- ORDERS - Customer orders
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  items JSONB NOT NULL DEFAULT '[]',
  notes TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'ready', 'delivered', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- LSC LIBRARY (CENTRALIZED - SUPER ADMIN OWNED)
-- ============================================================================

-- LSC_LIBRARY_CATEGORIES - Master video categories
CREATE TABLE public.lsc_library_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  icon VARCHAR(10),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- LSC_LIBRARY - Master LSC video library
CREATE TABLE public.lsc_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES public.lsc_library_categories(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  video_duration INTEGER,
  keywords JSONB DEFAULT '[]',
  usage_count INTEGER DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- PRODUCT_LSC_ASSOCIATIONS - Link products to library videos
CREATE TABLE public.product_lsc_associations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  lsc_library_id UUID NOT NULL REFERENCES public.lsc_library(id) ON DELETE CASCADE,
  auto_matched BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(product_id, lsc_library_id)
);

-- LSC_TRANSLATION_REQUESTS - Translation request queue
CREATE TABLE public.lsc_translation_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  product_name VARCHAR(255) NOT NULL,
  category_suggestion VARCHAR(100),
  description TEXT,
  requested_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'recorded', 'rejected', 'duplicate')),
  notes TEXT,
  priority INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX idx_restaurants_slug ON public.restaurants(slug);
CREATE INDEX idx_restaurants_status ON public.restaurants(status);
CREATE INDEX idx_restaurants_created_at ON public.restaurants(created_at DESC);

CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_restaurant_id ON public.users(restaurant_id);
CREATE INDEX idx_users_role ON public.users(role);

CREATE INDEX idx_products_restaurant_id ON public.products(restaurant_id);
CREATE INDEX idx_products_category_id ON public.products(category_id);
CREATE INDEX idx_products_status ON public.products(status);
CREATE INDEX idx_products_featured ON public.products(featured);

CREATE INDEX idx_categories_restaurant_id ON public.categories(restaurant_id);
CREATE INDEX idx_categories_display_order ON public.categories(display_order);

CREATE INDEX idx_allergens_restaurant_id ON public.allergens(restaurant_id);

CREATE INDEX idx_orders_restaurant_id ON public.orders(restaurant_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);

CREATE INDEX idx_lsc_library_category_id ON public.lsc_library(category_id);
CREATE INDEX idx_lsc_library_status ON public.lsc_library(status);
CREATE INDEX idx_lsc_library_usage_count ON public.lsc_library(usage_count DESC);

CREATE INDEX idx_product_allergens_product_id ON public.product_allergens(product_id);
CREATE INDEX idx_product_allergens_allergen_id ON public.product_allergens(allergen_id);

CREATE INDEX idx_lsc_translation_requests_restaurant_id ON public.lsc_translation_requests(restaurant_id);
CREATE INDEX idx_lsc_translation_requests_status ON public.lsc_translation_requests(status);

-- ============================================================================
-- SUMMARY OF MIGRATION
-- ============================================================================
-- Tables created: 11
-- Indexes created: 17
-- Foreign keys: All CASCADE/SET NULL as specified
-- Constraints: CHECK constraints for status fields
-- Next step: Run 002_rls_policies.sql
