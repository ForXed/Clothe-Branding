import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'brutige.ekojoe.name.ng',
      'staging.ekojoe.name.ng',
      'ekojoe.name.ng'
    ],
    host: true,
    port: 5173,
  }
})
