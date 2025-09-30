import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/edimara_law/',            // << importante para carregar assets no Pages
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  server: {
    allowedHosts: ['bcbeb348b823.ngrok-free.app'],
  },
})
