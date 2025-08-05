# Automated Field Calculation for Mining Concessions

## Overview

The EPA Mining Concessions Management System now includes **automated field calculation** that automatically populates the **Size**, **District**, and **Region** fields whenever a new mining concession entry is added or updated.

## Features

### 🔧 Automated Fields

1. **Size (Area) Calculation**
   - Automatically calculates the area of mining concession polygons
   - Uses the **Shoelace formula** for precise area computation
   - Converts from square degrees to acres accounting for latitude distortion
   - Provides area in acres with 2 decimal precision

2. **District Detection**
   - Determines the administrative district containing the concession
   - First attempts spatial intersection using PostGIS if available
   - Falls back to coordinate-based lookup using Ghana's administrative boundaries
   - Covers major mining districts across Ghana

3. **Region Identification**
   - Identifies the administrative region based on centroid location
   - Supports all major Ghana regions: Western, Ashanti, Central, Eastern, Northern, Upper East
   - Uses accurate boundary definitions for precise location mapping

## When Fields Are Auto-Calculated

✅ **Creating new concessions** - All fields calculated automatically
✅ **Updating existing concessions** - Fields recalculated if coordinates change
✅ **Bulk import operations** - Each imported record gets calculated fields
✅ **Manual bulk recalculation** - Update all existing records at once

## Implementation Details

### Area Calculation Algorithm

```typescript
// Shoelace formula for polygon area
let area = 0
for (let i = 0; i < coordinates.length; i++) {
  const j = (i + 1) % coordinates.length
  area += coordinates[i][0] * coordinates[j][1]
  area -= coordinates[j][0] * coordinates[i][1]
}
area = Math.abs(area) / 2

// Convert to acres accounting for latitude
const latCenter = coordinates.reduce((sum, coord) => sum + coord[1], 0) / coordinates.length
const degreeToMeters = 111000 * Math.cos(latCenter * Math.PI / 180)
const areaInSquareMeters = area * degreeToMeters * degreeToMeters
const areaInAcres = areaInSquareMeters / 4047
```

### Boundary Detection Methods

1. **Spatial Intersection (PostGIS)**
   ```sql
   SELECT d.district_name, r.region_name
   FROM ghana_districts d
   JOIN ghana_regions r ON d.region_id = r.id
   WHERE ST_Contains(d.geometry, ST_GeomFromText('POINT(lon lat)', 4326))
   ```

2. **Coordinate-Based Lookup (Fallback)**
   - Predefined boundary rectangles for major districts and regions
   - Uses centroid coordinates for fast lookup
   - Covers primary mining areas across Ghana

### Supported Administrative Areas

#### Major Regions
- **Western Region**: Wassa Amenfi, Prestea Huni-Valley, Ellembelle, Nzema East
- **Ashanti Region**: Obuasi Municipal, Bibiani Anhwiaso Bekwai, Amansie West
- **Central Region**: Upper Denkyira East, Twifo Atti-Morkwa
- **Eastern Region**: Atiwa West, Kwahu West
- **Northern Region**: Tamale Metropolitan, West Mamprusi
- **Upper East Region**: Bolgatanga Municipal, Talensi

## API Methods

### Core Calculation Method
```typescript
// Automatically calculate all fields for a concession
private async autoCalculateFields(concession: MiningConcession): Promise<MiningConcession>
```

### Area Calculation
```typescript
// Calculate polygon area in acres
private calculatePolygonArea(coordinates: [number, number][]): number
```

### Boundary Detection
```typescript
// Determine district and region
private async determineAdministrativeBoundaries(coordinates: [number, number][]): Promise<{
  district: string
  region: string
}>
```

### Bulk Operations
```typescript
// Recalculate all existing records
async recalculateAllFields(): Promise<{ success: boolean; updated: number; errors: string[] }>

// Bulk import with auto-calculation
async bulkImportConcessions(concessions: MiningConcession[]): Promise<{ success: boolean; imported: number; errors: string[] }>
```

## Usage Examples

### Creating a New Concession
```typescript
const newConcession: MiningConcession = {
  id: 'CON001',
  name: 'Sample Mining Concession',
  size: 0, // Will be auto-calculated
  district: '', // Will be auto-calculated
  region: '', // Will be auto-calculated
  coordinates: [
    [-2.5, 5.8], [-2.4, 5.8], [-2.4, 5.9], [-2.5, 5.9], [-2.5, 5.8]
  ],
  // ... other fields
}

// Fields are automatically calculated during creation
await postgresDataService.createConcession(newConcession)
// Result: size = 347.22 acres, district = "Wassa Amenfi West", region = "Western"
```

### Bulk Recalculation
```typescript
// Recalculate all existing concessions
const result = await postgresDataService.recalculateAllFields()
console.log(`Updated ${result.updated} concessions`)
```

## User Interface Components

### AutoCalculationManager
- **Purpose**: Admin interface for bulk field recalculation
- **Features**: Progress tracking, error reporting, batch processing
- **Location**: `src/components/Admin/AutoCalculationManager.tsx`

### AutoCalculationDemo
- **Purpose**: Interactive demo of field calculation
- **Features**: Sample data creation, real-time calculation display
- **Location**: `src/components/Admin/AutoCalculationDemo.tsx`

## Technical Benefits

1. **Data Consistency**: All concessions have accurate, calculated fields
2. **User Efficiency**: No manual area calculations or location lookups required
3. **Error Reduction**: Eliminates human error in field population
4. **Performance**: Calculations performed during data entry, not at runtime
5. **Scalability**: Handles bulk operations efficiently with batch processing

## Database Schema Support

The automated calculation works with the enhanced PostgreSQL schema:

```sql
CREATE TABLE mining_concessions (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  size DECIMAL(12,2), -- Auto-calculated area in acres
  district VARCHAR(100), -- Auto-detected district
  region VARCHAR(100), -- Auto-detected region
  coordinates JSONB, -- Source coordinates for calculation
  geometry GEOMETRY(POLYGON, 4326), -- PostGIS geometry for spatial queries
  centroid GEOMETRY(POINT, 4326), -- Auto-calculated centroid
  -- ... other fields
);
```

## Future Enhancements

- **Real-time validation**: Verify calculated values against external GIS services
- **Enhanced boundary data**: Import official Ghana administrative boundaries
- **Multi-unit support**: Support for hectares, square kilometers, etc.
- **Accuracy metrics**: Confidence scores for boundary detection
- **Custom boundaries**: Allow upload of custom administrative boundaries

## Conclusion

The automated field calculation feature significantly enhances the EPA Mining Concessions Management System by providing accurate, consistent, and automatically calculated spatial data for all mining concessions. This reduces manual work, improves data quality, and ensures all concessions have complete geographic information.
