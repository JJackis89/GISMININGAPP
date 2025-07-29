import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { 
  Map, 
  Filter, 
  BarChart3, 
  ChevronLeft,
  ChevronRight,
  Settings,
  Shield
} from 'lucide-react'

const menuItems = [
  { icon: Map, label: 'Map View', path: '/map-view' },
  { icon: Filter, label: 'Filters', path: '/filters' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
]

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { hasPermission } = useAuth()

  const handleNavigation = (path: string) => {
    navigate(path)
  }

  // Add admin panel to menu based on permissions
  let allMenuItems = [...menuItems]
  
  // Add admin panel for users with admin access
  if (hasPermission('canAccessAdminPanel')) {
    allMenuItems.push({ icon: Settings, label: 'Admin Panel', path: '/admin' })
  }

  return (
    <div className={`bg-white shadow-sm border-r border-gray-200 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-end text-gray-500 hover:text-gray-700"
          >
            {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {allMenuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            const isAdminItem = item.path === '/admin'
            
            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  isActive
                    ? isAdminItem
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-epa-orange-50 text-epa-orange-700 border border-epa-orange-200'
                    : isAdminItem
                      ? 'text-red-600 hover:bg-red-50 hover:text-red-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="font-medium flex items-center">
                    {item.label}
                    {isAdminItem && <Shield className="h-3 w-3 ml-1" />}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
