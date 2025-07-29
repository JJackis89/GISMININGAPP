import { MiningConcession, DashboardStats } from '../types'
import { arcgisConfig } from '../config/arcgisConfig'
import { processConcessionBoundary } from '../utils/geometryUtils'

export class ArcGISService {
  private webMapId = arcgisConfig.primaryWebMapId
  private fallbackWebMapId = arcgisConfig.fallbackWebMapId
  private webMap: any = null
  private isInitialized = false

  async initialize(): Promise<void> {
    if (this.isInitialized || !window.require) {
      return
    }

    return new Promise((resolve, reject) => {
      window.require([
        'esri/WebMap'
      ], async (WebMap: any) => {
        try {
          console.log('Initializing WebMap with ID:', this.webMapId)
          
          // Try the primary web map first
          this.webMap = new WebMap({
            portalItem: {
              id: this.webMapId
            }
          })

          console.log('WebMap created, attempting to load...')
          await this.webMap.load()
          
          this.isInitialized = true
          console.log('ArcGIS Service initialized successfully with primary web map')
          console.log('WebMap properties:', {
            title: this.webMap.portalItem?.title,
            owner: this.webMap.portalItem?.owner,
            access: this.webMap.portalItem?.access,
            layersCount: this.webMap.layers?.length
          })
          resolve()
        } catch (error: any) {
          console.error('Primary web map failed, trying fallback...', error)
          
          try {
            // Try fallback public web map
            console.log('Trying fallback web map:', this.fallbackWebMapId)
            this.webMap = new WebMap({
              portalItem: {
                id: this.fallbackWebMapId
              }
            })
            
            await this.webMap.load()
            this.isInitialized = true
            console.log('ArcGIS Service initialized with fallback web map')
            resolve()
          } catch (fallbackError: any) {
            console.error('Both web maps failed:', fallbackError)
            console.error('Error details:', {
              primaryError: error?.message || 'No error message',
              fallbackError: fallbackError?.message || 'No error message',
              webMapId: this.webMapId
            })
            reject(fallbackError)
          }
        }
      })
    })
  }

  async getConcessions(): Promise<MiningConcession[]> {
    console.log('=== ArcGIS Service: Starting data fetch ===')
    
    try {
      // First try: Direct feature service if available
      if (arcgisConfig.featureServiceUrls?.miningConcessions) {
        console.log('Trying direct feature service...')
        const featureData = await this.queryFeatureService(arcgisConfig.featureServiceUrls.miningConcessions)
        if (featureData.length > 0) {
          console.log(`Success: Loaded ${featureData.length} features from feature service`)
          return featureData
        }
      }

      // Second try: Web map approach
      console.log('Trying web map approach...')
      if (!this.isInitialized) {
        await this.initialize()
      }

      if (!this.webMap) {
        throw new Error('WebMap not initialized')
      }

      return new Promise((resolve) => {
        window.require(['esri/rest/support/Query'], async () => {
          try {
            const layers = this.webMap.layers.items
            console.log('Available layers:', layers.map((l: any) => ({ title: l.title, type: l.type, url: l.url })))

            if (layers.length === 0) {
              console.warn('No layers found in web map, using sample data')
              resolve(this.getSampleData())
              return
            }

            // Find the mining concessions layer
            const concessionLayer = layers.find((layer: any) => 
              layer.title?.toLowerCase().includes('mining') ||
              layer.title?.toLowerCase().includes('concession') ||
              layer.title?.toLowerCase().includes('permit') ||
              layer.type === 'feature'
            )

            if (!concessionLayer) {
              console.warn('No mining concession layer found, using first feature layer')
              const firstFeatureLayer = layers.find((layer: any) => layer.type === 'feature')
              if (!firstFeatureLayer) {
                console.warn('No feature layers found, using sample data')
                resolve(this.getSampleData())
                return
              }
              return this.queryLayer(firstFeatureLayer, resolve, () => resolve(this.getSampleData()))
            }

            this.queryLayer(concessionLayer, resolve, () => resolve(this.getSampleData()))
          } catch (error) {
            console.error('Error querying concessions:', error)
            console.log('Falling back to sample data')
            resolve(this.getSampleData())
          }
        })
      })
    } catch (error) {
      console.error('All data fetch methods failed, using sample data:', error)
      return this.getSampleData()
    }
  }

