# VISUALSC Supabase Deployment Guide

**Version**: 1.0
**Last Updated**: 2024
**Status**: Production Ready

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Database Schema Deployment](#database-schema-deployment)
4. [Storage Configuration](#storage-configuration)
5. [Authentication Setup](#authentication-setup)
6. [Verification & Testing](#verification--testing)
7. [Troubleshooting](#troubleshooting)
8. [Deployment Checklist](#deployment-checklist)
9. [Rollback Procedures](#rollback-procedures)

---

## Prerequisites

### Required Software

- **Node.js** >= 18.0.0
- **npm** or **pnpm** >= 8.0.0
- **Supabase CLI** (for automated migrations)
  - Install: `npm install -g supabase`
- **PostgreSQL CLI** (psql) for advanced debugging (optional)
- **Git** (for version control)

### Supabase Account & Project

1. Create a Supabase account: https://app.supabase.com
2. Create a new project (or use existing)
3. Note your:
   - **Project ID** (visible in dashboard URL)
   - **Project URL** (https://YOUR_PROJECT_ID.supabase.co)
   - **Anon Key** (Settings → API Keys → anon key)
   - **Service Role Key** (Settings → API Keys → service_role secret) - **KEEP SECURE**

### Environment Variables

Create `.env.local` in the root directory:

```
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
```

⚠️ **SECURITY**: Never commit `.env.local` to version control. It's in `.gitignore`.

---

## Environment Setup

### Step 1: Install Supabase CLI

```bash
npm install -g supabase
```

Verify installation:

```bash
supabase --version
```

### Step 2: Configure Supabase Project Link

```bash
supabase link --project-id YOUR_PROJECT_ID
```

You'll be prompted to enter your `SUPABASE_DB_PASSWORD` (database password). Get this from:
- Supabase Dashboard → Settings → Database → Reveal Connections String

### Step 3: Verify Connection

```bash
supabase status
```

Expected output:

```
Connected to project: YOUR_PROJECT_ID
Supabase URL: https://YOUR_PROJECT_ID.supabase.co
Database: online
Auth: online
Storage: online
```

---

## Database Schema Deployment

### Overview

The VISUALSC database is split into 4 migrations for clarity and rollback capability:

| File | Purpose | Tables Created |
|------|---------|-----------------|
| `001_initial_schema.sql` | Core tables & indexes | 11 tables, 17 indexes |
| `002_rls_policies.sql` | Row-level security | 35+ RLS policies |
| `003_storage_setup.sql` | Storage configuration | Policies (manual buckets) |
| `004_seed_data.sql` | Initial LSC library | 6 categories, 7+ videos |

### Automated Deployment (Recommended)

#### Option A: Using Supabase CLI

```bash
# Navigate to project root
cd /path/to/visualsc

# Push all migrations
supabase db push

# This will:
# 1. Read all migrations from supabase/migrations/
# 2. Execute them in order (001, 002, 003, 004)
# 3. Update schema on remote project
```

#### Option B: Manual Execution (SQL Editor)

If CLI deployment fails, deploy manually:

1. Open Supabase Dashboard → SQL Editor
2. Create a new query
3. Copy/paste each migration file in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_rls_policies.sql`
   - `supabase/migrations/003_storage_setup.sql`
   - `supabase/migrations/004_seed_data.sql`
4. Click "Run" for each
5. Verify success in console

### Verification

After deployment, verify all tables exist:

```bash
# Open SQL Editor in Supabase Dashboard and run:

SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

Expected output (11 tables):

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

## Storage Configuration

### Create Storage Buckets

Storage buckets must be created manually via Supabase UI (not in SQL migrations).

#### Bucket 1: restaurant-assets

1. Go to Supabase Dashboard → Storage → Buckets
2. Click "New Bucket"
3. Configure:
   - **Name**: `restaurant-assets`
   - **Public**: Toggle ON
   - **Allowed MIME types**: `image/*` (images only)
4. Click "Create Bucket"

#### Bucket 2: lsc-library

1. Click "New Bucket"
2. Configure:
   - **Name**: `lsc-library`
   - **Public**: Toggle OFF (private)
   - **Allowed MIME types**: `video/*` (videos only)
3. Click "Create Bucket"

### Storage Policies

After creating buckets, apply storage policies:

1. Go to SQL Editor
2. Copy/paste the policies from `supabase/migrations/003_storage_setup.sql` (lines 50-115)
3. Click "Run" for each policy

### Verify Buckets

In SQL Editor:

```sql
SELECT name, public, allowed_mime_types
FROM storage.buckets
WHERE name IN ('restaurant-assets', 'lsc-library');
```

---

## Authentication Setup

### Enable Email Verification

1. Go to Supabase Dashboard → Authentication → Providers
2. Ensure "Email" provider is enabled
3. Go to Authentication → Email Templates
4. Configure:
   - **Confirmation**: Email sent after signup
   - **Invite**: (optional) Email for inviting users
   - **Magic Link**: (optional) For passwordless login
   - **Change Email**: Email when user changes email
   - **Reset Password**: Email for password reset

### Email Template Variables

Update the email templates to include your app URL. Replace `{{ .ConfirmationURL }}` with:

```
{{ .ConfirmationURL }}
```

### User Registration Flow

When a user signs up via `/register`:

1. Supabase sends verification email
2. User clicks link in email
3. User is marked as `email_verified = true` in `users` table
4. User can log in

### Test Auth Flow

1. Go to app and navigate to `/register`
2. Fill in:
   - Restaurant Name: "Test Restaurant"
   - Owner Name: "Test Owner"
   - Email: `test-YOUR_TIMESTAMP@example.com`
   - Password: (strong password)
   - Confirm Password: (same)
3. Click "Registrarse"
4. You should see confirmation message: "Email de verificación enviado"
5. Check email (or Supabase Dashboard → Auth → Users to verify)

---

## Verification & Testing

### 1. Database Schema Verification

Run these queries in SQL Editor:

```sql
-- Check all tables exist
SELECT COUNT(*) as total_tables
FROM information_schema.tables
WHERE table_schema = 'public';

-- Expected: 11

-- Check indexes
SELECT COUNT(*) as total_indexes
FROM pg_indexes
WHERE schemaname = 'public';

-- Expected: 17+
```

### 2. RLS Verification

```sql
-- Check RLS is enabled on all tables
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- All should show: rowsecurity = true
```

### 3. Storage Verification

```sql
-- Check buckets exist
SELECT name, public
FROM storage.buckets;

-- Expected:
-- restaurant-assets | true
-- lsc-library       | false
```

### 4. Application Testing

#### Test Registration

1. Open the app at `/register`
2. Fill the form completely
3. Submit
4. Verify:
   - Email verification message appears
   - New user appears in Supabase Dashboard → Auth → Users
   - New restaurant appears in `restaurants` table
   - New user appears in `users` table

#### Test Login

1. After email verification, go to `/login`
2. Enter email and password
3. Click "Ingresar"
4. Should redirect to `/restaurant-admin`
5. Verify:
   - Restaurant data loads
   - Dashboard tabs appear (Restaurant Info, Categories, Products, etc.)

#### Test Product Creation

1. In Restaurant Admin Dashboard → Products tab
2. Create a new product:
   - Name: "Test Product"
   - Price: 5000
   - Category: (create one if needed)
3. Upload product image
4. Select allergens
5. Click "Guardar"
6. Verify:
   - Product appears in products table
   - Image appears in `restaurant-assets` storage bucket
   - Can retrieve product via API

#### Test LSC Library

1. In Restaurant Admin Dashboard → Products tab
2. Edit a product
3. Click LSC Library selection
4. Verify:
   - Can see LSC library videos
   - Can select a video
5. Save product
6. Verify:
   - `lsc_library_id` is set in products table
   - `product_lsc_associations` has the link

### 5. Multi-Tenant Isolation Verification

```sql
-- As admin user of Restaurant A, verify they can't see Restaurant B data

-- Get two restaurants
SELECT id, name FROM public.restaurants LIMIT 2;

-- For each, run:
SELECT *
FROM public.products
WHERE restaurant_id = 'RESTAURANT_A_ID';

-- Should only see their own products
-- Should NOT see other restaurants' products
```

---

## Troubleshooting

### Issue: "Could not connect to Supabase"

**Symptom**: App shows blank white screen, console shows auth errors

**Solution**:
1. Verify `.env.local` exists with correct values
2. Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
3. Verify Supabase project is running (check Dashboard)
4. Refresh the browser
5. Check browser console for specific errors

### Issue: "User not allowed to access this resource"

**Symptom**: 403 errors when trying to read/write data

**Solution**:
1. Verify RLS policies are enabled (check `002_rls_policies.sql` was executed)
2. Verify user exists in `users` table with correct `restaurant_id`
3. Verify user `role` is set (should be 'admin' or 'super_admin')
4. Check RLS policies in SQL Editor:
   ```sql
   SELECT * FROM pg_policies
   WHERE schemaname = 'public'
   ORDER BY tablename;
   ```

### Issue: "Storage bucket not found"

**Symptom**: Image uploads fail, "404 Bucket not found"

**Solution**:
1. Verify buckets exist:
   ```sql
   SELECT name FROM storage.buckets;
   ```
2. Verify bucket names are exactly:
   - `restaurant-assets` (public)
   - `lsc-library` (private)
3. Recreate if necessary via Storage UI

### Issue: "Email verification not working"

**Symptom**: User registered but can't verify email

**Solution**:
1. Check Supabase Dashboard → Authentication → Email Templates
2. Verify "Email Confirmation" template is enabled
3. Check spam folder for verification email
4. Manually mark user as verified in `users` table (dev only):
   ```sql
   UPDATE public.users
   SET email_verified = true
   WHERE email = 'user@example.com';
   ```

### Issue: "Foreign key constraint violation"

**Symptom**: Error when inserting data

**Solution**:
1. Ensure parent records exist first:
   - Create `restaurants` before `users`
   - Create `restaurants` before `categories`
   - Create `categories` before `products`
2. Verify UUID format for foreign keys
3. Check that referenced IDs actually exist

---

## Deployment Checklist

### Pre-Deployment

- [ ] Supabase CLI installed and tested
- [ ] Supabase project created
- [ ] Project ID and connection details noted
- [ ] `.env.local` created with valid credentials
- [ ] All migrations exist in `supabase/migrations/`
- [ ] Backed up existing data (if upgrading)

### Database Deployment

- [ ] Run `supabase db push` (or manual SQL execution)
- [ ] Verify all 11 tables exist
- [ ] Verify all 17 indexes created
- [ ] Verify 35+ RLS policies applied
- [ ] No SQL errors in deployment logs

### Storage Configuration

- [ ] `restaurant-assets` bucket created (public)
- [ ] `lsc-library` bucket created (private)
- [ ] Storage policies applied (all 6 policies)
- [ ] Test file upload succeeds
- [ ] Public URL accessible for restaurant-assets
- [ ] Private URL blocked for lsc-library (Super Admin only)

### Authentication

- [ ] Email provider enabled
- [ ] Email verification template configured
- [ ] Password reset template configured
- [ ] Test registration flow completes
- [ ] Test login flow works

### Application Testing

- [ ] App loads without errors
- [ ] Register creates restaurant + user
- [ ] Email verification sent and received
- [ ] Login redirects to admin dashboard
- [ ] Product creation works
- [ ] Image upload works
- [ ] LSC library selection works
- [ ] RLS policies enforce multi-tenant isolation

### Post-Deployment

- [ ] Monitor error logs in Supabase Dashboard
- [ ] Test load times (reasonable response times)
- [ ] Verify nightly backups are enabled (if available)
- [ ] Document any custom configurations
- [ ] Create runbook for common operations

---

## Rollback Procedures

### Rollback Full Database

⚠️ **DANGEROUS**: Only do this if something went wrong and you have backups.

1. Contact Supabase support or use backup restore
2. Or, manually drop all tables and re-run migrations

### Rollback Single Migration

If `004_seed_data.sql` causes issues but schema is good:

```sql
-- Delete seed data
DELETE FROM public.lsc_library;
DELETE FROM public.lsc_library_categories;

-- Re-run just the seed migration
-- (copy/paste 004_seed_data.sql)
```

### Rollback Storage

To reset a bucket:

1. Go to Supabase Dashboard → Storage → Buckets
2. Click on bucket name
3. Select all files (or individual files)
4. Click "Delete"

To delete entire bucket:

```sql
-- Via Storage UI, not SQL
-- Go to Buckets, click menu, Delete bucket
```

---

## Production Readiness Checklist

- [ ] Database schema deployed and verified
- [ ] All RLS policies applied
- [ ] Storage buckets configured
- [ ] Email templates configured
- [ ] Application tested end-to-end
- [ ] Error handling in place
- [ ] Monitoring/logging enabled
- [ ] Backup strategy in place
- [ ] Documentation updated
- [ ] Team trained on operations

---

## Support & Documentation

- **Supabase Docs**: https://supabase.com/docs
- **Supabase CLI Docs**: https://supabase.com/docs/guides/cli
- **VISUALSC Project**: Check `README.md` and architecture docs

---

## Appendix: Useful SQL Queries

### See All Users

```sql
SELECT id, email, role, restaurant_id, email_verified
FROM public.users
ORDER BY created_at DESC;
```

### Count Products per Restaurant

```sql
SELECT
  r.name,
  COUNT(p.id) as product_count
FROM public.restaurants r
LEFT JOIN public.products p ON r.id = p.restaurant_id
GROUP BY r.id, r.name;
```

### Check Trial Status

```sql
SELECT
  name,
  trial_start_date,
  trial_end_date,
  CASE
    WHEN NOW() BETWEEN trial_start_date AND trial_end_date THEN 'active'
    ELSE 'expired'
  END as trial_status
FROM public.restaurants
WHERE subscription_status = 'trial';
```

### See LSC Library

```sql
SELECT
  lc.name as category,
  COUNT(l.id) as video_count
FROM public.lsc_library_categories lc
LEFT JOIN public.lsc_library l ON lc.id = l.category_id
GROUP BY lc.id, lc.name;
```

---

**Deployment completed!** 🎉

If you have issues, check the Troubleshooting section or contact support.
