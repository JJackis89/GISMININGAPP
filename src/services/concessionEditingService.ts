import { MiningConcession } from '../types'
import { arcgisEditingService } from './arcgisEditingService'

export interface EditingAction {
  id: string
  type: 'create' | 'update' | 'delete'
  concessionId: string
  timestamp: string
  userId: string
  changes: Partial<MiningConcession>
  previousData?: Partial<MiningConcession>
  syncedToHosted?: boolean
}

export interface ConcessionFormData {
  name: string
  owner: string
  size: number
  permitType: 'small-scale' | 'large-scale'
  permitExpiryDate: string
  district: string
  region: string
  status: string
  coordinates: [number, number][]
  contactInfo?: {
    phone?: string
    email?: string
    address?: string
  }
}

class ConcessionEditingService {
  private concessions: Map<string, MiningConcession> = new Map()
  private editingHistory: EditingAction[] = []
  private listeners: ((concessions: MiningConcession[]) => void)[] = []

  constructor() {
    this.loadFromStorage()
  }

  // Initialize with existing data (merges with local edits)
  initialize(concessions: MiningConcession[]) {
    console.log(`🔄 Initializing editing service with ${concessions.length} hosted concessions...`)
    
    // Get any locally created concessions (ones that don't exist in hosted layer)
    const existingLocalData = Array.from(this.concessions.values())
    const locallyCreatedConcessions: MiningConcession[] = []
    
    // Find concessions that exist only locally (newly created ones not yet in hosted layer)
    existingLocalData.forEach(existing => {
      const existsInHosted = concessions.some(hosted => hosted.id === existing.id)
      if (!existsInHosted) {
        // This is a locally created concession
        locallyCreatedConcessions.push(existing)
        console.log(`📝 Found locally created concession: ${existing.name} (ID: ${existing.id})`)
      }
    })
    
    // Clear and rebuild with hosted layer data
    this.concessions.clear()
    
    // Add all hosted layer concessions
    concessions.forEach(concession => {
      this.concessions.set(concession.id, { ...concession })
    })
    
    // Add back any locally created concessions
    locallyCreatedConcessions.forEach(localConcession => {
      this.concessions.set(localConcession.id, localConcession)
    })
    
    this.saveToStorage()
    this.notifyListeners()
    
    // Temporarily disable duplicate removal for debugging
    console.log(`✅ Editing service initialized (duplicate removal disabled for debugging):`)
    console.log(`   - ${concessions.length} concessions from hosted layer`)
    console.log(`   - ${locallyCreatedConcessions.length} locally created concessions`)
    console.log(`   - ${this.concessions.size} total concessions available for editing`)
    
    // TODO: Re-enable after debugging
    // const duplicatesRemoved = this.removeDuplicates()
    // if (duplicatesRemoved > 0) {
    //   console.log(`🔧 Cleaned up ${duplicatesRemoved} duplicate entries during initialization`)
    // }
  }

  // Get all concessions
  getAllConcessions(): MiningConcession[] {
    return Array.from(this.concessions.values())
  }

  // Get concession by ID
  getConcession(id: string): MiningConcession | undefined {
    return this.concessions.get(id)
  }

