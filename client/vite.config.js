import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  server: {
    proxy: {
      // Proxy API requests during local development
      '/api': {
        target: 'https://geomancy-blog.onrender.com', // Replace with your backend URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Rewrite API path
      },
    },
  },
  plugins: [react()],
  build: {
    rollupOptions: {
      // Ensure backend dependencies like `mongoose` are not bundled in the frontend build
      external: [],
    },
  },
  
});
