<script setup>
import { ref, computed, watch, watchEffect } from 'vue'
import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'

const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  { id: 'city_04', name: '제주', temp: 22, status: '맑음' },
  { id: 'city_05', name: '대전', temp: 25, status: '흐림' },
  { id: 'city_06', name: '광주', temp: 27, status: '맑음' },
  { id: 'city_07', name: '대구', temp: 23, status: '비' },
  { id: 'city_08', name: '울산', temp: 29, status: '맑음' },
  { id: 'city_09', name: '인천', temp: 21, status: '흐림' },
  { id: 'city_10', name: '강릉', temp: 30, status: '맑음' },
  { id: 'city_11', name: '속초', temp: 20, status: '비' },
  { id: 'city_12', name: '춘천', temp: 24, status: '맑음' },
  { id: 'city_13', name: '전주', temp: 26, status: '흐림' },
  { id: 'city_14', name: '청주', temp: 28, status: '맑음' },
  { id: 'city_15', name: '포항', temp: 22, status: '비' },
  { id: 'city_16', name: '여수', temp: 27, status: '맑음' },
  { id: 'city_17', name: '목포', temp: 23, status: '흐림' },
  { id: 'city_18', name: '군산', temp: 25, status: '맑음' },
  { id: 'city_19', name: '속초', temp: 29, status: '맑음' },
  { id: 'city_20', name: '강릉', temp: 21, status: '비' },
])
const searchQuery = ref('')
const selectedCityInfo = ref(null)

const filteredWeatherList = computed(() => {
  const keyword = searchQuery.value.trim()
  if (!keyword) return weatherList.value
  return weatherList.value.filter((city) => city.name.includes(keyword))
})

const statusMessage = computed(() => {
  return selectedCityInfo.value
    ? `${selectedCityInfo.value.name}이 선택되었습니다.`
    : '카드를 클릭하거나 검색해 보세요.'
})

watch(selectedCityInfo, (newCity) => {
  console.log(`[watch 감지] 상태 바 문구가 업데이트되었습니다 -> "${statusMessage.value}"`, newCity)
})

watchEffect(() => {
  console.log(
    `[watchEffect 자동 호출] 현재 검색어 '${searchQuery.value}'에 매칭되는 도시를 필터링합니다.`,
  )
})

function handleUpdateQuery(newQuery) {
  searchQuery.value = newQuery
}

function handleSelectCard(city) {
  selectedCityInfo.value = city
}

function handleClickDetail(city) {
  window.alert(
    `${city.name}의 현재 온도는 ${city.temp}°C이고, 현재 날씨는 [${city.status}] 상태입니다.`,
  )
}
</script>

<template>
  <div class="page">
    <header class="page-header">
      <span class="page-header__badge"></span>
      <h1>🌤️ 과제 2: 날씨 (컴포지션)</h1>
    </header>

    <main class="dashboard">
      <BaseDashboardCard title="도시 검색">
        <SearchBar :search-query="searchQuery" @update-query="handleUpdateQuery" />
      </BaseDashboardCard>

      <BaseDashboardCard title="지역별 날씨 현황">
        <p v-if="filteredWeatherList.length === 0" class="empty-message">
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
    </main>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: #eef2f9;
  padding: 32px 16px;
  font-family: 'Pretendard', 'Apple SD Gothic Neo', sans-serif;
  color: #1f2937;
}

.page-header {
  max-width: 520px;
  margin: 0 auto 20px;
}

.page-header__badge {
  font-size: 12px;
  color: #6b7280;
}

.page-header h1 {
  font-size: 22px;
  margin: 4px 0 0;
}

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

.empty-message {
  margin: 0;
  font-size: 13px;
  color: #9ca3af;
  text-align: center;
  padding: 12px 0;
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
