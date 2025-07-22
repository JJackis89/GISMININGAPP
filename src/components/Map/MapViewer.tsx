import { useEffect, useRef, useState } from 'react'
import { miningDataService } from '../../services/miningDataService'

interface MapViewerProps {
  className?: string
  onDataLoaded?: (dataService: typeof miningDataService) => void
}

declare global {
  interface Window {
    require: any
  }
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

    const initializeMap = () => {
      if (!mapDiv.current) {
        console.error('❌ Map container div not found, retrying in 100ms...')
        setTimeout(initializeMap, 100)
        return
      }

      // Check if ArcGIS API is available
      if (typeof window === 'undefined') {
        console.error('❌ Window object not available')
        setErrorMessage('Application not running in browser environment')
        setMapStatus('error')
        return
      }

      // Wait for ArcGIS API to be fully loaded
      const waitForArcGIS = () => {
        if (!window.require) {
          console.log('⏳ Waiting for ArcGIS API to load...')
          setTimeout(waitForArcGIS, 100)
          return
        }

        console.log('🚀 ArcGIS API detected, initializing map...')

        window.require([
          'esri/views/MapView',
          'esri/Map',
          'esri/WebMap',
          'esri/widgets/BasemapToggle',
          'esri/widgets/Fullscreen',
          'esri/widgets/ScaleBar'
        ], (MapView: any, Map: any, WebMap: any, BasemapToggle: any, Fullscreen: any, ScaleBar: any) => {
          try {
            console.log('📦 ArcGIS modules loaded successfully')
            
            // First try a simple map
            console.log('🗺️ Creating basic map for Ghana...')
            const basicMap = new Map({
              basemap: 'streets-navigation-vector'
            })

            mapView.current = new MapView({
              container: mapDiv.current,
              map: basicMap,
              center: [-1.0232, 7.9465], // Ghana center
              zoom: 6,
              constraints: {
                minZoom: 5,
                maxZoom: 18
              }
            })

            // Add map controls
            const basemapToggle = new BasemapToggle({
              view: mapView.current,
              nextBasemap: 'satellite'
            })

            const fullscreen = new Fullscreen({
              view: mapView.current
            })

            const scaleBar = new ScaleBar({
              view: mapView.current,
              unit: 'metric'
            })

            mapView.current.ui.add(basemapToggle, 'bottom-left')
            mapView.current.ui.add(fullscreen, 'top-right')
            mapView.current.ui.add(scaleBar, 'bottom-right')

            // Wait for basic map to load
            mapView.current.when(() => {
              console.log('✅ Basic map loaded successfully!')
              setMapStatus('loaded')
              
              // Now try to load the custom WebMap data as an additional layer
              console.log('🔄 Attempting to load EPA mining data...')
              const webmap = new WebMap({
                portalItem: {
                  id: 'b7d490ce18644f9c8f38989586c4d0d4'
                }
              })

              webmap.when(() => {
                console.log('✅ EPA WebMap loaded, adding layers to map...')
                if (webmap.layers && webmap.layers.length > 0) {
                  webmap.layers.forEach((layer: any) => {
                    console.log(`Adding layer: ${layer.title}`)
                    mapView.current.map.add(layer)
                  })
                }
                
                // Initialize the mining data service
                miningDataService.initialize().then(() => {
                  if (onDataLoaded) {
                    onDataLoaded(miningDataService)
                  }
                  console.log('✅ Mining data service initialized')
                }).catch((error: any) => {
                  console.warn('⚠️ Mining data service initialization failed:', error)
                })
              }).catch((error: any) => {
                console.warn('⚠️ EPA WebMap failed to load, but basic map is working:', error)
                // Basic map still works even if EPA data fails
              })

            }).catch((error: any) => {
              console.error('❌ Basic map loading failed:', error)
              setErrorMessage(`Map loading failed: ${error.message}`)
              setMapStatus('error')
            })

          } catch (error: any) {
            console.error('❌ Error creating map:', error)
            setErrorMessage(`Map creation failed: ${error.message}`)
            setMapStatus('error')
          }
        }, (error: any) => {
          console.error('❌ Failed to load ArcGIS modules:', error)
          setErrorMessage('Failed to load ArcGIS modules')
          setMapStatus('error')
        })
      }

      waitForArcGIS()
    }

    initializeMap()

    return () => {
      if (mapView.current) {
        mapView.current.destroy()
        mapView.current = null
      }
    }
  }, [])

  // Loading state
  if (mapStatus === 'loading') {
    return (
      <div className="w-full h-full relative">
        <div ref={mapDiv} className={`map-container w-full h-full ${className}`} />
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-epa-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Mining Concessions Map...</p>
            <p className="text-sm text-gray-500 mt-2">Loading your real data with 71 concessions</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (mapStatus === 'error') {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="bg-red-100 rounded-full p-3 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Map Loading Error</h3>
          <p className="text-gray-600 mb-4">{errorMessage}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-epa-orange-600 text-white rounded-md hover:bg-epa-orange-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return <div ref={mapDiv} className={`map-container w-full h-full ${className}`} />
}
