# VISUALSC Real Deployment - Step by Step

**Goal:** LSC Coffee Club pilot working with real Supabase backend by end of today  
**Time:** 3-4 hours  
**Outcome:** Real working pilot you can demo this week

---

## PHASE 1: SUPABASE SETUP (30 minutes)

### Step 1.1: Create Supabase Project

1. Go to https://supabase.com
2. Click "Sign Up" (if needed)
3. Use Google or GitHub login
4. Click "Create a new project"
5. Fill in:
   - **Project name:** `visualsc-pilot`
   - **Database password:** Create a strong password (save it)
   - **Region:** Choose closest to you (or `us-east-1`)
   - **Pricing plan:** Free tier
6. Click "Create new project"
7. **WAIT 2-3 minutes** for setup

### Step 1.2: Get Your Credentials

Once project is ready:
1. Click "Settings" → "API" in left sidebar
2. **COPY AND SAVE these:**
   ```
   Project URL: https://xxxxx.supabase.co
   Anon Public Key: eyJhbGc...
   Service Role Key: eyJhbGc... (don't share this)
   ```
3. Save to a text file on your computer

**✓ Checkpoint:** You have Supabase project + credentials

---

### Step 1.3: Deploy Database Schema

1. In Supabase, click "SQL Editor" (left sidebar)
2. Click "New query"
3. Copy **entire content** from `database_schema.sql` (this repository)
4. Paste into the SQL editor
5. Click "Run"
6. **Wait** for green success message

**✓ Checkpoint:** Database schema deployed

---

### Step 1.4: Verify Database Created

1. In Supabase, click "Table Editor" (left sidebar)
2. You should see these tables:
   ```
   ✓ restaurants
   ✓ users
   ✓ categories
   ✓ products
   ✓ product_allergens
   ✓ allergens
   ✓ lsc_videos
   ✓ orders
   ```
3. Click "restaurants" table
4. You should see 1 record: **LSC Coffee Club**

**✓ Checkpoint:** Database verified

---

## PHASE 2: AUTHENTICATION & TEST USERS (20 minutes)

### Step 2.1: Enable Email Authentication in Supabase

1. In Supabase, go to "Authentication" (left sidebar)
2. Click "Providers"
3. Click "Email"
4. Toggle "Email" to ON
5. Keep defaults
6. Click "Save"

**✓ Checkpoint:** Email auth enabled

---

### Step 2.2: Create Test Users via SQL

1. Go to SQL Editor
2. Click "New query"
3. **Copy and run this SQL:**

```sql
-- Create Super Admin user
INSERT INTO users (restaurant_id, email, password_hash, role, status)
SELECT 
  id,
  'admin@visualsc.co',
  '$2a$10$N9qo8uLOickgx2ZMRZoM2eIjZAgcg7b3XeKeUxWdeS86E36CHhzPm', -- bcrypt of 'password'
  'super_admin',
  'active'
FROM restaurants 
WHERE slug = 'lsc-coffee-club'
LIMIT 1;

-- Create Restaurant Owner user
INSERT INTO users (restaurant_id, email, password_hash, role, status)
SELECT 
  id,
  'owner@lsccoffeeclub.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoM2eIjZAgcg7b3XeKeUxWdeS86E36CHhzPm', -- bcrypt of 'password'
  'admin',
  'active'
FROM restaurants 
WHERE slug = 'lsc-coffee-club'
LIMIT 1;
```

4. Click "Run"
5. You should see **2 rows inserted**

**✓ Checkpoint:** Test users created

---

### Step 2.3: Verify Users Created

1. Go to "Table Editor"
2. Click "users" table
3. You should see 2 records:
   - admin@visualsc.co (role: super_admin)
   - owner@lsccoffeeclub.com (role: admin)

**Password for both:** `password`

**SAVE THESE CREDENTIALS:**
```
SUPER ADMIN:
Email: admin@visualsc.co
Password: password

RESTAURANT OWNER:
Email: owner@lsccoffeeclub.com
Password: password
```

**✓ Checkpoint:** Users verified

---

## PHASE 3: SEED DATA (20 minutes)

### Step 3.1: Add Sample Products

1. Go to SQL Editor
2. Click "New query"
3. Copy and run this SQL:

```sql
-- Get restaurant ID
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
-- Espresso products
((SELECT id FROM restaurant), (SELECT id FROM espresso_cat), 'Café Americano', 'Espresso con agua caliente', 5000, 'active'),
((SELECT id FROM restaurant), (SELECT id FROM espresso_cat), 'Espresso', 'Espresso puro', 3000, 'active'),
((SELECT id FROM restaurant), (SELECT id FROM espresso_cat), 'Cappuccino', 'Espresso con leche espumosa', 6000, 'active'),
((SELECT id FROM restaurant), (SELECT id FROM espresso_cat), 'Latte', 'Espresso con mucha leche', 6500, 'active'),

-- Cold drinks
((SELECT id FROM restaurant), (SELECT id FROM bebidas_cat), 'Café Helado', 'Café frío con hielo', 6000, 'active'),
((SELECT id FROM restaurant), (SELECT id FROM bebidas_cat), 'Agua Fría', 'Agua con hielo', 2000, 'active');
```

4. Click "Run"
5. You should see **6 rows inserted**

**✓ Checkpoint:** Products added

---

### Step 3.2: Add Allergens to Products

1. Go to SQL Editor
2. Click "New query"
3. Copy and run this SQL:

```sql
-- Get IDs
WITH cafe_americano AS (
  SELECT id FROM products WHERE name = 'Café Americano' AND restaurant_id = (SELECT id FROM restaurants WHERE slug = 'lsc-coffee-club')
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
```

4. Click "Run"

**✓ Checkpoint:** Allergens added

---

### Step 3.3: Verify Data

1. Go to "Table Editor"
2. Click "products" - should see 6 products
3. Click "product_allergens" - should see allergen associations

**✓ Checkpoint:** Sample data verified

---

## PHASE 4: BACKEND DEPLOYMENT (30 minutes)

### Step 4.1: Deploy to Railway

1. Go to https://railway.app
2. Login with GitHub (create account if needed)
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Authenticate with GitHub
6. Select your repository (this one)
7. Railway auto-detects and builds

**WAIT 5-10 minutes for build**

### Step 4.2: Configure Environment Variables in Railway

1. In Railway, click your deployed service
2. Click "Variables" tab
3. Add these environment variables:
   ```
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_KEY=eyJhbGc...
   NODE_ENV=production
   PORT=3000
   ```
4. Click "Deploy"

**WAIT 2-3 minutes**

### Step 4.3: Get Railway URL

1. In Railway, look for "Public URL" section
2. Copy the URL (looks like `https://xxxxx.up.railway.app`)
3. Save this URL - you'll need it for the frontend

**✓ Checkpoint:** Backend deployed and running**

---

## PHASE 5: FRONTEND DEPLOYMENT (20 minutes)

### Step 5.1: Deploy to Vercel

1. Go to https://vercel.com
2. Login with GitHub
3. Click "Add New..." → "Project"
4. Select your repository
5. Configure:
   - **Framework:** Vite
   - **Root Directory:** ./
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

**WAIT 5-10 minutes for build**

### Step 5.2: Add Environment Variable

1. In Vercel project settings
2. Go to "Environment Variables"
3. Add:
   ```
   VITE_API_URL=https://xxxxx.up.railway.app
   ```
   (Replace with your Railway URL from Step 4.3)

4. Click "Redeploy" to rebuild with new env var

**WAIT 5 minutes**

### Step 5.3: Get Vercel URL

1. Look for "Domains" section
2. Copy the production URL (looks like `https://xxxxx.vercel.app`)

**✓ Checkpoint:** Frontend deployed**

---

## PHASE 6: CONNECT & VERIFY (30 minutes)

### Step 6.1: Update Backend Code (IMPORTANT)

The backend needs to know about your Supabase instance. 

In `server/routes/api.ts`, check that line ~7-8 has:

```typescript
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);
```

This should already be there. If not, update it.

**✓ Checkpoint:** Backend configured

---

### Step 6.2: Test Login (First Critical Test)

1. Go to your Vercel URL: `https://xxxxx.vercel.app/login`
2. Try to login with:
   ```
   Email: owner@lsccoffeeclub.com
   Password: password
   ```
3. Click "Ingresar"

**Expected Result:**
- Login succeeds
- You're redirected to dashboard
- You see a welcome message

**If it fails:**
- Open browser console (F12)
- Check for errors
- Verify SUPABASE_URL in environment is correct
- Check Railway backend is running

**✓ Checkpoint:** Login working**

---

### Step 6.3: Test Product Creation (Second Critical Test)

1. After logging in, go to dashboard
2. Click "Productos" section
3. Click "+ Nuevo Producto"
4. Fill in:
   ```
   Name: Test Café
   Category: Espresso
   Price: 4500
   Description: Test product
   ```
5. Click "Crear Producto"

**Expected Result:**
- Product appears in list
- No error message
- Product saved successfully

**✓ Checkpoint:** Product creation working**

---

### Step 6.4: Test Data Persistence (Third Critical Test)

1. After creating product, refresh page (F5)
2. Go to Productos section again