  private async queryFeatureService(serviceUrl: string): Promise<MiningConcession[]> {
    try {
      console.log('Querying feature service:', serviceUrl)
      
      return new Promise((resolve, reject) => {
        window.require(['esri/rest/query', 'esri/rest/support/Query'], (query: any, Query: any) => {
          const queryParams = new Query({
            where: '1=1',
            outFields: ['*'],
            returnGeometry: true,
            outSpatialReference: { wkid: 4326 }
          })

          query.executeQueryJSON(serviceUrl, queryParams).then((result: any) => {
            console.log('Feature service query result:', result)
            
            if (!result.features || result.features.length === 0) {
              console.warn('No features found in feature service')
              resolve([])
              return
            }

            const concessions = this.convertFeaturesToConcessions(result.features)
            resolve(concessions)
          }).catch((error: any) => {
            console.error('Feature service query failed:', error)
            reject(error)
          })
        })
      })
    } catch (error) {
      console.error('Feature service query error:', error)
      return []
    }
  }

  private convertFeaturesToConcessions(features: any[]): MiningConcession[] {
    return features.map((feature: any, index: number) => {
      const attributes = feature.attributes
      const geometry = feature.geometry

      // Extract coordinates (handle different geometry types)
      let coordinates: [number, number][]
      if (geometry && geometry.type === 'polygon') {
        coordinates = geometry.rings[0].map((coord: number[]) => [coord[0], coord[1]] as [number, number])
      } else if (geometry && geometry.type === 'point') {
        // Create a small square around the point
        const offset = 0.001
        coordinates = [
          [geometry.longitude - offset, geometry.latitude - offset] as [number, number],
          [geometry.longitude + offset, geometry.latitude - offset] as [number, number],
          [geometry.longitude + offset, geometry.latitude + offset] as [number, number],
          [geometry.longitude - offset, geometry.latitude + offset] as [number, number]
        ]
      } else {
        // Default fallback coordinates for Ghana
        const baseLng = -1.0 - (index * 0.1)
        const baseLat = 7.0 + (index * 0.1)
        coordinates = [
          [baseLng, baseLat] as [number, number],
          [baseLng + 0.05, baseLat] as [number, number],
          [baseLng + 0.05, baseLat + 0.05] as [number, number],
          [baseLng, baseLat + 0.05] as [number, number]
        ]
      }

      // Debug: Log available fields and attributes
      console.log('=== Processing feature attributes ===')
      console.log('Available fields:', Object.keys(attributes))
      console.log('Raw attributes sample:', attributes)
      console.log('Geometry info:', {
        type: feature.geometry?.type,
        hasRings: feature.geometry?.rings?.length > 0,
        ringsCount: feature.geometry?.rings?.length,
        firstRingPoints: feature.geometry?.rings?.[0]?.length
      })
      console.log('Size field search results:', {
        searchFields: arcgisConfig.fieldMappings.size,
        foundValue: this.getFieldValue(attributes, arcgisConfig.fieldMappings.size),
        parsedValue: parseFloat(this.getFieldValue(attributes, arcgisConfig.fieldMappings.size))
      })

      // Calculate area - try field first, then calculate from geometry
      let calculatedSize = parseFloat(this.getFieldValue(attributes, arcgisConfig.fieldMappings.size))
      
      if (!calculatedSize || isNaN(calculatedSize)) {
        console.log('No area field found, calculating from geometry...')
        try {
          // Create a temporary concession object to calculate geometry-based area
          const tempConcession: Partial<MiningConcession> = {
            coordinates: coordinates
          }
          const boundaryGeometry = processConcessionBoundary(tempConcession as MiningConcession)
          calculatedSize = boundaryGeometry.area
          console.log(`Calculated area from geometry: ${calculatedSize} acres`)
        } catch (geometryError) {
          console.warn('Failed to calculate area from geometry:', geometryError)
          calculatedSize = Math.round(Math.random() * 300 + 50) // Fallback
        }
      } else {
        console.log(`Found area in field: ${calculatedSize}`)
      }

      // Map attribute fields to our data structure using config
      const ownerValue = this.getFieldValue(attributes, arcgisConfig.fieldMappings.owner) || 'Unknown Owner'
      
      // Enhanced debugging for owner field
      console.log(`Feature ${index + 1} owner mapping:`, {
        rawAttributes: Object.keys(attributes),
        ownerFields: arcgisConfig.fieldMappings.owner,
        foundOwnerValue: ownerValue,
        sampleAttributes: Object.fromEntries(
          Object.entries(attributes).slice(0, 5)
        )
      })

      const concession: MiningConcession = {
        id: this.getFieldValue(attributes, arcgisConfig.fieldMappings.id) || `MC${String(index + 1).padStart(3, '0')}`,
        name: this.getFieldValue(attributes, arcgisConfig.fieldMappings.name) || `Mining Concession ${index + 1}`,
        size: calculatedSize,
        owner: ownerValue,
        permitType: this.normalizePermitType(this.getFieldValue(attributes, arcgisConfig.fieldMappings.permitType) || 'large-scale'),
        permitExpiryDate: this.formatDate(this.getFieldValue(attributes, arcgisConfig.fieldMappings.expiryDate)) || '2025-12-31',
        district: this.getFieldValue(attributes, arcgisConfig.fieldMappings.district) || 'Unknown District',
        region: this.getFieldValue(attributes, arcgisConfig.fieldMappings.region) || 'Unknown Region',
        status: this.normalizeStatus(this.getFieldValue(attributes, arcgisConfig.fieldMappings.status) || 'active'),
        coordinates: coordinates,
        contactInfo: {
          phone: this.getFieldValue(attributes, arcgisConfig.fieldMappings.phone) || '+233-XX-XXX-XXXX',
          email: this.getFieldValue(attributes, arcgisConfig.fieldMappings.email) || 'contact@example.com',
          address: this.getFieldValue(attributes, arcgisConfig.fieldMappings.address) || 'Ghana'
        }
      }

      return concession
    })
  }

