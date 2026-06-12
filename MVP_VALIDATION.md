# VISUALSC - Lean 4-Week MVP for Market Validation

## Executive Summary

Instead of 24 weeks → 4 weeks to market validation.  
Instead of 50 engineer-weeks → ~12 engineer-weeks.  
Instead of "production-ready" → "proven product-market fit".

**Goal:** Get 3 restaurants live and generating orders, prove customers (both deaf and hearing) use LSC menu, validate willingness to pay.

---

## 1. MUST-HAVE FEATURES (For 3 Pilot Restaurants)

### Absolutely Required ✅

**Public Menu Experience (Customer-Facing):**
- [ ] Public restaurant URL (`/:slug`)
- [ ] Product listing (text + image)
- [ ] Product detail page
- [ ] Allergen badges (visual icons)
- [ ] Order placement (simple form)
- [ ] Order confirmation
- [ ] **LSC video for 3-5 hero products** (proof of concept)

**Restaurant Admin (Minimal):**
- [ ] Login with email/password
- [ ] Upload/edit menu items (simple form)
- [ ] See pending orders
- [ ] Mark order status (pending → ready)
- [ ] View sales metrics (basic: total orders, revenue)

**Super Admin (Manual Operations):**
- [ ] Create restaurant account (form)
- [ ] Send login link via email
- [ ] Generate QR code
- [ ] View all orders across restaurants
- [ ] See platform metrics

**LSC Content:**
- [ ] Pre-recorded LSC videos for 5-10 common products
- [ ] Video player on public menu
- [ ] Welcome video (how to navigate)

**No Authentication Complexity:**
- [ ] Email + password login (no SSO, no 2FA, no roles/permissions complexity)
- [ ] Fixed restaurant admin role (no multi-role system yet)

**No Template System Yet:**
- [ ] One hardcoded beautiful template
- [ ] Restaurant can upload logo only
- [ ] Restaurant can customize colors (simple color picker, 2-3 colors)
- [ ] Not configurable by non-developers

---

## 2. WHAT TO ELIMINATE TEMPORARILY

### Remove These (Defer to V1.1) ❌

**From Architecture:**
- ❌ Multi-role system (owner, manager, staff, kitchen) → Only 1 admin per restaurant
- ❌ Row-Level Security (RLS) complex policies → Simple tenant_id filtering
- ❌ Advanced permission matrix → Not needed for 1 admin
- ❌ Feature gating by plan → All restaurants get same features
- ❌ Billing/Stripe integration → Manual invoicing (email)
- ❌ Multiple subscription plans → Fixed $99/month (if charging)
- ❌ Kitchen Display System → Email notifications instead
- ❌ Multiple locations → Single location per restaurant only
- ❌ Bulk import/export → Manual entry only
- ❌ Advanced analytics (detailed dashboards) → Basic counts only
- ❌ Composition engine complexity → Pre-composed LSC videos only
- ❌ Template customization engine → One template, logo + colors only
- ❌ Real-time synchronization → Page refresh needed
- ❌ Advanced security (audit logging, encryption) → Basic password hashing
- ❌ Webhook integrations → Not needed for 3 restaurants
- ❌ CDN/caching → Use Supabase defaults
- ❌ Mobile optimization (initially) → Focus on desktop for ordering

**From Scope:**
- ❌ Ingredients management
- ❌ Product variants/modifiers
- ❌ Customized order notes
- ❌ Order history for customers
- ❌ Customer accounts/login
- ❌ Order tracking by customer
- ❌ Payment processing (QR only, no upsell)
- ❌ Email notifications (show on dashboard instead)
- ❌ SMS alerts
- ❌ Advanced allergen management

---

## 3. WHAT TO SIMULATE/FAKE (Manual Operations)

### VISUALSC Team Does This Manually ⚙️

**Initial Setup:**
- [ ] Create restaurant accounts manually (no self-signup)
- [ ] Generate QR codes by hand (using a QR generator tool)
- [ ] Setup restaurant URLs manually
- [ ] Upload initial menu items for restaurants (copy/paste CSV)
- [ ] Record and upload initial LSC videos for each restaurant

**Ongoing Operations:**
- [ ] Monitor orders in shared dashboard
- [ ] Send notifications to restaurants about new orders (email)
- [ ] Resolve order issues manually (email customer)
- [ ] Track payment manually (spreadsheet, manual invoicing)
- [ ] Answer all support requests (no chatbot)
- [ ] Manually create account when new restaurant signs up

