export interface User {
  uid: string
  email: string
  displayName?: string
  role: UserRole
  department?: string
  createdAt: Date
  lastLogin?: Date
  isActive: boolean
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

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  hasPermission: (permission: keyof RolePermissions) => boolean
  updateUserRole: (userId: string, newRole: UserRole) => Promise<void>
  getAllUsers: () => Promise<User[]>
  toggleUserStatus: (userId: string) => Promise<void>
}
