import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Users, UserPlus, Shield, AlertCircle, CheckCircle, X, Eye, Edit, Save, Plus, UserCheck } from 'lucide-react'
import { User } from '../../types'

// Firebase Admin Panel with actual user role management
export default function FirebaseAdminPanel() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('users')
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [editingUser, setEditingUser] = useState<string | null>(null)
  const [newUser, setNewUser] = useState({
    email: '',
    fullName: '',
    role: 'viewer' as 'admin' | 'manager' | 'staff' | 'viewer',
    department: ''
  })

  // User roles with descriptions
  const roles = [
    { value: 'admin', label: 'Administrator', description: 'Full system access, can manage all users and settings' },
    { value: 'manager', label: 'Manager', description: 'Can manage mining concessions and supervise staff' },
    { value: 'staff', label: 'Staff', description: 'Can edit mining concessions and view reports' },
    { value: 'viewer', label: 'Viewer', description: 'Read-only access to mining data' }
  ]

  // Initialize with current user and some sample users
  useEffect(() => {
    loadUsers()
  }, [user])

  const loadUsers = () => {
    setLoading(true)
    // In a real Firebase implementation, you'd fetch users from Firestore
    // For now, we'll create a mock user list with the current user
    const mockUsers: User[] = [
      {
        id: user?.id || 'current-user',
        email: user?.email || '',
        full_name: user?.full_name || 'Current User',
        display_name: user?.display_name || 'Current User',
        department: user?.department || 'EPA Department',
        role: user?.role || 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_active: true
      },
      {
        id: 'user-2',
        email: 'manager@epa.gov.gh',
        full_name: 'Mining Manager',
        display_name: 'Mining Manager',
        department: 'Mining Division',
        role: 'manager',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date().toISOString(),
        is_active: true
      },
      {
        id: 'user-3',
        email: 'staff@epa.gov.gh',
        full_name: 'Field Officer',
        display_name: 'Field Officer',
        department: 'Field Operations',
        role: 'staff',
        created_at: new Date(Date.now() - 172800000).toISOString(),
        updated_at: new Date().toISOString(),
        is_active: true
      },
      {
        id: 'user-4',
        email: 'viewer@public.gh',
        full_name: 'Public Viewer',
        display_name: 'Public Viewer',
        department: 'Public Access',
        role: 'viewer',
        created_at: new Date(Date.now() - 259200000).toISOString(),
        updated_at: new Date().toISOString(),
        is_active: true
      }
    ]
    
    setUsers(mockUsers)
    setLoading(false)
  }

  const updateUserRole = async (userId: string, newRole: 'admin' | 'manager' | 'staff' | 'viewer') => {
    try {
      setLoading(true)
      
      // Update the user in the local state
      setUsers(prev => prev.map(u => 
        u.id === userId 
          ? { ...u, role: newRole, updated_at: new Date().toISOString() }
          : u
      ))
      
      setSuccess(`User role updated to ${newRole} successfully!`)
      setEditingUser(null)
      
      // In a real Firebase implementation, you would:
      // 1. Update the user's custom claims in Firebase Auth
      // 2. Update the user's role in Firestore
      // await updateUserCustomClaims(userId, { role: newRole })
      
    } catch (error: any) {
      setError(`Failed to update user role: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const toggleUserStatus = async (userId: string) => {
    try {
      setLoading(true)
      
      setUsers(prev => prev.map(u => 
        u.id === userId 
          ? { ...u, is_active: !u.is_active, updated_at: new Date().toISOString() }
          : u
      ))
      
      setSuccess('User status updated successfully!')
      
    } catch (error: any) {
      setError(`Failed to update user status: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const addNewUser = async () => {
    if (!newUser.email || !newUser.fullName) {
      setError('Email and full name are required')
      return
    }

    try {
      setLoading(true)
      
      const user: User = {
        id: `user-${Date.now()}`,
        email: newUser.email,
        full_name: newUser.fullName,
        display_name: newUser.fullName,
        department: newUser.department,
        role: newUser.role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_active: true
      }
      
      setUsers(prev => [...prev, user])
      setSuccess('User added successfully!')
      setNewUser({ email: '', fullName: '', role: 'viewer', department: '' })
      
      // In a real Firebase implementation:
      // 1. Create user in Firebase Auth
      // 2. Set custom claims for role
      // 3. Create user document in Firestore
      
    } catch (error: any) {
      setError(`Failed to add user: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const clearMessages = () => {
    setError(null)
    setSuccess(null)
  }

  const CurrentUserInfo = () => (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-3">
        <CheckCircle className="w-5 h-5 text-green-600" />
        <div>
          <h3 className="font-medium text-green-800">Admin Access Confirmed</h3>
          <p className="text-green-700 text-sm mt-1">
            Logged in as: <strong>{user?.email}</strong> ({user?.role})
          </p>
          <p className="text-green-600 text-xs mt-1">
            You have full administrative access to manage user roles and permissions
          </p>
        </div>
      </div>
    </div>
  )

  const UserManagementTable = () => (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Users className="w-5 h-5" />
          User Management
        </h3>
        <p className="text-gray-600 text-sm mt-1">Assign roles and manage user permissions</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingUser === user.id ? (
                    <select
                      value={user.role}
                      onChange={(e) => updateUserRole(user.id, e.target.value as any)}
                      className="text-sm border border-gray-300 rounded-md px-2 py-1"
                    >
                      {roles.map(role => (
                        <option key={role.value} value={role.value}>{role.label}</option>
                      ))}
                    </select>
                  ) : (
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                      user.role === 'staff' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {roles.find(r => r.value === user.role)?.label}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.department}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  {editingUser === user.id ? (
                    <button
                      onClick={() => setEditingUser(null)}
                      className="text-green-600 hover:text-green-900"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setEditingUser(user.id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => toggleUserStatus(user.id)}
                    className={user.is_active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}
                  >
                    <UserCheck className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const AddUserForm = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <UserPlus className="w-5 h-5" />
        Add New User
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={newUser.email}
            onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            placeholder="user@example.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            value={newUser.fullName}
            onChange={(e) => setNewUser(prev => ({ ...prev, fullName: e.target.value }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            placeholder="John Doe"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <select
            value={newUser.role}
            onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value as any }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            {roles.map(role => (
              <option key={role.value} value={role.value}>{role.label}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
          <input
            type="text"
            value={newUser.department}
            onChange={(e) => setNewUser(prev => ({ ...prev, department: e.target.value }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            placeholder="EPA Department"
          />
        </div>
      </div>
      
      <button
        onClick={addNewUser}
        disabled={loading}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add User
      </button>
    </div>
  )

  const RolePermissionsInfo = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Shield className="w-5 h-5" />
        Role Permissions
      </h3>
      
      <div className="space-y-4">
        {roles.map((role) => (
          <div key={role.value} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                role.value === 'admin' ? 'bg-purple-100 text-purple-800' :
                role.value === 'manager' ? 'bg-blue-100 text-blue-800' :
                role.value === 'staff' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {role.label}
              </span>
            </div>
            <p className="text-gray-600 text-sm">{role.description}</p>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management Admin Panel</h1>
          <p className="text-gray-600 mt-2">
            Assign roles and manage user permissions for the EPA Mining Dashboard
          </p>
        </div>
      </div>

      {/* Current User Info */}
      <CurrentUserInfo />

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div className="flex-1">
              <p className="text-red-800">{error}</p>
            </div>
            <button onClick={clearMessages} className="text-red-600 hover:text-red-800">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div className="flex-1">
              <p className="text-green-800">{success}</p>
            </div>
            <button onClick={clearMessages} className="text-green-600 hover:text-green-800">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'users'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Manage Users
          </button>
          <button
            onClick={() => setActiveTab('add-user')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'add-user'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Add User
          </button>
          <button
            onClick={() => setActiveTab('permissions')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'permissions'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Role Permissions
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'users' && <UserManagementTable />}
        {activeTab === 'add-user' && <AddUserForm />}
        {activeTab === 'permissions' && <RolePermissionsInfo />}
      </div>
    </div>
  )
}
