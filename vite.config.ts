import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { autoSyncJson } from './vite-plugin-auto-sync'

export default defineConfig({
  plugins: [
    react(),
    autoSyncJson(), // Auto-sync cheatsheets.json from Downloads to project folder
  ],
})



