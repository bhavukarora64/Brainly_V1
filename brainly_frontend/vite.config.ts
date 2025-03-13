
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  optimizeDeps: {
    // Force include Recoil
    include: ['recoil'],
    // Add this if using React 18
    esbuildOptions: {
      target: 'es2020',
      supported: {
        'top-level-await': true
      }
    }
  }
})