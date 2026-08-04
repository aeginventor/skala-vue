<script setup>
import { useRoute } from 'vue-router'
import { useWeatherStore } from '../stores/weatherStore.js'
import { getWeatherIcon } from '../utils/weatherIcon.js'

/**
 * CityDock — 맥북 Dock에서 아이디어를 가져온 상단 내비게이션.
 * - 라벨은 hover 없이 아이콘 아래 작은 글자로 항상 보인다.
 * - [피드백 반영] "전체" 버튼은 스크롤 컨테이너(.dock) 안에서 `position: sticky`로
 *   왼쪽에 고정된다. "전체" 버튼 하나만 감싼 래퍼(.dock-pinned)를 sticky 컨테이너로
 *   두고, 그 래퍼 자체가 배경색을 채운 채 옆으로 8px(= 원래 flex gap)만큼 더
 *   넓게 그려지도록 padding-right + margin-right(-8px)를 걸었다. 이렇게 하면
 *   스크롤되는 다른 버튼들이 sticky 영역 뒤로 지나갈 때 gap 틈새로 살짝 비쳐 보이는
 *   문제 없이 완전히 가려지고, 다음 버튼과의 간격도 원래와 동일하게 유지된다.
 * - 도시 아이콘은 고정된 위치 핀이 아니라, weatherStore.cities(Home에서 Axios로
 *   갱신한 실시간 값)를 그대로 참조해서 그 도시의 현재 날씨 상태에 맞는 아이콘을
 *   보여준다.
 */
const route = useRoute()
const weatherStore = useWeatherStore()

function isActiveCity(cityId) {
  return route.params.cityId === cityId
}
</script>

<template>
  <div class="dock-wrap">
    <nav class="dock" aria-label="지역 바로가기 Dock">
      <div class="dock-pinned">
        <RouterLink
          to="/"
          class="dock-item ink-pressable"
          :class="{ 'dock-item--active': route.name === 'weather-home' }"
          title="전체 대시보드"
        >
          <i class="fa-solid fa-house"></i>
          <span class="dock-item__label">전체</span>
        </RouterLink>
      </div>

      <span class="dock-divider" aria-hidden="true"></span>

      <RouterLink
        v-for="city in weatherStore.cities"
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

/*
 * "전체" 버튼을 스크롤 컨테이너(.dock) 왼쪽 끝에 고정.
 * padding-right + 음수 margin-right 조합으로 이 래퍼의 배경이 flex gap 틈까지
 * 덮게 만들어서, 뒤로 스크롤되는 다른 도시 아이콘이 gap 사이로 비치거나
 * "전체" 버튼과 겹쳐 보이는 일이 없게 했다.
 */
.dock-pinned {
  position: sticky;
  left: 0;
  z-index: 5;
  flex-shrink: 0;
  background: var(--color-surface);
  padding-right: 8px;
  margin-right: -8px;
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
  z-index: 4;
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
