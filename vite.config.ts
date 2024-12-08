import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  base: '/upfit-gym',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: "v8",
      reportsDirectory: './coverage',
      reporter: ['text', 'html'],
      all: true,
      include: ['src/**/*.{ts,vue}'],
      exclude: ['node_modules', 'dist', '**/__tests__/**'],
    },
  },
})
