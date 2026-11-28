import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'brutige.name.ng',
      'staging.brutige.name.ng',
      'dev.brutige.name.ng',
      'www.brutige.name.ng',
      // Cloudflare tunnel hostname used while there is no server: one origin
      // serves the SPA and the API under /api.
    ],
    host: true,
    port: 5173,
  },
  build: {
    rollupOptions: {
      output: {
        // Keep the framework in its own long-lived chunk: it changes far less often than
        // app code, so a deploy does not invalidate it in the browser cache.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          // Anchored to the package segment so scoped packages that merely contain
          // "/react/" in their path (@emotion/react, @headlessui/react) stay in vendor.
          if (/[\\/]node_modules[\\/]react(-dom|-router(-dom)?)?[\\/]/.test(id)) {
            return 'react'
          }
          return 'vendor'
        },
      },
    },
  },
})
