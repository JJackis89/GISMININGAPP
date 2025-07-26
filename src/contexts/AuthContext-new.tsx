import React, { createContext, useContext, useEffect, useState } from 'react'
import { authAPI, User } from '../lib/auth-api'
import { mockAuth } from '../data/mockAuth'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  isAuthenticated: boolean
  isDemoMode: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDemoMode, setIsDemoMode] = useState(false)

  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    console.log('🔄 Initializing authentication...')
    
    try {
      // Check if Supabase is properly configured
      if (!authAPI.isConfigured()) {
        console.log('⚠️ Supabase not configured, using demo mode')
        setIsDemoMode(true)
        setUser(null)
        setLoading(false)
        return
      }

      // Try to load existing session
      const session = authAPI.getSession()
      if (session.access_token && session.user) {
        console.log('✅ Found existing session for:', session.user.email)
        setUser(session.user)
        setIsDemoMode(false)
      } else {
        console.log('ℹ️ No existing session found')
        setUser(null)
        setIsDemoMode(false)
      }
      
    } catch (error) {
      console.error('❌ Auth initialization failed:', error)
      console.log('🎭 Falling back to demo mode')
      setIsDemoMode(true)
      setUser(null)
    }
    
    setLoading(false)
  }

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    setLoading(true)
    
    try {
      if (isDemoMode) {
        // Use mock authentication for demo
        const result = await mockAuth.signIn(email, password)
        if (result.user) {
          setUser(result.user)
          return { error: null }
        }
        return { error: result.error || 'Demo sign in failed' }
      }

      // Try real authentication
      const result = await authAPI.signIn(email, password)
      if (result.user) {
        setUser(result.user)
        return { error: null }
      }
      
      return { error: result.error || 'Sign in failed' }
      
    } catch (error: any) {
      console.error('Sign in error:', error)
      return { error: error.message || 'An unexpected error occurred' }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, fullName?: string): Promise<{ error: string | null }> => {
    setLoading(true)
    
    try {
      if (isDemoMode) {
        return { error: 'Sign up not available in demo mode. Please configure Supabase for real authentication.' }
      }

      const result = await authAPI.signUp(email, password, fullName)
      return { error: result.error }
      
    } catch (error: any) {
      console.error('Sign up error:', error)
      return { error: error.message || 'An unexpected error occurred' }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async (): Promise<void> => {
    setLoading(true)
    
    try {
      if (isDemoMode) {
        await mockAuth.signOut()
      } else {
        await authAPI.signOut()
      }
      
      setUser(null)
      
    } catch (error) {
      console.error('Sign out error:', error)
      // Still clear user even if sign out request failed
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
    isDemoMode
  }

  return (
    <AuthContext.Provider value={value}>
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

export { AuthContext }