**Data Entry:**
- [ ] Restaurant staff calls/emails menu updates to VISUALSC team
- [ ] VISUALSC team updates products in database manually
- [ ] No self-service menu editing (restaurants request changes)

**LSC Content:**
- [ ] VISUALSC team records initial LSC videos for each restaurant
- [ ] No self-service LSC upload yet
- [ ] Restaurants can't edit LSC videos
- [ ] VISUALSC handles all LSC production

**Analytics & Reporting:**
- [ ] Manual weekly reports emailed to restaurants
- [ ] VISUALSC team analyzes metrics by hand
- [ ] No real-time dashboards for restaurants

---

## 4. WHAT NOT TO BUILD YET (Different from Deferring)

### Don't Even Design These 🚫

- ❌ **AI/Avatar LSC** - Not for MVP
- ❌ **Multi-location management** - Plan for later
- ❌ **POS system integration** - Not needed for 3 restaurants
- ❌ **Advanced workflow automation** - Manual is fine
- ❌ **Advanced security features** - Not attack target yet
- ❌ **Scalability optimizations** - Will redesign for scale
- ❌ **Mobile app** - Web works for now
- ❌ **API for third parties** - Focus on core product
- ❌ **A/B testing framework** - Monitor manually
- ❌ **Advanced logging/monitoring** - Errors are okay to discover manually

---

## 5. LEAN MVP DESIGN (3 Restaurants, 50 Products, 1 Admin)

### Architecture Simplification

```
VISUALSC Lean MVP Stack:

Frontend:
├── Next.js (or React + Vite)
├── Tailwind CSS
├── React Router
└── Fetch API (no React Query)

Backend:
├── Node.js + Express (or similar)
├── SQLite or simple PostgreSQL
├── Supabase Auth (already setup)
└── Supabase Storage (for images/videos)

Database:
├── restaurants (id, name, slug, logo_url, color1, color2)
├── products (id, restaurant_id, name, price, image_url, allergen_ids)
├── allergens (id, name, icon_url, color)
├── orders (id, restaurant_id, items_json, status, created_at)
└── lsc_videos (id, product_id, video_url, is_hero)

NO:
├── Complex RLS policies
├── User roles table
├── Permissions matrix
├── Audit logs
├── Billing tables
└── Analytics event logging
```

### Data Model (Minimal)

```sql
restaurants {
  id: uuid
  name: string
  slug: string (unique, for public URL)
  admin_email: string
  password_hash: string
  logo_url: string (optional)
  color_primary: string (default: #1F3F70)
  color_accent: string (default: #F0B233)
  welcome_message: string
  created_at: timestamp
}

products {
  id: uuid
  restaurant_id: uuid
  name: string
  description: text
  price: decimal
  image_url: string
  category: string (hardcoded: "Cafés", "Bebidas", "Postres", etc.)
  status: enum (active, inactive)
  allergen_ids: array[uuid] (JSON)
  hero_product: boolean (for LSC video)
  created_at: timestamp
}

allergens {
  id: uuid
  name: string (Leche, Gluten, etc.)
  icon_url: string
  color: string
}

orders {
  id: uuid
  restaurant_id: uuid
  items: json [{product_id, quantity}]
  status: enum (pending, ready, completed)
  notes: text
  created_at: timestamp
  updated_at: timestamp
}

lsc_videos {
  id: uuid
  product_id: uuid (can be null for general videos)
  title: string
  video_url: string
  video_duration: integer
  category: enum (welcome, instructions, product)
  created_at: timestamp
}
```

### Three Separate Interfaces

**1. Public Menu (Customer):** `/:slug`
```
Header
├── Restaurant logo
├── Restaurant name
└── Welcome message

Hero Section
├── Welcome LSC video
├── Two buttons: "Ver menú" | "Ver menú accesible LSC"

Menu Display (Traditional)
├── Products in grid
├── Image + name + price + allergens
├── "Pedir ahora" button

Menu Display (LSC)
├── Large buttons/icons
├── Hero products with LSC video
├── Simplified ordering flow

Order Form (Minimal)
├── Select products
├── Add notes (optional)
├── "Confirmar pedido" button
└── Confirmation with order #

Footer
├── Restaurant info
└── "¿Preguntas?" link to WhatsApp/email
```

**2. Restaurant Admin:** `/admin`
```
Dashboard
├── Orders today (simple list)
│   └── Order# | Items | Status dropdown | Created time
├── Menu link
│   └── Add product form
│   └── Edit product form
│   └── Products list
└── Metrics
    ├── Total orders today
    ├── Total revenue today
    ├── QR scans (estimate from orders)
    └── LSC menu views (manual count)
```

