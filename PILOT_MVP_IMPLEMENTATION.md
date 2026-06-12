# VISUALSC Pilot MVP - LSC Coffee Club

## Objective

Build a **fully functional pilot** for LSC Coffee Club (real customer, real users) in 2-3 weeks.

**Not a demo. Real working software with real Supabase backend.**

---

## What Gets Built (Real ✅)

### 1. VISUALSC Super Admin Interface
- [ ] Login as super admin
- [ ] Create restaurant (LSC Coffee Club)
- [ ] Create admin user (demo@visualsc.co)
- [ ] View all restaurants
- [ ] Activate/deactivate restaurants
- [ ] Basic analytics dashboard

### 2. Restaurant Admin Dashboard
- [ ] Login with restaurant credentials
- [ ] Manage categories (5-6 for coffee shop)
- [ ] Manage products (20-30 coffee items)
- [ ] Upload product images
- [ ] Add ingredients
- [ ] Add allergens
- [ ] Set prices
- [ ] View daily orders
- [ ] See basic metrics (orders, revenue, scans)
- [ ] Upload/manage LSC videos

### 3. Customer Experience (Public Menu)
- [ ] Public URL: `visualsc.co/lsc-coffee-club` (or similar)
- [ ] QR code to public menu
- [ ] **Traditional Menu View**
  - Categories (Espresso, Bebidas Frías, Postres, etc.)
  - Products with images
  - Prices
  - Allergen badges
  - Add to order button
- [ ] **Accessible LSC Menu View**
  - Large buttons
  - Visual hierarchy
  - LSC videos for hero products
  - Simplified navigation
  - Allergen warnings prominent
- [ ] Order placement
- [ ] Order confirmation

### 4. LSC Module
- [ ] Video upload (admin)
- [ ] Associate videos to products
- [ ] Upload welcome video
- [ ] Video player in customer experience
- [ ] Video management (edit, delete, reorder)

### 5. Real-Time Updates
- [ ] Admin updates product → Customer sees immediately
- [ ] No page refresh needed
- [ ] Works via Supabase Realtime

### 6. Database (Real Supabase)
- restaurants (LSC Coffee Club)
- products (20-30 coffee items)
- categories (Espresso, Bebidas Frías, etc.)
- allergens (Leche, Gluten, etc.)
- lsc_videos (3-5 sample videos)
- orders (sample data)
- users (admin user)

---

## What Does NOT Get Built ❌

- ❌ Stripe/Billing
- ❌ Multiple restaurants (only LSC Coffee Club for now)
- ❌ Multiple locations
- ❌ Kitchen Display System
- ❌ Waiter module
- ❌ Staff management (complex)
- ❌ Advanced analytics
- ❌ Bulk import/export
- ❌ Template system (one hardcoded design)
- ❌ Composition engine (full LSC videos only)
- ❌ Mobile app (web-first)
- ❌ Payment processing
- ❌ Advanced security (RLS complex, basic filtering only)
- ❌ Multi-language support
- ❌ API for third parties

---

## Implementation Timeline

### Week 1: Backend & Database Setup

**Days 1-2: Database Design**
- [ ] Create Supabase project
- [ ] Design minimal schema (6 tables)
- [ ] Setup authentication
- [ ] Setup storage for images/videos

**Days 3-5: Super Admin API**
- [ ] Create restaurant endpoint
- [ ] Create user endpoint
- [ ] Create category endpoint
- [ ] Create product endpoint
- [ ] Create allergen endpoint
- [ ] Setup Supabase Realtime

**Tasks:**
- Backend: Setup Express server + Supabase client
- Database: Create tables and relationships
- Auth: Implement JWT tokens

**Owner:** Backend Engineer (40 hours)

---

### Week 2: Admin Dashboard & LSC

**Days 1-2: Restaurant Admin UI**
- [ ] Build login page
- [ ] Build dashboard skeleton
- [ ] Build product list page
- [ ] Build product form (create/edit)
- [ ] Build category manager
- [ ] Build metrics display

**Days 3-5: LSC Module**
- [ ] Build video upload page
- [ ] Build video management UI
- [ ] Video player component
- [ ] Associate videos to products
- [ ] Welcome video setup

**Tasks:**
- Frontend: Admin dashboard pages
- Backend: Support endpoints for admin
- Upload: Setup video/image uploads
- LSC: Video association logic

**Owner:** Frontend Engineer + Backend Support (40 hours)

---

### Week 3: Customer Experience & Real-Time

**Days 1-2: Public Menu**
- [ ] Build public menu page (`/:slug`)
- [ ] Traditional menu view (grid, filtering)
- [ ] Product detail modal
- [ ] Category navigation
- [ ] Allergen display
- [ ] Order form

**Days 3-4: LSC Menu**
- [ ] LSC menu UI (visual-first design)
- [ ] Hero products with video
- [ ] Simplified ordering
- [ ] Accessibility optimizations

**Days 5-7: Real-Time & Testing**
- [ ] Setup Supabase Realtime
- [ ] Admin changes product → Customer sees instantly
- [ ] Test all flows end-to-end
- [ ] Fix bugs
- [ ] QA complete

**Tasks:**
- Frontend: Public menu pages
- Backend: Real-time endpoints
- Integration: Test real-time updates
- QA: Full end-to-end testing

**Owner:** Frontend Engineer + Backend (50 hours)

---

## Database Schema (Minimal)

```sql
restaurants (LSC Coffee Club)
├── id: uuid
├── name: "LSC Coffee Club"
├── slug: "lsc-coffee-club"
├── admin_email: "demo@visualsc.co"
├── status: "active"
├── logo_url: null
├── created_at: timestamp

users (Admin)
├── id: uuid
├── restaurant_id: uuid → restaurants
├── email: "demo@visualsc.co"
├── password_hash: bcrypt("123456")
├── role: "admin"
├── created_at: timestamp

categories
├── id: uuid
├── restaurant_id: uuid → restaurants
├── name: "Espresso", "Bebidas Frías", etc.
├── display_order: 1, 2, 3...
├── created_at: timestamp

products
├── id: uuid
├── restaurant_id: uuid → restaurants
├── category_id: uuid → categories
├── name: "Café Americano"
├── description: "Espresso con agua caliente"
├── price: 5000
├── image_url: "s3://..."
├── status: "active"
├── created_at: timestamp

product_allergens
├── product_id: uuid → products
├── allergen_id: uuid → allergens

allergens
├── id: uuid
├── name: "Leche", "Gluten", etc.
├── icon: emoji or svg_url
├── color: hex

lsc_videos
├── id: uuid
├── restaurant_id: uuid → restaurants
├── product_id: uuid → products (nullable for welcome)
├── title: "Café Americano en LSC"
├── video_url: "s3://..."
├── category: "product" | "welcome" | "instruction"
├── created_at: timestamp

orders (Sample data only, no real orders yet)
├── id: uuid
├── restaurant_id: uuid → restaurants
├── items: json [{product_id, qty}]
├── status: "pending" | "ready"
├── created_at: timestamp
```

---

## API Endpoints (Minimal)

### Authentication
- POST `/api/auth/login` → Get JWT token
- POST `/api/auth/register` → Not used (admin created by VISUALSC)

### Products
- GET `/api/products/:restaurant_id` → List products (public)
- GET `/api/products/:restaurant_id/admin` → Requires auth
- POST `/api/products` → Create (admin only)
- PATCH `/api/products/:id` → Update (admin only)
- DELETE `/api/products/:id` → Delete (admin only)

### Categories
- GET `/api/categories/:restaurant_id` → List categories
- POST `/api/categories` → Create (admin only)
- PATCH `/api/categories/:id` → Update (admin only)

### LSC Videos
- GET `/api/lsc-videos/:restaurant_id` → List videos
- POST `/api/lsc-videos` → Upload (admin only)
- DELETE `/api/lsc-videos/:id` → Delete (admin only)

### Orders
- POST `/api/orders` → Create order (public)
- GET `/api/orders/:restaurant_id` → List orders (admin only)
- PATCH `/api/orders/:id` → Update status (admin only)

### Restaurants
- POST `/api/restaurants` → Create (super admin only)
- GET `/api/restaurants/:id` → Get details

### Realtime
- Supabase Realtime channel: `products:restaurant_id`
  - Triggers when product changes
  - Frontend listens and re-renders

---

## Three UIs to Build

### 1. Super Admin (`/admin/visualsc`)
```
├── Dashboard
│   ├── Create restaurant form
│   ├── Restaurants list
│   │   ├── LSC Coffee Club | Orders: 0 | Revenue: $0 | Status: Active
│   │   └── Edit | Suspend | Delete
│   └── Quick metrics
│       ├── Total restaurants: 1
│       ├── Total orders: 0
│       └── Total revenue: $0
```

