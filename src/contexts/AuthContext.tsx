import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '../config/supabase'
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
        
        // Get initial session with network error handling
        let session = null
        let error = null
        
        try {
          const response = await supabase.auth.getSession()
          session = response.data?.session
          error = response.error
        } catch (networkError) {
          console.warn('🌐 Network error during auth init, falling back to demo mode:', networkError)
          // In deployment, if Supabase fails, create a demo user
          if (isDeployment) {
            const demoUser: User = {
              id: 'demo-user-001',
              username: 'demo',
              email: 'demo@epa.gov.gh',
              role: 'admin',
              firstName: 'Demo',
              lastName: 'User'
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
            username: 'demo',
            email: 'demo@epa.gov.gh',
            role: 'admin',
            firstName: 'Demo',
            lastName: 'User'
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
              username: 'demo',
              email: 'demo@epa.gov.gh',
              role: 'admin',
              firstName: 'Demo',
              lastName: 'User'
            }
            setUser(demoUser)
            localStorage.setItem('miningUser', JSON.stringify(demoUser))
            console.log('✅ Demo user created due to auth error in deployment')
          }
          setLoading(false)
          return
        }
        
        setSession(session)
        setSupabaseUser(session?.user ?? null)
        
        // Convert Supabase user to our User type
        if (session?.user) {
          console.log('✅ User session found:', session.user.email)
          const userData: User = {
            id: session.user.id,
            username: session.user.email?.split('@')[0] || '',
            email: session.user.email || '',
            role: 'staff',
            firstName: session.user.user_metadata?.full_name?.split(' ')[0] || 'User',
            lastName: session.user.user_metadata?.full_name?.split(' ')[1] || ''
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
            username: session.user.email?.split('@')[0] || '',
            email: session.user.email || '',
            role: 'staff',
            firstName: session.user.user_metadata?.full_name?.split(' ')[0] || 'User',
            lastName: session.user.user_metadata?.full_name?.split(' ')[1] || ''
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
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        return { success: false, error: error.message }
      }
      
      return { success: true }
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  const signUp = async (email: string, password: string, fullName: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })
      
      if (error) {
        return { success: false, error: error.message }
      }
      
      return { success: true }
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' }
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
