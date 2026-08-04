<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import {
  fetchCurrentWeather,
  fetchForecast,
  mapWeatherResponse,
  mapForecastResponse
} from '../api/weatherApi.js'
import { useConfigStore } from '../stores/configStore.js'
import { useWeatherStore } from '../stores/weatherStore.js'
import { getWeatherIcon } from '../utils/weatherIcon.js'
import { formatLocalTime } from '../utils/formatTime.js'

/**
 * WeatherDetailView
 * - 라우트 경로: /weather/:cityId
 *
 * [버그 수정] Dock에서 도시 A 상세를 보다가 도시 B를 클릭하면 URL은 바뀌는데
 * 화면이 그대로였던 이유: 두 경로가 같은 라우트 레코드(`/weather/:cityId`)를 쓰기
 * 때문에 Vue Router가 컴포넌트 인스턴스를 "새로 만들지 않고 재사용"한다. 그런데
 * 데이터 로딩을 onMounted 안에만 넣어뒀으니, 이미 마운트된 상태에서는 파라미터가
 * 바뀌어도 다시 실행될 일이 없었다. 그래서 onMounted 대신 route.params.cityId를
 * `watch`로 감시하고, immediate:true로 최초 진입 시에도 한 번 실행되게 했다.
 */
const route = useRoute()
const cityDetail = ref(null)
const forecastList = ref([])
const configStore = useConfigStore()
const weatherStore = useWeatherStore()

const isLoading = ref(true)
const fetchError = ref(null)

async function loadCityDetail(cityId) {
  const baseCity = weatherStore.getCityById(cityId)

  // 도시가 바뀔 때마다 이전 도시의 잔상(예보 목록, 에러 배너)이 잠깐이라도 남지 않도록 초기화
  isLoading.value = true
  fetchError.value = null
  forecastList.value = []

  if (!baseCity) {
    cityDetail.value = null
    isLoading.value = false
    return
  }

  cityDetail.value = baseCity // 우선 (이전에 캐시된 값이 있다면 그 값으로) 화면을 채워 빈 화면 방지

  try {
    const [currentWeatherData, forecastData] = await Promise.all([
      fetchCurrentWeather(baseCity.lat, baseCity.lon),
      fetchForecast(baseCity.lat, baseCity.lon)
    ])
    const mergedCity = mapWeatherResponse(currentWeatherData, baseCity)
    cityDetail.value = mergedCity
    weatherStore.updateCity(mergedCity) // Dock/Home도 최신값을 보도록 스토어에 반영
    forecastList.value = mapForecastResponse(forecastData)
  } catch (error) {
    fetchError.value = '실시간 날씨 데이터를 불러오지 못해 임시 데이터로 표시합니다.'
    console.error('[Axios 에러] OpenWeatherMap 호출 실패:', error)
  } finally {
    isLoading.value = false
  }
}

watch(() => route.params.cityId, loadCityDetail, { immediate: true })

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
  max-width: 620px;
  margin: 0 auto;
}

.detail-card {
  background: var(--color-surface);
  border: var(--border-thick);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-hard);
  padding: 22px 24px;
}

.detail-card h2 {
  font-family: 'Fredoka', 'Pretendard', sans-serif;
  font-size: 18px;
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
  border: var(--border-thin);
  border-radius: var(--radius-sm);
  padding: 10px 14px;
}

.hero {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 6px 4px 20px;
  border-bottom: 3px dashed rgba(34, 34, 59, 0.2);
  margin-bottom: 18px;
}

.hero__icon {
  width: 76px;
  height: 76px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--color-sun-bg);
  border: var(--border-thick);
  box-shadow: var(--shadow-hard-sm);
  font-size: 34px;
  color: var(--color-sun);
}

.hero__region {
  margin: 0 0 4px;
  font-size: 12px;
  color: var(--color-muted);
}

.hero__temp {
  margin: 0;
  font-family: 'Fredoka', 'Pretendard', sans-serif;
  font-size: 36px;
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
  border: var(--border-thin);
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
  border: var(--border-thin);
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
  border: var(--border-thick);
  box-shadow: var(--shadow-hard-sm);
}
</style>
