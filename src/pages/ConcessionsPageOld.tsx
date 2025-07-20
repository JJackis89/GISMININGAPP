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
  }, [concessions, searchQuery, filters])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-epa-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading concessions data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mining Concessions</h1>
          <p className="text-gray-600">Manage and view all mining concession records</p>
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
                Concessions Table ({filteredConcessions.length} records)
              </h2>
              <p className="text-sm text-gray-600">
                Detailed view of all mining concession permits
              </p>
            </div>
            <ConcessionTable concessions={filteredConcessions} />
          </div>
        </div>
      </div>
    </div>
  )
}
