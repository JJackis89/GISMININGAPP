import React from 'react'
import { useAuth } from '../contexts/AuthContext'

const UserDebugInfo: React.FC = () => {
  const { user, hasPermission } = useAuth()

  return (
    <div className="fixed top-4 right-4 bg-white p-4 border rounded-lg shadow-lg z-50 max-w-sm">
      <h3 className="font-bold text-sm mb-2">Debug Info</h3>
      <div className="text-xs space-y-1">
        <div><strong>User:</strong> {user?.email || 'Not logged in'}</div>
        <div><strong>Role:</strong> {user?.role || 'None'}</div>
        <div><strong>Can Access Admin Panel:</strong> {hasPermission('canAccessAdminPanel') ? '✅ Yes' : '❌ No'}</div>
        <div><strong>Can Manage Users:</strong> {hasPermission('canManageUsers') ? '✅ Yes' : '❌ No'}</div>
      </div>
    </div>
  )
}

export default UserDebugInfo
