import { useState, useEffect } from 'react'
import ConcessionTable from '../components/Table/ConcessionTable'
import SearchBar from '../components/Search/SearchBar'
import FilterPanel from '../components/Filters/FilterPanel'
import ExportTools from '../components/Export/ExportTools'
import { MiningConcession } from '../types'
import { miningDataService } from '../services/miningDataService'

export default function ConcessionsPage() {
  const [concessions, setConcessions] = useState<MiningConcession[]>([])
  const [filteredConcessions, setFilteredConcessions] = useState<MiningConcession[]>([])
  const [loading, setLoading] = useState(true)
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
        
        // Initialize the data service and fetch real mining concessions
        await miningDataService.initialize()
        const realData = await miningDataService.getMiningConcessions()
        
        console.log(`✅ Loaded ${realData.length} real mining concessions for concessions view`)
        setConcessions(realData)
        setFilteredConcessions(realData)
      } catch (err) {
        console.error('Error loading real data:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Apply filters
  useEffect(() => {
    let filtered = concessions

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.district.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply region filter
    if (filters.region) {
      filtered = filtered.filter(c => c.region === filters.region)
    }

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(c => c.status === filters.status)
    }

    // Apply type filter
    if (filters.type) {
      filtered = filtered.filter(c => c.permitType === filters.type)
    }

    // Apply expiry window filter
    if (filters.expiryWindow) {
      const now = new Date()
      const windowDate = new Date()
      
      switch (filters.expiryWindow) {
        case '30':
          windowDate.setDate(now.getDate() + 30)
          break
        case '90':
          windowDate.setDate(now.getDate() + 90)
          break
        case '180':
          windowDate.setDate(now.getDate() + 180)
          break
      }

      filtered = filtered.filter(c => {
        const expiryDate = new Date(c.permitExpiryDate)
        return expiryDate <= windowDate && c.status === 'active'
      })
    }

    setFilteredConcessions(filtered)
  }, [concessions, searchQuery, filters])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-epa-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading real mining concessions data...</p>
              <p className="text-sm text-gray-500 mt-2">Fetching real-time data</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-epa-orange-900">Mining Concessions Database</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive management of mining permits and concessions in Ghana - Real EPA Data
          </p>
          <div className="mt-4 p-3 bg-green-50 rounded border border-green-200">
            <div className="text-sm text-green-800">
              ✅ Real-time data • {concessions.length} concessions loaded • Last updated: {new Date().toLocaleString()}
            </div>
          </div>
        </div>

        {/* Search and Export Tools */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1 max-w-lg">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
          <ExportTools concessions={filteredConcessions} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Filter Panel */}
          <div className="xl:col-span-1">
            <FilterPanel filters={filters} onFiltersChange={setFilters} />
          </div>

          {/* Concessions Table */}
          <div className="xl:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Concessions Table ({filteredConcessions.length} of {concessions.length} records)
                </h2>
                <p className="text-sm text-gray-600">
                  Real-time view of all mining concession permits from EPA database
                </p>
              </div>
              <ConcessionTable concessions={filteredConcessions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
