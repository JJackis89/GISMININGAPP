// Direct Supabase REST API implementation - no JS client needed
// This bypasses all the problematic Supabase client issues

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

interface AuthResponse {
  access_token?: string
  refresh_token?: string
  user?: {
    id: string
    email: string
    user_metadata?: any
  }
  error?: {
    message: string
    status?: number
  }
}

interface User {
  id: string
  email: string
  role: 'admin' | 'staff' | 'guest'
  full_name?: string
}

class AuthAPI {
  private accessToken: string | null = null
  private user: User | null = null

  constructor() {
    // Load saved session from localStorage
    this.loadSession()
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error('Supabase configuration missing')
    }

    const url = `${SUPABASE_URL}/auth/v1${endpoint}`
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      ...(options.headers as Record<string, string> || {})
    }

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`
    }

    const response = await fetch(url, {
      ...options,
      headers
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error_description || data.message || 'Request failed')
    }

    return data
  }

  async signIn(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    try {
      console.log('🔐 Attempting direct API sign in for:', email)
      
      const data = await this.makeRequest('/token?grant_type=password', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password
        })
      })

      if (data.access_token) {
        this.accessToken = data.access_token
        
        // Get user profile
        const userProfile = await this.getProfile()
        if (userProfile) {
          this.user = userProfile
          this.saveSession()
          console.log('✅ Sign in successful:', userProfile.email)
          return { user: userProfile, error: null }
        }
      }

      return { user: null, error: 'Failed to get user profile' }
      
    } catch (error: any) {
      console.error('❌ Sign in failed:', error.message)
      return { user: null, error: error.message }
    }
  }

  async signUp(email: string, password: string, fullName?: string): Promise<{ user: User | null; error: string | null }> {
    try {
      console.log('📝 Attempting sign up for:', email)
      
      const data = await this.makeRequest('/signup', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
          data: {
            full_name: fullName
          }
        })
      })

      if (data.user) {
        console.log('✅ Sign up successful, check email for confirmation')
        return { 
          user: null, // User needs to confirm email first
          error: null 
        }
      }

      return { user: null, error: 'Sign up failed' }
      
    } catch (error: any) {
      console.error('❌ Sign up failed:', error.message)
      return { user: null, error: error.message }
    }
  }

  async signOut(): Promise<{ error: string | null }> {
    try {
      if (this.accessToken) {
        await this.makeRequest('/logout', {
          method: 'POST'
        })
      }
    } catch (error) {
      console.warn('Sign out request failed, but continuing with local cleanup')
    }

    this.accessToken = null
    this.user = null
    this.clearSession()
    console.log('🚪 Signed out successfully')
    
    return { error: null }
  }

  async getProfile(): Promise<User | null> {
    if (!this.accessToken) return null

    try {
      const userData = await this.makeRequest('/user', {
        method: 'GET'
      })

      if (userData.id) {
        const user: User = {
          id: userData.id,
          email: userData.email,
          role: userData.user_metadata?.role || 'guest',
          full_name: userData.user_metadata?.full_name
        }
        return user
      }
    } catch (error) {
      console.error('Failed to get profile:', error)
    }

    return null
  }

  getCurrentUser(): User | null {
    return this.user
  }

  getSession(): { access_token: string | null; user: User | null } {
    return {
      access_token: this.accessToken,
      user: this.user
    }
  }

  private saveSession() {
    if (typeof window !== 'undefined') {
      const session = {
        access_token: this.accessToken,
        user: this.user
      }
      localStorage.setItem('supabase_session', JSON.stringify(session))
    }
  }

  private loadSession() {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('supabase_session')
        if (saved) {
          const session = JSON.parse(saved)
          this.accessToken = session.access_token
          this.user = session.user
        }
      } catch (error) {
        console.warn('Failed to load saved session')
      }
    }
  }

  private clearSession() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('supabase_session')
    }
  }

  // Check if we have valid configuration
  isConfigured(): boolean {
    return !!(SUPABASE_URL && SUPABASE_ANON_KEY && 
             SUPABASE_URL.startsWith('https://') && 
             SUPABASE_URL.includes('.supabase.co'))
  }
}

// Export singleton instance
export const authAPI = new AuthAPI()

// Export types
export type { User, AuthResponse }
