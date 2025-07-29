import React, { useState, useEffect } from 'react'
import { User, UserRole, ROLE_PERMISSIONS } from '../../types'
import { useAuth } from '../../contexts/AuthContext'
import { Users, Settings, Shield, Activity, ArrowLeft, Search, Plus, Edit2, Eye, EyeOff, Save, X, AlertCircle } from 'lucide-react'

interface RealDataAdminPanelProps {
  className?: string
  onBack?: () => void
}

const RealDataAdminPanel: React.FC<RealDataAdminPanelProps> = ({ className = '', onBack }) => {
  const { user: currentUser, getAllUsers, updateUserRole, toggleUserStatus, createUser, hasPermission } = useAuth()
  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'settings' | 'audit'>('users')
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState<UserRole | 'all'>('all')
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'viewer' as UserRole,
    department: ''
  })

  // Check if current user has admin permissions
  const canManageUsers = hasPermission('canManageUsers')
  const canAccessAdminPanel = hasPermission('canAccessAdminPanel')

  // Load users on component mount
  useEffect(() => {
    loadUsers()
  }, [])

  // Filter users based on search and role
  useEffect(() => {
    let filtered = users.filter(user => 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.department && user.department.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    if (selectedRole !== 'all') {
      filtered = filtered.filter(user => user.role === selectedRole)
    }

    setFilteredUsers(filtered)
  }, [searchTerm, selectedRole, users])

  const loadUsers = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const allUsers = await getAllUsers()
      setUsers(allUsers)
      console.log('✅ Loaded users from authentication system:', allUsers.length)
    } catch (error) {
      console.error('❌ Error loading users:', error)
      setError('Failed to load users')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      const result = await updateUserRole(userId, newRole)
      if (result.success) {
        console.log(`✅ Role updated for user ${userId} to ${newRole}`)
        // Reload users to get updated data
        await loadUsers()
      } else {
        alert(`Failed to update role: ${result.error}`)
      }
    } catch (error) {
      console.error('Error updating user role:', error)
      alert('Failed to update user role')
    }
  }

  const handleToggleActive = async (userId: string) => {
    try {
      const result = await toggleUserStatus(userId)
      if (result.success) {
        console.log(`✅ User ${userId} status toggled`)
        // Reload users to get updated data
        await loadUsers()
      } else {
        alert(`Failed to toggle user status: ${result.error}`)
      }
    } catch (error) {
      console.error('Error toggling user status:', error)
      alert('Failed to toggle user status')
    }
  }

  const handleCreateUser = async () => {
    try {
      if (!newUser.email || !newUser.password || !newUser.fullName) {
        alert('Please fill in all required fields')
        return
      }

      if (users.some(u => u.email === newUser.email)) {
        alert('User with this email already exists')
        return
      }

      const result = await createUser(
        newUser.email,
        newUser.password,
        newUser.fullName,
        newUser.role,
        newUser.department
      )

      if (result.success) {
        console.log('✅ User created successfully')
        setShowAddUserModal(false)
        setNewUser({
          email: '',
          password: '',
          fullName: '',
          role: 'viewer',
          department: ''
        })
        alert('User created successfully')
        // Reload users to get updated data
        await loadUsers()
      } else {
        alert(`Failed to create user: ${result.error}`)
      }
    } catch (error) {
      console.error('Error creating user:', error)
      alert('Failed to create user')
    }
  }

  const getRoleBadgeColor = (role: UserRole) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      manager: 'bg-blue-100 text-blue-800',
      staff: 'bg-green-100 text-green-800',
      viewer: 'bg-gray-100 text-gray-800'
    }
    return colors[role]
  }

  const tabs = [
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'roles', label: 'Role Editor', icon: Shield },
    { id: 'settings', label: 'System Settings', icon: Settings },
    { id: 'audit', label: 'Audit Logs', icon: Activity }
  ]

  // Check permissions
  if (!canAccessAdminPanel) {
    return (
      <div className={`min-h-screen bg-gray-50 flex items-center justify-center ${className}`}>
        <div className="text-center bg-white rounded-lg shadow-xl p-8 border border-red-200">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-800 mb-2">Access Denied</h2>
          <p className="text-red-600 mb-4">You don't have permission to access the admin panel.</p>
          {onBack && (
            <button
              onClick={onBack}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
            >
              Go Back
            </button>
          )}
        </div>
      </div>
    )
  }

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
                  <span className="text-green-800 text-sm font-medium capitalize">{currentUser?.role}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{currentUser?.email}</p>
                  <p className="text-xs text-gray-500">{currentUser?.department || 'EPA Department'}</p>
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
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow">
            {/* User Management Content */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">User Management</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Manage EPA staff access and permissions (Real Authentication Data)
                  </p>
                </div>
                {canManageUsers && (
                  <button
                    onClick={() => setShowAddUserModal(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add User</span>
                  </button>
                )}
              </div>
            </div>

            {/* Filters */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-full sm:w-64"
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <label className="text-sm font-medium text-gray-700">Filter by role:</label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as UserRole | 'all')}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="all">All Roles</option>
                    <option value="admin">Administrator</option>
                    <option value="manager">Manager</option>
                    <option value="staff">Staff</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="px-6 py-4 bg-red-50 border-b border-red-200">
                <div className="flex items-center space-x-2 text-red-700">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                  <button
                    onClick={loadUsers}
                    className="text-red-600 hover:text-red-800 underline ml-4"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            {/* Users Table */}
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading users from authentication system...</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Login
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                <span className="text-sm font-medium text-green-800">
                                  {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.full_name || 'No Name'}
                              </div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {canManageUsers ? (
                            <select
                              value={user.role}
                              onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                              className={`inline-flex px-2 text-xs font-semibold rounded-full border-0 ${getRoleBadgeColor(user.role)}`}
                            >
                              <option value="admin">Administrator</option>
                              <option value="manager">Manager</option>
                              <option value="staff">Staff</option>
                              <option value="viewer">Viewer</option>
                            </select>
                          ) : (
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                              {user.role}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.department || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {canManageUsers ? (
                            <button
                              onClick={() => handleToggleActive(user.id)}
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                user.is_active
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {user.is_active ? (
                                <>
                                  <Eye className="w-3 h-3 mr-1" />
                                  Active
                                </>
                              ) : (
                                <>
                                  <EyeOff className="w-3 h-3 mr-1" />
                                  Inactive
                                </>
                              )}
                            </button>
                          ) : (
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              user.is_active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {user.is_active ? 'Active' : 'Inactive'}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-indigo-600 hover:text-indigo-900">
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {filteredUsers.length === 0 && !isLoading && !error && (
              <div className="text-center py-12">
                <p className="text-gray-500">No users found matching your criteria.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'roles' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Role & Permissions Editor</h3>
            <div className="space-y-6">
              <p className="text-gray-600">Configure permissions for each role in the system.</p>
              
              {/* Role Permissions Matrix */}
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Permission</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">Admin</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">Manager</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">Staff</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">Viewer</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {Object.entries(ROLE_PERMISSIONS.admin).map(([permission, _]) => (
                      <tr key={permission}>
                        <td className="px-4 py-3 text-sm text-gray-900">{permission}</td>
                        <td className="px-4 py-3 text-center">
                          {ROLE_PERMISSIONS.admin[permission as keyof typeof ROLE_PERMISSIONS.admin] ? '✅' : '❌'}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {ROLE_PERMISSIONS.manager[permission as keyof typeof ROLE_PERMISSIONS.manager] ? '✅' : '❌'}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {ROLE_PERMISSIONS.staff[permission as keyof typeof ROLE_PERMISSIONS.staff] ? '✅' : '❌'}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {ROLE_PERMISSIONS.viewer[permission as keyof typeof ROLE_PERMISSIONS.viewer] ? '✅' : '❌'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">System Settings</h3>
            <div className="space-y-4">
              <p className="text-gray-600">System configuration and settings.</p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Authentication System</h4>
                <p className="text-blue-700 text-sm">
                  Currently using: <strong>Local Authentication</strong>
                </p>
                <p className="text-blue-600 text-xs mt-1">
                  User data is managed through the local authentication system
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Audit Logs</h3>
            <div className="space-y-4">
              <p className="text-gray-600">User activity and system changes tracking.</p>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Recent Activity</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>{currentUser?.email} accessed admin panel</span>
                    <span>{new Date().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>User management section viewed</span>
                    <span>{new Date().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Real authentication data loaded</span>
                    <span>{new Date().toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddUserModal && canManageUsers && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Add New User</h3>
                <button
                  onClick={() => setShowAddUserModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="user@epa.gov.gh"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  value={newUser.fullName}
                  onChange={(e) => setNewUser(prev => ({ ...prev, fullName: e.target.value }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value as UserRole }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="viewer">Viewer</option>
                  <option value="staff">Staff</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <input
                  type="text"
                  value={newUser.department}
                  onChange={(e) => setNewUser(prev => ({ ...prev, department: e.target.value }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter department"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex space-x-3">
              <button
                onClick={handleCreateUser}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Create User</span>
              </button>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RealDataAdminPanel
