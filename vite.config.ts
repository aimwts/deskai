import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext'
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
  // Ensure env vars are exposed correctly
  envPrefix: 'VITE_'
});