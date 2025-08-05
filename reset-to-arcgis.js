/**
 * Reset EPA Mining App to Original ArcGIS Configuration
 * Run this script in browser console to clear PostgreSQL settings
 */

console.log('🔄 Resetting EPA Mining App to original ArcGIS configuration...')

// Clear data source configuration to force reset to ArcGIS default
localStorage.removeItem('epa_mining_data_source_config')

// Clear any PostgreSQL-related cached data
const keysToRemove = []
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i)
  if (key && (key.includes('postgres') || key.includes('sql') || key.includes('migration'))) {
    keysToRemove.push(key)
  }
}

keysToRemove.forEach(key => {
  localStorage.removeItem(key)
  console.log(`🗑️ Removed: ${key}`)
})

console.log('✅ Reset complete! Refresh the page to use ArcGIS.')
console.log('🗺️ The app will now use ArcGIS Online as the primary data source.')
