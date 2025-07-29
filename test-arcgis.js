// Enhanced ArcGIS test with live data refresh capabilities
console.log('🧪 Testing ArcGIS connectivity and live data integration...')

// Test if the feature service URL is accessible
const testUrl = 'https://services6.arcgis.com/Av3KhOzUMUMSORVt/arcgis/rest/services/Mining_Concessions/FeatureServer/0?f=json'
const queryUrl = 'https://services6.arcgis.com/Av3KhOzUMUMSORVt/arcgis/rest/services/Mining_Concessions/FeatureServer/0/query?where=1%3D1&outFields=*&f=json'

// Test service metadata
fetch(testUrl)
  .then(response => response.json())
  .then(data => {
    console.log('✅ ArcGIS service is accessible')
    console.log('📊 Service info:', {
      name: data.name,
      type: data.type,
      geometryType: data.geometryType,
      maxRecordCount: data.maxRecordCount,
      capabilities: data.capabilities,
      editingInfo: data.editingInfo
    })
  })
  .catch(error => {
    console.error('❌ ArcGIS service metadata test failed:', error)
  })

// Test actual data query
fetch(queryUrl)
  .then(response => response.json())
  .then(data => {
    console.log('✅ ArcGIS data query successful')
    console.log('📊 Current data summary:', {
      totalFeatures: data.features?.length || 0,
      fields: data.fields?.map(f => f.name).slice(0, 5).join(', ') + '...',
      lastUpdate: new Date().toLocaleTimeString()
    })

    // Show sample of actual data with field mapping analysis
    if (data.features && data.features.length > 0) {
      const sample = data.features[0].attributes
      console.log('📝 Sample record raw attributes:', sample)
      
      // Test field mapping
      console.log('🗺️  Field mapping analysis:')
      console.log('  Name mapping:', sample.Name)
      console.log('  Size mapping:', sample.Size, '(converting from sq meters to acres)')
      console.log('  LicenseStatus mapping:', sample.LicenseStatus, '(1=Active, 2=Suspended, 3=Expired, 4=Under Review)')
      console.log('  LicenseType mapping:', sample.LicenseType, '(1=Reconnaissance, 2=Prospecting, 3=Mining Lease, 4=Small Scale)')
      console.log('  District mapping:', sample.District)
      console.log('  Region mapping:', sample.Region)
      console.log('  ContactPerson mapping:', sample.ContactPerson)
      
      // Test conversions
      if (sample.Size) {
        const acres = Math.round(sample.Size * 0.000247105)
        console.log(`  🔄 Size conversion: ${sample.Size} sq meters = ${acres} acres`)
      }
    }

    // Trigger dashboard refresh after successful test
    if (window.dataRefreshService) {
      console.log('🔄 Triggering dashboard refresh after test...')
      window.dataRefreshService.refreshWithDelay(1000)
    }
  })
  .catch(error => {
    console.error('❌ ArcGIS data query test failed:', error)
  })

// Test if the ArcGIS JavaScript API is available
if (window.require) {
  console.log('✅ ArcGIS JavaScript API is available')
} else {
  console.error('❌ ArcGIS JavaScript API not loaded')
}

// Make dataRefreshService and testing functions available globally
if (typeof window !== 'undefined') {
  import('./src/services/dataRefreshService.js').then(module => {
    window.dataRefreshService = module.dataRefreshService
    console.log('🔧 dataRefreshService available globally for testing')
    
    // Add global testing functions
    window.testRefresh = () => {
      console.log('🔄 Manual refresh triggered from test...')
      window.dataRefreshService.forceRefreshAll()
    }
    
    window.testDelayedRefresh = (delay = 2000) => {
      console.log(`🔄 Delayed refresh triggered (${delay}ms)...`)
      window.dataRefreshService.refreshWithDelay(delay)
    }
    
    window.testDataQuery = async () => {
      console.log('🔍 Testing live data query...')
      try {
        const response = await fetch(queryUrl)
        const data = await response.json()
        console.log('📊 Live data check:', {
          features: data.features?.length || 0,
          timestamp: new Date().toLocaleString()
        })
        return data
      } catch (error) {
        console.error('❌ Data query test failed:', error)
        return null
      }
    }
    
    console.log('🛠️  Available test functions:')
    console.log('   - testRefresh(): Force immediate refresh')
    console.log('   - testDelayedRefresh(ms): Delayed refresh')
    console.log('   - testDataQuery(): Query live data')
    console.log('💡 After editing hosted layer, run: testDelayedRefresh(3000)')
  }).catch(err => {
    console.warn('Could not load dataRefreshService:', err)
  })
}

export {}
