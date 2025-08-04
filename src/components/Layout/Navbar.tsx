import { useAuth } from '../../contexts/AuthContext'
import { User, LogOut, Bell, AlertTriangle, Clock } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { notificationService, Notification } from '../../services/notificationService'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const notificationRef = useRef<HTMLDivElement>(null)
  const unreadCount = notifications.filter(n => !n.read).length

  useEffect(() => {
    // Subscribe to notification changes
    const unsubscribe = notificationService.subscribe(setNotifications)
    
    // Get initial notifications
    setNotifications(notificationService.getNotifications())
    
    return unsubscribe
  }, [])

  useEffect(() => {
    // Close notification dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showNotifications])

  const handleMarkAsRead = (notificationId: string) => {
    notificationService.markAsRead(notificationId)
  }

  const handleMarkAllAsRead = () => {
    notificationService.markAllAsRead()
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'expired': return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'due-for-renewal': return <Clock className="h-4 w-4 text-yellow-600" />
      default: return <Bell className="h-4 w-4 text-blue-600" />
    }
  }

  return (
    <nav className="bg-white shadow-sm border-b-2 border-epa-orange-500">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="/epa-logo.png" alt="EPA Logo" className="h-10 w-10" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">EPA MINING DATABASE</h1>
              <p className="text-sm text-gray-600">Environmental Protection Authority</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative" ref={notificationRef}>
              <button 
                className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllAsRead}
                          className="text-sm text-epa-orange-600 hover:text-epa-orange-700"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        <Bell className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p>No notifications</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                            !notification.read ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-1">
                              {getTypeIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-900">
                                  {notification.title}
                                </p>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(notification.priority)}`}>
                                  {notification.priority}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                {notification.message}
                              </p>
                              {notification.concessionName && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Concession: {notification.concessionName}
                                </p>
                              )}
                              <p className="text-xs text-gray-400 mt-2">
                                {notification.timestamp.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {notifications.length > 0 && (
                    <div className="p-4 border-t border-gray-200">
                      <button
                        onClick={() => notificationService.clearAll()}
                        className="w-full text-sm text-red-600 hover:text-red-700"
                      >
                        Clear all notifications
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

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
