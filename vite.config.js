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
  }
})
