import React from 'react'
import RealDataAdminPanel from '../components/Admin/RealDataAdminPanel'

const AdminTestPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <RealDataAdminPanel 
        onBack={() => console.log('Back button clicked')}
      />
    </div>
  )
}

export default AdminTestPage
