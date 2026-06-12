# VISUALSC MVP Validation - 10 Core Questions Answered

## Question 1: What Functionalities Are Obligatory for First 3 Restaurants?

### Absolute Essentials ✅

**For Customers (Public Menu):**
1. **View menu by product** (text + image, minimum friction)
2. **See allergens** (visual icons, non-negotiable for accessibility)
3. **Place order** (simple form: pick products, add notes, confirm)
4. **Order confirmation** (receipt with order number)
5. **LSC video for 3-5 hero products** (proof of concept)

**For Restaurants (Admin):**
1. **Login** (email + password only)
2. **View pending orders** (simple list with timestamps)
3. **Mark order status** (pending → ready)
4. **Edit menu** (add/edit/delete products, simple form)
5. **View today's metrics** (orders count, revenue, QR scans estimate)

**For VISUALSC (Operations):**
1. **Create restaurant accounts** (form with email, name, colors)
2. **Send login links** (email integration)
3. **Generate QR codes** (simple tool)
4. **View all orders** (dashboard)
5. **Manage restaurants** (suspend/archive)

**Infrastructure:**
1. **Database** (restaurants, products, orders, LSC videos)
2. **Authentication** (Supabase Auth)
3. **File storage** (Supabase Storage for images/videos)
4. **Email** (SendGrid or similar)
5. **Hosting** (Vercel for frontend, Railway/Render for backend)

### Total Scope
- **5 API endpoints** (not 50)
- **4 database tables** (not 15)
- **3 frontend pages** (public menu, admin dashboard, super admin)
- **No**: roles, permissions, billing, features gating, complex workflows

---

## Question 2: What Functionalities Can Be Eliminated Temporarily?

### Defer to Version 1.1 ❌

**Authentication & Access:**
- ❌ Multi-role system (owner/manager/staff/kitchen)
- ❌ Complex permissions matrix
- ❌ 2FA, SSO, SAML
- ❌ Session management beyond simple JWT
- ❌ Audit logging (manual tracking is fine)

**Menu Management:**
- ❌ Product variants (size, temperature, etc.)
- ❌ Product modifiers (extra, without, etc.)
- ❌ Bulk import/export (manual entry only)
- ❌ Categories (put all products in one feed)
- ❌ Ingredients management (mentioned in description only)
- ❌ Advanced allergen management (simple list only)