**3. Super Admin (Manual):** `/admin/visualsc`
```
Dashboard
├── Restaurants list (3 items)
│   └── Name | Orders today | Revenue | View menu link
├── Orders across all restaurants
├── Quick metrics
│   ├── Total orders
│   ├── Total revenue
│   └── Restaurants active
└── QR code generator tool
```

---

## 6. CONCIERGE MVP (VISUALSC Does the Work)

### Perfect for First 3 Restaurants

**Initial Onboarding (2-3 hours per restaurant):**

1. **Discovery Call (30 min)**
   - Restaurant manager shows menu
   - Take photos of menu items
   - Clarify allergens
   - Identify "hero products" for LSC videos
   - Get restaurant info (address, phone, email, branding)

2. **Video Production (3-5 hours)**
   - Film 3-5 LSC videos for hero products
   - Film welcome video
   - Quick turnaround (same day if possible)

3. **Setup (1-2 hours)**
   - Create restaurant account
   - Upload menu items (VISUALSC team enters 50 products)
   - Setup colors and logo
   - Upload LSC videos
   - Generate and print QR codes
   - Test public menu

4. **Launch (30 min)**
   - Go live at agreed time
   - Train restaurant staff (WhatsApp video call)
   - Monitor first orders closely

**Ongoing Support (30 min/day per 3 restaurants):**
- Monitor orders in shared dashboard
- Email notifications to restaurants
- Handle menu changes (restaurants email, VISUALSC updates)
- Respond to customer questions (via email/WhatsApp)
- Weekly check-in call

**Revenue Collection (Manual):**
- Monthly invoice via email
- Payment via bank transfer or cash
- Spreadsheet tracking

---

## 7. HOW TO VALIDATE CORE HYPOTHESES

### Hypothesis 1: Restaurants Will Pay for LSC Menus

**Validation Metric:** Willingness to commit to 3-month pilot

**Method:**
- Approach 20 restaurants
- Target: Specialty coffee, high-traffic cafés, social-mission restaurants
- Pitch: "Free for first month, then $50-100/month if you're happy"
- Success: Get 3 paid commitments

**Success Criteria:** 3+ restaurants willing to pay after month 1

---

### Hypothesis 2: Deaf Customers Will Use LSC Menu

**Validation Metric:** LSC menu adoption and engagement

**Measurement:**
- Track QR code scans: direct link to LSC menu vs traditional menu
- Track LSC video views: how many customers watch each video
- Track LSC menu orders: what % of orders come from LSC menu
- Manual observation: visit restaurants, watch deaf customers use menu

**Success Criteria:**
- > 30% of customers scan QR code
- > 50% of QR scanners choose LSC menu
- > 20% completion rate (customers who start finish order)
- Deaf customers spend > 30 seconds browsing menu

---

### Hypothesis 3: LSC Videos Improve Understanding

**Validation Metric:** Order accuracy and customer satisfaction

**Measurement:**
- Manual customer interviews: "Did you understand the menu?" (target 80%+ "yes")
- Order accuracy: how many orders have "wrong" items/modifications (target < 5%)
- Complaint tracking: any complaints about product description
- Video completion: how many customers watch full videos (target > 50%)

**Success Criteria:**
- 80%+ of LSC customers report high satisfaction
- Order accuracy same or better than traditional menu
- > 50% of LSC viewers complete video watching

---

### Hypothesis 4: Restaurants Will Adopt Daily

**Validation Metric:** Active usage and product updates

**Measurement:**
- Daily login by restaurant admins
- Menu updates frequency (how often they change products)
- Order fulfillment speed (time from order to "ready")
- Staff engagement: do they use dashboard or need email reminders

**Success Criteria:**
- All 3 restaurants logging in 5+ days/week
- At least 1 restaurant updating menu weekly
- Orders fulfilled within 15-30 minutes of placement

---

### Hypothesis 5: Business Model is Sound

**Validation Metric:** Revenue per restaurant and churn

**Measurement:**
- Average revenue per restaurant (ARPU)
- Customer acquisition cost (CAC) = total spending ÷ 3 restaurants
- Lifetime value (LTV) = monthly revenue × expected months
- Churn rate: would they renew after month 3?

**Success Criteria:**
- ARPU > $200/month (after free month)
- CAC < $500 (manual operations)
- LTV:CAC ratio > 2:1
- 100% renewal rate (all 3 commit to month 2+)

