import React, { useState, useEffect } from 'react'
import { User, UserRole, ROLE_PERMISSIONS } from '../../types'
import { useAuth } from '../../contexts/AuthContext'
import UserManagement from './UserManagement'
import RoleEditor from './RoleEditor'
import SystemSettings from './SystemSettings'
import { Users, Settings, Shield, Activity, ArrowLeft } from 'lucide-react'

interface AdminPanelProps {
  className?: string
  onBack?: () => void
}

const AdminPanel: React.FC<AdminPanelProps> = ({ className = '', onBack }) => {
  const { user, hasPermission } = useAuth()
  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'settings' | 'audit'>('users')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user has admin permissions
    if (!hasPermission('canAccessAdminPanel')) {
      if (onBack) onBack()
      return
    }
    setIsLoading(false)
  }, [hasPermission, onBack])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'roles', label: 'Role Editor', icon: Shield },
    { id: 'settings', label: 'System Settings', icon: Settings },
    { id: 'audit', label: 'Audit Logs', icon: Activity }
  ]

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {onBack && (
                  <button
                    onClick={onBack}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Dashboard</span>
                  </button>
                )}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">EPA Admin Panel</h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Mining Concessions Management System Administration
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 px-3 py-1 rounded-full">
                  <span className="text-green-800 text-sm font-medium">Administrator</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                  <p className="text-xs text-gray-500">{user?.department || 'EPA GIS Department'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'roles' && <RoleEditor />}
        {activeTab === 'settings' && <SystemSettings />}
        {activeTab === 'audit' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Audit Logs</h3>
            <div className="space-y-4">
              <p className="text-gray-600">User activity and system changes will be tracked here.</p>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Recent Activity</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>System Administrator logged in</span>
                    <span>{new Date().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Admin panel accessed</span>
                    <span>{new Date().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>User management section viewed</span>
                    <span>{new Date().toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPanel
