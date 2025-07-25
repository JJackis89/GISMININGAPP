/**
 * Complete Local Authentication System
 * This replaces Supabase entirely with a local authentication system
 * that mimics a real backend but works 100% reliably
 */

export interface User {
  id: string
  email: string
  full_name?: string
  role: 'admin' | 'staff' | 'guest'
  created_at: string
  updated_at: string
}

export interface AuthSession {
  access_token: string
  refresh_token: string
  user: User
  expires_at: number
}

class LocalAuthSystem {
  private storageKey = 'epa_mining_auth_session'
  private users: Map<string, { password: string; user: User }> = new Map()

  constructor() {
    this.initializeDefaultUsers()
  }

  private initializeDefaultUsers() {
    // Default admin user
    this.users.set('admin@epa.gov.gh', {
      password: 'adminpassword',
      user: {
        id: 'admin-001',
        email: 'admin@epa.gov.gh',
        full_name: 'EPA Administrator',
        role: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    })

    // Default staff user
    this.users.set('staff@epa.gov.gh', {
      password: 'staffpassword',
      user: {
        id: 'staff-001',
        email: 'staff@epa.gov.gh',
        full_name: 'EPA Staff Member',
        role: 'staff',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    })

    // Demo guest user
    this.users.set('guest@epa.gov.gh', {
      password: 'guestpassword',
      user: {
        id: 'guest-001',
        email: 'guest@epa.gov.gh',
        full_name: 'Guest User',
        role: 'guest',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    })
  }

  private generateToken(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  private createSession(user: User): AuthSession {
    const now = Date.now()
    const session: AuthSession = {
      access_token: this.generateToken(),
      refresh_token: this.generateToken(),
      user,
      expires_at: now + (24 * 60 * 60 * 1000) // 24 hours
    }
    
    localStorage.setItem(this.storageKey, JSON.stringify(session))
    return session
  }

  async signIn(email: string, password: string): Promise<{ user?: User; error?: string }> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))

    const userRecord = this.users.get(email.toLowerCase())
    
    if (!userRecord) {
      return { error: 'Invalid email or password' }
    }

    if (userRecord.password !== password) {
      return { error: 'Invalid email or password' }
    }

    const session = this.createSession(userRecord.user)
    console.log('✅ Local auth sign in successful:', userRecord.user.email)
    
    return { user: userRecord.user }
  }

  async signUp(email: string, password: string, fullName?: string): Promise<{ user?: User; error?: string }> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800))

    const normalizedEmail = email.toLowerCase()
    
    if (this.users.has(normalizedEmail)) {
      return { error: 'User already exists with this email' }
    }

    if (password.length < 6) {
      return { error: 'Password must be at least 6 characters long' }
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email: normalizedEmail,
      full_name: fullName || 'New User',
      role: 'staff', // Default role for new signups
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    this.users.set(normalizedEmail, {
      password,
      user: newUser
    })

    console.log('✅ Local auth sign up successful:', newUser.email)
    return { user: newUser }
  }

  async signOut(): Promise<void> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 200))
    
    localStorage.removeItem(this.storageKey)
    console.log('✅ Local auth sign out successful')
  }

  getSession(): AuthSession | null {
    try {
      const stored = localStorage.getItem(this.storageKey)
      if (!stored) return null

      const session: AuthSession = JSON.parse(stored)
      
      // Check if session is expired
      if (Date.now() > session.expires_at) {
        localStorage.removeItem(this.storageKey)
        return null
      }

      return session
    } catch (error) {
      console.error('Error reading session:', error)
      localStorage.removeItem(this.storageKey)
      return null
    }
  }

  getCurrentUser(): User | null {
    const session = this.getSession()
    return session?.user || null
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null
  }

  // Method to add new users (for admin functionality)
  addUser(email: string, password: string, fullName: string, role: 'admin' | 'staff' | 'guest'): boolean {
    const normalizedEmail = email.toLowerCase()
    
    if (this.users.has(normalizedEmail)) {
      return false // User already exists
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email: normalizedEmail,
      full_name: fullName,
      role,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    this.users.set(normalizedEmail, {
      password,
      user: newUser
    })

    return true
  }

  // Get all users (for admin functionality)
  getAllUsers(): User[] {
    return Array.from(this.users.values()).map(record => record.user)
  }
}

// Export singleton instance
export const localAuth = new LocalAuthSystem()
