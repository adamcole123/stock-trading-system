/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    environment: 'jsdom',
    coverage: {
      reporter: ['text', 'html'],
      exclude: [
        'node_modules/',
        'src/SocketController.ts', 
        'src/index.ts',
        'src/application/repositories'
      ],
    }
  }
});