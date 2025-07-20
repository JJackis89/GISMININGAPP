export interface User {
  id: string
  username: string
  email: string
  role: 'admin' | 'staff' | 'guest'
  firstName: string
  lastName: string
}

export interface MiningConcession {
  id: string
  name: string
  size: number // in hectares
  owner: string
  permitType: 'small-scale' | 'large-scale'
  permitExpiryDate: string
  district: string
  region: string
  status: 'active' | 'expired' | 'pending'
  coordinates: [number, number][]
  contactInfo?: {
    phone?: string
    email?: string
    address?: string
  }
  attachments?: string[]
}

export interface DashboardStats {
  totalConcessions: number
  activePermits: number
  expiredPermits: number
  soonToExpire: number
  totalAreaCovered: number
  concessionsByRegion: Record<string, number>
  concessionsByType: Record<string, number>
}
