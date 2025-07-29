import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Users, UserPlus, Shield, AlertCircle, CheckCircle, X, Info, Settings, Database } from 'lucide-react'
import { User } from '../../types'

// Real Firebase Admin Panel that works with actual Firebase users
export default function RealFirebaseAdminPanel() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // User roles with descriptions
  const roles = [
    { value: 'admin', label: 'Administrator', description: 'Full system access, can manage all users and settings', color: 'purple' },
    { value: 'manager', label: 'Manager', description: 'Can manage mining concessions and supervise staff', color: 'blue' },
    { value: 'staff', label: 'Staff', description: 'Standard access for daily operations', color: 'green' },
    { value: 'viewer', label: 'Viewer', description: 'Read-only access to mining data', color: 'gray' }
  ]

  const clearMessages = () => {
    setError(null)
    setSuccess(null)
  }

  useEffect(() => {
    clearMessages()
  }, [activeTab])

  const CurrentUserInfo = () => (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-3">
        <CheckCircle className="w-5 h-5 text-green-600" />
        <div>
          <h3 className="font-medium text-green-800">Firebase Admin Access</h3>
          <p className="text-green-700 text-sm mt-1">
            Logged in as: <strong>{user?.email}</strong> ({user?.role})
          </p>
          <p className="text-green-600 text-xs mt-1">
            Firebase Authentication Active - Managing real users
          </p>
        </div>
      </div>
    </div>
  )

  const FirebaseUserManagement = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Users className="w-5 h-5" />
        Firebase User Management
      </h3>
      
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
            <Info className="w-4 h-4" />
            Current Firebase User
          </h4>
          <div className="text-sm text-blue-700 space-y-2">
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> {user?.role}</p>
            <p><strong>Department:</strong> {user?.department}</p>
            <p><strong>User ID:</strong> {user?.id}</p>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-medium text-yellow-800 mb-2">Managing Real Firebase Users</h4>
          <div className="text-sm text-yellow-700 space-y-2">
            <p>To manage user roles for your Firebase users, you have several options:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Use Firebase Admin SDK (server-side) to set custom claims</li>
              <li>Store user roles in Firestore database</li>
              <li>Update role logic in firebase-auth.ts for email-based roles</li>
              <li>Use Firebase Functions for user management</li>
            </ul>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-800 mb-2">Current Role Assignment Logic</h4>
          <div className="text-sm text-gray-600">
            <p>Roles are currently assigned in <code>firebase-auth.ts</code> based on email patterns:</p>
            <pre className="mt-2 p-2 bg-white rounded border text-xs overflow-x-auto">
{`// Current logic in determineUserRole():
if (email === 'gismining025@gmail.com') return 'admin'
if (email.includes('admin@')) return 'admin'
if (email.includes('manager@')) return 'manager' 
if (email.includes('@epa.gov.gh')) return 'staff'
return 'viewer'`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )

  const RoleManagementOptions = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Shield className="w-5 h-5" />
        Role Management Options
      </h3>
      
      <div className="grid gap-4">
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Option 1: Code-Based Role Assignment
          </h4>
          <p className="text-gray-600 text-sm mb-3">
            Update the <code>determineUserRole</code> function in firebase-auth.ts to assign roles based on email patterns.
          </p>
          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
            <strong>Pros:</strong> Simple, immediate effect<br/>
            <strong>Cons:</strong> Requires code changes for each new admin
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
            <Database className="w-4 h-4" />
            Option 2: Firestore Database Storage
          </h4>
          <p className="text-gray-600 text-sm mb-3">
            Store user roles in Firestore and query them when determining permissions.
          </p>
          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
            <strong>Pros:</strong> Dynamic role management, admin panel can update roles<br/>
            <strong>Cons:</strong> Requires Firestore setup and additional queries
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Option 3: Firebase Custom Claims
          </h4>
          <p className="text-gray-600 text-sm mb-3">
            Use Firebase Admin SDK to set custom claims on user tokens (requires server-side implementation).
          </p>
          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
            <strong>Pros:</strong> Built into Firebase, secure, cached in tokens<br/>
            <strong>Cons:</strong> Requires Firebase Admin SDK and server-side code
          </div>
        </div>
      </div>
    </div>
  )

  const QuickRoleUpdate = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <UserPlus className="w-5 h-5" />
        Quick Role Assignment
      </h3>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">To Make Someone Admin Right Now:</h4>
        <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
          <li>Open <code>/src/lib/firebase-auth.ts</code></li>
          <li>Find the <code>determineUserRole</code> function (around line 40)</li>
          <li>Add a new line: <code>if (email === 'newemail@example.com') return 'admin'</code></li>
          <li>Save the file and restart your development server</li>
          <li>The user will have admin access on their next login</li>
        </ol>
      </div>

      <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-medium text-green-800 mb-2">Example Code Update:</h4>
        <pre className="text-xs text-green-700 bg-white p-2 rounded border overflow-x-auto">
{`// In firebase-auth.ts - determineUserRole function:
if (email === 'gismining025@gmail.com') return 'admin'
if (email === 'newadmin@epa.gov.gh') return 'admin'  // Add this
if (email === 'manager@company.com') return 'manager'  // Or this
if (email.includes('admin@')) return 'admin'`}
        </pre>
      </div>
    </div>
  )

  const RolePermissionsTable = () => (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold">Role Permissions Matrix</h3>
        <p className="text-gray-600 text-sm mt-1">What each role can do in the system</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin Panel</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manage Users</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Edit Data</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">View Data</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {roles.map((role) => (
              <tr key={role.value} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    role.color === 'purple' ? 'bg-purple-100 text-purple-800' :
                    role.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                    role.color === 'green' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {role.label}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {role.value === 'admin' ? '✅ Full Access' : '❌ No Access'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {role.value === 'admin' ? '✅ Yes' : '❌ No'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {role.value === 'admin' || role.value === 'manager' || role.value === 'staff' ? '✅ Yes' : '❌ No'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  ✅ Yes
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Firebase Admin Panel</h1>
          <p className="text-gray-600 mt-2">
            Manage roles for real Firebase authenticated users
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
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('role-assignment')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'role-assignment'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Role Assignment
          </button>
          <button
            onClick={() => setActiveTab('permissions')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'permissions'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Permissions
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid gap-6">
            <FirebaseUserManagement />
            <QuickRoleUpdate />
          </div>
        )}

        {activeTab === 'role-assignment' && (
          <div className="grid gap-6">
            <RoleManagementOptions />
            <QuickRoleUpdate />
          </div>
        )}

        {activeTab === 'permissions' && (
          <div className="grid gap-6">
            <RolePermissionsTable />
          </div>
        )}
      </div>
    </div>
  )
}
