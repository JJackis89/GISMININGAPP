import { MiningConcession, DashboardStats } from '../types'
import { miningDataService } from './miningDataService'

/**
 * Unified Data Service - Main data service for the EPA Mining Concessions application
 * This service uses ArcGIS as the primary data source
 */
class UnifiedDataService {
  private isInitialized = false

  /**
   * Initialize the ArcGIS data service
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log('🔄 Data service already initialized')
      return
    }

    console.log('🚀 Initializing ArcGIS data service...')

    try {
      await miningDataService.initialize()
      this.isInitialized = true
      console.log('✅ ArcGIS data service initialized successfully')
    } catch (error) {
      console.error('❌ Failed to initialize ArcGIS service:', error)
      throw error
    }
  }

  /**
   * Fetch all mining concessions from ArcGIS
   */
  async getMiningConcessions(forceRefresh: boolean = false): Promise<MiningConcession[]> {
    if (!this.isInitialized) {
      await this.initialize()
    }
    
    return await miningDataService.getMiningConcessions(forceRefresh)
  }

  /**
   * Search concessions with filters
   */
  async searchConcessions(searchCriteria: {
    name?: string
    owner?: string
    region?: string
    status?: string
    permitType?: string
  }): Promise<MiningConcession[]> {
    return await miningDataService.searchConcessions(searchCriteria)
  }

  /**
   * Generate dashboard statistics
   */
  async getDashboardStats(): Promise<DashboardStats> {
    return await miningDataService.getDashboardStats()
  }

  /**
   * Export concessions to CSV
   */
  exportToCSV(concessions: MiningConcession[]): string {
    return miningDataService.exportToCSV(concessions)
  }

  /**
   * Get data source status for UI display
   */
  getStatusForUI(): {
    source: string
    color: 'green' | 'yellow' | 'red'
    message: string
    canEdit: boolean
  } {
    return {
      source: 'ArcGIS Online',
      color: 'green',
      message: 'Connected to ArcGIS Online with reliable data access',
      canEdit: false
    }
  }
}

// Export singleton instance
export const unifiedDataService = new UnifiedDataService()
export default unifiedDataService