**Expected Result:**
- "Test Café" still appears in list
- Data persisted to database

**If missing:**
- Product wasn't saved to database
- Check Supabase connection
- Check API response in console

**✓ Checkpoint:** Data persistence verified**

---

### Step 6.5: Test Public Menu (Fourth Critical Test)

1. Go to public menu: `https://xxxxx.vercel.app/lsc-coffee-club`
2. You should see:
   - Restaurant name: "LSC Coffee Club"
   - Welcome message
   - Two buttons: "👁️ Menú" and "🤟 LSC"
3. Click "👁️ Menú" (traditional menu)

**Expected Result:**
- All 6+ products display
- "Test Café" you created appears
- Images show
- Prices display
- Allergens show

**If no products:**
- Check Supabase products table has data
- Check API endpoint returns products
- Check browser console for errors

**✓ Checkpoint:** Public menu working**

---

### Step 6.6: Test Real-Time Update (Fifth Critical Test)

1. **Open two browser windows:**
   - Window A: Admin dashboard (logged in)
   - Window B: Public menu

2. **In Window A (Admin):**
   - Go to Productos
   - Find "Test Café" 
   - Click edit
   - Change price to 9999
   - Save

3. **In Window B (Public Menu):**
   - Without refreshing, price should change to 9999
   - OR refresh the page and verify it changed

**Expected Result:**
- Price updates instantly or on refresh
- Changes reflect immediately

**✓ Checkpoint:** Real-time working**

---

## FINAL VERIFICATION

### Summary Table - What Should Work

| Feature | Test | Expected |
|---------|------|----------|
| Login | owner@lsccoffeeclub.com / password | ✓ Works |
| Dashboard | After login | ✓ Shows dashboard |
| Create Product | Add new item | ✓ Appears in list |
| Product Persists | Refresh page | ✓ Product still there |
| Public Menu | Visit /lsc-coffee-club | ✓ Shows all products |
| Real-time Update | Edit → See instantly | ✓ Changes appear |
| QR | Visit public menu URL | ✓ Scannable |

---

## GENERATE QR CODE

1. Go to https://qr-code-generator.com
2. Enter: `https://xxxxx.vercel.app/lsc-coffee-club`
3. Click "Generate"
4. Download as image
5. Print and test in browser

---

## WHAT YOU NOW HAVE

**LIVE PILOT:**
- ✅ Real Supabase database
- ✅ Real backend API
- ✅ Real frontend
- ✅ Real authentication
- ✅ Real product management
- ✅ Real data persistence
- ✅ Real-time synchronization
- ✅ Public menu for customers

**URLS TO SHARE:**
- Admin Dashboard: `https://xxxxx.vercel.app/login`
- Public Menu: `https://xxxxx.vercel.app/lsc-coffee-club`

**TEST ACCOUNTS:**
- Admin: admin@visualsc.co / password
- Owner: owner@lsccoffeeclub.com / password

---

## TROUBLESHOOTING

### "Login doesn't work"
1. Check email/password are correct
2. Check Supabase credentials are in Railway env vars
3. Check Railway backend is running (green status)
4. Check browser console (F12) for errors

### "Products don't appear on public menu"
1. Check products exist in Supabase (Table Editor)
2. Check API endpoint returns data: Visit `https://api.railway.app/api/products/lsc-coffee-club`
3. Check VITE_API_URL is correct in Vercel

### "Data doesn't persist"
1. Check products table in Supabase has records
2. Check API returns no error on POST
3. Verify Supabase connection string is correct

### "Real-time doesn't update"
1. Enable Realtime in Supabase Settings
2. Check Supabase Realtime is ON for products table
3. Reload page to see changes

---

## NEXT STEP

**You now have a REAL pilot ready to show LSC Coffee Club:**
- Real admin panel where they manage products
- Real public menu for customers
- Real data that persists
- Real functionality

**Share these URLs:**
```
"Login here to manage your menu:"
https://xxxxx.vercel.app/login

"Share this URL with customers to view menu:"
https://xxxxx.vercel.app/lsc-coffee-club
```

---

## EVIDENCE CHECKLIST

After completing all steps, you should be able to provide:

- [ ] Screenshots of Supabase database with products
- [ ] Screenshots of admin dashboard with created products
- [ ] Screenshots of public menu showing real data
- [ ] URL that works for customers
- [ ] Login credentials that work
- [ ] QR code that links to public menu
- [ ] Proof of data persistence (refresh test)
- [ ] Proof of real-time updates (edit test)

**Document all of this for LSC Coffee Club presentation.**

---

**Total Time:** 3-4 hours  
**Result:** Fully functional pilot  
**Next:** Demonstrate to LSC Coffee Club this week
