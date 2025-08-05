import React, { useState } from 'react'
import { Plus, MapPin, Calculator } from 'lucide-react'
import { MiningConcession } from '../../types'
import { postgresDataService } from '../../services/postgresDataService'

export default function AutoCalculationDemo() {
  const [isCreating, setIsCreating] = useState(false)
  const [result, setResult] = useState<MiningConcession | null>(null)

  // Sample coordinates for a mining concession in Ghana's Western Region
  const sampleCoordinates: [number, number][] = [
    [-2.5, 5.8], // Southwest corner
    [-2.4, 5.8], // Southeast corner  
    [-2.4, 5.9], // Northeast corner
    [-2.5, 5.9], // Northwest corner
    [-2.5, 5.8]  // Close the polygon
  ]

  const handleCreateSample = async () => {
    setIsCreating(true)
    setResult(null)

    try {
      const sampleConcession: MiningConcession = {
        id: `DEMO_${Date.now()}`,
        name: 'Demo Auto-Calculated Concession',
        size: 0, // Will be auto-calculated
        owner: 'Demo Mining Company',
        permitType: 'small-scale',
        permitExpiryDate: '2026-12-31',
        district: '', // Will be auto-calculated
        region: '', // Will be auto-calculated
        status: 'active',
        coordinates: sampleCoordinates,
        contactInfo: {
          phone: '+233123456789',
          email: 'demo@mining.com',
          address: 'Demo Address'
        },
        rawAttributes: {
          mineral_type: 'Gold',
          land_use: 'Mining'
        }
      }

      console.log('🆕 Creating sample concession with auto-calculation...')
      console.log('📍 Input coordinates:', sampleCoordinates)
      console.log('🔧 Size, District, and Region will be auto-calculated')

      // Create the concession (will auto-calculate fields)
      const createResult = await postgresDataService.createConcession(sampleConcession)
      
      if (createResult.success) {
        // Fetch the created concession to see the calculated values
        const concessions = await postgresDataService.getMiningConcessions(true)
        const createdConcession = concessions.find(c => c.id === sampleConcession.id)
        
        if (createdConcession) {
          setResult(createdConcession)
          console.log('✅ Created concession with calculated fields:', createdConcession)
        }
      } else {
        console.error('❌ Failed to create concession:', createResult.error)
      }
    } catch (error) {
      console.error('❌ Error creating sample concession:', error)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-100 rounded-lg">
          <Calculator className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Auto-Calculation Demo</h3>
          <p className="text-sm text-gray-600">
            Test automated Size, District, and Region calculation
          </p>
        </div>
      </div>

      {/* Demo Input */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Sample Concession Data</h4>
        <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
          <div><strong>Name:</strong> Demo Auto-Calculated Concession</div>
          <div><strong>Coordinates:</strong> {sampleCoordinates.length} points in Western Ghana</div>
          <div><strong>Input Size:</strong> <span className="text-gray-500">0 (will be calculated)</span></div>
          <div><strong>Input District:</strong> <span className="text-gray-500">Empty (will be calculated)</span></div>
          <div><strong>Input Region:</strong> <span className="text-gray-500">Empty (will be calculated)</span></div>
        </div>
      </div>

      {/* Create Button */}
      <div className="mb-6">
        <button
          onClick={handleCreateSample}
          disabled={isCreating}
          className={`
            inline-flex items-center px-4 py-2 rounded-md font-medium transition-colors
            ${isCreating 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500'
            }
          `}
        >
          {isCreating ? (
            <>
              <Calculator className="h-4 w-4 mr-2 animate-pulse" />
              Auto-calculating...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Create with Auto-Calculation
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="bg-green-50 rounded-lg p-4">
          <h4 className="font-medium text-green-900 mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Auto-Calculated Results
          </h4>
          <div className="space-y-2 text-sm text-green-800">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Calculated Size:</strong>
                <div className="text-lg font-semibold text-green-900">
                  {result.size} acres
                </div>
              </div>
              <div>
                <strong>Calculated District:</strong>
                <div className="text-lg font-semibold text-green-900">
                  {result.district}
                </div>
              </div>
            </div>
            <div>
              <strong>Calculated Region:</strong>
              <div className="text-lg font-semibold text-green-900">
                {result.region}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-green-200">
              <strong>Concession ID:</strong> {result.id}
            </div>
          </div>
        </div>
      )}

      {/* Explanation */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-2">How It Works:</h4>
        <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
          <li>The polygon area is calculated using the Shoelace formula</li>
          <li>Area is converted from square degrees to acres based on latitude</li>
          <li>The polygon centroid is calculated for location lookup</li>
          <li>District and Region are determined using Ghana's administrative boundaries</li>
          <li>All calculated values are automatically saved to the database</li>
        </ol>
      </div>
    </div>
  )
}
