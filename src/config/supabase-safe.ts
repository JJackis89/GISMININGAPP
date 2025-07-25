import { createClient } from '@supabase/supabase-js'

// Ultra-safe Supabase wrapper - completely bypasses problematic client creation
// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Check if we have real credentials
const hasValidCredentials = supabaseUrl && 
                           supabaseAnonKey && 
                           supabaseUrl.startsWith('https://') &&
                           supabaseUrl.includes('.supabase.co') &&
                           supabaseAnonKey.startsWith('eyJ')

console.log('🔍 Supabase config check:', {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  urlValid: supabaseUrl?.startsWith('https://'),
  hasValidCredentials
})

// Determine if we're in production/deployment environment
const isDeployment = typeof window !== 'undefined' && 
                    (window.location.hostname !== 'localhost' && 
                     window.location.hostname !== '127.0.0.1')

console.log('🌍 Environment check:', {
  hostname: typeof window !== 'undefined' ? window.location.hostname : 'server',
  isDeployment,
  shouldUseReal: hasValidCredentials
})

// Create a safe Supabase client
function createSafeSupabaseClient() {
  // Always try real Supabase client first if we have valid credentials
  if (hasValidCredentials) {
    console.log('� Attempting real Supabase authentication')
    
    try {
      // Use the imported createClient function with minimal config
      const realClient = createClient(supabaseUrl, supabaseAnonKey)

      console.log('✅ Real Supabase client created successfully')
      return realClient
      
    } catch (error) {
      console.error('❌ Real Supabase client failed:', error)
      console.log('🔄 Falling back to mock client for safety')
      return createMockClient()
    }
  }

  // Fallback to mock if no valid credentials
  console.log('🎭 No valid credentials - using demo mode')
  return createMockClient()
}

// Enhanced mock client for demo mode
function createMockClient() {
  console.log('🎭 Creating enhanced mock Supabase client')
  
  return {
    auth: {
      getSession: () => {
        console.log('📡 Mock getSession called')
        return Promise.resolve({ 
          data: { session: null }, 
          error: null 
        })
      },
      onAuthStateChange: (callback: any) => {
        console.log('👂 Mock onAuthStateChange registered')
        // Call callback immediately with no session
        setTimeout(() => {
          console.log('📡 Mock auth state change: SIGNED_OUT')
          callback('SIGNED_OUT', null)
        }, 100)
        
        return { 
          data: { 
            subscription: { 
              unsubscribe: () => {
                console.log('🔌 Mock subscription unsubscribed')
              } 
            } 
          } 
        }
      },
      signInWithPassword: (credentials: any) => {
        console.log('🔐 Mock signInWithPassword called with:', credentials?.email)
        return Promise.resolve({ 
          data: { user: null, session: null },
          error: { message: 'Demo mode - authentication not available. Configure Supabase for real authentication.' }
        })
      },
      signUp: (credentials: any) => {
        console.log('📝 Mock signUp called with:', credentials?.email)
        return Promise.resolve({ 
          data: { user: null, session: null },
          error: { message: 'Demo mode - registration not available. Configure Supabase for real authentication.' }
        })
      },
      signOut: () => {
        console.log('🚪 Mock signOut called')
        return Promise.resolve({ error: null })
      }
    },
    // Add any other Supabase methods that might be called
    from: (table: string) => ({
      select: () => Promise.resolve({
        data: [],
        error: null
      }),
      insert: () => Promise.resolve({
        data: null,
        error: { message: 'Demo mode - database operations not available' }
      }),
      update: () => Promise.resolve({
        data: null,
        error: { message: 'Demo mode - database operations not available' }
      }),
      delete: () => Promise.resolve({
        data: null,
        error: { message: 'Demo mode - database operations not available' }
      })
    })
  } as any // Use 'as any' to satisfy TypeScript for the mock
}

// Export the safe client
export const supabase = createSafeSupabaseClient()

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
