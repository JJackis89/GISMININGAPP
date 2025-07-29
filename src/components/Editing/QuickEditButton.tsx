import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { MiningConcession } from '../../types'
import ConcessionDetailsModal from './ConcessionDetailsModal'
import ConcessionForm from './ConcessionForm'
import { Edit3, Plus, Eye } from 'lucide-react'

interface QuickEditButtonProps {
  concession?: MiningConcession
  mode?: 'edit' | 'view' | 'create'
  onUpdate?: () => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function QuickEditButton({ 
  concession, 
  mode = 'edit',
  onUpdate,
  className = '',
  size = 'md'
}: QuickEditButtonProps) {
  const { hasPermission } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const canEdit = hasPermission('canEditConcessions')
  const canView = true // All authenticated users can view concessions

  // Don't show button if user doesn't have appropriate permissions
  if ((mode === 'edit' || mode === 'create') && !canEdit) return null
  if (mode === 'view' && !canView) return null

  const handleClick = () => {
    if (mode === 'create') {
      setShowForm(true)
    } else if (mode === 'view') {
      setShowModal(true)
    } else {
      setShowForm(true)
    }
  }

  const handleFormSave = (updatedConcession: MiningConcession) => {
    setShowForm(false)
    onUpdate?.()
  }

  const handleModalClose = () => {
    setShowModal(false)
  }

  const getIcon = () => {
    switch (mode) {
      case 'create':
        return <Plus className={`${getSizeClass()} flex-shrink-0`} />
      case 'view':
        return <Eye className={`${getSizeClass()} flex-shrink-0`} />
      case 'edit':
      default:
        return <Edit3 className={`${getSizeClass()} flex-shrink-0`} />
    }
  }

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'w-3 h-3'
      case 'lg':
        return 'w-5 h-5'
      case 'md':
      default:
        return 'w-4 h-4'
    }
  }

  const getButtonClass = () => {
    const baseClass = 'inline-flex items-center gap-1 transition-colors rounded'
    const sizeClass = size === 'sm' ? 'px-2 py-1 text-xs' : size === 'lg' ? 'px-4 py-2 text-base' : 'px-3 py-1.5 text-sm'
    
    switch (mode) {
      case 'create':
        return `${baseClass} ${sizeClass} bg-green-600 text-white hover:bg-green-700 ${className}`
      case 'view':
        return `${baseClass} ${sizeClass} bg-gray-100 text-gray-700 hover:bg-gray-200 ${className}`
      case 'edit':
      default:
        return `${baseClass} ${sizeClass} bg-blue-600 text-white hover:bg-blue-700 ${className}`
    }
  }

  const getButtonText = () => {
    switch (mode) {
      case 'create':
        return 'Create'
      case 'view':
        return 'View'
      case 'edit':
      default:
        return 'Edit'
    }
  }

  return (
    <>
      <button
        onClick={handleClick}
        className={getButtonClass()}
        title={`${getButtonText()} ${concession ? concession.name : 'concession'}`}
      >
        {getIcon()}
        <span className="font-medium">{getButtonText()}</span>
      </button>

      {/* Details Modal for view mode */}
      {showModal && concession && (
        <ConcessionDetailsModal
          concession={concession}
          isOpen={showModal}
          onClose={handleModalClose}
          onUpdate={onUpdate}
        />
      )}

      {/* Edit/Create Form */}
      {showForm && (
        <ConcessionForm
          concession={mode === 'create' ? undefined : concession}
          onClose={() => setShowForm(false)}
          onSave={handleFormSave}
        />
      )}
    </>
  )
}

// Export variants for convenience
export const ViewButton = (props: Omit<QuickEditButtonProps, 'mode'>) => (
  <QuickEditButton {...props} mode="view" />
)

export const EditButton = (props: Omit<QuickEditButtonProps, 'mode'>) => (
  <QuickEditButton {...props} mode="edit" />
)

export const CreateButton = (props: Omit<QuickEditButtonProps, 'mode'>) => (
  <QuickEditButton {...props} mode="create" />
)
