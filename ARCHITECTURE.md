# VISUALSC - Complete SaaS Architecture Design

## Executive Summary

VISUALSC is a multi-tenant SaaS platform for restaurant accessibility. It consists of 4 independent systems sharing a common data layer, with a focus on Colombian Sign Language (LSC) integration, template flexibility, and scalable operations.

**Key Characteristics:**
- Multi-tenant with complete data isolation
- Role-based access control (RBAC) with 5+ roles across systems
- Template engine for menu presentation
- Modular LSC video library system
- Plan-based feature activation
- Real-time synchronization between admin dashboard and customer experience

---

## 1. PRODUCT ARCHITECTURE

### 1.1 Four Independent Systems

```
┌─────────────────────────────────────────────────────────────────────┐
│                        VISUALSC ECOSYSTEM                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────┐  ┌──────────────────┐  ┌────────────────┐   │
│  │  System A       │  │  System B        │  │  System C      │   │
│  │  Super Admin    │  │  Restaurant      │  │  Customer      │   │
│  │  Dashboard      │  │  Dashboard       │  │  Experience    │   │
│  │                 │  │                  │  │                │   │
│  │  • Restaurants  │  │  • Menu Builder  │  │  • LSC Menu    │   │
│  │  • Billing      │  │  • Orders        │  │  • Traditional │   │
│  │  • Users        │  │  • Analytics     │  │    Menu        │   │
│  │  • Templates    │  │  • Staff         │  │  • Ordering    │   │
│  │  • LSC Library  │  │  • Settings      │  │                │   │
│  │  • Approvals    │  │                  │  │                │   │
│  │  • Analytics    │  │                  │  │                │   │
│  └────────┬────────┘  └─────────┬────────┘  └────────┬───────┘   │
│           │                     │                    │            │
│  ┌────────┴─────────────────────┴────────────────────┴──────┐     │
│  │         System D - LSC Library (Shared CMS)              │     │
│  │                                                           │     │
│  │  • Video Management                                       │     │
│  │  • Video Categorization & Versioning                      │     │
│  │  • Approval Workflow                                      │     │
│  │  • Accessibility Validation                               │     │
│  │  • Modular Composition Engine                             │     │
│  └───────────────────────────────────────────────────────────┘     │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Shared Data Layer (PostgreSQL + Supabase)                 │   │
│  │  • Tenant Isolation • Auth • File Storage • Real-time      │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.2 System Responsibilities

#### **System A - VISUALSC Super Admin Dashboard**
**Audience:** VISUALSC team members
**Responsibilities:**
- Restaurant lifecycle management (create, edit, suspend, delete)
- User administration across all restaurants
- Plan assignment and upgrade/downgrade management
- Global analytics and KPI monitoring
- LSC library management and approval workflow
- Template creation and management
- Billing and subscription overview
- Platform health monitoring

**Key Metrics:**
- Total restaurants (by status: active, pilot, premium, suspended)
- Active users count
- Total QR scans (global)
- Total orders generated
- LSC module usage percentage
- Revenue and MRR
- Feature adoption rates

---

#### **System B - Restaurant Admin Dashboard**
**Audience:** Restaurant owners, managers, staff
**Responsibilities:**
- Menu management (categories, products, variants)
- Bulk import/export operations
- Order management and fulfillment
- Staff management (roles, permissions)
- Team analytics
- Template selection and customization
- Settings (restaurant info, integrations, notifications)
- LSC video composition from library

**Key Metrics:**
- Product count and category distribution
- Daily/weekly/monthly orders
- QR scan frequency and patterns
- Top products by views and orders
- LSC module engagement
- Average order value
- Conversion rate (QR scans → orders)

---

#### **System C - Customer Experience**
**Audience:** Restaurant customers
**Access Points:**
- QR code links
- Direct URL (public menu page)
- Deep links (specific product/category)

**Two Parallel Experiences:**
1. **Traditional Menu** (text, images, prices)
2. **Accessible LSC Menu** (visual hierarchy, large buttons, sign language videos)

**Key Flows:**
- Browse products
- View ingredients and allergens
- Watch LSC videos
- Place orders
- Track order status

---

#### **System D - LSC Library (Shared CMS)**
**Audience:** VISUALSC content team, translators, accessibility specialists
**Responsibilities:**
- Video upload and management
- Video categorization (products, ingredients, actions)
- Version control and historical tracking
- Quality approval and validation
- Accessibility metadata
- Composition rules and templates
- Performance optimization (caching, CDN)

**Content Types:**
- Product-specific videos (full product explanation)
- Component videos (ingredients, preparation methods)
- Action videos (how to order, allergen explanations)
- Instructional videos (welcome, navigation guide)

---

## 2. DATABASE ARCHITECTURE

### 2.1 Multi-Tenant Data Isolation Strategy

```sql
-- Every table includes tenant_id for data isolation
CREATE TABLE restaurants (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES auth.users(id),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  status ENUM ('active', 'pilot', 'premium', 'suspended', 'archived'),
  plan_id UUID REFERENCES plans(id),
  ...
  CONSTRAINT restaurants_tenant_fk FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

-- Row-level security (RLS) enforces tenant isolation
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;

CREATE POLICY restaurants_select_policy ON restaurants
  FOR SELECT USING (tenant_id = auth.uid());
```

**Key Principles:**
1. Every table has `tenant_id` or inherits it via foreign key
2. Row-Level Security (RLS) enforces isolation at database level
3. No query can accidentally access another tenant's data
4. Tenant is established at auth time and passed to all queries

### 2.2 Core Data Schema

```
TENANTS (Organization)
├── id (UUID)
├── name (org_name)
├── created_at
└── ...

RESTAURANTS (Multi-tenant)
├── id (UUID, PK)
├── tenant_id (FK → tenants)
├── name
├── slug
├── status (active|pilot|premium|suspended|archived)
├── plan_id (FK → plans)
├── cover_image_url
├── logo_url
├── welcome_video_id (FK → lsc_videos)
├── template_id (FK → templates)
├── created_at
└── metadata (JSON: address, phone, hours, cuisine_type)

PRODUCTS
├── id (UUID, PK)
├── restaurant_id (FK → restaurants)
├── name
├── description
├── price (DECIMAL)
├── image_url
├── category_id (FK → categories)
├── status (active|inactive|archived)
├── created_at
└── metadata (JSON)

PRODUCT_VARIANTS
├── id (UUID, PK)
├── product_id (FK → products)
├── name (e.g., "Size", "Temperature")
├── options (JSON: ["Small", "Medium", "Large"])
└── price_adjustment (DECIMAL)

PRODUCT_INGREDIENTS
├── id (UUID, PK)
├── product_id (FK → products)
├── ingredient_id (FK → ingredients)
├── quantity
└── unit

PRODUCT_ALLERGENS
├── id (UUID, PK)
├── product_id (FK → products)
├── allergen_id (FK → allergens)
└── severity (trace|contains|may_contain)

CATEGORIES
├── id (UUID, PK)
├── restaurant_id (FK → restaurants)
├── name
├── description
├── display_order
├── icon
└── image_url

ALLERGENS (System-wide, shared)
├── id (UUID, PK)
├── name (e.g., "Leche", "Gluten")
├── icon_url
├── color (hex)
├── description
└── severity_default

INGREDIENTS (Per-restaurant)
├── id (UUID, PK)
├── restaurant_id (FK → restaurants)
├── name
├── allergen_ids (JSON: [allergen_id, ...])
└── description

USERS
├── id (UUID, PK)
├── tenant_id (FK → tenants)
├── email
├── role_id (FK → roles)
├── restaurant_id (FK → restaurants, nullable)
├── status (active|invited|inactive)
├── invited_at
├── accepted_at
└── metadata (JSON)

ROLES (Predefined)
├── id (UUID, PK)
├── name (super_admin|restaurant_owner|manager|staff|kitchen)
├── scope (global|restaurant)
└── permissions (JSON: ["create_menu", "view_orders", ...])

ORDERS
├── id (UUID, PK)
├── restaurant_id (FK → restaurants)
├── order_number (auto-increment per restaurant)
├── status (pending|preparing|ready|delivered|cancelled)
├── items (JSON: [{product_id, quantity, variants, notes}, ...])
├── allergy_notes (TEXT)
├── table_number (nullable)
├── created_at
├── updated_at
└── metadata (JSON: qr_scan_id, customer_notes)

PLANS
├── id (UUID, PK)
├── name (Piloto|Starter|Pro|Enterprise)
├── description
├── price_monthly (DECIMAL)
├── features (JSON)
│   ├── max_products: 50
│   ├── max_categories: 10
│   ├── lsc_videos_included: true
│   ├── analytics: true
│   ├── multi_location: false
│   └── ...
└── max_restaurants_allowed (for tenant)

TEMPLATES
├── id (UUID, PK)
├── name (Minimalista Premium, Cafetería Moderna, etc.)
├── description
├── preview_image_url
├── config (JSON schema)
│   ├── color_scheme: {...}
│   ├── typography: {...}
│   ├── layout: {...}
│   ├── components: {...}
│   └── assets: {logo, banner, fonts}
└── created_at

RESTAURANT_TEMPLATE_CUSTOMIZATION
├── id (UUID, PK)
├── restaurant_id (FK → restaurants)
├── template_id (FK → templates)
├── custom_config (JSON, overrides template defaults)
└── updated_at

LSC_VIDEOS (Shared library)
├── id (UUID, PK)
├── tenant_id (FK → tenants, VISUALSC owner)
├── title
├── description
├── video_url (Supabase Storage)
├── category (product|ingredient|action|instruction)
├── type (full|component)
├── status (draft|pending_approval|approved|archived)
├── tags (JSON: ["café", "leche", "caliente"])
├── created_at
├── approved_by_id (FK → users)
├── approved_at
├── metadata (JSON)
│   ├── duration_seconds
│   ├── interpreter_name
│   ├── source (original|translated|ai_generated)
│   └── accessibility_score

LSC_VIDEO_VERSIONS
├── id (UUID, PK)
├── video_id (FK → lsc_videos)
├── version_number
├── video_url
├── created_at
├── created_by_id (FK → users)
└── reason_for_update

RESTAURANT_LSC_CUSTOMIZATION
├── id (UUID, PK)
├── restaurant_id (FK → restaurants)
├── product_id (FK → products)
├── custom_video_id (FK → lsc_videos, nullable)
├── composition_rules (JSON)
│   └── component_video_ids: [video_id, ...]
└── updated_at

ANALYTICS_EVENTS
├── id (UUID, PK)
├── restaurant_id (FK → restaurants)
├── event_type (qr_scan|product_view|lsc_video_play|order_placed|menu_load)
├── product_id (FK → products, nullable)
├── video_id (FK → lsc_videos, nullable)
├── session_id (UUID)
├── user_agent (TEXT)
├── referrer (TEXT)
├── timestamp
└── metadata (JSON)

AUDIT_LOG
├── id (UUID, PK)
├── restaurant_id (FK → restaurants)
├── user_id (FK → users)
├── action (create|update|delete|archive)
├── entity_type (product|category|user|order)
├── entity_id (UUID)
├── changes (JSONB: {field: {old_value, new_value}})
├── created_at
└── ip_address
```

### 2.3 Key Design Decisions

**Data Isolation:**
- Tenant filtering happens at RLS policy level
- No stored procedures bypass tenant isolation
- API layer adds additional tenant validation

**Soft Deletes:**
- Products and videos use `status` field instead of hard delete
- Enables audit trails and accidental recovery
- Analytics remains accurate

**JSON Fields:**
- Used for flexible metadata (restaurant settings, template configs)
- Allows schema evolution without migrations
- Enables custom fields per restaurant

**Denormalization:**
- Some read-heavy tables duplicate data for performance
- Example: `restaurant_plan_features` cached from `plans`
- Updated via triggers when plan changes

---

## 3. MULTI-TENANT ARCHITECTURE

### 3.1 Tenant Isolation Model

**Three Levels of Isolation:**

```
Level 1: Authentication
├── Each user has auth.users(id)
├── auth.uid() available in RLS policies
└── No cross-user data access possible

Level 2: Row-Level Security
├── Every table filtered by tenant_id
├── Policies enforce at database level
└── Database never returns unauthorized data

Level 3: API/Application Layer
├── Request includes user context
├── Server validates request.user.tenant_id
├── No data can be queried outside tenant
```

### 3.2 Tenant Types and Hierarchies

```
Hierarchy:

VISUALSC (Super Tenant)
└── Manages:
    ├── Platform operations
    ├── LSC library (shared)
    ├── Templates (shared)
    └── All restaurant accounts

Restaurant Tenants (Business Accounts)
├── Each is a sub-tenant
├── Has own users, products, orders
├── Can't see other restaurants' data
├── Can access shared LSC library
└── Can use any published template

User Tenants (Future, for enterprise customers)
├── If restaurant has multiple branches
├── Shared billing, separate operations
└── TBD in Phase 2
```

### 3.3 Shared vs. Private Data

```
SHARED DATA (Accessible to all authenticated users):
├── LSC_VIDEOS (approved, published)
├── TEMPLATES (published)
├── ALLERGENS (system-wide reference)
└── PUBLIC_MENU_URLS (published customer experiences)

PRIVATE DATA (Tenant-isolated):
├── PRODUCTS
├── ORDERS
├── USERS
├── ANALYTICS
├── RESTAURANT_SETTINGS
└── CUSTOM_LSC_COMPOSITIONS
```

---

## 4. LSC (Colombian Sign Language) ARCHITECTURE

### 4.1 Two Implementation Models Comparison

#### **Model A: Full Product Videos (Simple, Limited Scalability)**

**Concept:** Each product has one complete video in LSC

```
Product: Café Americano
└── LSC Video: "Café Americano with explanation"
    (Complete explanation: what it is, ingredients, temperature, taste)

Product: Café con Leche
└── LSC Video: "Café con Leche with explanation"
    (Complete new explanation even though similar to above)
```

**Advantages:**
- Simple to implement initially
- One video per product = clear mapping
- No complexity for restaurant staff
- Easy for customers to understand

**Disadvantages:**
- High production costs (every product needs unique video)
- Long implementation timeline
- Not scalable with product catalog growth
- Duplication of content (coffee explained multiple times)
- Difficult to maintain consistency
- Hard to update if interpreter changes

**Cost Estimate (MVP):**
- $500-1000 per video × 50 products = $25,000-50,000

---

#### **Model B: Modular Library System (Complex, Highly Scalable) - RECOMMENDED**

**Concept:** Build videos from reusable components

```
Component Library:
├── PRODUCTS
│   ├── Video: "Café" (coffee concept)
│   ├── Video: "Té" (tea concept)
│   └── Video: "Agua" (water concept)
├── INGREDIENTS
│   ├── Video: "Leche" (milk)
│   ├── Video: "Azúcar" (sugar)
│   ├── Video: "Canela" (cinnamon)
│   └── Video: "Chocolate" (chocolate)
├── PREPARATION
│   ├── Video: "Caliente" (hot)
│   ├── Video: "Frío" (cold)
│   ├── Video: "Con hielo" (iced)
│   └── Video: "Batido" (blended)
├── ACTIONS
│   ├── Video: "Pedir" (order)
│   ├── Video: "Mostrar alérgenos" (show allergens)
│   ├── Video: "Confirmar pedido" (confirm order)
│   └── Video: "Problema/Duda" (question)
└── MODIFIERS
    ├── Video: "Extra" (extra/more)
    ├── Video: "Sin" (without)
    ├── Video: "Más/Menos" (more/less)
    └── Video: "Especial" (special)

Composition Engine:
├── Product: Café Americano
│   └── Sequence: [Café] + [Agua caliente] + [Cómo pedir]
├── Product: Café con Leche
│   └── Sequence: [Café] + [Leche] + [Caliente] + [Cómo pedir]
├── Product: Helado de Chocolate
│   └── Sequence: [Chocolate] + [Frío] + [Con hielo] + [Cómo pedir]
└── Product: Yogur sin Azúcar
    └── Sequence: [Yogur] + [Sin] + [Azúcar] + [Cómo pedir]
```

**Advantages:**
- Initial library build is larger but reusable indefinitely
- Can compose 100+ products from 30-40 component videos
- Consistent messaging (same "café" video always used)
- Low ongoing cost (create component once, reuse many times)
- Easy to update (update source video, all products update)
- Flexible composition rules per restaurant
- Scalable to enterprise with multiple locations

**Disadvantages:**
- More complex architecture
- Requires composition rules system
- More initial setup time
- Staff needs UI to compose videos

**Cost Estimate (MVP):**
- Create 40 core component videos: $20,000-30,000
- Composition system development: $15,000-25,000
- Covers 100+ products indefinitely

---

### 4.2 Recommended Strategy: Model B (Modular)

**Why:** Maximum scalability with reasonable initial investment. Perfect for SaaS growth trajectory.

**Implementation Phases:**

**Phase 1 (MVP): Core Library**
- 30-40 component videos
- Basic composition engine
- 5-6 menu templates with preset compositions
- Covers 70% of common products

**Phase 2: Advanced Composition**
- Restaurant-custom compositions
- Smart composition rules (if ingredient X, then show video Y)
- Video variation selection
- A/B testing capability

**Phase 3: AI Enhancement**
- Auto-composition suggestions
- Accessibility score validation
- Voice-to-sign translation
- Avatar-based generation

---

### 4.3 LSC Video Library Architecture

```
LSC_LIBRARY/
├── Videos
│   ├── Components (reusable)
│   │   ├── Products (café, té, agua, etc.)
│   │   ├── Ingredients (leche, azúcar, etc.)
│   │   ├── Preparation (caliente, frío, etc.)
│   │   ├── Actions (pedir, confirmar, etc.)
│   │   └── Modifiers (más, menos, sin, etc.)
│   ├── Full Products (alternative complete videos)
│   └── Instructions (navigation, order process, allergen info)
│
├── Compositions
│   └── Rules (if product = X, compose = [video1, video2, ...])
│
├── Metadata
│   ├── Tags and categorization
│   ├── Interpreter credits
│   ├── Validation status
│   ├── Version history
│   └── Accessibility scores
│
└── Storage
    ├── Supabase Storage (original files)
    ├── CDN cache (HLS/MP4 streaming)
    └── Thumbnail generation
```

### 4.4 Composition Engine Logic

```typescript
// Pseudo-code for composition engine
interface CompositionRule {
  product_id: UUID;
  component_sequence: UUID[]; // video IDs in order
  fallback_video?: UUID; // if components unavailable
}

function composeProductVideo(productId: UUID): VideoSequence {
  const rule = db.getCompositionRule(productId);
  const videos = rule.component_sequence.map(
    videoId => lscLibrary.getVideo(videoId)
  );
  
  return {
    videos: videos,
    duration: videos.reduce((sum, v) => sum + v.duration, 0),
    accessibility_score: calculateAccessibility(videos),
    alt_text: generateDescription(videos),
  };
}

// Fallback: if composition fails, serve full video or text alternative
```

---

## 5. TEMPLATE ARCHITECTURE

### 5.1 Template Engine Design

**Core Principle:** Separate presentation from data.

```
TEMPLATE STRUCTURE:

Template {
  id: UUID
  name: "Minimalista Premium"
  description: string
  
  // Base configuration
  base_config: {
    color_scheme: {
      primary: "#1F3F70"
      accent: "#F0B233"
      background: "#FFFFFF"
      ...
    }
    typography: {
      heading_font: "Playfair Display"
      body_font: "Inter"
      sizes: { h1: 48px, h2: 36px, ... }
    }
    spacing: {
      base_unit: 8px
      section_gap: 32px
      card_padding: 16px
    }
    border_radius: "12px"
    shadows: ["0 1px 3px rgba(0,0,0,0.12)", ...]
    animations: [fade, slide, grow, ...]
  }
  
  // Layout definitions
  layouts: {
    home: {
      sections: [header, hero, categories, featured, footer]
      properties: { grid: "1 column", gap: 32px }
    }
    menu: {
      sections: [header, category_sidebar, products_grid, footer]
      properties: { grid: "sidebar + content", sidebar_width: 200px }
    }
    product_detail: {
      sections: [header, image, details, actions, footer]
      properties: { max_width: 600px, centered: true }
    }
  }
  
  // Component templates
  components: {
    header: {
      elements: [logo, nav, cta_button]
      style: "sticky"
    }
    product_card: {
      elements: [image, name, price, tags, button]
      style: "hover_effect: lift"
    }
    category_item: {
      elements: [icon, name, count]
      style: "text_align: center"
    }
    allergen_badge: {
      elements: [icon, tooltip]
      style: "position: absolute"
    }
  }
}
```

### 5.2 Template Customization Without Code

```
Restaurant Customization (Non-developers):
│
├── Color Scheme Editor
│   ├── Primary color picker
│   ├── Accent color picker
│   ├── Background color picker
│   └── Preview in real-time
│
├── Asset Upload
│   ├── Logo (PNG/SVG)
│   ├── Cover image (JPG/PNG)
│   ├── Banner images (JPG/PNG)
│   └── Icon replacements (SVG)
│
├── Text Customization
│   ├── Restaurant name
│   ├── Tagline
│   ├── Welcome message
│   ├── Closing message
│   └── Footer text
│
├── Layout Options (preset choices)
│   ├── "Categories at top" vs "Sidebar"
│   ├── "Grid 2 columns" vs "Grid 3 columns"
│   ├── "Show prices?" yes/no
│   └── "Show images?" yes/no
│
└── Advanced (Limited code)
    ├── CSS variable overrides
    ├── Component visibility toggle
    └── Custom section reordering
```

### 5.3 Template Types

```
1. MINIMALISTA PREMIUM
   - Clean, elegant, high-end
   - Large whitespace
   - Sophisticated typography
   - Perfect for: Fine dining, specialty coffee shops

2. CAFETERÍA MODERNA
   - Vibrant, contemporary
   - Bold colors
   - Grid-based layout
   - Perfect for: Cafés, bakeries, modern restaurants

3. RESTAURANTE GOURMET
   - Rich, luxurious design
   - Image-focused
   - Premium feel
   - Perfect for: Upscale restaurants, fine dining

4. FAST CASUAL
   - Energetic, modern
   - Quick-scan design
   - Action-focused CTAs
   - Perfect for: Fast food, casual dining, chains

+ Future: Custom template builder for enterprise
```

### 5.4 Template Versioning & Updates

```
Template Management:

Version 1.0 (Current)
├── Used by: 12 restaurants
├── Features: Basic colors, layout
└── Support: Full support

Version 1.1 (Latest)
├── Used by: 5 new restaurants
├── Features: New components, animations
├── Migration: Restaurants can opt-in
└── Support: Full support

Version 0.9 (Deprecated)
├── Used by: 2 restaurants
├── Status: No longer updated
├── Migration: Recommended to upgrade
└── Support: Security fixes only

Automatic Updates:
- Non-breaking changes → automatic
- Breaking changes → opt-in with migration
- Customers always have stable version
```

---

## 6. PERMISSIONS & ROLE-BASED ACCESS CONTROL

### 6.1 Role Hierarchy

```
┌────────────────────────────────────────┐
│         Role Hierarchy (RBAC)          │
└────────────────────────────────────────┘

LEVEL 1: VISUALSC Roles (Global)
├── Super Admin
│   ├── Create restaurants ✓
│   ├── Manage all users ✓
│   ├── View all analytics ✓
│   ├── Manage LSC library ✓
│   ├── Manage templates ✓
│   ├── Access billing ✓
│   └── Approve content ✓
│
└── Content Manager (LSC Library)
    ├── Upload videos ✓
    ├── Categorize videos ✓
    ├── Submit for approval ✓
    ├── View analytics ✓
    └── Cannot approve own content ✗

LEVEL 2: Restaurant Roles (Tenant-scoped)
├── Owner
│   ├── Manage all staff ✓
│   ├── Edit menu ✓
│   ├── View all orders ✓
│   ├── View analytics ✓
│   ├── Edit settings ✓
│   ├── Manage billing ✓
│   ├── Change template ✓
│   └── Cannot manage super admin ✗
│
├── Manager
│   ├── Manage kitchen staff ✓
│   ├── Edit menu ✓
│   ├── View all orders ✓
│   ├── View analytics ✓
│   ├── Edit settings (limited) ✓
│   ├── Cannot manage billing ✗
│   └── Cannot manage permissions ✗
│
├── Server/Waitstaff
│   ├── View orders ✓
│   ├── View menu ✓
│   ├── Cannot edit menu ✗
│   ├── Cannot view analytics ✗
│   └── Cannot manage users ✗
│
└── Kitchen Staff
    ├── View assigned orders ✓
    ├── Update order status ✓
    ├── View menu ✓
    ├── Cannot view other staff ✗
    └── Cannot edit menu ✗
```

### 6.2 Permission Model

```
Permissions = (Role + Resource + Action)

Examples:
├── (Super Admin, Restaurant, CREATE)
├── (Restaurant Owner, Product, UPDATE)
├── (Manager, Order, VIEW)
├── (Kitchen Staff, Order Status, UPDATE)
└── (Server, Order, VIEW_OWN)

Permission Groups:
├── MENU_MANAGEMENT
│   ├── products.create
│   ├── products.update
│   ├── products.delete
│   ├── categories.manage
│   └── ingredients.manage
│
├── ORDER_MANAGEMENT
│   ├── orders.view_all
│   ├── orders.view_assigned
│   ├── orders.create
│   ├── orders.update_status
│   └── orders.cancel
│
├── ANALYTICS
│   ├── analytics.view_basic
│   ├── analytics.view_detailed
│   ├── reports.export
│   └── reports.schedule
│
├── USER_MANAGEMENT
│   ├── users.create
│   ├── users.edit
│   ├── users.delete
│   ├── users.change_role
│   └── users.resend_invite
│
├── SETTINGS
│   ├── settings.view
│   ├── settings.edit
│   ├── settings.advanced_edit
│   ├── integrations.manage
│   └── billing.manage
│
└── LSC_LIBRARY
    ├── lsc.browse
    ├── lsc.upload
    ├── lsc.submit_approval
    ├── lsc.approve
    └── lsc.manage_versions
```

### 6.3 Database Implementation

```sql
-- Roles table
CREATE TABLE roles (
  id UUID PRIMARY KEY,
  name VARCHAR(50) NOT NULL, -- 'super_admin', 'owner', 'manager', etc.
  scope VARCHAR(20) NOT NULL, -- 'global' or 'restaurant'
  description TEXT,
  created_at TIMESTAMP
);

-- Permissions table
CREATE TABLE permissions (
  id UUID PRIMARY KEY,
  code VARCHAR(100) UNIQUE NOT NULL, -- 'products.create'
  description TEXT,
  category VARCHAR(50), -- 'menu_management', 'order_management'
  created_at TIMESTAMP
);

-- Role-Permission mapping
CREATE TABLE role_permissions (
  id UUID PRIMARY KEY,
  role_id UUID REFERENCES roles(id),
  permission_id UUID REFERENCES permissions(id),
  UNIQUE(role_id, permission_id)
);

-- User-Role assignment (per tenant)
CREATE TABLE user_roles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  role_id UUID REFERENCES roles(id),
  restaurant_id UUID REFERENCES restaurants(id), -- NULL for global roles
  assigned_at TIMESTAMP,
  assigned_by_id UUID REFERENCES users(id),
  UNIQUE(user_id, restaurant_id) -- One role per user per restaurant
);
```

### 6.4 Permission Enforcement in API

```typescript
// Middleware: Check permission before action
async function requirePermission(
  req: Request,
  permissionCode: string
) {
  const user = req.user; // From auth
  
  // Get user's role
  const userRole = await db.getUserRole(
    user.id,
    req.restaurant_id // Current restaurant context
  );
  
  // Get role's permissions
  const permissions = await db.getRolePermissions(userRole.id);
  
  // Check if permission exists
  if (!permissions.some(p => p.code === permissionCode)) {
    throw new ForbiddenError(`Missing permission: ${permissionCode}`);
  }
}

