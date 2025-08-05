import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { DashboardStats } from '../../types'

interface ChartsSectionProps {
  stats: DashboardStats
}

const COLORS = ['#f97316', '#22c55e', '#3b82f6', '#ea580c', '#16a34a', '#2563eb', '#84cc16', '#f59e0b']

export default function ChartsSection({ stats }: ChartsSectionProps) {
  const regionData = Object.entries(stats.concessionsByRegion).map(([region, count]) => ({
    region,
    count
  }))

  const districtData = Object.entries(stats.concessionsByDistrict).map(([district, count]) => ({
    district,
    count
  }))

  const typeData = Object.entries(stats.concessionsByType).map(([type, count]) => ({
    type: type.replace('-', ' '),
    count
  }))

  const miningMethodData = Object.entries(stats.concessionsByMiningMethod).map(([method, count]) => ({
    name: method,  // Use 'name' for Recharts legend
    value: count,  // Use 'value' for Recharts data
    method: method, // Keep method for reference
    count: count
  }))

  // Debug the mining method data
  console.log('Mining Method Data for Chart:', miningMethodData)
  console.log('Raw concessionsByMiningMethod:', stats.concessionsByMiningMethod)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Concessions by Region */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Concessions by Region</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={regionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="region" 
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={12}
            />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#f97316" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Mining Method Distribution */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Mining Method Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={miningMethodData}
              cx="50%"
              cy="45%"
              labelLine={false}
              label={({ name, value, percent, cx, cy, midAngle, innerRadius, outerRadius }) => {
                const percentage = (percent * 100).toFixed(1);
                const displayName = name === 'Not Specified' ? 'N/A' : name;
                
                // Calculate label position with more spacing for small slices
                const RADIAN = Math.PI / 180;
                const radius = outerRadius + 25; // Increased spacing from pie
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);
                
                return (
                  <text 
                    x={x} 
                    y={y} 
                    fill="#374151" 
                    textAnchor={x > cx ? 'start' : 'end'} 
                    dominantBaseline="central"
                    fontSize="12"
                    fontWeight="500"
                  >
                    {`${displayName}: ${value} (${percentage}%)`}
                  </text>
                );
              }}
              outerRadius={60}
              fill="#8884d8"
              dataKey="value"
            >
              {miningMethodData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name) => [`${value} concessions`, name === 'Not Specified' ? 'Not Specified' : name]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Concessions by Type */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Concessions by Type</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={typeData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
            >
              {typeData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