  private queryLayer(layer: any, resolve: Function, _reject: Function) {
    window.require(['esri/rest/support/Query'], (Query: any) => {
      const queryParams = new Query({
        where: '1=1', // Get all features
        outFields: ['*'], // Get all attributes
        returnGeometry: true,
        outSpatialReference: { wkid: 4326 }
      })

      layer.queryFeatures(queryParams).then((result: any) => {
        console.log('Query result:', result)
        
        if (!result.features || result.features.length === 0) {
          console.warn('No features found in layer, using sample data')
          resolve(this.getSampleData())
          return
        }

        const concessions = this.convertFeaturesToConcessions(result.features)
        console.log(`Converted ${concessions.length} features to concessions`)
        resolve(concessions)
      }).catch((error: any) => {
        console.error('Query failed:', error)
        console.log('Using sample data due to query failure')
        resolve(this.getSampleData())
      })
    })
  }

  private getFieldValue(attributes: any, fieldNames: string[]): string {
    for (const fieldName of fieldNames) {
      if (attributes[fieldName] !== undefined && attributes[fieldName] !== null) {
        return attributes[fieldName].toString()
      }
    }
    return ''
  }

  private getSampleData(): MiningConcession[] {
    console.log('Using sample mining concession data')
    return [
      {
        id: 'MC001',
        name: 'Ashanti Gold Fields',
        size: 450.5,
        owner: 'AngloGold Ashanti',
        permitType: 'large-scale',
        permitExpiryDate: '2025-12-15',
        district: 'Obuasi',
        region: 'Ashanti',
        status: 'active',
        coordinates: [[-1.6247, 6.2085], [-1.6147, 6.2085], [-1.6147, 6.2185], [-1.6247, 6.2185]] as [number, number][],
        contactInfo: {
          phone: '+233-32-220-4567',
          email: 'operations@anglogold.com',
          address: 'P.O. Box 10, Obuasi'
        }
      },
      {
        id: 'MC002',
        name: 'Tarkwa Gold Mine',
        size: 320.3,
        owner: 'Gold Fields Ghana',
        permitType: 'large-scale',
        permitExpiryDate: '2026-06-30',
        district: 'Tarkwa',
        region: 'Western',
        status: 'active',
        coordinates: [[-1.9973, 5.2967], [-1.9873, 5.2967], [-1.9873, 5.3067], [-1.9973, 5.3067]] as [number, number][]
      },
      {
        id: 'MC003',
        name: 'Damang Gold Mine',
        size: 180.8,
        owner: 'Perseus Mining',
        permitType: 'large-scale',
        permitExpiryDate: '2024-08-20',
        district: 'Prestea-Huni Valley',
        region: 'Western',
        status: 'expired',
        coordinates: [[-2.0395, 5.1034], [-2.0295, 5.1034], [-2.0295, 5.1134], [-2.0395, 5.1134]] as [number, number][]
      },
      {
        id: 'MC004',
        name: 'Akyem Gold Mine',
        size: 275.0,
        owner: 'Newmont Ghana',
        permitType: 'large-scale',
        permitExpiryDate: '2025-11-15',
        district: 'Birim North',
        region: 'Eastern',
        status: 'active',
        coordinates: [[-0.7932, 6.0521], [-0.7832, 6.0521], [-0.7832, 6.0621], [-0.7932, 6.0621]] as [number, number][]
      },
      {
        id: 'MC005',
        name: 'Chirano Gold Mine',
        size: 195.2,
        owner: 'Kinross Gold Corporation',
        permitType: 'large-scale',
        permitExpiryDate: '2025-03-30',
        district: 'Bibiani/Anhwiaso/Bekwai',
        region: 'Western',
        status: 'pending',
        coordinates: [[-2.7654, 6.6789], [-2.7554, 6.6789], [-2.7554, 6.6889], [-2.7654, 6.6889]] as [number, number][]
      }
    ]
  }

