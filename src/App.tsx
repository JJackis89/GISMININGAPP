import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Login from './components/Auth/Login'
import Navbar from './components/Layout/Navbar'
import Sidebar from './components/Layout/Sidebar'
import MapViewPage from './pages/MapViewPage'
import FiltersPage from './pages/FiltersPage'
import AnalyticsPage from './pages/AnalyticsPage'
import ReportsPage from './pages/ReportsPage'
import PrintTestPage from './pages/PrintTestPage'
import PrintVerification from './components/PrintVerification'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-epa-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading authentication...</p>
          <p className="mt-2 text-sm text-gray-500">Check console for details</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Login />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-epa-orange-50 to-epa-green-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<MapViewPage />} />
            <Route path="/map-view" element={<MapViewPage />} />
            <Route path="/filters" element={<FiltersPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/print-test" element={<PrintTestPage />} />
            <Route path="/print-verify" element={<PrintVerification />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
