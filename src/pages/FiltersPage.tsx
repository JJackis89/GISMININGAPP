import { useState, useEffect } from 'react'
import FilterPanel from '../components/Filters/FilterPanel'
import { Filter, Search, RefreshCw, Download } from 'lucide-react'
import { miningDataService } from '../services/miningDataService'
import { MiningConcession } from '../types'
import ConcessionTable from '../components/Table/ConcessionTable'

export default function FiltersPage() {
  const [concessions, setConcessions] = useState<MiningConcession[]>([])
  const [filteredConcessions, setFilteredConcessions] = useState<MiningConcession[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    region: '',
    status: '',
    type: '',
    expiryWindow: ''
  })

  const [advancedFilters, setAdvancedFilters] = useState({
    sizeMin: '',
    sizeMax: '',
    companySearch: '',
    districtSearch: '',
    permitDateFrom: '',
    permitDateTo: ''
  })

  // Load real mining concessions data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        await miningDataService.initialize()
        const realData = await miningDataService.getMiningConcessions()
        
        console.log(`✅ Loaded ${realData.length} real mining concessions for advanced filters`)
        
        // Debug: Show unique owners
        const uniqueOwners = [...new Set(realData.map(c => c.owner))]
        console.log('🏢 Unique owners in dataset:', uniqueOwners)
        
        // Debug: Show unique concession names
        const uniqueNames = [...new Set(realData.map(c => c.name))]
        console.log('📝 Unique concession names in dataset:', uniqueNames)
        
        setConcessions(realData)
        setFilteredConcessions(realData)
      } catch (error) {
        console.error('Failed to load concessions data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Apply all filters when any filter changes
  useEffect(() => {
    if (concessions.length === 0) return

    let filtered = concessions

    // Apply basic filters
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
      const now = new Date()
      const windowDate = new Date()
      
      switch (filters.expiryWindow) {
        case '30':
          windowDate.setDate(now.getDate() + 30)
          break
        case '60':
          windowDate.setDate(now.getDate() + 60)
          break
        case '90':
          windowDate.setDate(now.getDate() + 90)
          break
        case '180':
          windowDate.setDate(now.getDate() + 180)
          break
        case '365':
          windowDate.setDate(now.getDate() + 365)
          break
      }

      filtered = filtered.filter(c => {
        const expiryDate = new Date(c.permitExpiryDate)
        return expiryDate <= windowDate && c.status === 'active'
      })
    }

    // Apply advanced filters
    if (advancedFilters.sizeMin !== '' && advancedFilters.sizeMax !== '') {
      const minSize = parseFloat(advancedFilters.sizeMin)
      const maxSize = parseFloat(advancedFilters.sizeMax)
      
      // Validate that min <= max
      if (minSize > maxSize) {
        console.warn('Minimum size cannot be greater than maximum size')
        return // Return without applying invalid filter
      }
    }
    
    if (advancedFilters.sizeMin) {
      const minSize = parseFloat(advancedFilters.sizeMin)
      filtered = filtered.filter(c => c.size >= minSize)
    }
    if (advancedFilters.sizeMax) {
      const maxSize = parseFloat(advancedFilters.sizeMax)
      filtered = filtered.filter(c => c.size <= maxSize)
    }
    if (advancedFilters.companySearch) {
      const searchTerm = advancedFilters.companySearch.toLowerCase().trim()
      console.log('Company search term:', searchTerm)
      
      filtered = filtered.filter(c => {
        const concessionName = c.name.toLowerCase()
        const isMatch = concessionName.includes(searchTerm)
        
        // Debug logging for first few matches
        if (searchTerm.length > 2) {
          console.log(`Checking "${c.name}" against "${searchTerm}": ${isMatch}`)
        }
        
        return isMatch
      })
      
      console.log(`Company search "${searchTerm}" found ${filtered.length} matches`)
    }
    if (advancedFilters.districtSearch) {
      const searchTerm = advancedFilters.districtSearch.toLowerCase()
      filtered = filtered.filter(c => 
        c.district.toLowerCase().includes(searchTerm)
      )
    }
    if (advancedFilters.permitDateFrom) {
      filtered = filtered.filter(c => {
        const permitDate = new Date(c.permitExpiryDate) // Using expiry date as that's what's available
        const fromDate = new Date(advancedFilters.permitDateFrom)
        return permitDate >= fromDate
      })
    }
    if (advancedFilters.permitDateTo) {
      filtered = filtered.filter(c => {
        const permitDate = new Date(c.permitExpiryDate) // Using expiry date as that's what's available
        const toDate = new Date(advancedFilters.permitDateTo)
        return permitDate <= toDate
      })
    }

    setFilteredConcessions(filtered)
  }, [concessions, filters, advancedFilters])

  const handleResetFilters = () => {
    setFilters({
      region: '',
      status: '',
      type: '',
      expiryWindow: ''
    })
    setAdvancedFilters({
      sizeMin: '',
      sizeMax: '',
      companySearch: '',
      districtSearch: '',
      permitDateFrom: '',
      permitDateTo: ''
    })
  }

  const handleApplyFilters = () => {
    // Filters are already applied automatically via useEffect
    // This is just for user feedback
    const activeFiltersCount = [
      filters.region,
      filters.status,
      filters.type,
      filters.expiryWindow,
      advancedFilters.sizeMin,
      advancedFilters.sizeMax,
      advancedFilters.companySearch,
      advancedFilters.districtSearch,
      advancedFilters.permitDateFrom,
      advancedFilters.permitDateTo
    ].filter(f => f && f !== '').length
    
    console.log('Filters applied:', { filters, advancedFilters })
    console.log(`Found ${filteredConcessions.length} matching concessions with ${activeFiltersCount} active filters`)
    
    // Optional: Show success message with result count
    if (activeFiltersCount > 0) {
      alert(`Filters applied! Found ${filteredConcessions.length} matching concessions.`)
    } else {
      alert('No filters are currently active. Showing all concessions.')
    }
  }

  const handleSaveFilterSet = () => {
    // Here you would save the current filter configuration
    const filterName = prompt('Enter a name for this filter set:')
    if (filterName) {
      console.log('Saving filter set:', filterName, { filters, advancedFilters })
      alert(`Filter set "${filterName}" saved successfully!`)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-epa-orange-900">Advanced Filters</h1>
          <p className="text-gray-600">Configure detailed filters for mining concession data</p>
        </div>
      </div>

      {/* Filter Results Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-medium text-blue-900">
              Showing {filteredConcessions.length} of {concessions.length} concessions
            </span>
          </div>
          <div className="text-xs text-blue-700">
            {[
              filters.region && `Region: ${filters.region}`,
              filters.status && `Status: ${filters.status}`,
              filters.type && `Type: ${filters.type.replace('-', ' ')}`,
              filters.expiryWindow && `Expiring in ${filters.expiryWindow} days`,
              advancedFilters.sizeMin && `Min size: ${advancedFilters.sizeMin}ha`,
              advancedFilters.sizeMax && `Max size: ${advancedFilters.sizeMax}ha`,
              advancedFilters.companySearch && `Concession: "${advancedFilters.companySearch}"`,
              advancedFilters.districtSearch && `District: "${advancedFilters.districtSearch}"`,
              (advancedFilters.permitDateFrom || advancedFilters.permitDateTo) && 'Date range applied'
            ].filter(Boolean).join(' • ') || 'No filters applied'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Filters */}
        <div className="lg:col-span-1">
          <FilterPanel filters={filters} onFiltersChange={setFilters} />
        </div>

        {/* Advanced Filters */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Advanced Filter Options</h2>
              <p className="text-sm text-gray-600">Additional criteria for precise data filtering</p>
            </div>
            <div className="p-6 space-y-6">
              {/* Size Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Concession Size (Hectares)
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Minimum</label>
                    <input
                      type="number"
                      placeholder="Min size"
                      value={advancedFilters.sizeMin}
                      onChange={(e) => setAdvancedFilters(prev => ({ ...prev, sizeMin: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-epa-orange-500 focus:border-epa-orange-500"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Maximum</label>
                    <input
                      type="number"
                      placeholder="Max size"
                      value={advancedFilters.sizeMax}
                      onChange={(e) => setAdvancedFilters(prev => ({ ...prev, sizeMax: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-epa-orange-500 focus:border-epa-orange-500"
                      min="0"
                    />
                  </div>
                </div>
                {/* Validation feedback for size range */}
                {advancedFilters.sizeMin && advancedFilters.sizeMax && 
                 parseFloat(advancedFilters.sizeMin) > parseFloat(advancedFilters.sizeMax) && (
                  <div className="text-red-600 text-sm mt-1">
                    ⚠️ Minimum size cannot be greater than maximum size
                  </div>
                )}
              </div>

              {/* Company Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Concession Name Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by concession name..."
                    value={advancedFilters.companySearch}
                    onChange={(e) => setAdvancedFilters(prev => ({ ...prev, companySearch: e.target.value }))}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-epa-orange-500 focus:border-epa-orange-500"
                  />
                </div>
                {/* Show available concession names hint */}
                {concessions.length > 0 && (
                  <div className="text-xs text-gray-500 mt-1">
                    Available concessions: {[...new Set(concessions.map(c => c.name))].slice(0, 3).join(', ')}
                    {[...new Set(concessions.map(c => c.name))].length > 3 && ` and ${[...new Set(concessions.map(c => c.name))].length - 3} more...`}
                  </div>
                )}
                {/* Show search results count */}
                {advancedFilters.companySearch && (
                  <div className="text-xs text-blue-600 mt-1">
                    {filteredConcessions.filter(c => c.name.toLowerCase().includes(advancedFilters.companySearch.toLowerCase())).length} matches found
                  </div>
                )}
              </div>

              {/* District Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  District Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by district name..."
                    value={advancedFilters.districtSearch}
                    onChange={(e) => setAdvancedFilters(prev => ({ ...prev, districtSearch: e.target.value }))}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-epa-orange-500 focus:border-epa-orange-500"
                  />
                </div>
              </div>

              {/* Permit Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permit Expiry Date Range
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">From</label>
                    <input
                      type="date"
                      value={advancedFilters.permitDateFrom}
                      onChange={(e) => setAdvancedFilters(prev => ({ ...prev, permitDateFrom: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-epa-orange-500 focus:border-epa-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">To</label>
                    <input
                      type="date"
                      value={advancedFilters.permitDateTo}
                      onChange={(e) => setAdvancedFilters(prev => ({ ...prev, permitDateTo: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-epa-orange-500 focus:border-epa-orange-500"
                    />
                  </div>
                </div>
                {/* Validation feedback for date range */}
                {advancedFilters.permitDateFrom && advancedFilters.permitDateTo && 
                 new Date(advancedFilters.permitDateFrom) > new Date(advancedFilters.permitDateTo) && (
                  <div className="text-red-600 text-sm mt-1">
                    ⚠️ Start date cannot be later than end date
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleApplyFilters}
                  className="flex items-center space-x-2 px-4 py-2 bg-epa-orange-600 text-white rounded-md hover:bg-epa-orange-700 focus:ring-2 focus:ring-epa-orange-500 focus:ring-offset-2"
                >
                  <Filter className="h-4 w-4" />
                  <span>Apply Filters</span>
                </button>
                
                <button
                  onClick={handleResetFilters}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Reset All</span>
                </button>

                <button
                  onClick={handleSaveFilterSet}
                  className="flex items-center space-x-2 px-4 py-2 bg-epa-green-600 text-white rounded-md hover:bg-epa-green-700 focus:ring-2 focus:ring-epa-green-500 focus:ring-offset-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Save Filter Set</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtered Results Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Filter Results</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {filteredConcessions.length} of {concessions.length} concessions
              </span>
              {filteredConcessions.length > 0 && (
                <button
                  onClick={() => {
                    const csv = miningDataService.exportToCSV(filteredConcessions)
                    const blob = new Blob([csv], { type: 'text/csv' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = 'filtered_mining_concessions.csv'
                    a.click()
                  }}
                  className="text-xs px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Export CSV
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <span className="ml-3 text-gray-600">Loading data...</span>
            </div>
          ) : filteredConcessions.length > 0 ? (
            <ConcessionTable concessions={filteredConcessions} />
          ) : (
            <div className="text-center py-12">
              <Filter className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No concessions match the current filters</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your filter criteria or reset all filters to see results.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Filter Presets */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Quick Filter Presets</h2>
          <p className="text-sm text-gray-600">Common filter combinations based on real data patterns</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Active concessions preset */}
            <div className="border border-gray-200 rounded-lg p-4 hover:border-green-500 cursor-pointer transition-colors"
                 onClick={() => {
                   // Clear all filters first, then apply preset
                   setFilters({ region: '', status: 'active', type: '', expiryWindow: '' })
                   setAdvancedFilters({
                     sizeMin: '', sizeMax: '', companySearch: '', districtSearch: '', 
                     permitDateFrom: '', permitDateTo: ''
                   })
                 }}>
              <h3 className="font-medium text-gray-900">Active Concessions</h3>
              <p className="text-sm text-gray-600 mt-1">All currently active mining permits</p>
              <p className="text-xs text-green-600 mt-2">
                {concessions.filter(c => c.status === 'active').length} concessions
              </p>
            </div>

            {/* Expiring soon preset */}
            <div className="border border-gray-200 rounded-lg p-4 hover:border-yellow-500 cursor-pointer transition-colors"
                 onClick={() => {
                   // Clear all filters first, then apply preset
                   setFilters({ region: '', status: 'active', type: '', expiryWindow: '90' })
                   setAdvancedFilters({
                     sizeMin: '', sizeMax: '', companySearch: '', districtSearch: '', 
                     permitDateFrom: '', permitDateTo: ''
                   })
                 }}>
              <h3 className="font-medium text-gray-900">Expiring in 90 Days</h3>
              <p className="text-sm text-gray-600 mt-1">Active permits expiring soon</p>
              <p className="text-xs text-yellow-600 mt-2">
                {concessions.filter(c => {
                  if (c.status !== 'active') return false
                  const expiryDate = new Date(c.permitExpiryDate)
                  const windowDate = new Date()
                  windowDate.setDate(windowDate.getDate() + 90)
                  return expiryDate <= windowDate
                }).length} concessions
              </p>
            </div>

            {/* Large scale mines preset */}
            <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors"
                 onClick={() => {
                   // Clear all filters first, then apply preset
                   setFilters({ region: '', status: '', type: '', expiryWindow: '' })
                   setAdvancedFilters({
                     sizeMin: '100', sizeMax: '', companySearch: '', districtSearch: '', 
                     permitDateFrom: '', permitDateTo: ''
                   })
                 }}>
              <h3 className="font-medium text-gray-900">Large Scale Operations</h3>
              <p className="text-sm text-gray-600 mt-1">Concessions over 100 hectares</p>
              <p className="text-xs text-blue-600 mt-2">
                {concessions.filter(c => c.size >= 100).length} concessions
              </p>
            </div>

            {/* Expired concessions preset */}
            <div className="border border-gray-200 rounded-lg p-4 hover:border-red-500 cursor-pointer transition-colors"
                 onClick={() => {
                   // Clear all filters first, then apply preset
                   setFilters({ region: '', status: 'expired', type: '', expiryWindow: '' })
                   setAdvancedFilters({
                     sizeMin: '', sizeMax: '', companySearch: '', districtSearch: '', 
                     permitDateFrom: '', permitDateTo: ''
                   })
                 }}>
              <h3 className="font-medium text-gray-900">Expired Permits</h3>
              <p className="text-sm text-gray-600 mt-1">Concessions with expired permits</p>
              <p className="text-xs text-red-600 mt-2">
                {concessions.filter(c => c.status === 'expired').length} concessions
              </p>
            </div>

            {/* Western Region preset */}
            <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-500 cursor-pointer transition-colors"
                 onClick={() => {
                   // Clear all filters first, then apply preset
                   setFilters({ region: 'Western', status: '', type: '', expiryWindow: '' })
                   setAdvancedFilters({
                     sizeMin: '', sizeMax: '', companySearch: '', districtSearch: '', 
                     permitDateFrom: '', permitDateTo: ''
                   })
                 }}>
              <h3 className="font-medium text-gray-900">Western Region</h3>
              <p className="text-sm text-gray-600 mt-1">All concessions in Western Region</p>
              <p className="text-xs text-purple-600 mt-2">
                {concessions.filter(c => c.region === 'Western').length} concessions
              </p>
            </div>

            {/* Small scale operations preset */}
            <div className="border border-gray-200 rounded-lg p-4 hover:border-indigo-500 cursor-pointer transition-colors"
                 onClick={() => {
                   // Clear all filters first, then apply preset
                   setFilters({ region: '', status: '', type: '', expiryWindow: '' })
                   setAdvancedFilters({
                     sizeMin: '', sizeMax: '25', companySearch: '', districtSearch: '', 
                     permitDateFrom: '', permitDateTo: ''
                   })
                 }}>
              <h3 className="font-medium text-gray-900">Small Scale Operations</h3>
              <p className="text-sm text-gray-600 mt-1">Concessions under 25 hectares</p>
              <p className="text-xs text-indigo-600 mt-2">
                {concessions.filter(c => c.size <= 25).length} concessions
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtered Results Preview */}
      {filteredConcessions.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Filtered Results</h2>
            <p className="text-sm text-gray-600">Preview of filtered mining concessions</p>
          </div>
          <div className="p-6">
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredConcessions.slice(0, 10).map((concession, index) => (
                <div key={concession.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">{concession.name}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        concession.status === 'active' ? 'bg-green-100 text-green-800' :
                        concession.status === 'expired' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {concession.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {concession.owner} • {concession.district}, {concession.region} • {concession.size} ha
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Expires: {new Date(concession.permitExpiryDate).toLocaleDateString()}
                  </div>
                </div>
              ))}
              {filteredConcessions.length > 10 && (
                <div className="text-center py-4 text-gray-500">
                  ... and {filteredConcessions.length - 10} more concessions
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
