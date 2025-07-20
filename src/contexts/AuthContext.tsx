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
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setSupabaseUser(session?.user ?? null)
      
      // Convert Supabase user to our User type
      if (session?.user) {
        const userData: User = {
          id: session.user.id,
          username: session.user.email?.split('@')[0] || '',
          email: session.user.email || '',
          role: 'staff', // Default role, you can enhance this
          firstName: session.user.user_metadata?.full_name?.split(' ')[0] || 'User',
          lastName: session.user.user_metadata?.full_name?.split(' ')[1] || ''
        }
        setUser(userData)
        localStorage.setItem('miningUser', JSON.stringify(userData))
      }
      
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      setSupabaseUser(session?.user ?? null)
      
      if (session?.user) {
        const userData: User = {
          id: session.user.id,
          username: session.user.email?.split('@')[0] || '',
          email: session.user.email || '',
          role: 'staff', // Default role
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

    return () => subscription.unsubscribe()
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
