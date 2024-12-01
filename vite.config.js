import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  base: './',
  assetsInclude: ['**/*.xlsx'], // 将 .xlsx 文件视为静态资源
  plugins: [vue()],
  server: {
    host: true // 允许通过局域网 IP 访问
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})
