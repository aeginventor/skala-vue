<script setup>
import { computed } from 'vue'
import { useConfigStore } from '../stores/configStore.js'
import { getWeatherIcon } from '../utils/weatherIcon.js'

const props = defineProps({
  city: {
    type: Object,
    required: true
  },
  isSelected: {
    type: Boolean,
    default: false
  },
  isFavorite: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['select-card', 'click-detail', 'toggle-favorite'])

const configStore = useConfigStore()

const icon = computed(() => getWeatherIcon(props.city.status))

const displayTemp = computed(() => {
  const rawTemp = props.city.temp
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return rawTemp
})

function handleCardClick() {
  emit('select-card', props.city)
}

function handleDetailClick() {
  emit('click-detail', props.city)
}

function handleFavoriteClick() {
  emit('toggle-favorite', props.city)
}

function isHot(rawCelsiusTemp) {
  return rawCelsiusTemp >= 25
}
</script>

<template>
  <li class="weather-card" :class="{ 'weather-card--active': isSelected }" @click="handleCardClick">
    <i :class="['fa-solid', icon]" class="weather-card__icon"></i>

    <div class="weather-card__body">
      <div class="weather-card__top">
        <div class="weather-card__title">
          {{ city.name }} ({{ city.status }})
          <p class="weather-card__temp">현재 기온: {{ displayTemp }}{{ configStore.unitSymbol }}</p>
        </div>
        <button
          class="favorite-btn"
          :class="{ 'favorite-btn--active': isFavorite }"
          :aria-label="isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'"
          @click.stop="handleFavoriteClick"
        >
          <i :class="isFavorite ? 'fa-solid fa-star' : 'fa-regular fa-star'"></i>
        </button>
        <button class="detail-btn" @click.stop="handleDetailClick">
          상세보기 <i class="fa-solid fa-chevron-right"></i>
        </button>
      </div>

      <span v-if="isHot(city.temp)" class="badge badge--hot">
        <i class="fa-solid fa-fire"></i> 더움 (25도 이상)
      </span>
      <span v-else class="badge badge--cool">
        <i class="fa-solid fa-snowflake"></i> 선선함 (25도 미만)
      </span>
    </div>
  </li>
</template>

<style scoped>
.weather-card {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 14px 16px;
  cursor: pointer;
  transition: border-color 0.15s, background-color 0.15s;
  list-style: none;
}

.weather-card:hover {
  border-color: var(--color-primary);
}

.weather-card--active {
  border-color: var(--color-primary);
  background: var(--color-primary-bg);
}

.weather-card__icon {
  flex-shrink: 0;
  width: 34px;
  text-align: center;
  font-size: 22px;
  color: var(--color-primary);
  margin-top: 2px;
}

.weather-card__body {
  flex: 1;
  min-width: 0;
}

.weather-card__top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
}

.weather-card__title {
  font-weight: 600;
  font-size: 14px;
  color: var(--color-ink);
}

.weather-card__temp {
  margin: 4px 0 0;
  font-weight: 400;
  color: var(--color-muted);
  font-size: 13px;
}

.favorite-btn {
  border: none;
  background: transparent;
  color: var(--color-muted);
  font-size: 15px;
  cursor: pointer;
  padding: 4px;
}

.favorite-btn--active {
  color: var(--color-favorite);
}

.detail-btn {
  border: 1px solid var(--color-border);
  background: #fff;
  border-radius: var(--radius-sm);
  padding: 6px 10px;
  font-size: 12px;
  color: var(--color-ink);
  cursor: pointer;
}

.detail-btn:hover {
  background: var(--color-primary-bg);
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 999px;
}

.badge--hot {
  background: var(--color-hot-bg);
  color: var(--color-hot);
}

.badge--cool {
  background: var(--color-cool-bg);
  color: var(--color-cool);
}
</style>
