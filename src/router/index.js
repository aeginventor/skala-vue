import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'weather-home',
    component: () => import('../views/WeatherHomeView.vue'),
  },
  {
    path: '/about',
    name: 'weather-about',
    component: () => import('../views/WeatherAboutView.vue'),
  },
  {
    path: '/weather/:cityId',
    name: 'weather-detail',
    component: () => import('../views/WeatherDetailView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue'),
  },
]

const router = createRouter({
  // GitHub Pages 같은 순수 정적 호스팅은 서버가 딥링크 경로를 모르기 때문에,
  // 새로고침/직접 접속 시 히스토리 모드(createWebHistory)는 404가 난다.
  // 해시(#) 뒤쪽은 서버로 안 넘어가고 브라우저에서만 처리되므로 항상 안전하다.
  history: createWebHashHistory(),
  routes,
})

export default router
