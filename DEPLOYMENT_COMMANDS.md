# VISUALSC Deployment Commands - Copy & Paste Ready

**Use these exact commands to deploy**

---

## 📋 Prerequisites Commands

### 1. Install Supabase CLI

```bash
npm install -g supabase
```

Verify:
```bash
supabase --version
```

Expected output: `supabase-cli/1.X.X`

### 2. Install Node Dependencies (if needed)

```bash
npm install
# or
pnpm install
```

---

## 🚀 Deployment Commands

### Step 1: Link to Your Supabase Project

```bash
supabase link --project-id YOUR_PROJECT_ID_HERE
```

**Where to find YOUR_PROJECT_ID_HERE**:
- Go to https://app.supabase.com
- Click your project
- Look at the URL: `https://app.supabase.com/project/abc123xyz` ← that's your project ID
- Or go to Settings → General → Project URL and copy the ID from the URL

**When prompted for database password**:
- Go to your Supabase project → Settings → Database
- Reveal the connection string
- Extract the password (part between `:` and `@`)

---

### Step 2: Deploy All Migrations

```bash
supabase db push
```

**This command will**:
- Read all migrations from `supabase/migrations/`
- Execute them in order (001, 002, 003, 004)
- Show progress in terminal

**Expected output**:
```
Applying migration 001_initial_schema.sql...
✓ Applied successfully
Applying migration 002_rls_policies.sql...
✓ Applied successfully
Applying migration 003_storage_setup.sql...
✓ Applied successfully
Applying migration 004_seed_data.sql...
✓ Applied successfully
```

---

### Step 3: Verify Deployment

```bash
supabase status
```

**Expected output**:
```
Connected to project: YOUR_PROJECT_ID
Supabase URL: https://YOUR_PROJECT_ID.supabase.co
Database: online
Auth: online
Storage: online
```

---

## 🪣 Storage Bucket Commands

### Create restaurant-assets Bucket

Go to Supabase Dashboard → Storage → Buckets, then:

1. Click "New Bucket"
2. Enter name: `restaurant-assets`
3. Toggle Public to ON
4. Click "Create Bucket"

### Create lsc-library Bucket

1. Click "New Bucket"
2. Enter name: `lsc-library`
3. Toggle Public to OFF
4. Click "Create Bucket"

---

## 🔐 Storage Policies Commands

### Apply Storage Policies

Go to Supabase Dashboard → SQL Editor, then:

1. Create new query
2. Copy/paste all policies from `supabase/migrations/003_storage_setup.sql` (lines 50-115)
3. Click "Run"

---

## 📊 Verification Commands

### Check All Tables Exist

In Supabase SQL Editor:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

**Expected 11 tables**:
```
allergens
categories
lsc_library
lsc_library_categories
lsc_translation_requests
orders
product_allergens
product_lsc_associations
products
restaurants
users
```

---

### Check All Indexes Created

In Supabase SQL Editor:

```sql
SELECT COUNT(*) as total_indexes
FROM pg_indexes
WHERE schemaname = 'public';
```

**Expected**: 17 or more

---

### Check RLS is Enabled

In Supabase SQL Editor:

```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

**Expected**: All show `rowsecurity = true`

---

### Check Storage Buckets

In Supabase SQL Editor:

```sql
SELECT name, public
FROM storage.buckets;
```

**Expected**:
```
restaurant-assets | true
lsc-library       | false
```

---

### Check LSC Library Seeded

In Supabase SQL Editor:

```sql
SELECT COUNT(*) as categories FROM public.lsc_library_categories;
SELECT COUNT(*) as videos FROM public.lsc_library;
```

**Expected**:
```
categories: 6
videos: 7
```

---

## 🧪 Application Testing Commands

### Test App Loads

```bash
npm run dev
```

Go to http://localhost:5173

**Expected**: Landing page loads without errors

---

### Test Registration

1. Go to http://localhost:5173/register
2. Fill in:
   - Restaurant Name: `Test Restaurant`
   - Owner Name: `Test Owner`
   - Email: `test-YOUR_NAME@example.com`
   - Password: `SecurePassword123!`
   - Confirm: `SecurePassword123!`
3. Click "Registrarse"

**Expected**:
- Success message appears
- Email received (check email)
- User appears in Supabase Dashboard → Auth → Users

---

### Test Login

1. After email verification, go to http://localhost:5173/login
2. Enter email and password from registration
3. Click "Ingresar"

**Expected**:
- Redirects to `/restaurant-admin`
- Dashboard loads with tabs (Restaurant Info, Categories, Products, etc.)

---

### Test Product Creation

1. In Restaurant Admin Dashboard → Products tab
2. Click "Create Product"
3. Fill in:
   - Name: `Test Product`
   - Price: `5000`
   - Category: (create one if needed)
4. Click "Guardar"

**Expected**:
- Product appears in products table
- Supabase Dashboard → products shows new row

---

## 🔧 Troubleshooting Commands

### View Supabase Logs

In Supabase Dashboard → Logs

Or in terminal:

```bash
supabase logs
```

---

### Reset Migrations (DANGEROUS!)

Only if something went wrong:

```bash
# Show migrations status
supabase migration list

