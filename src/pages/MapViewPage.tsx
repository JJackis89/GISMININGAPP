import { useState, useEffect } from 'react'
import MapViewer from '../components/Map/MapViewer'
import { Layers, MapPin, Search, Filter, Download, Maximize2, BarChart3, FileText } from 'lucide-react'
import { miningDataService } from '../services/miningDataService'
import { MiningConcession } from '../types'
import AnalyticsPanel from '../components/AnalyticsPanel'
import ReportsPanel from '../components/ReportsPanel'

export default function MapViewPage() {
  const [showLayerPanel, setShowLayerPanel] = useState(false)
  const [showSearchPanel, setShowSearchPanel] = useState(false)
  const [showAnalyticsPanel, setShowAnalyticsPanel] = useState(false)
  const [showReportsPanel, setShowReportsPanel] = useState(false)
  const [dataService, setDataService] = useState<typeof miningDataService | null>(null)
  const [concessions, setConcessions] = useState<MiningConcession[]>([])
  const [filteredConcessions, setFilteredConcessions] = useState<MiningConcession[]>([])
  const [searchCriteria, setSearchCriteria] = useState({
    name: '',
    owner: '',
    region: ''
  })

  // Load data when service becomes available
  useEffect(() => {
    if (dataService) {
      loadConcessions()
    }
  }, [dataService])

  const loadConcessions = async () => {
    if (!dataService) return
    try {
      const data = await dataService.getMiningConcessions()
      setConcessions(data)
      setFilteredConcessions(data)
    } catch (error) {
      console.error('Failed to load concessions:', error)
    }
  }

  const handleSearch = async () => {
    if (!dataService) return
    try {
      const results = await dataService.searchConcessions(searchCriteria)
      setFilteredConcessions(results)
      console.log(`Found ${results.length} matching concessions`)
    } catch (error) {
      console.error('Search failed:', error)
    }
  }

  const handleDataLoaded = (service: typeof miningDataService) => {
    setDataService(service)
  }

  // Close all panels except the specified one
  const openPanel = (panelName: 'layer' | 'search' | 'analytics' | 'reports') => {
    setShowLayerPanel(panelName === 'layer')
    setShowSearchPanel(panelName === 'search')
    setShowAnalyticsPanel(panelName === 'analytics')
    setShowReportsPanel(panelName === 'reports')
  }

  // Toggle panel functions
  const toggleLayerPanel = () => {
    if (showLayerPanel) {
      setShowLayerPanel(false)
    } else {
      openPanel('layer')
    }
  }

  const toggleSearchPanel = () => {
    if (showSearchPanel) {
      setShowSearchPanel(false)
    } else {
      openPanel('search')
    }
  }

  const toggleAnalyticsPanel = () => {
    if (showAnalyticsPanel) {
      setShowAnalyticsPanel(false)
    } else {
      openPanel('analytics')
    }
  }

  const toggleReportsPanel = () => {
    if (showReportsPanel) {
      setShowReportsPanel(false)
    } else {
      openPanel('reports')
    }
  }

  return (
    <div className="h-[calc(100vh-120px)] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative">
      {/* Map Toolbar */}
      <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg border border-gray-200 p-2">
        <div className="flex space-x-2">
          <button
            onClick={toggleLayerPanel}
            className={`p-2 rounded-md transition-colors ${
              showLayerPanel ? 'bg-epa-orange-100 text-epa-orange-700' : 'hover:bg-gray-100'
            }`}
            title="Toggle Layers"
          >
            <Layers className="h-5 w-5" />
          </button>
          
          <button
            onClick={toggleSearchPanel}
            className={`p-2 rounded-md transition-colors ${
              showSearchPanel ? 'bg-epa-orange-100 text-epa-orange-700' : 'hover:bg-gray-100'
            }`}
            title="Search Locations"
          >
            <Search className="h-5 w-5" />
          </button>
          
          <button
            onClick={toggleAnalyticsPanel}
            className={`p-2 rounded-md transition-colors ${
              showAnalyticsPanel ? 'bg-epa-orange-100 text-epa-orange-700' : 'hover:bg-gray-100'
            }`}
            title="Analytics Dashboard"
          >
            <BarChart3 className="h-5 w-5" />
          </button>
          
          <button
            onClick={toggleReportsPanel}
            className={`p-2 rounded-md transition-colors ${
              showReportsPanel ? 'bg-epa-orange-100 text-epa-orange-700' : 'hover:bg-gray-100'
            }`}
            title="Generate Reports"
          >
            <FileText className="h-5 w-5" />
          </button>
          
          <button
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            title="Find My Location"
          >
            <MapPin className="h-5 w-5" />
          </button>
          
          <button
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            title="Filter Data"
          >
            <Filter className="h-5 w-5" />
          </button>
          
          <button
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            title="Export Map"
          >
            <Download className="h-5 w-5" />
          </button>
          
          <button
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            title="Fullscreen"
          >
            <Maximize2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Layer Panel */}
      {showLayerPanel && (
        <div className="absolute top-16 left-4 z-10 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Map Layers {dataService && `(${concessions.length} concessions)`}
          </h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="rounded border-gray-300" />
              <span className="text-sm text-gray-700">
                Mining Concessions 
                {dataService && <span className="text-green-600 text-xs"> ✓ Real Data</span>}
              </span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="rounded border-gray-300" />
              <span className="text-sm text-gray-700">Administrative Boundaries</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded border-gray-300" />
              <span className="text-sm text-gray-700">Protected Areas</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded border-gray-300" />
              <span className="text-sm text-gray-700">Water Bodies</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded border-gray-300" />
              <span className="text-sm text-gray-700">Road Network</span>
            </label>
          </div>
          
          {/* Real Data Status */}
          {dataService && (
            <div className="mt-4 p-3 bg-green-50 rounded border border-green-200">
              <div className="text-xs font-medium text-green-800">Real ArcGIS Data Active</div>
              <div className="text-xs text-green-600 mt-1">
                • {concessions.length} mining concessions loaded
                • Data refreshed every 5 minutes
                • Source: EPA Mining Database
              </div>
            </div>
          )}
        </div>
      )}

      {/* Search Panel */}
      {showSearchPanel && (
        <div className="absolute top-16 left-4 z-10 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Search Mining Concessions ({filteredConcessions.length} found)
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Concession Name</label>
              <input
                type="text"
                placeholder="Search by name..."
                value={searchCriteria.name}
                onChange={(e) => setSearchCriteria({...searchCriteria, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-epa-orange-500 focus:border-epa-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Owner/Company</label>
              <input
                type="text"
                placeholder="Search by owner..."
                value={searchCriteria.owner}
                onChange={(e) => setSearchCriteria({...searchCriteria, owner: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-epa-orange-500 focus:border-epa-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Region</label>
              <select 
                value={searchCriteria.region}
                onChange={(e) => setSearchCriteria({...searchCriteria, region: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-epa-orange-500 focus:border-epa-orange-500"
              >
                <option value="">All Regions</option>
                <option value="Ashanti">Ashanti</option>
                <option value="Western">Western</option>
                <option value="Eastern">Eastern</option>
                <option value="Central">Central</option>
                <option value="Northern">Northern</option>
                <option value="Upper East">Upper East</option>
                <option value="Upper West">Upper West</option>
                <option value="Volta">Volta</option>
                <option value="Greater Accra">Greater Accra</option>
                <option value="Brong Ahafo">Brong Ahafo</option>
              </select>
            </div>
            <button 
              onClick={handleSearch}
              className="w-full px-3 py-2 bg-epa-orange-600 text-white rounded-md text-sm hover:bg-epa-orange-700 transition-colors"
            >
              Search & Zoom
            </button>

            {/* Search Results */}
            {filteredConcessions.length > 0 && (
              <div className="mt-4 max-h-48 overflow-y-auto border-t pt-3">
                <h4 className="text-xs font-medium text-gray-700 mb-2">Search Results:</h4>
                <div className="space-y-2">
                  {filteredConcessions.slice(0, 10).map((concession) => (
                    <div key={concession.id} className="p-2 bg-gray-50 rounded text-xs">
                      <div className="font-medium text-gray-900">{concession.name}</div>
                      <div className="text-gray-600">{concession.owner}</div>
                      <div className="text-gray-500">{concession.region} - {concession.size} ha</div>
                    </div>
                  ))}
                  {filteredConcessions.length > 10 && (
                    <div className="text-xs text-gray-500 text-center">
                      ...and {filteredConcessions.length - 10} more
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Analytics Panel */}
      {showAnalyticsPanel && (
        <div className="absolute top-16 left-4 z-10 w-96 bg-white rounded-lg shadow-lg border border-gray-200 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900">Mining Concessions Analytics</h3>
            <p className="text-xs text-gray-600 mt-1">Real-time data from EPA database</p>
          </div>
          <div className="p-4">
            <AnalyticsPanel dataService={dataService} concessions={concessions} />
          </div>
        </div>
      )}

      {/* Reports Panel */}
      {showReportsPanel && (
        <div className="absolute top-16 left-4 z-10 w-96 bg-white rounded-lg shadow-lg border border-gray-200 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900">Mining Concessions Reports</h3>
            <p className="text-xs text-gray-600 mt-1">Generate and export compliance reports</p>
          </div>
          <div className="p-4">
            <ReportsPanel dataService={dataService} concessions={concessions} />
          </div>
        </div>
      )}

      {/* Map Status Bar */}
      <div className="absolute bottom-4 left-4 z-10 bg-black text-yellow-400 rounded-lg shadow-xl border-2 border-yellow-400 px-4 py-3">
        <div className="flex items-center space-x-4 text-sm font-mono">
          <span>🗺️ Ghana Mining Concessions</span>
          <span>📍 Live Coordinate Tracking</span>
          <span>🔍 Professional GIS Scale</span>
          <span className="animate-pulse">● LIVE</span>
        </div>
      </div>

      {/* Full Screen Map - Clean Professional Look */}
      <div className="w-full h-full rounded-lg overflow-hidden border-2 border-blue-600 shadow-lg bg-blue-900">
        <div className="relative w-full h-full">
          {/* Map goes inside this container */}
          <MapViewer 
            className="w-full h-full rounded" 
            onDataLoaded={handleDataLoaded}
          />
        </div>
      </div>
    </div>
  )
}
