# VISUALSC Deployment Checklist & Evidence Template

**Start Date:** ___________  
**Completion Date:** ___________  
**Deployed by:** ___________

---

## PHASE 1: SUPABASE SETUP ✓

### 1.1: Create Supabase Project
- [ ] Created account at supabase.com
- [ ] Project name: `visualsc-pilot`
- [ ] Region selected: ___________
- [ ] Project ready (wait 2-3 min)

**Evidence:**
- Screenshot of Supabase dashboard
- ![Supabase Project Created]

---

### 1.2: Save Credentials
- [ ] Project URL saved: 
  ```
  https://_____________________.supabase.co
  ```
- [ ] Anon Public Key saved: 
  ```
  eyJhbGc________________________
  ```
- [ ] Credentials stored securely

**Evidence:**
- Text file with credentials (keep private)

---

### 1.3: Deploy Database Schema
- [ ] Copied full content of `database_schema.sql`
- [ ] Pasted into Supabase SQL Editor
- [ ] Executed successfully (green checkmark)
- [ ] No errors

**Evidence:**
- Screenshot of "Query executed successfully"

---

### 1.4: Verify Database Created
- [ ] Table Editor shows these tables:
  - [ ] restaurants
  - [ ] users
  - [ ] categories
  - [ ] products
  - [ ] allergens
  - [ ] product_allergens
  - [ ] lsc_videos
  - [ ] orders
- [ ] LSC Coffee Club restaurant exists

**Evidence:**
- Screenshot of Table Editor with all tables
- Screenshot of restaurants table showing LSC Coffee Club

---

## PHASE 2: AUTHENTICATION & TEST USERS ✓

### 2.1: Enable Email Auth
- [ ] Went to Authentication → Providers
- [ ] Email provider enabled
- [ ] Settings saved

**Evidence:**
- Screenshot of Email Provider toggled ON

---

### 2.2: Create Test Users
- [ ] Ran SQL script to create users
- [ ] Query executed: "2 rows inserted"
- [ ] No errors

**Evidence:**
- Screenshot of SQL execution with "2 rows inserted"

---

### 2.3: Verify Users Created
- [ ] Checked users table
- [ ] admin@visualsc.co exists (role: super_admin)
- [ ] owner@lsccoffeeclub.com exists (role: admin)

**Evidence:**
- Screenshot of users table showing both users

**Test Credentials:**
```
SUPER ADMIN:
Email: admin@visualsc.co
Password: password

RESTAURANT OWNER:
Email: owner@lsccoffeeclub.com
Password: password
```

---

## PHASE 3: SEED DATA ✓

### 3.1: Add Sample Products
- [ ] Ran product creation SQL script
- [ ] Query executed: "6 rows inserted"
- [ ] No errors

**Evidence:**
- Screenshot of SQL execution

---

### 3.2: Add Allergens
- [ ] Ran allergen association script
- [ ] Query executed: "2 rows inserted"
- [ ] Café Americano has Leche and Gluten allergens

**Evidence:**
- Screenshot of SQL execution

---

### 3.3: Verify Sample Data
- [ ] Products table shows 6 items
- [ ] product_allergens table shows associations
- [ ] All data correct

**Evidence:**
- Screenshot of products table
- Screenshot of product_allergens table

---

## PHASE 4: BACKEND DEPLOYMENT ✓

### 4.1: Deploy to Railway
- [ ] Went to railway.app
- [ ] Authenticated with GitHub
- [ ] Deployed from repository
- [ ] Build completed (green status)
- [ ] **Build time:** _________ minutes

**Evidence:**
- Screenshot of Railway project with green status
- Railway URL: `https://_____________________.up.railway.app`

---

### 4.2: Configure Environment Variables
- [ ] Added SUPABASE_URL
- [ ] Added SUPABASE_KEY
- [ ] Added NODE_ENV=production
- [ ] Added PORT=3000
- [ ] Redeployed

**Evidence:**
- Screenshot of Railway environment variables (hide keys)
- Screenshot of successful redeploy

---

### 4.3: Verify Backend Running
- [ ] Railway shows green status
- [ ] No error logs
- [ ] Service is active

**Evidence:**
- Screenshot of Railway "Running" status
- No critical errors in logs

**Railway API URL:** 
```
https://_____________________.up.railway.app
```

---

## PHASE 5: FRONTEND DEPLOYMENT ✓

### 5.1: Deploy to Vercel
- [ ] Went to vercel.com
- [ ] Authenticated with GitHub
- [ ] Imported this repository
- [ ] Configured Vite build
- [ ] Build completed (green status)
- [ ] **Build time:** _________ minutes

**Evidence:**
- Screenshot of Vercel deployment success
- Vercel URL: `https://_____________________.vercel.app`

---

### 5.2: Add Environment Variable
- [ ] Added VITE_API_URL with Railway URL
- [ ] Redeployed frontend
- [ ] Build successful

**Evidence:**
- Screenshot of Vercel environment variables
- Screenshot of successful redeploy

---

### 5.3: Get Frontend URL
- [ ] Vercel shows production domain
- [ ] Accessible from browser

