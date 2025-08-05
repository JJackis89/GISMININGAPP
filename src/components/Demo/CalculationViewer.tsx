import React, { useState } from 'react'
import { Eye, Database, Calculator, BarChart3 } from 'lucide-react'

interface CalculationViewerProps {
  onToggleView?: (showCalculations: boolean) => void
}

export default function CalculationViewer({ onToggleView }: CalculationViewerProps) {
  const [showCalculations, setShowCalculations] = useState(false)

  const handleToggle = () => {
    const newState = !showCalculations
    setShowCalculations(newState)
    if (onToggleView) {
      onToggleView(newState)
    }
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Calculator className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Automated Field Calculation System</h3>
            <p className="text-sm text-gray-600">
              Live demonstration of Size, District, and Region auto-calculation
            </p>
          </div>
        </div>
        
        <button
          onClick={handleToggle}
          className={`
            inline-flex items-center px-4 py-2 rounded-md font-medium transition-all duration-200
            ${showCalculations 
              ? 'bg-green-600 text-white shadow-md' 
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }
          `}
        >
          <Eye className="h-4 w-4 mr-2" />
          {showCalculations ? 'Hide Calculations' : 'Show Live Calculations'}
        </button>
      </div>

      {showCalculations && (
        <div className="mt-4 pt-4 border-t border-blue-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2 text-blue-700">
              <BarChart3 className="h-4 w-4" />
              <span>Real-time area calculation using Shoelace formula</span>
            </div>
            <div className="flex items-center gap-2 text-purple-700">
              <Database className="h-4 w-4" />
              <span>Automated district/region detection</span>
            </div>
            <div className="flex items-center gap-2 text-green-700">
              <Calculator className="h-4 w-4" />
              <span>PostgreSQL integration with auto-population</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
