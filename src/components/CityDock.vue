<script setup>
import { useRoute } from 'vue-router'
import { useWeatherStore } from '../stores/weatherStore.js'
import { getWeatherIcon } from '../utils/weatherIcon.js'

/**
 * CityDock — 맥북 Dock에서 아이디어를 가져온 상단 내비게이션.
 * - 라벨은 hover 없이 아이콘 아래 작은 글자로 항상 보인다.
 * - [버그 수정] "전체" 버튼은 스크롤 컨테이너(.dock) 안에서 `position: sticky`로
 *   왼쪽에 고정된다. "전체" 버튼 하나만 감싼 래퍼(.dock-pinned)를 sticky 컨테이너로
 *   두고, 그 래퍼가 왼쪽 여백(padding-left)까지 통째로 소유하게 했다. 원래는 이
 *   여백을 .dock 컨테이너의 padding으로 뒀는데, 스크롤 컨테이너 시작 지점의
 *   padding이 스크롤에 같이 딸려가는지는 브라우저마다 처리가 달라서, 그 틈으로
 *   뒤에 있는 도시 버튼이 살짝 비쳐 보이는 경우가 있었다. 여백 자체를 sticky
 *   래퍼 안으로 옮기니 항상 같은 배경으로 확실히 덮인다. 오른쪽은 padding-right +
 *   margin-right(-8px) 조합으로 원래 flex gap 자리까지 덮어서 다음 버튼과 겹치지 않는다.
 * - [버그 수정] 처음엔 스크롤 부드러움을 위해 scroll-snap을 걸어뒀는데, sticky로
 *   고정된 자식이 있는 상태에서 scroll-snap을 같이 쓰면 마우스를 올리기만 해도
 *   스냅 지점을 다시 계산하면서 맨 끝으로 스크롤이 튀는 버그가 있었다. 필수 기능이
 *   아니라서 scroll-snap 자체를 뺐다.
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
  padding: 12px 16px 12px 0;
  overflow-x: auto;
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
  padding: 0 8px 0 16px;
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
