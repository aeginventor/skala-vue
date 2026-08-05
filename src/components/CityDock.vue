<script setup>
import { ref, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWeatherStore } from '../stores/weatherStore.js'
import WeatherGlyph from './WeatherGlyph.vue'

/**
 * CityDock — 30개 지역을 가로로 늘어놓은 상단 내비게이션.
 * 아이콘은 weatherStore를 참조하므로 실시간 날씨가 그대로 반영된다.
 * 마우스로 끌어도 가로 스크롤이 되는데, 버튼 위에서 시작해도 동작해야 해서
 * 4px 이상 움직였을 때만 드래그로 보고 그때만 클릭을 막는다.
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
        <WeatherGlyph :status="city.status" />
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
 * "전체"/"랜덤"을 스크롤 컨테이너 양 끝에 고정하는 래퍼. 구분선까지 같이 넣어야
 * 스크롤을 시작해도 경계가 딸려가지 않는다.
 * 끝 8px는 투명으로 흐려서 지나가는 카드가 각지게 잘리지 않게 했다. 이 폭은
 * 정지 상태의 flex gap과 맞춘 값이라, 더 넓히면 멈춰 있을 때 옆 버튼을 가린다.
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
  font-size: 26px;
  padding: 0;
  transition: transform 0.15s ease, background-color 0.15s ease;
}

/*
 * 한 줄에 촘촘히 붙는 버튼들이라 카드처럼 기울이면 어수선해진다. 모서리 굴림만
 * 두세 벌로 돌려 써서, 줄지어 있어도 똑같이 찍어낸 느낌은 나지 않게 한다.
 */
.dock-item:nth-child(2n) {
  border-radius: 9px 12px 10px 11px;
}

.dock-item:nth-child(3n) {
  border-radius: 12px 10px 11px 9px;
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
