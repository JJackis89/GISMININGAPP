import { useState, useEffect } from 'react'
import MapViewer from '../Map/MapViewer'
import StatsCards from './StatsCards'
import ConcessionTable from '../Table/ConcessionTable'
import FilterPanel from '../Filters/FilterPanel'
import ChartsSection from '../Charts/ChartsSection'
import SearchBar from '../Search/SearchBar'
import ExportTools from '../Export/ExportTools'
import { MiningConcession, DashboardStats } from '../../types'
import { arcgisService, calculateStatsFromConcessions } from '../../services/arcgisService'
import { miningDataService } from '../../services/miningDataService'
import { dataRefreshService } from '../../services/dataRefreshService'
import { mockConcessions } from '../../data/mockData'

export default function Dashboard() {
  const [concessions, setConcessions] = useState<MiningConcession[]>([])
  const [filteredConcessions, setFilteredConcessions] = useState<MiningConcession[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalConcessions: 0,
    activePermits: 0,
    expiredPermits: 0,
    soonToExpire: 0,
    totalAreaCovered: 0,
    concessionsByRegion: {},
    concessionsByType: {},
    concessionsByMiningMethod: {}
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    region: '',
    status: '',
    type: '',
    expiryWindow: ''
  })

  // Load real data from ArcGIS
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log('Loading concessions data...')
        
        // Use ArcGIS Feature Layer data to match the map
        // Use miningDataService for consistent hosted layer data
        console.log('🔄 Dashboard: Loading real data from EPA hosted layer...')
        
        await miningDataService.initialize()
        const realConcessions = await miningDataService.getMiningConcessions(true) // Force fresh data
        
        console.log(`✅ Dashboard: Loaded ${realConcessions.length} concessions from hosted layer`)
        console.log('🔍 Dashboard: Sample concession data:', realConcessions.slice(0, 2))
        
        setConcessions(realConcessions)
        setFilteredConcessions(realConcessions)
        setStats(calculateStatsFromConcessions(realConcessions))
      } catch (err) {
        console.error('Error loading data:', err)
        setError('Failed to load mining concession data. Please check your connection.')
        
        // Keep empty arrays as fallback
        setConcessions([])
        setFilteredConcessions([])
      } finally {
        setLoading(false)
      }
    }

    // Register refresh callback with the data refresh service
    const refreshCallback = () => {
      console.log('🔄 Dashboard: Refreshing data due to external change...')
      loadData()
    }

    // Register the callback
    dataRefreshService.registerRefreshCallback(refreshCallback)

    // Initial load
    loadData()

    // Cleanup: unregister callback when component unmounts
    return () => {
      dataRefreshService.unregisterRefreshCallback(refreshCallback)
    }
  }, [])

  useEffect(() => {
    let filtered = concessions

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.owner.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply other filters
    if (filters.region) {
      filtered = filtered.filter(c => c.region === filters.region)
    }
    if (filters.status) {
      filtered = filtered.filter(c => c.status === filters.status)
    }
    if (filters.type) {
      filtered = filtered.filter(c => c.permitType === filters.type)
    }
    if (filters.expiryWindow) {
      const today = new Date()
      const daysToAdd = parseInt(filters.expiryWindow)
      const futureDate = new Date(today.getTime() + daysToAdd * 24 * 60 * 60 * 1000)
      
      filtered = filtered.filter(c => {
        const expiryDate = new Date(c.permitExpiryDate)
        return expiryDate <= futureDate && expiryDate >= today
      })
    }

    setFilteredConcessions(filtered)
    setStats(calculateStatsFromConcessions(filtered))
  }, [concessions, searchQuery, filters])

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-epa-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading mining concession data...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-epa-orange-500 text-white rounded-md hover:bg-epa-orange-600"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Search and Export */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1 max-w-lg">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
        <ExportTools concessions={filteredConcessions} />
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Map View */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-96">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">EPA MINING DATABASE Map</h3>
              <p className="text-sm text-gray-600">Environmental monitoring and compliance tracking</p>
            </div>
            <div className="h-80">
              <MapViewer />
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        <div className="xl:col-span-1">
          <FilterPanel filters={filters} onFiltersChange={setFilters} />
        </div>
      </div>

      {/* Charts Section */}
      <ChartsSection stats={stats} />

      {/* Concessions Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Mining Concessions ({filteredConcessions.length})
          </h3>
        </div>
        <ConcessionTable concessions={filteredConcessions} />
      </div>
    </div>
  )
}
