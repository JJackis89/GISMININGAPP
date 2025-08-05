$env:PGPASSWORD="Peekay1104"

Write-Host "===== EPA Mining Concessions Database Verification =====" -ForegroundColor Green
Write-Host ""

try {
    # Test 1: Basic Connection Test
    Write-Host "1. Testing Database Connection..." -ForegroundColor Yellow
    $connectionTest = & "C:\Program Files\PostgreSQL\17\bin\psql.exe" -h localhost -p 5432 -U postgres -d Concessions -c "SELECT 'Connection successful!' as status;" 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database connection successful" -ForegroundColor Green
    } else {
        Write-Host "❌ Database connection failed" -ForegroundColor Red
        exit 1
    }
    
    # Test 2: Table Existence
    Write-Host "2. Checking Table Existence..." -ForegroundColor Yellow
    $tableCheck = & "C:\Program Files\PostgreSQL\17\bin\psql.exe" -h localhost -p 5432 -U postgres -d Concessions -c "SELECT table_name FROM information_schema.tables WHERE table_name = 'mining_concessions';" -t 2>$null
    if ($tableCheck -match "mining_concessions") {
        Write-Host "✅ mining_concessions table exists" -ForegroundColor Green
    } else {
        Write-Host "❌ mining_concessions table not found" -ForegroundColor Red
    }
    
    # Test 3: Record Count
    Write-Host "3. Checking Total Records..." -ForegroundColor Yellow
    $recordCount = & "C:\Program Files\PostgreSQL\17\bin\psql.exe" -h localhost -p 5432 -U postgres -d Concessions -c "SELECT COUNT(*) FROM mining_concessions;" -t 2>$null
    $count = $recordCount.Trim()
    Write-Host "📊 Total Records: $count" -ForegroundColor Cyan
    
    if ([int]$count -gt 0) {
        Write-Host "✅ Data found in database!" -ForegroundColor Green
        
        # Test 4: Sample Data
        Write-Host "4. Sample Data (First 3 Records):" -ForegroundColor Yellow
        & "C:\Program Files\PostgreSQL\17\bin\psql.exe" -h localhost -p 5432 -U postgres -d Concessions -c "SELECT id, name, region, status FROM mining_concessions ORDER BY name LIMIT 3;" 2>$null
        
        # Test 5: Data Distribution
        Write-Host "5. Data Distribution by Status:" -ForegroundColor Yellow
        & "C:\Program Files\PostgreSQL\17\bin\psql.exe" -h localhost -p 5432 -U postgres -d Concessions -c "SELECT status, COUNT(*) as count FROM mining_concessions GROUP BY status ORDER BY count DESC;" 2>$null
        
        # Test 6: Region Distribution
        Write-Host "6. Data Distribution by Region:" -ForegroundColor Yellow
        & "C:\Program Files\PostgreSQL\17\bin\psql.exe" -h localhost -p 5432 -U postgres -d Concessions -c "SELECT region, COUNT(*) as count FROM mining_concessions WHERE region IS NOT NULL GROUP BY region ORDER BY count DESC LIMIT 5;" 2>$null
        
        # Test 7: Spatial Data Check
        Write-Host "7. Spatial Data Verification:" -ForegroundColor Yellow
        & "C:\Program Files\PostgreSQL\17\bin\psql.exe" -h localhost -p 5432 -U postgres -d Concessions -c "SELECT COUNT(CASE WHEN geometry IS NOT NULL THEN 1 END) as geometries, COUNT(CASE WHEN coordinates IS NOT NULL THEN 1 END) as coordinates FROM mining_concessions;" 2>$null
        
    } else {
        Write-Host "⚠️ No data found in mining_concessions table" -ForegroundColor Yellow
        Write-Host "The table exists but appears to be empty." -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "❌ Error during verification: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "===== Verification Complete =====" -ForegroundColor Green
