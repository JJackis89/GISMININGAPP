/**
 * Geometry Utilities for EPA Mining Concessions Management System
 * Handles extraction and processing of concession boundary vertices
 */

import { MiningConcession } from '../types'

export interface BoundaryVertex {
  latitude: number
  longitude: number
  index: number
  easting?: number
  northing?: number
}

export interface BoundaryGeometry {
  vertices: BoundaryVertex[]
  perimeter: number // in kilometers
  area: number // in hectares
  centroid: { latitude: number; longitude: number }
  boundingBox: {
    north: number
    south: number
    east: number
    west: number
  }
}

/**
 * Extract vertices from concession boundary coordinates
 * Handles both simple polygons and complex multipolygon geometries
 */
export const extractBoundaryVertices = (coordinates: [number, number][]): BoundaryVertex[] => {
  if (!coordinates || coordinates.length === 0) {
    return []
  }

  // Remove duplicate closing vertex if present
  const cleanCoords = coordinates[coordinates.length - 1][0] === coordinates[0][0] && 
                     coordinates[coordinates.length - 1][1] === coordinates[0][1]
    ? coordinates.slice(0, -1)
    : coordinates

  return cleanCoords.map((coord, index) => ({
    longitude: coord[0],
    latitude: coord[1],
    index: index + 1,
    // Calculate approximate UTM coordinates for Ghana (Zone 30N)
    easting: convertToUTMEasting(coord[0], coord[1]),
    northing: convertToUTMNorthing(coord[0], coord[1])
  }))
}

/**
 * Convert longitude/latitude to approximate UTM Easting (Zone 30N for Ghana)
 */
const convertToUTMEasting = (longitude: number, latitude: number): number => {
  // Simplified conversion for Ghana (approximately UTM Zone 30N)
  const centralMeridian = -3 // Central meridian for Zone 30N
  const k0 = 0.9996 // Scale factor
  const a = 6378137 // WGS84 semi-major axis
  const e2 = 0.00669438 // WGS84 first eccentricity squared
  
  const lonRad = (longitude * Math.PI) / 180
  const latRad = (latitude * Math.PI) / 180
  const cmRad = (centralMeridian * Math.PI) / 180
  
  const deltaLon = lonRad - cmRad
  const N = a / Math.sqrt(1 - e2 * Math.sin(latRad) ** 2)
  
  // Simplified formula - for precise conversion use proj4js
  const easting = 500000 + k0 * N * deltaLon * Math.cos(latRad)
  
  return Math.round(easting)
}

/**
 * Convert longitude/latitude to approximate UTM Northing (Zone 30N for Ghana)
 */
const convertToUTMNorthing = (longitude: number, latitude: number): number => {
  // Simplified conversion for northern hemisphere
  const a = 6378137 // WGS84 semi-major axis
  const e2 = 0.00669438 // WGS84 first eccentricity squared
  const k0 = 0.9996 // Scale factor
  
  const latRad = (latitude * Math.PI) / 180
  const M = a * ((1 - e2/4 - 3*e2*e2/64) * latRad)
  
  return Math.round(k0 * M)
}

/**
 * Calculate perimeter of polygon using Haversine formula
 * Returns perimeter in kilometers
 */
export const calculatePerimeter = (vertices: BoundaryVertex[]): number => {
  if (vertices.length < 3) return 0

  let perimeter = 0
  const R = 6371 // Earth's radius in kilometers

  for (let i = 0; i < vertices.length; i++) {
    const current = vertices[i]
    const next = vertices[(i + 1) % vertices.length]

    const lat1 = (current.latitude * Math.PI) / 180
    const lat2 = (next.latitude * Math.PI) / 180
    const deltaLat = ((next.latitude - current.latitude) * Math.PI) / 180
    const deltaLon = ((next.longitude - current.longitude) * Math.PI) / 180

    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    perimeter += R * c
  }

  return perimeter
}

/**
 * Calculate area using Shoelace formula
 * Returns area in hectares
 */
