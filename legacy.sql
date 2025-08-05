-- EPA Mining Concessions Management System
-- PostgreSQL Database Schema with PostGIS Extensions
-- Legacy migration script for existing mining concessions data

-- Enable PostGIS and related extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;
CREATE EXTENSION IF NOT EXISTS postgis_sfcgal;
CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;
CREATE EXTENSION IF NOT EXISTS postgis_tiger_geocoder;

-- Drop existing table if it exists (for fresh migration)
-- DROP TABLE IF EXISTS mining_concessions CASCADE;

-- Create the main mining concessions table
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
CREATE INDEX IF NOT EXISTS idx_mining_concessions_geometry 
    ON mining_concessions USING GIST (geometry);
CREATE INDEX IF NOT EXISTS idx_mining_concessions_centroid 
    ON mining_concessions USING GIST (centroid);

-- Create regular indexes for common queries
CREATE INDEX IF NOT EXISTS idx_mining_concessions_status 
    ON mining_concessions (status);
CREATE INDEX IF NOT EXISTS idx_mining_concessions_region 
    ON mining_concessions (region);
CREATE INDEX IF NOT EXISTS idx_mining_concessions_permit_type 
    ON mining_concessions (permit_type);
CREATE INDEX IF NOT EXISTS idx_mining_concessions_expiry 
    ON mining_concessions (permit_expiry_date);
CREATE INDEX IF NOT EXISTS idx_mining_concessions_owner 
    ON mining_concessions (owner);
CREATE INDEX IF NOT EXISTS idx_mining_concessions_district 
    ON mining_concessions (district);
CREATE INDEX IF NOT EXISTS idx_mining_concessions_name 
    ON mining_concessions (name);

-- Create function for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for automatic timestamp updates
DROP TRIGGER IF EXISTS update_mining_concessions_updated_at ON mining_concessions;
CREATE TRIGGER update_mining_concessions_updated_at
    BEFORE UPDATE ON mining_concessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to validate geometry
CREATE OR REPLACE FUNCTION validate_mining_concession_geometry()
RETURNS TRIGGER AS $$
BEGIN
    -- Ensure geometry is valid if provided
    IF NEW.geometry IS NOT NULL THEN
        IF NOT ST_IsValid(NEW.geometry) THEN
            RAISE EXCEPTION 'Invalid geometry provided for concession %', NEW.id;
        END IF;
        
        -- Auto-generate centroid if geometry is provided but centroid is not
        IF NEW.centroid IS NULL THEN
            NEW.centroid = ST_Centroid(NEW.geometry);
        END IF;
    END IF;
    
    -- Validate coordinates match geometry if both are provided
    IF NEW.coordinates IS NOT NULL AND NEW.geometry IS NOT NULL THEN
        -- Log discrepancy but don't fail
        IF jsonb_array_length(NEW.coordinates) != ST_NPoints(ST_ExteriorRing(NEW.geometry)) THEN
            RAISE NOTICE 'Coordinate count mismatch for concession %', NEW.id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for geometry validation
DROP TRIGGER IF EXISTS validate_geometry_trigger ON mining_concessions;
CREATE TRIGGER validate_geometry_trigger
    BEFORE INSERT OR UPDATE ON mining_concessions
    FOR EACH ROW
    EXECUTE FUNCTION validate_mining_concession_geometry();

-- Create view for easy querying with calculated fields
CREATE OR REPLACE VIEW mining_concessions_summary AS
SELECT 
    id,
    name,
    size,
    owner,
    permit_type,
    permit_expiry_date,
    district,
    region,
    status,
    phone,
    email,
    address,
    undertaking,
    -- Calculate days until expiry
    CASE 
        WHEN permit_expiry_date IS NOT NULL THEN 
            permit_expiry_date - CURRENT_DATE
        ELSE NULL 
    END as days_until_expiry,
    -- Determine expiry status
    CASE 
        WHEN permit_expiry_date IS NULL THEN 'no_expiry_date'
        WHEN permit_expiry_date < CURRENT_DATE THEN 'expired'
        WHEN permit_expiry_date <= CURRENT_DATE + INTERVAL '30 days' THEN 'expiring_soon'
        ELSE 'valid'
    END as expiry_status,
    -- Calculate area in different units
    size as size_acres,
    ROUND((size * 0.404686)::numeric, 2) as size_hectares,
    ROUND((size * 4046.86)::numeric, 2) as size_sqm,
    -- Geometry information
    ST_Area(geography(geometry)) as calculated_area_sqm,
    ST_AsText(centroid) as centroid_wkt,
    ST_AsGeoJSON(geometry) as geometry_geojson,
    created_at,
    updated_at
