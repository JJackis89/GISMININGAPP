/**
 * Print Demo Component
 * Demonstrates the print functionality with sample data
 */

import React from 'react'
import { PrintButton, PrintLayoutTemplate } from '../components/Print'
import { mockConcessions } from '../data/mockData'
import { FileText, Download } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export const PrintDemo: React.FC = () => {
  const { user } = useAuth()
  // Get first concession for single print demo
  const sampleConcession = mockConcessions[0]
  
  // Get first 3 concessions for batch demo
  const batchConcessions = mockConcessions.slice(0, 3)

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          EPA MINING DATABASE Print System
        </h1>
        <p className="text-gray-600">
          Professional document generation for mining concession certificates
        </p>
      </div>

      {/* Print Options Demo */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Single Print */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <FileText className="h-6 w-6 text-orange-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Single Concession Print</h2>
          </div>
          
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">{sampleConcession.name}</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><span className="font-medium">Owner:</span> {sampleConcession.owner}</p>
                <p><span className="font-medium">Region:</span> {sampleConcession.region}</p>
                <p><span className="font-medium">Size:</span> {sampleConcession.size} acres</p>
                <p><span className="font-medium">Status:</span> 
                  <span className={`ml-1 px-2 py-1 text-xs rounded-full ${
                    sampleConcession.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {sampleConcession.status}
                  </span>
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <PrintButton 
                concession={sampleConcession} 
                variant="single" 
                size="md"
                user={user}
              />
            </div>
          </div>
        </div>

        {/* Batch Print */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Download className="h-6 w-6 text-orange-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Batch Print</h2>
          </div>
          
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">
                Multiple Concessions ({batchConcessions.length})
              </h3>
              <div className="text-sm text-gray-600 space-y-2">
                {batchConcessions.map((concession, index) => (
                  <div key={concession.id} className="flex justify-between">
                    <span>{index + 1}. {concession.name}</span>
                    <span className="text-gray-500">{concession.region}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2">
              <PrintButton 
                concessions={batchConcessions} 
                variant="batch" 
                size="md"
                user={user}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Print Layout Preview */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Print Layout Preview
        </h2>
        <p className="text-gray-600 mb-6">
          This is how the printed document will appear:
        </p>
        
        {/* Preview Container */}
        <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
          <div className="bg-gray-100 p-3 border-b border-gray-300">
            <div className="text-sm text-gray-600 flex justify-between">
              <span>Print Preview - A4 Portrait</span>
              <span>Scale: 50%</span>
            </div>
          </div>
          
          {/* Scaled Preview */}
          <div className="transform scale-50 origin-top-left" style={{ height: '50vh', overflow: 'hidden' }}>
            <PrintLayoutTemplate
              concession={sampleConcession}
              printDate={new Date()}
              showCoordinates={true}
              showMap={true}
            />
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Print Features</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <h3 className="font-medium text-gray-900">Document Options</h3>
            <ul className="space-y-1 text-gray-600">
              <li>• Multiple paper sizes (A4, A3, Letter)</li>
              <li>• Portrait and landscape orientation</li>
              <li>• Professional EPA branding</li>
              <li>• Watermark and logo options</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-gray-900">Content Features</h3>
            <ul className="space-y-1 text-gray-600">
              <li>• Interactive map visualization</li>
              <li>• Coordinate boundary tables</li>
              <li>• Detailed concession information</li>
              <li>• PDF export capability</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">How to Use</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex items-start">
            <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</span>
            <div>
              <strong>Single Print:</strong> Click the "Print" button next to any concession in the table or details view.
            </div>
          </div>
          <div className="flex items-start">
            <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</span>
            <div>
              <strong>Batch Print:</strong> Use the batch print button at the top of the concessions table to print multiple certificates.
            </div>
          </div>
          <div className="flex items-start">
            <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</span>
            <div>
              <strong>Customize:</strong> Configure print options including paper size, orientation, and content sections.
            </div>
          </div>
          <div className="flex items-start">
            <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">4</span>
            <div>
              <strong>Export:</strong> Choose between direct printing or PDF export for sharing and archival.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrintDemo
