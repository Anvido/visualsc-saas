# VISUALSC Pilot MVP - 2 Hour Quickstart

**Goal:** Launch LSC Coffee Club pilot in 2 hours  
**Team:** 1 person (you)  
**Resources:** Laptop, internet, free accounts

---

## 🚀 Hour 1: Backend & Database

### Task 1: Supabase Setup (15 min)

```bash
# Go to https://supabase.com
# 1. Create account (if needed)
# 2. Create new project
# 3. Wait 2-3 minutes for setup
# 4. Copy credentials:
SUPABASE_URL = https://xxxxx.supabase.co
SUPABASE_KEY = your_anon_key
```

### Task 2: Deploy Database Schema (10 min)

```bash
# In Supabase, go to SQL Editor
# Copy entire content of: database_schema.sql
# Paste into editor and click RUN
# Wait for success ✅
```

**What just happened:**
- LSC Coffee Club restaurant created
- 7 allergens created
- 6 categories created
- Admin user created: demo@visualsc.co

### Task 3: Deploy Backend to Railway (20 min)

```bash
# Go to https://railway.app
# Login with GitHub
# Click "New Project"
# Select your GitHub repo
# Railway auto-detects server/ directory
# Wait for build (5-10 min)
# Get API URL: https://xxxxx.up.railway.app
```

Add environment variables in Railway:
```
SUPABASE_URL=<your_url>
SUPABASE_KEY=<your_key>
NODE_ENV=production
PORT=3000
```

Save API URL for Step 4.

---

## 🚀 Hour 2: Frontend & Launch

### Task 4: Deploy Frontend to Vercel (15 min)

```bash
# Go to https://vercel.com
# Login with GitHub
# "Add New" → "Project"
# Select this repo
# Configure:
# - Framework: Vite
# - Root: ./
# - Build: npm run build
# - Output: dist
```

Add environment variable:
```
VITE_API_URL=<your_railway_url>
```

Wait for deployment (5-10 min)

Get Vercel URL: `https://xxxxx.vercel.app`

### Task 5: Quick Test (15 min)

```bash
# Test these URLs:

1. Landing: https://xxxxx.vercel.app/
   → Should show homepage ✅

2. Login: https://xxxxx.vercel.app/login
   → Email: demo@visualsc.co
   → Password: demo123456
   → Should show dashboard ✅

3. Public Menu: https://xxxxx.vercel.app/lsc-coffee-club
   → Should show "Bienvenido"
   → No products yet (we'll add them next)
   → Two buttons: Traditional menu & LSC menu ✅
```

### Task 6: Enable Realtime in Supabase (5 min)

```bash
# Supabase Dashboard
# → Settings → Realtime
# Enable for:
#   ☑️ products
#   ☑️ categories
#   ☑️ lsc_videos
```

This allows admin changes to show up instantly on customer menu.

---

## ✅ You're LIVE!

Public menu is now live at:
```
https://xxxxx.vercel.app/lsc-coffee-club
```

Share this URL with LSC Coffee Club!

---

## 📝 Next: Add Products (Tomorrow, 30 min)

Option A: Use Admin Dashboard
```
1. Go to admin dashboard
2. Login with demo@visualsc.co
3. Click "Productos"
4. Click "+ Nuevo Producto"
5. Add: Café Americano, $5000, Espresso category
6. Add allergens: Leche
7. See it appear on public menu instantly! ✨
```

Option B: Add via SQL (Faster for bulk)
```sql
INSERT INTO products (restaurant_id, category_id, name, description, price, status)
SELECT 
  r.id, c.id, 'Café Americano', 'Espresso con agua caliente', 5000, 'active'
FROM restaurants r, categories c 
WHERE r.slug = 'lsc-coffee-club' AND c.name = 'Espresso'
LIMIT 1;
```

---

## 🎬 Future: Add LSC Videos (Week 2)

For now, skip videos. Public menu works great without them.

When ready:
```sql
INSERT INTO lsc_videos (restaurant_id, title, video_url, category, status)
SELECT id, 'Welcome', 'https://example.com/video.mp4', 'welcome', 'active'
FROM restaurants WHERE slug = 'lsc-coffee-club';
```

---

## 🐛 Troubleshooting

### "Can't reach API"
- Check Railway deployment is running
- Check VITE_API_URL is set correctly in Vercel

### "Database errors"
- Check SUPABASE_URL and SUPABASE_KEY in Railway
- Verify Supabase project is active
- Check schema.sql ran successfully

### "Menu not showing"
- Check products exist in database
- Check restaurant slug is "lsc-coffee-club"
- Hard refresh browser (Cmd+Shift+R)

### "Real-time not working"
- Enable Realtime in Supabase Settings
- Wait 30 seconds after enabling
- Try again

---

## 📊 Monitor Everything

### Check Errors:
- Vercel: Deployments → Logs
- Railway: Click service → Logs
- Supabase: No errors yet!

### Check Usage:
- Vercel: Analytics (real-time visits)
- Railway: Usage & Logs
- Supabase: Database → Logs

---

## 🎉 Success!

```
Time Invested: ~2 hours
Infrastructure Cost: $0 (free tier)
Customers Ready: 1 (LSC Coffee Club)
Features Ready: Product menu + Admin dashboard
Status: LIVE
```

**Now:** Monitor for issues.  
**Tomorrow:** Add products and videos.  
**Week 2:** Test with real customers.  
**Week 3:** Validate if deaf customers want this.  

---

## 📞 Questions?

- Database issues → See DEPLOYMENT_GUIDE.md
- Code issues → See IMPLEMENTATION_STATUS.md
- Architecture → See ARCHITECTURE.md

---

**Status:** ✅ PRODUCTION READY

**Next Steps:** 
1. Follow checklist above (2 hours)
2. Share public URL with LSC Coffee Club
3. Monitor metrics
4. Add products tomorrow
5. Validate with real customers

**Good luck! 🚀**
