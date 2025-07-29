import React, { useState, useEffect } from 'react'
import { concessionEditingService } from '../../services/concessionEditingService'
import { miningDataService } from '../../services/miningDataService'
import { MiningConcession } from '../../types'
import { RefreshCw, Database, HardDrive, CheckCircle, AlertCircle } from 'lucide-react'

interface DataSourceDebugProps {
  className?: string
}

export default function DataSourceDebug({ className = '' }: DataSourceDebugProps) {
  const [hostedLayerCount, setHostedLayerCount] = useState<number>(0)
  const [editingServiceCount, setEditingServiceCount] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadCounts = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get hosted layer data
      await miningDataService.initialize()
      const hostedData = await miningDataService.getMiningConcessions()
      setHostedLayerCount(hostedData.length)

      // Get editing service data
      const editingData = await concessionEditingService.getAllConcessions()
      setEditingServiceCount(editingData.length)

      setLastRefresh(new Date())
    } catch (err: any) {
      setError(err.message || 'Failed to load data counts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCounts()
  }, [])

  return (
    <div className={`bg-gray-50 border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">Data Source Status</h3>
        <button
          onClick={loadCounts}
          disabled={loading}
          className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 mb-3">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-600" />
            <span className="text-gray-700">Hosted Layer:</span>
          </div>
          <span className="font-medium text-gray-900">{hostedLayerCount} concessions</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-green-600" />
            <span className="text-gray-700">Editing Service:</span>
          </div>
          <span className="font-medium text-gray-900">{editingServiceCount} concessions</span>
        </div>

        {lastRefresh && (
          <div className="pt-2 border-t border-gray-200">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <CheckCircle className="w-3 h-3" />
              Last checked: {lastRefresh.toLocaleTimeString()}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
