import { useState, useEffect } from 'react'
import { Filter, X, RefreshCw } from 'lucide-react'
import { miningDataService } from '../../services/miningDataService'
import { dataRefreshService } from '../../services/dataRefreshService'
import { MiningConcession } from '../../types'

interface FilterPanelProps {
  filters: {
    region: string
    status: string
    type: string
    expiryWindow: string
  }
  onFiltersChange: (filters: any) => void
}

export default function FilterPanel({ filters, onFiltersChange }: FilterPanelProps) {
  const [availableRegions, setAvailableRegions] = useState<string[]>([])
  const [availableStatuses, setAvailableStatuses] = useState<string[]>([])
  const [availableTypes, setAvailableTypes] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  const expiryWindows = [
    { label: 'Next 30 days', value: '30' },
    { label: 'Next 60 days', value: '60' },
    { label: 'Next 90 days', value: '90' },
    { label: 'Next 6 months', value: '180' },
    { label: 'Next year', value: '365' }
  ]

  useEffect(() => {
    // Load filter options from hosted layer
    loadFilterOptionsFromHostedLayer()
    
    // Register refresh callback with the data refresh service
    const refreshCallback = () => {
      console.log('🔄 FilterPanel: Refreshing filter options due to external change...')
      loadFilterOptionsFromHostedLayer()
    }

    // Register the callback
    dataRefreshService.registerRefreshCallback(refreshCallback)

    // Cleanup: unregister callback when component unmounts
    return () => {
      dataRefreshService.unregisterRefreshCallback(refreshCallback)
    }
  }, [])

  const loadFilterOptionsFromHostedLayer = async () => {
    setLoading(true)
    try {
      console.log('🔍 FilterPanel: Loading filter options from hosted layer...')
      
      // Initialize and fetch fresh data from hosted layer
      await miningDataService.initialize()
      const concessions = await miningDataService.getMiningConcessions(true) // Force refresh
      
      // Extract unique values for filters
      const regions = [...new Set(concessions.map(c => c.region))].filter(Boolean).sort()
      const statuses = [...new Set(concessions.map(c => c.status))].filter(Boolean).sort()
      const types = [...new Set(concessions.map(c => c.permitType))].filter(Boolean).sort()
      
      console.log('✅ FilterPanel: Extracted filter options:', { regions, statuses, types })
      
      setAvailableRegions(regions)
      setAvailableStatuses(statuses)
      setAvailableTypes(types)
      setLastUpdate(new Date())
    } catch (error) {
      console.error('❌ FilterPanel: Failed to load filter options:', error)
      // Keep empty arrays for live data only - no fallback static data
      setAvailableRegions([])
      setAvailableStatuses([])
      setAvailableTypes([])
    } finally {
      setLoading(false)
    }
  }
  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      region: '',
      status: '',
      type: '',
      expiryWindow: ''
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filters
          {loading && <RefreshCw className="w-4 h-4 animate-spin text-epa-orange-500" />}
        </h3>
        <button
          onClick={clearFilters}
          className="text-sm text-epa-orange-600 hover:text-epa-orange-700 font-medium flex items-center gap-1"
        >
          <X className="w-4 h-4" />
          Clear All
        </button>
      </div>

      {/* Live data indicator */}
      <div className="mb-4 p-2 bg-green-50 rounded border border-green-200">
        <div className="text-xs text-green-800 flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Live filters from hosted layer • {availableRegions.length} regions, {availableStatuses.length} license statuses, {availableTypes.length} license types
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Region ({availableRegions.length} available)
          </label>
          <select
            value={filters.region}
            onChange={(e) => handleFilterChange('region', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            disabled={loading}
          >
            <option value="">All Regions</option>
            {availableRegions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            License Status ({availableStatuses.length} available)
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            disabled={loading}
          >
            <option value="">All License Statuses</option>
            {availableStatuses.map(status => (
              <option key={status} value={status} className="capitalize">{status}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            License Type ({availableTypes.length} available)
          </label>
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            disabled={loading}
          >
            <option value="">All Types</option>
            {availableTypes.map(type => (
              <option key={type} value={type} className="capitalize">{type.replace('-', ' ')}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Window</label>
          <select
            value={filters.expiryWindow}
            onChange={(e) => handleFilterChange('expiryWindow', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Permits</option>
            {expiryWindows.map(window => (
              <option key={window.value} value={window.value}>{window.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