**Ordering:**
- ❌ Order history for customers (don't track)
- ❌ Customer accounts/login
- ❌ Order modification after placement
- ❌ Custom preparation notes (use notes field)
- ❌ Special requests workflow
- ❌ Table number/seating
- ❌ Payment processing (restaurants collect cash)

**LSC:**
- ❌ Composition engine (no auto-combinations)
- ❌ Self-service video upload by restaurants
- ❌ Multiple LSC videos per product
- ❌ Custom LSC per restaurant
- ❌ Accessibility scoring

**Templates:**
- ❌ Multiple templates (one hardcoded)
- ❌ No-code template builder
- ❌ Customizable layouts
- ❌ Font customization
- ❌ Component library

**Business:**
- ❌ Billing/invoicing (manual spreadsheet)
- ❌ Plans and feature gating
- ❌ Stripe integration
- ❌ Subscription management
- ❌ Usage tracking for overage

**Operations:**
- ❌ Kitchen Display System
- ❌ Multiple locations
- ❌ Staff scheduling
- ❌ Inventory management
- ❌ Integration with POS

**Analytics:**
- ❌ Advanced dashboards
- ❌ Trend analysis
- ❌ Cohort analysis
- ❌ Real-time tracking
- ❌ Export functionality

**Infrastructure:**
- ❌ Row-Level Security (RLS) complex policies
- ❌ Real-time synchronization
- ❌ Advanced caching
- ❌ CDN optimization
- ❌ Global deployment

---

## Question 3: What Functionalities Can Be Simulated Manually?

### VISUALSC Team Does This Manually ⚙️

**For Restaurants:**

1. **Menu Creation** (1-2 hours per restaurant)
   - Restaurant provides menu (photo, Excel, or verbal)
   - VISUALSC team enters 50 products into system
   - Restaurant sees live menu without self-service

2. **Menu Updates** (10-15 min per update)
   - Restaurant calls/WhatsApp: "Add cappuccino"
   - VISUALSC team adds product + image
   - Restaurant sees update within 30 minutes

3. **Order Notifications** (manual email)
   - Customer places order
   - Email sent to restaurant (no real-time dashboard notification)
   - Restaurant checks dashboard manually

4. **Logo/Color Upload** (VISUALSC team does it)
   - Restaurant sends logo image + color codes
   - VISUALSC team uploads and configures
   - Restaurant doesn't have self-service uploader

5. **LSC Video Recording & Editing** (VISUALSC team, 3-5 hours per restaurant)
   - VISUALSC team records LSC videos
   - Edit and optimize
   - Upload to platform
   - Restaurants can't edit

**For Customers:**

1. **QR Code Generation**
   - VISUALSC team uses free QR tool
   - Prints and physically places in restaurant
   - No self-service QR generation

2. **Order Tracking** (manual spreadsheet)
   - VISUALSC team logs orders
   - Weekly report emailed to restaurant
   - No real-time dashboard for customers

3. **Support/Help** (manual WhatsApp/email)
   - Customers ask questions via WhatsApp
   - VISUALSC team responds
   - No chatbot

**For Super Admin:**

1. **Billing** (spreadsheet + manual invoicing)
   - Track orders/revenue in Google Sheets
   - Send monthly invoice via email
   - Manual payment collection
   - No automation

2. **Account Creation** (manual form)
   - Restaurants apply via form
   - VISUALSC team creates account manually
   - Send setup email manually

3. **Onboarding** (phone calls + Zoom)
   - 30-min discovery call per restaurant
   - Explain how system works
   - Train staff via video call
   - Not self-service

4. **Data Analysis** (manual review)
   - Export orders from database
   - Create charts in Excel
   - Send weekly report
   - No automated dashboards

---

## Question 4: What Should NOT Be Developed Yet?

### Explicitly Don't Build 🚫

**AI/Automation:**
- ❌ AI-generated LSC (avatars, TTS-to-sign)
- ❌ Automatic order routing
- ❌ Predictive inventory
- ❌ Recommendation engine
- ❌ Chatbot support

**Advanced Features:**
- ❌ Kitchen Display System
- ❌ Table management
- ❌ Staff scheduling
- ❌ Delivery management
- ❌ Reservation system

**Integrations:**
- ❌ POS integration
- ❌ Accounting software connection
- ❌ SMS/push notifications
- ❌ Social media integration
- ❌ Payment gateway integration

**Scaling Infrastructure:**
- ❌ Global CDN
- ❌ Advanced caching layer
- ❌ Microservices architecture
- ❌ Message queues
- ❌ Database sharding

**B2B Features:**
- ❌ White-label option
- ❌ API for third parties
- ❌ Multi-tenant domain routing
- ❌ Custom branding for resellers
- ❌ Admin API

**Advanced Analytics:**
- ❌ Machine learning models
- ❌ Predictive analytics
- ❌ Cohort analysis
- ❌ Attribution modeling
- ❌ Funnel analysis

**The Philosophy:** If it can wait until you have 10+ customers, it waits.

---

## Question 5: MVP Design - 3 Restaurants, 50 Products, 1 Admin

### Simplified Architecture

```
STACK:

Frontend:
├── React or Next.js (minimal complexity)
├── Tailwind CSS (pre-built components)
├── React Router (simple routing)
└── fetch API (no additional libraries)

Backend:
├── Node.js + Express (or Python/Flask)
├── PostgreSQL (or SQLite if super simple)
├── Supabase Auth (pre-built)
└── Supabase Storage (for files)

Database (4 tables only):

restaurants
├── id (uuid)
├── name
├── slug (for public URL)
├── admin_email
├── password_hash
├── logo_url
├── color_primary
├── color_accent
├── welcome_message
└── created_at

products
├── id (uuid)
├── restaurant_id
├── name
├── description
├── price
├── image_url
├── category
├── allergen_ids (JSON array)
├── status (active/inactive)
├── hero_product (boolean)
└── created_at

allergens
├── id (uuid)
├── name
├── icon_url (emoji or SVG)
└── color

orders
├── id (uuid)
├── restaurant_id
├── items (JSON: [{product_id, qty}])
├── status (pending/ready)
├── notes
├── created_at
└── updated_at

lsc_videos
├── id (uuid)
├── product_id (nullable)
├── title
├── video_url
└── category (welcome/product)
```

### Three Interfaces

**1. Public Menu (Customer)**

```
GET /:slug
├── Header (logo, restaurant name)
├── Welcome video
├── Two buttons: Traditional | LSC Menu
├── Menu display (grid or list)
├── Order form
└── Confirmation page
```

**2. Admin Dashboard (Restaurant)**

```
GET /admin (requires login)
├── Orders list (today, sortable by time)
│   ├── Order # | Items | Status dropdown | Time
│   └── Mark as "Ready" button
├── Menu link
│   ├── Add product form
│   ├── Edit product form
│   └── Product list (50 items)
└── Metrics
    ├── Orders today (count)
    ├── Revenue today
    └── QR scans estimate
```

**3. Super Admin (VISUALSC)**

```
GET /admin/visualsc (internal)
├── Restaurants list
│   ├── Name | Orders | Revenue | QR scans | Status
│   └── Create new restaurant
├── All orders across all restaurants
├── Quick metrics
│   ├── Total restaurants
│   ├── Total orders
│   └── Total revenue
└── Tools
    └── QR code generator
```

### API Endpoints (5 total)

```
POST   /api/auth/login              → Authenticate restaurant
GET    /:slug                       → Get restaurant menu (public)
GET    /api/products/:restaurant_id → Get products list
POST   /api/orders                  → Create order
GET    /api/orders/:restaurant_id   → Get orders (for admin)
```

### No Complex Features

- ❌ No permissions system (1 admin per restaurant)
- ❌ No RLS policies (simple tenant_id filtering)
- ❌ No real-time (page refresh needed)
- ❌ No advanced caching
- ❌ No complex state management (use React hooks)

---

## Question 6: Concierge MVP Design (VISUALSC Does the Work)

### Concept: Restaurant Operators Don't Manage Their Own Menu

**Model:** VISUALSC is full-service for MVP

**Pricing:** $0 for first month, then $75/month

**What VISUALSC Provides:**
- Menu entry (we input 50 products from their menu)
- Photography (we take menu photos)
- LSC videos (we film 3-5 hero product videos)
- Support (we manage all operations)
- Updates (restaurants call us, we update)
- Order fulfillment (we monitor orders, notify restaurants)

**What Restaurant Provides:**
- Menu (physical or digital)
- Photos (or we photograph)
- Staff time for LSC filming (30-60 min)
- Feedback (weekly calls)
- Cash payments (manual collection)

### Onboarding Process (Concierge)

**Week 1:**
1. **Discovery Call (30 min)**
   - Understand restaurant concept
   - Get menu documentation
   - Identify 5 hero products
   - Collect brand info (colors, logo)

2. **Menu Entry (2 hours)**
   - VISUALSC enters 50 products
   - Write descriptions
   - Collect allergen info
   - Prepare product images

3. **Setup (1 hour)**
   - Create restaurant account
   - Configure colors/logo
   - Generate QR codes
   - Print materials

4. **LSC Filming (3-5 hours)**
   - VISUALSC team brings videographer
   - Record 3-5 LSC videos
   - Edit and upload

**Week 2:**
- Go live
- Train staff via WhatsApp video
- Monitor first orders
- Hotfix any issues

### Support Model (Concierge)

**Daily:**
- VISUALSC checks dashboard
- Sends email alert for new orders
- Restaurant checks email and fulfills order
- VISUALSC monitors for issues

**Weekly:**
- 15-min call with restaurant manager
- Collect feedback
- Answer questions
- Plan next menu updates

**Monthly:**
- Invoice for service ($75/month)
- Review metrics
- Plan optimizations

### Advantages of Concierge MVP

1. **Low barrier for restaurants** (no tech skills needed)
2. **High quality** (VISUALSC controls experience)
3. **Easier to pivot** (if model breaks, pivot easily)
4. **Closer to customers** (direct relationships, instant feedback)
5. **De-risks tech** (can change UI/backend without affecting restaurants)
6. **Generates revenue fast** (month 1 even if beta)
7. **Perfect for validation** (learning what matters)

### Transition Plan (Weeks 13-16)

As business grows, transition from Concierge to Self-Service:

```
Month 1-3: Concierge
├── VISUALSC handles everything
├── 3 restaurants (manual)
└── Revenue: $75 × 3 = $225/month

Month 4-6: Hybrid
├── New restaurants onboard to self-service
├── Existing 3 stay on concierge (support them)
├── Total 10 restaurants (7 self-service, 3 concierge)
└── Revenue: $75 × 3 + $99 × 7 = $918/month

Month 7+: Self-Service
├── Wind down concierge model
├── All new customers on self-service
├── Existing customers migrate (or keep concierge at premium)
└── Revenue: $99 × 20+ = $2000+/month
```

---

## Question 7: How to Validate Core Hypotheses

### The 5 Core Hypotheses

**1. Market Hypothesis: Deaf customers will use digital menus with LSC**

**Validation Method:**
- Visit 3 restaurants during typical operating hours
- Observe 10+ deaf customers using menu
- Measure: % choosing LSC vs traditional menu
- Target: 30%+ choose LSC

**Timeline:** Week 2 (immediately after going live)

**Sample Size:** Minimum 30 interactions per restaurant

**Questions to Ask:**
- "Did you understand what each product is?"
- "How confident are you in your order?"
- "Would you order from this again?"
- "What would make this better?"

**Success Criteria:**
- 30%+ choose LSC menu option
- 50%+ of LSC users watch at least one video
- 80%+ understand what they're ordering
- No negative feedback from deaf community

**Failure Scenario:**
- < 10% choose LSC (UX or content problem)
- Videos confusing (need better production)
- Deaf community negative (need different approach)

---

**2. Adoption Hypothesis: Restaurants will use system daily**

**Validation Method:**
- Track restaurant admin logins daily
- Track menu updates weekly
- Measure order response time
- Track support tickets

**Timeline:** Week 3-4

**Dashboard Metrics:**
```
Daily tracking (spreadsheet):
Day 1: Restaurant A logged in ✓, B logged in ✓, C not yet
Day 2: A logged in ✓, B logged in ✓, C logged in ✓
...
Week 1 Summary: A: 5/7 days, B: 6/7 days, C: 3/7 days
```

**Success Criteria:**
- 100% login rate on day 1 (orders coming in)
- 80%+ average daily logins week 1-2
- At least 1 menu update per restaurant per week
- Orders fulfilled within 30 min

**Failure Scenario:**
- < 50% daily adoption (need more support)
- No menu updates (not engaged)
- Orders piling up unfulfilled (not using system)

---

**3. Economics Hypothesis: Restaurants will pay $50-100/month**

**Validation Method:**
- Ask directly in week 1 (don't wait for invoice)
- Offer "first month free, then $75/month"
- Track willingness in discovery call
- At month 1 end: send invoice, measure acceptance

**Timeline:** Ongoing, critical decision at month 1

**Questions to Ask:**
- "If this works well, would you pay $50-100/month?" (week 1)
- "Does the ROI justify the cost?" (week 3)
- "What would change your mind?" (ongoing)

**Success Criteria:**
- 100% of pilots willing to commit at signup
- 100% pay invoice on time at month 1
- 100% willing to renew at month 2

**Failure Scenario:**
- Hesitation about payment (too expensive)
- Willingness but no actual commitment (talk vs action)
- Non-payment (customer doesn't see value)

---

**4. Retention Hypothesis: Restaurants will stay (low churn)**

**Validation Method:**
- Measure month-to-month renewals
- Track satisfaction (NPS, interviews)
- Monitor usage trends
- Collect feedback

**Timeline:** Month 1-2 (early indicator)

**Metric:**
```
Month 1 End:
├── 3 restaurants invited, 3 accepted free month
├── Revenue: $0 (free)
└── Churn risk: TBD

Month 2 Start:
├── 3 restaurants offered paid plan ($75/month)
├── 3/3 willing to pay = 100% churn rate = 0%
├── Revenue: $225
└── Churn risk: LOW if they committed

Month 3 Analysis:
├── Still using daily? → Will renew
├── Neglected dashboard? → May churn
├── Asked for new features? → Will stay
└── No engagement? → Will churn
```

**Success Criteria:**
- 100% of month 1 restaurants willing to pay month 2
- 80%+ of month 2-3 restaurants renew month 4

**Failure Scenario:**
- Churn > 50% (product doesn't stick)
- Declining usage over time (novelty wearing off)
- Support burden increasing (not self-sufficient)

---

**5. Accessibility Hypothesis: LSC improves order accuracy & satisfaction**

**Validation Method:**
- One-on-one interviews (5-10 deaf customers per restaurant)
- Manual observation (visit restaurants, watch usage)
- Collect feedback through restaurant staff
- Measure order accuracy

**Timeline:** Week 2-3

**Questions to Ask Customers:**
1. "Did you understand the menu?" (target: 80%+ yes)
2. "Did you get what you expected?" (target: 90%+ yes)
3. "Would you order from here again?" (target: 80%+ yes)
4. "What was confusing?" (identify specific issues)
5. "What helped you understand?" (identify what works)

**Questions to Ask Restaurants:**
1. "Did orders have wrong items?" (count mistakes)
2. "Did customers ask for clarification?" (measure confusion)
3. "Did deaf customers seem comfortable?" (qualitative)
4. "Any issues with the ordering process?" (identify friction)

**Success Criteria:**
- 80%+ customers report understanding menu
- Order accuracy same or better than traditional menu
- No negative deaf community feedback
- Restaurants report smooth experience with deaf customers

**Failure Scenario:**
- LSC videos confusing (wrong content)
- Customers prefer traditional menu (UX problem)
- Accuracy goes down (too complex flow)
- Deaf community criticism (cultural issue)

---

### Data Collection (Low-Tech)

**Quantitative:**
- Spreadsheet tracking (orders, QR scans, logins)
- Google Analytics on public menu
- Manual counting of LSC video views

**Qualitative:**
- WhatsApp feedback from restaurants
- Email from customers
- In-person observation notes
- Weekly interview notes

**Example Tracking Sheet:**

```
VALIDATION_METRICS.xlsx

DEAF CUSTOMER USAGE:
Date | Restaurant | LSC % | Traditional % | Videos Watched | Avg Watch Time
1/15 | Rest A | 25% | 75% | 12 | 45s
1/16 | Rest A | 28% | 72% | 15 | 52s
1/17 | Rest B | 35% | 65% | 8 | 38s
...

RESTAURANT ADOPTION:
Date | Rest A Logins | Rest B Logins | Rest C Logins | Menu Updates
1/15 | Y | Y | N | A: 1, B: 0, C: 0
1/16 | Y | Y | Y | A: 0, B: 1, C: 0
...

REVENUE & ECONOMICS:
Month | Restaurant | Willing to Pay | Actual Payment | Churn Risk
1 | Rest A | Yes | N/A (free) | LOW
1 | Rest B | Yes | N/A (free) | MEDIUM
1 | Rest C | Maybe | N/A (free) | HIGH
2 | Rest A | Yes | $75 paid | LOW
...
```

---

## Question 8: 4-Week Roadmap (Not 24 Weeks)

### Week 1: Foundation & Outreach

**Days 1-2: Planning & Setup**
- [ ] Team kickoff (15 min: roles, daily standup time)
- [ ] Database schema finalized
- [ ] API endpoint list written
- [ ] Frontend page list created
- [ ] Infrastructure setup (dev environment)

**Days 3-5: Backend Foundation**
- [ ] PostgreSQL database created (4 tables)
- [ ] Supabase Auth configured
- [ ] 3 API endpoints working (login, get products, create order)
- [ ] Email integration setup (Sendgrid)
- [ ] Error tracking setup (Sentry, free tier)

**Days 3-5: Frontend Foundation**
- [ ] React project setup
- [ ] Routing structure done
- [ ] Authentication flow working (login page)
- [ ] Layout components (header, footer, sidebar)
- [ ] Basic styling (Tailwind)

**Days 2-5: Outreach & LSC**
- [ ] Contact 10 pilot restaurants (pitch)
- [ ] Confirm 3 committed (verbal agreement)
- [ ] Scout LSC interpreter + videographer
- [ ] Contract videographer ($1000)
- [ ] Plan LSC shoot schedule

**Deliverable:** Working API, login system, 3 restaurants committed, videographer booked

**Owner:**
- Backend: 1 engineer (full-time)
- Frontend: 1 engineer (full-time)
- Operations: You (CEO), part-time

---

### Week 2: Public Menu & LSC Videos

**Days 1-2: Public Menu UI**
- [ ] Public menu page layout (`/:slug`)
- [ ] Product grid/list component
- [ ] Product detail modal
- [ ] Allergen badge display
- [ ] Category filtering
- [ ] LSC vs Traditional menu toggle

**Days 3-5: Order Flow**
- [ ] Order form component
- [ ] Order confirmation page
- [ ] Order success page with number
- [ ] Email to restaurant when order placed
- [ ] Get orders API working

**Days 1-2: Restaurant Setup**
- [ ] Create 3 restaurant accounts (database entry)
- [ ] Setup logos and colors (manually upload)
- [ ] Generate QR codes (online tool, print)
- [ ] Create test orders to verify flow

**Days 1-5: LSC Videos**
- [ ] Day 1: Videographer scouts restaurants
- [ ] Days 2-4: Film 3-5 LSC videos per restaurant (12-15 videos total)
- [ ] Days 3-5: Begin editing
- [ ] Upload to Supabase Storage (in parallel)

**Days 3-5: Integration Testing**
- [ ] Test order placement → restaurant receives email
- [ ] Test product display → renders correctly
- [ ] Test allergens → display correctly
- [ ] Test QR code → links to correct restaurant
- [ ] Test mobile view (basic responsive)

**Deliverable:** Public menus live, 3 restaurants can see their products, LSC videos produced, first orders accepted

**Owner:**
- Frontend: 1 engineer (finish menu UI)
- Backend: 1 engineer (finish order integration)
- Content: Videographer + You (oversee video production)
- Operations: You (train restaurants on ordering)

---

### Week 3: Admin Dashboard & Go-Live

**Days 1-2: Admin Dashboard**
- [ ] Admin login page (secured)
- [ ] Orders list (simple table)
- [ ] Mark order as "Ready" button
- [ ] Add product form
- [ ] Product list view
- [ ] Edit product form
- [ ] Delete product
- [ ] Basic metrics (orders today, revenue today, QR estimate)

**Days 3-5: LSC Menu View**
- [ ] Separate LSC menu UI
- [ ] Hero products prominent (large tiles)
- [ ] Video player for each hero product
- [ ] Simplified ordering flow
- [ ] LSC-specific welcome message

**Days 1-5: Final Testing & Launch**
- [ ] QA: All features end-to-end
- [ ] Test: Order placement flow
- [ ] Test: Admin dashboard
- [ ] Test: LSC video playback
- [ ] Fix bugs (prioritize critical)
- [ ] Staff training (30-min video calls)
- [ ] Soft launch (invite first restaurant)

**Days 3-5: Monitoring & Hotfixes**
- [ ] Monitor orders
- [ ] Respond to support issues
- [ ] Fix critical bugs
- [ ] Collect initial feedback

**Deliverable:** All 3 restaurants live, receiving real orders, admin dashboard functional, LSC menu working

**Owner:**
- Frontend: Finish & test admin dashboard
- Backend: Support & hotfixes
- Operations: Training, monitoring, support

---

### Week 4: Validation & Decision

**Days 1-3: Data Collection & Analysis**
- [ ] Interview 10+ deaf customers (How did you find menu? Understand? Satisfaction?)
- [ ] Analyze metrics (LSC adoption %, traditional adoption %, order completion %)
- [ ] Track restaurant logins (adoption %)
- [ ] Collect feedback from restaurant managers
- [ ] Email to all asking: "Would you pay $75/month?"
- [ ] Track: Yes, Maybe, No responses

**Days 2-4: Optimization & Bug Fixes**
- [ ] Fix any critical issues from live week
- [ ] Optimize if performance problems
- [ ] Improve UX based on feedback
- [ ] Re-test after changes

**Days 4-5: Decision & Documentation**
- [ ] Collect all metrics into spreadsheet
- [ ] Write decision memo (Go, Pivot, Stop)
- [ ] Create summary for team
- [ ] Document what worked, what didn't
- [ ] Plan next phase if Go

**Days 5-7: Wrap-Up & Planning**
- [ ] Thank you calls with restaurants
- [ ] Ask for month 2 commitment (paid)
- [ ] Weekly check-in schedule for month 2
- [ ] Plan iterations based on feedback

**Deliverable:** Complete validation data, decision made (Go/Pivot/Stop), team clarity on next steps

**Owner:**
- PM/CEO: Lead validation, make decision
- Ops: Data collection, customer interviews
- Eng: Support, iteration

---

## Week-by-Week Milestone Checklist

| Week | Checkpoint | Go/No-Go |
|------|-----------|----------|
| **1** | API working, restaurants committed, videos booked | Must go |
| **2** | Public menus live, LSC videos done, first orders | Must go |
| **3** | 3 restaurants live, dashboards working | Must go |
| **4** | Validation data collected, decision made | Choose path |

---

## 4-Week Sprint Format

**Daily Standup (15 min, 9 AM):**
- What did you finish yesterday?
- What's blocking you today?
- What's your goal for today?

**Daily Check-In (end of day, async on Slack):**
- Brief update on progress
- Any blockers
- Tomorrow's plan

**Weekly Planning (Monday, 30 min):**
- Review sprint goals
- Adjust if needed
- Confirm priorities
- Address blockers

**Weekly Demo (Friday, 30 min):**
- Show working features
- Celebrate progress
- Collect feedback
- Plan next week

---

## Resource Allocation (4 Weeks)

| Role | Week 1 | Week 2 | Week 3 | Week 4 |
|------|--------|--------|--------|--------|
| Backend Eng | 100% | 80% | 60% | 40% |
| Frontend Eng | 100% | 100% | 100% | 60% |
| Operations/CEO | 40% | 50% | 60% | 100% |
| Content (videographer) | 0% | 100% | 20% | 0% |

---

## Budget Timeline (4 Weeks)

| Week | Category | Cost | Notes |
|------|----------|------|-------|
| 1 | Videographer booking | $1,000 | Deposit, 50% upfront |
| 1-2 | Infrastructure setup | $200 | Supabase, SendGrid, domains |
| 2 | Video production | $4,000 | 12-15 videos, $300 each |
| 2-3 | Deaf consultant review | $500 | 8 hours × $75/hr |
| 3-4 | Misc (tools, testing) | $200 | |
| **Total** | | **$6,000** | Plus engineering ~$8K |

---

## Success Criteria (End of Week 4)

### Must Have (All Must Be True)

1. ✅ **3 restaurants live** with real products and orders
2. ✅ **30%+ of customers chose LSC menu** (adoption signal)
3. ✅ **80%+ restaurant daily login rate** (engagement signal)
4. ✅ **3/3 restaurants willing to pay** $75/month (commercial signal)
5. ✅ **Zero lost orders or major outages** (reliability signal)
6. ✅ **Positive deaf community feedback** (mission signal)

### Nice to Have (Not Required)

- 50+ total orders across 3 restaurants
- $0.30+ average order value
- < 5 support tickets per restaurant
- > 80% customers understood menu
- > 1 menu update per restaurant

---

## Decision Framework (End of Week 4)

### Green Light ✅ (Proceed to Scale)
- All 6 success criteria met
- > 30% LSC adoption
- All restaurants willing to pay month 2
- No show-stoppers identified
- **Decision: Hire team, raise capital, go to 24-week MVP**

### Yellow Light 🟡 (Keep Experimenting)
- Most criteria met, but some concerns
- Maybe 20% LSC adoption (lower than hoped)
- 2/3 restaurants ready to pay
- Identified specific things to improve
- **Decision: Keep operating 3 restaurants, refine model, test 1-2 new restaurants**

### Red Light ❌ (Pivot or Stop)
- < 10% LSC adoption (fundamental problem)
- < 50% restaurant daily engagement (GTM issue)
- > 1 lost order (reliability catastrophe)
- No willingness to pay (economic problem)
- Negative deaf community feedback
- **Decision: Pivot product/GTM or stop**

---

## One Week Extension Option

If at end of week 4 you're close but not quite ready:

**Week 5 Only:**
- Continue operating 3 restaurants
- Add 1-2 new restaurants (test repeatability)
- Refine based on learning
- Re-evaluate decision at end of week 5
- Makes decision with more confidence

Only do this if:
- Week 4 metrics are 80%+ of targets
- Clear path to fix remaining issues
- Team agrees it's worth one more week

---

## 4-Week MVP vs 24-Week MVP: Final Comparison

| Dimension | 4-Week | 24-Week |
|-----------|--------|---------|
| Timeline | 4 weeks | 24 weeks |
| Budget | $14-16K | $120-150K |
| Team | 2 engineers | 5-7 people |
| Scope | Concierge MVP | Full SaaS |
| Validation | Product-market fit | Production ready |
| Risk | Learn fast | Build wrong product |
| Next | Scale or pivot | Already optimized |

**Recommendation:** Start with 4-week MVP. If successful, graduate to 24-week vision.

---

## Next Actions (If You Approve)

**This Week:**
- [ ] Decide: 4-week MVP or 24-week MVP?
- [ ] If 4-week: commit to timeline and budget
- [ ] If 24-week: accept longer timeline and higher risk

**If 4-Week MVP Approved:**
- [ ] Hire/assign backend engineer
- [ ] Hire/assign frontend engineer
- [ ] You: lead as PM/operations
- [ ] Week 1 kickoff: Monday

**Timeline:** 4 weeks to product-market fit validation
