<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { findCityById } from '../data/weatherMockData.js'
import {
  fetchCurrentWeather,
  fetchForecast,
  mapWeatherResponse,
  mapForecastResponse
} from '../api/weatherApi.js'
import { useConfigStore } from '../stores/configStore.js'
import { getWeatherIcon } from '../utils/weatherIcon.js'
import { formatLocalTime } from '../utils/formatTime.js'

const route = useRoute()
const cityDetail = ref(null)
const forecastList = ref([])
const configStore = useConfigStore()

const isLoading = ref(true)
const fetchError = ref(null)

onMounted(async () => {
  const baseCity = findCityById(route.params.cityId)

  if (!baseCity) {
    isLoading.value = false
    return
  }

  cityDetail.value = baseCity // 우선 Mock 값으로 화면을 채워 빈 화면 방지

  try {
    const [currentWeatherData, forecastData] = await Promise.all([
      fetchCurrentWeather(baseCity.apiQuery),
      fetchForecast(baseCity.apiQuery)
    ])
    cityDetail.value = mapWeatherResponse(currentWeatherData, baseCity)
    forecastList.value = mapForecastResponse(forecastData)
  } catch (error) {
    fetchError.value = '실시간 날씨 데이터를 불러오지 못해 임시 데이터로 표시합니다.'
    console.error('[Axios 에러] OpenWeatherMap 호출 실패:', error)
  } finally {
    isLoading.value = false
  }
})

const displayTemp = computed(() => {
  const rawTemp = cityDetail.value?.temp
  if (rawTemp === undefined) return null
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return rawTemp
})

/** 예보 슬롯의 기온도 현재 선택된 단위(섭씨/화씨)에 맞춰 변환해서 보여준다 */
function displayForecastTemp(rawTemp) {
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return rawTemp
}

const visibilityKm = computed(() => {
  if (!cityDetail.value?.visibilityMeters && cityDetail.value?.visibilityMeters !== 0) return null
  return (cityDetail.value.visibilityMeters / 1000).toFixed(1)
})
</script>

<template>
  <div class="detail">
    <div v-show="isLoading" class="detail-card detail-card--empty">
      <p><i class="fa-solid fa-spinner fa-spin"></i> 날씨 정보를 불러오는 중입니다...</p>
    </div>

    <div v-if="!isLoading && cityDetail" class="detail-card">
      <h2><i class="fa-solid fa-chart-simple"></i> 지역별 상세 기상 관측 정보</h2>
      <p v-if="fetchError" class="fetch-error">
        <i class="fa-solid fa-triangle-exclamation"></i> {{ fetchError }}
      </p>

      <div class="hero">
        <i :class="['fa-solid', getWeatherIcon(cityDetail.status)]" class="hero__icon"></i>
        <div>
          <p class="hero__region"><i class="fa-solid fa-location-dot"></i> {{ cityDetail.region }}</p>
          <p class="hero__temp">{{ displayTemp }}{{ configStore.unitSymbol }}</p>
          <p class="hero__status">{{ cityDetail.status }}</p>
        </div>
      </div>

      <dl class="stat-grid">
        <div class="stat-tile">
          <dt><i class="fa-solid fa-temperature-half"></i> 체감 온도</dt>
          <dd v-if="cityDetail.feelsLike !== undefined">
            {{ configStore.unit === 'fahrenheit' ? Math.round((cityDetail.feelsLike * 9) / 5 + 32) : cityDetail.feelsLike }}{{ configStore.unitSymbol }}
          </dd>
          <dd v-else>-</dd>
        </div>
        <div class="stat-tile">
          <dt><i class="fa-solid fa-droplet"></i> 대기 습도</dt>
          <dd>{{ cityDetail.humidity }}%</dd>
        </div>
        <div class="stat-tile">
          <dt><i class="fa-solid fa-gauge"></i> 기압</dt>
          <dd>{{ cityDetail.pressure ?? '-' }}hPa</dd>
        </div>
        <div class="stat-tile">
          <dt><i class="fa-solid fa-wind"></i> 풍속 / 풍향</dt>
          <dd>{{ cityDetail.windSpeed }}m/s · {{ cityDetail.windDeg ?? '-' }}°</dd>
        </div>
        <div class="stat-tile">
          <dt><i class="fa-solid fa-cloud"></i> 구름량</dt>
          <dd>{{ cityDetail.cloudsPercent ?? '-' }}%</dd>
        </div>
        <div class="stat-tile">
          <dt><i class="fa-solid fa-eye"></i> 가시거리</dt>
          <dd>{{ visibilityKm ?? '-' }}km</dd>
        </div>
        <div class="stat-tile">
          <dt><i class="fa-solid fa-sun"></i> 일출</dt>
          <dd>{{ formatLocalTime(cityDetail.sunrise, cityDetail.timezoneOffsetSec) }}</dd>
        </div>
        <div class="stat-tile">
          <dt><i class="fa-solid fa-moon"></i> 일몰</dt>
          <dd>{{ formatLocalTime(cityDetail.sunset, cityDetail.timezoneOffsetSec) }}</dd>
        </div>
      </dl>

      <div v-if="forecastList.length > 0" class="forecast">
        <h3><i class="fa-solid fa-clock-rotate-left"></i> 앞으로 12시간 예보</h3>
        <div class="forecast-strip">
          <div v-for="slot in forecastList" :key="slot.time" class="forecast-slot">
            <span class="forecast-slot__time">{{ slot.time }}</span>
            <i :class="['fa-solid', getWeatherIcon(slot.status)]" class="forecast-slot__icon"></i>
            <span class="forecast-slot__temp">{{ displayForecastTemp(slot.temp) }}{{ configStore.unitSymbol }}</span>
          </div>
        </div>
      </div>

      <RouterLink to="/" class="back-btn"><i class="fa-solid fa-arrow-left"></i> 메인 대시보드로 돌아가기</RouterLink>
    </div>

    <div v-else-if="!isLoading" class="detail-card detail-card--empty">
      <p>해당 도시 코드({{ route.params.cityId }})를 찾을 수 없습니다.</p>
      <RouterLink to="/" class="back-btn"><i class="fa-solid fa-arrow-left"></i> 메인 대시보드로 돌아가기</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.detail {
  max-width: 560px;
  margin: 0 auto;
}

