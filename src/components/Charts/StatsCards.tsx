import { TrendingUp, Calendar, MapPin, AlertTriangle } from 'lucide-react'
import { DashboardStats } from '../../types'

interface StatsCardsProps {
  stats: DashboardStats
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total Concessions',
      value: stats.totalConcessions,
      icon: MapPin,
      color: 'text-blue-600 bg-blue-100',
      trend: '+12%'
    },
    {
      title: 'Active Permits',
      value: stats.activePermits,
      icon: TrendingUp,
      color: 'text-green-600 bg-green-100',
      trend: '+8%'
    },
    {
      title: 'Expired Permits',
      value: stats.expiredPermits,
      icon: Calendar,
      color: 'text-red-600 bg-red-100',
      trend: '-3%'
    },
    {
      title: 'Soon to Expire',
      value: stats.soonToExpire,
      icon: AlertTriangle,
      color: 'text-yellow-600 bg-yellow-100',
      trend: '+15%'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{card.value.toLocaleString()}</p>
              </div>
              <div className={`p-3 rounded-full ${card.color}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-gray-500">vs last month: </span>
              <span className="text-sm font-medium text-green-600">{card.trend}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
