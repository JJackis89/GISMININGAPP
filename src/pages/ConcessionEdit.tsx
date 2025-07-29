import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { miningDataService } from '../services/miningDataService'
import { MiningConcession } from '../types'
import { 
  Search, 
  Eye,
  AlertTriangle,
  RotateCcw
} from 'lucide-react'

export default function ConcessionEdit() {
  const { user, hasPermission } = useAuth()
  const [concessions, setConcessions] = useState<MiningConcession[]>([])
  const [filteredConcessions, setFilteredConcessions] = useState<MiningConcession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const canView = hasPermission('canViewMap') || hasPermission('canEditConcessions')

  // Load concessions data
  useEffect(() => {
    loadConcessions()
  }, [])

  // Filter concessions based on search and status
  useEffect(() => {
    let filtered = concessions

    if (searchTerm) {
      filtered = filtered.filter(concession =>
        concession.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        concession.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
        concession.region.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(concession => concession.status === statusFilter)
    }

    setFilteredConcessions(filtered)
  }, [concessions, searchTerm, statusFilter])

  const loadConcessions = async (forceRefresh: boolean = false) => {
    try {
      setLoading(true)
      setError(null)
      
      if (forceRefresh) {
        console.log('🔄 Force refresh: clearing all caches...')
        miningDataService.clearCache()
      }
      
      console.log('🔄 Loading hosted layer data...')
      await miningDataService.initialize()
      
      console.log('🔄 Fetching concessions from hosted layer...')
      const hostedLayerData = await miningDataService.getMiningConcessions(forceRefresh)
      
      console.log(`✅ Loaded ${hostedLayerData.length} concessions from hosted layer`)
      setConcessions(hostedLayerData)
      
    } catch (err: any) {
      console.error('❌ Failed to load concessions:', err)
      setError(err.message)
      setConcessions([])
    } finally {
      setLoading(false)
    }
  }

  if (!canView) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-yellow-800 mb-2">Access Restricted</h2>
          <p className="text-yellow-700">
            You do not have permission to view mining concessions. Contact your administrator for access.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mining Concessions Data</h1>
          <p className="text-gray-600 mt-1">View hosted layer data</p>
        </div>
        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <button
            onClick={() => loadConcessions(true)}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
            title="Refresh data from hosted layer"
          >
            <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-red-800 font-medium">Error Loading Data</h3>
          <p className="text-red-700 mt-1">{error}</p>
        </div>
      )}

      {/* Search and Filter Controls */}
      {!loading && concessions.length > 0 && (
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by name, owner, or region..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-flex items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading hosted layer data...</span>
          </div>
        </div>
      )}

      {/* Concessions Table */}
      {!loading && filteredConcessions.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Concessions ({filteredConcessions.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Region
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Permit Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredConcessions.map((concession) => (
                  <tr key={concession.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{concession.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{concession.owner}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{concession.region}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        concession.status === 'active' ? 'bg-green-100 text-green-800' :
                        concession.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        concession.status === 'expired' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {concession.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{concession.permitType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No Data State */}
      {!loading && !error && filteredConcessions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {concessions.length === 0 
              ? 'No concessions found. Try refreshing the data.' 
              : 'No concessions match your search criteria.'}
          </p>
        </div>
      )}
    </div>
  )
}
