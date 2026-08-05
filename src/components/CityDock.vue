<script setup>
import { ref, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWeatherStore } from '../stores/weatherStore.js'
import { getWeatherIcon } from '../utils/weatherIcon.js'

/**
 * CityDock — 맥북 Dock에서 아이디어를 가져온 상단 내비게이션.
 *
 * 라벨은 hover 없이 아이콘 아래 작은 글자로 항상 보인다.
 *
 * "전체"와 "랜덤"은 스크롤 컨테이너(.dock) 양 끝에 `position: sticky`로
 * 고정된다. 각각 구분선과 하나로 묶은 래퍼(.dock-pinned)가 자기 쪽 바깥
 * 여백까지 통째로 소유한다 — 이 여백을 .dock 컨테이너의 padding으로 두면
 * 스크롤 컨테이너 시작/끝 지점의 padding이 스크롤에 같이 딸려가는지가
 * 브라우저마다 달라서, 그 틈으로 뒤에 있는 도시 버튼이 비쳐 보일 수 있다.
 * 구분선도 이 래퍼 안에 넣어 sticky와 한 몸으로 고정했다. 래퍼 밖에 두면
 * 스크롤을 시작하는 순간 구분선도 다른 도시 아이콘들과 같이 딸려가 버려서
 * 경계가 스크롤 위치 0(또는 끝)에서만 보이고 바로 사라진다.
 *
 * 도시 아이콘은 고정된 위치 핀이 아니라, weatherStore.cities(Home에서
 * Axios로 갱신한 실시간 값)를 그대로 참조해서 그 도시의 현재 날씨 상태에
 * 맞는 아이콘을 보여준다.
 *
 * 트랙패드/스크롤휠 없이도 마우스로 아이콘을 잡고 옆으로 끌면 가로
 * 스크롤이 되게 했다. mousedown 시점의 좌표·scrollLeft를 기억해뒀다가,
 * mousemove 때 그 차이만큼 scrollLeft를 직접 옮긴다. 버튼(RouterLink) 위에서
 * 시작해도 동작해야 해서, 일정 거리(4px) 이상 움직였을 때만 "드래그"로
 * 인정하고 그 경우에만 클릭 이벤트를 막아 실수로 페이지 이동이 되지 않게
 * 한다. 드래그 중엔 지나가는 버튼마다 hover 확대(translateY + scale) 효과가
 * 계속 걸려 고정된 "전체"/"랜덤" 영역 뒤를 지날 때 테두리가 삐져나와
 * 보이므로, `.dock--dragging` 클래스로 드래그 중에는 hover 확대 자체를 끈다.
 */
const route = useRoute()
const router = useRouter()
const weatherStore = useWeatherStore()
const dockEl = ref(null)
const isDragging = ref(false)

let isPointerDown = false
let dragMoved = false
let dragStartX = 0
let dragStartScrollLeft = 0

function isActiveCity(cityId) {
  return route.params.cityId === cityId
}

function goToRandomCity() {
  const cities = weatherStore.cities
  if (cities.length === 0) return
  const randomCity = cities[Math.floor(Math.random() * cities.length)]
  router.push(`/weather/${randomCity.id}`)
}

function handleDragStart(event) {
  if (event.button !== 0 || !dockEl.value) return
  isPointerDown = true
  dragMoved = false
  dragStartX = event.pageX
  dragStartScrollLeft = dockEl.value.scrollLeft
  // 링크를 마우스로 끌 때 브라우저가 기본으로 하는 "링크 드래그"/텍스트 선택을 막는다
  event.preventDefault()
  window.addEventListener('mousemove', handleDragMove)
  window.addEventListener('mouseup', handleDragEnd)
}

function handleDragMove({ pageX }) {
  if (!isPointerDown || !dockEl.value) return
  const delta = pageX - dragStartX
  if (Math.abs(delta) > 4) {
    dragMoved = true
    isDragging.value = true
  }
  if (dragMoved) {
    dockEl.value.scrollLeft = dragStartScrollLeft - delta
  }
}

