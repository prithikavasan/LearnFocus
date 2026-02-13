import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      // Externalize any modules causing issues
      external: [
        'chart.js',       // for react-chartjs-2
        'react-chartjs-2' // if needed
      ],
    },
  },
});
