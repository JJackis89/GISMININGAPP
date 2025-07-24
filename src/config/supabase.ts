import { createClient } from '@supabase/supabase-js'

// Get environment variables with fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Check if we have real Supabase credentials
const hasRealCredentials = supabaseUrl && 
                          supabaseAnonKey && 
                          supabaseUrl.startsWith('https://') &&
                          supabaseUrl.includes('.supabase.co') &&
                          supabaseAnonKey.startsWith('eyJ')

console.log('🔍 Supabase config check:', {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  urlValid: supabaseUrl?.startsWith('https://'),
  hasRealCredentials
})

// Create mock client for demo purposes
const createMockClient = () => ({
  auth: {
    getSession: () => Promise.resolve({ 
      data: { session: null }, 
      error: null 
    }),
    onAuthStateChange: () => ({ 
      data: { 
        subscription: { unsubscribe: () => {} } 
      } 
    }),
    signInWithPassword: () => Promise.resolve({ 
      data: { user: null, session: null },
      error: null 
    }),
    signUp: () => Promise.resolve({ 
      data: { user: null, session: null },
      error: null 
    }),
    signOut: () => Promise.resolve({ error: null })
  }
})

// Create client with robust error handling
let supabase: any

if (hasRealCredentials) {
  console.log('✅ Using real Supabase credentials')
  try {
    // Create client with minimal, safe configuration
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false
      }
    })
    
    console.log('✅ Supabase client created successfully')
  } catch (error) {
    console.error('❌ Failed to create Supabase client:', error)
    console.log('🔄 Falling back to demo mode')
    supabase = createMockClient()
  }
} else {
  console.warn('⚠️ No valid Supabase credentials found - using demo mode')
  console.log('🔄 App will run in demonstration mode with sample data')
  supabase = createMockClient()
}

export { supabase }

// Database Types
export interface User {
  id: string
  email: string
  role: 'admin' | 'staff' | 'guest'
  full_name?: string
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  user_id: string
  full_name: string
  role: 'admin' | 'staff' | 'guest'
  department?: string
  created_at: string
  updated_at: string
}
