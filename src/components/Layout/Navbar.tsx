import { useAuth } from '../../contexts/AuthContext'
import { User, LogOut, Bell } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="bg-white shadow-sm border-b-2 border-epa-orange-500">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="/epa-logo.png" alt="EPA Logo" className="h-10 w-10" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">EPA Mining Concessions</h1>
              <p className="text-sm text-gray-600">Environmental Protection Authority</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-400" />
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{user?.full_name || user?.email?.split('@')[0]}</p>
                  <p className="text-gray-500">{user?.email}</p>
                </div>
              </div>
              
              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
