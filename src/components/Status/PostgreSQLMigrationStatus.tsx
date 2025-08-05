import React, { useState, useEffect } from 'react'
import { Database, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react'
import { dataSourceConfig } from '../../services/dataSourceConfig'
import { postgresDataService } from '../../services/postgresDataService'
import { unifiedDataService } from '../../services/unifiedDataService'

export default function PostgreSQLMigrationStatus() {
  const [status, setStatus] = useState<{
    isPostgreSQL: boolean
    isVerified: boolean
    lastSwitched: string
    recommendation: string
  } | null>(null)
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [connectionResult, setConnectionResult] = useState<{
    success: boolean
    message?: string
  } | null>(null)

  useEffect(() => {
    loadStatus()
  }, [])

  const loadStatus = () => {
    const config = dataSourceConfig.getCurrentConfig()
    const statusInfo = dataSourceConfig.getDataSourceStatus()
    
    setStatus({
      isPostgreSQL: config.type === 'postgresql',
      isVerified: config.connectionVerified,
      lastSwitched: statusInfo.lastSwitched,
      recommendation: statusInfo.recommendation
    })
  }

  const testPostgreSQLConnection = async () => {
    setIsTestingConnection(true)
    setConnectionResult(null)

    try {
      const result = await postgresDataService.testConnection()
      setConnectionResult(result)
      
      if (result.success) {
        dataSourceConfig.markConnectionVerified()
        loadStatus()
      }
    } catch (error) {
      setConnectionResult({
        success: false,
        message: error instanceof Error ? error.message : 'Connection test failed'
      })
    } finally {
      setIsTestingConnection(false)
    }
  }

  const refreshDataService = async () => {
    try {
      await unifiedDataService.initialize()
      loadStatus()
    } catch (error) {
      console.error('Failed to refresh data service:', error)
    }
  }

  if (!status) {
    return (
      <div className="animate-pulse bg-gray-100 rounded-lg p-4">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    )
  }

  return (
    <div className={`border rounded-lg p-4 ${
      status.isPostgreSQL 
        ? status.isVerified 
          ? 'border-green-200 bg-green-50' 
          : 'border-yellow-200 bg-yellow-50'
        : 'border-blue-200 bg-blue-50'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <Database className={`h-5 w-5 mr-2 ${
            status.isPostgreSQL 
              ? status.isVerified ? 'text-green-600' : 'text-yellow-600'
              : 'text-blue-600'
          }`} />
          <div>
            <h3 className="font-medium text-gray-900">
              {status.isPostgreSQL ? 'PostgreSQL Database Backend' : 'ArcGIS Online Backend'}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {status.isPostgreSQL 
                ? '🎉 Successfully migrated to PostgreSQL! Your app now uses a local database backend.'
                : 'Currently using ArcGIS Online as the data source.'}
            </p>
          </div>
        </div>

        <div className="flex items-center">
          {status.isPostgreSQL && status.isVerified && (
            <CheckCircle className="h-5 w-5 text-green-500" />
          )}
          {status.isPostgreSQL && !status.isVerified && (
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
          )}
        </div>
      </div>

      {status.isPostgreSQL && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Connection Status:</span>
            <span className={`font-medium ${
              status.isVerified ? 'text-green-600' : 'text-yellow-600'
            }`}>
              {status.isVerified ? 'Verified' : 'Needs Verification'}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Migrated:</span>
            <span className="text-gray-800">{status.lastSwitched}</span>
          </div>

          {!status.isVerified && (
            <div className="flex gap-2 pt-2">
              <button
                onClick={testPostgreSQLConnection}
                disabled={isTestingConnection}
                className="inline-flex items-center px-3 py-1.5 border border-yellow-300 rounded text-sm font-medium text-yellow-700 bg-yellow-100 hover:bg-yellow-200 disabled:opacity-50"
              >
                {isTestingConnection ? (
                  <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <Database className="h-4 w-4 mr-1" />
                )}
                {isTestingConnection ? 'Testing...' : 'Test Connection'}
              </button>
              
              <button
                onClick={refreshDataService}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </button>
            </div>
          )}

          {connectionResult && (
            <div className={`mt-2 p-2 rounded text-sm ${
              connectionResult.success 
                ? 'bg-green-100 text-green-700 border border-green-200'
                : 'bg-red-100 text-red-700 border border-red-200'
            }`}>
              {connectionResult.message || (connectionResult.success ? 'Connection successful!' : 'Connection failed')}
            </div>
          )}
        </div>
      )}

      {status.recommendation && (
        <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
          <strong>💡 Tip:</strong> {status.recommendation}
        </div>
      )}

      {status.isPostgreSQL && status.isVerified && (
        <div className="mt-3 p-3 bg-green-100 border border-green-200 rounded">
          <h4 className="text-sm font-medium text-green-800 mb-2">✅ Migration Complete - Benefits Active:</h4>
          <ul className="text-xs text-green-700 space-y-1">
            <li>• Real-time database editing reflects immediately in the app</li>
            <li>• Advanced spatial queries with PostGIS functions</li>
            <li>• Better performance with local database access</li>
            <li>• Full SQL control over your mining concessions data</li>
            <li>• No dependency on external ArcGIS Online services</li>
          </ul>
        </div>
      )}
    </div>
  )
}
