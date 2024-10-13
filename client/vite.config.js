import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';



export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://geomancy-blog.onrender.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove '/api' when forwarding to the backend
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
