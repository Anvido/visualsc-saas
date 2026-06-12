import { supabase, isSupabaseConfigured } from './supabase'

const BUCKETS = {
  RESTAURANT_ASSETS: 'restaurant-assets',
  LSC_LIBRARY: 'lsc-library',
} as const

// Upload paths for organization
const UPLOAD_PATHS = {
  LOGO: 'logos',
  BANNER: 'banners',
  PRODUCT_IMAGES: 'product-images',
  LSC_VIDEOS: 'videos',
} as const

/**
 * Upload restaurant logo or banner
 */
export async function uploadRestaurantAsset(
  restaurantId: string,
  file: File,
  type: 'logo' | 'banner'
): Promise<string | null> {
  if (!isSupabaseConfigured()) {
    console.error('Supabase not configured')
    return null
  }

  try {
    const path = `${UPLOAD_PATHS[type.toUpperCase() as keyof typeof UPLOAD_PATHS]}/${restaurantId}/${Date.now()}-${file.name}`

    const { error: uploadError } = await supabase.storage
      .from(BUCKETS.RESTAURANT_ASSETS)
      .upload(path, file, { upsert: true })

    if (uploadError) throw uploadError

    const { data } = supabase.storage
      .from(BUCKETS.RESTAURANT_ASSETS)
      .getPublicUrl(path)

    return data.publicUrl
  } catch (err) {
    console.error(`Error uploading ${type}:`, err)
    throw err
  }
}

/**
 * Upload product image
 */
export async function uploadProductImage(
  restaurantId: string,
  productId: string,
  file: File
): Promise<string | null> {
  if (!isSupabaseConfigured()) {
    console.error('Supabase not configured')
    return null
  }

  try {
    const path = `${UPLOAD_PATHS.PRODUCT_IMAGES}/${restaurantId}/${productId}/${Date.now()}-${file.name}`

    const { error: uploadError } = await supabase.storage
      .from(BUCKETS.RESTAURANT_ASSETS)
      .upload(path, file)

    if (uploadError) throw uploadError

    const { data } = supabase.storage
      .from(BUCKETS.RESTAURANT_ASSETS)
      .getPublicUrl(path)

    return data.publicUrl
  } catch (err) {
    console.error('Error uploading product image:', err)
    throw err
  }
}

/**
 * Upload LSC video (Super Admin only)
 */
export async function uploadLSCVideo(
  file: File,
  libraryName: string
): Promise<string | null> {
  if (!isSupabaseConfigured()) {
    console.error('Supabase not configured')
    return null
  }

  try {
    const path = `${libraryName}/${Date.now()}-${file.name}`

    const { error: uploadError } = await supabase.storage
      .from(BUCKETS.LSC_LIBRARY)
      .upload(path, file)

    if (uploadError) throw uploadError

    const { data } = supabase.storage
      .from(BUCKETS.LSC_LIBRARY)
      .getPublicUrl(path)

    return data.publicUrl
  } catch (err) {
    console.error('Error uploading LSC video:', err)
    throw err
  }
}

/**
 * Delete file from storage
 */
export async function deleteFile(
  bucket: 'restaurant-assets' | 'lsc-library',
  path: string
): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    console.error('Supabase not configured')
    return false
  }

  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    if (error) throw error

    return true
  } catch (err) {
    console.error('Error deleting file:', err)
    return false
  }
}

/**
 * Get public URL for a stored file
 */
export function getPublicUrl(
  bucket: 'restaurant-assets' | 'lsc-library',
  path: string
): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}
