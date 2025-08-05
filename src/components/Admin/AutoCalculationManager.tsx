import React, { useState } from 'react'
import { Calculator, MapPin, Zap, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'
import { postgresDataService } from '../../services/postgresDataService'

interface AutoCalculationManagerProps {
  onCalculationComplete?: () => void
}

export default function AutoCalculationManager({ onCalculationComplete }: AutoCalculationManagerProps) {
  const [isRecalculating, setIsRecalculating] = useState(false)
  const [results, setResults] = useState<{
    success: boolean
    updated: number
    errors: string[]
  } | null>(null)

  const handleRecalculateAll = async () => {
    setIsRecalculating(true)
    setResults(null)

    try {
      console.log('🔄 Starting automated field recalculation...')
      const result = await postgresDataService.recalculateAllFields()
      setResults(result)
      
      if (result.success && onCalculationComplete) {
        onCalculationComplete()
      }
    } catch (error) {
      console.error('❌ Recalculation failed:', error)
      setResults({
        success: false,
        updated: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      })
    } finally {
      setIsRecalculating(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Calculator className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Automated Field Calculation</h3>
          <p className="text-sm text-gray-600">
            Automatically calculate Size, District, and Region for all concessions
          </p>
        </div>
      </div>

      {/* Feature Description */}
      <div className="mb-6 space-y-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Automated Field Calculation Features
          </h4>
          <div className="space-y-2 text-sm text-blue-800">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 text-blue-600" />
              <div>
                <strong>Size Calculation:</strong> Automatically calculates polygon area in acres using coordinate geometry
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 text-blue-600" />
              <div>
                <strong>District Detection:</strong> Determines district using spatial intersection or coordinate-based lookup
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 text-blue-600" />
              <div>
                <strong>Region Detection:</strong> Identifies region based on Ghana's administrative boundaries
              </div>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <h4 className="font-medium text-green-900 mb-2">When Fields Are Auto-Calculated:</h4>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• When creating new concessions</li>
            <li>• When updating existing concessions with new coordinates</li>
            <li>• During bulk import operations</li>
            <li>• When manually triggered for all records</li>
          </ul>
        </div>
      </div>

      {/* Recalculation Button */}
      <div className="mb-4">
        <button
          onClick={handleRecalculateAll}
          disabled={isRecalculating}
          className={`
            inline-flex items-center px-4 py-2 rounded-md font-medium transition-colors
            ${isRecalculating 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
            }
          `}
        >
          {isRecalculating ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Recalculating...
            </>
          ) : (
            <>
              <Calculator className="h-4 w-4 mr-2" />
              Recalculate All Fields
            </>
          )}
        </button>
        <p className="text-sm text-gray-600 mt-2">
          This will recalculate Size, District, and Region for all existing concessions
        </p>
      </div>

      {/* Results Display */}
      {results && (
        <div className={`rounded-lg p-4 ${results.success ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="flex items-center gap-2 mb-2">
            {results.success ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600" />
            )}
            <h4 className={`font-medium ${results.success ? 'text-green-900' : 'text-red-900'}`}>
              {results.success ? 'Recalculation Completed' : 'Recalculation Failed'}
            </h4>
          </div>
          
          <div className={`text-sm ${results.success ? 'text-green-800' : 'text-red-800'}`}>
            <p>Records updated: {results.updated}</p>
            {results.errors.length > 0 && (
              <div className="mt-2">
                <p className="font-medium">Errors encountered:</p>
                <ul className="list-disc list-inside mt-1">
                  {results.errors.slice(0, 5).map((error, index) => (
                    <li key={index} className="text-xs">{error}</li>
                  ))}
                  {results.errors.length > 5 && (
                    <li className="text-xs">... and {results.errors.length - 5} more errors</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Technical Details */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <details className="group">
          <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
            Technical Implementation Details
          </summary>
          <div className="mt-3 text-sm text-gray-600 space-y-2">
            <p>
              <strong>Area Calculation:</strong> Uses the Shoelace formula to calculate polygon area from coordinates, 
              then converts from square degrees to acres accounting for latitude distortion.
            </p>
            <p>
              <strong>Boundary Detection:</strong> First attempts spatial intersection using PostGIS if available, 
              otherwise falls back to coordinate-based lookup using predefined Ghana administrative boundaries.
            </p>
            <p>
              <strong>Performance:</strong> Calculations are performed during insert/update operations to ensure 
              data consistency and avoid runtime computation overhead.
            </p>
          </div>
        </details>
      </div>
    </div>
  )
}
