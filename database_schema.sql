-- VISUALSC Pilot MVP - Database Schema
-- For Supabase PostgreSQL

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- RESTAURANTS table
CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  admin_email VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'archived')),
  logo_url TEXT,
  banner_url TEXT,
  description TEXT,
  address VARCHAR(500),
  whatsapp VARCHAR(20),
  phone VARCHAR(20),
  email_contact VARCHAR(255),
  website VARCHAR(500),
  instagram_url VARCHAR(500),
  facebook_url VARCHAR(500),
  tiktok_url VARCHAR(500),
  business_hours JSONB, -- {"monday": {"open": "09:00", "close": "18:00"}, ...}
  color_primary VARCHAR(7) DEFAULT '#1F3F70',
  color_accent VARCHAR(7) DEFAULT '#F0B233',
  primary_color VARCHAR(7) DEFAULT '#1F3F70',
  secondary_color VARCHAR(7) DEFAULT '#F0B233',
  font_family VARCHAR(80) DEFAULT 'Inter',
  display_mode VARCHAR(20) DEFAULT 'traditional' CHECK (display_mode IN ('traditional', 'lsc')),
  welcome_message TEXT,
  template_type VARCHAR(50) DEFAULT 'accessibility-first' CHECK (template_type IN ('modern-coffee', 'gourmet', 'fast-casual', 'accessibility-first')),
  menu_sync_enabled BOOLEAN DEFAULT true,
  trial_start_date TIMESTAMP,
  trial_end_date TIMESTAMP,
  subscription_status VARCHAR(20) DEFAULT 'trial' CHECK (subscription_status IN ('trial', 'active', 'expired', 'cancelled')),
  plan_type VARCHAR(50) DEFAULT 'free' CHECK (plan_type IN ('free', 'pro', 'enterprise')),
  product_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- USERS table (Restaurant admins - linked to Supabase Auth)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- CATEGORIES table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(10),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ALLERGENS table (System-wide, restaurant can add custom ones)
CREATE TABLE allergens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(10) DEFAULT '⚠️',
  color VARCHAR(7) DEFAULT '#FF6B6B',
  description TEXT,
  is_system BOOLEAN DEFAULT false, -- true for pre-loaded allergens
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(restaurant_id, name)
);

-- PRODUCTS table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  ingredients JSONB DEFAULT '[]', -- Array of ingredient objects {name, quantity?, unit?}
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  featured BOOLEAN DEFAULT false,
  lsc_video_id UUID REFERENCES lsc_videos(id) ON DELETE SET NULL,
  preparation_time_minutes INTEGER,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- PRODUCT_ALLERGENS junction table (Many-to-many)
CREATE TABLE product_allergens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  allergen_id UUID NOT NULL REFERENCES allergens(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(product_id, allergen_id)
);

-- LSC_LIBRARY_CATEGORIES - Master categories for centralized library
CREATE TABLE lsc_library_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  icon VARCHAR(10),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- LSC_LIBRARY - Centralized master LSC video library (Super Admin owned)
CREATE TABLE lsc_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES lsc_library_categories(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  video_duration INTEGER, -- seconds
  keywords JSONB DEFAULT '[]', -- ["cappuccino", "espresso", "coffee"] for matching
  usage_count INTEGER DEFAULT 0, -- track how many products use this
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- PRODUCT_LSC_ASSOCIATIONS - Link products to library videos
CREATE TABLE product_lsc_associations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  lsc_library_id UUID NOT NULL REFERENCES lsc_library(id) ON DELETE CASCADE,
  auto_matched BOOLEAN DEFAULT false, -- true if matched by algorithm, false if manual
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(product_id, lsc_library_id)
);

