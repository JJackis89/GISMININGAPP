import { createClient } from '@supabase/supabase-js'

// Test ultra-minimal Supabase client initialization
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

console.log('🧪 Testing Supabase client creation')
console.log('URL available:', !!supabaseUrl)
console.log('Key available:', !!supabaseAnonKey)

// Test different client creation methods
function testSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.log('❌ Missing credentials')
    return null
  }

  console.log('🚀 Test 1: Minimal client creation')
  try {
    const client = createClient(supabaseUrl, supabaseAnonKey)
    console.log('✅ Test 1 passed: Basic client created')
    return client
  } catch (error) {
    console.error('❌ Test 1 failed:', error)
  }

  console.log('🚀 Test 2: Client with disabled persistence')
  try {
    const client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    })
    console.log('✅ Test 2 passed: Client with disabled persistence')
    return client
  } catch (error) {
    console.error('❌ Test 2 failed:', error)
  }

  console.log('❌ All tests failed')
  return null
}

export const testClient = testSupabaseClient()
