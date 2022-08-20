/// <reference types="vitest" />
import { defineConfig } from 'vite'
import EnvironmentPlugin from 'vite-plugin-environment';

export default defineConfig({
  test: {
    environment: 'jsdom',
    coverage: {
      reporter: ['text', 'html'],
      exclude: [
        'node_modules/',
        'src/SocketController.ts',
        'src/index.ts',
        'src/application/repositories',
        'build'
      ],
    },
    globals: true
  },
  plugins: [
    EnvironmentPlugin([
      'JWT_SECRET_KEY',
      'PORT',
      'HOST', 
      'DB_HOST', 
      'DB_NAME', 
      'DB_PORT', 
      'CLIENT_SECRET', 
      'CLIENT_ID', 
      'REDIRECT_URI', 
      'REFRESH_TOKEN', 
      'EMAIL_USER', 
      'GOOGLE_APPLICATION_CREDENTIALS'
    ])
  ]
});