// Usage in route handlers
app.post('/api/products', 
  requireAuth(),
  requirePermission('products.create'),
  createProductHandler
);
```

---

## 7. PLANS & BILLING ARCHITECTURE

### 7.1 Subscription Plans

```
┌─────────────────────────────────────────────────────────┐
│              VISUALSC Subscription Plans                │
└─────────────────────────────────────────────────────────┘

PILOTO (Trial/Pilot Program)
├── Duration: 30 days
├── Price: Free
├── Purpose: Onboarding + testing
├── Features:
│   ├── Up to 50 products
│   ├── 5 categories
│   ├── 3 menu templates (no customization)
│   ├── Basic analytics
│   ├── LSC library access (components only)
│   ├── 1 QR code
│   ├── Email support
│   └── No payment method required
├── Upgradeable: To Starter
└── Auto-downgrade: After 30 days if not upgraded

STARTER ($29/month)
├── Best for: Small cafés, single location
├── Features:
│   ├── 200 products
│   ├── 20 categories
│   ├── All 4 templates + basic customization
│   ├── Standard analytics (7-day lookback)
│   ├── LSC library + modular compositions
│   ├── 5 QR codes (different URLs/codes)
│   ├── 3 staff members
│   ├── Email support
│   ├── Basic import/export
│   ├── Order management (basic)
│   └── Allergen tracking
├── Overage: $0.10 per extra product
└── Next plan: Pro

