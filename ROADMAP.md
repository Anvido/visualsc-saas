# VISUALSC MVP - 24 Week Implementation Roadmap

## Overview

This document outlines the complete implementation plan to build VISUALSC from architecture to production-ready MVP in 24 weeks.

**Start Date:** Week 1  
**MVP Launch:** Week 24  
**Team Size (Recommended):** 5-7 people  
- 2-3 Backend Engineers
- 2 Frontend Engineers  
- 1 Product Manager
- 1 QA/DevOps Engineer

---

## Phase 1: Foundation (Weeks 1-4)

### Objective
Establish multi-tenant infrastructure, authentication, and core API foundation.

### Week 1: Database & Infrastructure Setup

**Tasks:**
- [ ] Setup Supabase project
- [ ] Design and create core schema (see ARCHITECTURE.md section 2.2)
- [ ] Setup Row-Level Security (RLS) policies
- [ ] Configure PostgREST API
- [ ] Setup database backups and recovery procedures
- [ ] Create migration scripts

**Deliverable:** Working PostgreSQL database with RLS, automated backups

**Owner:** Backend Lead

---

### Week 2: Authentication & User Management

**Tasks:**
- [ ] Implement Supabase Auth setup
- [ ] Create custom JWT implementation (if extending beyond Supabase)
- [ ] Build user registration API
- [ ] Build user login API
- [ ] Build password reset flow
- [ ] Create user roles table and assignment logic
- [ ] Implement permission checking middleware

**Deliverable:** Working authentication system with role-based access

**Owner:** Backend Lead

---

### Week 3: Restaurant Management API

**Tasks:**
- [ ] Create restaurants table schema
- [ ] Build restaurant CRUD APIs
- [ ] Implement restaurant status management
- [ ] Build plan assignment logic
- [ ] Create restaurant usage tracking
- [ ] Setup audit logging
- [ ] Create fixtures for testing

**Deliverable:** APIs for super admin to manage restaurants

**Owner:** Backend

---

### Week 4: Frontend Foundation & Navigation

**Tasks:**
- [ ] Setup React 18 + TypeScript project structure
- [ ] Create routing structure (React Router 6)
- [ ] Build main navigation components
- [ ] Create layout components (sidebar, navbar)
- [ ] Setup state management (Zustand)
- [ ] Setup environment configuration
- [ ] Create auth guard middleware
- [ ] Build error boundary component

**Deliverable:** Working frontend scaffold with authentication flow

**Owner:** Frontend Lead

---

## Phase 2: Core Admin Dashboard (Weeks 5-8)

### Objective
Enable restaurant admins to create and manage complete product catalog.

### Week 5: Products & Categories API

**Tasks:**
- [ ] Create products schema
- [ ] Create categories schema
- [ ] Build product CRUD APIs
- [ ] Build category CRUD APIs
- [ ] Implement soft deletes (status field)
- [ ] Create bulk product actions (duplicate, deactivate)
- [ ] Setup image storage in Supabase
- [ ] Create image upload handler

**Deliverable:** Product management APIs with image storage

**Owner:** Backend

---

### Week 6: Ingredients & Allergens

**Tasks:**
- [ ] Create allergens table (system-wide)
- [ ] Create ingredients table (per-restaurant)
- [ ] Build allergen CRUD
- [ ] Build ingredient CRUD
- [ ] Create product-allergen mapping
- [ ] Create allergen icons and styling
- [ ] Build allergen selector UI

**Deliverable:** Allergen management with visual indicators

**Owner:** Backend + Frontend

---

### Week 7: Bulk Import/Export

**Tasks:**
- [ ] Design Excel template format
- [ ] Build Excel import validator
- [ ] Build Excel import processor
- [ ] Create data mapping UI
- [ ] Build Excel export functionality
- [ ] Handle error reporting on import
- [ ] Create import history tracking

**Deliverable:** Full Excel import/export functionality

**Owner:** Backend + Frontend

---

### Week 8: Admin Dashboard UI & Analytics Events

**Tasks:**
- [ ] Build product management UI
- [ ] Build category management UI
- [ ] Create KPI dashboard cards
- [ ] Setup analytics event tracking
- [ ] Create event logging system
- [ ] Build basic charts (recharts)
- [ ] Optimize analytics queries

**Deliverable:** Complete admin dashboard with analytics tracking

**Owner:** Frontend

---

## Phase 3: Customer Experience - Traditional Menu (Weeks 9-12)

### Objective
Customers can browse menu and place orders via traditional text/image interface.

### Week 9: Public Menu APIs & Pages

