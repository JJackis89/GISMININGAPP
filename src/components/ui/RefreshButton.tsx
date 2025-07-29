import React, { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { dataRefreshService } from '../../services/dataRefreshService'

interface RefreshButtonProps {
  className?: string
  label?: string
  showLabel?: boolean
}

export default function RefreshButton({ 
  className = "", 
  label = "Refresh Data",
  showLabel = true 
}: RefreshButtonProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      console.log('🔄 Manual refresh triggered...')
      await dataRefreshService.forceRefreshAll()
      
      // Add a small delay to show the refresh animation
      setTimeout(() => {
        setIsRefreshing(false)
        console.log('✅ Manual refresh completed')
      }, 1500)
    } catch (error) {
      console.error('❌ Error during manual refresh:', error)
      setIsRefreshing(false)
    }
  }

  return (
    <button
      onClick={handleRefresh}
      disabled={isRefreshing}
      className={`
        flex items-center gap-2 px-3 py-2 
        bg-blue-600 text-white rounded-lg 
        hover:bg-blue-700 transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      title="Force refresh all dashboard components with latest hosted layer data"
    >
      <RefreshCw 
        className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} 
      />
      {showLabel && (
        <span className="text-sm font-medium">
          {isRefreshing ? 'Refreshing...' : label}
        </span>
      )}
    </button>
  )
}
