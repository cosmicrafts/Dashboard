// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import rollupNodePolyFill from 'rollup-plugin-node-polyfills';
import inject from '@rollup/plugin-inject';
import dotenv from 'dotenv';
import { fileURLToPath, URL } from 'url';

dotenv.config();

export default defineConfig({
  build: {
    emptyOutDir: true,
    assetsDir: 'assets',
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
        'process.env': '{}',
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },
  },
  plugins: [
    vue(),
    inject({
      global: 'globalThis',
      process: 'process',
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
  resolve: {
    alias: {
      'process': 'process/browser',
      'buffer': 'buffer',
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