PRO ($99/month)
├── Best for: Medium restaurants, multiple items
├── Features:
│   ├── 1000 products
│   ├── 50 categories
│   ├── All templates + advanced customization
│   ├── Advanced analytics (90-day lookback)
│   ├── LSC custom compositions per product
│   ├── 20 QR codes + custom domains
│   ├── 10 staff members
│   ├── Priority email support
│   ├── Advanced import/export (bulk operations)
│   ├── Full order management
│   ├── Advanced allergen management
│   ├── A/B testing analytics
│   ├── Custom welcome video LSC
│   └── Mobile app access
├── Overage: $0.05 per extra product
└── Next plan: Enterprise

ENTERPRISE (Custom pricing)
├── Best for: Chains, luxury dining, complex operations
├── Includes everything in Pro +
│   ├── Unlimited products and categories
│   ├── Unlimited staff members
│   ├── Multi-location management
│   ├── Custom template development
│   ├── Dedicated LSC interpretation team
│   ├── Phone + priority email support
│   ├── API access + webhooks
│   ├── Custom integrations (POS, KDS, etc.)
│   ├── Advanced security (SSO, 2FA, audit logs)
│   ├── White-label option
│   ├── SLA guarantee
│   └── Quarterly business reviews
├── Billing: Monthly or annual
└── Dedicated account manager
```

### 7.2 Feature Activation System

**Key Principle:** All plan tiers use same codebase. Features are gated by `plan.features` object.

```typescript
// Feature flag system
interface PlanFeatures {
  max_products: number;
  max_categories: number;
  max_staff_members: number;
  has_advanced_analytics: boolean;
  has_custom_lsc_composition: boolean;
  has_multi_location: boolean;
  has_api_access: boolean;
  has_custom_domain: boolean;
  has_white_label: boolean;
  support_tier: 'email' | 'priority_email' | 'phone' | 'dedicated';
}

