import React from 'react'
import RealFirebaseAdminPanel from '../components/Admin/RealFirebaseAdminPanel'
import AdminRoute from '../components/Admin/AdminRoute'

const AdminPage: React.FC = () => {
  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-50">
        <RealFirebaseAdminPanel />
      </div>
    </AdminRoute>
  )
}

export default AdminPage
