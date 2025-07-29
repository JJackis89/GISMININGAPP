import { useEffect, useRef, useState } from 'react'
import { miningDataService } from '../../services/miningDataService'

interface MapViewerProps {
  className?: string
  onDataLoaded?: (dataService: typeof miningDataService) => void
}

export default function MapViewer({ className = '', onDataLoaded }: MapViewerProps) {
  const mapDiv = useRef<HTMLDivElement>(null)
  const mapView = useRef<any>(null)
  const [mapStatus, setMapStatus] = useState<'loading' | 'loaded' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    console.log('🔧 MapViewer useEffect triggered - component is mounting')
    
    // Prevent multiple initializations
    if (mapView.current) {
      console.log('⚠️ Map already exists, skipping initialization')
      return
    }

    const initializeMap = async () => {
      if (!mapDiv.current) {
        console.error('❌ Map container div not found, retrying in 100ms...')
        setTimeout(initializeMap, 100)
        return
      }

      // Check if ArcGIS API is available
      if (!window.require) {
        console.error('❌ ArcGIS API not loaded')
        setErrorMessage('ArcGIS API not available')
        setMapStatus('error')
        return
      }

      try {
        console.log('🚀 ArcGIS API detected, initializing map...')
        
        // Import ArcGIS modules
        const [
          Map,
          MapView,
          FeatureLayer,
          BasemapToggle,
          Fullscreen,
          ScaleBar,
          SimpleRenderer,
          SimpleFillSymbol,
          PopupTemplate
        ] = await new Promise<any[]>((resolve) => {
          window.require([
            'esri/Map',
            'esri/views/MapView',
            'esri/layers/FeatureLayer',
            'esri/widgets/BasemapToggle',
            'esri/widgets/Fullscreen',
            'esri/widgets/ScaleBar',
            'esri/renderers/SimpleRenderer',
            'esri/symbols/SimpleFillSymbol',
            'esri/PopupTemplate'
          ], (...modules: any[]) => {
            resolve(modules)
          })
        })

        console.log('📦 ArcGIS modules loaded successfully')

        // Set up authentication token for your ArcGIS service
        const [esriConfig] = await new Promise<any[]>((resolve) => {
          window.require(['esri/config'], (config: any) => {
            resolve([config])
          })
        })

        // Configure authentication token
        esriConfig.apiKey = 'AAPT3NKHt6i2urmWtqOuugvr9QodHLydNh-f_6pc8z-UVAFMK5wDwEegYLjwInuu6EBSg3cblvSB3MOuH57fVByuH37LVJN6UapuXNvCXSsv1waF1djrH1k3LThOxsG6wJUw7c5MWMdoltJysnHqoXox0rCP83yjDMKMV0eRRaLhk_83-7uulnb_f1ZKb0Dpzt4A1ng9yOxMtduLFvHfzlnH-4lO9IUfnSH_2pQvOnO_yxg.'

        // Create base map
        console.log('🗺️ Creating base map for Ghana...')
        const map = new Map({
          basemap: 'streets-navigation-vector'
        })

        // Create map view with Ghana extent
        const view = new MapView({
          container: mapDiv.current,
          map: map,
          center: [-1.0232, 7.9465], // Ghana center
          zoom: 7,
          popup: {
            dockEnabled: true,
            dockOptions: {
              position: 'bottom-right',
              breakpoint: false
            }
          }
        })

        mapView.current = view

        // Add map controls
        const basemapToggle = new BasemapToggle({
          view: view,
          nextBasemap: 'satellite'
        })
        view.ui.add(basemapToggle, 'bottom-left')

        const fullscreen = new Fullscreen({
          view: view
        })
        view.ui.add(fullscreen, 'top-right')

        const scaleBar = new ScaleBar({
          view: view,
          unit: 'metric'
        })
        view.ui.add(scaleBar, 'bottom-right')

        // Wait for map to be ready
        await view.when()
        console.log('✅ Base map loaded successfully!')

        // Try to load mining concessions from the working service
        try {
          console.log('🔄 Loading mining concessions feature layer...')
          
          // Use your actual feature service URL
          const featureServiceUrl = 'https://services6.arcgis.com/Av3KhOzUMUMSORVt/arcgis/rest/services/Mining_Concessions/FeatureServer/0'
          
          console.log(`📡 Connecting to: ${featureServiceUrl}`)
          
          // Initialize mining data service first (optional - for backup data)
          try {
            await miningDataService.initialize()
            const concessions = await miningDataService.getMiningConcessions()
            console.log(`📊 Mining data service loaded ${concessions.length} concessions`)
          } catch (serviceError) {
            console.warn('⚠️ Mining data service failed, using direct feature service:', serviceError)
          }
          
          // Create popup template
          const popupTemplate = new PopupTemplate({
            title: 'Mining Concession: {CONCESSION_NAME}',
            content: [
              {
                type: 'fields',
                fieldInfos: [
                  { fieldName: 'CONCESSION_NAME', label: 'Concession Name' },
                  { fieldName: 'COMPANY_NAME', label: 'Company' },
                  { fieldName: 'STATUS', label: 'Status' },
                  { fieldName: 'MINERAL_TYPE', label: 'Mineral Type' },
                  { fieldName: 'AREA_HECTARES', label: 'Area (Acres)' },
                  { fieldName: 'DATE_GRANTED', label: 'Date Granted' }
                ]
              }
            ]
          })

          // Create renderer for status-based styling
          const renderer = new SimpleRenderer({
            symbol: new SimpleFillSymbol({
              color: [255, 255, 255, 0.1],
              outline: {
                color: [0, 0, 0, 0.8],
                width: 2
              }
            }),
            visualVariables: [{
              type: 'color',
              field: 'STATUS',
              stops: [
                { value: 'Active', color: [34, 139, 34, 0.7] },      // Green
                { value: 'Pending', color: [255, 165, 0, 0.7] },     // Orange
                { value: 'Expired', color: [220, 20, 60, 0.7] },     // Red
                { value: 'Suspended', color: [128, 0, 128, 0.7] }    // Purple
              ]
            }]
          })

          // Create feature layer
          const miningConcessionsLayer = new FeatureLayer({
            url: featureServiceUrl,
            title: 'EPA Mining Concessions',
            outFields: ['*'],
            popupTemplate: popupTemplate,
            renderer: renderer,
            opacity: 0.8
          })

          // Add layer to map
          map.add(miningConcessionsLayer)
          console.log('📊 Mining concessions layer added to map')

          // Wait for layer to load
          await miningConcessionsLayer.when()
          console.log('✅ Mining concessions layer loaded successfully!')

          // Query feature count
          const featureCount = await miningConcessionsLayer.queryFeatureCount()
          console.log(`📈 Total mining concessions loaded: ${featureCount}`)

          // Zoom to layer extent
          const extent = await miningConcessionsLayer.queryExtent()
          if (extent && extent.extent) {
            view.goTo(extent.extent.expand(1.2))
            console.log('🔍 Zoomed to mining concessions extent')
          }

          // Call the onDataLoaded callback
          if (onDataLoaded) {
            onDataLoaded(miningDataService)
            console.log('✅ Mining data service callback executed')
          }

          setMapStatus('loaded')
          console.log('🎉 Map fully loaded with mining concessions!')

        } catch (layerError) {
          console.error('❌ Failed to load mining concessions layer:', layerError)
          setErrorMessage('Mining concessions data unavailable - showing base map only')
          setMapStatus('loaded') // Still show the base map
        }

      } catch (error) {
        console.error('❌ Failed to initialize map:', error)
        setErrorMessage('Failed to load map. Please check your internet connection.')
        setMapStatus('error')
      }
    }

    // Initialize map
    initializeMap()

    // Cleanup
    return () => {
      if (mapView.current) {
        mapView.current.destroy()
        mapView.current = null
        console.log('🧹 Map view cleaned up')
      }
    }
  }, [onDataLoaded])

  // Render based on status
  if (mapStatus === 'error') {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-gray-100 ${className}`}>
        <div className="text-center p-6">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Map Loading Error</h3>
          <p className="text-gray-600">{errorMessage}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full h-full relative ${className}`}>
      <div ref={mapDiv} className="w-full h-full" />
      {mapStatus === 'loading' && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <p className="mt-4 text-gray-600">Loading Mining Concessions Map...</p>
            <p className="text-sm text-gray-500">Loading your real data with 71 concessions</p>
          </div>
        </div>
      )}
    </div>
  )
}