.detail-card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  padding: 22px 24px;
}

.detail-card h2 {
  font-family: 'Space Grotesk', 'Pretendard', sans-serif;
  font-size: 17px;
  font-weight: 600;
  margin: 0 0 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-ink);
}

.detail-card h2 i {
  color: var(--color-primary);
}

.fetch-error {
  margin: 0 0 12px;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-warning);
  background: var(--color-warning-bg);
  border-radius: var(--radius-sm);
  padding: 10px 14px;
}

.hero {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 6px 4px 20px;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 18px;
}

.hero__icon {
  width: 72px;
  height: 72px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--color-primary-bg);
  font-size: 32px;
  color: var(--color-primary);
}

.hero__region {
  margin: 0 0 4px;
  font-size: 12px;
  color: var(--color-muted);
}

.hero__temp {
  margin: 0;
  font-family: 'Space Grotesk', 'Pretendard', sans-serif;
  font-size: 34px;
  font-weight: 600;
  color: var(--color-ink);
}

.hero__status {
  margin: 2px 0 0;
  font-size: 13px;
  color: var(--color-muted);
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin: 0 0 20px;
}

.stat-tile {
  background: var(--color-bg);
  border-radius: var(--radius-sm);
  padding: 10px 12px;
}

.stat-tile dt {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--color-muted);
  margin-bottom: 4px;
}

.stat-tile dt i {
  color: var(--color-primary);
}

.stat-tile dd {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-ink);
}

.forecast h3 {
  font-size: 13px;
  margin: 0 0 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--color-muted);
}

.forecast-strip {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.forecast-slot {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: var(--color-bg);
  border-radius: var(--radius-sm);
  padding: 10px 6px;
  font-size: 12px;
}

.forecast-slot__time {
  color: var(--color-muted);
}

.forecast-slot__icon {
  color: var(--color-primary);
  font-size: 16px;
}

.forecast-slot__temp {
  font-weight: 600;
  color: var(--color-ink);
}

.detail-card--empty {
  text-align: center;
  color: var(--color-muted);
  font-size: 14px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--color-ink);
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  font-size: 13px;
  padding: 10px 18px;
  border-radius: var(--radius-sm);
}
</style>
