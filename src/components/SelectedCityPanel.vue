<script setup>
import { computed } from 'vue'
import { useConfigStore } from '../stores/configStore.js'
import { getWeatherIcon, getWeatherTheme } from '../utils/weatherIcon.js'

/**
 * SelectedCityPanel
 * - [피드백 반영] 원래는 카드를 클릭하면 바로 상세 페이지로 넘어갔는데, 그러면
 *   "카드를 클릭했을 때 하단에 문구가 뜬다"는 원래 기능을 눈으로 볼 틈도 없이
 *   화면이 바뀌어버렸다. 그래서 카드 클릭은 다시 "선택만" 하도록 되돌리고,
 *   상세 페이지로 가는 길은 카드의 "상세보기" 버튼 하나로만 남겼다.
 * - [피드백 반영] 처음엔 이 패널을 목록 옆 사이드로 옮겼는데, 카드 그리드와 나란히
 *   두니 디자인 밸런스가 깨졌다. 다시 하단으로 되돌리되, 그냥 페이지 맨 아래
 *   (normal flow)에 두면 스크롤을 끝까지 내려야만 보이는 게 문제라서
 *   position: fixed로 뷰포트 바닥에 항상 붙어있게 만들었다. 가로로 넓은 바 형태라
 *   세로로 긴 사이드 패널보다 화면을 덜 가리면서도 스크롤 없이 항상 보인다.
 */
const props = defineProps({
  city: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['click-detail'])

const configStore = useConfigStore()

const theme = computed(() => (props.city ? getWeatherTheme(props.city.status) : null))
const icon = computed(() => (props.city ? getWeatherIcon(props.city.status) : ''))

const displayTemp = computed(() => {
  if (!props.city) return null
  const rawTemp = props.city.temp
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return rawTemp
})

function handleDetailClick() {
  if (props.city) emit('click-detail', props.city)
}
</script>

<template>
  <footer class="selected-bar">
    <div class="selected-bar__inner">
      <template v-if="city">
        <div
          class="selected-bar__icon-wrap"
          :style="{ '--panel-bg': theme.bg, '--panel-accent': theme.accent }"
        >
          <i :class="['fa-solid', icon]" class="selected-bar__icon"></i>
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
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--panel-bg, var(--color-sun-bg));
  border: var(--border-thin);
  display: flex;
  align-items: center;
  justify-content: center;
}

.selected-bar__icon {
  font-size: 20px;
  color: var(--panel-accent, var(--color-sun));
}

.selected-bar__info {
  flex: 1;
  min-width: 0;
}

.selected-bar__name {
  margin: 0;
  font-family: 'Fredoka', 'Pretendard', sans-serif;
  font-size: 16px;
  font-weight: 600;
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
  cursor: pointer;
}

.selected-bar__placeholder {
  margin: 0;
  padding: 6px 0;
  font-size: 13px;
  color: var(--color-muted);
  text-align: center;
  width: 100%;
}

@media (max-width: 560px) {
  .selected-bar__stats,
  .selected-bar__region {
    display: none;
  }
}
</style>
