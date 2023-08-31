import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 8080        // Cloud9でアクセス可能なポートを指定
  },
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: [
      {
        find: './runtimeConfig',
        replacement: './runtimeConfig.browser', // ensures browser compatible version of AWS JS SDK is used
      },
      { 
        find: '@', 
        replacement: '/src' 
      },
    ]
  }
})