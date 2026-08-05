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
import { buildMockForecast } from '../data/weatherMockData.js'
import WeatherGlyph from '../components/WeatherGlyph.vue'
import { formatLocalTime } from '../utils/formatTime.js'
import WeatherAnimation from '../components/WeatherAnimation.vue'

/**
 * WeatherDetailView
 * - 라우트 경로: /weather/:cityId
 *
 * 도시 A 상세를 보다가 Dock에서 도시 B를 클릭하면 URL은 바뀌지만, 두 경로가
 * 같은 라우트 레코드(`/weather/:cityId`)를 쓰기 때문에 Vue Router는 컴포넌트
 * 인스턴스를 새로 만들지 않고 재사용한다. 데이터 로딩을 onMounted에만 두면 이미
 * 마운트된 상태에서 파라미터만 바뀌었을 때 다시 실행되지 않으므로, onMounted 대신
 * route.params.cityId를 `watch`로 감시하고 immediate:true로 최초 진입도 함께 처리한다.
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

  // 예시 모드면 API를 부르지 않는다. 스토어에 이미 예시 값이 들어와 있으므로 예보만 지어낸다.
  if (configStore.useMockData) {
    forecastList.value = buildMockForecast(baseCity)
    isLoading.value = false
    return
  }

  const { lat, lon } = baseCity

  try {
    const [currentWeatherData, forecastData] = await Promise.all([
      fetchCurrentWeather(lat, lon),
      fetchForecast(lat, lon)
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

/**
 * 예시↔실시간 토글은 헤더에 있어 이 화면에서도 눌린다. 스토어 쪽 목록은 App이 다시
 * 채우지만, 이 화면이 들고 있는 상세·예보는 그대로 남으므로 여기서도 다시 불러온다.
 */
watch(
  () => configStore.useMockData,
  () => loadCityDetail(route.params.cityId)
)

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
    <!--
      로딩 중엔 빈 화면 대신, 실제로 채워질 hero/stat-grid와 같은 배치의 회색 뼈대를
      보여준다. 레이아웃 클래스(.hero, .stat-grid, .stat-tile)는 실제 콘텐츠와
      그대로 공유해서, 로딩이 끝나고 실제 값으로 바뀔 때 자리가 안 튄다.
    -->
    <div v-show="isLoading" class="detail-card" aria-busy="true" aria-label="날씨 정보를 불러오는 중입니다">
      <div class="skeleton skeleton--text detail-skeleton__title"></div>
      <div class="hero hand-rule-bottom">
        <div class="skeleton skeleton--circle detail-skeleton__hero-icon"></div>
        <div class="detail-skeleton__hero-text">
          <div class="skeleton skeleton--text detail-skeleton__line" style="width: 45%"></div>
          <div class="skeleton detail-skeleton__temp-line"></div>
          <div class="skeleton skeleton--text detail-skeleton__line" style="width: 30%"></div>
        </div>
      </div>
      <dl class="stat-grid">
        <div v-for="n in 8" :key="n" class="stat-tile">
          <dt><div class="skeleton skeleton--text detail-skeleton__line" style="width: 55%"></div></dt>
          <dd><div class="skeleton skeleton--text detail-skeleton__line" style="width: 70%; height: 15px"></div></dd>
        </div>
      </dl>
    </div>

    <div v-if="!isLoading && cityDetail" class="detail-card">
      <h2><i class="fa-solid fa-chart-simple"></i> 지역별 상세 기상 관측 정보</h2>
      <p v-if="fetchError" class="fetch-error">
        <i class="fa-solid fa-triangle-exclamation"></i> {{ fetchError }}
      </p>

      <!--
        날씨 애니메이션은 별도 배너로 따로 두지 않고 hero 왼쪽 아이콘 자리(hero__icon)를
        넓혀서 그 안에 바로 그린다. 배너로 분리하면 바로 아래 원형 아이콘과 같은
        정보를 두 번 보여주면서 시각적으로도 겹쳐 보인다.
      -->
      <div class="hero hand-rule-bottom">
        <div class="hero__icon">
          <WeatherAnimation :status="cityDetail.status" :clouds="cityDetail.cloudsPercent" />
        </div>
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
            <WeatherGlyph :status="slot.status" class="forecast-slot__icon" />
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
  font-family: 'Pretendard', sans-serif;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0 0 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-ink);
}

.detail-card h2 i {
  color: var(--color-primary);
}

/* 홈 화면 배너와 같은 방식 — 옅은 면 대신 종이 + 왼쪽 색 띠 */
.fetch-error {
  margin: 0 0 12px;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-ink);
  background: var(--color-surface);
  border: var(--border-thin);
  border-left: 7px solid var(--color-warning);
  border-radius: var(--radius-sm);
  padding: 10px 14px;
}

.fetch-error i {
  color: var(--color-warning);
}

.hero {
  position: relative;
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 6px 4px 20px;
  margin-bottom: 18px;
}

/*
 * 112px 원형 안에 WeatherAnimation을 꽉 채워 그린다. overflow: hidden으로
 * 원형 밖으로 삐져나가는 빗방울/눈송이 등을 자연스럽게 잘라낸다.
 */
.hero__icon {
  width: 112px;
  height: 112px;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 50%;
  background: var(--color-sun-bg);
  border: var(--border-thick);
  box-shadow: var(--shadow-hard-sm);
}

/* 로딩 중 hero__icon 자리를 대신 채우는 스켈레톤. 크기/테두리는 실제 아이콘과 동일하게 맞춘다. */
.detail-skeleton__hero-icon {
  width: 112px;
  height: 112px;
  flex-shrink: 0;
  border-radius: 50%;
  border: var(--border-thick);
}

.detail-skeleton__title {
  width: 55%;
  height: 18px;
  margin-bottom: 16px;
}

.detail-skeleton__hero-text {
  flex: 1;
}

.detail-skeleton__line {
  margin-bottom: 10px;
}

.detail-skeleton__temp-line {
  width: 35%;
  height: 36px;
  border-radius: var(--radius-sm);
  margin-bottom: 10px;
}

.hero__region {
  margin: 0 0 4px;
  font-size: 12px;
  color: var(--color-muted);
}

.hero__temp {
  margin: 0;
  font-family: 'Pretendard', sans-serif;
  font-size: 36px;
  font-weight: 800;
  letter-spacing: -0.02em;
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
  font-size: 26px;
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
