import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { concessionEditingService, ConcessionFormData } from '../../services/concessionEditingService'
import { MiningConcession } from '../../types'
import { X, Save, MapPin, Building, Calendar, User, Mail, Phone, AlertCircle, CheckCircle } from 'lucide-react'

interface ConcessionFormProps {
  concession?: MiningConcession // If provided, edit mode. If not, create mode
  onClose: () => void
  onSave: (concession: MiningConcession) => void
}

export default function ConcessionForm({ concession, onClose, onSave }: ConcessionFormProps) {
  const { user, hasPermission } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  const isEditMode = !!concession
  const canEdit = hasPermission('canEditConcessions')

  // Form data state
  const [formData, setFormData] = useState<ConcessionFormData>({
    name: concession?.name || '',
    owner: concession?.owner || '',
    size: concession?.size || 0,
    permitType: concession?.permitType || 'Small Scale',
    permitExpiryDate: concession?.permitExpiryDate || '',
    district: concession?.district || '',
    region: concession?.region || 'Western',
    status: concession?.status || 'Active',
    coordinates: concession?.coordinates || [],
    contactInfo: {
      phone: concession?.contactInfo?.phone || '',
      email: concession?.contactInfo?.email || '',
      address: concession?.contactInfo?.address || ''
    }
  })

  // Available options
  const regions = [
    'Western', 'Central', 'Greater Accra', 'Eastern', 'Volta',
    'Ashanti', 'Brong Ahafo', 'Northern', 'Upper East', 'Upper West'
  ]

  const permitTypes = [
    { value: 'Reconnaissance', label: 'Reconnaissance' },
    { value: 'Prospecting', label: 'Prospecting' },
    { value: 'Mining Lease', label: 'Mining Lease' },
    { value: 'Small Scale', label: 'Small Scale' }
  ]

  const statusOptions = [
    { value: 'Active', label: 'Active', color: 'green' },
    { value: 'Suspended', label: 'Suspended', color: 'orange' },
    { value: 'Expired', label: 'Expired', color: 'red' },
    { value: 'Under Review', label: 'Under Review', color: 'yellow' }
  ]

  // Check permissions
  useEffect(() => {
    if (!canEdit) {
      setError('You do not have permission to edit concessions')
    }
  }, [canEdit])

  // Handle form field changes
  const handleChange = (field: keyof ConcessionFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear error when user starts typing
    if (error) setError(null)
  }

  // Handle contact info changes
  const handleContactChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [field]: value
      }
    }))
  }

  // Add coordinate point
  const addCoordinate = () => {
    const newCoordinate: [number, number] = [0, 0]
    setFormData(prev => ({
      ...prev,
      coordinates: [...prev.coordinates, newCoordinate]
    }))
  }

  // Update coordinate
  const updateCoordinate = (index: number, longitude: number, latitude: number) => {
    setFormData(prev => ({
      ...prev,
      coordinates: prev.coordinates.map((coord, i) => 
        i === index ? [longitude, latitude] : coord
      )
    }))
  }

  // Remove coordinate
  const removeCoordinate = (index: number) => {
    setFormData(prev => ({
      ...prev,
      coordinates: prev.coordinates.filter((_, i) => i !== index)
    }))
  }

  // Validate form
  const validateForm = (): string | null => {
    if (!formData.name.trim()) return 'Concession name is required'
    if (!formData.owner.trim()) return 'Owner name is required'
    if (!formData.size || formData.size <= 0) return 'Size must be greater than 0'
    if (!formData.district.trim()) return 'District is required'
    if (!formData.permitExpiryDate) return 'Permit expiry date is required'

    // Validate expiry date is in the future for active permits
    if (formData.status === 'active') {
      const expiryDate = new Date(formData.permitExpiryDate)
      const today = new Date()
      if (expiryDate <= today) {
        return 'Expiry date must be in the future for active permits'
      }
    }

    return null
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!canEdit) {
      setError('You do not have permission to edit concessions')
      return
    }

    // Validate form
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      let result
      
      if (isEditMode && concession) {
        // Update existing concession
        result = await concessionEditingService.updateConcession(
          concession.id,
          formData,
          user?.id || 'unknown'
        )
      } else {
        // Create new concession
        result = await concessionEditingService.createConcession(
          formData,
          user?.id || 'unknown'
        )
      }

      if (result.success && result.concession) {
        setSuccess(isEditMode ? 'Concession updated successfully!' : 'Concession created successfully!')
        onSave(result.concession)
        setTimeout(() => {
          onClose()
        }, 1500)
      } else {
        setError(result.error || 'Failed to save concession')
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (!canEdit) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
          <div className="flex items-center gap-3 text-red-600 mb-4">
            <AlertCircle className="w-6 h-6" />
            <h2 className="text-lg font-semibold">Access Denied</h2>
          </div>
          <p className="text-gray-600 mb-6">
            You do not have permission to edit mining concessions. Contact your administrator for access.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditMode ? 'Edit Mining Concession' : 'Create New Mining Concession'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Success/Error Messages */}
        {error && (
          <div className="mx-6 mt-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-red-800 text-sm">{error}</span>
          </div>
        )}

        {success && (
          <div className="mx-6 mt-4 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-green-800 text-sm">{success}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building className="w-4 h-4 inline mr-1" />
                Concession Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter concession name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Owner/Company *
              </label>
              <input
                type="text"
                value={formData.owner}
                onChange={(e) => handleChange('owner', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter owner or company name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Size (acres) *
              </label>
              <input
                type="number"
                value={formData.size}
                onChange={(e) => handleChange('size', Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter size in acres"
                min="0"
                step="0.1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Permit Type *
              </label>
              <select
                value={formData.permitType}
                onChange={(e) => handleChange('permitType', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {permitTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Permit Expiry Date *
              </label>
              <input
                type="date"
                value={formData.permitExpiryDate}
                onChange={(e) => handleChange('permitExpiryDate', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {statusOptions.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Location Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Region *
              </label>
              <select
                value={formData.region}
                onChange={(e) => handleChange('region', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                District *
              </label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => handleChange('district', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter district name"
                required
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.contactInfo?.phone || ''}
                  onChange={(e) => handleContactChange('phone', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+233-XX-XXX-XXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email
                </label>
                <input
                  type="email"
                  value={formData.contactInfo?.email || ''}
                  onChange={(e) => handleContactChange('email', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="contact@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.contactInfo?.address || ''}
                  onChange={(e) => handleContactChange('address', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Physical address"
                />
              </div>
            </div>
          </div>

          {/* Coordinates Section */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Boundary Coordinates</h3>
              <button
                type="button"
                onClick={addCoordinate}
                className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition-colors"
              >
                Add Point
              </button>
            </div>
            
            {formData.coordinates.length === 0 ? (
              <p className="text-gray-500 text-sm">No coordinates defined. Default coordinates will be generated based on region.</p>
            ) : (
              <div className="space-y-2">
                {formData.coordinates.map((coord, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 w-8">#{index + 1}</span>
                    <input
                      type="number"
                      value={coord[0]}
                      onChange={(e) => updateCoordinate(index, Number(e.target.value), coord[1])}
                      className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                      placeholder="Longitude"
                      step="0.000001"
                    />
                    <input
                      type="number"
                      value={coord[1]}
                      onChange={(e) => updateCoordinate(index, coord[0], Number(e.target.value))}
                      className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                      placeholder="Latitude"
                      step="0.000001"
                    />
                    <button
                      type="button"
                      onClick={() => removeCoordinate(index)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="w-4 h-4" />
              )}
              {loading ? 'Saving...' : (isEditMode ? 'Update Concession' : 'Create Concession')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