### 2. Restaurant Admin (`/admin`)
```
├── Sidebar
│   ├── Dashboard
│   ├── Productos (Products)
│   ├── Categorías (Categories)
│   ├── Videos LSC
│   └── Pedidos (Orders)
│
├── Dashboard
│   ├── Orders today: 0
│   ├── Revenue today: $0
│   ├── QR scans: 0
│   └── Quick links
│
├── Productos
│   ├── Add product button
│   ├── Products list
│   │   ├── Café Americano | $5,000 | Edit | Delete
│   │   └── ...
│   └── Product form (name, description, price, image, allergens)
│
├── Categorías
│   ├── Add category button
│   ├── Categories list
│   │   ├── Espresso | 5 products | Edit | Delete
│   │   └── ...
│
├── Videos LSC
│   ├── Upload video button
│   ├── Videos list
│   │   ├── Café Americano (video) | Duration: 1:30 | Edit | Delete
│   │   ├── Welcome video | Duration: 2:00 | Edit
│   │   └── ...
│   └── Associate video to product
│
└── Pedidos
    ├── Orders list
    │   ├── #001 | Café Americano × 2 | Status: Pending | 10:30 AM
    │   └── ...
    └── Mark as Ready button
```

### 3. Customer Experience (`/lsc-coffee-club`)
```
┌────────────────────────────┐
│   LSC Coffee Club          │
│   [Logo]                   │
├────────────────────────────┤
│ Welcome to our menu!       │
│ Choose your experience:    │
│                            │
│ [👁️ Ver menú tradicional]   │
│ [🤟 Ver menú en LSC]       │
└────────────────────────────┘

TRADITIONAL MENU VIEW:
├── Header (logo, name)
├── Categories (tabs or sidebar)
│   ├── ☕ Espresso (5 items)
│   ├── 🧊 Bebidas Frías (4 items)
│   └── 🍰 Postres (3 items)
├── Products grid
│   ├── [Image] Café Americano
│   │       $5,000
│   │       ⚠️ Contiene: Leche
│   │       [Pedir]
│   └── ...
└── Order confirmation

LSC MENU VIEW:
├── Welcome video
├── Hero products (large tiles)
│   ├── [Video] Café Americano
│   │       $5,000
│   │       [Pedir]
│   └── ...
├── All products (grid)
└── Simplified ordering
```

---

## Demo Data (LSC Coffee Club)

### Categories
1. ☕ Espresso
2. 🧊 Bebidas Frías
3. 🍰 Postres
4. 🥐 Desayunos
5. 🧁 Repostería
6. 🍵 Té

### Products (20-25 items)

**Espresso (5):**
- Café Americano - $5,000 - Contains: Leche (optional)
- Espresso - $3,000 - Contains: Leche (optional)
- Cappuccino - $6,000 - Contains: Leche
- Latte - $6,500 - Contains: Leche
- Macchiato - $5,500 - Contains: Leche

**Bebidas Frías (4):**
- Café Helado - $6,000 - Contains: Leche (optional)
- Café Frappé - $7,000 - Contains: Leche, Azúcar
- Agua Fría - $2,000 - Contains: Nada
- Jugo Natural - $4,000 - Allergen: Ninguno

**Postres (3):**
- Brownie - $8,000 - Contains: Leche, Gluten
- Cheesecake - $9,000 - Contains: Leche, Huevo, Gluten
- Fruta - $5,000 - Allergen: Ninguno (choose fruit)

**Desayunos (4):**
- Arepa con Queso - $6,000 - Contains: Leche, Gluten
- Tostadas - $5,000 - Contains: Gluten
- Avena - $4,000 - Contains: Gluten
- Yogur con Granola - $6,500 - Contains: Leche, Gluten, Nueces

**Repostería (3):**
- Croissant - $4,500 - Contains: Leche, Gluten, Huevo
- Donut - $3,500 - Contains: Leche, Gluten, Huevo, Azúcar
- Muffin - $5,000 - Contains: Leche, Gluten, Huevo

**Té (2):**
- Té Negro - $3,000 - Allergen: Ninguno
- Té Verde - $3,000 - Allergen: Ninguno

### Allergens
1. 🥛 Leche (Milk)
2. 🌾 Gluten
3. 🥜 Maní (Peanuts)
4. 🌳 Nueces (Tree Nuts)
5. 🥚 Huevo (Eggs)
6. 🦐 Mariscos (Shellfish) - Less common for coffee shop
7. ⚠️ Azúcar Agregada (Added Sugar)

### LSC Videos (Sample)
1. **Welcome Video** (2:00) - "Bienvenido a LSC Coffee Club"
2. **Product: Café Americano** (1:30) - "Espresso con agua caliente"
3. **Product: Cappuccino** (1:45) - "Espresso con leche espumosa"
4. **Allergen Info** (2:00) - "Cómo saber si tiene alérgenos"
5. **How to Order** (1:30) - "Cómo hacer tu pedido"

---

## Real-Time Implementation

