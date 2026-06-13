import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Dev-mode proxy so `npm run dev` (port 5173) forwards /api to the Go backend
// running on :8080. In Docker, nginx (see nginx.conf) does the same job.
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      // Strip the /api prefix so dev matches the nginx gateway: the Go backend
      // mounts its routes at the root (/projects, /tasks, /search).
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
    css: false,
  },
});
