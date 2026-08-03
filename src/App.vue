<script setup>
import { ref, computed, watch, watchEffect } from 'vue'

const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  { id: 'city_04', name: '제주', temp: 22, status: '맑음' },
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

function handleSearchInput(event) {
  searchQuery.value = event.target.value
}

function selectCard(city) {
  selectedCityInfo.value = city
}

function showDetail(city) {
  window.alert(`${city.name}의 현재 날씨는 [${city.status}] 상태입니다.`)
}

function isHot(temp) {
  return temp >= 25
}
</script>

<template>
  <div class="page">
    <header class="page-header">
      <span class="page-header__badge"></span>
      <h1>과제 2: 날씨 (컴포지션)</h1>
    </header>

    <main class="dashboard">
      <section class="card">
        <h2>도시 검색</h2>
        <input
          class="search-input"
          type="text"
          placeholder="검색할 도시 이름 입력"
          :value="searchQuery"
          @input="handleSearchInput"
        />
        <p class="search-status">
          검색 중인 도시:
          <strong v-if="searchQuery">{{ searchQuery }}</strong>
          <span v-else class="search-status__placeholder">(입력 대기 중)</span>
        </p>
      </section>

      <section class="card">
        <h2>지역별 날씨 현황</h2>

        <p v-if="filteredWeatherList.length === 0" class="empty-message">
          검색어와 일치하는 도시가 없습니다.
        </p>
        <ul v-else class="weather-list">
          <li
            v-for="city in filteredWeatherList"
            :key="city.id"
            class="weather-card"
            :class="{ 'weather-card--active': selectedCityInfo?.id === city.id }"
            @click="selectCard(city)"
          >
            <div class="weather-card__top">
              <div class="weather-card__title">
                {{ city.name }} ({{ city.status }})
                <p class="weather-card__temp">현재 기온: {{ city.temp }}°C</p>
              </div>
              <button class="detail-btn" @click.stop="showDetail(city)">상세보기</button>
            </div>

            <span v-if="isHot(city.temp)" class="badge badge--hot">🔥 더움 (25도 이상)</span>
            <span v-else class="badge badge--cool">❄️ 선선함 (25도 미만)</span>
          </li>
        </ul>
      </section>

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
.card {
  background: #fff;
  border-radius: 12px;
  padding: 18px 20px;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.06);
}
.card h2 {
  font-size: 15px;
  margin: 0 0 12px;
}
.search-input {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
}
.search-status {
  margin: 8px 0 0;
  font-size: 13px;
  color: #4b5563;
}
.search-status__placeholder {
  color: #9ca3af;
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
.weather-card {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 14px 16px;
  cursor: pointer;
  transition:
    border-color 0.15s,
    background-color 0.15s;
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
.status-bar {
  text-align: center;
  padding: 12px;
  border-radius: 10px;
  background: #dcfce7;
  color: #166534;
  font-size: 13px;
}
</style>
