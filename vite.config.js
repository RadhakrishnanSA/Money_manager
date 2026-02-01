import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  base: '/Money_manager/',
  server: {
    hmr: true
  }
});
