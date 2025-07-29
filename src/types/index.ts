export interface User {
  id: string
  email: string
  role: 'admin' | 'manager' | 'staff' | 'viewer'
  full_name?: string
  display_name?: string
  department?: string
  created_at: string
  updated_at: string
  last_login?: string
  is_active: boolean
}

export type UserRole = 'admin' | 'manager' | 'staff' | 'viewer'

export interface RolePermissions {
  canViewMap: boolean
  canViewReports: boolean
  canPrintReports: boolean
  canManageUsers: boolean
  canEditConcessions: boolean
  canDeleteConcessions: boolean
  canExportData: boolean
  canAccessAdminPanel: boolean
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  admin: {
    canViewMap: true,
    canViewReports: true,
    canPrintReports: true,
    canManageUsers: true,
    canEditConcessions: true,
    canDeleteConcessions: true,
    canExportData: true,
    canAccessAdminPanel: true
  },
  manager: {
    canViewMap: true,
    canViewReports: true,
    canPrintReports: true,
    canManageUsers: false,
    canEditConcessions: true,
    canDeleteConcessions: false,
    canExportData: true,
    canAccessAdminPanel: false
  },
  staff: {
    canViewMap: true,
    canViewReports: true,
    canPrintReports: true,
    canManageUsers: false,
    canEditConcessions: false,
    canDeleteConcessions: false,
    canExportData: false,
    canAccessAdminPanel: false
  },
  viewer: {
    canViewMap: true,
    canViewReports: false,
    canPrintReports: false,
    canManageUsers: false,
    canEditConcessions: false,
    canDeleteConcessions: false,
    canExportData: false,
    canAccessAdminPanel: false
  }
}

export interface MiningConcession {
  id: string
  name: string
  size: number // in acres
  owner: string
  permitType: string // License type from hosted layer (Reconnaissance, Prospecting, Mining Lease, Small Scale)
  permitExpiryDate: string
  district: string
  region: string
  status: string
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
