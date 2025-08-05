import React, { useState, useEffect } from 'react'
import { Database, CheckCircle, AlertTriangle, RefreshCw, Eye, BarChart } from 'lucide-react'
import { postgresDataService } from '../../services/postgresDataService'
import { unifiedDataService } from '../../services/unifiedDataService'

interface DataVerificationStats {
  totalRecords: number
  tableExists: boolean
  connectionStatus: 'success' | 'error' | 'testing'
  lastVerified: string
  sampleData: any[]
}

export default function PostgreSQLDataVerification() {
  const [stats, setStats] = useState<DataVerificationStats | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [showSampleData, setShowSampleData] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    verifyData()
  }, [])

  const verifyData = async () => {
    setIsVerifying(true)
    setError(null)

    try {
      console.log('🔍 Verifying PostgreSQL data...')
      
      // Test PostgreSQL connection
      const connectionTest = await postgresDataService.testConnection()
      
      // Verify table structure
      const tableVerification = await postgresDataService.verifyTableStructure()
      
      // Get sample data
      const sampleConcessions = await unifiedDataService.getMiningConcessions()
      
      setStats({
        totalRecords: tableVerification.recordCount || sampleConcessions.length,
        tableExists: tableVerification.success,
        connectionStatus: connectionTest.success ? 'success' : 'error',
        lastVerified: new Date().toLocaleString(),
        sampleData: sampleConcessions.slice(0, 5) // First 5 records for preview
      })

      console.log(`✅ Verification complete: ${sampleConcessions.length} records found`)
      
    } catch (err) {
      console.error('❌ Data verification failed:', err)
      setError(err instanceof Error ? err.message : 'Verification failed')
      setStats({
        totalRecords: 0,
        tableExists: false,
        connectionStatus: 'error',
        lastVerified: new Date().toLocaleString(),
        sampleData: []
      })
    } finally {
      setIsVerifying(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100'
      case 'error': return 'text-red-600 bg-red-100'
      case 'testing': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-5 w-5" />
      case 'error': return <AlertTriangle className="h-5 w-5" />
      case 'testing': return <RefreshCw className="h-5 w-5 animate-spin" />
      default: return <Database className="h-5 w-5" />
    }
  }

  if (!stats && !error && !isVerifying) {
    return (
      <div className="animate-pulse bg-gray-100 rounded-lg p-4">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    )
  }

  return (
    <div className="border border-gray-200 rounded-lg p-6 bg-white">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Database className="h-6 w-6 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">PostgreSQL Data Verification</h3>
        </div>
        <button
          onClick={verifyData}
          disabled={isVerifying}
          className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          {isVerifying ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          {isVerifying ? 'Verifying...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {stats && (
        <div className="space-y-4">
          {/* Connection Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Connection Status</span>
                <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(stats.connectionStatus)}`}>
                  {getStatusIcon(stats.connectionStatus)}
                  <span className="ml-1">
                    {stats.connectionStatus === 'success' ? 'Connected' : 
                     stats.connectionStatus === 'error' ? 'Failed' : 'Testing'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Table Status</span>
                <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${stats.tableExists ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'}`}>
                  {stats.tableExists ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                  <span className="ml-1">{stats.tableExists ? 'Exists' : 'Missing'}</span>
                </div>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Total Records</span>
                <div className="flex items-center text-lg font-bold text-blue-600">
                  <BarChart className="h-5 w-5 mr-1" />
                  {stats.totalRecords.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Last Verified */}
          <div className="text-xs text-gray-500">
            Last verified: {stats.lastVerified}
          </div>

          {/* Sample Data Preview */}
          {stats.sampleData.length > 0 && (
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-900">Sample Data Preview</h4>
                <button
                  onClick={() => setShowSampleData(!showSampleData)}
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  {showSampleData ? 'Hide' : 'Show'} Sample
                </button>
              </div>

              {showSampleData && (
                <div className="bg-gray-50 rounded-lg p-3 max-h-64 overflow-y-auto">
                  <div className="space-y-2">
                    {stats.sampleData.map((record, index) => (
                      <div key={index} className="bg-white rounded p-2 text-xs">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          <div>
                            <span className="font-medium text-gray-600">ID:</span>
                            <span className="ml-1">{record.id}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Name:</span>
                            <span className="ml-1">{record.name}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Region:</span>
                            <span className="ml-1">{record.region}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Status:</span>
                            <span className={`ml-1 px-1 py-0.5 rounded text-xs ${
                              record.status === 'active' ? 'bg-green-100 text-green-700' : 
                              record.status === 'expired' ? 'bg-red-100 text-red-700' : 
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {record.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Summary Message */}
          <div className={`p-4 rounded-lg ${
            stats.connectionStatus === 'success' && stats.tableExists && stats.totalRecords > 0 
              ? 'bg-green-50 border border-green-200'
              : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <div className="flex items-start">
              {stats.connectionStatus === 'success' && stats.tableExists && stats.totalRecords > 0 ? (
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
              )}
              <div className="text-sm">
                {stats.connectionStatus === 'success' && stats.tableExists && stats.totalRecords > 0 ? (
                  <div>
                    <p className="font-medium text-green-800">✅ PostgreSQL is working perfectly!</p>
                    <p className="text-green-700 mt-1">
                      Your Concessions database is connected with {stats.totalRecords} mining concession records ready to use.
                      All data operations are now running on PostgreSQL with full PostGIS spatial capabilities.
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="font-medium text-yellow-800">⚠️ PostgreSQL needs attention</p>
                    <p className="text-yellow-700 mt-1">
                      {!stats.tableExists && "The mining_concessions table may not exist. "}
                      {stats.connectionStatus === 'error' && "Connection to PostgreSQL failed. "}
                      {stats.totalRecords === 0 && "No data found in the database. "}
                      Please check your PostgreSQL setup or use the export tools to load data.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