**Tasks:**
- [ ] Create public restaurant URL structure (/:slug)
- [ ] Build public menu API (products with allergen info)
- [ ] Create restaurant detail endpoint
- [ ] Build category list endpoint
- [ ] Implement search functionality
- [ ] Setup caching strategy
- [ ] Create SEO metadata

**Deliverable:** Public APIs for menu access

**Owner:** Backend

---

### Week 10: Traditional Menu UI

**Tasks:**
- [ ] Build public menu page layout
- [ ] Create product list view
- [ ] Build product detail modal/page
- [ ] Implement category filtering
- [ ] Create search UI
- [ ] Build allergen display with icons
- [ ] Optimize images (lazy loading, responsive)

**Deliverable:** Beautiful traditional menu interface

**Owner:** Frontend

---

### Week 11: Order Placement & Tracking

**Tasks:**
- [ ] Create orders table schema
- [ ] Build order creation API
- [ ] Create order status update API
- [ ] Build order confirmation UI
- [ ] Create order history view
- [ ] Implement real-time order updates (Supabase Realtime)
- [ ] Build order status tracking UI

**Deliverable:** Functional ordering system

**Owner:** Backend + Frontend

---

### Week 12: Template System & Customization

**Tasks:**
- [ ] Design template configuration schema
- [ ] Create 4 default templates (HTML/CSS)
- [ ] Build template customization UI (color picker, asset upload)
- [ ] Create live preview system
- [ ] Build template assignment logic
- [ ] Implement template overrides system
- [ ] Create template responsive design

**Deliverable:** 4 working templates with customization

**Owner:** Frontend

---

## Phase 4: LSC Integration (Weeks 13-16)

### Objective
Implement Colombian Sign Language support with modular video library.

### Week 13: LSC Library Infrastructure

**Tasks:**
- [ ] Create LSC videos schema
- [ ] Setup Supabase Storage for videos
- [ ] Build video upload handler
- [ ] Create video metadata schema
- [ ] Build video tagging system
- [ ] Implement video categorization
- [ ] Create version control system

**Deliverable:** LSC video library infrastructure

**Owner:** Backend

---

### Week 14: Composition Engine

**Tasks:**
- [ ] Design composition rules schema
- [ ] Build composition rule creator
- [ ] Implement composition engine logic
- [ ] Create fallback handling
- [ ] Build composition preview system
- [ ] Create composition API
- [ ] Optimize video concatenation

**Deliverable:** Working composition engine for modular videos

**Owner:** Backend

---

### Week 15: LSC Video Management UI

**Tasks:**
- [ ] Build video upload UI
- [ ] Create video management interface
- [ ] Build video approval workflow
- [ ] Create video player component
- [ ] Implement HLS streaming setup
- [ ] Build video tagging UI
- [ ] Create version history UI

**Deliverable:** Complete LSC library management interface

**Owner:** Frontend

---

### Week 16: LSC Customer Experience

**Tasks:**
- [ ] Design LSC menu UI (visual-first, accessibility-focused)
- [ ] Create LSC menu layout (large buttons, icons)
- [ ] Build product view for LSC menu
- [ ] Implement composition video playback
- [ ] Create welcome video display
- [ ] Build LSC ordering flow
- [ ] Implement accessibility optimizations

**Deliverable:** Complete LSC menu experience for customers

**Owner:** Frontend

---

## Phase 5: Super Admin Dashboard (Weeks 17-20)

### Objective
VISUALSC team can manage all restaurants, users, and platform analytics.

### Week 17: Restaurant Management UI

**Tasks:**
- [ ] Build restaurant list view
- [ ] Create restaurant detail dashboard
- [ ] Build restaurant creation form
- [ ] Create plan assignment UI
- [ ] Build usage tracker display
- [ ] Implement suspend/activate UI
- [ ] Create restaurant search/filtering

**Deliverable:** Complete restaurant management interface

**Owner:** Frontend

---

### Week 18: User Management & Roles

**Tasks:**
- [ ] Build user list view
- [ ] Create user invitation form
- [ ] Build role assignment UI
- [ ] Implement permission override system
- [ ] Create audit log viewer
- [ ] Build user deactivation flow
- [ ] Create bulk user operations

**Deliverable:** User management with audit trails

**Owner:** Frontend

---

### Week 19: Platform Analytics

**Tasks:**
- [ ] Build global analytics dashboard
- [ ] Create KPI cards for platform metrics
- [ ] Implement restaurant breakdown analytics
- [ ] Build feature adoption tracking
- [ ] Create growth charts
- [ ] Build churn analysis view
- [ ] Implement data export functionality

**Deliverable:** Platform-wide analytics dashboard

