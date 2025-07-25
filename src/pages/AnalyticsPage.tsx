import { useState, useEffect } from 'react'
import ChartsSection from '../components/Charts/ChartsSection'
import StatsCards from '../components/Charts/StatsCards'
import { DashboardStats } from '../types'
import miningDataService from '../services/miningDataService'
import { BarChart, TrendingUp, PieChart, Activity } from 'lucide-react'

export default function AnalyticsPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalConcessions: 0,
    activePermits: 0,
    expiredPermits: 0,
    soonToExpire: 0,
    totalAreaCovered: 0,
    concessionsByRegion: {},
    concessionsByType: {}
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        console.log('🔄 Loading real mining concessions data for analytics...')
        
        // Initialize the mining data service and load real data
        await miningDataService.initialize()
        const realStats = await miningDataService.getDashboardStats()
        
        console.log('✅ Loaded real analytics data:', realStats)
        setStats(realStats)
      } catch (err) {
        console.error('❌ Error loading analytics data:', err)
        // Fallback to empty stats
        setStats({
          totalConcessions: 0,
          activePermits: 0,
          expiredPermits: 0,
          soonToExpire: 0,
          totalAreaCovered: 0,
          concessionsByRegion: {},
          concessionsByType: {}
        })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-epa-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading real-time analytics data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-epa-orange-900">Analytics & Insights</h1>
          <p className="text-gray-600">Comprehensive analysis of mining concession data</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-epa-blue-100 rounded-lg">
              <BarChart className="h-6 w-6 text-epa-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Area</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalAreaCovered.toLocaleString()} ha</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-epa-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-epa-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round((stats.activePermits / stats.totalConcessions) * 100)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-epa-orange-100 rounded-lg">
              <PieChart className="h-6 w-6 text-epa-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Regions</p>
              <p className="text-2xl font-bold text-gray-900">
                {Object.keys(stats.concessionsByRegion).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <Activity className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
              <p className="text-2xl font-bold text-gray-900">{stats.soonToExpire}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Charts Section */}
      <ChartsSection stats={stats} />

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Permit Status Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Permits</span>
              <span className="font-semibold text-epa-green-600">{stats.activePermits}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Expired Permits</span>
              <span className="font-semibold text-red-600">{stats.expiredPermits}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Soon to Expire</span>
              <span className="font-semibold text-epa-orange-600">{stats.soonToExpire}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Regional Distribution</h3>
          <div className="space-y-3">
            {Object.entries(stats.concessionsByRegion).map(([region, count]) => (
              <div key={region} className="flex justify-between items-center">
                <span className="text-gray-600">{region}</span>
                <span className="font-semibold text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
