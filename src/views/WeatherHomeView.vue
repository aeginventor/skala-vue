<script setup>
import { ref, computed, watch, watchEffect, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BaseDashboardCard from '../components/BaseDashboardCard.vue'
import SearchBar from '../components/SearchBar.vue'
import WeatherCard from '../components/WeatherCard.vue'
import { getSubjectParticle } from '../utils/josa.js'
import { fetchCurrentWeather, mapWeatherResponse } from '../api/weatherApi.js'
import { useConfigStore } from '../stores/configStore.js'
import { useWeatherStore } from '../stores/weatherStore.js'
import { getWeatherCategory, WEATHER_CATEGORY_ORDER } from '../utils/weatherIcon.js'

/**
 * WeatherHomeView
 * - 로직(반응형 상태 / computed / watch / watchEffect / Axios)은 이전 미션과 이어지고,
 *   여기서부터는 과제 요구사항 밖에서 "내가 직접 판단해서" 추가한 기능들이다.
 *   (즐겨찾기, 정렬, 통계 computed, localStorage 저장)
 * - 도시 목록 자체는 이제 weatherStore(Pinia)가 소유한다. Dock/Detail이 같은 데이터를
 *   보게 하기 위해서다 (자세한 이유는 stores/weatherStore.js 주석 참고).
 */
const router = useRouter()
const configStore = useConfigStore()
const weatherStore = useWeatherStore()

const searchQuery = ref('')
const selectedCityInfo = ref(null)

const isLoading = ref(true)
const fetchError = ref(null)

/**
 * [내가 추가한 반응형 변수 1] 즐겨찾기 도시 id 목록
 * - id 배열로만 관리하는 이유: 도시 객체 전체를 통째로 저장하면 온도 같은 값이 갱신될 때
 *   즐겨찾기 목록에 있는 "옛날 온도"와 실제 카드의 "최신 온도"가 따로 놀 위험이 있다.
 *   id만 들고 있으면 항상 weatherList 의 최신 데이터를 참조하게 되어 그런 불일치가 없다.
 */
const FAVORITES_STORAGE_KEY = 'skala-weather-favorites'

function loadFavoritesFromStorage() {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (error) {
    console.error('[localStorage 읽기 실패] 즐겨찾기 목록을 불러오지 못했습니다:', error)
    return []
  }
}

const favoriteCityIds = ref(loadFavoritesFromStorage())

/** [내가 추가한 반응형 변수 2] 정렬 기준 (이름순 / 기온순 / 날씨별) */
const sortOrder = ref('name')

const filteredWeatherList = computed(() => {
  const keyword = searchQuery.value.trim()
  if (!keyword) return weatherStore.cities
  return weatherStore.cities.filter((city) => city.name.includes(keyword))
})

/**
 * [내가 추가한 computed 1] 검색 필터링 결과를 정렬 기준에 맞게 다시 정렬.
 * - filteredWeatherList 를 그대로 바꾸지 않고 얕은 복사([...list])한 뒤 정렬한다.
 *   Array.prototype.sort() 는 원본 배열을 직접 변경(mutate)하는 함수라서,
 *   복사 없이 그냥 정렬하면 filteredWeatherList(원본 참조)까지 같이 뒤바뀌어 버린다.
 * - [피드백 반영] 즐겨찾기가 정렬에 전혀 반영되지 않아서, 즐겨찾기 도시를 항상 맨 앞으로
 *   오게 만들었다. 정렬 기준(이름/기온/날씨)은 "즐겨찾기 그룹"과 "나머지 그룹" 각각의
 *   내부 순서에만 적용된다.
 * - [버그 수정] '날씨별' 정렬을 status 문자열 그대로 비교하던 걸 getWeatherCategory()로
 *   뽑은 대분류(맑음/구름/비/눈/뇌우) 기준으로 바꿨다. "튼구름"과 "약간 흐림"처럼
 *   문자열은 달라도 같은 구름 계열이면 이제 확실히 묶인다. 같은 카테고리 안에서는
 *   이름순으로 2차 정렬해서 순서가 매번 들쭉날쭉하지 않게 했다.
 */
function compareBySortOrder(a, b) {
  if (sortOrder.value === 'temp') return b.temp - a.temp // 높은 기온 순
  if (sortOrder.value === 'weather') {
    const categoryDiff =
      WEATHER_CATEGORY_ORDER.indexOf(getWeatherCategory(a.status)) -
      WEATHER_CATEGORY_ORDER.indexOf(getWeatherCategory(b.status))
    return categoryDiff !== 0 ? categoryDiff : a.name.localeCompare(b.name, 'ko')
  }
  return a.name.localeCompare(b.name, 'ko') // 이름순
}

const sortedWeatherList = computed(() => {
  const favorites = []
  const others = []
  for (const city of filteredWeatherList.value) {
    if (favoriteCityIds.value.includes(city.id)) {
      favorites.push(city)
    } else {
      others.push(city)
    }
  }
  favorites.sort(compareBySortOrder)
  others.sort(compareBySortOrder)
  return [...favorites, ...others]
})

/** [내가 추가한 computed 2] 즐겨찾기 개수 */
const favoriteCount = computed(() => favoriteCityIds.value.length)

/** [내가 추가한 computed 3] 평균 기온 (섭씨 원본 기준으로 계산 후, 화면 표시 단위에 맞춰 변환) */
const averageTempCelsius = computed(() => {
  if (weatherStore.cities.length === 0) return 0
  const total = weatherStore.cities.reduce((sum, city) => sum + city.temp, 0)
  return Math.round(total / weatherStore.cities.length)
})
const averageDisplayTemp = computed(() => {
  if (configStore.unit === 'fahrenheit') {
    return Math.round((averageTempCelsius.value * 9) / 5 + 32)
  }
  return averageTempCelsius.value
})

/**
 * [내가 추가한 computed 4/5] 최고·최저 기온 도시.
 * reduce로 배열을 한 번만 훑어서 찾는다.
 */
const hottestCity = computed(() => {
  if (weatherStore.cities.length === 0) return null
  return weatherStore.cities.reduce((hottest, city) => (city.temp > hottest.temp ? city : hottest))
})
const coldestCity = computed(() => {
  if (weatherStore.cities.length === 0) return null
  return weatherStore.cities.reduce((coldest, city) => (city.temp < coldest.temp ? city : coldest))
})

/** 위 두 computed를 조합해서 자연스러운 한 문장으로 만든다. josa.js를 여기서도 재사용. */
const tagline = computed(() => {
  if (!hottestCity.value || !coldestCity.value) return ''
  const hot = hottestCity.value.name
  const cold = coldestCity.value.name
  if (hot === cold) return `오늘은 전 지역이 ${hot}${getSubjectParticle(hot)} 비슷한 날씨예요.`
  return `오늘은 ${hot}${getSubjectParticle(hot)} 가장 덥고, ${cold}${getSubjectParticle(cold)} 가장 선선해요.`
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
  console.log(`[watchEffect 자동 호출] 현재 검색어 '${searchQuery.value}'에 매칭되는 도시를 필터링합니다.`)
})

/** [내가 추가한 watch 1] 정렬 기준이 바뀔 때 콘솔 로그 */
watch(sortOrder, (newOrder) => {
  const labelMap = { temp: '기온순', weather: '날씨별', name: '이름순' }
  console.log(`[watch 감지] 정렬 기준이 '${labelMap[newOrder]}'으로 바뀌었습니다.`)
})

/**
 * [내가 추가한 watch 2] 즐겨찾기 목록이 바뀔 때마다 localStorage에 저장.
 * watchEffect 대신 watch를 고른 이유: "즐겨찾기 배열 자체"만 감시 대상으로 못 박고 싶어서다.
 */
watch(
  favoriteCityIds,
  (newFavorites) => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites))
    console.log('[watch 감지] 즐겨찾기 목록이 localStorage에 저장되었습니다:', newFavorites)
  },
  { deep: true }
)

