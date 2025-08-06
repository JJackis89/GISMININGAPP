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
  const environmentalLayerRef = useRef<any>(null)
  const printWidgetRef = useRef<any>(null)

  // Helper functions defined outside useEffect for reusability
  const zoomToFeature = (feature: any, view: any) => {
    console.log('🎯 Zooming to selected feature...')
    
    const require = (window as any).require
    
    require(['esri/Graphic'], (Graphic: any) => {
      try {
        // Create a highlight graphic
        const highlightGraphic = new Graphic({
          geometry: feature.geometry,
          symbol: {
            type: 'simple-fill',
            color: [255, 255, 0, 0.6], // Yellow highlight with transparency
            outline: {
              color: [255, 255, 0, 1], // Yellow outline
              width: 3
            }
          }
        })

        // Clear any existing highlights
        view.graphics.removeAll()
        
        // Add highlight graphic
        view.graphics.add(highlightGraphic)

        // Zoom to feature with some padding
        view.goTo({
          target: feature.geometry.extent.expand(1.5),
          duration: 1500
        }).then(() => {
          console.log('✅ Zoomed to feature successfully')
          
          // Show popup with feature information
          view.popup.open({
            features: [feature],
            location: feature.geometry.centroid
          })

          // Remove highlight after 5 seconds
          setTimeout(() => {
            view.graphics.remove(highlightGraphic)
          }, 5000)
        }).catch((error: any) => {
          console.error('❌ Error zooming to feature:', error)
        })
      } catch (error) {
        console.error('❌ Error creating highlight:', error)
      }
    })
  }

  // Handle search widget selection
  const handleSearchSelect = (suggestion: any) => {
    console.log('🎯 Search selection:', suggestion)
    
    if (!viewRef.current) return

    const require = (window as any).require
    
    if (suggestion.type === 'concession') {
      // Zoom to specific concession
      require(['esri/rest/support/Query'], (Query: any) => {
        const query = new Query()
        query.where = `OBJECTID = ${suggestion.data.OBJECTID}` // Use OBJECTID for precise match
        query.returnGeometry = true
        query.outFields = ['*']
        
        if (miningLayerRef.current) {
          miningLayerRef.current.queryFeatures(query).then((results: any) => {
            if (results.features && results.features.length > 0) {
              const feature = results.features[0]
              
              // Zoom to the feature
              if (feature.geometry) {
                const extent = feature.geometry.extent || feature.geometry
                viewRef.current.goTo(extent.expand(2))
                
                // Show popup after zoom
                setTimeout(() => {
                  viewRef.current.popup.open({
                    features: [feature],
                    location: feature.geometry.centroid || feature.geometry.center
                  })
                }, 1000)
              }
            }
          }).catch((error: any) => {
            console.error('❌ Error finding concession:', error)
          })
        }
      })
    } else if (suggestion.type === 'district' || suggestion.type === 'region') {
      // Zoom to district or region
      const fieldName = suggestion.type === 'district' ? 'District' : 'Region'
      const fieldValue = suggestion.data[suggestion.type]
      
      require(['esri/rest/support/Query'], (Query: any) => {
        const query = new Query()
        query.where = `${fieldName} = '${fieldValue}'`
        query.returnGeometry = true
        query.outFields = ['*']
        
        if (miningLayerRef.current) {
          miningLayerRef.current.queryFeatures(query).then((results: any) => {
            if (results.features && results.features.length > 0) {
              require(['esri/geometry/geometryEngine'], (geometryEngine: any) => {
                // Create union of all geometries in the district/region
                const geometries = results.features.map((f: any) => f.geometry)
                const union = geometryEngine.union(geometries)
                
                if (union && union.extent) {
                  viewRef.current.goTo(union.extent.expand(1.2))
                }
              })
            }
          }).catch((error: any) => {
            console.error(`❌ Error finding ${suggestion.type}:`, error)
          })
        }
      })
    }
  }

  useEffect(() => {
    // Prevent multiple initializations
    if (initializationRef.current) {
      console.log('🚫 Map already initialized, skipping...')
      return
    }
    
    console.log('🚀 Starting map initialization...')
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
                
                // Add environmental zones layer
                setTimeout(() => {
                  addEnvironmentalZonesLayer(map, view)
                }, 700)
                
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
                fieldInfos: [] // Will be populated dynamically with all fields
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
          console.log('🏷️ Layer fields:', miningLayer.fields?.map((f: any) => f.name) || 'No fields')
          console.log('✅ Layer loaded state:', miningLayer.loaded)
          
          // Dynamically populate popup template with all fields from the hosted layer
          if (miningLayer.fields && miningLayer.fields.length > 0) {
            console.log('🔧 Setting up dynamic popup template with all fields...')
            
            const fieldInfos = miningLayer.fields
              .filter((field: any) => {
                // Exclude system fields, geometry fields, and metadata fields
                const excludeFields = [
                  'OBJECTID', 'OBJECTID_1', 'GlobalID', 'SHAPE', 'SHAPE_Length', 'SHAPE_Area', 'Shape__Area', 'Shape__Length',
                  'CreationDate', 'Creator', 'EditDate', 'Editor', 'created_user', 'created_date', 'last_edited_user', 'last_edited_date'
                ]
                return !excludeFields.includes(field.name)
              })
              .map((field: any) => ({
                fieldName: field.name,
                label: field.alias || field.name, // Use alias if available, otherwise use field name
                visible: true,
                format: field.type === 'esriFieldTypeDate' ? {
                  dateFormat: 'short-date'
                } : field.name === 'Size' ? {
                  digitSeparator: true,
                  places: 1
                } : undefined
              }))
            
            console.log(`✅ Created ${fieldInfos.length} field infos for popup:`, fieldInfos.map((f: any) => f.fieldName))
            
            // Update the popup template with all fields
            miningLayer.popupTemplate = {
              title: '{Name}',
              content: [
                {
                  type: 'fields',
                  fieldInfos: fieldInfos
                }
              ],
              actions: [
                {
                  title: 'Print Concession Details',
                  id: 'print-concession',
                  className: 'esri-icon-printer'
                }
              ]
            }
            
            console.log('🎉 Dynamic popup template configured successfully!')
          } else {
            console.warn('⚠️ No fields found on mining layer')
          }
          
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

    const addEnvironmentalZonesLayer = (map: any, _view: any) => {
      const require = (window as any).require
      
      require(['esri/layers/FeatureLayer'], (FeatureLayer: any) => {
        console.log('🗺️ Adding districts layer...')
        
        const districtsLayer = new FeatureLayer({
          url: 'https://services6.arcgis.com/Av3KhOzUMUMSORVt/arcgis/rest/services/Districts/FeatureServer/0',
          title: 'Districts',
          outFields: ['*'], // Fetch all fields for popups
          renderer: {
            type: 'simple',
            symbol: {
              type: 'simple-fill',
              color: [0, 0, 0, 0], // Transparent fill
              outline: {
                color: [0, 0, 0, 0.8], // Black outline
                width: 2
              }
            }
          },
          popupTemplate: {
            title: 'District: {district}', // Use correct field name
            content: [
              {
                type: 'fields',
                fieldInfos: [
                  { 
                    fieldName: 'district', 
                    label: 'District Name',
                    visible: true
                  },
                  { 
                    fieldName: 'region', 
                    label: 'Region',
                    visible: true
                  },
                  { 
                    fieldName: 'capital', 
                    label: 'Capital',
                    visible: true
                  }
                ]
              }
            ]
          },
          // District labels disabled - district names shown only in popups
          labelsVisible: false, // District labels disabled - names shown only in popups
          visible: true
        })

        map.add(districtsLayer, 0) // Add as bottom layer
        environmentalLayerRef.current = districtsLayer
        console.log('✅ Districts layer added successfully')
        
        // Add layer load event handling
        districtsLayer.when(() => {
          console.log('🗺️ Districts layer loaded successfully')
          console.log('📊 Districts layer extent:', districtsLayer.fullExtent)
          console.log('🏷️ Districts layer fields:', districtsLayer.fields.map((f: any) => f.name))
          
          // Update search widget with districts layer as source
          if (searchWidgetRef.current) {
            console.log('🔍 Adding districts layer to search widget...')
            const require = (window as any).require
            
            require(['esri/widgets/Search'], (_Search: any) => {
              // Create new search source for districts layer
              const districtsSearchSource = {
                layer: districtsLayer,
                searchFields: ["district", "region", "capital"],
                displayField: "district",
                exactMatch: false,
                outFields: ["*"],
                name: "Districts",
                placeholder: "Search districts...",
                maxResults: 6,
                maxSuggestions: 6,
                suggestionsEnabled: true,
                minSuggestCharacters: 2
              }
              
              // Add the districts layer source to existing sources
              searchWidgetRef.current.sources.add(districtsSearchSource)
              console.log('✅ Districts added to search widget')
            })
          }
        }).catch((error: any) => {
          console.error('❌ Error loading districts layer:', error)
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
      console.log('🔧 Setting up map widgets...')
      
      const require = (window as any).require
      
      require(['esri/widgets/Zoom', 'esri/widgets/BasemapGallery', 'esri/widgets/Expand', 'esri/widgets/Search'], (Zoom: any, BasemapGallery: any, Expand: any, Search: any) => {
        try {
          // Add basic zoom widget (hidden)
          const zoomWidget = new Zoom({
            view: view
          })
          
          view.ui.add(zoomWidget, 'top-right')
          zoomWidget.domNode.style.display = 'none' // Hide the default zoom

          // Create ArcGIS Search widget
          const searchWidget = new Search({
            view: view,
            placeholder: "Search mining concessions, districts...",
            maxResults: 8,
            maxSuggestions: 6,
            suggestionsEnabled: true,
            minSuggestCharacters: 2,
            includeDefaultSources: false, // Disable default world geocoding
            popupEnabled: true,
            resultGraphicEnabled: true
          })
          
          // Store search widget reference
          searchWidgetRef.current = searchWidget
          
          // Add search widget to the map UI with custom positioning
          view.ui.add(searchWidget, {
            position: "manual" // We'll position it manually with CSS
          })
          
          // Position the search widget below the banner using CSS
          setTimeout(() => {
            if (searchWidget.domNode) {
              searchWidget.domNode.style.position = 'absolute'
              searchWidget.domNode.style.top = '70px' // Below the banner
              searchWidget.domNode.style.left = '10px'
              searchWidget.domNode.style.zIndex = '45' // Below banner (z-40) but above map
              searchWidget.domNode.style.maxWidth = '300px'
            }
          }, 100)
          
          console.log('✅ ArcGIS Search widget created and positioned below banner')
          
          // Create basemap gallery
          const basemapGallery = new BasemapGallery({
            view: view,
            container: document.createElement('div')
          })

          // Create expandable widget for basemap gallery
          const basemapExpand = new Expand({
            view: view,
            content: basemapGallery,
            expanded: false,
            expandIconClass: 'esri-icon-basemap',
            expandTooltip: 'Basemap Gallery'
          })

          // Store references
          basemapGalleryRef.current = basemapGallery
          basemapExpandRef.current = basemapExpand

          // Add to map UI (position it away from our custom controls)
          view.ui.add(basemapExpand, 'bottom-left')
          
          console.log('✅ Map widgets initialized successfully')
        } catch (error) {
          console.error('❌ Error adding map widgets:', error)
        }
      })
    }

    // Start the initialization process with a small delay
    setTimeout(waitForDOMAndInitialize, 300)

    return () => {
      console.log('🧹 Component unmounting, cleaning up map...')
      isMounted = false
      
      // Only destroy if we actually have references
      if (viewRef.current) {
        try {
          console.log('🗑️ Destroying map view...')
          viewRef.current.destroy()
        } catch (error) {
          console.error('Error destroying map view:', error)
        }
      }
      
      // Reset initialization flag only on actual unmount
      initializationRef.current = false
      
      // Clean up widget references
      viewRef.current = null
      basemapGalleryRef.current = null
      measurementWidgetRef.current = null
      basemapExpandRef.current = null
      measurementExpandRef.current = null
      searchWidgetRef.current = null
      locateWidgetRef.current = null
      miningLayerRef.current = null
      printWidgetRef.current = null
    }
  }, []) // Empty dependency array to run only once

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
    <div className={`relative h-full ${className} bg-gray-50`}>
      {/* Professional Map Container */}
      <div className="relative h-full rounded-lg overflow-hidden shadow-lg border border-gray-200">
        <div ref={mapRef} className="w-full h-full" />
        
        {/* Professional Header Banner */}
        {mapStatus === 'loaded' && (
          <div className="absolute top-0 left-0 right-0 z-40 bg-gradient-to-r from-green-800 to-green-700 text-white px-4 py-2 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-green-800 font-bold text-sm">EPA</span>
                </div>
                <div>
                  <h1 className="text-sm font-semibold">Ghana Mining Concessions</h1>
                  <p className="text-xs text-green-100">Environmental Protection Authority</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <div className="bg-green-600 px-2 py-1 rounded-full flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                  <span>Live Data</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Professional Controls - Top Right */}
        {mapStatus === 'loaded' && (
          <div className="absolute top-16 right-4 z-50 flex flex-col space-y-3">
            {/* Enhanced Navigation Panel */}
            <div className="bg-white rounded-lg shadow-xl border border-gray-300 overflow-hidden">
              <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
                <h3 className="text-xs font-semibold text-gray-700 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
                  </svg>
                  Map Controls
                </h3>
              </div>
              <div className="p-3 space-y-2">
                {/* Zoom Controls */}
                <div className="flex space-x-1">
                  <button 
                    onClick={() => {
                      if (viewRef.current) {
                        viewRef.current.zoom = viewRef.current.zoom + 1
                      }
                    }}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md px-3 py-2 text-gray-700 text-sm font-bold transition-colors duration-200"
                    title="Zoom In"
                  >
                    <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                  </button>
                  <button 
                    onClick={() => {
                      if (viewRef.current) {
                        viewRef.current.zoom = viewRef.current.zoom - 1
                      }
                    }}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md px-3 py-2 text-gray-700 text-sm font-bold transition-colors duration-200"
                    title="Zoom Out"
                  >
                    <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 12H6"></path>
                    </svg>
                  </button>
                </div>
                
                {/* Layer Toggle Buttons */}
                <div className="space-y-2">
                  <button 
                    onClick={() => {
                      if (miningLayerRef.current) {
                        const currentlyVisible = miningLayerRef.current.labelsVisible
                        miningLayerRef.current.labelsVisible = !currentlyVisible
                        console.log('🏷️ Mining Labels:', !currentlyVisible ? 'ON' : 'OFF')
                      }
                    }}
                    className="w-full bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md px-3 py-2 text-blue-700 text-sm font-medium flex items-center justify-center space-x-2 transition-colors duration-200"
                    title="Toggle Mining Concession Labels"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                    </svg>
                    <span>Mine Labels</span>
                  </button>
                  
                  <button 
                    onClick={() => {
                      if (environmentalLayerRef.current) {
                        const currentlyVisible = environmentalLayerRef.current.visible
                        environmentalLayerRef.current.visible = !currentlyVisible
                        console.log('🗺️ Districts layer:', !currentlyVisible ? 'ON' : 'OFF')
                      }
                    }}
                    className="w-full bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-md px-3 py-2 text-purple-700 text-sm font-medium flex items-center justify-center space-x-2 transition-colors duration-200"
                    title="Toggle Districts Layer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                    </svg>
                    <span>Districts</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Enhanced Tools Panel */}
            <div className="bg-white rounded-lg shadow-xl border border-gray-300 overflow-hidden">
              <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
                <h3 className="text-xs font-semibold text-gray-700 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  Report Tools
                </h3>
              </div>
              <div className="p-3">
                <button 
                  onClick={async () => {
                    if (viewRef.current && miningLayerRef.current) {
                      console.log('🖨️ Initiating enhanced print with concession details...')
                      
                      try {
                        // Take screenshot first
                        console.log('📸 Taking map screenshot...')
                        const screenshot = await viewRef.current.takeScreenshot({
                          format: 'png',
                          quality: 90,
                          width: 1200,
                          height: 800
                        })
                        
                        // Query visible concessions in the current map extent
                        console.log('🔍 Querying visible concessions...')
                        const query = miningLayerRef.current.createQuery()
                        query.geometry = viewRef.current.extent
                        query.spatialRelationship = 'intersects'
                        query.returnGeometry = false
                        query.outFields = ['*']
                        
                        const concessionsResult = await miningLayerRef.current.queryFeatures(query)
                        console.log(`📋 Found ${concessionsResult.features.length} visible concessions`)

                        // Build concessions table
                        let concessionsTable = ''
                        let featureCount = 0
                        
                        if (concessionsResult.features && concessionsResult.features.length > 0) {
                          featureCount = concessionsResult.features.length
                          concessionsTable = `
                            <div style="margin: 20px; page-break-inside: avoid;">
                              <h2 style="color: #1e7e34; margin-bottom: 15px;">Visible Concessions (${featureCount})</h2>
                              <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
                                <thead>
                                  <tr style="background-color: #f8f9fa;">
                                    <th style="border: 1px solid #ddd; padding: 6px; text-align: left;">Concession Name</th>
                                    <th style="border: 1px solid #ddd; padding: 6px; text-align: left;">Holder</th>
                                    <th style="border: 1px solid #ddd; padding: 6px; text-align: left;">Mineral</th>
                                    <th style="border: 1px solid #ddd; padding: 6px; text-align: left;">Town</th>
                                    <th style="border: 1px solid #ddd; padding: 6px; text-align: left;">District</th>
                                    <th style="border: 1px solid #ddd; padding: 6px; text-align: right;">Size (Acres)</th>
                                    <th style="border: 1px solid #ddd; padding: 6px; text-align: left;">Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                          `
                          
                          concessionsResult.features.forEach((feature: any) => {
                            const attrs = feature.attributes
                            concessionsTable += `
                              <tr>
                                <td style="border: 1px solid #ddd; padding: 4px; font-size: 9px;">${attrs.Concession_Name || attrs.CONCESSION_NAME || attrs.Name || 'N/A'}</td>
                                <td style="border: 1px solid #ddd; padding: 4px; font-size: 9px;">${attrs.Holder || attrs.HOLDER || attrs.Owner || 'N/A'}</td>
                                <td style="border: 1px solid #ddd; padding: 4px; font-size: 9px;">${attrs.Mineral || attrs.MINERAL || attrs.Type || 'N/A'}</td>
                                <td style="border: 1px solid #ddd; padding: 4px; font-size: 9px;">${attrs.Town || attrs.TOWN || attrs.Settlement || 'N/A'}</td>
                                <td style="border: 1px solid #ddd; padding: 4px; font-size: 9px;">${attrs.District || attrs.DISTRICT || attrs.Dist_Name || 'N/A'}</td>
                                <td style="border: 1px solid #ddd; padding: 4px; text-align: right; font-size: 9px;">${attrs.Acreage || attrs.ACREAGE || attrs.Size ? Number(attrs.Acreage || attrs.ACREAGE || attrs.Size).toLocaleString() : 'N/A'}</td>
                                <td style="border: 1px solid #ddd; padding: 4px; font-size: 9px;">${attrs.License_Status || attrs.STATUS || attrs.Status || 'N/A'}</td>
                              </tr>
                            `
                          })
                          
                          concessionsTable += '</tbody></table></div>'
                        } else {
                          concessionsTable = `
                            <div style="margin: 20px; text-align: center; color: #666;">
                              <p>No concessions visible in current map extent</p>
                            </div>
                          `
                        }

                        // Open enhanced report in new window
                        const printWindow = window.open('', '_blank')
                        if (printWindow) {
                          printWindow.document.write(`
                            <html>
                              <head>
                                <title>Ghana Mining Concessions Report</title>
                                <style>
                                  body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
                                  .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #1e7e34; padding-bottom: 20px; }
                                  .header-logo { display: flex; align-items: center; justify-content: center; margin-bottom: 15px; }
                                  .epa-logo { 
                                    width: 100px; 
                                    height: 100px; 
                                    margin-right: 20px;
                                    filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
                                  }
                                  .header-title { margin: 0; }
                                  .header h1 { color: #1e7e34; margin-bottom: 5px; font-size: 24px; }
                                  .header p { color: #666; margin: 5px 0; }
                                  .org-name { font-size: 18px; font-weight: bold; color: #1e7e34; margin: 10px 0; }
                                  .map-section { text-align: center; margin: 20px 0; page-break-inside: avoid; }
                                  .map-section img { max-width: 100%; height: auto; border: 1px solid #ddd; border-radius: 8px; }
                                  table { margin: 0 auto; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
                                  @media print { 
                                    body { margin: 0; padding: 15px; }
                                    .header { margin-bottom: 20px; }
                                    .epa-logo { print-color-adjust: exact; }
                                  }
                                </style>
                              </head>
                              <body>
                                <div class="header">
                                  <div class="header-logo">
                                    <img src="/epa-logo.png" alt="EPA Ghana Logo" class="epa-logo" />
                                    <div class="header-title">
                                      <h1>Ghana Mining Concessions Report</h1>
                                      <div class="org-name">Environmental Protection Authority</div>
                                    </div>
                                  </div>
                                  <p>Republic of Ghana • Ministry of Environment, Science, Technology and Innovation</p>
                                  <p><strong>Report Generated:</strong> ${new Date().toLocaleString()}</p>
                                  <p><strong>Map Extent:</strong> ${viewRef.current.extent.xmin.toFixed(2)}, ${viewRef.current.extent.ymin.toFixed(2)} to ${viewRef.current.extent.xmax.toFixed(2)}, ${viewRef.current.extent.ymax.toFixed(2)}</p>
                                </div>
                                
                                <div class="map-section">
                                  <h2 style="color: #1e7e34;">Current Map View</h2>
                                  <img src="${screenshot.dataUrl}" alt="Mining Concessions Map">
                                </div>
                                
                                ${concessionsTable}
                                
                                <div style="margin-top: 30px; text-align: center; font-size: 10px; color: #666; border-top: 2px solid #1e7e34; padding-top: 15px;">
                                  <p style="font-weight: bold;">📊 Report Summary</p>
                                  <p>This report contains ${featureCount} concession(s) visible in the current map extent.</p>
                                  <p><strong>Data Source:</strong> Ghana Environmental Protection Authority Mining Database</p>
                                  <p><strong>Generated by:</strong> EPA MINING DATABASE</p>
                                  <p style="margin-top: 10px; font-style: italic;">Environmental Protection Authority • Republic of Ghana</p>
                                  <p style="margin-top: 5px; font-size: 9px; color: #888;">Developed by the GIS Department, EPA</p>
                                </div>
                                
                                <script>
                                  window.onload = () => {
                                    setTimeout(() => window.print(), 500);
                                  };
                                </script>
                              </body>
                            </html>
                          `)
                          printWindow.document.close()
                        }
                        
                      } catch (error) {
                        console.error('Enhanced print error details:', {
                          error: error,
                          message: error instanceof Error ? error.message : 'Unknown error',
                          viewReady: !!viewRef.current,
                          layerReady: !!miningLayerRef.current,
                          layerLoaded: miningLayerRef.current?.loaded
                        })
                        alert('Print feature temporarily unavailable. Please try again.')
                      }
                    }
                  }}
                  className="w-full bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-md px-3 py-2 text-orange-700 text-sm font-medium flex items-center justify-center space-x-2 transition-colors duration-200"
                  title="Generate Report"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
                  </svg>
                  <span>Print Report</span>
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Professional Footer Status */}
        {mapStatus === 'loaded' && (
          <div className="absolute bottom-4 right-4 z-50">
            <div className="bg-white rounded-lg shadow-xl border border-gray-300 overflow-hidden">
              <div className="bg-gray-50 px-3 py-1 border-b border-gray-200">
                <div className="text-xs font-semibold text-gray-700">System Status</div>
              </div>
              <div className="p-3 space-y-2">
                <div className="flex items-center space-x-2 text-xs">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-700 font-medium">Data Connected</span>
                </div>
                <div className="text-xs text-gray-600 border-t border-gray-200 pt-2">
                  <div className="font-medium">EPA Ghana GIS Department</div>
                  <div className="text-gray-500">Mining Concessions Portal</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Professional Loading State */}
      {mapStatus === 'loading' && (
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
          <div className="text-center bg-white rounded-lg shadow-xl p-8 border border-gray-200">
            <div className="w-16 h-16 mx-auto mb-4">
              <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Loading EPA Mining Portal</h3>
            <p className="text-gray-600 text-sm">Initializing map services and data layers...</p>
            <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      )}
      
      {/* Professional Error State */}
      {mapStatus === 'error' && (
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
          <div className="text-center bg-white rounded-lg shadow-xl p-8 border border-red-200">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">Map Loading Error</h3>
            <p className="text-red-600 text-sm mb-4">{errorMessage}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Reload Application
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default MapViewer
