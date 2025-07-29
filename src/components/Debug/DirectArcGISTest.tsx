import React, { useState } from 'react'

export default function DirectArcGISTest() {
  const [status, setStatus] = useState('Ready to test')
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const testDirectQuery = async () => {
    try {
      setStatus('Testing direct ArcGIS query...')
      setError(null)
      setResults(null)

      // Test if window.require is available
      if (!window.require) {
        throw new Error('ArcGIS JavaScript API not loaded')
      }

      const featureServiceUrl = 'https://services6.arcgis.com/Av3KhOzUMUMSORVt/arcgis/rest/services/Mining_Concessions/FeatureServer/0'
      
      // Use AMD require to load ArcGIS modules
      window.require([
        'esri/layers/FeatureLayer'
      ], async (FeatureLayer: any) => {
        try {
          setStatus('Creating FeatureLayer...')
          
          const featureLayer = new FeatureLayer({
            url: featureServiceUrl,
            outFields: ['*']
          })

          setStatus('Loading FeatureLayer...')
          await featureLayer.load()

          setStatus('FeatureLayer loaded, creating query...')
          
          const query = featureLayer.createQuery()
          query.returnGeometry = true
          query.outFields = ['*']
          query.num = 10 // Limit to 10 features for testing

          setStatus('Executing query...')
          const featureSet = await featureLayer.queryFeatures(query)

          setStatus(`✅ Success! Found ${featureSet.features.length} features`)
          
          const results = {
            layerInfo: {
              title: featureLayer.title,
              id: featureLayer.id,
              url: featureLayer.url,
              geometryType: featureLayer.geometryType,
              capabilities: featureLayer.capabilities
            },
            queryResults: {
              featureCount: featureSet.features.length,
              spatialReference: featureSet.spatialReference,
              exceededTransferLimit: featureSet.exceededTransferLimit
            },
            sampleFeature: featureSet.features.length > 0 ? {
              attributes: featureSet.features[0].attributes,
              geometryType: featureSet.features[0].geometry?.type
            } : null,
            fields: featureLayer.fields?.map((field: any) => ({
              name: field.name,
              alias: field.alias,
              type: field.type
            })) || []
          }

          setResults(results)
          console.log('🎯 Direct ArcGIS test results:', results)

        } catch (err: any) {
          console.error('❌ ArcGIS module error:', err)
          setError(`ArcGIS error: ${err.message}`)
          setStatus('❌ Failed')
        }
      })

    } catch (err: any) {
      console.error('❌ Direct test error:', err)
      setError(err.message)
      setStatus('❌ Failed')
    }
  }

  return (
    <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-yellow-800">🔧 Direct ArcGIS Service Test</h2>
      
      <div className="space-y-4">
        <div>
          <strong>Status:</strong> <span className="ml-2">{status}</span>
        </div>

        {error && (
          <div className="p-3 bg-red-100 border border-red-300 rounded text-red-700">
            <strong>Error:</strong> {error}
          </div>
        )}

        <button
          onClick={testDirectQuery}
          className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          Run Direct Test
        </button>

        {results && (
          <div className="mt-4 space-y-4">
            <div className="p-3 bg-green-100 border border-green-300 rounded">
              <h3 className="font-bold text-green-800">Layer Information:</h3>
              <pre className="text-sm mt-2 text-green-700">
                {JSON.stringify(results.layerInfo, null, 2)}
              </pre>
            </div>

            <div className="p-3 bg-blue-100 border border-blue-300 rounded">
              <h3 className="font-bold text-blue-800">Query Results:</h3>
              <pre className="text-sm mt-2 text-blue-700">
                {JSON.stringify(results.queryResults, null, 2)}
              </pre>
            </div>

            {results.fields && results.fields.length > 0 && (
              <div className="p-3 bg-purple-100 border border-purple-300 rounded">
                <h3 className="font-bold text-purple-800">Available Fields:</h3>
                <div className="text-sm mt-2 text-purple-700">
                  {results.fields.map((field: any, index: number) => (
                    <div key={index}>
                      <strong>{field.name}</strong> ({field.type}) - {field.alias}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {results.sampleFeature && (
              <div className="p-3 bg-gray-100 border border-gray-300 rounded">
                <h3 className="font-bold text-gray-800">Sample Feature Attributes:</h3>
                <pre className="text-sm mt-2 text-gray-700 max-h-40 overflow-auto">
                  {JSON.stringify(results.sampleFeature.attributes, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