---

### How to Actually Collect Data

**Quantitative:**
- Spreadsheet tracking orders, QR scans, revenue
- Google Analytics on public menu (simple setup, free)
- Manual counting: LSC video views, traditional menu views

**Qualitative:**
- WhatsApp/email feedback from restaurants
- One-on-one video interviews with 3-5 deaf customers per restaurant
- Observation visits: watch customers use menu in-person
- Notes from support interactions

**Low-tech but Effective:**
- QR code link tracking (use bit.ly or TinyURL with analytics)
- Unique QR codes per restaurant (can see which restaurant generated order)
- Manual note-taking during customer interactions
- Photo/video documentation of actual usage

---

## 8. 4-WEEK ROADMAP (Instead of 24 Weeks)

### Week 1: Foundation & Setup

**Goal:** Database + basic frontend structure

**Backend (1 engineer):**
- [ ] Setup PostgreSQL with 4 tables (restaurants, products, orders, lsc_videos)
- [ ] Simple Node/Express server with 5 endpoints:
  - POST /api/restaurants (create, super admin only)
  - POST /api/login (restaurant login)
  - GET /api/products/:restaurant_id
  - POST /api/orders (create order)
  - GET /api/orders/:restaurant_id (view orders)
- [ ] Email sending setup (Sendgrid or similar)
- [ ] Supabase Storage configuration

**Frontend (1 engineer):**
- [ ] React skeleton with routing
- [ ] Layout components (header, footer, sidebar)
- [ ] Authentication form (login page)
- [ ] Basic styling (Tailwind, use existing design)

**Super Admin (1 engineer part-time):**
- [ ] Simple admin interface for creating restaurants
- [ ] Order viewing dashboard
- [ ] QR code generator tool

**LSC Content (1 content person):**
- [ ] Scout 3 pilot restaurants
- [ ] Plan LSC video shoots for each
- [ ] Script 3-5 videos per restaurant

**Deliverable:** Working login, basic API, database ready

---

### Week 2: Public Menu & Ordering

**Goal:** Customers can see menu and place orders

**Frontend (1.5 engineers):**
- [ ] Public menu page (`/:slug`)
  - [ ] Product grid/list
  - [ ] Product detail modal
  - [ ] Allergen display (icons + badges)
  - [ ] Category filtering
  - [ ] Search
- [ ] Order form
  - [ ] Select products
  - [ ] Add notes
  - [ ] Confirm order
  - [ ] Order confirmation page
- [ ] LSC menu view (parallel UI)
  - [ ] Large buttons
  - [ ] Hero products prominent
  - [ ] Simplified flow

**Backend (1 engineer):**
- [ ] GET /:slug endpoint
- [ ] GET products endpoint with filtering
- [ ] POST orders endpoint
- [ ] Order notification email

**LSC Content:**
- [ ] Record first batch of videos (3-5 per restaurant)
- [ ] Edit and compress for web
- [ ] Upload to Supabase Storage

**Deliverable:** Public menu live, 5+ orders per restaurant

---

### Week 3: Restaurant Admin + LSC Integration

**Goal:** Restaurants can manage orders, view metrics; LSC videos live

**Frontend (1 engineer):**
- [ ] Restaurant admin dashboard
  - [ ] Orders list (pending, ready, completed)
  - [ ] Mark order as ready
  - [ ] Basic metrics (today's orders, today's revenue)
- [ ] Menu editor (simple form)
  - [ ] Add product
  - [ ] Edit product
  - [ ] Delete product
  - [ ] Product list
- [ ] Restaurant settings
  - [ ] Upload logo
  - [ ] Pick colors (2-3 pickers)
  - [ ] Edit welcome message

**Backend (1 engineer):**
- [ ] PATCH /api/orders/:id (mark ready)
- [ ] POST /api/products (add product)
- [ ] PATCH /api/products/:id (edit)
- [ ] DELETE /api/products/:id (soft delete)
- [ ] GET /api/restaurants/:id/dashboard (metrics)

**LSC Content:**
- [ ] Complete video production for all 3 restaurants
- [ ] Welcome video for each
- [ ] Upload all to Supabase

**Public Menu:**
- [ ] Integration of LSC videos on product pages
- [ ] Welcome video modal
- [ ] Video player UI

**Deliverable:** Restaurants can see orders, manage menu; LSC videos live

---

### Week 4: Polish, Testing & Launch

**Goal:** Production-ready, all 3 restaurants live simultaneously

**QA & Testing:**
- [ ] Test all flows end-to-end (order placement → restaurant receives)
- [ ] Test on mobile (basic responsive)
- [ ] Test edge cases (empty menu, no products, etc.)
- [ ] Security: test for basic injection/CSRF

**Operations & Deployment:**
- [ ] Deploy to production (Vercel for frontend, Railway/Render for backend)
- [ ] Setup error tracking (Sentry, basic)
- [ ] Setup monitoring/alerting (email on crashes)
- [ ] Database backup setup

**Documentation & Training:**
- [ ] Simple admin guide (5 pages, PDF)
- [ ] Customer FAQ (1 page, printed)
- [ ] Internal runbook for VISUALSC team
- [ ] Training videos for restaurant staff (5 min WhatsApp videos)

**Soft Launch (Days 1-2):**
- [ ] Invite 3 restaurants to beta
- [ ] Monitor closely (real-time support)
- [ ] Fix critical bugs immediately

**Public Launch (Day 3-5):**
- [ ] Announce in social media (Instagram, LinkedIn)
- [ ] Case studies: feature the 3 restaurants
- [ ] Press release/outreach

**Post-Launch (Week 4, Days 5-7):**
- [ ] Weekly check-in calls with each restaurant
- [ ] Collect feedback
- [ ] Track metrics
- [ ] Plan next iteration

**Deliverable:** 3 restaurants live, generating real orders, validated concept

---

## Week-by-Week Breakdown

| Week | Focus | Team | Deliverable |
|------|-------|------|-------------|
| 1 | Database & API | 2 eng | Backend working, login functional |
| 2 | Customer Experience | 2 eng + content | Public menu live, LSC videos done |
| 3 | Restaurant Admin | 2 eng | Admin dashboard, order management |
| 4 | Polish & Launch | 2 eng + QA | 3 restaurants live, monitoring setup |

**Total Engineering Effort:** ~60-80 hours (vs 500 hours in 24-week plan)  
**Total Timeline:** 4 weeks (vs 24 weeks)  
**Team Size:** 2-3 people (vs 5-7)  
**Budget:** $15K-25K (mostly content) (vs $80K-120K)

---

## 9. BIGGEST PRODUCT RISKS (Before Writing Code)

### Risk #1: Deaf Customers Won't Actually Use Digital Menus ⚠️ CRITICAL

**Risk:** Despite good intentions, deaf customers still prefer traditional menu or have accessibility issues with digital interface.

**Why it matters:** Core hypothesis is unvalidated. All other features irrelevant.

**Mitigation:**
- Test with 5+ deaf users in week 2 (before spending on more videos)
- Observe real usage in-person
- Ask: "Would you order from this menu?" not "Do you like it?"
- Have Plan B: paper menu with QR code backup

**Validation Timeline:** By end of Week 2

---

### Risk #2: Restaurants Won't Adopt the Technology ⚠️ CRITICAL

**Risk:** Restaurants like the concept but don't actually use platform daily (update menu, check orders).