-- LSC_TRANSLATION_REQUESTS - Restaurants request translations for products
CREATE TABLE lsc_translation_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  product_name VARCHAR(255) NOT NULL,
  category_suggestion VARCHAR(100),
  description TEXT,
  requested_date TIMESTAMP DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'recorded', 'rejected', 'duplicate')),
  notes TEXT,
  priority INTEGER DEFAULT 0, -- track demand
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Legacy: LSC_VIDEOS - Kept for backward compatibility, will be migrated
CREATE TABLE lsc_videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  video_duration INTEGER,
  category VARCHAR(20) DEFAULT 'product',
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ORDERS table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  items JSONB NOT NULL DEFAULT '[]', -- [{product_id, quantity}]
  notes TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'ready', 'delivered', 'cancelled')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_restaurants_slug ON restaurants(slug);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_restaurant_id ON users(restaurant_id);
CREATE INDEX idx_products_restaurant_id ON products(restaurant_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_categories_restaurant_id ON categories(restaurant_id);
CREATE INDEX idx_orders_restaurant_id ON orders(restaurant_id);
CREATE INDEX idx_lsc_videos_restaurant_id ON lsc_videos(restaurant_id);
CREATE INDEX idx_lsc_videos_product_id ON lsc_videos(product_id);

-- Insert default allergens
INSERT INTO allergens (name, icon, color) VALUES
  ('Leche', '🥛', '#87CEEB'),
  ('Gluten', '🌾', '#DAA520'),
  ('Maní', '🥜', '#8B4513'),
  ('Nueces', '🌳', '#A0522D'),
  ('Huevo', '🥚', '#F0E68C'),
  ('Mariscos', '🦐', '#FF6347'),
  ('Azúcar Agregada', '🍬', '#FF69B4')
ON CONFLICT (name) DO NOTHING;

-- Create LSC Coffee Club restaurant
INSERT INTO restaurants (name, slug, admin_email, status, welcome_message) VALUES
  ('LSC Coffee Club', 'lsc-coffee-club', 'demo@visualsc.co', 'active', 'Bienvenido a nuestro café accesible en Lengua de Señas Colombiana')
ON CONFLICT (slug) DO NOTHING;

-- Get LSC Coffee Club ID for inserting data
-- Note: You'll need to run this manually or use a transaction

-- Create categories for LSC Coffee Club
INSERT INTO categories (restaurant_id, name, icon, display_order) 
SELECT id, 'Espresso', '☕', 1 FROM restaurants WHERE slug = 'lsc-coffee-club'
ON CONFLICT DO NOTHING;

INSERT INTO categories (restaurant_id, name, icon, display_order) 
SELECT id, 'Bebidas Frías', '🧊', 2 FROM restaurants WHERE slug = 'lsc-coffee-club'
ON CONFLICT DO NOTHING;

INSERT INTO categories (restaurant_id, name, icon, display_order) 
SELECT id, 'Postres', '🍰', 3 FROM restaurants WHERE slug = 'lsc-coffee-club'
ON CONFLICT DO NOTHING;

INSERT INTO categories (restaurant_id, name, icon, display_order) 
SELECT id, 'Desayunos', '🥐', 4 FROM restaurants WHERE slug = 'lsc-coffee-club'
ON CONFLICT DO NOTHING;

INSERT INTO categories (restaurant_id, name, icon, display_order) 
SELECT id, 'Repostería', '🧁', 5 FROM restaurants WHERE slug = 'lsc-coffee-club'
ON CONFLICT DO NOTHING;

INSERT INTO categories (restaurant_id, name, icon, display_order) 
SELECT id, 'Té', '🍵', 6 FROM restaurants WHERE slug = 'lsc-coffee-club'
ON CONFLICT DO NOTHING;

-- Note: Insert products, allergens, and videos in application code
-- This ensures proper foreign key relationships

-- Create bcrypt hash for password 'demo123456'
-- In a real system, use a backend to generate this
-- For testing: use bcrypt hash: $2a$10$N9qo8uLOickgx2ZMRZoM2eIjZAgcg7b3XeKeUxWdeS86E36CHhzPm
-- (This is bcrypt of 'password', replace with actual hash of '123456')
