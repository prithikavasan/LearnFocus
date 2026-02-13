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
      // Externalize modules causing Vite build issues
      external: [
        'react-chartjs-2', 
        'chart.js',
        'lucide-react',
        'socket.io-client'
      ],
    },
  },
});
