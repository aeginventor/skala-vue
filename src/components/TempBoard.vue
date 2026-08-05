<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useConfigStore } from '../stores/configStore.js'
import { useWeatherStore } from '../stores/weatherStore.js'
import { getTempLevel } from '../utils/tempLevel.js'

/**
 * TempBoard — 30개 지역 기온을 6개씩 다섯 장으로 넘겨 보여준다.
 * 아래 카드 목록은 도시당 정보가 많아 훑으려면 한참 스크롤해야 하는데, 여기서는
 * 이름과 기온만 남겨 가만히 둬도 전국이 한 바퀴 지나간다.
 * 검색과 무관하게 **항상 30개 전체**를 돈다 — 좁혀진 목록을 따라가면 목적이 사라진다.
 */
const PAGE_SIZE = 6
const FLIP_INTERVAL_MS = 4000

const configStore = useConfigStore()
const weatherStore = useWeatherStore()

const pageIndex = ref(0)
/** 읽는 도중에 넘어가 버리면 성가시므로 마우스를 얹거나 키보드 초점이 들어오면 멈춘다 */
const isPaused = ref(false)

const pages = computed(() => {
  const cities = weatherStore.cities
  return Array.from({ length: Math.ceil(cities.length / PAGE_SIZE) }, (_, i) =>
    cities.slice(i * PAGE_SIZE, (i + 1) * PAGE_SIZE)
  )
})

const currentPage = computed(() => pages.value[pageIndex.value] ?? [])

/** 표시만 단위에 맞춰 바꾸고, 색을 정하는 판정은 아래에서 원본 섭씨로 한다 */
function displayTemp(rawCelsius) {
  if (configStore.unit === 'fahrenheit') return Math.round((rawCelsius * 9) / 5 + 32)
  return rawCelsius
}

function levelOf(city) {
  return getTempLevel(city.temp)
}

let timerId = null

function stopFlipping() {
  clearInterval(timerId)
  timerId = null
}

function startFlipping() {
  stopFlipping()

  // 움직임을 줄여달라고 설정한 사용자에게는 자동으로 넘기지 않는다. 아래 점으로 직접 넘길 수 있다.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  timerId = setInterval(() => {
    if (isPaused.value || pages.value.length === 0) return
    pageIndex.value = (pageIndex.value + 1) % pages.value.length
  }, FLIP_INTERVAL_MS)
}

// 예시↔실시간을 오가면 목록이 통째로 바뀐다. 보던 장이 사라졌으면 첫 장으로 되돌린다.
watch(pages, (newPages) => {
  if (pageIndex.value >= newPages.length) pageIndex.value = 0
})

onMounted(startFlipping)
/** 화면을 떠난 뒤에도 타이머가 살아 있으면 없는 컴포넌트를 계속 건드리게 된다 */
onBeforeUnmount(stopFlipping)
</script>

<template>
  <section
    class="temp-board"
    aria-label="전국 기온 훑어보기"
    @mouseenter="isPaused = true"
    @mouseleave="isPaused = false"
    @focusin="isPaused = true"
    @focusout="isPaused = false"
  >
    <div class="temp-board__head">
      <h2><i class="fa-solid fa-temperature-half"></i> 전국 기온 훑어보기</h2>
      <p class="temp-board__hint">가만히 두면 30개 지역이 차례로 지나가요</p>
    </div>

    <ul v-if="weatherStore.isLoading" class="temp-board__grid" aria-busy="true">
      <li v-for="n in PAGE_SIZE" :key="n" class="skeleton temp-board__skeleton"></li>
    </ul>

    <ul v-else class="temp-board__grid">
      <li
        v-for="city in currentPage"
        :key="city.id"
        class="temp-board__cell"
        :style="{ '--cell-bg': levelOf(city).color, '--cell-fg': levelOf(city).on }"
      >
        <span class="temp-board__name">{{ city.name }}</span>
        <span class="temp-board__temp">
          {{ displayTemp(city.temp) }}<small>{{ configStore.unitSymbol }}</small>
        </span>
      </li>
    </ul>

    <div class="temp-board__dots">
      <button
        v-for="(page, i) in pages"
        :key="i"
        type="button"
        class="temp-board__dot"
        :class="{ 'temp-board__dot--on': i === pageIndex }"
        :aria-label="`${i + 1}번째 지역 묶음 보기`"
        :aria-current="i === pageIndex"
        @click="pageIndex = i"
      ></button>
    </div>
  </section>
</template>

<style scoped>
.temp-board {
  background: var(--color-surface);
  border: var(--border-thick);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-hard);
  padding: 18px 20px 14px;
}

.temp-board__head {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 4px 10px;
  margin-bottom: 14px;
}

.temp-board__head h2 {
  font-family: 'Pretendard', sans-serif;
  font-size: 17px;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0;
  color: var(--color-ink);
}

.temp-board__head h2 i {
  color: var(--color-primary);
  font-size: 15px;
}

.temp-board__hint {
  margin: 0;
  font-size: 12px;
  color: var(--color-muted);
}

/*
 * auto-fit + minmax 라서 미디어 쿼리 없이도 폭에 맞춰 열 수가 준다. 한 장이 6칸이라
 * 넓은 화면에서는 남는 트랙이 접히면서 6칸이 한 줄로 늘어서고, 좁아지면 3칸씩 두 줄로
 * 흐른다. 최소 폭은 모바일(약 390px)에서 3열이 유지되는 선으로 잡았다.
 */
.temp-board__grid {
  list-style: none;
  margin: 0 0 12px;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 8px;
}

.temp-board__cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 10px 6px;
  border: var(--border-thin);
  border-radius: var(--radius-sm);
  background: var(--cell-bg);
  color: var(--cell-fg);
}

.temp-board__name {
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}

.temp-board__temp {
  font-family: 'Pretendard', sans-serif;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.temp-board__temp small {
  font-size: 11px;
  margin-left: 1px;
}

.temp-board__skeleton {
  height: 60px;
  border-radius: var(--radius-sm);
}

.temp-board__dots {
  display: flex;
  justify-content: center;
  gap: 6px;
}

.temp-board__dot {
  width: 9px;
  height: 9px;
  padding: 0;
  border-radius: 50%;
  border: var(--border-thin);
  background: var(--color-surface);
}

.temp-board__dot--on {
  background: var(--color-ink);
}
</style>
