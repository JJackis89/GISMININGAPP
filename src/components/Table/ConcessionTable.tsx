import { useState } from 'react'
import { MiningConcession, User } from '../../types'
import { 
  ChevronUp, 
  ChevronDown, 
  Eye, 
  MapPin,
  Calendar,
  Users,
  AlertTriangle
} from 'lucide-react'
import { PrintButton } from '../Print'
import { useAuth } from '../../contexts/AuthContext'

interface ConcessionTableProps {
  concessions: MiningConcession[]
}

export default function ConcessionTable({ concessions }: ConcessionTableProps) {
  const [sortField, setSortField] = useState<keyof MiningConcession>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [selectedConcession, setSelectedConcession] = useState<MiningConcession | null>(null)
  const { user } = useAuth()

  const handleSort = (field: keyof MiningConcession) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedConcessions = [...concessions].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]
    
    if (aValue == null || bValue == null) return 0
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-epa-green-100 text-epa-green-800'
      case 'expired': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-epa-orange-100 text-epa-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    return type === 'large-scale' ? 'bg-epa-blue-100 text-epa-blue-800' : 'bg-purple-100 text-purple-800'
  }

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate)
    const now = new Date()
    const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    return expiry <= thirtyDays && expiry >= now
  }

  const SortButton = ({ field, children }: { field: keyof MiningConcession, children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center space-x-1 text-left font-medium text-gray-900 hover:text-gray-700"
    >
      <span>{children}</span>
      {sortField === field && (
        sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
      )}
    </button>
  )

  return (
    <>
      {/* Table Header with Batch Actions */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <h3 className="text-lg font-medium text-gray-900">
            Mining Concessions ({concessions.length})
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          {concessions.length > 0 && (
            <PrintButton 
              concessions={concessions} 
              variant="batch" 
              size="md"
              user={user}
            />
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="name">Name</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="id">ID</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="size">Size (ha)</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="owner">Owner</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="permitType">Type</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="permitExpiryDate">Expiry Date</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="region">Region</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="status">Status</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedConcessions.map((concession) => (
              <tr key={concession.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <div className="text-sm font-medium text-gray-900">{concession.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {concession.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {concession.size.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-gray-400 mr-2" />
                    <div className="text-sm text-gray-900">{concession.owner}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(concession.permitType)}`}>
                    {concession.permitType.replace('-', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <div className="text-sm text-gray-900">
                      {new Date(concession.permitExpiryDate).toLocaleDateString()}
                    </div>
                    {isExpiringSoon(concession.permitExpiryDate) && concession.status === 'active' && (
                      <AlertTriangle className="h-4 w-4 text-epa-orange-500 ml-2" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {concession.region}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(concession.status)}`}>
                    {concession.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedConcession(concession)}
                      className="text-epa-orange-600 hover:text-epa-orange-900 flex items-center"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </button>
                    <PrintButton 
                      concession={concession} 
                      variant="single" 
                      size="sm" 
                      className="ml-2"
                      user={user}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Concession Details Modal */}
      {selectedConcession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{selectedConcession.name}</h3>
                <div className="flex items-center space-x-2">
                  <PrintButton 
                    concession={selectedConcession} 
                    variant="single" 
                    size="sm"
                    user={user}
                  />
                  <button
                    onClick={() => setSelectedConcession(null)}
                    className="text-gray-400 hover:text-epa-orange-600 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-700">ID:</p>
                  <p className="text-gray-900">{selectedConcession.id}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Size:</p>
                  <p className="text-gray-900">{selectedConcession.size} hectares</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Owner:</p>
                  <p className="text-gray-900">{selectedConcession.owner}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Permit Type:</p>
                  <p className="text-gray-900 capitalize">{selectedConcession.permitType.replace('-', ' ')}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Expiry Date:</p>
                  <p className="text-gray-900">{new Date(selectedConcession.permitExpiryDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Status:</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedConcession.status)}`}>
                    {selectedConcession.status}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-700">District:</p>
                  <p className="text-gray-900">{selectedConcession.district}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Region:</p>
                  <p className="text-gray-900">{selectedConcession.region}</p>
                </div>
                
                {selectedConcession.contactInfo && (
                  <div className="col-span-2 mt-4">
                    <p className="font-medium text-gray-700 mb-2">Contact Information:</p>
                    <div className="bg-gray-50 p-3 rounded">
                      {selectedConcession.contactInfo.phone && (
                        <p className="text-sm"><span className="font-medium">Phone:</span> {selectedConcession.contactInfo.phone}</p>
                      )}
                      {selectedConcession.contactInfo.email && (
                        <p className="text-sm"><span className="font-medium">Email:</span> {selectedConcession.contactInfo.email}</p>
                      )}
                      {selectedConcession.contactInfo.address && (
                        <p className="text-sm"><span className="font-medium">Address:</span> {selectedConcession.contactInfo.address}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
