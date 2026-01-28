import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Money_manager/',
  css: {
    postcss: false,
  },
  server: {
    hmr: {
      overlay: false,
    },
  },
})
