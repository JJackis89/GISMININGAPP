import React, { useState, useEffect } from 'react'
import { MiningConcession } from '../../types'
import { databaseService, ExportProgress } from '../../services/databaseService'
import { Database, AlertCircle, CheckCircle, X, Settings, Play, Eye, EyeOff } from 'lucide-react'

interface DatabaseExportToolProps {
  concessions: MiningConcession[]
  isOpen: boolean
  onClose: () => void
}

export default function DatabaseExportTool({ concessions, isOpen, onClose }: DatabaseExportToolProps) {
  const [config, setConfig] = useState({
    host: 'localhost',
    port: 5432,
    database: 'Concessions',
    username: 'postgres',
    password: 'Peekay1104'
  })
  const [isConfigured, setIsConfigured] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<{ success: boolean; message: string } | null>(null)
  const [exportProgress, setExportProgress] = useState<ExportProgress | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // Configure the database service with default/saved settings
      databaseService.configure(config)
      setIsConfigured(true)
    }
  }, [isOpen, config])

  const testConnection = async () => {
    setIsConnecting(true)
    setConnectionStatus(null)
    
    try {
      databaseService.configure(config)
      const result = await databaseService.testConnection()
      setConnectionStatus(result)
      setIsConfigured(result.success)
    } catch (error) {
      setConnectionStatus({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown connection error'
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const startExport = async () => {
    if (!isConfigured || isExporting) return

    setIsExporting(true)
    setExportProgress({ total: 0, processed: 0, errors: [], status: 'idle' })
    
    try {
      databaseService.resetExportProgress()
      
      // Start the export process
      await databaseService.exportConcessions(concessions)
      
      // Get final progress
      const finalProgress = databaseService.getExportProgress()
      setExportProgress(finalProgress)
      
    } catch (error) {
      console.error('Export failed:', error)
      const progress = databaseService.getExportProgress()
      progress.status = 'error'
      progress.errors.push(error instanceof Error ? error.message : 'Unknown export error')
      setExportProgress(progress)
    } finally {
      setIsExporting(false)
    }
  }

  // Poll for progress updates during export
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (isExporting) {
      interval = setInterval(() => {
        const progress = databaseService.getExportProgress()
        setExportProgress(progress)
        
        if (progress.status === 'completed' || progress.status === 'error') {
          setIsExporting(false)
        }
      }, 1000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isExporting])

  const handleClose = () => {
    if (!isExporting) {
      onClose()
      setExportProgress(null)
      setConnectionStatus(null)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Database className="h-6 w-6 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900">Export to PostgreSQL Database</h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isExporting}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Export Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Export Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Total Records:</span>
                <span className="ml-2 font-medium">{concessions.length.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-600">Target Table:</span>
                <span className="ml-2 font-medium">mining_concessions</span>
              </div>
            </div>
          </div>

          {/* Database Configuration */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-900">Database Configuration</h3>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
              >
                <Settings className="h-4 w-4" />
                {showAdvanced ? 'Hide' : 'Show'} Advanced
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {showAdvanced && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Host</label>
                      <input
                        type="text"
                        value={config.host}
                        onChange={(e) => setConfig({ ...config, host: e.target.value })}
                        disabled={isExporting}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                        placeholder="localhost"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Port</label>
                      <input
                        type="number"
                        value={config.port}
                        onChange={(e) => setConfig({ ...config, port: parseInt(e.target.value) || 5432 })}
                        disabled={isExporting}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                        placeholder="5432"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Database Name</label>
                <input
                  type="text"
                  value={config.database}
                  onChange={(e) => setConfig({ ...config, database: e.target.value })}
                  disabled={isExporting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                  placeholder="Concessions"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  value={config.username}
                  onChange={(e) => setConfig({ ...config, username: e.target.value })}
                  disabled={isExporting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                  placeholder="postgres"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={config.password}
                    onChange={(e) => setConfig({ ...config, password: e.target.value })}
                    disabled={isExporting}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Connection Status */}
          {connectionStatus && (
            <div className={`rounded-lg p-4 ${connectionStatus.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-center gap-2">
                {connectionStatus.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
                <span className={`text-sm font-medium ${connectionStatus.success ? 'text-green-800' : 'text-red-800'}`}>
                  {connectionStatus.message}
                </span>
              </div>
            </div>
          )}

          {/* Export Progress */}
          {exportProgress && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900">Export Progress</h3>
              
              {exportProgress.status === 'running' && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(exportProgress.processed / exportProgress.total) * 100}%` }}
                  />
                </div>
              )}
              
              <div className="text-sm text-gray-600">
                <div>Status: <span className="font-medium capitalize">{exportProgress.status}</span></div>
                <div>Progress: <span className="font-medium">{exportProgress.processed.toLocaleString()}</span> / <span className="font-medium">{exportProgress.total.toLocaleString()}</span> records</div>
                {exportProgress.errors.length > 0 && (
                  <div className="text-red-600">
                    Errors: <span className="font-medium">{exportProgress.errors.length}</span>
                  </div>
                )}
              </div>

              {exportProgress.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-red-800 mb-2">Export Errors:</h4>
                  <div className="text-sm text-red-700 space-y-1 max-h-32 overflow-y-auto">
                    {exportProgress.errors.slice(0, 10).map((error, index) => (
                      <div key={index}>{error}</div>
                    ))}
                    {exportProgress.errors.length > 10 && (
                      <div className="text-red-600 font-medium">
                        ... and {exportProgress.errors.length - 10} more errors
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <button
              onClick={testConnection}
              disabled={isConnecting || isExporting}
              className="px-4 py-2 text-sm font-medium text-purple-700 bg-purple-100 border border-purple-200 rounded-md hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isConnecting ? 'Testing...' : 'Test Connection'}
            </button>

            <div className="flex gap-3">
              <button
                onClick={handleClose}
                disabled={isExporting}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExporting ? 'Exporting...' : 'Cancel'}
              </button>

              <button
                onClick={startExport}
                disabled={!isConfigured || isExporting || isConnecting}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="h-4 w-4 mr-2" />
                {isExporting ? 'Exporting...' : 'Start Export'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