**Why it matters:** If restaurants are passive, business model dies (can't scale without training intensive support).

**Mitigation:**
- Pick 3 tech-forward restaurants (younger owners, already use Instagram)
- Train extensively (1-on-1 call, not just email)
- Provide daily support (we check on them, not them checking system)
- Measure: > 80% login rate 5+ days/week
- Have Plan B: staff the restaurants with someone who enters orders

**Validation Timeline:** By end of Week 3

---

### Risk #3: Orders Will Be Wrong or Restaurants Will Lose Them ⚠️ MEDIUM

**Risk:** Order flow breaks down - customer places order, restaurant doesn't see it, or order gets lost.

**Why it matters:** One bad order = distrust, churn.

**Mitigation:**
- Redundant notifications: email + SMS + dashboard
- Order confirmation: restaurant must acknowledge
- Paper backup: print all orders as failsafe
- Monitor first 20 orders personally (VISUALSC team takes each order by phone, then matches to digital)

**Validation Timeline:** Week 2 (first order)

---

### Risk #4: LSC Content Will Be Low Quality or Misunderstood ⚠️ MEDIUM

**Risk:** Videos are too fast, too slow, unclear LSC, or products misrepresented.

**Why it matters:** Bad videos undermine entire concept.

**Mitigation:**
- Use professional LSC interpreter (not amateur)
- Test videos with 3-5 deaf people (target users, not translators)
- Show customers videos before order confirmation
- Ask: "Is this accurate?" not "Is this good?"
- Have fallback: detailed text descriptions

**Validation Timeline:** Week 1-2 (during production)

---

### Risk #5: Economics Won't Work (ARPU Too Low) ⚠️ HIGH

**Risk:** Restaurants can't afford > $100/month after accounting for our delivery costs.

**Why it matters:** Business model breaks even at small scale.

**Mitigation:**
- Price aggressively ($50/month to pilot, test willingness to pay $200+)
- Calculate CAC honestly: include your time (even though manual)
- Look for second-order benefits: "Do they order more because menu is better?"
- Plan B: B2B play (sell to restaurant groups, not individual restaurants)

**Validation Timeline:** Month 1 (after first month invoice)

---

### Risk #6: We'll Get Stuck in Concierge Hell ⚠️ HIGH

**Risk:** Manual operations don't scale. We're spending 10 hours/week supporting 3 restaurants.

**Why it matters:** Can't grow beyond 3-5 restaurants with manual model.

**Mitigation:**
- Track time spent per restaurant (target < 5 hours/week for 3)
- Identify what's manual and what must be automated for scale
- Don't solve scalability in MVP, but do identify the problem
- Have explicit discussion: "Will this work at 50 restaurants?"

**Validation Timeline:** Week 4 (after first week of live operations)

---

### Risk #7: Deaf Community Won't Trust Us ⚠️ MEDIUM

**Risk:** Deaf community sees another company exploiting accessibility + fails to deliver real value.

**Why it matters:** Reputation damage makes future hiring, partnerships, users impossible.

**Mitigation:**
- Hire deaf consultant (even for MVP) - $500-1000
- Have deaf person review all LSC videos
- Be transparent: "This is MVP, we're learning"
- Listen to feedback and iterate visibly
- Don't over-promise (no AI, no avatars, no magic)

**Validation Timeline:** Continuous (all 4 weeks)

---

### Risk #8: Product-Market Fit Is Illusion (Restaurants Are Polite) ⚠️ MEDIUM

**Risk:** Restaurants say "nice idea!" but wouldn't actually pay after free trial.

**Why it matters:** We optimize for wrong metric (user satisfaction instead of payment).

**Mitigation:**
- Ask about payment explicitly in week 1 (don't wait for month 1)
- Offer "free first month, then $50/month" not "free forever"
- Track: Do they actually renew?
- Watch behavior: Updates to menu? Staff engagement? Orders/week?
- Don't rely on NPS, track willingness to pay

**Validation Timeline:** By end of month 1

---

## Summary: Top 3 Biggest Risks

1. **Deaf customers won't use digital menu** (Validate week 2)
2. **Restaurants won't adopt daily** (Validate week 3)
3. **Manual operations don't scale** (Identify week 4)

If any of these fail → Pivot before writing more code.

---

## 10. VALIDATION PRIORITY: What to Prove First

### The Critical Path of Validation

```
Week 1: ✓ Tech works (database, API, login)
Week 2: ✓ DEAF CUSTOMERS USE MENU (most critical)
    ├── Test with 5+ deaf people
    ├── Measure: > 30% choose LSC menu
    └── Measure: > 50% watch LSC video
    
    If FAILS → Major pivot needed, revisit concept
    If PASSES → Continue

Week 3: ✓ RESTAURANTS WILL USE SYSTEM (second critical)
    ├── Measure: > 80% daily logins
    ├── Measure: Menu updates 1+ per week
    └── Measure: Orders fulfilled consistently
    
    If FAILS → Need different GTM (concierge forever?)
    If PASSES → Continue

Week 4: ✓ BUSINESS MODEL IS VIABLE (third critical)
    ├── Measure: ARPU > $100/month
    ├── Measure: CAC < $500
    └── Measure: Renewal rate = 100%
    
    If FAILS → May still have product, business problem
    If PASSES → Ready to scale
```

---

## Ranking: What to Validate First

### Priority 1: **LSC Menu Adoption** ⭐⭐⭐⭐⭐

**Why:** Core value proposition. If deaf customers don't use LSC menu, nothing else matters.

**How to test:**
- Visit restaurant with 5-10 deaf customers
- Have half use traditional menu, half use LSC menu
- Measure: Do LSC users complete order?
- Ask: "Would you use this again?"

**Must succeed:** Yes. If not, pivot to traditional-only or redesign UX.

**Timeline:** Week 2 (day 1 after LSC menu is live)

**Owner:** Product person + accessibility consultant

---

### Priority 2: **Restaurant Daily Adoption** ⭐⭐⭐⭐

**Why:** Determines if business can scale beyond concierge.

**How to test:**
- Login tracking (do they come back?)
- Update frequency (how often does menu change?)
- Support volume (do they need constant help?)
- Order fulfillment (are they responsive?)

**Must succeed:** 80%+ daily usage rate

**Timeline:** Week 3-4

**Owner:** Operations person

---

### Priority 3: **Willingness to Pay** ⭐⭐⭐

**Why:** Determines if model is viable.

**How to test:**
- Ask directly in week 1: "Would you pay $100/month?" (not week 4)
- Implement low pricing ($50/month) to test commitment
- See if they renew after free month
- Track: Do they fight price or accept happily?

**Must succeed:** 100% of pilot restaurants willing to pay by month 2

**Timeline:** Throughout, especially end of month 1

**Owner:** Sales/bizdev person

---

### Priority 4: **Deaf Community Trust** ⭐⭐

**Why:** Long-term brand and ability to grow in deaf market.

**How to test:**
- Hire deaf consultant to review
- Show videos to deaf community (not just target customers)
- Ask: "Does this help or hurt deaf representation?"
- Measure: Word-of-mouth feedback

**Must succeed:** Positive feedback, no criticism (or criticism we can address quickly)

**Timeline:** Weeks 1-4 (continuous)

**Owner:** Deaf consultant + CEO

---

## Decision Rules

### If LSC Menu Adoption Fails (Priority 1)

❌ **Decision:** Pivot before week 3
- Could mean: Traditional menu only (less exciting, but maybe viable)
- Could mean: Completely redesign LSC UX
- Could mean: Kill product, it's not solving a real problem

### If Restaurant Adoption Fails (Priority 2)

❌ **Decision:** Reconsider business model
- You have good product, but GTM is wrong
- Maybe B2B (sell to chains, not individual restaurants)
- Maybe need heavier support/concierge model
- Maybe restaurants aren't the right customer

### If Willingness to Pay Fails (Priority 3)

❌ **Decision:** Pivot to B2B or free model
- Product is good, but SaaS model doesn't work
- Could be non-profit play
- Could be white-label to restaurant groups

### If Community Trust Fails (Priority 4)

❌ **Decision:** Rebuild team/hiring
- You might have product-market fit, but wrong messenger
- Need deaf leadership early
- Need to rebuild brand carefully

---

## Simplified Success Criteria for 4-Week MVP

### By End of Week 2:
- [ ] Database functional, API working
- [ ] Public menu live with LSC videos
- [ ] 5+ deaf customers tested, 30%+ chose LSC menu
- [ ] First orders placed successfully

**Decision Point:** Kill if zero deaf customers choose LSC menu.

### By End of Week 3:
- [ ] Restaurant admin dashboard live
- [ ] 10+ orders per restaurant
- [ ] 3 restaurants all logging in daily (80%+ adoption)
- [ ] Zero major bugs or lost orders

**Decision Point:** Reconsider model if restaurants aren't engaging.

### By End of Week 4:
- [ ] 3 restaurants live, live to go again next month
- [ ] At least 1 menu update (restaurants using self-service)
- [ ] Total 50+ orders across platform
- [ ] All restaurants willing to commit for month 2

**Decision Point:** Ready to scale if all 3 conditions met.

---

## Core Metrics Dashboard (Week 4)

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Restaurants onboarded | 3 | ? | ? |
| Total orders | 50+ | ? | ? |
| Avg orders/restaurant | 16+ | ? | ? |
| LSC menu adoption rate | 30%+ | ? | ? |
| Traditional menu adoption rate | 70%+ | ? | ? |
| Deaf customer conversion (LSC) | 50%+ | ? | ? |
| Restaurant daily login rate | 80%+ | ? | ? |
| Order fulfillment time | < 30 min | ? | ? |
| Restaurants willing to pay | 100% (3/3) | ? | ? |
| Net Promoter Score (NPS) | 50+ | ? | ? |
| Support issues per restaurant | < 2/week | ? | ? |
| Staff competency score | 4/5 | ? | ? |

---

## What Happens Next (After 4 Weeks)

### Scenario A: All Green Lights ✅

**Decision:** Move to scale (hire team, productionize, raise capital)

**Next Phase:**
- 3 → 10 restaurants (8 weeks)
- Productionize manual operations (billing, onboarding, support)
- Build team (1 more eng, 1 operations person)
- Raise seed round based on validation data

### Scenario B: LSC Works, But Restaurant Adoption Is Slow 🟡

**Decision:** Keep LSC, change restaurant go-to-market

**Next Phase:**
- Double-down on deaf customer experience
- Shift to B2B (sell to restaurant chains, not individual owners)
- Or shift to concierge model (we partner with restaurant + handle operations)
- Or simplify restaurant experience (less admin, more VISUALSC support)

### Scenario C: Restaurant Adoption Great, LSC Doesn't Resonate ⚠️

**Decision:** Keep restaurant SaaS, deprioritize LSC

**Next Phase:**
- Build traditional menu system (simpler, no video complexity)
- Still accessible (allergens, descriptions, images)
- Sell as restaurant SaaS (competitive with Toast, etc.)
- LSC becomes future premium feature, not MVP feature

### Scenario D: Neither Works ❌

**Decision:** Pivot to something else or pause

**Options:**
- Go back to drawing board on customer/market fit
- Explore if different customer segment (corporate cafeterias, schools) works
- Explore if different geography (outside Colombia) has better fit
- Pause and regroup with new insights

---

## Budget Breakdown (4-Week MVP)

| Category | Cost | Notes |
|----------|------|-------|
| **Engineering** | $8,000 | 80 hours × $100/hr |
| **LSC Content** | $5,000 | 15-20 videos × $250-300 per video |
| **Infrastructure** | $500 | Supabase, storage, domain |
| **Tools & Services** | $1,000 | Analytics, email, video hosting |
| **Consultant (Deaf)** | $1,000 | 20 hours of feedback/review |
| **Total** | **$15,500** | |

**Comparison:**
- 24-week MVP: $80K-120K
- 4-week MVP: $15.5K
- **Savings: 87.5%**

**Assumption:** You do the PM/strategy work (not billed)

---

## Go / No-Go Decisions

### Green Light to Continue (All Must Be True):

1. ✅ At least 2 of 3 restaurants have 30%+ of orders from LSC menu
2. ✅ All 3 restaurants login 5+ days/week (adoption > 80%)
3. ✅ Zero orders lost or major issues
4. ✅ All 3 restaurants willing to pay $50-100/month
5. ✅ No negative feedback from deaf community (or quickly addressed)

### Red Light to Pivot (Any One of These):

1. ❌ Less than 10% of customers choose LSC menu (UX is barrier)
2. ❌ Less than 50% of restaurants logging in 3+ days/week (adoption failure)
3. ❌ More than 2 orders lost/mishandled (reliability failure)
4. ❌ No restaurants willing to pay (commercial failure)
5. ❌ Significant criticism from deaf community (mission failure)

---

## Conclusion

**The 4-week MVP is designed to answer one question:**

> "Is there a real market of restaurants willing to pay for accessible menus, AND real demand from deaf customers to use digital menus with sign language?"

**If the answer is YES to both:**
- You have product-market fit
- Proceed to scale

**If the answer is mixed:**
- Identify which part works
- Pivot the other part

**If the answer is NO:**
- You've learned invaluable lesson for $15.5K instead of $120K
- Explore other ideas with fresh eyes

**The point is not perfection. The point is speed and learning.**

---

## Implementation Checklist (Print This)

### Pre-Week 1:
- [ ] Identify 3 pilot restaurants (commitment confirmed)
- [ ] Scout deaf communities (identify 10+ potential testers)
- [ ] Hire LSC interpreter + videographer
- [ ] Setup dev environment (Next.js project, PostgreSQL)
- [ ] Domain + hosting ready to deploy

### Week 1 Launch:
- [ ] Database schema written
- [ ] Authentication working
- [ ] Basic API endpoints live
- [ ] LSC video production starts

### Week 2 Launch:
- [ ] Public menu pages live
- [ ] Ordering system functional
- [ ] LSC menu operational
- [ ] 5+ deaf users tested
- [ ] First real orders placed

### Week 3 Launch:
- [ ] Admin dashboard live
- [ ] All 3 restaurants onboarded
- [ ] Restaurant staff trained
- [ ] Supporting all live operations

### Week 4 Launch:
- [ ] Bug fixes complete
- [ ] Monitoring/alerts live
- [ ] Documentation done
- [ ] Weekly check-ins scheduled
- [ ] Data collection in place

### End of Week 4:
- [ ] All validation metrics collected
- [ ] Decision made (go/pivot/stop)
- [ ] Next phase planned

---

**You don't need perfect. You need real.**

*Get 3 restaurants live with real orders in 4 weeks.*  
*Learn what works.*  
*Then build the real company.*
