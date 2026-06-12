-- VISUALSC Production Database Schema - Storage Configuration
-- Migration: 003_storage_setup.sql
-- Created: 2024
-- Purpose: Configure storage buckets and access policies
--
-- IMPORTANT: Storage buckets and policies are managed in Supabase UI
-- This file documents the exact configuration to apply manually
--
-- Step-by-step manual instructions are included below

-- ============================================================================
-- STORAGE BUCKET CREATION (Manual in Supabase UI)
-- ============================================================================
--
-- Bucket 1: restaurant-assets
-- ├─ Purpose: Restaurant logos, banners, product images
-- ├─ Public: Yes (for displaying images in public menus)
-- ├─ File size limit: 50MB per file
-- └─ Naming convention: <restaurant-id>/<type>/<timestamp>-<filename>
--
-- Bucket 2: lsc-library
-- ├─ Purpose: Master LSC video files (Super Admin only)
-- ├─ Public: No (private - only Super Admin uploads)
-- ├─ File size limit: 500MB per file
-- └─ Naming convention: <category>/<timestamp>-<filename>
--
-- Steps to create in Supabase Dashboard:
-- 1. Go to Storage → Buckets
-- 2. Click "New Bucket"
-- 3. Name: restaurant-assets, Public: ON, Create
-- 4. Click "New Bucket"
-- 5. Name: lsc-library, Public: OFF, Create

-- ============================================================================
-- STORAGE POLICIES (Apply in Supabase SQL Editor)
-- ============================================================================

-- Policy: restaurant-assets bucket - Public read (anyone can view images)
CREATE POLICY "Allow public read restaurant-assets"
ON storage.objects
FOR SELECT
USING (bucket_id = 'restaurant-assets');

-- Policy: restaurant-assets bucket - Users upload to their restaurant folder
CREATE POLICY "Allow users upload restaurant assets"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'restaurant-assets'
  AND auth.uid() IN (
    SELECT id FROM public.users WHERE role = 'admin'
  )
);

-- Policy: restaurant-assets bucket - Users delete their own uploads
CREATE POLICY "Allow users delete restaurant assets"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'restaurant-assets'
  AND auth.uid() IN (
    SELECT id FROM public.users WHERE role = 'admin'
  )
);

-- Policy: lsc-library bucket - Only Super Admin can read
CREATE POLICY "Allow super admin read lsc-library"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'lsc-library'
  AND auth.uid() IN (
    SELECT id FROM public.users WHERE role = 'super_admin'
  )
);

-- Policy: lsc-library bucket - Only Super Admin can upload
CREATE POLICY "Allow super admin upload lsc-library"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'lsc-library'
  AND auth.uid() IN (
    SELECT id FROM public.users WHERE role = 'super_admin'
  )
);

-- Policy: lsc-library bucket - Only Super Admin can delete
CREATE POLICY "Allow super admin delete lsc-library"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'lsc-library'
  AND auth.uid() IN (
    SELECT id FROM public.users WHERE role = 'super_admin'
  )
);

-- ============================================================================
-- STORAGE CONFIGURATION CHECKLIST
-- ============================================================================
--
-- MANUAL STEPS IN SUPABASE DASHBOARD:
--
-- 1. Create Buckets:
--    ☐ Navigate to Storage → Buckets
--    ☐ Create "restaurant-assets" (Public: ON)
--    ☐ Create "lsc-library" (Public: OFF)
--
-- 2. Enable Storage RLS:
--    ☐ Go to Authentication → Policies
--    ☐ Toggle "Enable RLS" for storage.objects (if not already)
--
-- 3. Apply Policies:
--    ☐ Go to SQL Editor
--    ☐ Copy/paste the policies above (lines 50-115)
--    ☐ Click "Run" for each policy
--
-- 4. Verify Bucket Configuration:
--    ☐ restaurant-assets: Public = ON, CORS enabled
--    ☐ lsc-library: Public = OFF (private)
--
-- 5. Test Access:
--    ☐ Upload a test image to restaurant-assets as user
--    ☐ Verify public URL works (bucket_id/path/to/file)
--    ☐ Verify lsc-library is not publicly accessible

-- ============================================================================
-- STORAGE USAGE IN APPLICATION CODE
-- ============================================================================
--
-- Reference: client/lib/storage.ts
--
-- Functions that interact with storage:
--
-- 1. uploadRestaurantAsset(restaurantId, file, type)
--    └─ Uploads to: restaurant-assets/<restaurant-id>/<type>/<timestamp>
--    └─ Returns: public URL
--
-- 2. uploadProductImage(restaurantId, productId, file)
--    └─ Uploads to: restaurant-assets/<restaurant-id>/products/<product-id>/<timestamp>
--    └─ Returns: public URL
--
-- 3. uploadLSCVideo(file, libraryName)
--    └─ Uploads to: lsc-library/<category>/<timestamp>
--    └─ Returns: private URL (Super Admin only)
--
-- 4. deleteFile(bucketId, path)
--    └─ Deletes file from bucket
--    └─ Requires appropriate RLS policy
--
-- 5. getPublicUrl(bucketId, path)
--    └─ Returns public URL for a file
--    └─ Works for public buckets (restaurant-assets)

-- ============================================================================
-- TROUBLESHOOTING STORAGE ISSUES
-- ============================================================================
--
-- Issue: "User not allowed to access this bucket"
-- → Solution: Check RLS policies are applied correctly
-- → Check user.role = 'admin' or 'super_admin' in users table
--
-- Issue: "File not found" when accessing public URL
-- → Solution: Verify file was uploaded successfully
-- → Check bucket_id and path in URL: https://<project>.supabase.co/storage/v1/object/public/<bucket>/<path>
--
-- Issue: LSC video upload fails for non-Super Admin
-- → Solution: This is correct. Only Super Admin should upload to lsc-library
--
-- Issue: Product images not loading in menu
-- → Solution: Verify restaurant-assets bucket is public and file exists
-- → Check image_url in products table matches actual file path

-- ============================================================================
-- NEXT STEPS
-- ============================================================================
--
-- 1. Create both buckets in Supabase Dashboard
-- 2. Enable RLS on storage.objects
-- 3. Run the storage policies above in SQL Editor
-- 4. Verify buckets are accessible by running a test file upload
-- 5. Continue to 004_seed_data.sql
