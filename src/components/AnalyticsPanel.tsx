import { useState, useEffect } from 'react'
import { miningDataService } from '../services/miningDataService'
import { dataRefreshService } from '../services/dataRefreshService'
import { DashboardStats, MiningConcession } from '../types'
import { BarChart3, PieChart, TrendingUp, AlertTriangle, RefreshCw } from 'lucide-react'

interface AnalyticsPanelProps {
  dataService?: typeof miningDataService | null
  concessions?: MiningConcession[]
}

export default function AnalyticsPanel({ dataService, concessions }: AnalyticsPanelProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  useEffect(() => {
    // Always load fresh data from mining data service
    loadStatsFromHostedLayer()
    
    // Register refresh callback with the data refresh service
    const refreshCallback = () => {
      console.log('🔄 AnalyticsPanel: Refreshing data due to external change...')
      loadStatsFromHostedLayer()
    }

    // Register the callback
    dataRefreshService.registerRefreshCallback(refreshCallback)

    // Cleanup: unregister callback when component unmounts
    return () => {
      dataRefreshService.unregisterRefreshCallback(refreshCallback)
    }
  }, [])

  const loadStatsFromHostedLayer = async () => {
    setLoading(true)
    try {
      console.log('📊 AnalyticsPanel: Loading live stats from hosted layer...')
      
      // Initialize and fetch fresh data from hosted layer
      await miningDataService.initialize()
      const concessions = await miningDataService.getMiningConcessions(true) // Force refresh for fresh data
      
      // Calculate comprehensive statistics using exact hosted layer data
      const today = new Date()
      const sixMonthsFromNow = new Date()
      sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6)
      
      const calculatedStats: DashboardStats = {
        totalConcessions: concessions.length,
        activePermits: concessions.filter(c => {
          // Only count as active if status is Active AND not expired
          if (c.status !== 'Active') return false
          const expiryDate = new Date(c.permitExpiryDate)
          // If expiry date is invalid, consider it active
          if (isNaN(expiryDate.getTime()) || c.permitExpiryDate === 'Not Specified') return true
          // Only active if not past expiry date
          return expiryDate >= today
        }).length,
        expiredPermits: concessions.filter(c => {
          // Count as expired if status is Expired OR if expiry date has passed
          const expiryDate = new Date(c.permitExpiryDate)
          // Skip if expiry date is invalid
          if (isNaN(expiryDate.getTime()) || c.permitExpiryDate === 'Not Specified') {
            return c.status === 'Expired'
          }
          // Expired if status is Expired OR (Active but past expiry date)
          return c.status === 'Expired' || (expiryDate < today && c.status === 'Active')
        }).length,
        soonToExpire: concessions.filter(c => {
          // Only count active permits that are approaching expiry
          if (c.status !== 'Active') return false
          const expiryDate = new Date(c.permitExpiryDate)
          // Check if expiry date is valid and within the next 6 months
          return !isNaN(expiryDate.getTime()) && 
                 c.permitExpiryDate !== 'Not Specified' &&
                 expiryDate > today && 
                 expiryDate <= sixMonthsFromNow
        }).length,
        totalAreaCovered: concessions.reduce((total, c) => total + (c.size || 0), 0),
        
        // Use exact hosted layer field data for breakdowns
        concessionsByRegion: concessions.reduce((acc, c) => {
          if (c.region) {
            acc[c.region] = (acc[c.region] || 0) + 1
          }
          return acc
        }, {} as Record<string, number>),
        
        concessionsByType: concessions.reduce((acc, c) => {
          // Only include records with valid permitType data from hosted layer
          if (c.permitType && c.permitType !== 'Not Specified' && c.permitType !== 'null' && c.permitType !== '') {
            acc[c.permitType] = (acc[c.permitType] || 0) + 1
          }
          return acc
        }, {} as Record<string, number>)
      }
      
      console.log('✅ AnalyticsPanel: Loaded live stats:', calculatedStats)
      console.log('🔍 AnalyticsPanel: Sample concession data:', concessions.slice(0, 2))
      console.log('📊 AnalyticsPanel: Field usage summary:', {
        regionsFound: Object.keys(calculatedStats.concessionsByRegion).length,
        typesFound: Object.keys(calculatedStats.concessionsByType).length,
        statusBreakdown: {
          active: calculatedStats.activePermits,
          expired: calculatedStats.expiredPermits, 
          pending: calculatedStats.soonToExpire
        }
      })
      setStats(calculatedStats)
      setLastUpdate(new Date())
    } catch (error) {
      console.error('❌ AnalyticsPanel: Failed to load analytics:', error)
      setStats(null)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center h-48">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 mx-auto mb-4 text-epa-orange-500 animate-spin" />
            <p className="text-gray-600">Loading live analytics from hosted layer...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="space-y-4">
        <div className="text-center text-gray-500 py-8">
          <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p>Analytics will appear when hosted layer data is loaded</p>
          <button 
            onClick={loadStatsFromHostedLayer}
            className="mt-3 px-4 py-2 bg-epa-orange-500 text-white rounded-lg text-sm hover:bg-epa-orange-600"
          >
            Load Analytics
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Key Metrics */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-blue-900">Live Hosted Layer Data</h3>
          <div className="text-xs text-blue-700">
            {lastUpdate && `Last synced: ${lastUpdate.toLocaleTimeString()}`}
          </div>
        </div>
        <div className="text-xs text-blue-700 space-y-1">
          <div>✓ Using exact hosted layer fields: Name, Size, LicenseStatus, LicenseType, District, Region</div>
          <div>✓ ContactPerson mapped to "Contact Person" in UI</div>
          <div>✓ Real-time area calculations converted from square meters to acres</div>
          <div>✓ Automatic status decoding (Active=1, Suspended=2, Expired=3, Under Review=4)</div>
          <div>✓ License type decoding (Reconnaissance=1, Prospecting=2, Mining Lease=3, Small Scale=4)</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-900">{stats.totalConcessions}</div>
              <div className="text-xs text-blue-700">Total Concessions</div>
            </div>
            <BarChart3 className="h-6 w-6 text-blue-600" />
          </div>
        </div>

        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-900">{stats.activePermits}</div>
              <div className="text-xs text-green-700">Active Permits</div>
            </div>
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
        </div>

        <div className="bg-red-50 p-3 rounded-lg border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-red-900">{stats.expiredPermits}</div>
              <div className="text-xs text-red-700">Expired Permits</div>
            </div>
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
        </div>

        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-yellow-900">{stats.soonToExpire}</div>
              <div className="text-xs text-yellow-700">Due for Renewal</div>
            </div>
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Total Area */}
      <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xl font-bold text-purple-900">
              {stats.totalAreaCovered.toLocaleString()} acres
            </div>
            <div className="text-xs text-purple-700">Total Area Covered</div>
          </div>
          <PieChart className="h-6 w-6 text-purple-600" />
        </div>
      </div>

      {/* Concessions by Region */}
      <div className="bg-white p-3 rounded-lg border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Concessions by Region</h4>
        <div className="space-y-2">
          {Object.entries(stats.concessionsByRegion)
            .sort(([,a], [,b]) => b - a)
            .map(([region, count]) => (
              <div key={region} className="flex justify-between items-center">
                <span className="text-xs text-gray-700">{region}</span>
                <div className="flex items-center space-x-2">
                  <div 
                    className="bg-blue-200 h-2 rounded"
                    style={{ 
                      width: `${(count / Math.max(...Object.values(stats.concessionsByRegion))) * 60}px`,
                      minWidth: '8px'
                    }}
                  ></div>
                  <span className="text-xs font-medium text-gray-900 w-6 text-right">{count}</span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Concessions by Type */}
      <div className="bg-white p-3 rounded-lg border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Concessions by Type</h4>
        <div className="space-y-2">
          {Object.entries(stats.concessionsByType).map(([type, count]) => (
            <div key={type} className="flex justify-between items-center">
              <span className="text-xs text-gray-700 capitalize">{type.replace('-', ' ')}</span>
              <div className="flex items-center space-x-2">
                <div 
                  className="bg-green-200 h-2 rounded"
                  style={{ 
                    width: `${(count / Math.max(...Object.values(stats.concessionsByType))) * 60}px`,
                    minWidth: '8px'
                  }}
                ></div>
                <span className="text-xs font-medium text-gray-900 w-6 text-right">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Source Info */}
      <div className="bg-green-50 p-3 rounded-lg border border-green-200">
        <div className="text-xs text-green-800">
          <div className="font-medium flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            📊 Live Analytics from Hosted Layer
          </div>
          <div className="mt-1">
            • Data source: EPA MINING DATABASE (ArcGIS FeatureServer)
            • Last updated: {lastUpdate ? lastUpdate.toLocaleString() : 'Never'}
            • Auto-refresh: Enabled
            • Total concessions analyzed: {stats.totalConcessions}
          </div>
        </div>
      </div>
    </div>
  )
}
