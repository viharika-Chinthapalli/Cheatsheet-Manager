import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { autoSyncJson } from './vite-plugin-auto-sync'

export default defineConfig({
  plugins: [
    react(),
    autoSyncJson(), // Auto-sync cheatsheets.json from Downloads to project folder
  ],
  server: {
    proxy: {
      // Forward /api to backend in development (run backend on port 4000)
      '/api': { target: 'http://localhost:4000', changeOrigin: true },
    },
  },
})


