/**
 * Print Test Page - Test the print layout template with real ArcGIS data
 */

import React, { useState, useEffect } from 'react'
import { PrintLayoutTemplate } from '../components/Print/PrintLayoutTemplate'
import { PrintButton } from '../components/Print/PrintButton'
import { MiningConcession } from '../types'
import { arcgisService } from '../services/arcgisService'
import { mockConcessions } from '../data/mockData'
import { processConcessionBoundary } from '../utils/geometryUtils'
import { useAuth } from '../contexts/AuthContext'

const PrintTestPage: React.FC = () => {
  const { user } = useAuth()
  const [testConcession, setTestConcession] = useState<MiningConcession | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [useArcGIS, setUseArcGIS] = useState(true) // Default to ArcGIS data

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        if (useArcGIS) {
          console.log('🔄 Loading concessions from ArcGIS Feature Layer...')
          const concessions = await arcgisService.getConcessions()
          if (concessions && concessions.length > 0) {
            setTestConcession(concessions[0])
            console.log('✅ Loaded ArcGIS concession for testing:', concessions[0].name)
          } else {
            throw new Error('No concessions found in ArcGIS')
          }
        } else {
          setTestConcession(mockConcessions[0])
          console.log('📝 Using mock concession for testing:', mockConcessions[0].name)
        }
      } catch (err) {
        console.error('❌ Failed to load concession data:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
        // Fallback to mock data
        setTestConcession(mockConcessions[0])
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [useArcGIS])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Loading Print Test Data...</h1>
            <p className="text-gray-600">Loading {useArcGIS ? 'ArcGIS Feature Layer' : 'mock'} data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!testConcession) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-bold text-red-600 mb-4">Error Loading Test Data</h1>
            <p className="text-gray-600">{error || 'No test concession available'}</p>
          </div>
        </div>
      </div>
    )
  }

  const boundaryGeometry = processConcessionBoundary(testConcession)

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Print Layout Test Page
          </h1>
          
          {/* Data Source Toggle */}
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Data Source</h3>
            <div className="flex items-center gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={useArcGIS}
                  onChange={() => setUseArcGIS(true)}
                  className="mr-2"
                />
                <span className={useArcGIS ? 'font-semibold text-blue-600' : 'text-gray-600'}>
                  ArcGIS Feature Layer (Real Data)
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={!useArcGIS}
                  onChange={() => setUseArcGIS(false)}
                  className="mr-2"
                />
                <span className={!useArcGIS ? 'font-semibold text-blue-600' : 'text-gray-600'}>
                  Mock Data (Sample)
                </span>
              </label>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <PrintButton 
              concession={testConcession} 
              variant="single" 
              size="md"
              user={user}
            />
            <div className="text-sm text-gray-600">
              <p><strong>Data Source:</strong> {useArcGIS ? 'ArcGIS Feature Layer' : 'Mock Data'}</p>
              <p><strong>Test Concession:</strong> {testConcession.name}</p>
              <p><strong>Boundary Vertices:</strong> {boundaryGeometry.vertices.length}</p>
              <p><strong>Calculated Area:</strong> {boundaryGeometry.area} acres</p>
              <p><strong>Perimeter:</strong> {boundaryGeometry.perimeter.toFixed(2)} km</p>
              <p><strong>Region:</strong> {testConcession.region}</p>
              {boundaryGeometry.vertices.length > 0 && (
                <p><strong>Sample UTM:</strong> {boundaryGeometry.vertices[0].easting?.toFixed(2) || 'N/A'} E, {boundaryGeometry.vertices[0].northing?.toFixed(2) || 'N/A'} N</p>
              )}
            </div>
          </div>
        </div>

        {/* Print Layout Preview */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Print Layout Preview
            </h2>
            <p className="text-sm text-gray-600">
              This is how the document will appear when printed
            </p>
          </div>
          
          {/* Preview Container */}
          <div className="p-4 bg-gray-100">
            <div className="transform scale-75 origin-top-left bg-white shadow-lg" style={{ width: '133%' }}>
              <PrintLayoutTemplate
                concession={testConcession}
                printDate={new Date()}
                showCoordinates={true}
                showMap={true}
              />
            </div>
          </div>
        </div>

        {/* Debug Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Debug Information
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700">Concession Data:</h4>
              <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                {JSON.stringify(testConcession, null, 2)}
              </pre>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700">Boundary Vertices Analysis:</h4>
              <div className="bg-gray-100 p-3 rounded">
                <p className="text-sm mb-2"><strong>Total Vertices:</strong> {boundaryGeometry.vertices.length}</p>
                <p className="text-sm mb-2"><strong>Calculated Perimeter:</strong> {boundaryGeometry.perimeter.toFixed(2)} km</p>
                <p className="text-sm mb-2"><strong>Calculated Area:</strong> {boundaryGeometry.area} hectares</p>
                <p className="text-sm mb-2"><strong>Centroid:</strong> {boundaryGeometry.centroid.latitude.toFixed(6)}°N, {boundaryGeometry.centroid.longitude.toFixed(6)}°E</p>
                <div className="space-y-1 mt-3">
                  <p className="text-sm font-semibold">Vertices with UTM Coordinates:</p>
                  {boundaryGeometry.vertices.slice(0, 5).map((vertex, index) => (
                    <div key={index} className="text-xs font-mono bg-white p-2 rounded border">
                      V{vertex.index}: [{vertex.longitude.toFixed(6)}, {vertex.latitude.toFixed(6)}] → 
                      UTM: {vertex.easting?.toLocaleString()}E {vertex.northing?.toLocaleString()}N
                    </div>
                  ))}
                  {boundaryGeometry.vertices.length > 5 && (
                    <p className="text-xs text-gray-500">...and {boundaryGeometry.vertices.length - 5} more vertices</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrintTestPage
