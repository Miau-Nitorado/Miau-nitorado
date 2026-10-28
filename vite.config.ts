import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

/**
 * O build do front é publicado direto no wwwroot da API, para que o
 * ASP.NET Core sirva a SPA e os endpoints na mesma origem (um único app).
 *
 * Em desenvolvimento o Vite segue na porta 5173 e repassa /api para a
 * API em http://localhost:5243 (perfil "http" do launchSettings).
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'backend/MiauNitorado.API/wwwroot',
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5243',
        changeOrigin: true,
      },
    },
  },
});
