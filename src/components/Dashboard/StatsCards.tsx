import { DashboardStats } from '../../types'
import { 
  MapPin, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Square 
} from 'lucide-react'

interface StatsCardsProps {
  stats: DashboardStats
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total Concessions',
      value: stats.totalConcessions,
      icon: MapPin,
      color: 'bg-epa-blue-500',
      textColor: 'text-epa-blue-600'
    },
    {
      title: 'Active Permits',
      value: stats.activePermits,
      icon: CheckCircle,
      color: 'bg-epa-green-500',
      textColor: 'text-epa-green-600'
    },
    {
      title: 'Expired Permits',
      value: stats.expiredPermits,
      icon: XCircle,
      color: 'bg-red-500',
      textColor: 'text-red-600'
    },
    {
      title: 'Due for Renewal',
      value: stats.soonToExpire,
      icon: AlertTriangle,
      color: 'bg-epa-orange-500',
      textColor: 'text-epa-orange-600'
    },
    {
      title: 'Total Area (acres)',
      value: stats.totalAreaCovered.toLocaleString(),
      icon: Square,
      color: 'bg-purple-500',
      textColor: 'text-purple-600'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className={`${card.color} rounded-lg p-2`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className={`text-2xl font-bold ${card.textColor}`}>{card.value}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
