<script setup>
import { watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import UnitToggler from './components/UnitToggler.vue'
import DataSourceToggler from './components/DataSourceToggler.vue'
import CityDock from './components/CityDock.vue'
import { useConfigStore } from './stores/configStore.js'
import { useWeatherStore } from './stores/weatherStore.js'

const route = useRoute()
const configStore = useConfigStore()
const weatherStore = useWeatherStore()

/**
 * 날씨 데이터 로딩을 앱 껍데기에서 맡는다. Dock이 여기(App) 하위에 있어서 특정 화면에
 * 종속되지 않고, 예시↔실시간 토글도 헤더에 있어 어느 화면에서든 눌릴 수 있기 때문이다.
 * 로딩이 Home 화면에만 있으면 상세 페이지에서 토글했을 때 Dock과 목록이 옛 값을 들고 있게 된다.
 */
onMounted(() => weatherStore.loadCities(configStore.useMockData))
watch(() => configStore.useMockData, (useMock) => weatherStore.loadCities(useMock))
</script>

<template>
  <div class="page">
    <header class="page-header">
      <div class="page-header__top">
        <h1>
          <span class="brand-badge"><i class="fa-solid fa-cloud-sun"></i></span>
          날씨 Dock
          <RouterLink
            to="/about"
            class="about-btn ink-pressable"
            :class="{ 'about-btn--active': route.name === 'weather-about' }"
          >
            <i class="fa-solid fa-circle-info"></i> 소개
          </RouterLink>
        </h1>
        <div class="page-header__actions">
          <DataSourceToggler />
          <UnitToggler />
        </div>
      </div>
      <CityDock />
    </header>

    <main class="page-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  /* 크림 배경이 완전히 평평한 벡터색으로 보이지 않도록, 아주 옅은 종이 질감
     노이즈를 겹쳐 얹는다. feTurbulence를 낮은 opacity로 타일링한 SVG라 무게가
     거의 없다. */
  background:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.07'/%3E%3C/svg%3E"),
    var(--color-bg);
  padding: 32px 16px 60px;
  font-family: 'Pretendard', 'Apple SD Gothic Neo', sans-serif;
  color: var(--color-ink);
}

.page-header {
  max-width: 720px;
  margin: 0 auto 32px;
}

/* 스위치가 둘로 늘면서 좁은 폭에서 한 줄에 다 안 들어간다. 넘치는 대신 줄을 바꾸게 둔다. */
.page-header__top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 18px;
}

.page-header h1 {
  font-family: 'Pretendard', sans-serif;
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.page-header__actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.about-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 36px;
  padding: 0 16px;
  border: var(--border-thick);
  border-radius: 999px;
  background: var(--color-surface);
  color: var(--color-ink);
  box-shadow: var(--shadow-hard-sm);
  text-decoration: none;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
}

.about-btn--active {
  background: var(--color-primary);
  color: #fff;
}

.brand-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-sun-bg);
  border: var(--border-thick);
  box-shadow: var(--shadow-hard-sm);
  color: var(--color-sun);
  font-size: 18px;
  animation: bob 3.2s ease-in-out infinite;
}

@keyframes bob {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-4px) rotate(-6deg);
  }
}

.page-main {
  padding-top: 4px;
  max-width: 1080px;
  margin: 0 auto;
}
</style>
