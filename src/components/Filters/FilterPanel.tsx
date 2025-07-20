interface FilterPanelProps {
  filters: {
    region: string
    status: string
    type: string
    expiryWindow: string
  }
  onFiltersChange: (filters: any) => void
}

const regions = ['Western', 'Ashanti', 'Northern', 'Eastern', 'Volta', 'Central', 'Upper East', 'Greater Accra']
const statuses = ['active', 'expired', 'pending']
const types = ['small-scale', 'large-scale']
const expiryWindows = [
  { label: 'Next 30 days', value: '30' },
  { label: 'Next 60 days', value: '60' },
  { label: 'Next 90 days', value: '90' },
  { label: 'Next 6 months', value: '180' },
  { label: 'Next year', value: '365' }
]

export default function FilterPanel({ filters, onFiltersChange }: FilterPanelProps) {
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
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-epa-orange-600 hover:text-epa-orange-700 font-medium"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
          <select
            value={filters.region}
            onChange={(e) => handleFilterChange('region', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Regions</option>
            {regions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Statuses</option>
            {statuses.map(status => (
              <option key={status} value={status} className="capitalize">{status}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Permit Type</label>
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Types</option>
            {types.map(type => (
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
