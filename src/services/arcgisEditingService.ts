import { MiningConcession } from '../types'
import { arcgisConfig } from '../config/arcgisConfig'

export class ArcGISEditingService {
  private featureLayer: any = null
  private isInitialized = false

  async initialize(): Promise<void> {
    if (this.isInitialized || !window.require) {
      return
    }

    return new Promise((resolve, reject) => {
      window.require([
        'esri/layers/FeatureLayer',
        'esri/Graphic'
      ], async (FeatureLayer: any, Graphic: any) => {
        try {
          const featureServiceUrl = arcgisConfig.featureServiceUrls?.miningConcessions
          if (!featureServiceUrl) {
            throw new Error('Feature service URL not configured')
          }

          console.log('🔄 Initializing ArcGIS editing service...')
          console.log('Feature Service URL:', featureServiceUrl)

          this.featureLayer = new FeatureLayer({
            url: featureServiceUrl,
            outFields: ['*']
          })

          await this.featureLayer.load()
          
          // Check if the layer supports editing
          const capabilities = this.featureLayer.capabilities
          console.log('📝 Layer capabilities:', {
            supportsAdd: capabilities?.editing?.supportsAdd || false,
            supportsUpdate: capabilities?.editing?.supportsUpdate || false,
            supportsDelete: capabilities?.editing?.supportsDelete || false,
            supportsEditing: capabilities?.editing || false
          })

          this.isInitialized = true
          console.log('✅ ArcGIS editing service initialized successfully')
          resolve()
        } catch (error) {
          console.error('❌ Failed to initialize ArcGIS editing service:', error)
          reject(error)
        }
      })
    })
  }

  // Check if editing is supported
  async canEdit(): Promise<boolean> {
    if (!this.isInitialized) {
      await this.initialize()
    }
    
    const capabilities = this.featureLayer?.capabilities?.editing
    return !!(capabilities?.supportsAdd && capabilities?.supportsUpdate && capabilities?.supportsDelete)
  }

