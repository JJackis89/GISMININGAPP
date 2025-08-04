import { loadModules } from 'esri-loader'
import { MiningConcession, DashboardStats } from '../types'
import { arcgisConfig } from '../config/arcgisConfig'
import { hectaresToAcres } from '../utils/geometryUtils'
import { notificationService } from './notificationService'

class MiningDataService {
  private webMap: any = null
  private featureLayer: any = null
  private cachedData: MiningConcession[] = []
  private lastFetch: number = 0
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  /**
   * Initialize the service with ArcGIS feature service or web map
   */
  async initialize(): Promise<void> {
    // Skip if already initialized
    if (this.featureLayer) {
      console.log('≡ƒöä Service already initialized, skipping...')
      return
    }

    try {
      // Load ArcGIS modules using esri-loader
      const [WebMap, FeatureLayer] = await loadModules([
        'esri/WebMap',
        'esri/layers/FeatureLayer'
      ])

      // Try direct feature service first (preferred method)
      if (arcgisConfig.featureServiceUrls?.miningConcessions) {
        console.log('≡ƒöä Initializing with direct feature service...')
        console.log('≡ƒôì Feature service URL:', arcgisConfig.featureServiceUrls.miningConcessions)
        
        this.featureLayer = new FeatureLayer({
          url: arcgisConfig.featureServiceUrls.miningConcessions,
          outFields: ['*']
        })

        console.log('ΓÅ│ Loading feature layer...')
        await this.featureLayer.load()
        console.log('Γ£à Mining data service initialized with feature service:', this.featureLayer.title || 'Mining Concessions')
        console.log('≡ƒôè Layer details:', {
          id: this.featureLayer.id,
          url: this.featureLayer.url,
          geometryType: this.featureLayer.geometryType,
          capabilities: this.featureLayer.capabilities
        })
        return
      }

      // Fallback to web map
      console.log('≡ƒöä Initializing with web map...')
      this.webMap = new WebMap({
        portalItem: {
          id: arcgisConfig.primaryWebMapId
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
      console.log('Γ£à Mining data service initialized with web map layer:', this.featureLayer.title)
    } catch (error) {
      console.error('Γ¥î Failed to initialize mining data service:', error)
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
      console.log('≡ƒöä Creating query for feature layer...')
      const query = this.featureLayer.createQuery()
      query.returnGeometry = true
      query.outFields = ['*']
      
      console.log('≡ƒöä Executing query...')
      const featureSet = await this.featureLayer.queryFeatures(query)
      
      console.log(`≡ƒôè Raw feature set results:`, {
        featureCount: featureSet.features.length,
        spatialReference: featureSet.spatialReference,
        exceededTransferLimit: featureSet.exceededTransferLimit
      })

      if (featureSet.features.length === 0) {
        console.warn('ΓÜá∩╕Å No features returned from query')
        this.cachedData = []
        this.lastFetch = now
        return this.cachedData
      }

      // Log sample feature for debugging
      const sampleFeature = featureSet.features[0]
      console.log('≡ƒô¥ Sample feature attributes:', sampleFeature.attributes)
      console.log('≡ƒôì Sample feature geometry type:', sampleFeature.geometry?.type)
      
      this.cachedData = featureSet.features.map((feature: any, index: number) => {
        const attributes = feature.attributes
        const geometry = feature.geometry
        
        // Extract coordinates from polygon geometry
        const coordinates: [number, number][] = []
        if (geometry && geometry.rings && geometry.rings[0]) {
          coordinates.push(...geometry.rings[0].map((point: number[]) => [point[0], point[1]] as [number, number]))
        }

        // Map ArcGIS attributes to our interface using field mappings
        const mappings = arcgisConfig.fieldMappings

        // Debug: Log actual field values for license type
        const rawLicenseType = this.getFieldValue(attributes, mappings.permitType)
        if (index < 3) { // Only log first 3 records to avoid spam
          console.log(`≡ƒöì Record ${index + 1} - Raw LicenseType value:`, rawLicenseType)
          console.log(`≡ƒöì Record ${index + 1} - All attributes:`, Object.keys(attributes))
          console.log(`≡ƒöì Record ${index + 1} - Trying these field names for permitType:`, mappings.permitType)
          
          // Show what specific attribute values exist for permitType fields
          mappings.permitType.forEach(fieldName => {
            if (attributes[fieldName] !== undefined) {
              console.log(`≡ƒöì Record ${index + 1} - Found ${fieldName}:`, attributes[fieldName])
            }
          })
        }
        
        const decodedPermitType = this.decodeLicenseType(rawLicenseType)
        if (index < 3) {
          console.log(`≡ƒöì Record ${index + 1} - Decoded permitType:`, decodedPermitType)
        }

        // Extract area from hosted layer - if no valid area, use 0 (don't generate fake data)
        const rawSize = this.getFieldValue(attributes, mappings.size)
        let calculatedSize = 0
        
        if (rawSize && typeof rawSize === 'number' && rawSize > 0) {
          // If size is in square meters, convert to acres
          if (rawSize > 10000) { // Likely square meters if large number
            calculatedSize = this.convertSizeToAcres(rawSize)
          } else {
            // Likely already in acres if small number
            calculatedSize = Math.round(rawSize)
          }
        } else if (geometry && geometry.rings && geometry.rings[0]) {
          // Calculate area from geometry if no size field available
          calculatedSize = this.calculatePolygonArea(geometry.rings[0])
        }

        return {
          id: this.getFieldValue(attributes, mappings.id) || `MC${(index + 1).toString().padStart(3, '0')}`,
          name: this.getFieldValue(attributes, mappings.name) || `Concession ${index + 1}`,
          size: calculatedSize,
          owner: this.getFieldValue(attributes, mappings.owner) || 'Not Specified',
          permitType: decodedPermitType,
          permitExpiryDate: this.formatDate(this.getFieldValue(attributes, mappings.expiryDate)),
          district: this.getFieldValue(attributes, mappings.district) || this.extractDistrict(attributes),
          region: this.getFieldValue(attributes, mappings.region) || this.extractRegion(attributes, coordinates),
          status: this.decodeLicenseStatus(this.getFieldValue(attributes, mappings.status)),
          coordinates,
          contactInfo: {
            phone: this.getFieldValue(attributes, ['ContactNumber']) || this.getFieldValue(attributes, mappings.phone),
            email: this.getFieldValue(attributes, mappings.email),
            address: this.getFieldValue(attributes, mappings.address)
          }
        } as MiningConcession
      })

      this.lastFetch = now
      console.log(`Γ£à Fetched ${this.cachedData.length} mining concessions from ArcGIS`)
      
      // Generate notifications for expired and due-for-renewal permits
      notificationService.generatePermitNotifications(this.cachedData)
      
      return this.cachedData
    } catch (error) {
      console.error('Γ¥î Failed to fetch mining concessions:', error)
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
    const today = new Date()
    const sixMonthsFromNow = new Date()
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6)
    
    const stats: DashboardStats = {
      totalConcessions: concessions.length,
      activePermits: concessions.filter(c => {
        // Only count as active if status is Active AND not expired
        if (c.status !== 'Active') return false
        const expiryDate = new Date(c.permitExpiryDate)
        // If expiry date is invalid, consider it active
        if (isNaN(expiryDate.getTime()) || c.permitExpiryDate === 'Not Specified') return true
        // Only active if not past expiry date
        return expiryDate >= today
      }).length,
      expiredPermits: concessions.filter(c => {
        // Count as expired if status is Expired OR if expiry date has passed
        const expiryDate = new Date(c.permitExpiryDate)
        // Skip if expiry date is invalid
        if (isNaN(expiryDate.getTime()) || c.permitExpiryDate === 'Not Specified') {
          return c.status === 'Expired'
        }
        // Expired if status is Expired OR (Active but past expiry date)
        return c.status === 'Expired' || (expiryDate < today && c.status === 'Active')
      }).length,
      // Count permits due for renewal (expiring within 6 months)
      soonToExpire: concessions.filter(c => {
        // Only count active permits that are approaching expiry
        if (c.status !== 'Active') return false
        
        const expiryDate = new Date(c.permitExpiryDate)
        
        // Check if expiry date is valid and within the next 6 months
        return !isNaN(expiryDate.getTime()) && 
               c.permitExpiryDate !== 'Not Specified' &&
               expiryDate > today && 
               expiryDate <= sixMonthsFromNow
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
   * Helper method to get field value using field mappings
   */
  private getFieldValue(attributes: any, fieldMappings: string[]): any {
    if (!fieldMappings || fieldMappings.length === 0) return null

    // Try each field mapping until we find a value
    for (const fieldName of fieldMappings) {
      if (attributes[fieldName] !== undefined && attributes[fieldName] !== null) {
        return attributes[fieldName]
      }
    }
    return null
  }

  /**
   * Decode LicenseStatus from hosted layer coded values
   */
  private decodeLicenseStatus(code: string | number): string {
    const codeStr = String(code)
    switch (codeStr) {
      case '1': return 'Active'        // Active
      case '2': return 'Suspended'     // Suspended 
      case '3': return 'Expired'       // Expired
      case '4': return 'Under Review'  // Under Review
      default: 
        // Fallback to text-based mapping for non-coded values
        return this.mapStatus(codeStr)
    }
  }

  /**
   * Decode LicenseType from hosted layer coded values to actual text values
   */
  private decodeLicenseType(code: string | number | null | undefined): string {
    if (code === null || code === undefined || code === '') {
      return 'Not Specified'
    }
    
    const codeStr = String(code)
    switch (codeStr) {
      case '1': return 'Reconnaissance'    // Reconnaissance
      case '2': return 'Prospecting'       // Prospecting
      case '3': return 'Mining Lease'      // Mining Lease
      case '4': return 'Small Scale'       // Small Scale
      default:
        // For non-coded values, return the actual text value or 'Not Specified'
        if (codeStr && codeStr !== 'null' && codeStr !== 'undefined') {
          return codeStr
        }
        return 'Not Specified'
    }
  }

  /**
   * Convert size from square meters to acres (hosted layer uses square meters)
   */
  private convertSizeToAcres(sizeInSquareMeters: number): number {
    // 1 square meter = 0.000247105 acres
    return Math.round(sizeInSquareMeters * 0.000247105)
  }

  /**
   * Calculate polygon area from coordinates and convert to acres
   */
  private calculatePolygonArea(coordinates: number[][]): number {
    if (!coordinates || coordinates.length < 3) return 0
    
    // Simple polygon area calculation using shoelace formula
    let area = 0
    const n = coordinates.length
    
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      area += coordinates[i][0] * coordinates[j][1]
      area -= coordinates[j][0] * coordinates[i][1]
    }
    
    // Convert from coordinate units to square meters (approximate)
    // This is a rough approximation - for precise calculations you'd need to account for projection
    area = Math.abs(area) / 2
    
    // Convert square meters to acres and round
    return Math.round(area * 111000 * 111000 * 0.000247105) // Rough lat/lon to meters conversion
  }

  /**
   * Map permit type from various possible values
   */
  private mapPermitType(value: string): 'small-scale' | 'large-scale' {
    if (!value) return 'small-scale'
    const lower = value.toLowerCase()
    if (lower.includes('large') || lower.includes('major') || lower.includes('commercial') || 
        lower.includes('reconnaissance') || lower.includes('prospecting') || lower.includes('lease')) {
      return 'large-scale'
    }
    return 'small-scale'
  }

  /**
   * Map status from various possible values
   */
  private mapStatus(value: string): string {
    if (!value) return 'Active'
    const lower = value.toLowerCase()
    if (lower.includes('expired') || lower.includes('inactive')) {
      return 'Expired'
    }
    if (lower.includes('suspended')) {
      return 'Suspended'
    }
    if (lower.includes('pending') || lower.includes('review')) {
      return 'Under Review'
    }
    return 'Active'
  }

  /**
   * Format date string
   */
  private formatDate(dateValue: any): string {
    if (!dateValue) return 'Not Specified'
    if (typeof dateValue === 'number') {
      return new Date(dateValue).toISOString().split('T')[0]
    }
    if (typeof dateValue === 'string') {
      const date = new Date(dateValue)
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0]
      }
    }
    return 'Not Specified'
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
   * Refresh data and notify all components
   */
  async refreshAndNotify(): Promise<void> {
    console.log('≡ƒöä Refreshing mining data and notifying components...')
    this.clearCache()
    
    try {
      await this.getMiningConcessions(true)
      console.log('Γ£à Data refreshed successfully')
    } catch (error) {
      console.error('Γ¥î Error refreshing data:', error)
    }
  }

  /**
   * Export concessions data to CSV format
   */
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

// Export singleton instance
export const miningDataService = new MiningDataService()
export default miningDataService
