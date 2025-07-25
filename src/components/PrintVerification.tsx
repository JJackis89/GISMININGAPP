/**
 * Print Verification Component
 * Simple test component to verify print functionality is working
 */

import React from 'react'
import { PrintLayoutTemplate } from './Print/PrintLayoutTemplate'
import { mockConcessions } from '../data/mockData'

const PrintVerification: React.FC = () => {
  const testConcession = mockConcessions[0]

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center">Print Verification Test</h1>
      
      <div className="max-w-4xl mx-auto bg-white shadow-lg">
        <div className="p-4 bg-blue-100 border-b">
          <h2 className="text-lg font-semibold">Testing Print Layout Template</h2>
          <p className="text-sm text-gray-600">Concession: {testConcession.name}</p>
        </div>
        
        <div className="scale-75 transform-origin-top-left">
          <PrintLayoutTemplate
            concession={testConcession}
            printDate={new Date()}
            showCoordinates={true}
            showMap={true}
          />
        </div>
      </div>
    </div>
  )
}

export default PrintVerification