// Check feature availability
function canUseFeature(
  restaurant: Restaurant,
  feature: keyof PlanFeatures
): boolean {
  const plan = restaurant.plan;
  
  switch (feature) {
    case 'has_advanced_analytics':
      return plan.features.has_advanced_analytics;
    case 'max_products':
      return restaurant.products.length < plan.features.max_products;
    default:
      return plan.features[feature];
  }
}

// UI: Show upgrade prompt
{!canUseFeature(restaurant, 'has_custom_lsc_composition') && (
  <UpgradePrompt 
    feature="Custom LSC Compositions"
    plan="Pro or Enterprise"
  />
)}
```

### 7.3 Billing & Revenue

```
Revenue Model:

1. Subscription Revenue
   ├── Starter: $29/month × restaurants
   ├── Pro: $99/month × restaurants
   └── Enterprise: Custom

2. Overage Revenue
   ├── Extra products beyond plan limit
   └── Additional staff members

3. Add-ons (Future)
   ├── Premium LSC interpretation ($499/month)
   ├── Multi-location add-on ($50/location/month)
   ├── White-label customization ($1000 one-time)
   └── API premium tier ($199/month)

Billing Cycle:
├── Monthly subscriptions
├── Annual subscriptions (20% discount)
├── Billing date: Anniversary of signup
├── Failed payment: 3 retry attempts, then suspension
└── Refunds: 14-day money-back guarantee

Metering & Overage:
├── Products counted: Active + inactive (not archived)
├── Staff counted: Accepted invites + active users
├── Track daily to calculate monthly overage
├── Invoice overage on billing date

Payment Methods:
├── Credit card (Stripe)
├── Bank transfer (for Enterprise)
├── ACH for US customers
└── Local payment methods for Colombia (Nequi, Daviplata, etc.)
```

---

## 8. REAL-TIME SYNCHRONIZATION ARCHITECTURE

### 8.1 Sync Requirements

```
Changes → Real-Time Reflection:

Restaurant Admin Updates Menu:
└── Product added/edited/deleted
    ├── Triggers database event
    ├── Event published to Supabase Realtime
    ├── Customer experience updates live
    ├── (No page refresh needed)
    └── Analytics logged

Restaurant Changes Template:
└── Color scheme updated
    ├── CSS variables updated
    ├── All active customer sessions re-render
    ├── Existing customers see instant change
    └── No cache refresh needed

Restaurant Adds LSC Video:
└── Video added to product
    ├── Customer experience detects change
    ├── LSC player loads new video
    ├── Fallback to composition if needed
    └── Analytics triggers video view event

Order Placed by Customer:
└── Order created
    ├── Restaurant receives notification
    ├── Order appears in dashboard (live)
    ├── Kitchen receives alert
    └── Order status updates flow back to customer
```

### 8.2 Technical Implementation

**Using Supabase Realtime:**

```typescript
// Backend: Listen to changes
supabase
  .channel(`restaurant:${restaurantId}`)
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'products',
      filter: `restaurant_id=eq.${restaurantId}`
    },
    (payload) => {
      // Broadcast to all customers of this restaurant
      broadcastToCustomers(restaurantId, {
        type: 'menu_updated',
        product: payload.new,
      });
    }
  )
  .subscribe();

// Frontend: Customer experience listens
useEffect(() => {
  const subscription = supabase
    .channel(`restaurant:${restaurantId}:public`)
    .on('broadcast', { event: 'menu_updated' }, (payload) => {
      // Update menu in real-time
      setMenu(prev => updateProduct(prev, payload.product));
    })
    .subscribe();

  return () => subscription.unsubscribe();
}, [restaurantId]);
```

**Optimistic Updates:**

```typescript
// Customer places order - update UI immediately
async function placeOrder(items: CartItem[]) {
  // Optimistic update
  setOrders(prev => [...prev, {
    id: tmpId,
    status: 'pending',
    items,
    created_at: new Date(),
  }]);

  try {
    // Send to server
    const response = await fetch('/api/orders', {
      method: 'POST',
      body: JSON.stringify({ items })
    });
    
    const order = await response.json();
    
    // Replace temp with real
    setOrders(prev => 
      prev.map(o => o.id === tmpId ? order : o)
    );
  } catch (error) {
    // Rollback on error
    setOrders(prev => prev.filter(o => o.id !== tmpId));
    showError('Failed to place order');
  }
}
```

---

## 9. API ARCHITECTURE

### 9.1 API Endpoints Structure

```
BASE: /api/v1

AUTHENTICATION
├── POST   /auth/register         → Register new restaurant
├── POST   /auth/login            → Login
├── POST   /auth/logout           → Logout
├── POST   /auth/refresh-token    → Refresh JWT
├── POST   /auth/reset-password   → Password reset
├── POST   /auth/accept-invite    → Accept user invite
└── POST   /auth/validate-code    → Validate 2FA code

RESTAURANTS (Super Admin only)
├── GET    /restaurants           → List all restaurants
├── POST   /restaurants           → Create restaurant
├── GET    /restaurants/:id       → Get restaurant details
├── PATCH  /restaurants/:id       → Update restaurant
├── DELETE /restaurants/:id       → Delete restaurant
├── PATCH  /restaurants/:id/status → Change status (active/suspended)
├── PATCH  /restaurants/:id/plan  → Assign plan
└── GET    /restaurants/:id/usage → Get plan usage

PRODUCTS (Restaurant scoped)
├── GET    /products              → List products
├── POST   /products              → Create product
├── GET    /products/:id          → Get product
├── PATCH  /products/:id          → Update product
├── DELETE /products/:id          → Archive product
├── POST   /products/:id/duplicate → Duplicate product
├── PATCH  /products/bulk-update  → Bulk update
└── POST   /products/import       → Import from Excel

CATEGORIES
├── GET    /categories            → List categories
├── POST   /categories            → Create category
├── PATCH  /categories/:id        → Update category
└── DELETE /categories/:id        → Delete category

ALLERGENS
├── GET    /allergens             → List system allergens
├── POST   /allergens             → Create custom allergen (org-level)
├── GET    /allergens/:id         → Get allergen
└── PATCH  /allergens/:id         → Update allergen

ORDERS
├── GET    /orders                → List orders (filtered by status)
├── POST   /orders                → Create order (customer)
├── GET    /orders/:id            → Get order details
├── PATCH  /orders/:id/status     → Update order status
├── PATCH  /orders/:id/notes      → Add/update notes
├── DELETE /orders/:id            → Cancel order
├── GET    /orders/export         → Export orders (CSV/Excel)
└── GET    /orders/stats          → Order statistics

USERS
├── GET    /users                 → List team members
├── POST   /users                 → Invite user
├── GET    /users/:id             → Get user details
├── PATCH  /users/:id             → Update user
├── PATCH  /users/:id/role        → Change user role
├── DELETE /users/:id             → Remove user
└── PATCH  /users/:id/resend-invite → Resend invite

TEMPLATES
├── GET    /templates             → List available templates
├── GET    /templates/:id         → Get template details
├── POST   /restaurant-templates  → Assign template to restaurant
├── PATCH  /restaurant-templates  → Customize template
├── GET    /restaurant-templates/preview → Preview customized template
└── POST   /restaurant-templates/publish → Publish template changes

LSC_VIDEOS (Shared, VISUALSC managed)
├── GET    /lsc-videos            → List videos (approved only)
├── GET    /lsc-videos/:id        → Get video details
├── GET    /lsc-videos/:id/stream → Stream video (HLS/MP4)
├── GET    /lsc-videos/search     → Search videos by tags
├── POST   /lsc-videos            → Upload video (admin only)
├── PATCH  /lsc-videos/:id        → Update video metadata (admin)
├── POST   /lsc-videos/:id/approve → Approve video (admin)
└── POST   /lsc-videos/:id/versions → Upload new version

LSC_COMPOSITIONS
├── GET    /lsc-compositions/:product_id → Get product composition
├── POST   /lsc-compositions      → Create custom composition
├── PATCH  /lsc-compositions/:id  → Update composition
└── DELETE /lsc-compositions/:id  → Delete composition

ANALYTICS
├── GET    /analytics/overview    → Dashboard KPIs
├── GET    /analytics/qr-scans    → QR scan analytics
├── GET    /analytics/products    → Product analytics
├── GET    /analytics/orders      → Order analytics
├── GET    /analytics/lsc-usage   → LSC engagement metrics
├── POST   /analytics/export      → Export analytics report
└── GET    /analytics/trends      → Trend analysis

SETTINGS
├── GET    /settings              → Get restaurant settings
├── PATCH  /settings              → Update settings
├── GET    /settings/billing      → Get billing info
├── POST   /settings/change-plan  → Change subscription plan
├── GET    /settings/integrations → List integrations
├── POST   /settings/integrations → Add integration
└── DELETE /settings/integrations/:id → Remove integration

CUSTOMER_EXPERIENCE (Public)
├── GET    /:slug                 → Get restaurant menu (public)
├── GET    /:slug/menu-traditional → Get traditional menu view
├── GET    /:slug/menu-lsc        → Get LSC menu view
├── GET    /:slug/products/:product_id → Get product details
├── GET    /:slug/welcome-video   → Get welcome video
└── POST   /:slug/orders          → Create order (customer)
```

### 9.2 Request/Response Format

```typescript
// Request with tenant context
interface ApiRequest {
  headers: {
    Authorization: 'Bearer <jwt_token>';
    'Content-Type': 'application/json';
    'X-Restaurant-ID': 'uuid'; // For restaurant context
  }
  body: { /* payload */ }
}

// Response format
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string; // 'INVALID_INPUT', 'UNAUTHORIZED', etc.
    message: string;
    details?: Record<string, any>;
  };
  meta: {
    timestamp: ISO8601;
    request_id: UUID; // For tracing
    version: 'v1';
  }
}

// Pagination
interface PagedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

// Example
{
  success: true,
  data: {
    id: 'uuid',
    name: 'Café Americano',
    price: 5000,
    // ...
  },
  meta: {
    timestamp: '2024-01-15T10:30:00Z',
    request_id: 'req_abc123',
    version: 'v1'
  }
}
```

### 9.3 Authentication & Authorization

```typescript
// JWT Token Claims
interface JWTPayload {
  sub: string;           // user ID
  email: string;
  tenant_id: string;     // organization/VISUALSC
  restaurant_id?: string; // if restaurant scoped
  role: string;          // user's role
  permissions: string[]; // user's permissions
  iat: number;
  exp: number;
  iss: 'visualsc';
}

// Token validation on every request
middleware((req) => {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
  // Attach to request
  req.user = decoded;
  
  // Validate tenant_id matches request context
  if (req.body.restaurant_id && 
      !hasAccessToRestaurant(req.user, req.body.restaurant_id)) {
    throw new ForbiddenError();
  }
});
```

---

## 10. ANALYTICS & TRACKING ARCHITECTURE

### 10.1 Events Tracked

```
Customer Experience Events:
├── qr_scan           {qr_code_id, restaurant_id, timestamp, device}
├── page_load          {page, restaurant_id, timestamp, referrer}
├── menu_view          {type (traditional|lsc), timestamp}
├── category_view      {category_id, timestamp}
├── product_view       {product_id, timestamp, duration_seconds}
├── lsc_video_play     {video_id, timestamp, duration_watched}
├── lsc_video_complete {video_id, timestamp}
├── filter_applied     {filter_type, filter_value, timestamp}
├── allergen_check     {allergen_ids, timestamp}
├── order_initiated    {items_count, timestamp}
├── order_placed       {order_id, value, items, timestamp}
├── session_end        {session_duration, pages_viewed, events_count}
└── error              {error_type, error_message, timestamp}

Restaurant Admin Events:
├── product_created    {product_id, category_id, timestamp}
├── product_updated    {product_id, changed_fields, timestamp}
├── product_deleted    {product_id, timestamp}
├── menu_imported      {products_count, timestamp}
├── template_changed   {template_id, customizations, timestamp}
├── lsc_composition_created {product_id, video_ids, timestamp}
├── user_invited       {user_email, role, timestamp}
├── order_status_updated {order_id, status, timestamp}
└── settings_changed   {setting_name, old_value, new_value, timestamp}

System Events:
├── plan_upgraded      {restaurant_id, from_plan, to_plan, timestamp}
├── plan_downgraded    {restaurant_id, from_plan, to_plan, timestamp}
├── restaurant_created  {restaurant_id, plan, timestamp}
├── restaurant_suspended {restaurant_id, reason, timestamp}
└── backup_completed   {timestamp, size_mb}
```

### 10.2 Analytics Dashboard Metrics

```
Restaurant Level:
├── QR Scans (daily, weekly, monthly)
├── Unique Visitors
├── Menu Views (Traditional vs LSC)
├── Top Products (by views)
├── Top Products (by orders)
├── Orders (daily, weekly, monthly)
├── Average Order Value
├── Conversion Rate (scans → orders)
├── LSC Engagement Rate
├── Most Watched LSC Videos
├── Session Duration (average)
├── Device Types
├── Peak Hours
└── Repeat Visitors

VISUALSC Level:
├── Total Restaurants
├── Active Restaurants (by plan)
├── Total Users
├── Total Orders (all restaurants)
├── Total QR Scans (all restaurants)
├── Platform LSC Usage Rate
├── Feature Adoption (by feature)
├── Average Order Value (all restaurants)
├── Growth Rate (MoM)
├── Churn Rate
├── Customer Satisfaction (NPS, if implemented)
└── Support Ticket Volume
```

### 10.3 Event Storage & Query

```
Storage Strategy:

Real-time Analytics:
├── Supabase: Last 24 hours (for live dashboards)
├── PostgreSQL Table: analytics_events
├── TTL: 24 hours (then archive)
└── Query latency: < 1 second

Historical Analytics:
├── Supabase for: Last 30 days (warm data)
├── PostgreSQL for: Last 12 months (cool data)
├── Data warehouse (future): BigQuery/Redshift
└── Archive S3 for: Long-term compliance

Queries:
SELECT 
  DATE(timestamp) as date,
  COUNT(*) as qr_scans,
  COUNT(DISTINCT session_id) as unique_visitors,
  COUNT(*) FILTER (WHERE event_type = 'order_placed') as orders,
  SUM(order_value) FILTER (WHERE event_type = 'order_placed') as revenue
FROM analytics_events
WHERE restaurant_id = $1
  AND timestamp > NOW() - INTERVAL '30 days'
GROUP BY DATE(timestamp)
ORDER BY date DESC;
```

---

## 11. SECURITY ARCHITECTURE

### 11.1 Data Security

```
Encryption:
├── In Transit: TLS 1.3
├── At Rest: Supabase encryption (AES-256)
├── Sensitive fields: PII encrypted at column level
│   ├── Email addresses
│   ├── Phone numbers
│   ├── Payment info (masked)
│   └── IP addresses (anonymized)
└── Keys: Managed by AWS KMS

Authentication:
├── Passwords: bcrypt with cost 12
├── JWT tokens: RS256 (asymmetric)
├── Token expiration: 1 hour access, 7 days refresh
├── 2FA: TOTP (Google Authenticator) - for sensitive accounts
└── Session timeout: 30 minutes of inactivity

Authorization:
├── Row-Level Security: Database level
├── Permission checking: API middleware
├── Audit logging: All write operations
└── Scope validation: Every request checks tenant_id

API Security:
├── Rate limiting: 100 req/min per IP
├── DDoS protection: Cloudflare
├── CORS: Whitelisted domains only
├── CSRF: Token-based validation
├── SQL injection: Parameterized queries only
├── XSS protection: Content Security Policy headers
└── Input validation: Schema validation (Zod)
```

### 11.2 Compliance & Auditing

```
Compliance:
├── GDPR: Data retention policies, right to be forgotten
├── CCPA: Data privacy disclosure
├── Local Colombia regulations: Tax ID handling
├── Payment Card Industry (PCI): Never store card data
└── Data processing agreements: Available on demand

Audit Logging:
├── Who: user_id
├── What: action (create, update, delete)
├── When: timestamp
├── Where: resource_id, restaurant_id
├── Why: request_id (for tracing)
├── How: endpoint, method
├── Retention: 7 years for compliance
└── Immutable: Cannot be modified after creation
```

### 11.3 Infrastructure Security

```
Network:
├── VPC: Private database, restricted access
├── Firewalls: Whitelist known IPs
├── WAF: Cloudflare rules
├── DDoS: AWS Shield, Cloudflare
└── CDN: Cloudflare (caching, compression)

Secrets Management:
├── Environment variables: AWS Secrets Manager
├── Never: Commit secrets to repo
├── Rotation: 90-day rotation for API keys
├── Access: Limited to production deployment only
└── Monitoring: Alert on secret access

Infrastructure:
├── Monitoring: Datadog, CloudWatch
├── Alerting: PagerDuty for critical issues
├── Backups: Daily automated, tested weekly
├── Disaster recovery: RTO 1 hour, RPO 15 minutes
├── Deployment: Blue-green deployment (zero downtime)
└── Monitoring: Uptime monitoring (Pingdom)
```

---

## 12. COMPLETE TECHNICAL ROADMAP FOR MVP

### Phase 1: Foundation (Weeks 1-4)

**Goal:** Build core multi-tenant infrastructure and auth

**Backend:**
- [ ] Setup Supabase project with PostgreSQL
- [ ] Implement core schema (restaurants, users, roles, products, categories)
- [ ] Setup Row-Level Security policies
- [ ] Implement authentication (register, login, password reset)
- [ ] Create API for restaurants, users, and basic products
- [ ] Setup automated backups and disaster recovery

**Frontend:**
- [ ] Landing page (already done in current sprint)
- [ ] Auth pages (already done in current sprint)
- [ ] Restaurant admin login flow
- [ ] Navbar/sidebar navigation structure
- [ ] Basic dashboard layout

**Deliverable:** Working authentication, multi-tenant data isolation, API foundations

---

### Phase 2: Core Admin Dashboard (Weeks 5-8)

**Goal:** Restaurant admin can manage menu completely

**Product Management:**
- [ ] Product CRUD (create, read, update, delete)
- [ ] Category CRUD
- [ ] Ingredient management
- [ ] Allergen association
- [ ] Product status (active/inactive/archived)
- [ ] Bulk product actions (duplicate, deactivate, delete)
- [ ] Product templates (variants, modifiers)
- [ ] Image uploads (Supabase Storage)

**Bulk Operations:**
- [ ] Excel import template design
- [ ] Excel import validator
- [ ] Excel import processor
- [ ] Excel export function
- [ ] Mapping UI for CSV columns

**Analytics Dashboard:**
- [ ] KPI cards (products, categories, orders, QR scans)
- [ ] Basic charts (orders over time, top products)
- [ ] Event tracking setup
- [ ] Analytics queries optimized

**Deliverable:** Full product management, analytics tracking, data import/export

---

### Phase 3: Customer Experience (Traditional Menu) (Weeks 9-12)

**Goal:** Customers can view menu and place orders

**Public Menu Pages:**
- [ ] Public restaurant URL (/:slug)
- [ ] Traditional menu display
- [ ] Product detail page
- [ ] Allergen display with icons
- [ ] Image optimization (lazy loading, responsive)
- [ ] Category filtering
- [ ] Search functionality

**Ordering System:**
- [ ] Order creation UI
- [ ] Item selection with variants
- [ ] Special notes/instructions
- [ ] Order confirmation
- [ ] Order status tracking (polling or websocket)
- [ ] Order history (customer can view past orders)

**Design Implementation:**
- [ ] Template system core (4 templates)
- [ ] Template customization UI (colors, assets)
- [ ] Live preview during customization
- [ ] Template assignment to restaurant

**Deliverable:** Customers can browse menu and place orders via traditional interface

---

### Phase 4: LSC Integration (Weeks 13-16)

**Goal:** MVP LSC support with modular library

**LSC Library Setup:**
- [ ] Setup Supabase Storage for videos
- [ ] Video metadata schema
- [ ] Video categorization system
- [ ] Video tagging system
- [ ] Version control for videos
- [ ] Video approval workflow

**Composition Engine:**
- [ ] Component video library upload
- [ ] Composition rule creation
- [ ] Composition engine logic
- [ ] Fallback handling

**Customer LSC Experience:**
- [ ] LSC menu UI (simplified, visual-first)
- [ ] Large buttons, clear icons
- [ ] Video player integration (HLS streaming)
- [ ] Composition video playback
- [ ] Welcome video display
- [ ] Accessibility optimizations

**MVP Content:**
- [ ] Create 30-40 core component videos (contractor)
- [ ] Create welcome video template
- [ ] Map common products to compositions

**Deliverable:** Customers can view LSC menu and watch sign language videos

---

### Phase 5: Super Admin Dashboard (Weeks 17-20)

**Goal:** VISUALSC can manage all restaurants

**Restaurant Management:**
- [ ] List all restaurants
- [ ] Create new restaurant
- [ ] Edit restaurant details
- [ ] Assign plans to restaurants
- [ ] View restaurant usage (products, orders, storage)
- [ ] Suspend/activate restaurants
- [ ] View per-restaurant analytics

**User Management:**
- [ ] List all users across restaurants
- [ ] Invite users
- [ ] Change roles
- [ ] Remove users
- [ ] View audit logs

**Platform Analytics:**
- [ ] Global KPI dashboard
- [ ] Restaurant breakdown analytics
- [ ] Feature adoption tracking
- [ ] Platform health metrics

**Deliverable:** VISUALSC team can onboard and manage restaurants

---

### Phase 6: Plans & Billing (Weeks 21-24)

**Goal:** Subscription management and feature gating

**Subscription System:**
- [ ] Stripe integration
- [ ] Plan management (create/edit plans)
- [ ] Plan assignment to restaurants
- [ ] Feature gating logic
- [ ] Usage tracking (products count, staff count, storage)
- [ ] Upgrade/downgrade workflow

**Billing Dashboard:**
- [ ] Subscription status display
- [ ] Plan overview
- [ ] Usage metrics vs limits
- [ ] Upgrade prompts
- [ ] Payment history
- [ ] Invoice generation

**Admin Billing:**
- [ ] Revenue dashboard
- [ ] Subscription overview
- [ ] MRR tracking
- [ ] Churn analysis
- [ ] Customer lifetime value

**Deliverable:** Functional SaaS subscription system with feature gating

---

### Phase 7: Polish & Launch (Weeks 25-28)

**Performance:**
- [ ] Database query optimization
- [ ] API response time < 200ms
- [ ] Frontend bundle optimization
- [ ] Image optimization
- [ ] Cache strategy implementation
- [ ] CDN setup

**Quality Assurance:**
- [ ] Security audit
- [ ] Load testing
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Cross-browser testing
- [ ] Mobile testing
- [ ] Usability testing with real users

**Operations:**
- [ ] Monitoring setup (error tracking, performance)
- [ ] Alerting system
- [ ] Runbooks for common issues
- [ ] Customer support documentation
- [ ] Onboarding guide

**Marketing & Sales:**
- [ ] Website copy refinement
- [ ] Help documentation
- [ ] Video demos
- [ ] Case studies (pilot customers)
- [ ] Pricing page design

**Deliverable:** Production-ready MVP ready for first customers

---

## 13. RECOMMENDED MVP SCOPE

### What's Included in MVP (Above Roadmap, Weeks 1-24)

1. ✅ Multi-tenant architecture
2. ✅ Role-based access control
3. ✅ Restaurant admin dashboard
4. ✅ Menu management (products, categories, allergens)
5. ✅ Bulk import/export
6. ✅ 4 menu templates
7. ✅ Public menu with traditional view
8. ✅ Order placement and status tracking
9. ✅ LSC menu with modular video library
10. ✅ Super admin dashboard
11. ✅ Basic analytics
12. ✅ Subscription plans with feature gating
13. ✅ Stripe integration

### What's Deferred to Phase 2 (Post-MVP)

1. ❌ Kitchen Display System (KDS)
2. ❌ Table management
3. ❌ Multiple locations
4. ❌ Custom template builder
5. ❌ Advanced AI LSC composition
6. ❌ Avatar-based LSC
7. ❌ Advanced reporting/exports
8. ❌ White-label platform
9. ❌ Mobile app (native iOS/Android)
10. ❌ Integration with POS systems

---

## 14. SUCCESS METRICS

### Product Metrics

```
Month 1-3:
├── Beta customers onboarded: 5-10
├── Restaurant menu items uploaded: 500+
├── QR codes scanned: 1000+
├── Orders placed: 100+
├── User retention: > 50% weekly active
└── Feature adoption: > 60% use LSC feature

