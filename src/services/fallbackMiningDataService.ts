import { MiningConcession, DashboardStats } from '../types'
import { mockConcessions } from '../data/mockData'

/**
 * Fallback mining data service for environments where ArcGIS modules cannot be loaded
 * This provides mock data to ensure the application remains functional
 */
class FallbackMiningDataService {
  private cachedData: MiningConcession[] = []
  private initialized = false

  async initialize(): Promise<void> {
    if (this.initialized) return
    
    console.log('🔄 Using fallback mining data service with mock data')
    this.cachedData = [...mockConcessions]
    this.initialized = true
  }

  async getMiningConcessions(forceRefresh: boolean = false): Promise<MiningConcession[]> {
    await this.initialize()
    return [...this.cachedData]
  }

  async searchConcessions(searchCriteria: {
    name?: string
    owner?: string
    region?: string
    status?: string
    permitType?: string
  }): Promise<MiningConcession[]> {
    const allConcessions = await this.getMiningConcessions()
    
    return allConcessions.filter(concession => {
      if (searchCriteria.name && !concession.name.toLowerCase().includes(searchCriteria.name.toLowerCase())) {
        return false
      }
      if (searchCriteria.owner && !concession.owner.toLowerCase().includes(searchCriteria.owner.toLowerCase())) {
        return false
      }
      if (searchCriteria.region && concession.region !== searchCriteria.region) {
        return false
      }
      if (searchCriteria.status && concession.status !== searchCriteria.status) {
        return false
      }
      if (searchCriteria.permitType && concession.permitType !== searchCriteria.permitType) {
        return false
      }
      return true
    })
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const concessions = await this.getMiningConcessions()
    
    const stats: DashboardStats = {
      totalConcessions: concessions.length,
      activePermits: concessions.filter(c => c.status === 'Active').length,
      expiredPermits: concessions.filter(c => c.status === 'Expired').length,
      soonToExpire: concessions.filter(c => {
        const expiryDate = new Date(c.permitExpiryDate)
        const threeMonthsFromNow = new Date()
        threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3)
        return expiryDate <= threeMonthsFromNow && c.status === 'Active'
      }).length,
      totalAreaCovered: concessions.reduce((total, c) => total + c.size, 0),
      concessionsByRegion: {},
      concessionsByType: {}
    }

    // Group by region
    concessions.forEach(concession => {
      stats.concessionsByRegion[concession.region] = (stats.concessionsByRegion[concession.region] || 0) + 1
    })

    // Group by type
    concessions.forEach(concession => {
      stats.concessionsByType[concession.permitType] = (stats.concessionsByType[concession.permitType] || 0) + 1
    })

    return stats
  }

  async getConcessionsByRegion(region: string): Promise<MiningConcession[]> {
    const allConcessions = await this.getMiningConcessions()
    return allConcessions.filter(c => c.region === region)
  }

  clearCache(): void {
    this.cachedData = []
    this.initialized = false
  }

  async refreshAndNotify(): Promise<void> {
    this.clearCache()
    await this.getMiningConcessions(true)
  }

  exportToCSV(concessions: MiningConcession[]): string {
    const headers = [
      'ID',
      'Name', 
      'Owner',
      'Size (acres)',
      'Permit Type',
      'Status',
      'Region',
      'District',
      'Permit Expiry Date',
      'Coordinates'
    ]

    const csvContent = [
      headers.join(','),
      ...concessions.map(concession => [
        concession.id,
        `"${concession.name}"`,
        `"${concession.owner}"`,
        concession.size,
        concession.permitType,
        concession.status,
        concession.region,
        concession.district,
        concession.permitExpiryDate,
        `"${concession.coordinates.map(coord => `${coord[0]},${coord[1]}`).join(';')}"`
      ].join(','))
    ].join('\n')

    return csvContent
  }
}

export const fallbackMiningDataService = new FallbackMiningDataService()
export default fallbackMiningDataService
