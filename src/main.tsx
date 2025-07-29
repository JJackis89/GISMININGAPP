import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext.tsx'
import ErrorBoundary from './components/ErrorBoundary.tsx'
import './index.css'

// Ensure we're running in browser environment
if (typeof window !== 'undefined') {
  // Remove initial loading screen
  const initialLoading = document.getElementById('initial-loading')
  if (initialLoading) {
    initialLoading.remove()
  }

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <ErrorBoundary>
      <BrowserRouter 
        basename="/"
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>,
  )
}
