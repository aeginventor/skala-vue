<script setup>
const props = defineProps({
  city: {
    type: Object,
    required: true,
  },
  isSelected: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['select-card', 'click-detail'])

function handleCardClick() {
  emit('select-card', props.city)
}

function handleDetailClick() {
  emit('click-detail', props.city)
}

function isHot(temp) {
  return temp >= 25
}
</script>

<template>
  <li class="weather-card" :class="{ 'weather-card--active': isSelected }" @click="handleCardClick">
    <div class="weather-card__top">
      <div class="weather-card__title">
        {{ city.name }} ({{ city.status }})
        <p class="weather-card__temp">현재 기온: {{ city.temp }}°C</p>
      </div>
      <button class="detail-btn" @click.stop="handleDetailClick">상세보기</button>
    </div>

    <span v-if="isHot(city.temp)" class="badge badge--hot">🔥 더움 (25도 이상)</span>
    <span v-else class="badge badge--cool">❄️ 선선함 (25도 미만)</span>
  </li>
</template>

<style scoped>
.weather-card {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 14px 16px;
  cursor: pointer;
  transition:
    border-color 0.15s,
    background-color 0.15s;
  list-style: none;
}

.weather-card:hover {
  border-color: #93c5fd;
}

.weather-card--active {
  border-color: #3b82f6;
  background: #eff6ff;
}

.weather-card__top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.weather-card__title {
  font-weight: 600;
  font-size: 14px;
}

.weather-card__temp {
  margin: 4px 0 0;
  font-weight: 400;
  color: #4b5563;
  font-size: 13px;
}

.detail-btn {
  border: 1px solid #d1d5db;
  background: #fff;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 12px;
  cursor: pointer;
}

.detail-btn:hover {
  background: #f3f4f6;
}

.badge {
  display: inline-block;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 999px;
}

.badge--hot {
  background: #fee2e2;
  color: #b91c1c;
}

.badge--cool {
  background: #dbeafe;
  color: #1d4ed8;
}
</style>
