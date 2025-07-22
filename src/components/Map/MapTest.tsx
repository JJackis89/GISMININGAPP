import { useEffect, useRef } from 'react'

export default function MapTest() {
  const mapDiv = useRef<HTMLDivElement>(null)

  useEffect(() => {
    console.log('🧪 Map test starting...')
    console.log('Map div ref:', mapDiv.current)
    
    if (mapDiv.current) {
      console.log('✅ Map div found!')
      mapDiv.current.style.backgroundColor = 'green'
      mapDiv.current.innerHTML = '<div style="color: white; padding: 20px; text-align: center;">MAP DIV IS WORKING!</div>'
      
      // Test ArcGIS after 2 seconds
      setTimeout(() => {
        console.log('🧪 Testing ArcGIS availability...')
        
        if (typeof window !== 'undefined' && window.require) {
          console.log('✅ ArcGIS API is available!')
          
          window.require(['esri/views/MapView', 'esri/Map'], (MapView: any, Map: any) => {
            try {
              console.log('📦 Creating ArcGIS map...')
              
              const map = new Map({
                basemap: 'streets-vector'
              })

              const view = new MapView({
                container: mapDiv.current,
                map: map,
                center: [-1, 8], // Ghana
                zoom: 6
              })

              view.when(() => {
                console.log('✅ ArcGIS map loaded successfully!')
              }).catch((error: any) => {
                console.error('❌ ArcGIS map failed:', error)
                mapDiv.current!.innerHTML = `<div style="color: red; padding: 20px;">ArcGIS Error: ${error.message}</div>`
              })

            } catch (error: any) {
              console.error('❌ Error creating ArcGIS map:', error)
              mapDiv.current!.innerHTML = `<div style="color: red; padding: 20px;">ArcGIS Exception: ${error.message}</div>`
            }
          })
        } else {
          console.error('❌ ArcGIS API not available!')
          mapDiv.current!.innerHTML = '<div style="color: red; padding: 20px;">ArcGIS API NOT LOADED</div>'
        }
      }, 2000)
    } else {
      console.error('❌ Map div not found!')
    }
  }, [])

  return (
    <div className="w-full h-full bg-yellow-200 p-4">
      <h2 className="text-lg font-bold mb-2">Map Test</h2>
      <div 
        ref={mapDiv} 
        className="w-full h-64 bg-blue-500 border-2 border-black"
        style={{ minHeight: '300px' }}
      >
        <div className="p-4 text-white">Map should load here...</div>
      </div>
    </div>
  )
}

declare global {
  interface Window {
    require: any
  }
}
