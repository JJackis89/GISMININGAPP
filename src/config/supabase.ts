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

// Create client with ultra-safe error handling
let supabase: any

try {
  if (hasRealCredentials) {
    console.log('✅ Attempting to create Supabase client with real credentials')
    
    // Use the most basic configuration possible
    supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    console.log('✅ Supabase client created successfully')
    
    // Test the client immediately to catch any runtime errors
    supabase.auth.getSession().catch((testError: any) => {
      console.warn('⚠️ Supabase client test failed, but client exists:', testError)
      // Don't switch to mock client here, let the app handle auth errors gracefully
    })
    
  } else {
    console.warn('⚠️ No valid Supabase credentials found - using demo mode')
    console.log('🔄 App will run in demonstration mode with sample data')
    supabase = createMockClient()
  }
} catch (error) {
  console.error('❌ Failed to create Supabase client:', error)
  console.log('🔄 Falling back to demo mode due to initialization error')
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
