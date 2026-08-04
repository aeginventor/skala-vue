<script setup>
import { useRoute } from 'vue-router'
import { weatherMockData } from '../data/weatherMockData.js'
import { getWeatherIcon } from '../utils/weatherIcon.js'

/**
 * CityDock — 맥북 Dock에서 아이디어를 가져온 상단 내비게이션.
 * - [전체] · [도시별 아이콘] · [소개] 을 한 줄로 붙여두고, 마우스를 올리면 아이콘이
 *   떠오르며 커진다 (Dock 느낌).
 * - 도시 아이콘은 고정 핀이 아니라 그 도시의 현재 날씨 상태에 맞는 아이콘(getWeatherIcon())을
 *   보여준다 → Dock만 훑어봐도 지역 날씨를 짐작할 수 있다.
 */
const route = useRoute()

function isActiveCity(cityId) {
  return route.params.cityId === cityId
}
</script>

<template>
  <nav class="dock" aria-label="지역 바로가기 Dock">
    <RouterLink
      to="/"
      class="dock-item"
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
      class="dock-item"
      :class="{ 'dock-item--active': isActiveCity(city.id) }"
      :title="city.name"
    >
      <i :class="['fa-solid', getWeatherIcon(city.status)]"></i>
      <span class="dock-item__label">{{ city.name }}</span>
    </RouterLink>

    <span class="dock-divider" aria-hidden="true"></span>

    <RouterLink
      to="/about"
      class="dock-item"
      :class="{ 'dock-item--active': route.name === 'weather-about' }"
      title="서비스 소개"
    >
      <i class="fa-solid fa-circle-info"></i>
      <span class="dock-item__label">소개</span>
    </RouterLink>
  </nav>
</template>

<style scoped>
.dock {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  padding: 12px 16px;
  overflow-x: auto;
}

.dock-divider {
  width: 1px;
  align-self: stretch;
  background: var(--color-border);
  margin: 4px 2px;
  flex-shrink: 0;
}

.dock-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 56px;
  height: 56px;
  flex-shrink: 0;
  border-radius: var(--radius-sm);
  background: var(--color-bg);
  color: var(--color-ink);
  text-decoration: none;
  font-size: 17px;
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
  transform: translateY(-4px) scale(1.08);
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
</style>
