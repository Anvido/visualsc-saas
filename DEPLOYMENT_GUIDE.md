# VISUALSC Pilot MVP - Deployment & Setup Guide

## Quick Start (24 Hours to Live Pilot)

This guide will walk you through deploying the VISUALSC Pilot MVP with LSC Coffee Club as the first customer.

**What You Need:**
- Supabase account (free)
- Vercel account (free)
- Railway or Render account (free)
- ~2 hours of setup time

---

## Step 1: Supabase Database Setup (30 minutes)

### 1.1 Create Supabase Project

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up or login
4. Click "New Project"
5. Select region closest to you (or us-west-1)
6. Create project (wait 2-3 minutes for setup)

### 1.2 Create Database Tables

1. In Supabase dashboard, click "SQL Editor"
2. Click "New query"
3. Copy the entire contents of `database_schema.sql` from this repo
4. Paste into the SQL editor
5. Click "Run"
6. Wait for success message

### 1.3 Get Credentials

1. Click "Settings" → "API"
2. Copy `Project URL` (looks like `https://xxxxx.supabase.co`)
3. Copy `anon public` key
4. Save these in a text file for later

---

## Step 2: Backend Deployment (20 minutes)

### Option A: Deploy to Railway (Recommended for MVP)

1. Go to https://railway.app
2. Login with GitHub (create account if needed)
3. Click "New Project" → "Deploy from GitHub"
4. Connect your GitHub repo (this repository)
5. Select this repository
6. Railway will detect `server/` directory automatically

### Configure Environment Variables in Railway

1. In Railway dashboard, click on the deployed service
2. Click "Variables"
3. Add these environment variables:

```
SUPABASE_URL=<your_project_url_from_step_1.3>
SUPABASE_KEY=<your_anon_public_key>
NODE_ENV=production
PORT=3000
```

4. Click "Deploy"
5. Wait for deployment (5-10 minutes)
6. Copy the public URL from Railway (looks like `https://xxxxx.up.railway.app`)

### Option B: Deploy to Render

1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect GitHub repo
5. Fill in:
   - **Name:** visualsc-api
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm run start`
6. Add environment variables (same as Railway above)
7. Click "Deploy"

---

## Step 3: Frontend Deployment (15 minutes)

### Deploy to Vercel

1. Go to https://vercel.com
2. Sign up or login with GitHub
3. Click "Add New..." → "Project"
4. Import your GitHub repository
5. Configure build:
   - **Framework:** Vite
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

6. Add environment variable:
   - **VITE_API_URL:** `https://xxxxx.up.railway.app` (from Step 2)

7. Click "Deploy"
8. Wait for build (5-10 minutes)
9. Copy the Vercel URL (looks like `https://visualsc.vercel.app`)

---

## Step 4: Configure Public Menu URL

After deployment, update the login page to direct to correct URL:

### Update for LSC Coffee Club

1. In Vercel dashboard, go to "Settings" → "Environment Variables"
2. Add: `VITE_RESTAURANT_SLUG=lsc-coffee-club`
3. Redeploy

### Public Menu URL

Your customer's public menu will be available at:

```
https://visualsc.vercel.app/lsc-coffee-club
```

Share this URL with LSC Coffee Club!

---

## Step 5: Setup LSC Coffee Club (15 minutes)

### 5.1 Create Admin User

In Supabase SQL Editor, run:

```sql
-- Get restaurant ID
SELECT id FROM restaurants WHERE slug = 'lsc-coffee-club' LIMIT 1;

-- Then insert user (replace {restaurant_id} with the ID above)
INSERT INTO users (restaurant_id, email, password_hash, role) VALUES
  ('{restaurant_id}', 'demo@visualsc.co', 'bcrypt_hash_of_demo123456', 'admin');
```

**For MVP**, use simple password check in code (see `server/routes/api.ts` line ~40).

### 5.2 Add Sample Data

Run these SQL commands in Supabase:

```sql
-- Add coffee categories
INSERT INTO categories (restaurant_id, name, icon, display_order) 
SELECT id, 'Espresso', '☕', 1 FROM restaurants WHERE slug = 'lsc-coffee-club';

INSERT INTO categories (restaurant_id, name, icon, display_order) 
SELECT id, 'Bebidas Frías', '🧊', 2 FROM restaurants WHERE slug = 'lsc-coffee-club';

INSERT INTO categories (restaurant_id, name, icon, display_order) 
SELECT id, 'Postres', '🍰', 3 FROM restaurants WHERE slug = 'lsc-coffee-club';

-- Add sample products
INSERT INTO products (restaurant_id, category_id, name, description, price, status)
SELECT 
  r.id,
  c.id,
  'Café Americano',
  'Espresso con agua caliente',
  5000,
  'active'
FROM restaurants r, categories c 
WHERE r.slug = 'lsc-coffee-club' AND c.name = 'Espresso'
LIMIT 1;

INSERT INTO products (restaurant_id, category_id, name, description, price, status)
SELECT 
  r.id,
  c.id,
  'Cappuccino',
  'Espresso con leche espumosa',
  6000,
  'active'
FROM restaurants r, categories c 
WHERE r.slug = 'lsc-coffee-club' AND c.name = 'Espresso'
LIMIT 1;

-- Continue with more products...
```

