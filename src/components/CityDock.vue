<script setup>
import { useRoute } from 'vue-router'
import { weatherMockData } from '../data/weatherMockData.js'
import { getWeatherIcon } from '../utils/weatherIcon.js'

/**
 * CityDock — 맥북 Dock에서 아이디어를 가져온 상단 내비게이션.
 * - 라벨은 hover 없이 아이콘 아래 작은 글자로 항상 보이게 뒀다.
 * - 지역이 30개로 늘면서 한 줄에 다 못 들어와 가로 스크롤이 필요해졌다. 스크롤
 *   가능하다는 걸 안내하는 힌트 문구를 아래에 추가했다.
 * - 도시 아이콘은 고정된 위치 핀이 아니라, 그 도시의 현재 날씨 상태에 맞는 아이콘
 *   (getWeatherIcon())을 보여준다 → Dock만 훑어봐도 전체 지역 날씨를 짐작할 수 있음
 */
const route = useRoute()

function isActiveCity(cityId) {
  return route.params.cityId === cityId
}
</script>

<template>
  <div class="dock-wrap">
    <nav class="dock" aria-label="지역 바로가기 Dock">
      <RouterLink
        to="/"
        class="dock-item ink-pressable"
        :class="{ 'dock-item--active': route.name === 'weather-home' }"
        title="전체 대시보드"
      >
        <i class="fa-solid fa-house"></i>
        <span class="dock-item__label">전체</span>
      </RouterLink>

      <span class="dock-divider" aria-hidden="true"></span>

      <RouterLink
        v-for="city in weatherMockData"
        :key="city.id"
        :to="`/weather/${city.id}`"
        class="dock-item ink-pressable"
        :class="{ 'dock-item--active': isActiveCity(city.id) }"
        :title="city.name"
      >
        <i :class="['fa-solid', getWeatherIcon(city.status)]"></i>
        <span class="dock-item__label">{{ city.name }}</span>
      </RouterLink>

      <span class="dock-divider" aria-hidden="true"></span>

      <RouterLink
        to="/about"
        class="dock-item ink-pressable"
        :class="{ 'dock-item--active': route.name === 'weather-about' }"
        title="서비스 소개"
      >
        <i class="fa-solid fa-circle-info"></i>
        <span class="dock-item__label">소개</span>
      </RouterLink>
    </nav>
    <p class="dock-hint"><i class="fa-solid fa-arrows-left-right"></i> 옆으로 밀어서 30개 지역을 모두 볼 수 있어요</p>
  </div>
</template>

<style scoped>
.dock-wrap {
  position: relative;
  max-width: 100%;
}

.dock {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background: var(--color-surface);
  border: var(--border-thick);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-hard);
  padding: 12px 16px;
  overflow-x: auto;
  scroll-snap-type: x proximity;
  -webkit-overflow-scrolling: touch;
}

.dock::-webkit-scrollbar {
  height: 6px;
}

.dock::-webkit-scrollbar-thumb {
  background: var(--color-primary-bg);
  border-radius: 999px;
}

.dock-divider {
  width: 3px;
  align-self: stretch;
  background: var(--color-ink);
  opacity: 0.15;
  border-radius: 3px;
  margin: 4px 2px;
  flex-shrink: 0;
}

.dock-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 56px;
  height: 56px;
  flex-shrink: 0;
  border-radius: var(--radius-sm);
  border: var(--border-thin);
  background: var(--color-bg);
  color: var(--color-ink);
  text-decoration: none;
  font-size: 17px;
  scroll-snap-align: start;
  transition: transform 0.15s ease, background-color 0.15s ease;
}

.dock-item__label {
  font-family: 'Pretendard', sans-serif;
  font-size: 9px;
  font-weight: 600;
  color: var(--color-muted);
  white-space: nowrap;
}

.dock-item:hover {
  transform: translateY(-6px) rotate(-3deg) scale(1.08);
  background: var(--color-primary-bg);
  z-index: 2;
}

.dock-item--active {
  background: var(--color-primary);
  color: #fff;
}

.dock-item--active .dock-item__label {
  color: #fff;
}

.dock-hint {
  margin: 8px 0 0;
  font-size: 11px;
  color: var(--color-muted);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}
</style>
