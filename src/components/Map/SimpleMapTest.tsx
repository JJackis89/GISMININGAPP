import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    require: any
  }
}

export default function SimpleMapTest() {
  const mapDiv = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState('Initializing...')

  useEffect(() => {
    console.log('🚀 SimpleMapTest starting...')
    console.log('🔍 Window object available:', typeof window)
    console.log('🔍 ArcGIS require available:', typeof window.require)
    setStatus('Checking ArcGIS API...')

    // Check if ArcGIS is loaded immediately
    if (typeof window.require === 'undefined') {
      console.log('⏳ ArcGIS not loaded yet, waiting...')
      setStatus('Waiting for ArcGIS API...')
      
      // Poll for ArcGIS API
      const checkArcGIS = () => {
        if (typeof window.require !== 'undefined') {
          console.log('✅ ArcGIS API now available!')
          loadMap()
        } else {
          console.log('⏳ Still waiting for ArcGIS...')
          setTimeout(checkArcGIS, 500)
        }
      }
      setTimeout(checkArcGIS, 500)
    } else {
      console.log('✅ ArcGIS API already available!')
      setTimeout(loadMap, 100)
    }

    function loadMap() {
      if (!mapDiv.current) {
        console.error('❌ Map container not found')
        setStatus('Error: Map container not found')
        return
      }

      console.log('✅ Map container found:', mapDiv.current)
      console.log('✅ Container dimensions:', {
        width: mapDiv.current.offsetWidth,
        height: mapDiv.current.offsetHeight,
        display: window.getComputedStyle(mapDiv.current).display
      })

      setStatus('Loading map modules...')

      window.require(['esri/Map', 'esri/views/MapView'], (Map: any, MapView: any) => {
        try {
          console.log('✅ Map modules loaded successfully!')
          setStatus('Creating map...')

          const map = new Map({
            basemap: 'streets-vector'
          })

          console.log('✅ Map object created, creating MapView...')

          const view = new MapView({
            container: mapDiv.current,
            map: map,
            center: [-1.0232, 7.9465], // Ghana
            zoom: 6
          })

          console.log('✅ MapView created, waiting for load...')
          setStatus('Loading map view...')

          view.when(() => {
            console.log('🎉 Map loaded successfully!')
            setStatus('✅ Map loaded successfully!')
          }).catch((error: any) => {
            console.error('❌ Map view failed to load:', error)
            setStatus(`❌ Map view error: ${error.message}`)
          })

        } catch (error: any) {
          console.error('❌ Error during map creation:', error)
          setStatus(`❌ Map creation error: ${error.message}`)
        }
      }, (error: any) => {
        console.error('❌ Failed to load ArcGIS modules:', error)
        setStatus(`❌ Module loading error: ${error.message}`)
      })
    }
  }, [])

  return (
    <div className="w-full h-full relative bg-gray-100">
      <div 
        ref={mapDiv} 
        className="w-full h-full bg-blue-200"
        style={{ minHeight: '400px' }}
      />
      <div className="absolute top-4 left-4 bg-white p-3 rounded shadow-lg z-50 max-w-md">
        <div className="font-semibold text-sm">Map Status:</div>
        <div className="text-xs mt-1">{status}</div>
        <div className="text-xs text-gray-500 mt-2">
          Check browser console for detailed logs
        </div>
      </div>
    </div>
  )
}
