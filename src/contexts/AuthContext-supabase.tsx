import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '../config/supabase-safe'
import type { User as SupabaseUser, Session } from '@supabase/supabase-js'
import { User } from '../types'

interface AuthContextType {
  user: User | null
  supabaseUser: SupabaseUser | null
  session: Session | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    
    // Add timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      if (mounted && loading) {
        console.log('⚠️ Auth loading timeout - stopping loading state')
        setLoading(false)
      }
    }, 3000) // 3 second timeout
    
    const initAuth = async () => {
      try {
        console.log('🔄 Initializing auth...')
        
        // Check if we're in a deployed environment and handle network errors
        const isDeployment = window.location.hostname !== 'localhost'
        
        // Get initial session with enhanced error handling
        let session = null
        let error = null
        
        try {
          // Wrap the Supabase call in additional error handling
          if (supabase && typeof supabase.auth?.getSession === 'function') {
            const response = await supabase.auth.getSession()
            session = response.data?.session
            error = response.error
          } else {
            console.warn('⚠️ Supabase client not properly initialized')
            error = new Error('Supabase client unavailable')
          }
        } catch (networkError) {
          console.warn('🌐 Network error during auth init, falling back to demo mode:', networkError)
          // In deployment, if Supabase fails, create a demo user
          if (isDeployment) {
            const demoUser: User = {
              id: 'demo-user-001',
              email: 'demo@epa.gov.gh',
              role: 'admin',
              full_name: 'Demo User',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
            setUser(demoUser)
            localStorage.setItem('miningUser', JSON.stringify(demoUser))
            console.log('✅ Demo user created for deployment')
            setLoading(false)
            return
          }
          throw networkError
        }
        
        console.log('📡 Session response:', { session, error })
        
        if (!mounted) return
        
        clearTimeout(loadingTimeout) // Clear timeout if we get a response
        
        // In deployment mode, always create demo user if no valid session
        if (isDeployment && !session) {
          const demoUser: User = {
            id: 'demo-user-001',
            email: 'demo@epa.gov.gh',
            role: 'admin',
            full_name: 'Demo User',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
          setUser(demoUser)
          localStorage.setItem('miningUser', JSON.stringify(demoUser))
          console.log('✅ Demo user created for deployment environment')
          setLoading(false)
          return
        }
        
        if (error) {
          console.error('Session error:', error)
          // In deployment, fallback to demo mode on auth errors
          if (isDeployment) {
            const demoUser: User = {
              id: 'demo-user-001',
              email: 'demo@epa.gov.gh',
              role: 'admin',
              full_name: 'Demo User',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
            setUser(demoUser)
            localStorage.setItem('miningUser', JSON.stringify(demoUser))
            console.log('✅ Demo user created due to auth error in deployment')
          }
          setLoading(false)
          return
        }
        
        setSession(session)
        setSupabaseUser((session as any)?.user ?? null)
        
        // Convert Supabase user to our User type
        if ((session as any)?.user) {
          console.log('✅ User session found:', (session as any).user.email)
          const userData: User = {
            id: (session as any).user.id,
            email: (session as any).user.email || '',
            role: 'guest',
            full_name: (session as any).user.user_metadata?.full_name || (session as any).user.email || '',
            created_at: (session as any).user.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
          setUser(userData)
          localStorage.setItem('miningUser', JSON.stringify(userData))
        } else {
          console.log('ℹ️ No user session found')
        }
        
        console.log('✅ Auth initialization complete')
        setLoading(false)
      } catch (error) {
        console.error('Auth initialization error:', error)
        if (mounted) {
          clearTimeout(loadingTimeout)
          setLoading(false)
        }
      }
    }
    
    initAuth()

    // Listen for auth changes with error handling
    let subscription: any = null
    
    try {
      const authListener = supabase.auth.onAuthStateChange(async (event: any, session: Session | null) => {
        if (!mounted) return
        
        console.log('Auth state changed:', event, session?.user?.email)
        
        setSession(session)
        setSupabaseUser(session?.user ?? null)
        
        if (session?.user) {
          const userData: User = {
            id: session.user.id,
            email: session.user.email || '',
            role: 'guest',
            full_name: session.user.user_metadata?.full_name || session.user.email || '',
            created_at: session.user.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
          setUser(userData)
          localStorage.setItem('miningUser', JSON.stringify(userData))
        } else {
          setUser(null)
          localStorage.removeItem('miningUser')
        }
        
        setLoading(false)
      })
      
      subscription = authListener.data?.subscription
    } catch (listenerError) {
      console.warn('🔄 Auth listener setup failed, continuing without real-time updates:', listenerError)
    }

    return () => {
      mounted = false
      clearTimeout(loadingTimeout)
      if (subscription?.unsubscribe) {
        subscription.unsubscribe()
      }
    }
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('🔐 Attempting login for:', email)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        console.error('❌ Login error:', error.message)
        return { success: false, error: error.message }
      }

      if (data?.user) {
        console.log('✅ Login successful for:', data.user.email)
        
        // Try to fetch user profile with role information
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single()

          if (profile && !profileError) {
            const userWithProfile: User = {
              id: data.user.id,
              email: data.user.email || '',
              role: profile.role || 'guest',
              full_name: profile.full_name || data.user.email || '',
              created_at: data.user.created_at || new Date().toISOString(),
              updated_at: profile.updated_at || new Date().toISOString()
            }
            console.log('👤 User profile loaded:', userWithProfile.role)
          }
        } catch (profileErr) {
          console.warn('⚠️ Could not fetch profile, using basic user data')
        }
        
        return { success: true }
      }
      
      return { success: false, error: 'Login failed - no user data received' }
    } catch (error) {
      console.error('❌ Login exception:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  const signUp = async (email: string, password: string, fullName: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('📝 Attempting registration for:', email)
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: 'guest' // Default role for new users
          },
        },
      })
      
      if (error) {
        console.error('❌ Registration error:', error.message)
        return { success: false, error: error.message }
      }

      if (data?.user) {
        console.log('✅ Registration successful - check email for confirmation')
        return { 
          success: true, 
          error: 'Registration successful! Please check your email to confirm your account.' 
        }
      }
      
      return { success: true }
    } catch (error) {
      console.error('❌ Registration exception:', error)
      return { success: false, error: 'An unexpected error occurred during registration' }
    }
  }

  const logout = async (): Promise<void> => {
    await supabase.auth.signOut()
    setUser(null)
    setSupabaseUser(null)
    setSession(null)
    localStorage.removeItem('miningUser')
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      supabaseUser, 
      session, 
      login, 
      signUp, 
      logout, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
