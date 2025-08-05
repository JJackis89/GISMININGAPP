import { MiningConcession } from '../types'

export interface Notification {
  id: string
  type: 'expired' | 'due-for-renewal' | 'info' | 'warning' | 'error'
  title: string
  message: string
  concessionId?: string
  concessionName?: string
  timestamp: Date
  read: boolean
  priority: 'low' | 'medium' | 'high'
}

class NotificationService {
  private notifications: Notification[] = []
  private listeners: ((notifications: Notification[]) => void)[] = []

  /**
   * Generate notifications for expired and due-for-renewal permits
   */
  generatePermitNotifications(concessions: MiningConcession[]): void {
    const newNotifications: Notification[] = []
    const today = new Date()
    const sixMonthsFromNow = new Date()
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6)

    // Clear existing permit notifications
    this.notifications = this.notifications.filter(
      n => n.type !== 'expired' && n.type !== 'due-for-renewal'
    )

    concessions.forEach(concession => {
      const expiryDate = new Date(concession.permitExpiryDate)
      
      // Skip if expiry date is invalid
      if (isNaN(expiryDate.getTime()) || concession.permitExpiryDate === 'Not Specified') {
        return
      }

      // Notification for expired permits - ONLY based on expiry date, ignore status field
      if (expiryDate < today) {
        newNotifications.push({
          id: `expired-${concession.id}`,
          type: 'expired',
          title: 'Permit Expired',
          message: `Mining permit for "${concession.name}" has expired and requires immediate attention.`,
          concessionId: concession.id,
          concessionName: concession.name,
          timestamp: new Date(),
          read: false,
          priority: 'high'
        })
      }
      // Notification for permits due for renewal (within 6 months) - ONLY based on expiry date
      else if (expiryDate > today && expiryDate <= sixMonthsFromNow) {
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        const priority = daysUntilExpiry <= 30 ? 'high' : daysUntilExpiry <= 90 ? 'medium' : 'low'
        
        newNotifications.push({
          id: `renewal-${concession.id}`,
          type: 'due-for-renewal',
          title: 'Permit Due for Renewal',
          message: `Mining permit for "${concession.name}" expires in ${daysUntilExpiry} days. Renewal process should begin soon.`,
          concessionId: concession.id,
          concessionName: concession.name,
          timestamp: new Date(),
          read: false,
          priority
        })
      }
    })

    // Add new notifications
    this.notifications.push(...newNotifications)
    
    // Sort by priority and timestamp
    this.notifications.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      }
      return b.timestamp.getTime() - a.timestamp.getTime()
    })

    // Notify listeners
    this.notifyListeners()
  }

  /**
   * Get all notifications
   */
  getNotifications(): Notification[] {
    return [...this.notifications]
  }

  /**
   * Get unread notifications count
   */
  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length
  }

  /**
   * Get notifications by type
   */
  getNotificationsByType(type: Notification['type']): Notification[] {
    return this.notifications.filter(n => n.type === type)
  }

  /**
   * Mark notification as read
   */
  markAsRead(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId)
    if (notification) {
      notification.read = true
      this.notifyListeners()
    }
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true)
    this.notifyListeners()
  }

  /**
   * Remove notification
   */
  removeNotification(notificationId: string): void {
    this.notifications = this.notifications.filter(n => n.id !== notificationId)
    this.notifyListeners()
  }

  /**
   * Clear all notifications
   */
  clearAll(): void {
    this.notifications = []
    this.notifyListeners()
  }

  /**
   * Add custom notification
   */
  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): void {
    const newNotification: Notification = {
      ...notification,
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false
    }
    
    this.notifications.unshift(newNotification)
    this.notifyListeners()
  }

  /**
   * Subscribe to notification changes
   */
  subscribe(listener: (notifications: Notification[]) => void): () => void {
    this.listeners.push(listener)
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  /**
   * Notify all listeners of changes
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener([...this.notifications]))
  }

  /**
   * Get summary of critical notifications
   */
  getCriticalSummary(): { expired: number; dueForRenewal: number } {
    return {
      expired: this.notifications.filter(n => n.type === 'expired').length,
      dueForRenewal: this.notifications.filter(n => n.type === 'due-for-renewal').length
    }
  }
}

// Export singleton instance
export const notificationService = new NotificationService()
export default notificationService
