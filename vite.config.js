import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages 프로젝트 페이지(https://aeginventor.github.io/skala-vue/)는
  // 도메인 루트가 아니라 저장소 이름 서브패스에서 서비스되므로 base를 맞춰준다.
  base: '/skala-vue/',
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
