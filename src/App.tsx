import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Login from './components/Auth/Login'
import Navbar from './components/Layout/Navbar'
import Sidebar from './components/Layout/Sidebar'
import MapViewPage from './pages/MapViewPage'
import ConcessionsPage from './pages/ConcessionsPage'
import FiltersPage from './pages/FiltersPage'
import AnalyticsPage from './pages/AnalyticsPage'
import ReportsPage from './pages/ReportsPage'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-epa-orange-600"></div>
      </div>
    )
  }

  if (!user) {
    return <Login />
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<MapViewPage />} />
            <Route path="/map-view" element={<MapViewPage />} />
            <Route path="/concessions" element={<ConcessionsPage />} />
            <Route path="/filters" element={<FiltersPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
