import React, { useState } from 'react'
import { Plus, Database, CheckCircle, AlertCircle, Loader } from 'lucide-react'
import { MiningConcession } from '../../types'

interface MockConcessionCreator {
  onConcessionCreated?: (concession: MiningConcession) => void
}

export default function MockConcessionCreator({ onConcessionCreated }: MockConcessionCreator) {
  const [isCreating, setIsCreating] = useState(false)
  const [createdConcession, setCreatedConcession] = useState<MiningConcession | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Mock PostgreSQL-style automated field calculation
  const autoCalculateFields = async (inputConcession: Partial<MiningConcession>): Promise<MiningConcession> => {
    console.log('🔧 Auto-calculating fields for new concession...')
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const coordinates = inputConcession.coordinates || []
    
    // Calculate area using Shoelace formula
    let area = 0
    if (coordinates.length >= 3) {
      const n = coordinates.length
      for (let i = 0; i < n; i++) {
        const j = (i + 1) % n
        area += coordinates[i][0] * coordinates[j][1]
        area -= coordinates[j][0] * coordinates[i][1]
      }
      area = Math.abs(area) / 2
      
      // Convert to acres
      const latCenter = coordinates.reduce((sum, coord) => sum + coord[1], 0) / coordinates.length
      const degreeToMeters = 111000 * Math.cos(latCenter * Math.PI / 180)
      const areaInSquareMeters = area * degreeToMeters * degreeToMeters
      area = Math.round((areaInSquareMeters / 4047) * 100) / 100
    }
    
    // Determine district and region based on coordinates
    const centroidLon = coordinates.reduce((sum, coord) => sum + coord[0], 0) / coordinates.length
    const centroidLat = coordinates.reduce((sum, coord) => sum + coord[1], 0) / coordinates.length
    
    let district = 'Unknown District'
    let region = 'Unknown Region'
    
    // Simple boundary lookup for Ghana
    if (centroidLon < -2.0 && centroidLat > 5.0 && centroidLat < 7.0) {
      region = 'Western'
      district = centroidLat > 6.0 ? 'Wassa Amenfi West' : 'Prestea Huni-Valley'
    } else if (centroidLon >= -2.0 && centroidLon < -1.0 && centroidLat > 6.0) {
      region = 'Ashanti'
      district = 'Obuasi Municipal'
    } else if (centroidLon >= -1.0 && centroidLat > 5.5 && centroidLat < 6.5) {
      region = 'Central'
      district = 'Upper Denkyira East'
    } else {
      region = 'Eastern'
      district = 'Atiwa West'
    }
    
    console.log(`📐 Calculated area: ${area} acres`)
    console.log(`🗺️ Determined location: ${district}, ${region}`)
    
    return {
      id: inputConcession.id || `CON_${Date.now()}`,
      name: inputConcession.name || 'Unknown Concession',
      size: area, // Auto-calculated
      owner: inputConcession.owner || 'Unknown Owner',
      permitType: inputConcession.permitType || 'small-scale',
      permitExpiryDate: inputConcession.permitExpiryDate || '2026-12-31',
      district: district, // Auto-calculated
      region: region, // Auto-calculated
      status: inputConcession.status || 'active',
      coordinates: coordinates,
      contactInfo: inputConcession.contactInfo || {
        phone: '',
        email: '',
        address: ''
      },
      rawAttributes: inputConcession.rawAttributes || {}
    }
  }

  const createSampleConcession = async () => {
    setIsCreating(true)
    setError(null)
    setCreatedConcession(null)

    try {
      // Sample concession data (without calculated fields)
      const inputData: Partial<MiningConcession> = {
        id: `DEMO_${Date.now()}`,
        name: 'Auto-Calculated Demo Concession',
        size: 0, // Will be calculated
        owner: 'Ghana Mining Demo Ltd',
        permitType: 'small-scale',
        permitExpiryDate: '2026-12-31',
        district: '', // Will be calculated
        region: '', // Will be calculated
        status: 'active',
        coordinates: [
          [-2.45, 5.85], // Sample coordinates in Western Ghana
          [-2.40, 5.85],
          [-2.40, 5.90],
          [-2.45, 5.90],
          [-2.45, 5.85]
        ],
        contactInfo: {
          phone: '+233 123 456 789',
          email: 'demo@ghanamining.com',
          address: 'Western Region, Ghana'
        },
        rawAttributes: {
          mineral_type: 'Gold',
          land_use: 'Mining',
          environmental_clearance: 'Approved'
        }
      }

      console.log('🆕 Creating new concession with input data:')
      console.log('• Name:', inputData.name)
      console.log('• Size:', inputData.size, '(empty - will be calculated)')
      console.log('• District:', inputData.district || '(empty - will be calculated)')
      console.log('• Region:', inputData.region || '(empty - will be calculated)')
      console.log('• Coordinates:', inputData.coordinates?.length, 'points')

      // Simulate the PostgreSQL auto-calculation process
      const enhancedConcession = await autoCalculateFields(inputData)
      
      console.log('✅ Concession created with calculated fields:')
      console.log('• Size:', enhancedConcession.size, 'acres')
      console.log('• District:', enhancedConcession.district)
      console.log('• Region:', enhancedConcession.region)

      setCreatedConcession(enhancedConcession)
      
      if (onConcessionCreated) {
        onConcessionCreated(enhancedConcession)
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      console.error('❌ Error creating concession:', errorMessage)
      setError(errorMessage)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-100 rounded-lg">
          <Database className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Mock Concession Creation</h3>
          <p className="text-sm text-gray-600">
            Simulate PostgreSQL automated field calculation when creating new concessions
          </p>
        </div>
      </div>

      {/* Input Data Preview */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Input Data (Before Auto-Calculation):</h4>
        <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-2">
          <div><strong>Name:</strong> Auto-Calculated Demo Concession</div>
          <div><strong>Owner:</strong> Ghana Mining Demo Ltd</div>
          <div><strong>Size:</strong> <span className="text-red-600">0 (empty - will be calculated)</span></div>
          <div><strong>District:</strong> <span className="text-red-600">(empty - will be calculated)</span></div>
          <div><strong>Region:</strong> <span className="text-red-600">(empty - will be calculated)</span></div>
          <div><strong>Coordinates:</strong> 5 points in Western Ghana</div>
        </div>
      </div>

      {/* Create Button */}
      <div className="mb-6">
        <button
          onClick={createSampleConcession}
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
              <Loader className="h-4 w-4 mr-2 animate-spin" />
              Creating & Calculating...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Create Concession with Auto-Calculation
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {createdConcession && (
        <div className="bg-green-50 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-green-900 mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Created with Auto-Calculated Fields
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div>
                <span className="font-medium text-green-800">Concession ID:</span>
                <div className="font-mono text-green-900">{createdConcession.id}</div>
              </div>
              <div>
                <span className="font-medium text-green-800">Calculated Size:</span>
                <div className="text-lg font-bold text-green-900">
                  {createdConcession.size.toLocaleString()} acres
                </div>
                <div className="text-xs text-green-700">
                  ≈ {(createdConcession.size * 0.404686).toFixed(2)} hectares
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div>
                <span className="font-medium text-green-800">Calculated District:</span>
                <div className="text-lg font-semibold text-green-900">
                  {createdConcession.district}
                </div>
              </div>
              <div>
                <span className="font-medium text-green-800">Calculated Region:</span>
                <div className="text-lg font-semibold text-green-900">
                  {createdConcession.region}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-green-200">
            <h5 className="font-medium text-green-900 mb-2">What Happened:</h5>
            <ul className="text-xs text-green-700 space-y-1">
              <li>✅ Polygon area calculated using coordinates (Shoelace formula)</li>
              <li>✅ District determined by centroid location lookup</li>
              <li>✅ Region identified based on Ghana administrative boundaries</li>
              <li>✅ All fields automatically populated before database insertion</li>
            </ul>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">Error</span>
          </div>
          <p className="text-sm text-red-700 mt-1">{error}</p>
        </div>
      )}

      {/* Process Explanation */}
      <div className="pt-4 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-2">Automated Calculation Process:</h4>
        <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
          <li>User provides basic concession data (name, owner, coordinates, etc.)</li>
          <li>System automatically calculates polygon area from coordinates</li>
          <li>System determines district and region using centroid location</li>
          <li>Enhanced concession data is saved to PostgreSQL database</li>
          <li>User sees the complete record with all calculated fields</li>
        </ol>
      </div>
    </div>
  )
}