  // Create new concession
  async createConcession(formData: ConcessionFormData, userId: string): Promise<{ success: boolean; error?: string; concession?: MiningConcession }> {
    try {
      // Generate new ID
      const newId = `MC${String(this.concessions.size + 1).padStart(3, '0')}`
      
      // Validate required fields
      if (!formData.name || !formData.owner || !formData.size) {
        return { success: false, error: 'Name, owner, and size are required fields' }
      }

      // Create new concession
      const newConcession: MiningConcession = {
        id: newId,
        name: formData.name.trim(),
        owner: formData.owner.trim(),
        size: Number(formData.size),
        permitType: formData.permitType,
        permitExpiryDate: formData.permitExpiryDate,
        district: formData.district.trim(),
        region: formData.region,
        status: formData.status,
        coordinates: formData.coordinates.length > 0 ? formData.coordinates : this.generateDefaultCoordinates(formData.region),
        contactInfo: formData.contactInfo
      }

      // Try to sync with hosted layer first
      console.log('🔄 Attempting to create concession in hosted layer...')
      const hostedLayerResult = await arcgisEditingService.createConcession(newConcession)
      
      if (hostedLayerResult.success) {
        console.log('✅ Successfully created concession in hosted layer')
        // Update the ID with the actual ObjectID from the hosted layer
        if (hostedLayerResult.objectId) {
          newConcession.id = hostedLayerResult.objectId.toString()
        }
      } else {
        console.warn('⚠️ Failed to sync with hosted layer:', hostedLayerResult.error)
        console.log('📝 Saving locally only - will sync later when layer becomes available')
      }

      // Always add to local storage (as backup and for offline use)
      this.concessions.set(newConcession.id, newConcession)

      // Record action
      this.recordAction({
        id: `action-${Date.now()}`,
        type: 'create',
        concessionId: newConcession.id,
        timestamp: new Date().toISOString(),
        userId,
        changes: newConcession,
        syncedToHosted: hostedLayerResult.success
      } as any)

      this.saveToStorage()
      this.notifyListeners()

      return { success: true, concession: newConcession }
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to create concession' }
    }
  }

  // Update existing concession
  async updateConcession(id: string, formData: ConcessionFormData, userId: string): Promise<{ success: boolean; error?: string; concession?: MiningConcession }> {
    try {
      const existingConcession = this.concessions.get(id)
      if (!existingConcession) {
        return { success: false, error: 'Concession not found' }
      }

      // Validate required fields
      if (!formData.name || !formData.owner || !formData.size) {
        return { success: false, error: 'Name, owner, and size are required fields' }
      }

      // Store previous data for history
      const previousData = { ...existingConcession }

      // Update concession
      const updatedConcession: MiningConcession = {
        ...existingConcession,
        name: formData.name.trim(),
        owner: formData.owner.trim(),
        size: Number(formData.size),
        permitType: formData.permitType,
        permitExpiryDate: formData.permitExpiryDate,
        district: formData.district.trim(),
        region: formData.region,
        status: formData.status,
        coordinates: formData.coordinates.length > 0 ? formData.coordinates : existingConcession.coordinates,
        contactInfo: formData.contactInfo
      }

      // Try to sync with hosted layer first
      console.log('🔄 Attempting to update concession in hosted layer...')
      const hostedLayerResult = await arcgisEditingService.updateConcession(updatedConcession)
      
      if (hostedLayerResult.success) {
        console.log('✅ Successfully updated concession in hosted layer')
      } else {
        console.warn('⚠️ Failed to sync update with hosted layer:', hostedLayerResult.error)
        console.log('📝 Saving locally only - will sync later when layer becomes available')
      }

      // Always update local storage
      this.concessions.set(id, updatedConcession)

      // Record action
      this.recordAction({
        id: `action-${Date.now()}`,
        type: 'update',
        concessionId: id,
        timestamp: new Date().toISOString(),
        userId,
        changes: formData,
        previousData,
        syncedToHosted: hostedLayerResult.success
      } as any)

      this.saveToStorage()
      this.notifyListeners()

      return { success: true, concession: updatedConcession }
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to update concession' }
    }
  }