FROM mining_concessions;

-- Create materialized view for analytics (refreshed periodically)
CREATE MATERIALIZED VIEW IF NOT EXISTS mining_concessions_analytics AS
SELECT 
    -- Regional statistics
    region,
    COUNT(*) as total_concessions,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_count,
    COUNT(CASE WHEN status = 'expired' THEN 1 END) as expired_count,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count,
    SUM(size) as total_area_acres,
    AVG(size) as avg_size_acres,
    
    -- Permit type distribution
    COUNT(CASE WHEN permit_type = 'small-scale' THEN 1 END) as small_scale_count,
    COUNT(CASE WHEN permit_type = 'reconnaissance' THEN 1 END) as reconnaissance_count,
    COUNT(CASE WHEN permit_type = 'prospecting' THEN 1 END) as prospecting_count,
    COUNT(CASE WHEN permit_type = 'mining-lease' THEN 1 END) as mining_lease_count,
    
    -- Expiry analysis
    COUNT(CASE WHEN permit_expiry_date < CURRENT_DATE THEN 1 END) as expired_permits,
    COUNT(CASE WHEN permit_expiry_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days' THEN 1 END) as expiring_in_30_days,
    COUNT(CASE WHEN permit_expiry_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '90 days' THEN 1 END) as expiring_in_90_days,
    
    -- Spatial statistics
    ST_Union(geometry) as region_boundary,
    ST_AsText(ST_Centroid(ST_Union(geometry))) as region_centroid
FROM mining_concessions 
WHERE region IS NOT NULL AND region != ''
GROUP BY region
ORDER BY total_concessions DESC;

-- Create indexes on materialized view
CREATE INDEX IF NOT EXISTS idx_analytics_region ON mining_concessions_analytics (region);
CREATE INDEX IF NOT EXISTS idx_analytics_region_boundary ON mining_concessions_analytics USING GIST (region_boundary);

-- Create function to refresh analytics
CREATE OR REPLACE FUNCTION refresh_mining_analytics()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW mining_concessions_analytics;
    RAISE NOTICE 'Mining concessions analytics refreshed at %', now();
END;
$$ language 'plpgsql';

-- Sample spatial queries for testing
-- Uncomment to test after data import

/*
-- Find concessions within 10km of a point
SELECT id, name, district, ST_Distance(geography(geometry), geography(ST_GeomFromText('POINT(-1.5 6.5)', 4326))) as distance_meters
FROM mining_concessions 
WHERE ST_DWithin(geography(geometry), geography(ST_GeomFromText('POINT(-1.5 6.5)', 4326)), 10000)
ORDER BY distance_meters;

-- Find overlapping concessions
SELECT a.id as concession_a, b.id as concession_b, a.name as name_a, b.name as name_b
FROM mining_concessions a, mining_concessions b
WHERE a.id < b.id 
AND ST_Overlaps(a.geometry, b.geometry);

-- Calculate total area by region with spatial functions
SELECT 
    region,
    COUNT(*) as concession_count,
    SUM(ST_Area(geography(geometry))/10000) as total_area_hectares,
    ST_AsText(ST_Centroid(ST_Union(geometry))) as region_center
FROM mining_concessions 
WHERE geometry IS NOT NULL
GROUP BY region
ORDER BY total_area_hectares DESC;
*/

-- Grant permissions (adjust as needed for your user setup)
GRANT ALL PRIVILEGES ON TABLE mining_concessions TO postgres;
GRANT SELECT ON mining_concessions_summary TO postgres;
GRANT SELECT ON mining_concessions_analytics TO postgres;

-- Display completion message
DO $$
BEGIN
    RAISE NOTICE '=================================================';
    RAISE NOTICE 'EPA Mining Concessions Database Schema Created!';
    RAISE NOTICE '=================================================';
    RAISE NOTICE 'PostGIS extensions enabled successfully';
    RAISE NOTICE 'mining_concessions table created with spatial support';
    RAISE NOTICE 'Indexes created for optimal performance';
    RAISE NOTICE 'Views created for easy querying and analytics';
    RAISE NOTICE 'Ready for data import from ArcGIS!';
    RAISE NOTICE '=================================================';
END $$;
