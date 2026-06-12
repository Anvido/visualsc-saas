# VISUALSC Deployment - START HERE

**You're about to deploy a REAL pilot in 3-4 hours.**

This is not optional steps. This is the actual deployment that will make everything work.

---

## 📋 WHAT YOU NEED

1. **Accounts (Create if you don't have):**
   - [ ] Supabase account (free at supabase.com)
   - [ ] Railway account (free at railway.app)
   - [ ] Vercel account (free at vercel.com)
   - [ ] GitHub account (connect to all above)

2. **Files (You already have):**
   - [ ] This repository cloned
   - [ ] `database_schema.sql` - Database structure
   - [ ] `DEPLOY_NOW.md` - Step-by-step guide
   - [ ] `DEPLOY_SQL_SCRIPTS.sql` - Ready-to-run scripts
   - [ ] `DEPLOYMENT_CHECKLIST.md` - Track progress

3. **Time:**
   - [ ] 3-4 hours uninterrupted
   - [ ] 1 person can do this alone
   - [ ] Coffee recommended ☕

---

## 🎯 THE GOAL

By the end, you'll have:

```
✅ Real Supabase database with 6 sample products
✅ Real backend API running on Railway  
✅ Real frontend running on Vercel
✅ Real test users (admin@visualsc.co, owner@lsccoffeeclub.com)
✅ Working login system
✅ Working product management
✅ Working public menu for customers
✅ Working real-time synchronization
✅ QR code for customers to scan
```

**AND** a URL you can share with LSC Coffee Club this week.

---

## 📚 DOCUMENTS IN ORDER

Read these IN THIS ORDER:

1. **This file** (you're reading it) - 2 min
2. **DEPLOY_NOW.md** - 30 min read, 3-4 hours execution
3. **DEPLOY_SQL_SCRIPTS.sql** - Reference while deploying
4. **DEPLOYMENT_CHECKLIST.md** - Track progress as you go

---

## ⏱️ TIME BREAKDOWN

| Task | Time | Notes |
|------|------|-------|
| Read DEPLOY_NOW.md | 30 min | Familiarize yourself |
| Supabase setup | 30 min | Create project, deploy schema |
| Create test users | 15 min | Run SQL scripts |
| Add sample data | 15 min | Seed products & allergens |
| Deploy backend | 30 min | Railway build takes 10 min |
| Deploy frontend | 30 min | Vercel build takes 10 min |
| Connect & test | 45 min | Login, create product, verify |
| Total | 3-4 hours | Includes reading + executing |

---

## 🚀 QUICK START (Detailed Below)

### Phase 1: Supabase (30 min)
```
1. Create Supabase project
2. Run database_schema.sql
3. Run DEPLOY_SQL_SCRIPTS.sql
→ You now have a database with data
```

### Phase 2: Backend (30 min)
```
1. Deploy to Railway
2. Add environment variables
→ You now have a working API
```

### Phase 3: Frontend (30 min)
```
1. Deploy to Vercel
2. Add environment variable (API URL)
→ You now have a working website
```

### Phase 4: Test (45 min)
```
1. Login (owner@lsccoffeeclub.com)
2. Create a product
3. Refresh page (data persists)
4. Check public menu
5. Edit product (real-time update)
→ Everything works!
```

---

## 🎓 KEY CONCEPTS

### What is Supabase?
- Managed PostgreSQL database
- Free tier is sufficient
- You upload schema, add data, it works
- Backend connects to it

### What is Railway?
- Runs your backend code
- Automatically builds & deploys
- Free tier is sufficient
- Connects to Supabase via environment variables

### What is Vercel?
- Hosts your frontend React app
- Automatically builds from GitHub
- Free tier is sufficient
- Connects to Railway via VITE_API_URL

---

## 💡 IMPORTANT NOTES

### Passwords
```
Test users both use password: "password"
Email: owner@lsccoffeeclub.com
Email: admin@visualsc.co

Change these BEFORE showing to customers!
```

### Credentials
- Save Supabase credentials in a text file
- Never commit them to GitHub
- Add them to Railway/Vercel as environment variables
- Keep them secure

### URLs You'll Get
```
SUPABASE:    https://xxxxx.supabase.co
RAILWAY:     https://xxxxx.up.railway.app
VERCEL:      https://xxxxx.vercel.app
PUBLIC MENU: https://xxxxx.vercel.app/lsc-coffee-club
```

---

## ✅ BEFORE YOU START

- [ ] Do you have 3-4 hours available?
- [ ] Are you logged into GitHub?
- [ ] Have you created Supabase/Railway/Vercel accounts?
- [ ] Do you have `database_schema.sql` and this repo?
- [ ] Have you read this file?

If all checked, move to **DEPLOY_NOW.md**

---

## 🆘 IF SOMETHING GOES WRONG

### "I don't understand a step"
→ Slow down. Re-read that section of DEPLOY_NOW.md  
→ Each step is very specific

### "Something failed"
→ Read the error message carefully  
→ Check you followed the step exactly  
→ Try the SQL script in Supabase SQL Editor directly

### "It's taking too long"
→ That's normal. Builds can take 10-15 minutes  
→ Don't refresh. Just wait.

### "I'm stuck"
→ Take a screenshot of the error  
→ Go back to the previous step and verify it worked  
→ Check you have correct credentials

---

## 📞 SUPPORT

### Common Issues

**"Supabase project won't create"**
- Wait 5 minutes, try again
- Check you have a valid payment method on file
- Try a different region

**"Railway build fails"**
- Check you have environment variables set
- Check Supabase credentials are correct
- Check there are no typos

**"Login doesn't work"**
- Verify email/password: owner@lsccoffeeclub.com / password
- Check Railway backend is running (green status)
- Check VITE_API_URL in Vercel environment

**"No products on public menu"**
- Check Supabase has products (Table Editor)
- Check API endpoint works: https://railway.../api/products/lsc-coffee-club
- Check VITE_API_URL is correct

---

## 🎯 SUCCESS LOOKS LIKE

After completing all steps:

✅ You can login to admin dashboard  
✅ You can create a product  
✅ Product persists after refresh  
✅ Product appears on public menu  
✅ You can edit price, change appears in real-time  
✅ You have a QR code to share  
✅ Everything works  

---

## 📊 TRACK YOUR PROGRESS

Use **DEPLOYMENT_CHECKLIST.md** to:
- Check off each step as you complete it
- Take screenshots as evidence
- Note any issues encountered
- Document your URLs

---

## 🚀 YOU'RE READY

Everything is written. All code is ready. All documentation is clear.

You just need to follow the steps in DEPLOY_NOW.md in order.

**Next action:** Open DEPLOY_NOW.md and start with Phase 1, Step 1.1

---

## ⏰ ESTIMATED TIMELINE

```
NOW: Reading this file (5 min)
+30 min: Supabase setup complete
+60 min: Backend deployed
+90 min: Frontend deployed  
+135 min: All testing complete
= 3-4 HOURS TOTAL (including reading)
```

By tonight, you'll have a working pilot.

---

## 🎉 THE PAYOFF

After 3-4 hours of work:

- Real backend
- Real database
- Real frontend
- Real working pilot
- Real product management
- Real data persistence
- Real-time updates
- URL to share with customers

**NOT A DEMO.** A real, working pilot you can show LSC Coffee Club this week.

---

**Let's go. Open DEPLOY_NOW.md next.**

✅ Good luck! You've got this.
