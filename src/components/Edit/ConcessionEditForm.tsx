import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { MiningConcession } from '../../types'
import { X, Save, Plus, MapPin, Calendar, Building, FileText, AlertCircle, CheckCircle } from 'lucide-react'

interface ConcessionEditFormProps {
  concession?: MiningConcession | null
  onSave: (concession: MiningConcession) => void
  onCancel: () => void
  isOpen: boolean
}

export default function ConcessionEditForm({ concession, onSave, onCancel, isOpen }: ConcessionEditFormProps) {
  const { user, hasPermission } = useAuth()
  const [formData, setFormData] = useState<Partial<MiningConcession>>({
    id: '',
    name: '',
    size: 0,
    owner: '',
    permitType: 'Small Scale',
    permitExpiryDate: '',
    district: '',
    region: '',
    status: 'active',
    coordinates: [],
    contactInfo: {
      phone: '',
      email: '',
      address: ''
    }
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)

  // Ghana regions for dropdown
  const ghanaRegions = [
    'Ashanti', 'Brong-Ahafo', 'Central', 'Eastern', 'Greater Accra',
    'Northern', 'Upper East', 'Upper West', 'Volta', 'Western'
  ]

  // Reset form when concession changes
  useEffect(() => {
    if (concession) {
      setFormData({
        ...concession,
        contactInfo: concession.contactInfo || { phone: '', email: '', address: '' }
      })
    } else {
      // Reset for new concession
      setFormData({
        id: `MC${Date.now().toString().slice(-6)}`,
        name: '',
        size: 0,
        owner: '',
        permitType: 'Small Scale',
        permitExpiryDate: '',
        district: '',
        region: '',
        status: 'active',
        coordinates: [],
        contactInfo: {
          phone: '',
          email: '',
          address: ''
        }
      })
    }
    setErrors({})
    setSuccess(null)
  }, [concession, isOpen])

  // Check permissions
  const canEdit = hasPermission('canEditConcessions')
  const isAdmin = user?.role === 'admin'
  const isManager = user?.role === 'manager'
  const isStaff = user?.role === 'staff'

  if (!canEdit) {
    return (
      <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${isOpen ? '' : 'hidden'}`}>
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex items-center gap-3 text-red-600 mb-4">
            <AlertCircle className="w-6 h-6" />
            <h3 className="text-lg font-semibold">Access Denied</h3>
          </div>
          <p className="text-gray-600 mb-4">
            You don't have permission to edit mining concessions. Contact your administrator for access.
          </p>
          <button
            onClick={onCancel}
            className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name?.trim()) {
      newErrors.name = 'Concession name is required'
    }

    if (!formData.owner?.trim()) {
      newErrors.owner = 'Contact person name is required'
    }

    if (!formData.size || formData.size <= 0) {
      newErrors.size = 'Size must be greater than 0'
    }

    if (!formData.district?.trim()) {
      newErrors.district = 'District is required'
    }

    if (!formData.region) {
      newErrors.region = 'Region is required'
    }

    if (!formData.permitExpiryDate) {
      newErrors.permitExpiryDate = 'Permit expiry date is required'
    } else {
      const expiryDate = new Date(formData.permitExpiryDate)
      const today = new Date()
      if (expiryDate < today) {
        newErrors.permitExpiryDate = 'Expiry date cannot be in the past'
      }
    }

    // Validate email format if provided
    if (formData.contactInfo?.email && formData.contactInfo.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.contactInfo.email)) {
        newErrors.email = 'Invalid email format'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setSuccess(null)

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Generate default coordinates if none exist (center of Ghana)
      const defaultCoordinates: [number, number][] = formData.coordinates?.length ? formData.coordinates : [
        [-1.0, 7.0], [-0.9, 7.0], [-0.9, 7.1], [-1.0, 7.1]
      ]

      const concessionData: MiningConcession = {
        id: formData.id || `MC${Date.now().toString().slice(-6)}`,
        name: formData.name!.trim(),
        size: Number(formData.size),
        owner: formData.owner!.trim(),
        permitType: formData.permitType || 'Small Scale',
        permitExpiryDate: formData.permitExpiryDate!,
        district: formData.district!.trim(),
        region: formData.region!,
        status: formData.status || 'Active',
        coordinates: defaultCoordinates,
        contactInfo: {
          phone: formData.contactInfo?.phone?.trim() || '',
          email: formData.contactInfo?.email?.trim() || '',
          address: formData.contactInfo?.address?.trim() || ''
        }
      }

      onSave(concessionData)
      setSuccess(concession ? 'Concession updated successfully!' : 'Concession created successfully!')
      
      // Close form after brief delay
      setTimeout(() => {
        onCancel()
      }, 1500)

    } catch (error) {
      setErrors({ general: 'Failed to save concession. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    if (field.startsWith('contactInfo.')) {
      const contactField = field.split('.')[1]
      setFormData(prev => ({
        ...prev,
        contactInfo: {
          ...prev.contactInfo,
          [contactField]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {concession ? (
              <>
                <FileText className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold">Edit Mining Concession</h2>
              </>
            ) : (
              <>
                <Plus className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-semibold">Create New Mining Concession</h2>
              </>
            )}
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Success Message */}
        {success && (
          <div className="p-4 bg-green-50 border-l-4 border-green-400 mx-6 mt-4 rounded">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-green-800 font-medium">{success}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errors.general && (
          <div className="p-4 bg-red-50 border-l-4 border-red-400 mx-6 mt-4 rounded">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800 font-medium">{errors.general}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Building className="w-5 h-5" />
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Concession ID *
                </label>
                <input
                  type="text"
                  value={formData.id}
                  onChange={(e) => handleInputChange('id', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.id ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={!!concession} // Don't allow ID changes for existing concessions
                  placeholder="MC001234"
                />
                {errors.id && <p className="text-red-500 text-sm mt-1">{errors.id}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Concession Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Golden Hills Mining"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Owner/Company *
                </label>
                <input
                  type="text"
                  value={formData.owner}
                  onChange={(e) => handleInputChange('owner', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.owner ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ghana Gold Corporation"
                />
                {errors.owner && <p className="text-red-500 text-sm mt-1">{errors.owner}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Size (acres) *
                </label>
                <input
                  type="number"
                  value={formData.size || ''}
                  onChange={(e) => handleInputChange('size', parseFloat(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.size ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="250.5"
                  min="0"
                  step="0.1"
                />
                {errors.size && <p className="text-red-500 text-sm mt-1">{errors.size}</p>}
              </div>
            </div>
          </div>

          {/* Permit Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Permit Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Permit Type *
                </label>
                <select
                  value={formData.permitType}
                  onChange={(e) => handleInputChange('permitType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Small Scale">Small Scale</option>
                  <option value="Reconnaissance">Reconnaissance</option>
                  <option value="Prospecting">Prospecting</option>
                  <option value="Mining Lease">Mining Lease</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={!isAdmin && !isManager} // Only admin/manager can change status
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="expired">Expired</option>
                </select>
                {(!isAdmin && !isManager) && (
                  <p className="text-gray-500 text-xs mt-1">Only managers and admins can change status</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Permit Expiry Date *
                </label>
                <input
                  type="date"
                  value={formData.permitExpiryDate}
                  onChange={(e) => handleInputChange('permitExpiryDate', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.permitExpiryDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.permitExpiryDate && <p className="text-red-500 text-sm mt-1">{errors.permitExpiryDate}</p>}
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Location Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Region *
                </label>
                <select
                  value={formData.region}
                  onChange={(e) => handleInputChange('region', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.region ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Region</option>
                  {ghanaRegions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
                {errors.region && <p className="text-red-500 text-sm mt-1">{errors.region}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  District *
                </label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => handleInputChange('district', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.district ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Tarkwa"
                />
                {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district}</p>}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.contactInfo?.phone || ''}
                  onChange={(e) => handleInputChange('contactInfo.phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+233-XX-XXX-XXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.contactInfo?.email || ''}
                  onChange={(e) => handleInputChange('contactInfo.email', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="contact@company.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  value={formData.contactInfo?.address || ''}
                  onChange={(e) => handleInputChange('contactInfo.address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="P.O. Box 123, Accra, Ghana"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {concession ? 'Update Concession' : 'Create Concession'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
