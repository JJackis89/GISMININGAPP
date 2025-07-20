import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/GISMININGAPP/', 
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
    sourcemap: false,
    target: 'es2020',
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    },
    rollupOptions: {
      external: (id) => {
        if (id.includes('core-js/internals/') || 
            id.includes('../internals/') ||
            id.includes('define-globalThis-property')) {
          return true;
        }
        return false;
      },
      output: {
        format: 'es',
        globals: {
          '../internals/define-globalThis-property': 'globalThis'
        }
      }
    }
  }
})