export const calculateArea = (vertices: BoundaryVertex[]): number => {
  if (vertices.length < 3) return 0

  let area = 0
  const n = vertices.length

  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    area += vertices[i].longitude * vertices[j].latitude
    area -= vertices[j].longitude * vertices[i].latitude
  }

  area = Math.abs(area) / 2
  
  // Convert from square degrees to hectares
  // 1 degree ≈ 111.32 km at equator, Ghana is near equator
  const kmSquared = area * 111.32 * 111.32
  
  // Convert to hectares (1 km² = 100 hectares)
  return Math.round(kmSquared * 100)
}

/**
 * Calculate centroid of polygon
 */
export const calculateCentroid = (vertices: BoundaryVertex[]): { latitude: number; longitude: number } => {
  if (vertices.length === 0) {
    return { latitude: 0, longitude: 0 }
  }

  const sumLat = vertices.reduce((sum, vertex) => sum + vertex.latitude, 0)
  const sumLon = vertices.reduce((sum, vertex) => sum + vertex.longitude, 0)

  return {
    latitude: sumLat / vertices.length,
    longitude: sumLon / vertices.length
  }
}

/**
 * Calculate bounding box of vertices
 */
export const calculateBoundingBox = (vertices: BoundaryVertex[]) => {
  if (vertices.length === 0) {
    return { north: 0, south: 0, east: 0, west: 0 }
  }

  const lats = vertices.map(v => v.latitude)
  const lons = vertices.map(v => v.longitude)

  return {
    north: Math.max(...lats),
    south: Math.min(...lats),
    east: Math.max(...lons),
    west: Math.min(...lons)
  }
}

/**
 * Process concession boundary and extract all geometric properties
 */
export const processConcessionBoundary = (concession: MiningConcession): BoundaryGeometry => {
  const vertices = extractBoundaryVertices(concession.coordinates)
  const perimeter = calculatePerimeter(vertices)
  const area = calculateArea(vertices)
  const centroid = calculateCentroid(vertices)
  const boundingBox = calculateBoundingBox(vertices)

  return {
    vertices,
    perimeter,
    area,
    centroid,
    boundingBox
  }
}

/**
 * Format coordinates for display in different formats
 */
export const formatCoordinates = {
  decimal: (vertex: BoundaryVertex, precision: number = 6): string => {
    return `${vertex.latitude.toFixed(precision)}, ${vertex.longitude.toFixed(precision)}`
  },
  
  dms: (vertex: BoundaryVertex): string => {
    const formatDMS = (decimal: number, isLatitude: boolean): string => {
      const abs = Math.abs(decimal)
      const degrees = Math.floor(abs)
      const minutes = Math.floor((abs - degrees) * 60)
      const seconds = ((abs - degrees - minutes / 60) * 3600).toFixed(2)
      const direction = isLatitude ? (decimal >= 0 ? 'N' : 'S') : (decimal >= 0 ? 'E' : 'W')
      return `${degrees}°${minutes}'${seconds}"${direction}`
    }

    return `${formatDMS(vertex.latitude, true)}, ${formatDMS(vertex.longitude, false)}`
  },

  utm: (vertex: BoundaryVertex): string => {
    if (vertex.easting && vertex.northing) {
      return `30N ${vertex.easting}E ${vertex.northing}N`
    }
    return 'UTM not available'
  }
}

/**
 * Generate realistic concession boundary vertices for testing
 * Creates irregular polygons that resemble real mining concessions
 */
export const generateRealisticBoundary = (
  centerLat: number,
  centerLon: number,
  sizeHectares: number,
  sides: number = 8
): [number, number][] => {
  // Convert hectares to approximate radius in degrees
  const areaKm2 = sizeHectares / 100
  const radiusKm = Math.sqrt(areaKm2 / Math.PI)
  const radiusDeg = radiusKm / 111.32 // Approximate conversion
  
  const vertices: [number, number][] = []
  
  for (let i = 0; i < sides; i++) {
    const angle = (i / sides) * 2 * Math.PI
    
    // Add some randomness to make it look more realistic
    const randomRadius = radiusDeg * (0.7 + Math.random() * 0.6)
    const randomAngle = angle + (Math.random() - 0.5) * 0.3
    
    const lat = centerLat + randomRadius * Math.cos(randomAngle)
    const lon = centerLon + randomRadius * Math.sin(randomAngle)
    
    vertices.push([lon, lat])
  }
  
  // Close the polygon
  vertices.push(vertices[0])
  
  return vertices
}