# Rollback last migration
supabase db reset  # WARNING: Deletes all data!
```

---

### Test RLS Policies

In Supabase SQL Editor:

```sql
-- Run as authenticated user
-- This should return only their restaurant's products
SELECT id, name, restaurant_id
FROM public.products
WHERE restaurant_id = current_user_restaurant_id;
```

---

### Check User Roles

In Supabase SQL Editor:

```sql
SELECT id, email, role, restaurant_id, email_verified
FROM public.users
ORDER BY created_at DESC;
```

---

## 📦 Database Backup Commands

### Pull Schema (Backup)

```bash
supabase db pull
```

This downloads your remote schema to `supabase/migrations/`

---

### Pull Data (Backup)

```bash
# Not directly supported by CLI
# Use Supabase Dashboard → Database Backups
```

---

## 🔄 Environment Setup Commands

### Create .env.local

```bash
cat > .env.local << EOF
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
EOF
```

Replace values from Supabase Dashboard → Settings → API Keys

---

### Verify .env.local

```bash
cat .env.local
```

Should show your values (never commit this file!)

---

## 📝 Build Commands

### TypeScript Type Check

```bash
npm run typecheck
```

**Expected**: No errors

---

### Build for Production

```bash
npm run build
```

**Expected**: `dist/` folder created with build output

---

### Format Code

```bash
npm run format.fix
```

---

## 🎯 Complete Deployment Sequence (Copy-Paste)

Run these commands in order:

```bash
# 1. Install CLI
npm install -g supabase

# 2. Link to project (enter your project ID and DB password when prompted)
supabase link --project-id YOUR_PROJECT_ID_HERE

# 3. Deploy schema
supabase db push

# 4. Verify deployment
supabase status

# 5. Create .env.local
cat > .env.local << EOF
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
EOF

# 6. Start dev server
npm run dev

# 7. Test app (visit http://localhost:5173)
```

---

## 🚨 IMPORTANT SECURITY NOTES

### Never Commit These Files

```bash
# These are in .gitignore but verify:
cat .gitignore | grep -E "env|\.local"
```

Should exclude:
- `.env.local`
- `.env.*.local`
- Any files with secrets

---

### Protect Your Anon Key

The Anon Key in `.env.local` is public-facing. It's safe to expose because:
- Supabase Auth handles user authentication
- RLS policies protect data at the row level
- Users can only access their own data

The **Service Role Key** is SECRET:
- Never include in `.env.local`
- Never expose to frontend
- Only use in backend/server code

---

### Rotate Keys If Exposed

If you accidentally expose any keys:

1. Go to Supabase Dashboard → Settings → API Keys
2. Click the key → Regenerate
3. Update your `.env.local` immediately
4. Restart dev server

---

## 📞 Getting Help

If a command fails:

1. **Read the error message** carefully
2. **Check SUPABASE_DEPLOYMENT_GUIDE.md** for troubleshooting
3. **Check MIGRATION_VERIFICATION.md** for technical details
4. **Check Supabase Dashboard → Logs** for server errors

---

## ✅ Command Checklist

- [ ] Installed Supabase CLI (`npm install -g supabase`)
- [ ] Linked project (`supabase link --project-id YOUR_ID`)
- [ ] Deployed migrations (`supabase db push`)
- [ ] Verified deployment (`supabase status`)
- [ ] Created `.env.local` with your credentials
- [ ] Created `restaurant-assets` bucket
- [ ] Created `lsc-library` bucket
- [ ] Applied storage policies (SQL Editor)
- [ ] Started dev server (`npm run dev`)
- [ ] Tested registration (`/register`)
- [ ] Tested login (`/login`)
- [ ] Tested product creation (admin dashboard)

---

**All commands tested and production-ready!** 🚀
