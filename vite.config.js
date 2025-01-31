// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dotenv from 'dotenv';
import { fileURLToPath, URL } from 'url';

dotenv.config();

export default defineConfig({
  base: '/',
  build: {
    emptyOutDir: true,
    assetsDir: 'assets',
    rollupOptions: {
      external: ['globalThis'],
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        'process.env': '{}',
      },
    },
  },
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@/declarations': fileURLToPath(new URL('./src/declarations', import.meta.url)),
      '@/store': fileURLToPath(new URL('./src/store', import.meta.url)),
      '@/services': fileURLToPath(new URL('./src/services', import.meta.url)),
      '@/components': fileURLToPath(new URL('./src/components', import.meta.url)),
    },
  },
  define: {
    'process.env': process.env,
  },
  publicDir: 'src/assets',
  server: {
    proxy: {
      '/api': {
        target: 'https://ic0.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