---

## Step 6: Test the Pilot

### Test URLs

1. **Landing Page:** `https://visualsc.vercel.app/`
2. **Admin Login:** `https://visualsc.vercel.app/login`
   - Email: `demo@visualsc.co`
   - Password: `demo123456`
3. **Admin Dashboard:** `https://visualsc.vercel.app/admin/restaurant`
4. **Public Menu:** `https://visualsc.vercel.app/lsc-coffee-club`

### Test Flows

- [ ] Login with demo@visualsc.co
- [ ] View dashboard metrics
- [ ] Create a new product
- [ ] Edit product details
- [ ] View public menu
- [ ] See product appears in real-time
- [ ] Switch to LSC menu view

---

## Step 7: Real-Time Updates Setup

The pilot uses Supabase Realtime for real-time updates.

### Enable Realtime in Supabase

1. Go to Supabase dashboard
2. Click "Settings" → "Realtime"
3. Under "Replication", enable for:
   - `products` table
   - `categories` table
   - `lsc_videos` table

This allows admin changes to instantly appear on customer menu.

---

## Step 8: Video Upload Setup (Optional for MVP)

For MVP, you can manually add LSC video URLs to database:

```sql
INSERT INTO lsc_videos (restaurant_id, title, video_url, category, status)
SELECT id, 'Bienvenida a LSC Coffee Club', 'https://example.com/video1.mp4', 'welcome', 'active'
FROM restaurants WHERE slug = 'lsc-coffee-club';
```

For production, implement video upload to Supabase Storage.

---

## Step 9: QR Code Generation

Generate QR code for: `https://visualsc.vercel.app/lsc-coffee-club`

Use free tool: https://qr-code-generator.com

Print and place in restaurant!

---

## Architecture Deployed

```
                    ┌─────────────────────────┐
                    │  Customer Browser       │
                    │  (Public Menu)          │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │  Vercel (Frontend)      │
                    │  visualsc.vercel.app    │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │  Railway/Render (API)   │
                    │  Backend Endpoints      │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │  Supabase (Database)    │
                    │  PostgreSQL + Storage   │
                    └─────────────────────────┘

Real-Time Flow:
Admin Dashboard → API → Supabase Realtime → Customer Browser (instant update)
```

---

## Monitoring & Logs

### Frontend Errors
- Vercel dashboard: "Deployments" → "Logs"

### Backend Errors
- Railway: Click service → "Logs" tab
- Render: Click service → "Logs" tab

### Database Errors
- Supabase: "Database" → "Query Performance" or SQL logs

---

## Troubleshooting

### "Database connection failed"
- Check `SUPABASE_URL` and `SUPABASE_KEY` in environment variables
- Verify Supabase project is active

### "CORS errors"
- Add frontend URL to Supabase allowed origins:
  - Supabase dashboard → Settings → API → CORS
  - Add `https://visualsc.vercel.app`

### "Videos not loading"
- Ensure video URLs are accessible (not private)
- Test URL directly in browser

### "Real-time updates not working"
- Verify Realtime is enabled in Supabase Settings
- Check browser console for errors

---

## Next Steps (After Pilot Goes Live)

### Week 1: Monitor & Collect Feedback
- Monitor errors in dashboard
- Collect feedback from LSC Coffee Club
- Track usage metrics

### Week 2: Iterate Based on Feedback
- Fix bugs found by customers
- Add requested features
- Optimize performance

### Week 3-4: Add More Features
- Implement video upload UI
- Add multiple restaurants support
- Enhance LSC menu design

---

## Support Contacts

**For Supabase issues:** docs.supabase.com  
**For Vercel issues:** vercel.com/support  
**For Railway issues:** railway.app/docs  

---

## Quick Reference

| Component | URL | Login |
|-----------|-----|-------|
| Landing | https://visualsc.vercel.app | (public) |
| Admin | https://visualsc.vercel.app/admin/restaurant | demo@visualsc.co / demo123456 |
| Public Menu | https://visualsc.vercel.app/lsc-coffee-club | (public) |
| Supabase | https://app.supabase.io | Your email |
| Vercel | https://vercel.com | Your GitHub |
| Railway | https://railway.app | Your GitHub |

---

## You're Live! 🎉

Your VISUALSC Pilot MVP is now live and ready for LSC Coffee Club to start using.

**Next:** Share the public menu URL with LSC Coffee Club and monitor usage!
