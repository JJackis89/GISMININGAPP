import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth'
import { auth, hasRealCredentials } from '../config/firebase'
import { User } from '../types'

export class FirebaseAuthService {
  private authStateListeners: ((user: User | null) => void)[] = []

  constructor() {
    // Set up auth state listener
    onAuthStateChanged(auth, (firebaseUser) => {
      const user = firebaseUser ? this.mapFirebaseUserToUser(firebaseUser) : null
      this.authStateListeners.forEach(listener => listener(user))
    })
  }

  // Map Firebase user to our User type
  private mapFirebaseUserToUser(firebaseUser: FirebaseUser): User {
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      full_name: firebaseUser.displayName || 'User',
      display_name: firebaseUser.displayName || 'User',
      department: 'EPA Department', // Default department
      role: this.determineUserRole(firebaseUser.email || ''),
      created_at: firebaseUser.metadata.creationTime || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_login: new Date().toISOString(),
      is_active: true
    }
  }

  // Determine user role based on email (you can customize this logic)
  private determineUserRole(email: string): 'admin' | 'manager' | 'staff' | 'viewer' {
    // Real admin user
    if (email === 'gismining025@gmail.com') return 'admin'
    
    // Other admin patterns
    if (email.includes('admin@')) return 'admin'
    if (email.includes('manager@')) return 'manager'
    if (email.includes('@epa.gov.gh')) return 'staff'
    return 'viewer'
  }

  // Check if Firebase is properly configured
  isConfigured(): boolean {
    return hasRealCredentials
  }

  // Sign in with email and password
  async signIn(email: string, password: string): Promise<{ success: boolean; error?: string; user?: User }> {
    try {
      if (!this.isConfigured()) {
        return { 
          success: false, 
          error: 'Firebase not configured. Please add your Firebase credentials to environment variables.' 
        }
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = this.mapFirebaseUserToUser(userCredential.user)
      
      console.log('✅ Firebase sign in successful:', user.email)
      return { success: true, user }
      
    } catch (error: any) {
      console.error('❌ Firebase sign in error:', error)
      
      // Map Firebase error codes to user-friendly messages
      let errorMessage = 'Sign in failed'
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          errorMessage = 'Invalid email or password'
          break
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled'
          break
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later'
          break
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection'
          break
        default:
          errorMessage = error.message || 'Sign in failed'
      }
      
      return { success: false, error: errorMessage }
    }
  }

  // Sign up with email and password
  async signUp(email: string, password: string, fullName: string): Promise<{ success: boolean; error?: string; user?: User }> {
    try {
      if (!this.isConfigured()) {
        return { 
          success: false, 
          error: 'Firebase not configured. Please add your Firebase credentials to environment variables.' 
        }
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      // Update the user's display name
      if (fullName) {
        await updateProfile(userCredential.user, {
          displayName: fullName
        })
      }
      
      const user = this.mapFirebaseUserToUser(userCredential.user)
      
      console.log('✅ Firebase sign up successful:', user.email)
      return { success: true, user }
      
    } catch (error: any) {
      console.error('❌ Firebase sign up error:', error)
      
      // Map Firebase error codes to user-friendly messages
      let errorMessage = 'Sign up failed'
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'An account with this email already exists'
          break
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address'
          break
        case 'auth/operation-not-allowed':
          errorMessage = 'Email/password accounts are not enabled'
          break
        case 'auth/weak-password':
          errorMessage = 'Password should be at least 6 characters'
          break
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection'
          break
        default:
          errorMessage = error.message || 'Sign up failed'
      }
      
      return { success: false, error: errorMessage }
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth)
      console.log('✅ Firebase sign out successful')
    } catch (error) {
      console.error('❌ Firebase sign out error:', error)
      throw error
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    if (auth.currentUser) {
      return this.mapFirebaseUserToUser(auth.currentUser)
    }
    return null
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return auth.currentUser !== null
  }

  // Listen to auth state changes
  onAuthStateChange(callback: (user: User | null) => void): () => void {
    this.authStateListeners.push(callback)
    
    // Return unsubscribe function
    return () => {
      const index = this.authStateListeners.indexOf(callback)
      if (index > -1) {
        this.authStateListeners.splice(index, 1)
      }
    }
  }

  // Get the current Firebase user (for advanced usage)
  getFirebaseUser(): FirebaseUser | null {
    return auth.currentUser
  }
}

// Export singleton instance
export const firebaseAuth = new FirebaseAuthService()
