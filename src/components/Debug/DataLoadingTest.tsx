import React, { useState, useEffect } from 'react'
import { miningDataService } from '../../services/miningDataService'

export default function DataLoadingTest() {
  const [status, setStatus] = useState('Initializing...')
  const [data, setData] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    testDataLoading()
  }, [])

  const testDataLoading = async () => {
    try {
      setStatus('Step 1: Checking ArcGIS API...')
      console.log('🧪 Testing data loading step by step')
      
      // Check if ArcGIS API is available
      if (!window.require) {
        throw new Error('ArcGIS JavaScript API not available')
      }
      console.log('✅ ArcGIS API is available')

      setStatus('Step 2: Initializing mining data service...')
      await miningDataService.initialize()
      console.log('✅ Mining data service initialized')

      setStatus('Step 3: Fetching concessions...')
      const concessions = await miningDataService.getMiningConcessions(true)
      console.log('✅ Concessions fetched:', concessions.length)

      setData(concessions)
      setStatus(`✅ Success! Loaded ${concessions.length} concessions`)

    } catch (err: any) {
      console.error('❌ Test failed:', err)
      setError(err.message)
      setStatus('❌ Failed')
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Data Loading Test</h2>
      
      <div className="space-y-4">
        <div>
          <strong>Status:</strong> {status}
        </div>

        {error && (
          <div className="p-3 bg-red-100 border border-red-300 rounded text-red-700">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div>
          <strong>Data Count:</strong> {data.length}
        </div>

        {data.length > 0 && (
          <div>
            <strong>Sample Data:</strong>
            <pre className="mt-2 p-3 bg-gray-100 rounded text-sm overflow-auto">
              {JSON.stringify(data.slice(0, 2), null, 2)}
            </pre>
          </div>
        )}

        <button
          onClick={testDataLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry Test
        </button>
      </div>
    </div>
  )
}
