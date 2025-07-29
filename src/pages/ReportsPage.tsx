import { useState, useEffect } from 'react'
import { FileText, Download, BarChart3 } from 'lucide-react'
import miningDataService from '../services/miningDataService'
import { MiningConcession, DashboardStats } from '../types'

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState('')
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  })
  const [concessions, setConcessions] = useState<MiningConcession[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  // Load real data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        console.log('🔄 Loading real mining concessions data for reports...')
        
        await miningDataService.initialize()
        const [realConcessions, realStats] = await Promise.all([
          miningDataService.getMiningConcessions(),
          miningDataService.getDashboardStats()
        ])
        
        setConcessions(realConcessions)
        setStats(realStats)
        console.log('✅ Loaded real data for reports:', realConcessions.length, 'concessions')
      } catch (error) {
        console.error('❌ Failed to load data for reports:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const reportTypes = [
    {
      id: 'compliance',
      title: 'Compliance Report',
      description: 'Environmental compliance status of all mining operations',
      icon: FileText
    },
    {
      id: 'permits',
      title: 'Permit Status Report',
      description: 'Current status of all mining permits and licenses',
      icon: FileText
    },
    {
      id: 'regional',
      title: 'Regional Analysis',
      description: 'Mining activity breakdown by administrative regions',
      icon: FileText
    },
    {
      id: 'expiry',
      title: 'Permit Expiry Report',
      description: 'Permits expiring within specified timeframe',
      icon: FileText
    },
    {
      id: 'revenue',
      title: 'Revenue Analysis',
      description: 'Revenue generation and fee collection analysis',
      icon: FileText
    },
    {
      id: 'environmental',
      title: 'Environmental Impact',
      description: 'Environmental monitoring and impact assessment data',
      icon: FileText
    }
  ]

  const handleGenerateReport = async () => {
    if (!selectedReport) {
      alert('Please select a report type')
      return
    }

    if (!stats || concessions.length === 0) {
      alert('Data is still loading. Please wait and try again.')
      return
    }
    
    setGenerating(true)
    
    try {
      const reportTitle = reportTypes.find(r => r.id === selectedReport)?.title || 'Report'
      console.log(`🔄 Generating ${reportTitle} with real EPA data...`)
      
      // Generate CSV export based on report type
      let csvData = ''
      let filename = ''
      
      switch (selectedReport) {
        case 'compliance':
          csvData = generateComplianceReport(concessions)
          filename = 'compliance_report.csv'
          break
        case 'permits':
          csvData = generatePermitStatusReport(concessions)
          filename = 'permit_status_report.csv'
          break
        case 'regional':
          csvData = generateRegionalAnalysis(concessions, stats)
          filename = 'regional_analysis_report.csv'
          break
        case 'expiry':
          csvData = generateExpiryReport(concessions)
          filename = 'permit_expiry_report.csv'
          break
        default:
          csvData = miningDataService.exportToCSV(concessions)
          filename = 'mining_concessions_report.csv'
      }
      
      // Download the report
      const blob = new Blob([csvData], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
      
      console.log(`✅ Generated and downloaded ${reportTitle}`)
    } catch (error) {
      console.error('❌ Failed to generate report:', error)
      alert('Failed to generate report. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  // Report generation helper functions
  const generateComplianceReport = (concessions: MiningConcession[]): string => {
    const headers = ['Concession ID', 'Name', 'Owner', 'Status', 'Region', 'Compliance Status', 'Last Updated']
    const rows = concessions.map(c => [
      c.id,
      c.name,
      c.owner,
      c.status,
      c.region,
      c.status === 'active' ? 'Compliant' : 'Non-Compliant',
      new Date().toLocaleDateString()
    ])
    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n')
  }

  const generatePermitStatusReport = (concessions: MiningConcession[]): string => {
    const headers = ['Concession ID', 'Name', 'Permit Type', 'Status', 'Expiry Date', 'Days Until Expiry']
    const rows = concessions.map(c => {
      const expiryDate = new Date(c.permitExpiryDate)
      const today = new Date()
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      return [
        c.id,
        c.name,
        c.permitType,
        c.status,
        c.permitExpiryDate,
        daysUntilExpiry.toString()
      ]
    })
    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n')
  }

  const generateRegionalAnalysis = (concessions: MiningConcession[], stats: DashboardStats): string => {
    const headers = ['Region', 'Total Concessions', 'Active Permits', 'Total Area (acres)']
    const regionData = Object.entries(stats.concessionsByRegion).map(([region, count]) => {
      const regionConcessions = concessions.filter(c => c.region === region)
      const activeCount = regionConcessions.filter(c => c.status === 'Active').length
      const totalArea = regionConcessions.reduce((sum, c) => sum + c.size, 0)
      return [region, count.toString(), activeCount.toString(), totalArea.toFixed(2)]
    })
    return [headers.join(','), ...regionData.map(row => row.join(','))].join('\n')
  }

  const generateExpiryReport = (concessions: MiningConcession[]): string => {
    const headers = ['Concession ID', 'Name', 'Owner', 'Expiry Date', 'Days Until Expiry', 'Priority']
    const today = new Date()
    const rows = concessions
      .map(c => {
        const expiryDate = new Date(c.permitExpiryDate)
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        let priority = 'Low'
        if (daysUntilExpiry < 30) priority = 'Critical'
        else if (daysUntilExpiry < 90) priority = 'High'
        else if (daysUntilExpiry < 180) priority = 'Medium'
        
        return [c.id, c.name, c.owner, c.permitExpiryDate, daysUntilExpiry.toString(), priority]
      })
      .sort((a, b) => parseInt(a[4]) - parseInt(b[4])) // Sort by days until expiry
    
    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-epa-orange-900">Reports & Documentation</h1>
          <p className="text-gray-600">Generate comprehensive reports for mining concession data</p>
        </div>
        {stats && (
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>📊 {stats.totalConcessions} Total Concessions</span>
            <span>✅ {stats.activePermits} Active</span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-epa-orange-500"></div>
          <span className="ml-3 text-gray-600">Loading real mining data for reports...</span>
        </div>
      ) : (

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Selection */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Available Reports</h2>
              <p className="text-sm text-gray-600">Select a report type to generate</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportTypes.map((report) => {
                  const Icon = report.icon
                  return (
                    <div
                      key={report.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedReport === report.id
                          ? 'border-epa-orange-500 bg-epa-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedReport(report.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <Icon className="h-6 w-6 text-epa-orange-600 flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{report.title}</h3>
                          <p className="text-xs text-gray-600 mt-1">{report.description}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Report Configuration */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Report Configuration</h2>
            </div>
            <div className="p-6 space-y-4">
              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Range
                </label>
                <div className="space-y-2">
                  <input
                    type="date"
                    placeholder="Start Date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-epa-orange-500 focus:border-epa-orange-500"
                  />
                  <input
                    type="date"
                    placeholder="End Date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-epa-orange-500 focus:border-epa-orange-500"
                  />
                </div>
              </div>

              {/* Report Format */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Export Format
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-epa-orange-500 focus:border-epa-orange-500">
                  <option value="pdf">PDF Document</option>
                  <option value="excel">Excel Spreadsheet</option>
                  <option value="csv">CSV File</option>
                  <option value="word">Word Document</option>
                </select>
              </div>

              {/* Include Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Include
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-epa-orange-600 focus:ring-epa-orange-500" defaultChecked />
                    <span className="ml-2 text-sm text-gray-600">Summary Statistics</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-epa-orange-600 focus:ring-epa-orange-500" defaultChecked />
                    <span className="ml-2 text-sm text-gray-600">Charts & Graphs</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-epa-orange-600 focus:ring-epa-orange-500" />
                    <span className="ml-2 text-sm text-gray-600">Raw Data Tables</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-epa-orange-600 focus:ring-epa-orange-500" />
                    <span className="ml-2 text-sm text-gray-600">Map Images</span>
                  </label>
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerateReport}
                disabled={generating || !stats}
                className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-md focus:ring-2 focus:ring-epa-orange-500 focus:ring-offset-2 ${
                  generating || !stats
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-epa-orange-600 hover:bg-epa-orange-700'
                } text-white`}
              >
                {generating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    <span>Generate Report</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Available Report Types */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Available Report Types</h2>
          <p className="text-sm text-gray-600">Quick access to generate reports with current EPA data</p>
        </div>
        <div className="p-6">
          {stats ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="h-8 w-8 text-epa-orange-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Compliance Dashboard</p>
                      <p className="text-xs text-gray-600">
                        {stats.activePermits} active permits, {stats.expiredPermits} expired
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedReport('compliance')
                      handleGenerateReport()
                    }}
                    className="text-xs px-3 py-1 bg-epa-orange-600 text-white rounded hover:bg-epa-orange-700"
                  >
                    Generate
                  </button>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-epa-orange-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Regional Analysis</p>
                      <p className="text-xs text-gray-600">
                        {Object.keys(stats.concessionsByRegion).length} regions covered
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedReport('regional')
                      handleGenerateReport()
                    }}
                    className="text-xs px-3 py-1 bg-epa-orange-600 text-white rounded hover:bg-epa-orange-700"
                  >
                    Generate
                  </button>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-epa-orange-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Permit Status Report</p>
                      <p className="text-xs text-gray-600">
                        {stats.totalConcessions} total concessions
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedReport('permits')
                      handleGenerateReport()
                    }}
                    className="text-xs px-3 py-1 bg-epa-orange-600 text-white rounded hover:bg-epa-orange-700"
                  >
                    Generate
                  </button>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-epa-orange-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Expiry Report</p>
                      <p className="text-xs text-gray-600">
                        {stats.soonToExpire} permits expiring soon
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedReport('expiry')
                      handleGenerateReport()
                    }}
                    className="text-xs px-3 py-1 bg-epa-orange-600 text-white rounded hover:bg-epa-orange-700"
                  >
                    Generate
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Reports will be available once data is loaded</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
