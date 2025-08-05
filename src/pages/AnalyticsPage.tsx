import { useState, useEffect } from 'react'
import ChartsSection from '../components/Charts/ChartsSection'
import RefreshButton from '../components/ui/RefreshButton'
import { DashboardStats } from '../types'
import miningDataService from '../services/miningDataService'
import { dataRefreshService } from '../services/dataRefreshService'
import { BarChart, TrendingUp, PieChart, Activity, MapPin } from 'lucide-react'
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function AnalyticsPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalConcessions: 0,
    activePermits: 0,
    expiredPermits: 0,
    soonToExpire: 0,
    totalAreaCovered: 0,
    concessionsByRegion: {},
    concessionsByDistrict: {},
    concessionsByType: {},
    concessionsByMiningMethod: {}
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
          concessionsByDistrict: {},
          concessionsByType: {},
          concessionsByMiningMethod: {}
        })
      } finally {
        setLoading(false)
      }
    }

    // Register refresh callback with the data refresh service
    const refreshCallback = () => {
      console.log('🔄 AnalyticsPage: Refreshing data due to external change...')
      loadData()
    }

    // Register the callback
    dataRefreshService.registerRefreshCallback(refreshCallback)

    // Initial load
    loadData()

    // Cleanup: unregister callback when component unmounts
    return () => {
      dataRefreshService.unregisterRefreshCallback(refreshCallback)
    }
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
        <RefreshButton />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MapPin className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Concessions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalConcessions.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-epa-blue-100 rounded-lg">
              <BarChart className="h-6 w-6 text-epa-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Area</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalAreaCovered.toLocaleString()} acres</p>
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
            <div className="p-2 bg-red-100 rounded-lg">
              <PieChart className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Expired Permits</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.expiredPermits}
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
              <p className="text-sm font-medium text-gray-600">Due for Renewal</p>
              <p className="text-2xl font-bold text-gray-900">{stats.soonToExpire}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <ChartsSection stats={stats} />

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">District Distribution</h3>
          <ResponsiveContainer width="100%" height={400}>
            <RechartsBarChart data={Object.entries(stats.concessionsByDistrict).map(([district, count]) => ({
              district,
              count
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="district" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#f97316" />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
