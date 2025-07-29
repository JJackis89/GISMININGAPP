import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  optimizeDeps: {
    exclude: ['@arcgis/core']
  },
  define: {
    global: 'globalThis'
  },
  server: {
    port: 5173,
    host: true,
    strictPort: false
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      external: ['@arcgis/core'],
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          charts: ['recharts'],
          utils: ['lucide-react'],
          firebase: ['firebase/app', 'firebase/auth']
        }
      }
    },
    minify: 'esbuild',
    target: 'es2015'
  }
})
