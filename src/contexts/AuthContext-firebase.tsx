import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { firebaseAuth } from '../lib/firebase-auth'
import { localAuth } from '../lib/local-auth'
import { User } from '../types'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  isUsingFirebase: boolean
  isUsingLocal: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isUsingFirebase, setIsUsingFirebase] = useState(false)
  const [isUsingLocal, setIsUsingLocal] = useState(false)

  useEffect(() => {
    let unsubscribe: (() => void) | null = null
    
    const initAuth = async () => {
      console.log('🔄 Initializing Firebase Authentication...')
      
      try {
        // Check if Firebase is configured
        if (firebaseAuth.isConfigured()) {
          console.log('✅ Firebase is configured, setting up auth listener')
          setIsUsingFirebase(true)
          setIsUsingLocal(false)
          
          // Set up Firebase auth state listener
          unsubscribe = firebaseAuth.onAuthStateChange((user) => {
            console.log('🔥 Firebase auth state changed:', user?.email || 'null')
            setUser(user)
            setLoading(false)
          })
          
        } else {
          console.log('⚠️ Firebase not configured, using local authentication')
          setIsUsingFirebase(false)
          setIsUsingLocal(true)
          
          // Use local auth fallback
          const localUser = localAuth.getCurrentUser()
          setUser(localUser)
          setLoading(false)
        }
        
      } catch (error) {
        console.error('❌ Auth initialization failed, falling back to local auth:', error)
        setIsUsingFirebase(false)
        setIsUsingLocal(true)
        
        // Fallback to local auth
        const localUser = localAuth.getCurrentUser()
        setUser(localUser)
        setLoading(false)
      }
    }

    initAuth()

    // Cleanup function
    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true)
    
    try {
      if (isUsingFirebase) {
        console.log('🔥 Attempting Firebase login')
        const result = await firebaseAuth.signIn(email, password)
        
        if (result.success && result.user) {
          // User state will be updated by the auth state listener
          return { success: true }
        } else {
          return { success: false, error: result.error }
        }
        
      } else {
        console.log('🏠 Attempting local login')
        const result = await localAuth.signIn(email, password)
        
        if (result.user) {
          setUser(result.user)
          return { success: true }
        } else {
          return { success: false, error: result.error }
        }
      }
      
    } catch (error: any) {
      console.error('Login error:', error)
      return { success: false, error: error.message || 'Login failed' }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, fullName: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true)
    
    try {
      if (isUsingFirebase) {
        console.log('🔥 Attempting Firebase sign up')
        const result = await firebaseAuth.signUp(email, password, fullName)
        
        if (result.success && result.user) {
          // User state will be updated by the auth state listener
          return { success: true }
        } else {
          return { success: false, error: result.error }
        }
        
      } else {
        console.log('🏠 Attempting local sign up')
        const result = await localAuth.signUp(email, password, fullName)
        
        if (result.user) {
          setUser(result.user)
          return { success: true }
        } else {
          return { success: false, error: result.error }
        }
      }
      
    } catch (error: any) {
      console.error('Sign up error:', error)
      return { success: false, error: error.message || 'Sign up failed' }
    } finally {
      setLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    setLoading(true)
    
    try {
      if (isUsingFirebase) {
        console.log('🔥 Firebase logout')
        await firebaseAuth.signOut()
        // User state will be updated by the auth state listener
      } else {
        console.log('🏠 Local logout')
        await localAuth.signOut()
        setUser(null)
      }
    } catch (error) {
      console.error('Logout error:', error)
      // Still clear user even if logout request failed
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    signUp,
    logout,
    isUsingFirebase,
    isUsingLocal
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
