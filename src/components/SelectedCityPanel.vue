<script setup>
import { computed } from 'vue'
import { useConfigStore } from '../stores/configStore.js'
import { getWeatherIcon, getWeatherTheme } from '../utils/weatherIcon.js'

/**
 * SelectedCityPanel
 * - [피드백 반영] 원래는 카드를 클릭하면 바로 상세 페이지로 넘어갔는데, 그러면
 *   "카드를 클릭했을 때 하단 상태바에 문구가 뜬다"는 원래 기능을 눈으로 볼 틈도
 *   없이 화면이 바뀌어버렸다. 그래서 카드 클릭은 다시 "선택만" 하도록 되돌리고,
 *   상세 페이지로 가는 길은 카드의 "상세보기" 버튼 하나로만 남겼다.
 * - 선택 결과를 하단의 한 줄짜리 상태바 대신, 목록 옆 사이드에 아이콘·기온·습도까지
 *   보여주는 미리보기 패널로 옮겼다. 스크롤해서 하단까지 안 내려가도 바로 보이고,
 *   텍스트 한 줄보다 눈에 잘 들어온다.
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
  <div class="selected-panel">
    <template v-if="city">
      <div
        class="selected-panel__icon-wrap"
        :style="{ '--panel-bg': theme.bg, '--panel-accent': theme.accent }"
      >
        <i :class="['fa-solid', icon]" class="selected-panel__icon"></i>
      </div>
      <p class="selected-panel__name">{{ city.name }}</p>
      <p class="selected-panel__region"><i class="fa-solid fa-location-dot"></i> {{ city.region }}</p>
      <p class="selected-panel__temp">{{ displayTemp }}<span class="selected-panel__unit">{{ configStore.unitSymbol }}</span></p>
      <p class="selected-panel__status">{{ city.status }}</p>

      <div class="selected-panel__stats">
        <span><i class="fa-solid fa-droplet"></i> {{ city.humidity }}%</span>
        <span><i class="fa-solid fa-wind"></i> {{ city.windSpeed }}m/s</span>
      </div>

      <button class="selected-panel__detail-btn ink-pressable" @click="handleDetailClick">
        상세보기 <i class="fa-solid fa-arrow-right"></i>
      </button>
    </template>

    <p v-else class="selected-panel__placeholder">
      <i class="fa-solid fa-hand-pointer"></i> 카드를 클릭하면 여기서 바로 확인할 수 있어요.
    </p>
  </div>
</template>

<style scoped>
.selected-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.selected-panel__icon-wrap {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  background: var(--panel-bg, var(--color-sun-bg));
  border: var(--border-thick);
  box-shadow: var(--shadow-hard-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
}

.selected-panel__icon {
  font-size: 36px;
  color: var(--panel-accent, var(--color-sun));
}

.selected-panel__name {
  margin: 0;
  font-family: 'Fredoka', 'Pretendard', sans-serif;
  font-size: 22px;
  font-weight: 600;
  color: var(--color-ink);
}

.selected-panel__region {
  margin: 4px 0 12px;
  font-size: 12px;
  color: var(--color-muted);
  display: flex;
  align-items: center;
  gap: 4px;
}

.selected-panel__temp {
  margin: 0;
  font-family: 'Fredoka', 'Pretendard', sans-serif;
  font-size: 40px;
  font-weight: 600;
  line-height: 1;
  color: var(--color-ink);
}

.selected-panel__unit {
  font-size: 18px;
  margin-left: 2px;
}

.selected-panel__status {
  margin: 6px 0 16px;
  font-size: 13px;
  color: var(--color-muted);
}

.selected-panel__stats {
  display: flex;
  gap: 14px;
  font-size: 12px;
  color: var(--color-muted);
  margin-bottom: 18px;
}

.selected-panel__detail-btn {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: var(--border-thick);
  background: var(--color-primary);
  color: #fff;
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-hard-sm);
  padding: 14px 16px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.selected-panel__placeholder {
  margin: 20px 0;
  font-size: 13px;
  color: var(--color-muted);
  line-height: 1.6;
}
</style>
