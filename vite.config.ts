import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/GISMININGAPP/', 
  optimizeDeps: {
    exclude: ['@arcgis/core', 'core-js']
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
    sourcemap: false,
    target: 'es2020', // Changed to es2020 to support BigInt literals
    rollupOptions: {
      external: (id) => {
        // Externalize all core-js related modules
        if (id.includes('core-js') || 
            id.includes('globalThis') || 
            id.includes('define-globalThis-property') ||
            id.includes('../internals/')) {
          return true;
        }
        return false;
      },
      output: {
        format: 'es'
      }
    }
  }
})
