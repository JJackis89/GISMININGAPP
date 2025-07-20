import { useState, useEffect } from 'react'
import { miningDataService } from '../services/miningDataService'
import { DashboardStats, MiningConcession } from '../types'
import { BarChart3, PieChart, TrendingUp, AlertTriangle } from 'lucide-react'

interface AnalyticsPanelProps {
  dataService: typeof miningDataService | null
  concessions: MiningConcession[]
}

export default function AnalyticsPanel({ dataService, concessions }: AnalyticsPanelProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (dataService && concessions.length > 0) {
      loadStats()
    }
  }, [dataService, concessions])

  const loadStats = async () => {
    if (!dataService) return
    setLoading(true)
    try {
      const dashboardStats = await dataService.getDashboardStats()
      setStats(dashboardStats)
    } catch (error) {
      console.error('Failed to load analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-epa-orange-500"></div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center text-gray-500 py-8">
        <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p>Analytics will appear when data is loaded</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
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
              <div className="text-xs text-yellow-700">Expiring Soon</div>
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
              {stats.totalAreaCovered.toLocaleString()} ha
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
      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
        <div className="text-xs text-gray-600">
          <div className="font-medium">📊 Real-time Analytics</div>
          <div className="mt-1">
            • Data source: EPA Mining Database via ArcGIS
            • Last updated: {new Date().toLocaleTimeString()}
            • Refresh rate: Every 5 minutes
          </div>
        </div>
      </div>
    </div>
  )
}
