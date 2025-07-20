import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/GISMININGAPP/', // Repository name for JJackis89/GISMININGAPP
  optimizeDeps: {
    exclude: ['@arcgis/core']
  },
  define: {
    global: 'globalThis'
  },
  server: {
    port: 5173,
    host: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
})
