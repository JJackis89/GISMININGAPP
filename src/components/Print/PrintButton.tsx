/**
 * Print Button Component for EPA MINING DATABASE
 * Provides printing functionality with options dialog for mining concession data
 */

import React, { useState } from 'react'
import { Printer, Download, Settings, X, FileText, Map } from 'lucide-react'
import { MiningConcession, User } from '../../types'
import { printService, PrintOptions } from '../../services/printService'

interface PrintButtonProps {
  concession?: MiningConcession
  concessions?: MiningConcession[]
  variant?: 'single' | 'batch'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  user?: User | null
}

export const PrintButton: React.FC<PrintButtonProps> = ({
  concession,
  concessions = [],
  variant = 'single',
  size = 'md',
  className = '',
  user
}) => {
  const [showOptions, setShowOptions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [printOptions, setPrintOptions] = useState<Partial<PrintOptions>>({
    includeMap: true,
    mapSize: 'medium',
    paperSize: 'A4',
    orientation: 'portrait',
    includeLogo: true,
    includeWatermark: true,
    showCoordinates: true,
    showDetails: true
  })

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  }

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20
  }

  const handlePrint = async (exportType: 'print' | 'pdf' = 'print') => {
    if (!concession && (!concessions || concessions.length === 0)) {
      setError('No concession data available for printing')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      if (variant === 'single' && concession) {
        if (exportType === 'pdf') {
          await printService.exportToPDF(concession, printOptions, user)
        } else {
          await printService.printConcession(concession, printOptions, user)
        }
      } else if (variant === 'batch' && concessions.length > 0) {
        if (exportType === 'pdf') {
          // For batch PDF, we'll export each individually
          for (const item of concessions) {
            await printService.exportToPDF(item, printOptions, user)
          }
        } else {
          await printService.printBatch(concessions, printOptions, user)
        }
      }
      
      setShowOptions(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to print/export')
    } finally {
      setIsLoading(false)
    }
  }

  const updateOption = <K extends keyof PrintOptions>(
    key: K,
    value: PrintOptions[K]
  ) => {
    setPrintOptions((prev: Partial<PrintOptions>) => ({ ...prev, [key]: value }))
  }

  if (!concession && (!concessions || concessions.length === 0)) {
    return null
  }

  return (
    <>
      {/* Main Print Button */}
      <button
        onClick={() => setShowOptions(true)}
        disabled={isLoading}
        className={`
          inline-flex items-center gap-2 font-medium text-white bg-orange-600 
          hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed
          border border-orange-600 rounded-lg transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2
          ${sizeClasses[size]} ${className}
        `}
        title={variant === 'single' ? 'Print Concession' : `Print ${concessions.length} Concessions`}
      >
        <Printer size={iconSizes[size]} />
        {isLoading ? 'Processing...' : variant === 'single' ? 'Print' : `Print (${concessions.length})`}
      </button>

      {/* Print Options Modal */}
      {showOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Settings size={20} className="text-orange-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Print Options
                </h3>
              </div>
              <button
                onClick={() => setShowOptions(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Document Settings */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Document Settings</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Paper Size
                    </label>
                    <select
                      value={printOptions.paperSize || 'A4'}
                      onChange={(e) => updateOption('paperSize', e.target.value as 'A4' | 'A3' | 'Letter')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="A4">A4</option>
                      <option value="A3">A3</option>
                      <option value="Letter">Letter</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Orientation
                    </label>
                    <select
                      value={printOptions.orientation || 'portrait'}
                      onChange={(e) => updateOption('orientation', e.target.value as 'portrait' | 'landscape')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="portrait">Portrait</option>
                      <option value="landscape">Landscape</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Map Settings */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Map Options</h4>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="includeMap"
                    checked={printOptions.includeMap || false}
                    onChange={(e) => updateOption('includeMap', e.target.checked)}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="includeMap" className="ml-2 text-sm text-gray-700">
                    Include map visualization
                  </label>
                </div>

                {printOptions.includeMap && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Map Size
                    </label>
                    <select
                      value={printOptions.mapSize || 'medium'}
                      onChange={(e) => updateOption('mapSize', e.target.value as 'small' | 'medium' | 'large')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="small">Small (200px)</option>
                      <option value="medium">Medium (300px)</option>
                      <option value="large">Large (400px)</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Content Options */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Content Options</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="includeLogo"
                      checked={printOptions.includeLogo !== false}
                      onChange={(e) => updateOption('includeLogo', e.target.checked)}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor="includeLogo" className="ml-2 text-sm text-gray-700">
                      Include EPA logo
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="includeWatermark"
                      checked={printOptions.includeWatermark !== false}
                      onChange={(e) => updateOption('includeWatermark', e.target.checked)}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor="includeWatermark" className="ml-2 text-sm text-gray-700">
                      Include watermark
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="showCoordinates"
                      checked={printOptions.showCoordinates !== false}
                      onChange={(e) => updateOption('showCoordinates', e.target.checked)}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor="showCoordinates" className="ml-2 text-sm text-gray-700">
                      Show coordinate table
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="showDetails"
                      checked={printOptions.showDetails !== false}
                      onChange={(e) => updateOption('showDetails', e.target.checked)}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor="showDetails" className="ml-2 text-sm text-gray-700">
                      Show detailed information
                    </label>
                  </div>
                </div>
              </div>

              {variant === 'batch' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Batch Print:</strong> {concessions.length} concession(s) will be processed.
                    Each will open in a separate print dialog.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              <button
                onClick={() => setShowOptions(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                Cancel
              </button>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handlePrint('print')}
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-400"
                >
                  <Printer size={16} />
                  {isLoading ? 'Printing...' : 'Print'}
                </button>
                
                <button
                  onClick={() => handlePrint('pdf')}
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-orange-700 bg-orange-100 border border-orange-300 rounded-md hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-200"
                >
                  <Download size={16} />
                  {isLoading ? 'Exporting...' : 'Export PDF'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default PrintButton