  private normalizePermitType(type: string): 'small-scale' | 'large-scale' {
    const typeStr = type?.toLowerCase() || ''
    if (typeStr.includes('small') || typeStr.includes('artisan')) {
      return 'small-scale'
    }
    return 'large-scale' // default
  }

  private normalizeStatus(status: string): string {
    const statusStr = status?.toLowerCase() || ''
    if (statusStr.includes('active') || statusStr.includes('valid')) {
      return 'Active'
    } else if (statusStr.includes('expired') || statusStr.includes('inactive')) {
      return 'Expired'
    } else if (statusStr.includes('suspended')) {
      return 'Suspended'
    } else if (statusStr.includes('pending') || statusStr.includes('review')) {
      return 'Under Review'
    }
    return 'Active' // default
  }

  private formatDate(dateValue: any): string {
    if (!dateValue) return '2025-12-31'
    
    // Handle different date formats
    if (typeof dateValue === 'number') {
      // Unix timestamp
      return new Date(dateValue).toISOString().split('T')[0]
    } else if (typeof dateValue === 'string') {
      // Try to parse the string
      const parsed = new Date(dateValue)
      if (!isNaN(parsed.getTime())) {
        return parsed.toISOString().split('T')[0]
      }
    }
    
    return '2025-12-31' // fallback
  }
}

export function calculateStatsFromConcessions(concessions: MiningConcession[]): DashboardStats {
  const totalConcessions = concessions.length
  const activeConcessions = concessions.filter(c => c.status === 'Active').length
  const totalArea = concessions.reduce((sum, c) => sum + c.size, 0)
  
  // Calculate expiring soon (within 6 months)
  const sixMonthsFromNow = new Date()
  sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6)
  const expiringSoon = concessions.filter(c => {
    const expiryDate = new Date(c.permitExpiryDate)
    return expiryDate <= sixMonthsFromNow && c.status === 'Active'
  }).length

  // Calculate by region
  const regionStats = concessions.reduce((acc, c) => {
    acc[c.region] = (acc[c.region] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Calculate by permit type - exclude null/invalid values
  const typeStats = concessions.reduce((acc, c) => {
    if (c.permitType && c.permitType !== 'Not Specified' && c.permitType !== 'null' && c.permitType !== '') {
      acc[c.permitType] = (acc[c.permitType] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)

  return {
    totalConcessions,
    activePermits: activeConcessions,
    expiredPermits: concessions.filter(c => c.status === 'Expired').length,
    soonToExpire: expiringSoon,
    totalAreaCovered: Math.round(totalArea * 10) / 10,
    concessionsByRegion: regionStats,
    concessionsByType: typeStats
  }
}

// Create a singleton instance
export const arcgisService = new ArcGISService()
