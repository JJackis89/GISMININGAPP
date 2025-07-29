import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { firebaseAuth } from '../lib/firebase-auth'
import { localAuth } from '../lib/local-auth'
import { User, ROLE_PERMISSIONS, RolePermissions, UserRole } from '../types'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  isUsingFirebase: boolean
  isUsingLocal: boolean
  hasPermission: (permission: keyof RolePermissions) => boolean
  updateUserRole: (userId: string, newRole: UserRole) => Promise<{ success: boolean; error?: string }>
  getAllUsers: () => Promise<User[]>
  toggleUserStatus: (userId: string) => Promise<{ success: boolean; error?: string }>
  createUser: (email: string, password: string, fullName: string, role: UserRole, department?: string) => Promise<{ success: boolean; error?: string }>
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
          // Enhanced error messages for common Firebase errors
          let errorMessage = result.error || 'Login failed'
          
          if (errorMessage.includes('user-not-found')) {
            errorMessage = 'No account found with this email address'
          } else if (errorMessage.includes('wrong-password')) {
            errorMessage = 'Incorrect password. Please try again'
          } else if (errorMessage.includes('invalid-email')) {
            errorMessage = 'Please enter a valid email address'
          } else if (errorMessage.includes('too-many-requests')) {
            errorMessage = 'Too many failed attempts. Please try again later'
          } else if (errorMessage.includes('network-request-failed')) {
            errorMessage = 'Network error. Please check your connection and try again'
          }
          
          return { success: false, error: errorMessage }
        }
        
      } else {
        console.log('🏠 Attempting local login')
        const result = await localAuth.signIn(email, password)
        
        if (result.user) {
          setUser(result.user)
          return { success: true }
        } else {
          return { success: false, error: result.error || 'Invalid email or password' }
        }
      }
      
    } catch (error: any) {
      console.error('Login error:', error)
      let errorMessage = 'An unexpected error occurred. Please try again'
      
      if (error.message) {
        if (error.message.includes('network')) {
          errorMessage = 'Network error. Please check your connection and try again'
        } else if (error.message.includes('timeout')) {
          errorMessage = 'Request timed out. Please try again'
        }
      }
      
      return { success: false, error: errorMessage }
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

  const hasPermission = (permission: keyof RolePermissions): boolean => {
    if (!user) return false
    return ROLE_PERMISSIONS[user.role][permission]
  }

  const updateUserRole = async (userId: string, newRole: UserRole): Promise<{ success: boolean; error?: string }> => {
    try {
      if (isUsingFirebase) {
        // In Firebase implementation, you would need to use Firestore to store user roles
        // For now, we'll return an error since Firebase doesn't have built-in user management
        return { success: false, error: 'User role management not yet implemented for Firebase' }
      } else {
        // Use local auth system
        const allUsers = localAuth.getAllUsers()
        const userExists = allUsers.find(u => u.id === userId)
        
        if (!userExists) {
          return { success: false, error: 'User not found' }
        }
        
        // Update user in local auth system
        const success = localAuth.updateUserRole(userId, newRole)
        
        if (success && user && user.id === userId) {
          // Update current user state if we're updating the current user
          const updatedUser = { ...user, role: newRole, updated_at: new Date().toISOString() }
          setUser(updatedUser)
        }
        
        return { success, error: success ? undefined : 'Failed to update user role' }
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to update user role' }
    }
  }

  const getAllUsers = async (): Promise<User[]> => {
    try {
      if (isUsingFirebase) {
        // In Firebase implementation, you would query Firestore for user data
        // For now, return empty array since Firebase doesn't have built-in user listing
        return []
      } else {
        // Use local auth system
        return localAuth.getAllUsers()
      }
    } catch (error) {
      console.error('Error getting all users:', error)
      return []
    }
  }

  const toggleUserStatus = async (userId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (isUsingFirebase) {
        return { success: false, error: 'User status management not yet implemented for Firebase' }
      } else {
        const success = localAuth.toggleUserStatus(userId)
        return { success, error: success ? undefined : 'Failed to toggle user status' }
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to toggle user status' }
    }
  }

  const createUser = async (email: string, password: string, fullName: string, role: UserRole, department?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (isUsingFirebase) {
        // Create user in Firebase Auth
        const result = await firebaseAuth.signUp(email, password, fullName)
        if (result.success) {
          // In a real app, you'd also save role and department to Firestore
          return { success: true }
        } else {
          return { success: false, error: result.error }
        }
      } else {
        // Use local auth system
        const success = localAuth.addUser(email, password, fullName, role, department)
        return { 
          success, 
          error: success ? undefined : 'User with this email already exists or creation failed' 
        }
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to create user' }
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    signUp,
    logout,
    isUsingFirebase,
    isUsingLocal,
    hasPermission,
    updateUserRole,
    getAllUsers,
    toggleUserStatus,
    createUser
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