**Owner:** Backend + Frontend

---

### Week 20: Super Admin Features

**Tasks:**
- [ ] Build template management UI
- [ ] Create plan management interface
- [ ] Implement feature flag management
- [ ] Build system health dashboard
- [ ] Create backup/restore interface
- [ ] Build environment configuration UI
- [ ] Create notification center

**Deliverable:** Complete super admin capabilities

**Owner:** Frontend

---

## Phase 6: Plans & Billing (Weeks 21-24)

### Objective
Implement subscription management and feature gating for SaaS monetization.

### Week 21: Stripe Integration & Plan Setup

**Tasks:**
- [ ] Setup Stripe account
- [ ] Create plans in Stripe
- [ ] Build subscription creation API
- [ ] Create webhook handlers for Stripe events
- [ ] Build subscription status management
- [ ] Implement plan change logic
- [ ] Create payment method management

**Deliverable:** Working Stripe integration

**Owner:** Backend

---

### Week 22: Feature Gating & Usage Tracking

**Tasks:**
- [ ] Implement plan feature checking
- [ ] Create usage tracking for product limits
- [ ] Build overage detection
- [ ] Implement soft limits with warnings
- [ ] Create hard limits with blocking
- [ ] Build feature upgrade prompts
- [ ] Implement graceful degradation

**Deliverable:** Feature gating system with usage tracking

**Owner:** Backend

---

### Week 23: Billing Dashboard & Invoicing

**Tasks:**
- [ ] Build customer billing dashboard
- [ ] Create subscription status display
- [ ] Build usage vs limit display
- [ ] Implement upgrade/downgrade UI
- [ ] Create payment method editor
- [ ] Build invoice history view
- [ ] Create automatic invoice generation
- [ ] Build email invoice delivery

**Deliverable:** Complete billing self-service UI

**Owner:** Frontend

---

### Week 24: Performance & Launch Prep

**Tasks:**
- [ ] Database query optimization
- [ ] API response time optimization (target <200ms)
- [ ] Frontend bundle optimization
- [ ] Implement caching strategies
- [ ] Load testing (1000 concurrent users)
- [ ] Security audit
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Cross-browser testing
- [ ] Final bug fixes
- [ ] Documentation & runbooks
- [ ] Customer onboarding guide
- [ ] Launch checklist

**Deliverable:** Production-ready MVP

**Owner:** Entire team

---

## Critical Path Items

**Must Complete Before Launch:**
1. ✅ Multi-tenant data isolation (RLS working)
2. ✅ Authentication system
3. ✅ Restaurant admin dashboard with menu management
4. ✅ Public menu with ordering
5. ✅ LSC menu with composition engine
6. ✅ Super admin dashboard
7. ✅ Stripe integration with plan enforcement
8. ✅ Basic analytics tracking
9. ✅ Security audit passed

**Can Defer to v1.1:**
1. ❌ KDS (Kitchen Display System)
2. ❌ Multiple locations
3. ❌ Custom template builder
4. ❌ Advanced reporting
5. ❌ White-label option
6. ❌ Mobile app
7. ❌ POS integrations

---

## Week-by-Week Milestone Summary

| Week | Milestone | Status |
|------|-----------|--------|
| 1 | Database & Infrastructure ✓ | Foundation |
| 2 | Authentication ✓ | Ready |
| 3 | Restaurant API ✓ | Ready |
| 4 | Frontend Scaffold ✓ | Ready |
| 5 | Products & Categories ✓ | Feature |
| 6 | Allergens Management ✓ | Feature |
| 7 | Bulk Import/Export ✓ | Feature |
| 8 | Admin Dashboard ✓ | Integration |
| 9 | Public Menu API ✓ | Feature |
| 10 | Traditional Menu UI ✓ | Feature |
| 11 | Order System ✓ | Integration |
| 12 | Template System ✓ | Feature |
| 13 | LSC Infrastructure ✓ | Foundation |
| 14 | Composition Engine ✓ | Feature |
| 15 | LSC Management ✓ | Feature |
| 16 | LSC Customer UX ✓ | Integration |
| 17 | Restaurant Management ✓ | Feature |
| 18 | User Management ✓ | Feature |
| 19 | Platform Analytics ✓ | Feature |
| 20 | Super Admin Features ✓ | Integration |
| 21 | Stripe Integration ✓ | Feature |
| 22 | Feature Gating ✓ | Feature |
| 23 | Billing Dashboard ✓ | Integration |
| 24 | Performance & Launch ✓ | Ship |

---

## Resource Allocation by Phase

### Phase 1 (Weeks 1-4): Foundation
- Backend: 80% capacity
- Frontend: 60% capacity
- DevOps/QA: 50% capacity
- PM: 30% capacity

