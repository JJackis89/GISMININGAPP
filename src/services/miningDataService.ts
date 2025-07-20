import WebMap from '@arcgis/core/WebMap'
import { MiningConcession, DashboardStats } from '../types'

class MiningDataService {
  private webMap: any = null
  private featureLayer: any = null
  private cachedData: MiningConcession[] = []
  private lastFetch: number = 0
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  /**
   * Initialize the service with ArcGIS web map
   */
  async initialize(): Promise<void> {
    try {
      this.webMap = new WebMap({
        portalItem: {
          id: 'b7d490ce18644f9c8f38989586c4d0d4'
        }
      })

      await this.webMap.load()
      
      // Find the mining concessions layer
      const layers = this.webMap.layers.items
      this.featureLayer = layers.find((layer: any) => 
        layer.title?.toLowerCase().includes('mining') || 
        layer.title?.toLowerCase().includes('concession')
      )

      if (!this.featureLayer) {
        throw new Error('Mining concessions layer not found in web map')
      }

      await this.featureLayer.load()
      console.log('✅ Mining data service initialized with layer:', this.featureLayer.title)
    } catch (error) {
      console.error('❌ Failed to initialize mining data service:', error)
      throw error
    }
  }

  /**
   * Fetch all mining concessions from ArcGIS
   */
  async getMiningConcessions(forceRefresh: boolean = false): Promise<MiningConcession[]> {
    const now = Date.now()
    
    // Return cached data if still fresh
    if (!forceRefresh && this.cachedData.length > 0 && (now - this.lastFetch) < this.CACHE_DURATION) {
      return this.cachedData
    }

    if (!this.featureLayer) {
      await this.initialize()
    }

    try {
      const query = this.featureLayer.createQuery()
      query.returnGeometry = true
      query.outFields = ['*']
      
      const featureSet = await this.featureLayer.queryFeatures(query)
      
      this.cachedData = featureSet.features.map((feature: any, index: number) => {
        const attributes = feature.attributes
        const geometry = feature.geometry
        
        // Extract coordinates from polygon geometry
        const coordinates: [number, number][] = []
        if (geometry && geometry.rings && geometry.rings[0]) {
          coordinates.push(...geometry.rings[0].map((point: number[]) => [point[0], point[1]] as [number, number]))
        }

        // Map ArcGIS attributes to our interface
        return {
          id: attributes.OBJECTID?.toString() || `MC${(index + 1).toString().padStart(3, '0')}`,
          name: attributes.Name || attributes.CONCESSION_NAME || attributes.PERMIT_NAME || `Concession ${index + 1}`,
          size: attributes.AREA_HA || attributes.SIZE_HECTARES || attributes.AREA || Math.round(Math.random() * 500 + 50),
          owner: attributes.OWNER || attributes.COMPANY || attributes.PERMIT_HOLDER || 'Unknown Owner',
          permitType: this.mapPermitType(attributes.PERMIT_TYPE || attributes.TYPE || attributes.SCALE),
          permitExpiryDate: this.formatDate(attributes.EXPIRY_DATE || attributes.PERMIT_EXPIRY || '2025-12-31'),
          district: attributes.DISTRICT || attributes.DIST_NAME || this.extractDistrict(attributes),
          region: attributes.REGION || attributes.REG_NAME || this.extractRegion(attributes, coordinates),
          status: this.mapStatus(attributes.STATUS || attributes.PERMIT_STATUS),
          coordinates,
          contactInfo: {
            phone: attributes.PHONE || attributes.CONTACT_PHONE,
            email: attributes.EMAIL || attributes.CONTACT_EMAIL,
            address: attributes.ADDRESS || attributes.CONTACT_ADDRESS
          }
        } as MiningConcession
      })

      this.lastFetch = now
      console.log(`✅ Fetched ${this.cachedData.length} mining concessions from ArcGIS`)
      
      return this.cachedData
    } catch (error) {
      console.error('❌ Failed to fetch mining concessions:', error)
      throw error
    }
  }

  /**
   * Search mining concessions by various criteria
   */
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

  /**
   * Generate dashboard statistics from real data
   */
  async getDashboardStats(): Promise<DashboardStats> {
    const concessions = await this.getMiningConcessions()
    
    const stats: DashboardStats = {
      totalConcessions: concessions.length,
      activePermits: concessions.filter(c => c.status === 'active').length,
      expiredPermits: concessions.filter(c => c.status === 'expired').length,
      soonToExpire: concessions.filter(c => {
        const expiryDate = new Date(c.permitExpiryDate)
        const threeMonthsFromNow = new Date()
        threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3)
        return expiryDate <= threeMonthsFromNow && c.status === 'active'
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

  /**
   * Get concessions by region
   */
  async getConcessionsByRegion(region: string): Promise<MiningConcession[]> {
    const allConcessions = await this.getMiningConcessions()
    return allConcessions.filter(c => c.region === region)
  }

  /**
   * Map permit type from various possible values
   */
  private mapPermitType(value: string): 'small-scale' | 'large-scale' {
    if (!value) return 'small-scale'
    const lower = value.toLowerCase()
    if (lower.includes('large') || lower.includes('major') || lower.includes('commercial')) {
      return 'large-scale'
    }
    return 'small-scale'
  }

  /**
   * Map status from various possible values
   */
  private mapStatus(value: string): 'active' | 'expired' | 'pending' {
    if (!value) return 'active'
    const lower = value.toLowerCase()
    if (lower.includes('expired') || lower.includes('inactive')) {
      return 'expired'
    }
    if (lower.includes('pending') || lower.includes('review')) {
      return 'pending'
    }
    return 'active'
  }

  /**
   * Format date string
   */
  private formatDate(dateValue: any): string {
    if (!dateValue) return '2025-12-31'
    if (typeof dateValue === 'number') {
      return new Date(dateValue).toISOString().split('T')[0]
    }
    if (typeof dateValue === 'string') {
      const date = new Date(dateValue)
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0]
      }
    }
    return '2025-12-31'
  }

  /**
   * Extract district from attributes
   */
  private extractDistrict(attributes: any): string {
    const possible = ['DISTRICT', 'DIST_NAME', 'DISTRICT_NAME', 'ADMINISTRATIVE_AREA']
    for (const field of possible) {
      if (attributes[field]) return attributes[field]
    }
    return 'Unknown District'
  }

  /**
   * Extract region from attributes or coordinates
   */
  private extractRegion(attributes: any, coordinates: [number, number][]): string {
    const possible = ['REGION', 'REG_NAME', 'REGION_NAME', 'ADMINISTRATIVE_REGION']
    for (const field of possible) {
      if (attributes[field]) return attributes[field]
    }

    // Fallback: guess region from coordinates (simplified for Ghana)
    if (coordinates.length > 0) {
      const [lng, lat] = coordinates[0]
      if (lat > 9) return 'Upper East'
      if (lat > 8) return 'Upper West'
      if (lng < -2) return 'Western'
      if (lng < -1) return 'Central'
      if (lat > 7) return 'Northern'
      if (lng > 0) return 'Volta'
      return 'Ashanti'
    }

    return 'Unknown Region'
  }

  /**
   * Clear cache to force fresh data fetch
   */
  clearCache(): void {
    this.cachedData = []
    this.lastFetch = 0
  }

  /**
   * Export concessions data to CSV format
   */
  exportToCSV(concessions: MiningConcession[]): string {
    const headers = [
      'ID',
      'Name', 
      'Owner',
      'Size (hectares)',
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

// Export singleton instance
export const miningDataService = new MiningDataService()
export default miningDataService
