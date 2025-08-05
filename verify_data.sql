-- Data Verification Script for PostgreSQL Concessions Database
-- Run this to verify your loaded mining concessions data

\echo '===== EPA Mining Concessions Database Verification ====='
\echo ''

-- 1. Basic Record Count
\echo '1. Total Records:'
SELECT COUNT(*) as total_records FROM mining_concessions;
\echo ''

-- 2. Data Distribution by Status
\echo '2. Records by Status:'
SELECT status, COUNT(*) as count FROM mining_concessions GROUP BY status ORDER BY count DESC;
\echo ''

-- 3. Data Distribution by Region
\echo '3. Records by Region:'
SELECT region, COUNT(*) as count FROM mining_concessions WHERE region IS NOT NULL GROUP BY region ORDER BY count DESC;
\echo ''

-- 4. Data Distribution by Permit Type
\echo '4. Records by Permit Type:'
SELECT permit_type, COUNT(*) as count FROM mining_concessions WHERE permit_type IS NOT NULL GROUP BY permit_type ORDER BY count DESC;
\echo ''

-- 5. Sample Records
\echo '5. Sample Records (First 5):'
SELECT id, name, size, owner, district, region, status, permit_type FROM mining_concessions ORDER BY name LIMIT 5;
\echo ''

-- 6. Data Quality Checks
\echo '6. Data Quality Summary:'
SELECT 
    COUNT(*) as total_records,
    COUNT(CASE WHEN name IS NOT NULL AND name != '' THEN 1 END) as records_with_name,
    COUNT(CASE WHEN size IS NOT NULL AND size > 0 THEN 1 END) as records_with_size,
    COUNT(CASE WHEN geometry IS NOT NULL THEN 1 END) as records_with_geometry,
    COUNT(CASE WHEN coordinates IS NOT NULL THEN 1 END) as records_with_coordinates,
    COUNT(CASE WHEN region IS NOT NULL AND region != '' THEN 1 END) as records_with_region
FROM mining_concessions;
\echo ''

-- 7. Size Statistics
\echo '7. Size Statistics (in acres):'
SELECT 
    MIN(size) as min_size,
    MAX(size) as max_size,
    AVG(size)::DECIMAL(10,2) as avg_size,
    SUM(size)::DECIMAL(12,2) as total_area
FROM mining_concessions WHERE size IS NOT NULL;
\echo ''

-- 8. PostGIS Spatial Data Check
\echo '8. Spatial Data Verification:'
SELECT 
    COUNT(CASE WHEN geometry IS NOT NULL THEN 1 END) as geometries_present,
    COUNT(CASE WHEN centroid IS NOT NULL THEN 1 END) as centroids_present,
    COUNT(CASE WHEN ST_IsValid(geometry) THEN 1 END) as valid_geometries
FROM mining_concessions;
\echo ''

-- 9. Recent Records
\echo '9. Most Recently Added Records:'
SELECT id, name, district, region, created_at FROM mining_concessions ORDER BY created_at DESC LIMIT 3;
\echo ''

\echo '===== Verification Complete ====='
