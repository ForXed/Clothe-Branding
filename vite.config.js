import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'brutige.name.ng',
      'staging.brutige.name.ng',
      'dev.brutige.name.ng'
    ],
    host: true,
    port: 5173,
  }
})
