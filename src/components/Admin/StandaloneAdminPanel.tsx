import React, { useState, useEffect } from 'react'
import { User, UserRole, ROLE_PERMISSIONS } from '../../types'
import { Users, Settings, Shield, Activity, ArrowLeft, Search, Plus, Edit2, Eye, EyeOff, Save, X } from 'lucide-react'

interface StandaloneAdminPanelProps {
  className?: string
  onBack?: () => void
}

const StandaloneAdminPanel: React.FC<StandaloneAdminPanelProps> = ({ className = '', onBack }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'settings' | 'audit'>('users')
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState<UserRole | 'all'>('all')
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'viewer' as UserRole,
    department: ''
  })

  // Mock data initialization
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: '1',
        email: 'admin@epa.gov.gh',
        role: 'admin',
        full_name: 'System Administrator',
        display_name: 'System Admin',
        department: 'GIS Department',
        created_at: '2024-01-15T00:00:00Z',
        updated_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
        is_active: true
      },
      {
        id: '2',
        email: 'manager@epa.gov.gh',
        role: 'manager',
        full_name: 'Mining Manager',
        display_name: 'Mining Manager',
        department: 'Mining Division',
        created_at: '2024-02-01T00:00:00Z',
        updated_at: new Date().toISOString(),
        last_login: new Date(Date.now() - 86400000).toISOString(),
        is_active: true
      },
      {
        id: '3',
        email: 'staff@epa.gov.gh',
        role: 'staff',
        full_name: 'Field Officer',
        display_name: 'Field Officer',
        department: 'Field Operations',
        created_at: '2024-03-10T00:00:00Z',
        updated_at: new Date().toISOString(),
        last_login: new Date(Date.now() - 172800000).toISOString(),
        is_active: true
      },
      {
        id: '4',
        email: 'viewer@epa.gov.gh',
        role: 'viewer',
        full_name: 'Public Viewer',
        display_name: 'Public Viewer',
        department: 'Public Relations',
        created_at: '2024-03-15T00:00:00Z',
        updated_at: new Date().toISOString(),
        last_login: new Date(Date.now() - 604800000).toISOString(),
        is_active: true
      }
    ]
    
    setTimeout(() => {
      setUsers(mockUsers)
      setFilteredUsers(mockUsers)
      setIsLoading(false)
    }, 1000)
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

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole, updated_at: new Date().toISOString() } : user
      ))
      console.log(`Role updated for user ${userId} to ${newRole}`)
    } catch (error) {
      console.error('Error updating user role:', error)
    }
  }

  const handleToggleActive = async (userId: string) => {
    try {
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, is_active: !user.is_active, updated_at: new Date().toISOString() } : user
      ))
      console.log(`User ${userId} status toggled`)
    } catch (error) {
      console.error('Error toggling user status:', error)
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

      const createdUser: User = {
        id: Date.now().toString(),
        email: newUser.email,
        role: newUser.role,
        full_name: newUser.fullName,
        display_name: newUser.fullName,
        department: newUser.department,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_active: true
      }

      setUsers(prev => [...prev, createdUser])
      setShowAddUserModal(false)
      setNewUser({
        email: '',
        password: '',
        fullName: '',
        role: 'viewer',
        department: ''
      })
      alert('User created successfully')
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
                  <p className="text-sm font-medium text-gray-900">admin@epa.gov.gh</p>
                  <p className="text-xs text-gray-500">EPA GIS Department</p>
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
                    Manage EPA staff access and permissions
                  </p>
                </div>
                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-colors duration-200"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add User</span>
                </button>
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

            {/* Users Table */}
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading users...</p>
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
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.department || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
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

            {filteredUsers.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <p className="text-gray-500">No users found matching your criteria.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'roles' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Role & Permissions Editor</h3>
            <p className="text-gray-600">Role permission management functionality will be implemented here.</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">System Settings</h3>
            <p className="text-gray-600">System configuration and settings will be implemented here.</p>
          </div>
        )}

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

      {/* Add User Modal */}
      {showAddUserModal && (
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

export default StandaloneAdminPanel