Month 4-6:
├── Paying customers: 20+
├── MRR: $3,000+
├── Monthly active users: 100+
├── Total products on platform: 5,000+
├── Total orders: 1,000+
└── LSC engagement: > 40% of orders

Month 7-12:
├── Paying customers: 50+
├── MRR: $10,000+
├── Churn rate: < 5% monthly
├── Customer satisfaction: > 4.5/5
├── Platform orders: 5,000+ monthly
└── LSC library: > 100 component videos
```

### Business Metrics

```
Runway & Unit Economics:
├── Customer acquisition cost (CAC): < $300
├── Lifetime value (LTV): > $2,000
├── LTV:CAC ratio: > 7:1
├── Payback period: < 3 months
├── Gross margin: > 80%
└── Burn rate: Track against funding
```

---

## 15. TECH STACK SUMMARY

```
Frontend:
├── React 18
├── TypeScript
├── Tailwind CSS
├── React Router 6
├── Zustand (state management)
├── React Query (server state)
└── Supabase JS client (realtime)

Backend:
├── Node.js + Express (API)
├── TypeScript
├── Supabase (PostgreSQL, Auth, Storage)
├── Stripe (payments)
├── SendGrid (email)
└── Datadog (monitoring)

Database:
├── PostgreSQL 14+
├── Row-Level Security enabled
├── Full-text search indexes
├── PostGIS for future location features
└── Backups to S3

Deployment:
├── Frontend: Vercel or Netlify
├── Backend: Railway, Render, or Fly.io
├── Database: Supabase (managed PostgreSQL)
├── Storage: Supabase Storage (S3-compatible)
├── CDN: Cloudflare
└── Monitoring: Datadog + Sentry
```

---

## 16. ARCHITECTURE DIAGRAMS

### Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     VISUALSC Data Flow                          │
└─────────────────────────────────────────────────────────────────┘

Customer Journey:
1. Scans QR Code
   ↓
2. Loads Public Menu (/:slug)
   ├→ Fetches restaurant config
   ├→ Fetches products + categories
   ├→ Renders template
   └→ Logs analytics event (qr_scan)
   ↓
3. Browses Menu
   ├→ Views traditional OR LSC menu
   ├→ Watches LSC videos (composition engine)
   └→ Logs analytics events (product_view, video_play)
   ↓
4. Places Order
   ├→ Selects products + variants
   ├→ Adds notes/allergy info
   ├→ Confirms order
   └→ Order created in DB
   ↓
5. Receives Order Status Updates (Realtime)
   ├→ Supabase Realtime notifications
   └→ Restaurant sees order immediately

Admin Updates Menu:
1. Admin edits product
   ↓
2. API update received
   ↓
3. Database updated
   ↓
4. Supabase Realtime broadcasts change
   ↓
5. All customers see updated menu instantly
```

### Security Boundaries

```
┌──────────────────────────────────────────────────────┐
│              Security Isolation Layers               │
└──────────────────────────────────────────────────────┘

Layer 1: Authentication Boundary
├── Public URLs: Landing page, public menus
├── Protected URLs: Admin dashboards, order history
└── Requires: Valid JWT token

Layer 2: Tenant Isolation Boundary
├── User can only see own tenant's data
├── RLS policies enforce at database level
├── Every query filtered by tenant_id
└── No cross-tenant data access possible

Layer 3: Permission Boundary
├── User's role determines accessible actions
├── Permissions checked on every operation
├── Feature gating based on plan
└── Audit logged for compliance

Layer 4: Resource Boundary
├── Product belongs to restaurant
├── Order belongs to restaurant
├── Analytics isolated per tenant
└── User can only manage own team
```

---

## CONCLUSION

This architecture provides:

1. **Scalability:** Multi-tenant design scales to thousands of restaurants
2. **Flexibility:** Template system allows customization without code changes
3. **Accessibility:** LSC integration from day one with modular, cost-effective approach
4. **Security:** Database-level isolation ensures no data leakage
5. **Extensibility:** Foundation prepared for future features (KDS, mobile app, AI)
6. **Business Alignment:** Plans and feature gating support multiple price tiers
7. **Compliance:** Audit trails, data retention policies, encryption

The 24-week roadmap balances speed to market with solid engineering, delivering a production-ready MVP that serves as foundation for long-term platform growth.
