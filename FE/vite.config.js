import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Build configuration optimized for Vercel
  build: {
    // Increase chunk size warning limit for Vercel
    chunkSizeWarningLimit: 1000,
    
    // Optimize build output for Vercel
    rollupOptions: {
      output: {
        // Manual chunk splitting for better performance
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'ui-libs': ['lucide-react', 'react-icons'],
          'http-client': ['axios']
        }
      }
    },
    
    // Minification for production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true
      }
    },
    
    // Disable source maps for faster build
    sourcemap: false,
    
    // Output directory (Vercel default)
    outDir: 'dist'
  },
  
  // Server config for development
  server: {
    host: true,
    port: 5173
  },
  
  // Preview config
  preview: {
    host: true,
    port: 4173
  }
})