### Phase 2 (Weeks 5-8): Admin Dashboard
- Backend: 70% capacity
- Frontend: 80% capacity
- QA: 60% capacity
- PM: 50% capacity

### Phase 3 (Weeks 9-12): Customer Experience
- Backend: 60% capacity
- Frontend: 90% capacity
- QA: 70% capacity
- PM: 60% capacity

### Phase 4 (Weeks 13-16): LSC
- Backend: 70% capacity
- Frontend: 80% capacity
- Content: 50% capacity (LSC video creation)
- QA: 70% capacity

### Phase 5 (Weeks 17-20): Super Admin
- Backend: 50% capacity
- Frontend: 80% capacity
- QA: 60% capacity
- PM: 70% capacity

### Phase 6 (Weeks 21-24): Billing & Launch
- Backend: 80% capacity
- Frontend: 70% capacity
- QA: 90% capacity
- DevOps: 80% capacity
- PM: 90% capacity

---

## External Dependencies

**MUST ARRANGE BEFORE STARTING:**

1. **LSC Content Creation**
   - Timeline: Weeks 1-16 (parallel, start week 1)
   - Deliverable: 30-40 component videos by week 14
   - Budget: $20,000-30,000
   - Partner: LSC interpreter + videographer

2. **Legal & Compliance**
   - Timeline: Weeks 1-22 (async)
   - Deliverable: Terms of Service, Privacy Policy, Data Processing Agreements
   - Partner: Legal consultant familiar with SaaS & Colombian law

3. **Payment Processing**
   - Timeline: Week 15 (need access by week 21)
   - Deliverable: Stripe account setup, Colombian payment methods configured
   - Partner: Stripe support team

4. **Design System Refinement** (Optional but recommended)
   - Timeline: Weeks 1-4
   - Deliverable: Design system guidelines, component library in Figma
   - Partner: Design contractor

---

## Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| LSC content delays | Medium | High | Start videos in week 1, contract backup interpreter |
| Database scaling issues | Low | High | Load test weekly, use connection pooling, implement caching early |
| Team member departures | Medium | Medium | Document decisions, maintain code standards, cross-train |
| Scope creep | High | High | Strict feature list, move nice-to-haves to v1.1, weekly planning |
| Security vulnerabilities | Low | Critical | Security audit at week 23, code review on sensitive code |
| Stripe integration complexity | Low | Medium | Use Stripe's official SDKs, test sandbox extensively |
| LSC composition engine bugs | Medium | High | Unit test composition logic thoroughly, QA with real users |

---

## Success Criteria for MVP Launch

- [ ] Zero critical security vulnerabilities (audit passed)
- [ ] 99.5% uptime over 1 week pre-launch
- [ ] All APIs respond in < 200ms (p95)
- [ ] 10+ beta restaurants successfully using platform
- [ ] Customers can place and track orders in both menu modes
- [ ] LSC menu fully functional with at least 50 products
- [ ] Feature gating prevents overages on all plans
- [ ] Audit logs capture all admin actions
- [ ] Documentation complete for customers and support team
- [ ] Monitoring and alerting configured

---

## Post-Launch (Phase 2)

After week 24, prioritize based on customer feedback:

1. **Quick Wins (Weeks 25-28)**
   - Bug fixes from users
   - Performance improvements
   - UX improvements from feedback
   - Documentation improvements

2. **Phase 2 Priorities (Weeks 29+)**
   - Kitchen Display System (KDS)
   - Multiple locations
   - Advanced reporting
   - Custom template builder
   - Mobile app planning
   - POS integrations

---

## Communication & Reporting

**Daily:**
- Team standup (15 min)
- Slack updates in #development

**Weekly:**
- Planning meeting (1 hour)
- Demo of completed work (30 min)
- Stakeholder update (30 min)

**Monthly:**
- Architecture review
- Roadmap adjustment
- Budget/spend review

---

## Version Control Strategy

**Main Branch:** Production code (releases only)  
**Develop Branch:** Integration (weekly merges from features)  
**Feature Branches:** For each task (naming: `feature/week-X-description`)

Example:
- `feature/week-5-product-crud`
- `feature/week-10-menu-ui`
- `feature/week-14-composition-engine`

**Merge Requirements:**
- Code review (2 approvals)
- All tests passing
- Zero security warnings
- Documentation updated

---

**Total Effort:** ~500 engineering hours  
**Estimated Cost:** $80,000-120,000 (depending on team location)  
**Time to Market:** 6 months  
**Scalability:** Designed for 1000+ restaurants on platform
