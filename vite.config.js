import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true
  },
  // This ensures both relative and absolute imports work
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', '@supabase/supabase-js']
  }
})