import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate environment variables
function validateSupabaseConfig(): { url: string; key: string } | null {
  if (!supabaseUrl) {
    console.error(
      '[VISUALSC] Missing VITE_SUPABASE_URL environment variable. ' +
      'Create a .env.local file with your Supabase project URL.'
    )
    return null
  }

  if (!supabaseAnonKey) {
    console.error(
      '[VISUALSC] Missing VITE_SUPABASE_ANON_KEY environment variable. ' +
      'Create a .env.local file with your Supabase anon key.'
    )
    return null
  }

  // Basic validation of URL format
  if (!supabaseUrl.includes('supabase.co')) {
    console.error(
      '[VISUALSC] Invalid VITE_SUPABASE_URL. ' +
      'Expected format: https://your-project-ref.supabase.co'
    )
    return null
  }

  // Basic validation of key format
  if (!supabaseAnonKey.startsWith('eyJ')) {
    console.error(
      '[VISUALSC] Invalid VITE_SUPABASE_ANON_KEY. ' +
      'Ensure you copied the complete anon key from Supabase settings.'
    )
    return null
  }

  return { url: supabaseUrl, key: supabaseAnonKey }
}

// Create Supabase client
let supabase: SupabaseClient

const config = validateSupabaseConfig()

if (config) {
  // Production: Supabase properly configured
  supabase = createClient(config.url, config.key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })
} else {
  // Development: Missing credentials - create a non-functional client
  // This allows the app to load and show helpful error messages
  console.warn(
    '[VISUALSC] Supabase not configured. ' +
    'Public pages will render, but authentication and database operations will fail. ' +
    'See .env.example for setup instructions.'
  )
  
  // Create a placeholder client that will fail gracefully on operations
  supabase = createClient(
    'https://placeholder.supabase.co',
    'placeholder-key',
    {
      auth: { persistSession: false },
    }
  )
}

// Helper to check if Supabase is properly configured
export function isSupabaseConfigured(): boolean {
  return Boolean(config)
}

// Helper to get configuration status for UI/debugging
export function getSupabaseStatus(): {
  configured: boolean
  message: string
} {
  if (!config) {
    return {
      configured: false,
      message:
        'Supabase not configured. ' +
        'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local',
    }
  }

  return {
    configured: true,
    message: `Connected to Supabase project at ${config.url}`,
  }
}

export { supabase }
