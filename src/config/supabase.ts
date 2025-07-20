import { createClient } from '@supabase/supabase-js'

// These should be replaced with your actual Supabase project credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
