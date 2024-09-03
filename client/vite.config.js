import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        secure: false,
      },
    },
  },
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['mongoose'],
    },
  },
  projects: [
    {
      src: "client/",
      use: "@vercel/static-build",
      config: {
        distDir: "build"
      }
    },
    {
      src: "api/",
      use: "@vercel/node"
    }
  ]
});
