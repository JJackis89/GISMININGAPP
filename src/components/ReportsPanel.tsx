import { useState, useEffect } from 'react'
import { miningDataService } from '../services/miningDataService'
import { MiningConcession } from '../types'
import { FileText, Download, Calendar, MapPin, AlertTriangle, TrendingUp } from 'lucide-react'

interface ReportsPanelProps {
  dataService: typeof miningDataService | null
  concessions: MiningConcession[]
}

export default function ReportsPanel({ dataService, concessions }: ReportsPanelProps) {
  const [loading, setLoading] = useState(false)
  const [reportData, setReportData] = useState({
    expiringConcessions: [] as MiningConcession[],
    regionSummary: {} as Record<string, { count: number; totalArea: number }>,
    complianceStatus: { compliant: 0, expiring: 0, expired: 0 }
  })

  useEffect(() => {
    if (dataService && concessions.length > 0) {
      generateReportData()
    }
  }, [dataService, concessions])

  const generateReportData = async () => {
    setLoading(true)
    try {
      // Find expiring concessions (within 6 months)
      const sixMonthsFromNow = new Date()
      sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6)
      
      const expiring = concessions.filter(c => {
        const expiryDate = new Date(c.permitExpiryDate)
        return expiryDate <= sixMonthsFromNow && c.status === 'active'
      })

      // Generate region summary
      const regionSummary: Record<string, { count: number; totalArea: number }> = {}
      concessions.forEach(c => {
        if (!regionSummary[c.region]) {
          regionSummary[c.region] = { count: 0, totalArea: 0 }
        }
        regionSummary[c.region].count += 1
        regionSummary[c.region].totalArea += c.size
      })

      // Calculate compliance status
      const compliant = concessions.filter(c => c.status === 'Active').length
      const expired = concessions.filter(c => c.status === 'Expired').length
      const expiringCount = expiring.length

      setReportData({
        expiringConcessions: expiring.slice(0, 10), // Show top 10
        regionSummary,
        complianceStatus: { compliant, expiring: expiringCount, expired }
      })
    } catch (error) {
      console.error('Failed to generate report data:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateCSVReport = () => {
    const csvContent = [
      // Headers
      'ID,Name,Contact Person,Region,District,Size (acres),License Type,License Status,Expiry Date',
      // Data rows
      ...concessions.map(c => 
        `${c.id},"${c.name}","${c.owner}",${c.region},${c.district},${c.size},${c.permitType},${c.status},${c.permitExpiryDate}`
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mining-concessions-report-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-epa-orange-500"></div>
      </div>
    )
  }

  if (!dataService || concessions.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p>Reports will be generated when data is loaded</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Report Actions */}
      <div className="flex space-x-2">
        <button 
          onClick={generateCSVReport}
          className="flex items-center space-x-2 px-3 py-2 bg-epa-orange-600 text-white rounded-md text-sm hover:bg-epa-orange-700 transition-colors"
        >
          <Download className="h-4 w-4" />
          <span>Export CSV</span>
        </button>
        <button className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors">
          <FileText className="h-4 w-4" />
          <span>Full Report</span>
        </button>
      </div>

      {/* Compliance Overview */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
          <TrendingUp className="h-4 w-4 mr-2" />
          Compliance Overview
        </h4>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-green-50 rounded border border-green-200">
            <div className="text-lg font-bold text-green-900">{reportData.complianceStatus.compliant}</div>
            <div className="text-xs text-green-700">Compliant</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded border border-yellow-200">
            <div className="text-lg font-bold text-yellow-900">{reportData.complianceStatus.expiring}</div>
            <div className="text-xs text-yellow-700">Due for Renewal</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded border border-red-200">
            <div className="text-lg font-bold text-red-900">{reportData.complianceStatus.expired}</div>
            <div className="text-xs text-red-700">Expired</div>
          </div>
        </div>
      </div>

      {/* Expiring Concessions Alert */}
      {reportData.expiringConcessions.length > 0 && (
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h4 className="text-sm font-semibold text-yellow-900 mb-3 flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Permits Due for Renewal (Next 6 Months)
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {reportData.expiringConcessions.map((concession) => (
              <div key={concession.id} className="p-2 bg-yellow-100 rounded text-xs">
                <div className="font-medium text-yellow-900">{concession.name}</div>
                <div className="text-yellow-800">{concession.owner}</div>
                <div className="text-yellow-700 flex items-center space-x-4 mt-1">
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Expires: {new Date(concession.permitExpiryDate).toLocaleDateString()}
                  </span>
                  <span className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {concession.region}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Regional Summary */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
          <MapPin className="h-4 w-4 mr-2" />
          Regional Summary
        </h4>
        <div className="space-y-3">
          {Object.entries(reportData.regionSummary)
            .sort(([,a], [,b]) => b.count - a.count)
            .map(([region, data]) => (
              <div key={region} className="p-3 bg-gray-50 rounded">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-gray-900">{region}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      {data.count} concessions • {data.totalArea.toLocaleString()} acres
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-blue-900">{data.count}</div>
                    <div className="text-xs text-gray-500">permits</div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Data Summary */}
      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
        <div className="text-xs text-gray-600">
          <div className="font-medium">📋 Report Summary</div>
          <div className="mt-2 space-y-1">
            <div>• Total concessions analyzed: {concessions.length}</div>
            <div>• Data source: EPA Mining Database via ArcGIS</div>
            <div>• Report generated: {new Date().toLocaleString()}</div>
            <div>• Coverage: All active mining regions in Ghana</div>
          </div>
        </div>
      </div>
    </div>
  )
}
