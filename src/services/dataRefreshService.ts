import { miningDataService } from '../services/miningDataService'

/**
 * Data refresh utility to coordinate updates across all dashboard components
 */
class DataRefreshService {
  private refreshCallbacks: (() => void)[] = []

  /**
   * Register a callback to be called when data needs to be refreshed
   */
  registerRefreshCallback(callback: () => void) {
    this.refreshCallbacks.push(callback)
  }

  /**
   * Unregister a refresh callback
   */
  unregisterRefreshCallback(callback: () => void) {
    this.refreshCallbacks = this.refreshCallbacks.filter(cb => cb !== callback)
  }

  /**
   * Force refresh all components by clearing cache and notifying all registered callbacks
   */
  async forceRefreshAll() {
    console.log('🔄 DataRefreshService: Force refreshing all components...')
    
    // Clear all possible caches
    miningDataService.clearCache()
    
    // Clear browser storage that might cache data
    try {
      localStorage.removeItem('mining-concessions-cache')
      sessionStorage.clear()
    } catch (e) {
      console.warn('Could not clear storage:', e)
    }
    
    // Force fresh data fetch from hosted layer only
    try {
      await miningDataService.initialize()
      const freshData = await miningDataService.getMiningConcessions(true) // Force refresh
      console.log(`✅ DataRefreshService: Verified fresh data from hosted layer - ${freshData.length} concessions`)
      
      // Log sample data to verify it's real
      if (freshData.length > 0) {
        console.log('🔍 Sample concession from hosted layer:', {
          id: freshData[0].id,
          name: freshData[0].name,
          status: freshData[0].status,
          size: freshData[0].size,
          owner: freshData[0].owner
        })
        
        // Count active permits from fresh data
        const activeCount = freshData.filter(c => c.status === 'Active').length
        console.log(`📊 Active permits count from fresh hosted layer data: ${activeCount}`)
      }
    } catch (error) {
      console.error('❌ DataRefreshService: Failed to refresh hosted layer data:', error)
    }
    
    // Notify all registered components to refresh their data
    this.refreshCallbacks.forEach(callback => {
      try {
        callback()
      } catch (error) {
        console.error('Error calling refresh callback:', error)
      }
    })
    
    console.log(`✅ DataRefreshService: Notified ${this.refreshCallbacks.length} components to refresh`)
  }

  /**
   * Refresh data with a small delay to allow for hosted layer sync
   */
  async refreshWithDelay(delayMs: number = 2000) {
    console.log(`⏳ DataRefreshService: Refreshing in ${delayMs}ms...`)
    setTimeout(() => {
      this.forceRefreshAll()
    }, delayMs)
  }
}

// Export singleton instance
export const dataRefreshService = new DataRefreshService()
export default dataRefreshService
