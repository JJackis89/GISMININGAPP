import React, { useEffect, useRef, useState } from 'react'

interface MapViewerProps {
  className?: string
  selectedConcessions?: any[]
  onZoomToSelected?: boolean
}

const MapViewer: React.FC<MapViewerProps> = ({ className = '' }) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapStatus, setMapStatus] = useState<'loading' | 'loaded' | 'error'>('loading')

  useEffect(() => {
    // Simple timeout to simulate map loading
    const timer = setTimeout(() => {
      console.log('✅ Map simulation loaded')
      setMapStatus('loaded')
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (mapStatus === 'loading') {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-gray-100 ${className}`}>
        <div className="text-center p-6">
          <div className="animate-spin text-blue-500 text-4xl mb-4">🔄</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Loading Map</h3>
          <p className="text-gray-600">Initializing EPA Mining Concessions Map...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full h-full ${className}`}>
      <div 
        ref={mapRef} 
        className="w-full h-full bg-green-100 flex items-center justify-center"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-800 mb-2">🗺️ Ghana Map</h2>
          <p className="text-green-600">EPA Mining Concessions Dashboard</p>
          <p className="text-sm text-green-500 mt-2">Map placeholder - ArcGIS integration will be added next</p>
        </div>
      </div>
    </div>
  )
}

export default MapViewer