  // Delete concession
  async deleteConcession(id: string, userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const concession = this.concessions.get(id)
      if (!concession) {
        return { success: false, error: 'Concession not found' }
      }

      // Try to delete from hosted layer first
      console.log('🔄 Attempting to delete concession from hosted layer...')
      const hostedLayerResult = await arcgisEditingService.deleteConcession(id)
      
      if (hostedLayerResult.success) {
        console.log('✅ Successfully deleted concession from hosted layer')
      } else {
        console.warn('⚠️ Failed to delete from hosted layer:', hostedLayerResult.error)
        console.log('📝 Marking as deleted locally - will sync later when layer becomes available')
      }

      // Record action before deletion
      this.recordAction({
        id: `action-${Date.now()}`,
        type: 'delete',
        concessionId: id,
        timestamp: new Date().toISOString(),
        userId,
        changes: {},
        previousData: concession,
        syncedToHosted: hostedLayerResult.success
      } as any)

      // Delete from local storage
      this.concessions.delete(id)

      this.saveToStorage()
      this.notifyListeners()

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to delete concession' }
    }
  }

  // Get editing history
  getEditingHistory(): EditingAction[] {
    return [...this.editingHistory].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
  }

  // Subscribe to changes
  subscribe(callback: (concessions: MiningConcession[]) => void) {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback)
    }
  }

  // Private methods
  private recordAction(action: EditingAction) {
    this.editingHistory.push(action)
    // Keep only last 100 actions
    if (this.editingHistory.length > 100) {
      this.editingHistory = this.editingHistory.slice(-100)
    }
  }

  private notifyListeners() {
    const concessions = this.getAllConcessions()
    this.listeners.forEach(listener => listener(concessions))
  }

  private saveToStorage() {
    try {
      const data = {
        concessions: Array.from(this.concessions.entries()),
        history: this.editingHistory
      }
      localStorage.setItem('epa_mining_concessions_data', JSON.stringify(data))
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
    }
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem('epa_mining_concessions_data')
      if (stored) {
        const data = JSON.parse(stored)
        if (data.concessions) {
          this.concessions = new Map(data.concessions)
        }
        if (data.history) {
          this.editingHistory = data.history
        }
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error)
    }
  }

  private generateDefaultCoordinates(region: string): [number, number][] {
    // Generate basic square coordinates based on region
    const regionCoords: Record<string, [number, number]> = {
      'Western': [-2.0, 5.0],
      'Central': [-1.0, 5.5],
      'Greater Accra': [0.0, 5.6],
      'Eastern': [-0.5, 6.0],
      'Volta': [0.5, 6.5],
      'Ashanti': [-1.5, 6.5],
      'Brong Ahafo': [-2.5, 7.5],
      'Northern': [-1.0, 9.0],
      'Upper East': [-0.5, 10.5],
      'Upper West': [-2.5, 10.0]
    }

    const baseCoord = regionCoords[region] || [-1.0, 6.0]
    const offset = 0.01

    return [
      [baseCoord[0] - offset, baseCoord[1] - offset],
      [baseCoord[0] + offset, baseCoord[1] - offset],
      [baseCoord[0] + offset, baseCoord[1] + offset],
      [baseCoord[0] - offset, baseCoord[1] + offset],
      [baseCoord[0] - offset, baseCoord[1] - offset]
    ]
  }

  // Clear all data (admin only)
  clearAllData() {
    this.concessions.clear()
    this.editingHistory = []
    this.saveToStorage()
    this.notifyListeners()
  }

  // Clear cache and force reload
  clearCache() {
    console.log('🗑️ Clearing editing service cache...')
    this.concessions.clear()
    this.notifyListeners()
  }

  // Detect and fix duplicate concessions (conservative approach)
  removeDuplicates() {
    const seenIds = new Map<string, MiningConcession>()
    const duplicates: string[] = []
    
    this.concessions.forEach((concession, id) => {
      // Only remove if we have EXACT same ID (which shouldn't happen in Map)
      // or if name + coordinates are identical
      const exactMatch = Array.from(seenIds.values()).find(existing => 
        existing.name === concession.name && 
        existing.owner === concession.owner &&
        JSON.stringify(existing.coordinates) === JSON.stringify(concession.coordinates)
      )
      
      if (exactMatch) {
        duplicates.push(id)
        console.log(`🔍 Found exact duplicate: ${concession.name} (ID: ${id})`)
      } else {
        seenIds.set(id, concession)
      }
    })
    
    // Remove only exact duplicates
    duplicates.forEach(id => {
      const concession = this.concessions.get(id)
      console.log(`🗑️ Removing exact duplicate: ${concession?.name} (ID: ${id})`)
      this.concessions.delete(id)
    })
    
    if (duplicates.length > 0) {
      console.log(`🔧 Removed ${duplicates.length} exact duplicate concessions`)
      this.saveToStorage()
      this.notifyListeners()
    }
    
    return duplicates.length
  }

  // Export data
  exportData(): { concessions: MiningConcession[]; history: EditingAction[] } {
    return {
      concessions: this.getAllConcessions(),
      history: this.getEditingHistory()
    }
  }

  // Import data (admin only)
  importData(data: { concessions: MiningConcession[]; history?: EditingAction[] }) {
    this.concessions.clear()
    data.concessions.forEach(concession => {
      this.concessions.set(concession.id, concession)
    })
    
    if (data.history) {
      this.editingHistory = data.history
    }

    this.saveToStorage()
    this.notifyListeners()
  }

  // Check if hosted layer supports editing
  async canEditHostedLayer(): Promise<boolean> {
    try {
      return await arcgisEditingService.canEdit()
    } catch (error) {
      console.warn('Unable to check hosted layer editing capabilities:', error)
      return false
    }
  }

  // Get hosted layer info
  async getHostedLayerInfo(): Promise<any> {
    try {
      return await arcgisEditingService.getLayerInfo()
    } catch (error) {
      console.warn('Unable to get hosted layer info:', error)
      return null
    }
  }

  // Sync pending changes to hosted layer (for offline mode recovery)
  async syncPendingChanges(): Promise<{ success: boolean; synced: number; failed: number }> {
    console.log('🔄 Attempting to sync pending changes to hosted layer...')
    
    let synced = 0
    let failed = 0

    // Get unsynced actions from history
    const unsyncedActions = this.editingHistory.filter((action: any) => !action.syncedToHosted)
    
    for (const action of unsyncedActions) {
      try {
        const concession = this.concessions.get(action.concessionId)
        if (!concession) continue

        let result
        switch (action.type) {
          case 'create':
            result = await arcgisEditingService.createConcession(concession)
            break
          case 'update':
            result = await arcgisEditingService.updateConcession(concession)
            break
          case 'delete':
            result = await arcgisEditingService.deleteConcession(action.concessionId)
            break
          default:
            continue
        }

        if (result.success) {
          // Mark as synced
          action.syncedToHosted = true
          synced++
        } else {
          failed++
        }
      } catch (error) {
        failed++
      }
    }

    if (synced > 0) {
      this.saveToStorage()
    }

    console.log(`✅ Sync complete: ${synced} synced, ${failed} failed`)
    return { success: failed === 0, synced, failed }
  }

  // Debug method to analyze current state
  debugCurrentState(): void {
    console.log('\n=== EDITING SERVICE DEBUG ===')
    console.log(`📊 Total concessions in memory: ${this.concessions.size}`)
    console.log(`📝 Editing history entries: ${this.editingHistory.length}`)
    
    // Group concessions by ID prefix to detect patterns
    const idPatterns: Record<string, number> = {}
    const sampleIds: string[] = []
    
    this.concessions.forEach((concession, id) => {
      const prefix = id.substring(0, 3)
      idPatterns[prefix] = (idPatterns[prefix] || 0) + 1
      if (sampleIds.length < 10) {
        sampleIds.push(`${id}: ${concession.name}`)
      }
    })
    
    console.log('🔍 ID Patterns:', idPatterns)
    console.log('📝 Sample entries:', sampleIds)
    
    // Check localStorage size
    try {
      const stored = localStorage.getItem('epa_mining_concessions_data')
      if (stored) {
        const data = JSON.parse(stored)
        console.log(`💾 LocalStorage: ${data.concessions?.length || 0} concessions, ${data.history?.length || 0} history entries`)
      }
    } catch (error) {
      console.log('💾 LocalStorage: Error reading data')
    }
    
    console.log('=== END DEBUG ===\n')
  }
}

// Export singleton instance
export const concessionEditingService = new ConcessionEditingService()