  // Create a new concession in the hosted layer
  async createConcession(concession: MiningConcession): Promise<{ success: boolean; error?: string; objectId?: number }> {
    try {
      if (!this.isInitialized) {
        await this.initialize()
      }

      if (!await this.canEdit()) {
        return { success: false, error: 'Layer does not support editing. This may be a read-only layer.' }
      }

      return new Promise((resolve) => {
        window.require(['esri/Graphic', 'esri/geometry/Polygon'], (Graphic: any, Polygon: any) => {
          try {
            // Convert coordinates to ArcGIS geometry
            const geometry = new Polygon({
              rings: [concession.coordinates],
              spatialReference: { wkid: 4326 }
            })

            // Map concession data to feature attributes
            const attributes = this.mapConcessionToAttributes(concession)

            const graphic = new Graphic({
              geometry: geometry,
              attributes: attributes
            })

            // Add the feature to the layer
            this.featureLayer.applyEdits({
              addFeatures: [graphic]
            }).then((result: any) => {
              if (result.addFeatureResults && result.addFeatureResults.length > 0) {
                const addResult = result.addFeatureResults[0]
                if (addResult.success) {
                  console.log('✅ Successfully created concession in hosted layer:', addResult.objectId)
                  resolve({ success: true, objectId: addResult.objectId })
                } else {
                  console.error('❌ Failed to create concession:', addResult.error)
                  resolve({ success: false, error: addResult.error?.message || 'Unknown error' })
                }
              } else {
                resolve({ success: false, error: 'No result returned from server' })
              }
            }).catch((error: any) => {
              console.error('❌ Error creating concession:', error)
              resolve({ success: false, error: error.message })
            })
          } catch (error: any) {
            resolve({ success: false, error: error.message })
          }
        })
      })
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  // Update an existing concession in the hosted layer
  async updateConcession(concession: MiningConcession): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.isInitialized) {
        await this.initialize()
      }

      if (!await this.canEdit()) {
        return { success: false, error: 'Layer does not support editing. This may be a read-only layer.' }
      }

      return new Promise((resolve) => {
        window.require(['esri/Graphic', 'esri/geometry/Polygon'], (Graphic: any, Polygon: any) => {
          try {
            // Convert coordinates to ArcGIS geometry
            const geometry = new Polygon({
              rings: [concession.coordinates],
              spatialReference: { wkid: 4326 }
            })

            // Map concession data to feature attributes
            const attributes = this.mapConcessionToAttributes(concession)
            // Include the ObjectID for updates
            attributes.OBJECTID = concession.id

            const graphic = new Graphic({
              geometry: geometry,
              attributes: attributes
            })

            // Update the feature in the layer
            this.featureLayer.applyEdits({
              updateFeatures: [graphic]
            }).then((result: any) => {
              if (result.updateFeatureResults && result.updateFeatureResults.length > 0) {
                const updateResult = result.updateFeatureResults[0]
                if (updateResult.success) {
                  console.log('✅ Successfully updated concession in hosted layer:', updateResult.objectId)
                  resolve({ success: true })
                } else {
                  console.error('❌ Failed to update concession:', updateResult.error)
                  resolve({ success: false, error: updateResult.error?.message || 'Unknown error' })
                }
              } else {
                resolve({ success: false, error: 'No result returned from server' })
              }
            }).catch((error: any) => {
              console.error('❌ Error updating concession:', error)
              resolve({ success: false, error: error.message })
            })
          } catch (error: any) {
            resolve({ success: false, error: error.message })
          }
        })
      })
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  // Delete a concession from the hosted layer
  async deleteConcession(concessionId: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.isInitialized) {
        await this.initialize()
      }

      if (!await this.canEdit()) {
        return { success: false, error: 'Layer does not support editing. This may be a read-only layer.' }
      }

      // Delete the feature from the layer
      const result = await this.featureLayer.applyEdits({
        deleteFeatures: [{ objectId: parseInt(concessionId) }]
      })

      if (result.deleteFeatureResults && result.deleteFeatureResults.length > 0) {
        const deleteResult = result.deleteFeatureResults[0]
        if (deleteResult.success) {
          console.log('✅ Successfully deleted concession from hosted layer:', deleteResult.objectId)
          return { success: true }
        } else {
          console.error('❌ Failed to delete concession:', deleteResult.error)
          return { success: false, error: deleteResult.error?.message || 'Unknown error' }
        }
      } else {
        return { success: false, error: 'No result returned from server' }
      }
    } catch (error: any) {
      console.error('❌ Error deleting concession:', error)
      return { success: false, error: error.message }
    }
  }

  // Map concession object to feature attributes
  private mapConcessionToAttributes(concession: MiningConcession): any {
    const attributes: any = {}

    // Use field mappings to set the correct field names
    const mappings = arcgisConfig.fieldMappings

    // Try to find the correct field name for each property
    this.setFieldValue(attributes, mappings.name, concession.name)
    this.setFieldValue(attributes, mappings.owner, concession.owner)
    this.setFieldValue(attributes, mappings.size, concession.size)
    this.setFieldValue(attributes, mappings.permitType, concession.permitType)
    this.setFieldValue(attributes, mappings.expiryDate, concession.permitExpiryDate)
    this.setFieldValue(attributes, mappings.district, concession.district)
    this.setFieldValue(attributes, mappings.region, concession.region)
    this.setFieldValue(attributes, mappings.status, concession.status)
    
    // Contact info
    if (concession.contactInfo) {
      this.setFieldValue(attributes, mappings.phone, concession.contactInfo.phone)
      this.setFieldValue(attributes, mappings.email, concession.contactInfo.email)
      this.setFieldValue(attributes, mappings.address, concession.contactInfo.address)
    }

    return attributes
  }

  // Helper to set field value using field mappings
  private setFieldValue(attributes: any, fieldMappings: string[], value: any): void {
    if (!value) return

    // Use the first field mapping as the primary field name
    if (fieldMappings && fieldMappings.length > 0) {
      attributes[fieldMappings[0]] = value
    }
  }

  // Get layer information
  async getLayerInfo(): Promise<any> {
    if (!this.isInitialized) {
      await this.initialize()
    }

    return {
      url: this.featureLayer?.url,
      title: this.featureLayer?.title,
      capabilities: this.featureLayer?.capabilities,
      fields: this.featureLayer?.fields?.map((field: any) => ({
        name: field.name,
        type: field.type,
        alias: field.alias
      }))
    }
  }
}

// Export singleton instance
export const arcgisEditingService = new ArcGISEditingService()
