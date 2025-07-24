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
    rollupOptions: {
      external: (id) => {
        // Handle all core-js internals issues
        if (id.includes('core-js/internals/') || 
            id.includes('../internals/') ||
            id.includes('globalThis-this') ||
            id.includes('define-globalThis-property')) {
          return true;
        }
        return false;
      },
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        globals: {
          '../internals/define-globalThis-property': 'globalThis'
        }
      }
    },
    minify: 'esbuild'
  }
})
