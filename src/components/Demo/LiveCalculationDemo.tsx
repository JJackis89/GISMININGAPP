import React, { useState } from 'react'
import { Calculator, MapPin, Plus, CheckCircle } from 'lucide-react'
import { MiningConcession } from '../../types'

interface CalculationResult {
  size: number
  district: string
  region: string
  centroid: [number, number]
}

export default function LiveCalculationDemo() {
  const [coordinates, setCoordinates] = useState<[number, number][]>([
    [-2.5, 5.8], // Southwest corner
    [-2.4, 5.8], // Southeast corner  
    [-2.4, 5.9], // Northeast corner
    [-2.5, 5.9], // Northwest corner
    [-2.5, 5.8]  // Close the polygon
  ])
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  // Live calculation functions (copied from PostgreSQL service for demo)
  const calculatePolygonArea = (coords: [number, number][]): number => {
    if (!coords || coords.length < 3) return 0

    let area = 0
    const n = coords.length

    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      area += coords[i][0] * coords[j][1]
      area -= coords[j][0] * coords[i][1]
    }

    area = Math.abs(area) / 2

    // Convert from square degrees to acres
    const latCenter = coords.reduce((sum, coord) => sum + coord[1], 0) / coords.length
    const degreeToMeters = 111000 * Math.cos(latCenter * Math.PI / 180)
    const areaInSquareMeters = area * degreeToMeters * degreeToMeters
    const areaInAcres = areaInSquareMeters / 4047

    return Math.round(areaInAcres * 100) / 100
  }

  const calculateCentroid = (coords: [number, number][]): [number, number] => {
    if (!coords || coords.length === 0) return [0, 0]

    const sumLon = coords.reduce((sum, [lon]) => sum + lon, 0)
    const sumLat = coords.reduce((sum, [, lat]) => sum + lat, 0)
    
    return [
      Math.round((sumLon / coords.length) * 10000) / 10000,
      Math.round((sumLat / coords.length) * 10000) / 10000
    ]
  }

  const determineBoundaries = (coords: [number, number][]): { district: string; region: string } => {
    const centroid = calculateCentroid(coords)
    const [lon, lat] = centroid
    
    // Ghana boundary lookup
    const boundaryData = [
      { region: 'Western', district: 'Wassa Amenfi West', lonMin: -3.5, lonMax: -2.8, latMin: 5.0, latMax: 6.2 },
      { region: 'Western', district: 'Prestea Huni-Valley', lonMin: -2.8, lonMax: -2.0, latMin: 5.2, latMax: 6.0 },
      { region: 'Western', district: 'Ellembelle', lonMin: -3.2, lonMax: -2.5, latMin: 4.8, latMax: 5.5 },
      { region: 'Ashanti', district: 'Obuasi Municipal', lonMin: -2.0, lonMax: -1.2, latMin: 6.0, latMax: 6.8 },
      { region: 'Ashanti', district: 'Bibiani Anhwiaso Bekwai', lonMin: -2.5, lonMax: -1.8, latMin: 6.2, latMax: 7.0 },
      { region: 'Central', district: 'Upper Denkyira East', lonMin: -1.8, lonMax: -1.0, latMin: 5.8, latMax: 6.5 },
      { region: 'Eastern', district: 'Atiwa West', lonMin: -0.8, lonMax: 0.0, latMin: 6.0, latMax: 6.8 },
    ]
    
    for (const boundary of boundaryData) {
      if (lon >= boundary.lonMin && lon <= boundary.lonMax && 
          lat >= boundary.latMin && lat <= boundary.latMax) {
        return {
          district: boundary.district,
          region: boundary.region
        }
      }
    }
    
    // Default fallback
    if (lon < -2.0) {
      return { district: 'Western District', region: 'Western' }
    } else {
      return { district: 'Central District', region: 'Central' }
    }
  }

  const handleCalculate = async () => {
    setIsCalculating(true)
    
    // Simulate calculation delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const size = calculatePolygonArea(coordinates)
    const boundaries = determineBoundaries(coordinates)
    const centroid = calculateCentroid(coordinates)
    
    setResult({
      size,
      district: boundaries.district,
      region: boundaries.region,
      centroid
    })
    
    setIsCalculating(false)
  }

  const handleCoordinateChange = (index: number, coord: 'lat' | 'lon', value: string) => {
    const newCoords = [...coordinates]
    const numValue = parseFloat(value)
    if (!isNaN(numValue)) {
      if (coord === 'lon') {
        newCoords[index] = [numValue, newCoords[index][1]]
      } else {
        newCoords[index] = [newCoords[index][0], numValue]
      }
      setCoordinates(newCoords)
      setResult(null) // Clear previous results when coordinates change
    }
  }

  const addPresetLocation = (name: string, coords: [number, number][]) => {
    setCoordinates(coords)
    setResult(null)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Calculator className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Live Field Calculation Demo</h3>
          <p className="text-sm text-gray-600">
            See automated Size, District, and Region calculations in real-time
          </p>
        </div>
      </div>

      {/* Preset Locations */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Quick Test Locations:</h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => addPresetLocation('Western Ghana', [
              [-2.5, 5.8], [-2.4, 5.8], [-2.4, 5.9], [-2.5, 5.9], [-2.5, 5.8]
            ])}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
          >
            Western Ghana
          </button>
          <button
            onClick={() => addPresetLocation('Ashanti Region', [
              [-1.8, 6.5], [-1.7, 6.5], [-1.7, 6.6], [-1.8, 6.6], [-1.8, 6.5]
            ])}
            className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200"
          >
            Ashanti Region
          </button>
          <button
            onClick={() => addPresetLocation('Large Area', [
              [-2.8, 5.5], [-2.2, 5.5], [-2.2, 6.1], [-2.8, 6.1], [-2.8, 5.5]
            ])}
            className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200"
          >
            Large Area (600+ acres)
          </button>
        </div>
      </div>

      {/* Coordinate Input */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Polygon Coordinates:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {coordinates.slice(0, -1).map((coord, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-sm text-gray-600 w-12">P{index + 1}:</span>
              <input
                type="number"
                step="0.0001"
                value={coord[0]}
                onChange={(e) => handleCoordinateChange(index, 'lon', e.target.value)}
                className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                placeholder="Longitude"
              />
              <span className="text-gray-400">,</span>
              <input
                type="number"
                step="0.0001"
                value={coord[1]}
                onChange={(e) => handleCoordinateChange(index, 'lat', e.target.value)}
                className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                placeholder="Latitude"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Calculate Button */}
      <div className="mb-6">
        <button
          onClick={handleCalculate}
          disabled={isCalculating}
          className={`
            inline-flex items-center px-4 py-2 rounded-md font-medium transition-colors
            ${isCalculating 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
            }
          `}
        >
          {isCalculating ? (
            <>
              <Calculator className="h-4 w-4 mr-2 animate-pulse" />
              Calculating...
            </>
          ) : (
            <>
              <Calculator className="h-4 w-4 mr-2" />
              Calculate Fields
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="bg-green-50 rounded-lg p-4">
          <h4 className="font-medium text-green-900 mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Calculated Results
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-green-800">Area (Size):</span>
                  <div className="text-2xl font-bold text-green-900">
                    {result.size.toLocaleString()} acres
                  </div>
                  <div className="text-xs text-green-700">
                    ≈ {(result.size * 0.404686).toFixed(2)} hectares
                  </div>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-green-800">Centroid:</span>
                  <div className="text-sm font-mono text-green-900">
                    {result.centroid[0]}, {result.centroid[1]}
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-green-800">District:</span>
                  <div className="text-lg font-semibold text-green-900">
                    {result.district}
                  </div>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-green-800">Region:</span>
                  <div className="text-lg font-semibold text-green-900">
                    {result.region}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-green-200">
            <h5 className="font-medium text-green-900 mb-2">Calculation Methods:</h5>
            <ul className="text-xs text-green-700 space-y-1">
              <li>• <strong>Area:</strong> Shoelace formula with latitude-adjusted conversion to acres</li>
              <li>• <strong>Location:</strong> Centroid-based lookup against Ghana administrative boundaries</li>
              <li>• <strong>Precision:</strong> Coordinates rounded to 4 decimal places, area to 2 decimal places</li>
            </ul>
          </div>
        </div>
      )}

      {/* Algorithm Info */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <details className="group">
          <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
            View Calculation Algorithms
          </summary>
          <div className="mt-3 text-xs text-gray-600 space-y-2">
            <div>
              <strong>Shoelace Formula (Area):</strong>
              <code className="block mt-1 p-2 bg-gray-100 rounded text-xs">
                {`area = |Σ(xi*yi+1 - xi+1*yi)| / 2
degreeToMeters = 111000 * cos(latitude)
areaInAcres = area * degreeToMeters² / 4047`}
              </code>
            </div>
            <div>
              <strong>Boundary Detection:</strong> Point-in-polygon test using predefined coordinate ranges for Ghana's administrative districts and regions.
            </div>
          </div>
        </details>
      </div>
    </div>
  )
}
