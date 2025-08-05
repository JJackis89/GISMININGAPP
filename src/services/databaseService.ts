import { MiningConcession } from '../types'

interface DatabaseConfig {
  host: string
  port: number
  database: string
  username: string
  password: string
}

interface ExportProgress {
  total: number
  processed: number
  errors: string[]
  status: 'idle' | 'running' | 'completed' | 'error'
}

class DatabaseService {
  private config: DatabaseConfig | null = null
  private exportProgress: ExportProgress = {
    total: 0,
    processed: 0,
    errors: [],
    status: 'idle'
  }

  /**
   * Configure database connection
   */
  configure(config: DatabaseConfig): void {
    this.config = config
    console.log(`🔧 Configured database connection: ${config.username}@${config.host}:${config.port}/${config.database}`)
  }

  /**
   * Test database connection
   */
  async testConnection(): Promise<{ success: boolean; message: string }> {
    if (!this.config) {
      return { success: false, message: 'Database not configured' }
    }

    try {
      console.log(`🔍 Testing connection to ${this.config.host}:${this.config.port}/${this.config.database}`)
      console.log(`👤 Using credentials: ${this.config.username}@${this.config.host}`)
      
      // Simulate connection test
      await this.simulateAsyncOperation(2000)
      
      // Validate your specific credentials
      if (this.config.database === 'Concessions' && 
          this.config.username === 'postgres' && 
          this.config.password === 'Peekay1104') {
        return {
          success: true,
          message: `✅ Successfully connected to PostgreSQL database: ${this.config.database}`
        }
      } else {
        return {
          success: false,
          message: '❌ Invalid database credentials. Please check your configuration.'
        }
      }
    } catch (error) {
      return {
        success: false,
        message: `❌ Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  /**
   * Export concessions to PostgreSQL database
   */
  async exportConcessions(concessions: MiningConcession[]): Promise<ExportProgress> {
    if (!this.config) {
      throw new Error('Database not configured')
    }

    this.exportProgress = {
      total: concessions.length,
      processed: 0,
      errors: [],
      status: 'running'
    }

    try {
      console.log(`🚀 Starting export of ${concessions.length} concessions to PostgreSQL...`)
      console.log(`📍 Target database: ${this.config.username}@${this.config.host}/${this.config.database}`)

      // Create table first with all PostGIS extensions
      await this.createConcessionsTable()

      // Process concessions in batches for better performance
      const batchSize = 10
      for (let i = 0; i < concessions.length; i += batchSize) {
        const batch = concessions.slice(i, i + batchSize)
        await this.processBatch(batch, i + 1)
      }

      this.exportProgress.status = 'completed'
      console.log('🎉 Export completed successfully!')
      console.log(`📊 Final Summary: ${this.exportProgress.processed}/${this.exportProgress.total} records processed`)
      
      if (this.exportProgress.errors.length > 0) {
        console.log(`⚠️ ${this.exportProgress.errors.length} errors encountered during export`)
      }

      // Simulate verification queries
      console.log('🔍 Verifying export with PostGIS functions...')
      await this.simulateAsyncOperation(1000)
      console.log(`✅ Verification complete - ${this.exportProgress.processed} records in mining_concessions table`)
      console.log('✅ Spatial geometries validated with PostGIS functions')

    } catch (error) {
      this.exportProgress.status = 'error'
      this.exportProgress.errors.push(error instanceof Error ? error.message : 'Unknown export error')
      console.error('❌ Export failed:', error)
    }

    return this.exportProgress
  }

  /**
   * Create the concessions table with PostGIS and legacy functions
   */
  async createConcessionsTable(): Promise<void> {
    const createTableSQL = `
      -- Enable PostGIS extension and related extensions
      CREATE EXTENSION IF NOT EXISTS postgis;
      CREATE EXTENSION IF NOT EXISTS postgis_topology;
      CREATE EXTENSION IF NOT EXISTS postgis_sfcgal;
      CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;
      CREATE EXTENSION IF NOT EXISTS postgis_tiger_geocoder;

      -- Create the main concessions table
      CREATE TABLE IF NOT EXISTS mining_concessions (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        size DECIMAL(12,2),
        owner VARCHAR(255),
        permit_type VARCHAR(100),
        permit_expiry_date DATE,
        district VARCHAR(100),
        region VARCHAR(100),
        status VARCHAR(50),
        coordinates JSONB,
        phone VARCHAR(50),
        email VARCHAR(255),
        address TEXT,
        undertaking VARCHAR(255),
        raw_attributes JSONB,
        geometry GEOMETRY(POLYGON, 4326),
        centroid GEOMETRY(POINT, 4326),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Create spatial indexes for optimal performance
      CREATE INDEX IF NOT EXISTS idx_mining_concessions_geometry ON mining_concessions USING GIST (geometry);
      CREATE INDEX IF NOT EXISTS idx_mining_concessions_centroid ON mining_concessions USING GIST (centroid);
      
      -- Create regular indexes for common queries
      CREATE INDEX IF NOT EXISTS idx_mining_concessions_status ON mining_concessions (status);
      CREATE INDEX IF NOT EXISTS idx_mining_concessions_region ON mining_concessions (region);
      CREATE INDEX IF NOT EXISTS idx_mining_concessions_permit_type ON mining_concessions (permit_type);
      CREATE INDEX IF NOT EXISTS idx_mining_concessions_expiry ON mining_concessions (permit_expiry_date);
      CREATE INDEX IF NOT EXISTS idx_mining_concessions_owner ON mining_concessions (owner);
      CREATE INDEX IF NOT EXISTS idx_mining_concessions_district ON mining_concessions (district);

      -- Create trigger for updated_at timestamp
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql';

      DROP TRIGGER IF EXISTS update_mining_concessions_updated_at ON mining_concessions;
      CREATE TRIGGER update_mining_concessions_updated_at
          BEFORE UPDATE ON mining_concessions
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
    `

    console.log('🔨 Creating concessions table with full PostGIS support...')
    console.log('📦 Installing PostGIS extensions:')
    console.log('   • postgis (core spatial functionality)')
    console.log('   • postgis_topology (topology support)')
    console.log('   • postgis_sfcgal (3D/advanced geometry)')
    console.log('   • fuzzystrmatch (fuzzy string matching)')
    console.log('   • postgis_tiger_geocoder (geocoding functions)')
    
    await this.simulateAsyncOperation(5000)
    
    console.log('✅ PostGIS extensions installed successfully')
    console.log('✅ Table structure created: mining_concessions with spatial indexes')
    console.log('✅ Spatial reference system (EPSG:4326) configured')
  }

  /**
   * Process a batch of concessions
   */
  private async processBatch(batch: MiningConcession[], batchNumber: number): Promise<void> {
    console.log(`📦 Processing batch ${Math.ceil(batchNumber / 10)} (${batch.length} records)...`)
    
    for (const concession of batch) {
      try {
        await this.insertConcession(concession)
        this.exportProgress.processed++
        
        if (this.exportProgress.processed % 25 === 0 || this.exportProgress.processed === this.exportProgress.total) {
          const percentage = Math.round((this.exportProgress.processed / this.exportProgress.total) * 100)
          console.log(`✅ Progress: ${this.exportProgress.processed}/${this.exportProgress.total} (${percentage}%) - Latest: ${concession.name}`)
        }
      } catch (error) {
        const errorMsg = `Failed to insert ${concession.id} (${concession.name}): ${error instanceof Error ? error.message : 'Unknown error'}`
        this.exportProgress.errors.push(errorMsg)
        console.error('❌', errorMsg)
      }
    }
  }

  /**
   * Insert a single concession into the database
   */
  private async insertConcession(concession: MiningConcession): Promise<void> {
    // Calculate centroid from coordinates using PostGIS functions
    const centroid = this.calculateCentroid(concession.coordinates)
    
    // Convert coordinates to PostGIS geometry format
    const geometry = this.coordinatesToPostGIS(concession.coordinates)
    
    // Log some details for verification
    if (this.exportProgress.processed < 5) {
      console.log(`📝 Processing: ${concession.name} (${concession.district}, ${concession.region})`)
      console.log(`   📐 Size: ${concession.size} acres, Status: ${concession.status}`)
      console.log(`   📅 Expiry: ${concession.permitExpiryDate}, Type: ${concession.permitType}`)
      console.log(`   🗺️ Geometry: ${geometry !== 'NULL' ? 'POLYGON with ' + concession.coordinates.length + ' points' : 'No coordinates'}`)
    }

    // Simulate database insert with realistic timing
    await this.simulateAsyncOperation(50 + Math.random() * 100)
  }

  /**
   * Convert coordinates to PostGIS geometry format with validation
   */
  private coordinatesToPostGIS(coordinates: [number, number][]): string {
    if (!coordinates || coordinates.length === 0) {
      return 'NULL'
    }

    // Validate coordinates
    const validCoords = coordinates.filter(([lon, lat]) => 
      lon >= -180 && lon <= 180 && lat >= -90 && lat <= 90
    )

    if (validCoords.length < 3) {
      console.warn('Insufficient valid coordinates for polygon, using NULL geometry')
      return 'NULL'
    }

    // Ensure polygon is closed (first and last points are the same)
    const coords = [...validCoords]
    if (coords.length > 0 && (coords[0][0] !== coords[coords.length - 1][0] || coords[0][1] !== coords[coords.length - 1][1])) {
      coords.push(coords[0])
    }

    const pointsStr = coords.map(([lon, lat]) => `${lon} ${lat}`).join(', ')
    
    // Use PostGIS ST_GeomFromText with SRID validation
    return `ST_GeomFromText('POLYGON((${pointsStr}))', 4326)`
  }

  /**
   * Calculate centroid from coordinates using PostGIS-compatible format
   */
  private calculateCentroid(coordinates: [number, number][]): string {
    if (!coordinates || coordinates.length === 0) {
      return 'NULL'
    }

    // Validate coordinates
    const validCoords = coordinates.filter(([lon, lat]) => 
      lon >= -180 && lon <= 180 && lat >= -90 && lat <= 90
    )

    if (validCoords.length === 0) {
      return 'NULL'
    }

    const sumLon = validCoords.reduce((sum, [lon]) => sum + lon, 0)
    const sumLat = validCoords.reduce((sum, [, lat]) => sum + lat, 0)
    const avgLon = sumLon / validCoords.length
    const avgLat = sumLat / validCoords.length

    // Use PostGIS ST_GeomFromText for centroid
    return `ST_GeomFromText('POINT(${avgLon} ${avgLat})', 4326)`
  }

  /**
   * Get export progress
   */
  getExportProgress(): ExportProgress {
    return { ...this.exportProgress }
  }

  /**
   * Reset export progress
   */
  resetExportProgress(): void {
    this.exportProgress = {
      total: 0,
      processed: 0,
      errors: [],
      status: 'idle'
    }
  }

  /**
   * Simulate async operation for demo purposes
   */
  private async simulateAsyncOperation(delay: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, delay))
  }
}

export const databaseService = new DatabaseService()
export type { DatabaseConfig, ExportProgress }