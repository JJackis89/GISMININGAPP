import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
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
  </BrowserRouter>,
)
