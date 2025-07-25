// Simple mock authentication for demo mode
import { User } from '../lib/auth-api'

interface MockAuthResult {
  user: User | null
  error: string | null
}

class MockAuth {
  private mockUsers: Array<{ email: string; password: string; user: User }> = [
    {
      email: 'admin@epa.gov.gh',
      password: 'admin123',
      user: {
        id: 'mock-admin-1',
        email: 'admin@epa.gov.gh',
        role: 'admin',
        full_name: 'EPA Administrator'
      }
    },
    {
      email: 'staff@epa.gov.gh', 
      password: 'staff123',
      user: {
        id: 'mock-staff-1',
        email: 'staff@epa.gov.gh',
        role: 'staff',
        full_name: 'EPA Staff Member'
      }
    },
    {
      email: 'demo@example.com',
      password: 'demo123',
      user: {
        id: 'mock-demo-1',
        email: 'demo@example.com',
        role: 'guest',
        full_name: 'Demo User'
      }
    }
  ]

  async signIn(email: string, password: string): Promise<MockAuthResult> {
    console.log('🎭 Mock authentication for:', email)
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const mockUser = this.mockUsers.find(u => u.email === email && u.password === password)
    
    if (mockUser) {
      console.log('✅ Mock sign in successful for:', email)
      return { user: mockUser.user, error: null }
    }
    
    console.log('❌ Mock sign in failed for:', email)
    return { 
      user: null, 
      error: 'Invalid credentials. Try: admin@epa.gov.gh/admin123 or demo@example.com/demo123' 
    }
  }

  async signOut(): Promise<void> {
    console.log('🎭 Mock sign out')
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200))
  }

  getDemoCredentials() {
    return [
      { email: 'admin@epa.gov.gh', password: 'admin123', role: 'Administrator' },
      { email: 'staff@epa.gov.gh', password: 'staff123', role: 'Staff Member' },
      { email: 'demo@example.com', password: 'demo123', role: 'Guest User' }
    ]
  }
}

export const mockAuth = new MockAuth()