**Vercel Frontend URL:**
```
https://_____________________.vercel.app
```

---

## PHASE 6: CONNECT & VERIFY ✓

### 6.1: Test Login
- [ ] Opened `/login` page
- [ ] Entered: owner@lsccoffeeclub.com / password
- [ ] Login successful
- [ ] Redirected to dashboard

**Evidence:**
- Screenshot of login page
- Screenshot of successful login
- Screenshot of dashboard after login

---

### 6.2: Test Product Creation
- [ ] Logged in as owner@lsccoffeeclub.com
- [ ] Navigated to Products
- [ ] Clicked "Nuevo Producto"
- [ ] Created test product
- [ ] Product appeared in list
- [ ] No errors

**Evidence:**
- Screenshot of product form
- Screenshot of product in list after creation

---

### 6.3: Test Data Persistence
- [ ] Refreshed page (F5)
- [ ] Product still appears in list
- [ ] Data persisted to database

**Evidence:**
- Before refresh: Screenshot of product in list
- After refresh: Screenshot of same product still there

---

### 6.4: Test Public Menu
- [ ] Opened `/lsc-coffee-club` (public URL)
- [ ] Saw all products displayed
- [ ] Prices showing correctly
- [ ] Allergen badges visible
- [ ] No errors in console

**Evidence:**
- Screenshot of public menu with products
- Screenshot of product with allergens

---

### 6.5: Test Real-Time Updates
- [ ] Opened admin dashboard in one window
- [ ] Opened public menu in another window
- [ ] Edited a product price in admin
- [ ] Changed price to test value (e.g., 9999)
- [ ] Saved changes
- [ ] Price updated on public menu (instantly or on refresh)

**Evidence:**
- Before: Screenshot of old price
- After: Screenshot of new price on public menu

---

## FINAL VERIFICATION

### System Working?

| Feature | Working? | Evidence |
|---------|----------|----------|
| Login | ☐ YES ☐ NO | Screenshot |
| Dashboard | ☐ YES ☐ NO | Screenshot |
| Create Product | ☐ YES ☐ NO | Screenshot |
| Data Persists | ☐ YES ☐ NO | Screenshot |
| Public Menu | ☐ YES ☐ NO | Screenshot |
| Real-time Update | ☐ YES ☐ NO | Screenshot |

---

## PRODUCTION URLs

### For Admin (LSC Coffee Club Staff):
```
URL: https://_____________________.vercel.app/login
Email: owner@lsccoffeeclub.com
Password: password
```

### For Customers (Public Menu):
```
URL: https://_____________________.vercel.app/lsc-coffee-club
```

### QR Code:
- Generated: ☐ YES ☐ NO
- QR Points To: `https://_____________________.vercel.app/lsc-coffee-club`
- QR Code Image: ![QR_CODE]

---

## DATABASE VERIFICATION

### Record Count:
```
Restaurants: 1 ☐
Users: 2 ☐
Categories: 6 ☐
Products: 6+ ☐
Allergens: 7 ☐
```

**Evidence:**
- Screenshot of verification query result

---

## ISSUES ENCOUNTERED

| Issue | Cause | Resolution |
|-------|-------|-----------|
| | | |
| | | |
| | | |

---

## READY TO DEMO?

- [ ] All features working
- [ ] Login credentials tested
- [ ] Public menu displays real data
- [ ] Data persists correctly
- [ ] No errors in console
- [ ] Screenshots/evidence collected
- [ ] URLs documented
- [ ] QR code generated

---

## SIGN-OFF

**Deployment Status:** ☐ COMPLETE ☐ IN PROGRESS ☐ FAILED

**Deployed by:** ___________________  
**Date:** ___________________  
**Time Taken:** _________ hours

**Ready to show LSC Coffee Club:** ☐ YES ☐ NO

---

## EVIDENCE FOLDER

Create a folder with:
1. Screenshot of Supabase project
2. Screenshot of database tables
3. Screenshot of test users
4. Screenshot of products
5. Screenshot of admin login
6. Screenshot of admin dashboard
7. Screenshot of public menu
8. Screenshot of product with allergens
9. Screenshot of real-time update test
10. QR code image
11. Text file with URLs and credentials

**Folder Location:** _____________________

---

## HANDOFF DOCUMENTATION

### For LSC Coffee Club:

**What to Share:**
1. Admin login URL
2. Login credentials
3. Public menu URL
4. QR code (printed)
5. Quick user guide

**How to Use:**
1. Open admin URL
2. Login with provided credentials
3. Add/edit menu items
4. Changes appear instantly on public menu
5. Customers scan QR code to view menu

---

## NEXT STEPS

After deployment verified:

- [ ] Document any issues encountered
- [ ] Create user manual for LSC Coffee Club
- [ ] Schedule demo with LSC Coffee Club
- [ ] Gather feedback
- [ ] Plan iterations
- [ ] Document learnings

---

**Deployment Complete!**

This checklist confirms VISUALSC pilot is fully operational and ready for LSC Coffee Club testing.
