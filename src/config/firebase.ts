// Firebase Configuration
import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getAnalytics, isSupported } from 'firebase/analytics'

// Firebase config for mining-login project (gismining025@gmail.com)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mining-login.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mining-login",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "mining-login.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "736251542602",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:736251542602:web:eae80aa0cccfd7a2203ab3",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-9HMEX4HJJR"
}

// Check if we have real Firebase credentials
const hasRealCredentials = import.meta.env.VITE_FIREBASE_API_KEY && 
                          import.meta.env.VITE_FIREBASE_AUTH_DOMAIN &&
                          import.meta.env.VITE_FIREBASE_PROJECT_ID

console.log('🔥 Firebase config check:', {
  hasApiKey: !!import.meta.env.VITE_FIREBASE_API_KEY,
  hasAuthDomain: !!import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  hasProjectId: !!import.meta.env.VITE_FIREBASE_PROJECT_ID,
  hasRealCredentials
})

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)

// Initialize Firebase Analytics (only if supported and measurementId exists)
let analytics: any = null
if (firebaseConfig.measurementId && typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app)
      console.log('🔥 Firebase Analytics initialized')
    }
  }).catch(console.error)
}

export { analytics }

// For development, you can connect to the Firebase Auth emulator
// Uncomment the line below if you want to use the Firebase emulator for testing
// if (import.meta.env.DEV && !auth.config?.emulator) {
//   connectAuthEmulator(auth, "http://localhost:9099")
// }

export { hasRealCredentials }
export default app
