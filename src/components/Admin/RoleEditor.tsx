import React, { useState } from 'react'
import { UserRole, ROLE_PERMISSIONS, RolePermissions } from '../../types'
import { Shield, Check, X, Info } from 'lucide-react'

interface RoleEditorProps {
  className?: string
}

const RoleEditor: React.FC<RoleEditorProps> = ({ className = '' }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('viewer')

  const roles: { id: UserRole; name: string; description: string; color: string }[] = [
    {
      id: 'admin',
      name: 'Administrator',
      description: 'Full system access with user management capabilities',
      color: 'text-red-600 bg-red-50 border-red-200'
    },
    {
      id: 'manager',
      name: 'Manager',
      description: 'Advanced access with editing capabilities',
      color: 'text-blue-600 bg-blue-50 border-blue-200'
    },
    {
      id: 'staff',
      name: 'Staff',
      description: 'Standard access for daily operations',
      color: 'text-green-600 bg-green-50 border-green-200'
    },
    {
      id: 'viewer',
      name: 'Viewer',
      description: 'Read-only access to basic information',
      color: 'text-gray-600 bg-gray-50 border-gray-200'
    }
  ]

  const permissions: { key: keyof RolePermissions; label: string; description: string }[] = [
    {
      key: 'canViewMap',
      label: 'View Map',
      description: 'Access to the interactive GIS map interface'
    },
    {
      key: 'canViewReports',
      label: 'View Reports',
      description: 'Access to view generated reports and statistics'
    },
    {
      key: 'canPrintReports',
      label: 'Print Reports',
      description: 'Ability to print and export reports'
    },
    {
      key: 'canEditConcessions',
      label: 'Edit Concessions',
      description: 'Modify mining concession data and attributes'
    },
    {
      key: 'canDeleteConcessions',
      label: 'Delete Concessions',
      description: 'Remove concession records from the system'
    },
    {
      key: 'canExportData',
      label: 'Export Data',
      description: 'Export data in various formats (CSV, GeoJSON, etc.)'
    },
    {
      key: 'canManageUsers',
      label: 'Manage Users',
      description: 'Create, edit, and manage user accounts and roles'
    },
    {
      key: 'canAccessAdminPanel',
      label: 'Access Admin Panel',
      description: 'Access to the administrative interface'
    }
  ]

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Shield className="w-6 h-6 text-green-600" />
          <div>
            <h3 className="text-lg font-medium text-gray-900">Role & Permissions Editor</h3>
            <p className="text-sm text-gray-600 mt-1">
              View and understand role-based access controls
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Role Selection */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Select Role to View Permissions</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                  selectedRole === role.id
                    ? role.color
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-sm">{role.name}</div>
                <div className="text-xs text-gray-500 mt-1">{role.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Permissions Grid */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-900">
              Permissions for {roles.find(r => r.id === selectedRole)?.name}
            </h4>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Info className="w-4 h-4" />
              <span>Role permissions are predefined and managed by system administrators</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {permissions.map((permission) => {
              const hasPermission = ROLE_PERMISSIONS[selectedRole][permission.key]
              return (
                <div
                  key={permission.key}
                  className={`p-4 rounded-lg border ${
                    hasPermission
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 mt-0.5 ${
                      hasPermission ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {hasPermission ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <X className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-medium ${
                        hasPermission ? 'text-green-900' : 'text-red-900'
                      }`}>
                        {permission.label}
                      </div>
                      <div className={`text-xs mt-1 ${
                        hasPermission ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {permission.description}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Role Hierarchy Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Role Hierarchy</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <div><strong>Administrator:</strong> Complete system control and user management</div>
            <div><strong>Manager:</strong> Advanced operations with editing capabilities</div>
            <div><strong>Staff:</strong> Standard access for daily work</div>
            <div><strong>Viewer:</strong> Read-only access for basic viewing</div>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <strong>Security Note:</strong> Role permissions are enforced at both the frontend and backend levels. 
              Users can only access features and data appropriate to their assigned role. 
              Contact your system administrator to request role changes.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoleEditor
