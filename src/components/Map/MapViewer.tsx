import React, { useEffect, useRef, useState } from 'react'

interface MapViewerProps {
  className?: string
  selectedConcessions?: any[]
  onZoomToSelected?: () => void
  onDataLoaded?: (service: any) => void
}

const MapViewer: React.FC<MapViewerProps> = ({ 
  className = '', 
  selectedConcessions = [],
  onZoomToSelected,
  onDataLoaded: _onDataLoaded
}) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<any>(null)
  const [mapStatus, setMapStatus] = useState<'loading' | 'loaded' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const initializationRef = useRef<boolean>(false)
  const basemapGalleryRef = useRef<any>(null)
  const measurementWidgetRef = useRef<any>(null)
  const basemapExpandRef = useRef<any>(null)
  const measurementExpandRef = useRef<any>(null)
  const searchWidgetRef = useRef<any>(null)
  const locateWidgetRef = useRef<any>(null)
  const miningLayerRef = useRef<any>(null)
  const printWidgetRef = useRef<any>(null)

  useEffect(() => {
    // Prevent multiple initializations
    if (initializationRef.current) return
    initializationRef.current = true

    let isMounted = true
    let retryCount = 0
    const maxRetries = 50 // Wait up to 5 seconds

    const waitForDOMAndInitialize = () => {
      console.log('🔍 Checking ArcGIS and DOM readiness...')
      console.log('window.require:', typeof (window as any).require)
      console.log('mapRef.current:', !!mapRef.current)
      console.log('DOM element:', mapRef.current)
      
      if (!isMounted) {
        console.log('❌ Component unmounted, stopping initialization')
        return
      }

      // Check if ArcGIS API is available
      if (!(window as any).require) {
        console.log('❌ ArcGIS require not found, waiting...')
        if (retryCount < maxRetries) {
          retryCount++
          setTimeout(waitForDOMAndInitialize, 100)
        } else {
          setMapStatus('error')
          setErrorMessage('ArcGIS API failed to load after 5 seconds')
        }
        return
      }

      // Check if DOM element is ready
      if (!mapRef.current) {
        console.log('❌ mapRef not ready, waiting...')
        if (retryCount < maxRetries) {
          retryCount++
          setTimeout(waitForDOMAndInitialize, 100)
        } else {
          setMapStatus('error')
          setErrorMessage('DOM element not ready after 5 seconds')
        }
        return
      }

      // Both ArcGIS and DOM are ready, proceed with initialization
      console.log('✅ Both ArcGIS and DOM are ready! Initializing map...')
      initializeArcGISMap()
    }

    const initializeArcGISMap = () => {
      const require = (window as any).require

      try {
        require(['esri/Map', 'esri/views/MapView'], (Map: any, MapView: any) => {
          console.log('✅ ArcGIS modules loaded successfully')
          
          if (!isMounted || !mapRef.current) {
            console.log('❌ Component unmounted or mapRef missing during initialization')
            return
          }

          try {
            console.log('🗺️ Creating map...')
            
            const map = new Map({
              basemap: 'topo-vector'
            })

            console.log('📱 Creating map view with container:', mapRef.current)
            
            const view = new MapView({
              container: mapRef.current,
              map: map,
              center: [-1.0, 7.9], // Ghana coordinates
              zoom: 7
            })

            viewRef.current = view

            console.log('⏳ Waiting for view to be ready...')

            view.when(() => {
              console.log('🎉 SUCCESS! Map view is ready!')
              if (isMounted) {
                setMapStatus('loaded')
                
                // Initialize map widgets FIRST before adding layers
                console.log('🎯 Initializing widgets before adding layers...')
                initializeMapWidgets(view)
                
                // Then add the mining concessions layer
                setTimeout(() => {
                  addMiningConcessionsLayer(map, view)
                }, 500)
                
                // Configure popup and events after view is ready (non-blocking)
                try {
                  configurePopopAndEvents(view)
                } catch (popupError) {
                  console.warn('⚠️ Popup configuration failed, but continuing:', popupError)
                }
              }
            }).catch((error: any) => {
              console.error('❌ View.when() failed:', error)
              if (isMounted) {
                setMapStatus('error')
                setErrorMessage(`Map view error: ${error.message}`)
              }
            })

          } catch (error) {
            console.error('❌ Error creating map/view:', error)
            if (isMounted) {
              setMapStatus('error')
              setErrorMessage(`Map creation error: ${error instanceof Error ? error.message : 'Unknown error'}`)
            }
          }
        }, (error: any) => {
          console.error('❌ Failed to load ArcGIS modules:', error)
          if (isMounted) {
            setMapStatus('error')
            setErrorMessage(`Module load error: ${error.message}`)
          }
        })
      } catch (error) {
        console.error('❌ Error in require call:', error)
        if (isMounted) {
          setMapStatus('error')
          setErrorMessage(`Require error: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
      }
    }

    const addMiningConcessionsLayer = (map: any, _view: any) => {
      const require = (window as any).require
      
      require(['esri/layers/FeatureLayer'], (FeatureLayer: any) => {
        console.log('🏭 Adding mining concessions layer...')
        
        const miningLayer = new FeatureLayer({
          url: 'https://services6.arcgis.com/Av3KhOzUMUMSORVt/arcgis/rest/services/Mining_Concessions/FeatureServer/0',
          title: 'Mining Concessions',
          outFields: ['*'], // Fetch all fields for popups
          renderer: {
            type: 'simple',
            symbol: {
              type: 'simple-fill',
              color: [255, 165, 0, 0.4], // Orange with transparency
              outline: {
                color: [255, 140, 0, 1], // Darker orange outline
                width: 2
              }
            }
          },
          popupTemplate: {
            title: '{Name}', // Use 'Name' field
            content: [
              {
                type: 'fields',
                fieldInfos: [
                  { 
                    fieldName: 'PermitNumber', 
                    label: 'Permit Number',
                    visible: true
                  },
                  { 
                    fieldName: 'ContactPerson', 
                    label: 'Contact Person',
                    visible: true
                  },
                  { 
                    fieldName: 'LicenseStatus', 
                    label: 'Status',
                    visible: true
                  },
                  { 
                    fieldName: 'LicenseType', 
                    label: 'License Type',
                    visible: true
                  },
                  { 
                    fieldName: 'Size', 
                    label: 'Size',
                    visible: true
                  },
                  { 
                    fieldName: 'Town', 
                    label: 'Town',
                    visible: true
                  },
                  { 
                    fieldName: 'District', 
                    label: 'District',
                    visible: true
                  },
                  { 
                    fieldName: 'Region', 
                    label: 'Region',
                    visible: true
                  }
                ]
              }
            ],
            actions: [
              {
                title: 'Print Concession Details',
                id: 'print-concession',
                className: 'esri-icon-printer'
              }
            ]
          },
          // Add labeling configuration
          labelingInfo: [
            {
              labelExpressionInfo: {
                expression: '$feature.Name' // Use 'Name' field instead of 'ConcessionName'
              },
              symbol: {
                type: 'text',
                color: 'black',
                backgroundColor: [255, 255, 255, 0.8],
                borderLineColor: 'black',
                borderLineSize: 1,
                font: {
                  family: 'Arial',
                  size: 10,
                  weight: 'bold'
                },
                haloColor: 'white',
                haloSize: 1
              },
              minScale: 500000, // Only show labels when zoomed in
              maxScale: 0
            }
          ]
        })

        map.add(miningLayer)
        miningLayerRef.current = miningLayer
        console.log('✅ Mining concessions layer added successfully')
        
        // Add layer load event handling
        miningLayer.when(() => {
          console.log('🏭 Mining layer loaded successfully')
          console.log('📊 Layer extent:', miningLayer.fullExtent)
          console.log('🏷️ Layer fields:', miningLayer.fields.map((f: any) => f.name))
          
          // Update search widget with mining layer as source
          if (searchWidgetRef.current) {
            console.log('🔍 Adding mining layer to search widget...')
            const require = (window as any).require
            
            require(['esri/widgets/Search'], (_Search: any) => {
              // Create new search source for mining layer
              const miningSearchSource = {
                layer: miningLayer,
                searchFields: ["Name", "ContactPerson", "Town", "District", "Region"],
                displayField: "Name",
                exactMatch: false,
                outFields: ["*"],
                name: "Mining Concessions",
                placeholder: "Search mining concessions...",
                maxResults: 6,
                maxSuggestions: 6,
                suggestionsEnabled: true,
                minSuggestCharacters: 2
              }
              
              // Add the mining layer source to existing sources
              searchWidgetRef.current.sources.add(miningSearchSource)
              console.log('✅ Mining concessions added to search widget')
            })
          }
        }).catch((error: any) => {
          console.error('❌ Error loading mining layer:', error)
        })
      })
    }

    const configurePopopAndEvents = (view: any) => {
      // Simple configuration without complex popup event handling
      try {
        console.log('� Configuring basic map events...')
        
        // Add click event debugging
        view.on('click', (event: any) => {
          console.log('🖱️ Map clicked at:', event.mapPoint)
          view.hitTest(event).then((response: any) => {
            console.log('🎯 Hit test results:', response.results)
            if (response.results.length > 0) {
              const graphic = response.results[0].graphic
              console.log('📋 Feature clicked:', graphic.attributes)
            }
          })
        })
        
        console.log('✅ Basic map events configured successfully')
      } catch (error) {
        console.error('❌ Error configuring events:', error)
      }
    }

    const initializeMapWidgets = (view: any) => {
      console.log('🔧 Setting up simplified map controls...')
      
      // Just add basic ArcGIS zoom widget as fallback
      const require = (window as any).require
      
      require(['esri/widgets/Zoom'], (Zoom: any) => {
        try {
          const zoomWidget = new Zoom({
            view: view
          })
          
          // Add it but hide it since we have custom controls
          view.ui.add(zoomWidget, 'top-right')
          zoomWidget.domNode.style.display = 'none' // Hide the default zoom
          
          console.log('✅ Basic zoom widget added (hidden)')
        } catch (error) {
          console.error('❌ Error adding zoom widget:', error)
        }
      })
      
      console.log('✅ Simplified map controls initialized')
    }

    // Start the initialization process with a small delay
    setTimeout(waitForDOMAndInitialize, 300)

    return () => {
      console.log('🧹 Cleaning up map...')
      isMounted = false
      if (viewRef.current) {
        try {
          viewRef.current.destroy()
          viewRef.current = null
        } catch (error) {
          console.error('Error destroying map view:', error)
        }
      }
      
      // Clean up widget references
      basemapGalleryRef.current = null
      measurementWidgetRef.current = null
      basemapExpandRef.current = null
      measurementExpandRef.current = null
      searchWidgetRef.current = null
      locateWidgetRef.current = null
      miningLayerRef.current = null
      printWidgetRef.current = null
    }
  }, [])

  // Handle zooming to selected concessions
  useEffect(() => {
    if (!viewRef.current || !selectedConcessions.length) return

    const zoomToSelection = () => {
      const requireArcGIS = (window as any).require
      
      if (!requireArcGIS) return

      requireArcGIS(['esri/rest/support/Query'], (Query: any) => {
        const layer = viewRef.current.map.layers.find((l: any) => l.url?.includes('Mining_Concessions'))
        
        if (!layer) return

        const query = new Query({
          where: selectedConcessions.map(c => `ConcessionID = '${c.id}'`).join(' OR '),
          returnGeometry: true
        })

        layer.queryFeatures(query).then((results: any) => {
          if (results.features.length > 0) {
            requireArcGIS(['esri/geometry/geometryEngine'], (geometryEngine: any) => {
              const extent = geometryEngine.union(results.features.map((f: any) => f.geometry)).extent
              viewRef.current.goTo(extent.expand(1.2))
              
              if (onZoomToSelected) {
                setTimeout(() => onZoomToSelected(), 2000)
              }
            })
          }
        }).catch((error: any) => {
          console.error('Error querying features:', error)
        })
      })
    }

    setTimeout(zoomToSelection, 1000)
  }, [selectedConcessions, onZoomToSelected])

  return (
    <div className={`relative h-full ${className}`}>
      <div ref={mapRef} className="w-full h-full" />
      
      {/* Working Controls - Top Left */}
      {mapStatus === 'loaded' && (
        <div className="absolute top-2 left-2 z-50 flex flex-col space-y-1">
          {/* Search Box */}
          <div className="bg-white rounded shadow-md border border-gray-200 p-1">
            <input 
              type="text"
              placeholder="🔍 Search concessions..."
              className="w-48 px-2 py-1 border-0 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const value = (e.target as HTMLInputElement).value
                  if (value && miningLayerRef.current) {
                    console.log('🔍 Searching for:', value)
                    // Simple search implementation
                    const require = (window as any).require
                    require(['esri/rest/support/Query'], (Query: any) => {
                      const query = new Query({
                        where: `Name LIKE '%${value}%' OR ContactPerson LIKE '%${value}%' OR Town LIKE '%${value}%' OR District LIKE '%${value}%' OR Region LIKE '%${value}%'`,
                        returnGeometry: true,
                        outFields: ['*']
                      })
                      
                      miningLayerRef.current.queryFeatures(query).then((results: any) => {
                        if (results.features.length > 0) {
                          // Zoom to first result
                          viewRef.current.goTo(results.features[0].geometry.extent.expand(2))
                          // Show popup for first result
                          viewRef.current.popup.open({
                            features: [results.features[0]],
                            location: results.features[0].geometry.centroid
                          })
                          alert(`Found ${results.features.length} matching concessions. Zoomed to first result.`)
                        } else {
                          alert('No matching concessions found.')
                        }
                      }).catch((error: any) => {
                        console.error('Search error:', error)
                        alert('Search failed. Please try again.')
                      })
                    })
                  }
                }
              }}
            />
          </div>
          
          {/* Location Button */}
          <button 
            onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    const { latitude, longitude } = position.coords
                    if (viewRef.current) {
                      viewRef.current.center = [longitude, latitude]
                      viewRef.current.zoom = 12
                      console.log('📍 Located user at:', latitude, longitude)
                      alert('Found your location!')
                    }
                  },
                  (error) => {
                    console.error('Geolocation error:', error)
                    alert('Could not get your location. Please enable location services.')
                  }
                )
              } else {
                alert('Geolocation not supported by this browser.')
              }
            }}
            className="bg-white hover:bg-gray-100 border border-gray-300 rounded shadow-md px-2 py-1 text-gray-700 text-xs font-medium flex items-center justify-center"
            title="Find My Location"
          >
            📍
          </button>
        </div>
      )}
      
      {/* Working Controls - Top Right */}
      {mapStatus === 'loaded' && (
        <div className="absolute top-2 right-2 z-50 flex flex-col space-y-1">
          {/* Zoom Controls */}
          <div className="bg-white rounded shadow-md border border-gray-200 flex flex-col">
            <button 
              onClick={() => {
                if (viewRef.current) {
                  viewRef.current.zoom = viewRef.current.zoom + 1
                }
              }}
              className="hover:bg-gray-100 rounded-t px-2 py-1 text-gray-700 text-sm font-bold border-b border-gray-200"
              title="Zoom In"
            >
              +
            </button>
            <button 
              onClick={() => {
                if (viewRef.current) {
                  viewRef.current.zoom = viewRef.current.zoom - 1
                }
              }}
              className="hover:bg-gray-100 rounded-b px-2 py-1 text-gray-700 text-sm font-bold"
              title="Zoom Out"
            >
              −
            </button>
          </div>
          
          {/* Compact Tool Buttons */}
          <button 
            onClick={() => {
              if (viewRef.current && viewRef.current.map) {
                const currentBasemap = viewRef.current.map.basemap.id
                const newBasemap = currentBasemap === 'topo-vector' ? 'satellite' : 'topo-vector'
                viewRef.current.map.basemap = newBasemap
                console.log('🗺️ Switched basemap to:', newBasemap)
              }
            }}
            className="bg-white hover:bg-gray-100 border border-gray-300 rounded shadow-md px-2 py-1 text-gray-700 text-xs"
            title="Toggle Basemap"
          >
            🗺️
          </button>
          
          <button 
            onClick={() => {
              if (miningLayerRef.current) {
                const currentlyVisible = miningLayerRef.current.labelsVisible
                miningLayerRef.current.labelsVisible = !currentlyVisible
                console.log('🏷️ Labels:', !currentlyVisible ? 'ON' : 'OFF')
                alert(`Labels turned ${!currentlyVisible ? 'ON' : 'OFF'}`)
              }
            }}
            className="bg-white hover:bg-gray-100 border border-gray-300 rounded shadow-md px-2 py-1 text-gray-700 text-xs"
            title="Toggle Labels"
          >
            🏷️
          </button>
          
          <button 
            onClick={() => {
              if (viewRef.current) {
                console.log('🖨️ Initiating print...')
                // Simple screenshot approach
                viewRef.current.takeScreenshot({
                  format: 'png',
                  quality: 90,
                  width: 1200,
                  height: 800
                }).then((screenshot: any) => {
                  // Open screenshot in new window for printing
                  const printWindow = window.open('', '_blank')
                  if (printWindow) {
                    printWindow.document.write(`
                      <html>
                        <head>
                          <title>Ghana Mining Concessions Map</title>
                          <style>
                            body { margin: 0; text-align: center; }
                            img { max-width: 100%; height: auto; }
                            h1 { font-family: Arial, sans-serif; color: #333; }
                            @media print { body { margin: 0; } }
                          </style>
                        </head>
                        <body>
                          <h1>Ghana Mining Concessions Map</h1>
                          <p>Environmental Protection Agency - ${new Date().toLocaleDateString()}</p>
                          <img src="${screenshot.dataUrl}" alt="Mining Concessions Map">
                          <script>window.onload = () => window.print();</script>
                        </body>
                      </html>
                    `)
                    printWindow.document.close()
                  }
                }).catch((error: any) => {
                  console.error('Screenshot error:', error)
                  alert('Print feature temporarily unavailable.')
                })
              }
            }}
            className="bg-white hover:bg-gray-100 border border-gray-300 rounded shadow-md px-2 py-1 text-gray-700 text-xs"
            title="Print Map"
          >
            🖨️
          </button>
        </div>
      )}
      
      {/* Compact Status Indicator */}
      {mapStatus === 'loaded' && (
        <div className="absolute bottom-2 left-2 z-50 bg-green-600 text-white rounded px-2 py-1 text-xs font-medium shadow-md">
          ✅ Live Data
        </div>
      )}
      
      {mapStatus === 'loading' && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
      
      {mapStatus === 'error' && (
        <div className="absolute inset-0 bg-red-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-2">Error loading map</p>
            <p className="text-red-500 text-sm">{errorMessage}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default MapViewer
