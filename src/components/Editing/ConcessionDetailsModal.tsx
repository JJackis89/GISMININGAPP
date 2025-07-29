import React, { useState, useEffect } from 'react'
import { MiningConcession } from '../../types'
import { concessionEditingService } from '../../services/concessionEditingService'
import { useAuth } from '../../contexts/AuthContext'
import ConcessionForm from './ConcessionForm'
import { 
  Edit3, 
  Trash2, 
  MapPin, 
  Calendar, 
  Building, 
  User, 
  Phone, 
  Mail, 
  X,
  Save,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle
} from 'lucide-react'

interface ConcessionDetailsModalProps {
  concession: MiningConcession | null
  isOpen: boolean
  onClose: () => void
  onEdit?: (concession: MiningConcession) => void
  onDelete?: (id: string) => void
  onUpdate?: () => void
}

export default function ConcessionDetailsModal({ 
  concession, 
  isOpen, 
  onClose, 
  onEdit, 
  onDelete,
  onUpdate 
}: ConcessionDetailsModalProps) {
  const { user, hasPermission } = useAuth()
  const [showEditForm, setShowEditForm] = useState(false)
  const [loading, setLoading] = useState(false)

  const canEdit = hasPermission('canEditConcessions')
  const canDelete = hasPermission('canDeleteConcessions')

  if (!isOpen || !concession) return null

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />
      case 'expired':
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const handleEdit = () => {
    if (onEdit) {
      onEdit(concession)
    } else {
      setShowEditForm(true)
    }
  }

  const handleDelete = async () => {
    if (!canDelete || !concession) return

    const confirmed = window.confirm(
      `Are you sure you want to delete "${concession.name}"? This action cannot be undone.`
    )

    if (confirmed) {
      setLoading(true)
      try {
        const result = await concessionEditingService.deleteConcession(
          concession.id, 
          user?.id || 'unknown'
        )
        if (result.success) {
          onUpdate?.()
          onClose()
          if (onDelete) {
            onDelete(concession.id)
          }
        }
      } catch (error) {
        console.error('Failed to delete concession:', error)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleFormSave = (updatedConcession: MiningConcession) => {
    setShowEditForm(false)
    onUpdate?.()
  }

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return dateStr
    }
  }

  const isExpiringSoon = () => {
    if (concession.status !== 'active') return false
    const expiryDate = new Date(concession.permitExpiryDate)
    const today = new Date()
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 90 && daysUntilExpiry > 0
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Building className="w-6 h-6 text-blue-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{concession.name}</h2>
                <p className="text-sm text-gray-600">{concession.permitType} mining concession</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Status Alert */}
          {isExpiringSoon() && (
            <div className="mx-6 mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <span className="text-yellow-800 text-sm">
                Permit expires within 90 days
              </span>
            </div>
          )}

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Status and Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(concession.status)}`}>
                  {getStatusIcon(concession.status)}
                  {concession.status.charAt(0).toUpperCase() + concession.status.slice(1)}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Size</label>
                <p className="text-lg font-semibold text-gray-900">{concession.size} acres</p>
              </div>
            </div>

            {/* Owner and Company */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                <User className="w-4 h-4 inline mr-1" />
                Contact Person
              </label>
              <p className="text-lg text-gray-900">{concession.owner}</p>
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Region
                </label>
                <p className="text-gray-900">{concession.region}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">District</label>
                <p className="text-gray-900">{concession.district}</p>
              </div>
            </div>

            {/* Permit Information */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                <Calendar className="w-4 h-4 inline mr-1" />
                Permit Expiry Date
              </label>
              <p className="text-gray-900">{formatDate(concession.permitExpiryDate)}</p>
            </div>

            {/* Contact Information */}
            {concession.contactInfo && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {concession.contactInfo.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{concession.contactInfo.phone}</span>
                    </div>
                  )}
                  {concession.contactInfo.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{concession.contactInfo.email}</span>
                    </div>
                  )}
                </div>
                {concession.contactInfo.address && (
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-500 mb-1">Address</label>
                    <p className="text-gray-900">{concession.contactInfo.address}</p>
                  </div>
                )}
              </div>
            )}

            {/* Coordinates */}
            {concession.coordinates && concession.coordinates.length > 0 && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Boundary Coordinates</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-2">
                    {concession.coordinates.length} coordinate points
                  </div>
                  <div className="max-h-32 overflow-y-auto">
                    {concession.coordinates.slice(0, 5).map((coord, index) => (
                      <div key={index} className="text-sm text-gray-800 font-mono">
                        Point {index + 1}: {coord[0].toFixed(6)}, {coord[1].toFixed(6)}
                      </div>
                    ))}
                    {concession.coordinates.length > 5 && (
                      <div className="text-sm text-gray-500 mt-1">
                        ... and {concession.coordinates.length - 5} more points
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          {(canEdit || canDelete) && (
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              {canDelete && (
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              )}
              {canEdit && (
                <button
                  onClick={handleEdit}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit Form Modal */}
      {showEditForm && (
        <ConcessionForm
          concession={concession}
          onClose={() => setShowEditForm(false)}
          onSave={handleFormSave}
        />
      )}
    </>
  )
}
