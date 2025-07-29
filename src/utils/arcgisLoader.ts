/**
 * Dynamic ArcGIS module loader for production builds
 * This resolves the bundling issues with @arcgis/core in Vite/Vercel
 */

interface ArcGISModules {
  WebMap?: any
  FeatureLayer?: any
  [key: string]: any
}

class ArcGISLoader {
  private modules: ArcGISModules = {}
  private loaded = false
  private loadAttempted = false

  async loadModules(): Promise<ArcGISModules> {
    if (this.loaded) {
      return this.modules
    }

    if (this.loadAttempted) {
      throw new Error('ArcGIS modules failed to load on previous attempt')
    }

    this.loadAttempted = true

    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        throw new Error('ArcGIS modules can only be loaded in browser environment')
      }

      // Try to use AMD loader if available (production CDN approach)
      if (window.require) {
        console.log('Using ArcGIS AMD loader (CDN)')
        return await this.loadWithAMD()
      }

      // Fallback to dynamic imports for development
      console.log('Using dynamic ES6 imports (development)')
      return await this.loadWithDynamicImports()

    } catch (error) {
      console.error('Failed to load ArcGIS modules:', error)
      // Return mock modules for graceful degradation
      return this.getMockModules()
    }
  }

  private async loadWithAMD(): Promise<ArcGISModules> {
    return new Promise((resolve, reject) => {
      window.require([
        'esri/WebMap',
        'esri/layers/FeatureLayer'
      ], (WebMap: any, FeatureLayer: any) => {
        this.modules = { WebMap, FeatureLayer }
        this.loaded = true
        resolve(this.modules)
      }, (error: any) => {
        reject(error)
      })
    })
  }

  private async loadWithDynamicImports(): Promise<ArcGISModules> {
    try {
      const [WebMap, FeatureLayer] = await Promise.all([
        import('@arcgis/core/WebMap').then(m => m.default),
        import('@arcgis/core/layers/FeatureLayer').then(m => m.default)
      ])

      this.modules = { WebMap, FeatureLayer }
      this.loaded = true
      return this.modules
    } catch (error) {
      throw new Error(`Dynamic import failed: ${error}`)
    }
  }

  private getMockModules(): ArcGISModules {
    console.warn('Using mock ArcGIS modules - real functionality will be limited')
    
    const MockLayer = class {
      constructor(props: any) {
        Object.assign(this, props)
      }
      async load() { return this }
      createQuery() {
        return {
          returnGeometry: true,
          outFields: ['*']
        }
      }
      async queryFeatures() {
        return { features: [] }
      }
    }

    const MockWebMap = class {
      public layers: { items: any[] }
      
      constructor(props: any) {
        Object.assign(this, props)
        this.layers = { items: [] }
      }
      async load() { return this }
    }

    this.modules = {
      WebMap: MockWebMap,
      FeatureLayer: MockLayer
    }
    this.loaded = true
    return this.modules
  }

  async getWebMap(): Promise<any> {
    const modules = await this.loadModules()
    return modules.WebMap
  }

  async getFeatureLayer(): Promise<any> {
    const modules = await this.loadModules()
    return modules.FeatureLayer
  }

  isLoaded(): boolean {
    return this.loaded
  }

  reset(): void {
    this.loaded = false
    this.loadAttempted = false
    this.modules = {}
  }
}

export const arcgisLoader = new ArcGISLoader()
export default arcgisLoader
