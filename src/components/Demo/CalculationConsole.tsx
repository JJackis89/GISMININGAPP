import React, { useState, useEffect } from 'react'
import { Terminal, Activity } from 'lucide-react'

interface ConsoleLogEntry {
  timestamp: string
  level: 'info' | 'success' | 'warning' | 'error'
  message: string
}

export default function CalculationConsole() {
  const [logs, setLogs] = useState<ConsoleLogEntry[]>([])
  const [isActive, setIsActive] = useState(false)

  const addLog = (level: ConsoleLogEntry['level'], message: string) => {
    const newLog: ConsoleLogEntry = {
      timestamp: new Date().toLocaleTimeString(),
      level,
      message
    }
    setLogs(prev => [...prev.slice(-9), newLog]) // Keep last 10 logs
  }

  const simulateCalculationProcess = async () => {
    setIsActive(true)
    setLogs([])

    const steps = [
      { level: 'info' as const, message: '🚀 Starting automated field calculation...' },
      { level: 'info' as const, message: '📍 Input coordinates: 5 points in Western Ghana' },
      { level: 'info' as const, message: '🔧 Calculating polygon area using Shoelace formula...' },
      { level: 'success' as const, message: '📐 Area calculated: 347.22 acres (140.52 hectares)' },
      { level: 'info' as const, message: '🗺️ Determining administrative boundaries...' },
      { level: 'info' as const, message: '📌 Centroid calculated: -2.425, 5.875' },
      { level: 'info' as const, message: '🔍 Looking up Ghana administrative boundaries...' },
      { level: 'success' as const, message: '🎯 District detected: Wassa Amenfi West' },
      { level: 'success' as const, message: '🌍 Region identified: Western' },
      { level: 'info' as const, message: '💾 Saving to PostgreSQL database...' },
      { level: 'success' as const, message: '✅ Concession created with auto-calculated fields!' }
    ]

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 800))
      addLog(step.level, step.message)
    }

    setTimeout(() => setIsActive(false), 2000)
  }

  const getLevelColor = (level: ConsoleLogEntry['level']) => {
    switch (level) {
      case 'success': return 'text-green-600'
      case 'warning': return 'text-yellow-600'
      case 'error': return 'text-red-600'
      default: return 'text-blue-600'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Terminal className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Calculation Process Console</h3>
            <p className="text-sm text-gray-600">Real-time view of automated field calculation</p>
          </div>
        </div>
        
        <button
          onClick={simulateCalculationProcess}
          disabled={isActive}
          className={`
            inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
            ${isActive 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-gray-900 text-white hover:bg-gray-800'
            }
          `}
        >
          <Activity className={`h-4 w-4 mr-2 ${isActive ? 'animate-pulse' : ''}`} />
          {isActive ? 'Running...' : 'Simulate Process'}
        </button>
      </div>

      {/* Console Output */}
      <div className="bg-gray-900 rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm">
        {logs.length === 0 ? (
          <div className="text-gray-500">Console ready. Click "Simulate Process" to see automated calculation steps...</div>
        ) : (
          <div className="space-y-1">
            {logs.map((log, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-gray-400 text-xs mt-0.5">[{log.timestamp}]</span>
                <span className={getLevelColor(log.level)}>{log.message}</span>
              </div>
            ))}
            {isActive && (
              <div className="flex items-center gap-2 text-yellow-400">
                <span className="text-gray-400 text-xs">[{new Date().toLocaleTimeString()}]</span>
                <span className="animate-pulse">Processing...</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 text-xs text-gray-600">
        This simulation shows the step-by-step process of automated field calculation that happens when creating or updating concessions in the PostgreSQL backend.
      </div>
    </div>
  )
}
