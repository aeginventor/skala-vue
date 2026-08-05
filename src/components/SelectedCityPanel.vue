<script setup>
import { computed } from 'vue'
import { useConfigStore } from '../stores/configStore.js'
import { getWeatherTheme } from '../utils/weatherIcon.js'
import { getObjectParticle } from '../utils/josa.js'
import WeatherGlyph from './WeatherGlyph.vue'

/**
 * SelectedCityPanel — 고른 도시를 화면 하단 고정 바에 요약해 보여준다.
 * 카드 클릭은 "선택"만 하고, 상세로 가는 길은 이 패널의 버튼 하나뿐이다.
 * 클릭 즉시 화면이 바뀌면 선택됐다는 반응을 볼 틈이 없기 때문이다.
 * 세로 사이드 패널 대신 가로 바로 둔 것도 화면을 덜 가리면서 늘 보이게 하려는 것.
 */
// Vue 3.5부터 props 구조분해가 정식 지원되어, 꺼내 써도 반응형이 유지된다.
const { city } = defineProps({
  city: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['click-detail'])

const configStore = useConfigStore()

// 선택된 도시가 없을 때(city === null) 그려질 일이 없는 값들이라 옵셔널 체이닝으로 넘긴다
const theme = computed(() => (city ? getWeatherTheme(city.status) : null))

const displayTemp = computed(() => {
  const rawTemp = city?.temp
  if (rawTemp === undefined) return null
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return rawTemp
})

/** 도시 이름 받침에 따라 "을/를"이 갈린다 — 서울을, 대구를 (utils/josa.js) */
const selectionMessage = computed(() => {
  if (!city) return ''
  return `${city.name}${getObjectParticle(city.name)} 선택하셨습니다.`
})

function handleDetailClick() {
  if (city) emit('click-detail', city)
}
</script>

<template>
  <footer class="selected-bar">
    <div class="selected-bar__inner">
      <template v-if="city">
        <div
          class="selected-bar__icon-wrap"
          :style="{ '--panel-accent': theme.accent, '--panel-on-accent': theme.onAccent }"
        >
          <WeatherGlyph
            :status="city.status"
            :clouds="city.cloudsPercent"
            class="selected-bar__icon"
          />
        </div>

        <div class="selected-bar__info">
          <p class="selected-bar__name">
            {{ city.name }}
            <span class="selected-bar__region">{{ city.region }}</span>
          </p>
          <p class="selected-bar__meta">
            {{ displayTemp }}{{ configStore.unitSymbol }} · {{ city.status }}
          </p>
        </div>

        <p class="selected-bar__message">{{ selectionMessage }}</p>

        <div class="selected-bar__stats">
          <span><i class="fa-solid fa-droplet"></i> {{ city.humidity }}%</span>
          <span><i class="fa-solid fa-wind"></i> {{ city.windSpeed }}m/s</span>
        </div>

        <button class="selected-bar__detail-btn ink-pressable" @click="handleDetailClick">
          상세보기 <i class="fa-solid fa-arrow-right"></i>
        </button>
      </template>

      <p v-else class="selected-bar__placeholder">
        <i class="fa-solid fa-hand-pointer"></i> 카드를 클릭하거나 검색해 보세요.
      </p>
    </div>
  </footer>
</template>

<style scoped>
.selected-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 40;
  display: flex;
  justify-content: center;
  padding: 12px 16px;
  /* 뒤에 있는 카드가 스크롤될 때 비쳐 보이지 않도록 은은한 배경까지 같이 깔아준다 */
  background: linear-gradient(to top, var(--color-bg) 60%, transparent);
  pointer-events: none;
}

.selected-bar__inner {
  pointer-events: auto;
  width: 100%;
  max-width: 1080px;
  display: flex;
  align-items: center;
  gap: 14px;
  background: var(--color-surface);
  border: var(--border-thick);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-hard);
  padding: 10px 16px;
  min-height: 68px;
}

.selected-bar__icon-wrap {
  flex-shrink: 0;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  /* 카드와 같은 규칙: 원을 날씨색으로 꽉 채우고 그 위 아이콘 색만 밝기에 맞춰 바꾼다 */
  background: var(--panel-accent, var(--color-sun));
  border: var(--border-thin);
  display: flex;
  align-items: center;
  justify-content: center;
}

.selected-bar__icon {
  font-size: 32px;
  color: var(--panel-on-accent, var(--color-ink));
}

.selected-bar__info {
  min-width: 0;
}

/* 남는 폭을 전부 가져가서 바 한가운데에 놓이게 한다 */
.selected-bar__message {
  flex: 1;
  min-width: 0;
  margin: 0;
  text-align: center;
  font-family: 'Pretendard', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: var(--color-ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.selected-bar__name {
  margin: 0;
  font-family: 'Pretendard', sans-serif;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--color-ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.selected-bar__region {
  margin-left: 6px;
  font-family: 'Pretendard', sans-serif;
  font-size: 11px;
  font-weight: 400;
  color: var(--color-muted);
}

.selected-bar__meta {
  margin: 2px 0 0;
  font-size: 12px;
  color: var(--color-muted);
}

.selected-bar__stats {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 11px;
  color: var(--color-muted);
}

.selected-bar__detail-btn {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: var(--border-thick);
  background: var(--color-primary);
  color: #fff;
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-hard-sm);
  padding: 12px 16px;
  font-size: 13px;
  font-weight: 700;
}

.selected-bar__placeholder {
  margin: 0;
  padding: 6px 0;
  font-size: 13px;
  color: var(--color-muted);
  text-align: center;
  width: 100%;
}

@media (max-width: 720px) {
  .selected-bar__message {
    display: none;
  }
}

@media (max-width: 560px) {
  .selected-bar__stats,
  .selected-bar__region {
    display: none;
  }
}
</style>
