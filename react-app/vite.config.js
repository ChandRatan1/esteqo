import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Ports for this project — a fresh 4142+ block, so nothing collides with the
 * servers already running on this machine (4000, 4173, 5173–5175 were taken).
 *
 *   4142  front end (dev)
 *   4143  PHP API      — see backend-php/config.php
 *   4144  production preview
 *
 * `host: true` also binds the LAN address, so the site can be opened on a phone
 * on the same Wi-Fi. Vite prints the Network URL when it starts.
 */
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiTarget = env.VITE_API_PROXY || 'http://localhost:4143';

  return {
    plugins: [react()],
    server: {
      port: 4142,
      // Fail loudly rather than silently sliding to another port — a moved port
      // is how a stale server ends up being tested by mistake.
      strictPort: true,
      host: true,
      open: false,
      // Lets the app call /api/* in dev without CORS. Used when
      // VITE_USE_API=true or VITE_CONTACT_API is set to a relative path.
      //
      // /uploads is proxied too: service/blog images are stored as relative
      // paths like /uploads/facial/x.jpg, which only resolve because Apache
      // serves the sibling uploads/ folder as static files in production. In
      // dev there is no such static host, so the PHP backend serves them
      // instead (see route_serve_upload in backend-php/routes/uploads.php).
      proxy: {
        '/api': { target: apiTarget, changeOrigin: true },
        '/uploads': { target: apiTarget, changeOrigin: true },
      },
    },
    preview: {
      port: 4144,
      strictPort: true,
      host: true,
    },
    build: {
      outDir: 'dist',
      sourcemap: mode !== 'production',
    },
  };
});
