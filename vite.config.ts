import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Relative base path allows deployment on GitHub Pages without path breaking
  server: {
    port: 3000,
    open: false,
  },
});
