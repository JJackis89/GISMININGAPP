/**
 * Data Source Configuration Service
 * Manages switching between ArcGIS and PostgreSQL data sources
 */

export type DataSourceType = 'arcgis' | 'postgresql'

interface DataSourceConfig {
  type: DataSourceType
  isActive: boolean
  lastSwitched: Date
  connectionVerified: boolean
}

class DataSourceConfigService {
  private readonly STORAGE_KEY = 'epa_mining_data_source_config'
  private currentConfig: DataSourceConfig

  constructor() {
    this.currentConfig = this.loadConfig()
  }

  /**
   * Get current data source configuration
   */
  getCurrentConfig(): DataSourceConfig {
    return { ...this.currentConfig }
  }

  /**
   * Get current data source type
   */
  getCurrentDataSource(): DataSourceType {
    return this.currentConfig.type
  }

  /**
   * Check if PostgreSQL is the active data source
   */
  isPostgreSQLActive(): boolean {
    return this.currentConfig.type === 'postgresql' && this.currentConfig.isActive
  }

  /**
   * Check if ArcGIS is the active data source
   */
  isArcGISActive(): boolean {
    return this.currentConfig.type === 'arcgis' && this.currentConfig.isActive
  }

  /**
   * Switch to PostgreSQL as primary data source
   */
  switchToPostgreSQL(): void {
    console.log('🔄 Switching to PostgreSQL as primary data source...')
    
    this.currentConfig = {
      type: 'postgresql',
      isActive: true,
      lastSwitched: new Date(),
      connectionVerified: false
    }
    
    this.saveConfig()
    console.log('✅ Successfully switched to PostgreSQL data source')
  }

  /**
   * Switch to ArcGIS as primary data source
   */
  switchToArcGIS(): void {
    console.log('🔄 Switching to ArcGIS as primary data source...')
    
    this.currentConfig = {
      type: 'arcgis',
      isActive: true,
      lastSwitched: new Date(),
      connectionVerified: false
    }
    
    this.saveConfig()
    console.log('✅ Successfully switched to ArcGIS data source')
  }

  /**
   * Mark current connection as verified
   */
  markConnectionVerified(): void {
    this.currentConfig.connectionVerified = true
    this.saveConfig()
  }

  /**
   * Mark current connection as unverified
   */
  markConnectionUnverified(): void {
    this.currentConfig.connectionVerified = false
    this.saveConfig()
  }

  /**
   * Get data source status information
   */
  getDataSourceStatus(): {
    current: string
    isVerified: boolean
    lastSwitched: string
    recommendation: string
  } {
    const current = this.currentConfig.type === 'postgresql' ? 'PostgreSQL Database' : 'ArcGIS Online'
    const isVerified = this.currentConfig.connectionVerified
    const lastSwitched = this.currentConfig.lastSwitched.toLocaleString()
    
    let recommendation = ''
    if (this.currentConfig.type === 'arcgis') {
      recommendation = 'ArcGIS Online is active and stable for production use'
    } else if (!isVerified) {
      recommendation = 'PostgreSQL connection needs verification'
    } else {
      recommendation = 'PostgreSQL is active and verified - optimal configuration'
    }

    return {
      current,
      isVerified,
      lastSwitched,
      recommendation
    }
  }

  /**
   * Load configuration from localStorage
   */
  private loadConfig(): DataSourceConfig {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        return {
          ...parsed,
          lastSwitched: new Date(parsed.lastSwitched)
        }
      }
    } catch (error) {
      console.warn('Failed to load data source config:', error)
    }

    // Default to ArcGIS as the stable primary backend
    return {
      type: 'arcgis',
      isActive: true,
      lastSwitched: new Date(),
      connectionVerified: false
    }
  }

  /**
   * Save configuration to localStorage
   */
  private saveConfig(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.currentConfig))
    } catch (error) {
      console.warn('Failed to save data source config:', error)
    }
  }

  /**
   * Reset to default configuration
   */
  reset(): void {
    this.currentConfig = {
      type: 'arcgis',
      isActive: true,
      lastSwitched: new Date(),
      connectionVerified: false
    }
    this.saveConfig()
  }
}

// Export singleton instance
export const dataSourceConfig = new DataSourceConfigService()
export default dataSourceConfig
