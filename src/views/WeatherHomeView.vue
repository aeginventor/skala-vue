<script setup>
import { ref, computed, watch, watchEffect, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import SearchBar from '../components/exercise/SearchBar.vue'
import WeatherCard from '../components/exercise/WeatherCard.vue'
import { getSubjectParticle } from '../utils/josa.js'
import { weatherMockData } from '../data/weatherMockData.js'
import { fetchCurrentWeather, mapWeatherResponse } from '../api/weatherApi.js'

const router = useRouter()

const weatherList = ref(weatherMockData)
const searchQuery = ref('')
const selectedCityInfo = ref(null)

const isLoading = ref(true)
const fetchError = ref(null)

const filteredWeatherList = computed(() => {
  const keyword = searchQuery.value.trim()
  if (!keyword) return weatherList.value
  return weatherList.value.filter((city) => city.name.includes(keyword))
})

const statusMessage = computed(() => {
  if (!selectedCityInfo.value) return '카드를 클릭하거나 검색해 보세요.'
  const { name } = selectedCityInfo.value
  return `${name}${getSubjectParticle(name)} 선택되었습니다.`
})

watch(selectedCityInfo, (newCity) => {
  console.log(`[watch 감지] 상태 바 문구가 업데이트되었습니다 -> "${statusMessage.value}"`, newCity)
})

watchEffect(() => {
  console.log(
    `[watchEffect 자동 호출] 현재 검색어 '${searchQuery.value}'에 매칭되는 도시를 필터링합니다.`,
  )
})

onMounted(async () => {
  try {
    const liveWeatherList = await Promise.all(
      weatherMockData.map(async (city) => {
        const apiData = await fetchCurrentWeather(city.apiQuery)
        return mapWeatherResponse(apiData, city)
      }),
    )
    weatherList.value = liveWeatherList
  } catch (error) {
    fetchError.value = '실시간 날씨 데이터를 불러오지 못해 임시 데이터로 표시합니다.'
    console.error('[Axios 에러] OpenWeatherMap 호출 실패:', error)
  } finally {
    isLoading.value = false
  }
})

function handleUpdateQuery(newQuery) {
  searchQuery.value = newQuery
}

function handleSelectCard(city) {
  selectedCityInfo.value = city
}
function handleClickDetail(city) {
  router.push(`/weather/${city.id}`)
}
</script>

<template>
  <div class="dashboard">
    <BaseDashboardCard title="도시 검색" icon="🔍">
      <SearchBar :search-query="searchQuery" @update-query="handleUpdateQuery" />
    </BaseDashboardCard>

    <p v-if="fetchError" class="fetch-error">⚠️ {{ fetchError }}</p>

    <BaseDashboardCard title="지역별 날씨 현황" icon="📍">
      <!-- [로딩 처리] API 응답을 기다리는 동안 목록 대신 안내 문구 -->
      <p v-if="isLoading" class="loading-message">날씨 정보를 불러오는 중입니다...</p>
      <p v-else-if="filteredWeatherList.length === 0" class="empty-message">
        검색어와 일치하는 도시가 없습니다.
      </p>
      <ul v-else class="weather-list">
        <WeatherCard
          v-for="city in filteredWeatherList"
          :key="city.id"
          :city="city"
          :is-selected="selectedCityInfo?.id === city.id"
          @select-card="handleSelectCard"
          @click-detail="handleClickDetail"
        />
      </ul>
    </BaseDashboardCard>

    <footer class="status-bar">{{ statusMessage }}</footer>
  </div>
</template>

<style scoped>
.dashboard {
  max-width: 520px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.weather-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.empty-message,
.loading-message {
  margin: 0;
  font-size: 13px;
  color: #9ca3af;
  text-align: center;
  padding: 12px 0;
}

.fetch-error {
  margin: 0;
  font-size: 13px;
  color: #b45309;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 8px;
  padding: 10px 14px;
}

.status-bar {
  text-align: center;
  padding: 12px;
  border-radius: 10px;
  background: #dcfce7;
  color: #166534;
  font-size: 13px;
}
</style>
