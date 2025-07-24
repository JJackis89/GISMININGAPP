import { createClient } from '@supabase/supabase-js'

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

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

// Create client with error handling
let supabase: any

if (hasRealCredentials) {
  console.log('✅ Using real Supabase credentials')
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    })
  } catch (error) {
    console.error('Failed to create Supabase client:', error)
    throw error
  }
} else {
  console.warn('⚠️ No valid Supabase credentials found.')
  console.log('📝 Please add your credentials to .env.local:')
  console.log('VITE_SUPABASE_URL=https://your-project.supabase.co')
  console.log('VITE_SUPABASE_ANON_KEY=your-anon-key')
  
  // Create a mock client for demo purposes
  supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: () => Promise.resolve({ error: { message: 'Please configure your Supabase credentials in .env.local' } }),
      signUp: () => Promise.resolve({ error: { message: 'Please configure your Supabase credentials in .env.local' } }),
      signOut: () => Promise.resolve()
    }
  }
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