**When admin updates product:**
```typescript
// Admin updates product
PATCH /api/products/:id → "Café Americano" price $6,000

// Database updated
UPDATE products SET price = 6000 WHERE id = ':id'

// Supabase broadcasts change
BROADCAST TO channel 'products:restaurant_id'
  {type: 'UPDATE', product_id: ':id', changes: {price: 6000}}

// Customer's browser listens
supabase.channel('products:restaurant_id').on('*', (payload) => {
  setProducts(prev => 
    prev.map(p => p.id === payload.product_id 
      ? {...p, ...payload.changes} 
      : p
    )
  )
})

// Customer sees change immediately (no refresh)
```

---

## Testing Checklist

### Admin Flows
- [ ] Super admin can create restaurant
- [ ] Admin can login with email/password
- [ ] Admin can add product
- [ ] Admin can add allergen to product
- [ ] Admin can upload product image
- [ ] Admin can delete product
- [ ] Admin can edit product (change price, description)
- [ ] Admin can add category
- [ ] Admin can upload LSC video
- [ ] Admin can associate video to product
- [ ] Admin can see orders list

### Customer Flows
- [ ] Open public menu via URL
- [ ] View traditional menu (products, prices, allergens)
- [ ] Click LSC menu button
- [ ] View LSC menu (large buttons, videos)
- [ ] Watch welcome video
- [ ] Watch product LSC video
- [ ] Place order
- [ ] See order confirmation

### Real-Time
- [ ] Admin updates product price
- [ ] Customer sees price change instantly (no refresh)
- [ ] Admin updates product name
- [ ] Customer sees name change instantly
- [ ] Admin adds new product
- [ ] Customer sees new product instantly
- [ ] Admin deletes product
- [ ] Customer sees product removed instantly

### Browser Compatibility
- [ ] Chrome (desktop)
- [ ] Safari (desktop)
- [ ] Firefox (desktop)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## Deployment

### Frontend
- Deploy to Vercel
- URL: `visualsc.co` or `demo.visualsc.co`

### Backend
- Deploy to Railway or Render
- API: `api.visualsc.co` or `demo-api.visualsc.co`

### Database
- Supabase (managed PostgreSQL)
- Storage: Supabase Storage (for images/videos)

### Video Hosting
- Supabase Storage (simple)
- Or: Cloudinary (free tier, better for video)

---

## Success Criteria

### Week 1 End
- [ ] Database designed and deployed
- [ ] Super admin can create restaurant
- [ ] Restaurant admin can login
- [ ] API endpoints working

### Week 2 End
- [ ] Restaurant admin dashboard complete
- [ ] Can manage products and categories
- [ ] Can upload LSC videos
- [ ] LSC Coffee Club has 20 products configured

### Week 3 End
- [ ] Customer can view public menu
- [ ] LSC menu functional with videos
- [ ] Real-time updates working
- [ ] QR code generates and works
- [ ] Ready for pilot testing with real users

---

## Team & Resources

### Team
- 1 Backend Engineer (40 hours)
- 1 Frontend Engineer (40 hours)
- 1 PM/CEO (20 hours, managing, testing, business decisions)

**Total: ~100 engineer-hours, 3 weeks**

### Budget
- Supabase (free tier): $0
- Vercel (free tier): $0
- Railway/Render (free tier): $0
- Domain: $12 (visualsc.co)
- Cloudinary (optional, video hosting): $0 (free tier)

**Total: ~$12**

### Infrastructure
- Supabase: PostgreSQL + Auth + Storage (all free)
- Vercel: Frontend hosting (free)
- Railway: Backend hosting (free tier)
- Cloudinary: Video hosting (free)

---

## Success = Real Pilot

**Goal:** By end of week 3, LSC Coffee Club is LIVE with real customers.

**Not a demo. Real working software with:**
- Real database (Supabase)
- Real authentication (LSC Coffee Club admin can login)
- Real products (20+ configured)
- Real LSC videos (3-5 recorded)
- Real customer experience (customers can view and order)
- Real-time updates (admin changes product → customer sees instantly)

**Then:** Test with real deaf customers for 2 weeks, iterate based on feedback.

---

## What's NOT Production-Ready

- ❌ Not scaled for 1000s of users
- ❌ Not optimized for performance
- ❌ Not hardened for security
- ❌ No payment processing
- ❌ No advanced analytics
- ❌ No backup strategy yet
- ❌ No mobile app
- ❌ No API documentation (not needed yet)

**But it's real. It works. It can be tested with customers.**

---

## Next Steps

1. **Setup Supabase** (30 min) → Create project, get connection string
2. **Create database** (1 hour) → Run schema
3. **Create restaurant** (30 min) → LSC Coffee Club in database
4. **Create admin user** (30 min) → demo@visualsc.co
5. **Start building** → Follow timeline above

---

**Timeline: 3 weeks from today, LSC Coffee Club is live and testable.**

**Goal: Real pilot, real customers, real learning.**
