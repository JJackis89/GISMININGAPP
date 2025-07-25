import { Info } from 'lucide-react'

export function DemoBanner() {
  // Only show in deployment environments
  const isDeployment = window.location.hostname !== 'localhost'
  
  if (!isDeployment) return null
  
  return (
    <div className="bg-epa-orange-50 border-l-4 border-epa-orange-400 p-4 mb-4">
      <div className="flex items-center">
        <Info className="h-5 w-5 text-epa-orange-500 mr-3" />
        <div>
          <p className="text-sm text-epa-orange-700">
            <strong>Demo Mode:</strong> You're viewing the EPA Mining Concessions Management System with sample data.
            All features are fully functional for demonstration purposes.
          </p>
        </div>
      </div>
    </div>
  )
}