function handleDragEnd() {
  isPointerDown = false
  isDragging.value = false
  window.removeEventListener('mousemove', handleDragMove)
  window.removeEventListener('mouseup', handleDragEnd)
}

/** 드래그였다면(버튼을 잡고 옆으로 끌었다면) 그 클릭이 라우터 이동으로 이어지지 않게 막는다 */
function handleDockClickCapture(event) {
  if (dragMoved) {
    event.preventDefault()
    event.stopPropagation()
  }
}

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', handleDragMove)
  window.removeEventListener('mouseup', handleDragEnd)
})
</script>

<template>
  <div class="dock-wrap">
    <nav
      ref="dockEl"
      class="dock"
      :class="{ 'dock--dragging': isDragging }"
      aria-label="지역 바로가기 Dock"
      @mousedown="handleDragStart"
      @click.capture="handleDockClickCapture"
    >
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
        <span class="dock-divider" aria-hidden="true"></span>
      </div>

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

      <div class="dock-pinned dock-pinned--end">
        <span class="dock-divider" aria-hidden="true"></span>
        <button
          type="button"
          class="dock-item ink-pressable"
          title="랜덤 지역 날씨"
          @click="goToRandomCity"
        >
          <i class="fa-solid fa-shuffle"></i>
          <span class="dock-item__label">랜덤</span>
        </button>
      </div>
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
  padding: 12px 0;
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
 * "전체"/"랜덤" 버튼 + 구분선을 스크롤 컨테이너(.dock) 양 끝에 고정하는
 * 래퍼. 자기 쪽 바깥 여백(padding) + 반대쪽 margin(-8px)을 함께 써서 이
 * 래퍼의 배경이 flex gap 틈까지 덮게 만들었다 — 그래야 스크롤되는 도시
 * 아이콘이 gap 사이로 비치거나 고정 버튼과 겹쳐 보이지 않는다.
 *
 * padding 구간의 마지막 8px는 배경이 투명으로 그라데이션된다. 이 폭은
 * scrollLeft가 양 끝일 때의 flex gap과 정확히 맞아떨어지도록 맞춘 값이라,
 * 정지 상태에서는 옆 도시 버튼을 가리지 않는다. 스크롤이 시작되면 이
 * 구간에 걸리는 도시 버튼의 모서리가 각진 컷 대신 배경 속으로 스며들듯
 * 부드럽게 보인다. 그라데이션 폭을 이 padding보다 넓게 잡으면 정지
 * 상태에서도 옆 버튼을 가리게 되므로 늘리지 않는다.
 */
.dock-pinned {
  position: sticky;
  left: 0;
  z-index: 5;
  flex-shrink: 0;
  display: flex;
  align-items: stretch;
  gap: 6px;
  background: linear-gradient(
    to right,
    var(--color-surface) 0,
    var(--color-surface) calc(100% - 8px),
    transparent 100%
  );
  padding: 0 8px 0 16px;
  margin-right: -8px;
}

.dock-pinned--end {
  left: auto;
  right: 0;
  background: linear-gradient(
    to left,
    var(--color-surface) 0,
    var(--color-surface) calc(100% - 8px),
    transparent 100%
  );
  padding: 0 16px 0 8px;
  margin-right: 0;
  margin-left: -8px;
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
  font-family: inherit;
  font-size: 17px;
  padding: 0;
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

/* 드래그로 스크롤하는 동안엔 커서가 지나가는 버튼마다 확대 효과가 걸려 삐져나와 보이는
   문제가 있어서, 드래그 중에는 hover 확대를 꺼서 버튼들이 평평하게 지나가게 한다. */
.dock--dragging .dock-item:hover {
  transform: none;
  background: var(--color-bg);
  z-index: auto;
}

.dock--dragging .dock-item--active:hover {
  background: var(--color-primary);
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