/**
 * [3일차 요구사항] Axios 로 OpenWeatherMap 실제 데이터 교체 + 로딩·에러 처리
 * - 지역이 30개로 늘면서 Promise.all이 동시에 30번 호출한다. OpenWeatherMap 무료 플랜은
 *   분당 60회까지 허용되므로 페이지 새로고침 한 번 정도는 문제없지만, 짧은 시간에
 *   새로고침을 반복하면 429(Too Many Requests)가 날 수 있다는 점은 인지하고 있다.
 *   (지금 범위에서는 재시도/캐싱까지는 넣지 않았고, 실패 시 Mock 데이터로 안전하게 대체한다)
 */
onMounted(async () => {
  try {
    const liveWeatherList = await Promise.all(
      weatherStore.cities.map(async (city) => {
        const apiData = await fetchCurrentWeather(city.lat, city.lon)
        return mapWeatherResponse(apiData, city)
      })
    )
    weatherStore.setCities(liveWeatherList)
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

/**
 * [피드백 반영] 카드를 클릭하면 상세 페이지로 바로 이동하도록 바꿨다.
 * 다만 selectedCityInfo 는 여전히 갱신해서, watch(selectedCityInfo) 콘솔 로그와
 * 상태바 문구 로직은 그대로 유지된다 (페이지를 벗어나기 직전에 한 번 찍힌다).
 */
function handleSelectCard(city) {
  selectedCityInfo.value = city
  router.push(`/weather/${city.id}`)
}

function handleClickDetail(city) {
  router.push(`/weather/${city.id}`)
}

/** [내가 추가한 함수] 즐겨찾기 토글. id 배열만 갈아끼운다 (불변 업데이트) */
function toggleFavorite(city) {
  if (favoriteCityIds.value.includes(city.id)) {
    favoriteCityIds.value = favoriteCityIds.value.filter((id) => id !== city.id)
  } else {
    favoriteCityIds.value = [...favoriteCityIds.value, city.id]
  }
}
</script>

<template>
  <div class="dashboard">
    <BaseDashboardCard title="도시 검색" icon="fa-solid fa-magnifying-glass">
      <SearchBar :search-query="searchQuery" @update-query="handleUpdateQuery" />
    </BaseDashboardCard>

    <p v-if="!isLoading && tagline" class="tagline">
      <i class="fa-solid fa-lightbulb"></i> {{ tagline }}
    </p>

    <p v-if="fetchError" class="fetch-error">
      <i class="fa-solid fa-triangle-exclamation"></i> {{ fetchError }}
    </p>

    <BaseDashboardCard title="지역별 날씨 현황" icon="fa-solid fa-location-dot">
      <div class="toolbar">
        <div class="toolbar__stats">
          <span><i class="fa-solid fa-star"></i> 즐겨찾기 {{ favoriteCount }}개</span>
          <span>
            <i class="fa-solid fa-temperature-half"></i>
            평균 {{ averageDisplayTemp }}{{ configStore.unitSymbol }}
          </span>
        </div>
        <div class="toolbar__sort">
          <label for="sort-order">정렬</label>
          <select id="sort-order" v-model="sortOrder">
            <option value="name">이름순</option>
            <option value="temp">기온순</option>
            <option value="weather">날씨별</option>
          </select>
        </div>
      </div>

      <!-- v-show: 로딩 문구는 display:none 으로만 감춘다 (DOM에서 완전히 제거하는 v-if와 차이) -->
      <p v-show="isLoading" class="loading-message"><i class="fa-solid fa-spinner fa-spin"></i> 날씨 정보를 불러오는 중입니다...</p>

      <template v-if="!isLoading">
        <p v-if="sortedWeatherList.length === 0" class="empty-message">
          검색어와 일치하는 도시가 없습니다.
        </p>
        <ul v-else class="weather-list">
          <WeatherCard
            v-for="city in sortedWeatherList"
            :key="city.id"
            :city="city"
            :is-selected="selectedCityInfo?.id === city.id"
            :is-favorite="favoriteCityIds.includes(city.id)"
            @select-card="handleSelectCard"
            @click-detail="handleClickDetail"
            @toggle-favorite="toggleFavorite"
          />
        </ul>
      </template>
    </BaseDashboardCard>

    <footer class="status-bar">{{ statusMessage }}</footer>
  </div>
</template>

<style scoped>
.dashboard {
  max-width: 1080px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.weather-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-border);
}

.toolbar__stats {
  display: flex;
  gap: 14px;
  font-size: 12px;
  color: var(--color-muted);
}

.toolbar__stats .fa-star {
  color: var(--color-favorite);
}

.toolbar__stats .fa-temperature-half {
  color: var(--color-primary);
}

.toolbar__sort {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--color-muted);
}

.toolbar__sort select {
  border: var(--border-thin);
  border-radius: var(--radius-sm);
  padding: 5px 10px;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-ink);
  background: var(--color-surface);
}

.empty-message,
.loading-message {
  margin: 0;
  font-size: 13px;
  color: var(--color-muted);
  text-align: center;
  padding: 12px 0;
}

.tagline {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-ink);
  background: var(--color-primary-bg);
  border: var(--border-thin);
  border-radius: var(--radius-sm);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tagline i {
  color: var(--color-primary);
}

.fetch-error {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-warning);
  background: var(--color-warning-bg);
  border: var(--border-thin);
  border-radius: var(--radius-sm);
  padding: 10px 14px;
}

.status-bar {
  text-align: center;
  padding: 14px;
  border-radius: var(--radius-sm);
  border: var(--border-thin);
  background: var(--color-success-bg);
  color: var(--color-success);
  font-weight: 600;
  font-size: 13px;
}
</style>
