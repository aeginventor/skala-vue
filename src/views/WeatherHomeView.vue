<script setup>
import { ref, computed, watch, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import BaseDashboardCard from '../components/BaseDashboardCard.vue'
import SearchBar from '../components/SearchBar.vue'
import TempBoard from '../components/TempBoard.vue'
import WeatherCard from '../components/WeatherCard.vue'
import SelectedCityPanel from '../components/SelectedCityPanel.vue'
import { getSubjectParticle } from '../utils/josa.js'
import { useConfigStore } from '../stores/configStore.js'
import { useWeatherStore } from '../stores/weatherStore.js'
import { useFavoriteStore } from '../stores/favoriteStore.js'
import { getWeatherCategory, WEATHER_CATEGORY_ORDER } from '../utils/weatherIcon.js'

/**
 * WeatherHomeView — 검색·정렬과 지역별 날씨 카드 목록을 보여주는 대시보드.
 * 도시 목록은 weatherStore가, 즐겨찾기는 favoriteStore가 갖는다. 이 화면은 그걸
 * 걸러서 정렬해 보여주는 일만 한다.
 */
const router = useRouter()
const configStore = useConfigStore()
const weatherStore = useWeatherStore()
const favoriteStore = useFavoriteStore()

const searchQuery = ref('')
const selectedCityInfo = ref(null)

/** 정렬 기준 (이름순 / 기온순 / 날씨별) */
const sortOrder = ref('name')

/**
 * 검색어는 도시 이름뿐 아니라 region(예: "경기도 수원시")에도 매칭한다.
 * "경기"처럼 광역 단위로 검색하면 그 지역에 속한 도시가 한 번에 다 걸린다.
 */
const filteredWeatherList = computed(() => {
  const keyword = searchQuery.value.trim()
  if (!keyword) return weatherStore.cities
  return weatherStore.cities.filter(
    (city) => city.name.includes(keyword) || city.region.includes(keyword)
  )
})

/**
 * 검색 필터링 결과를 정렬 기준에 맞게 다시 정렬한다.
 * - filteredWeatherList 를 그대로 바꾸지 않고 얕은 복사([...list])한 뒤 정렬한다.
 *   Array.prototype.sort() 는 원본 배열을 직접 변경(mutate)하는 함수라서,
 *   복사 없이 그냥 정렬하면 filteredWeatherList(원본 참조)까지 같이 뒤바뀌어 버린다.
 * - 즐겨찾기 도시는 정렬 기준과 무관하게 항상 맨 앞에 온다. 이름/기온/날씨 정렬
 *   기준은 "즐겨찾기 그룹"과 "나머지 그룹" 각각의 내부 순서에만 적용된다.
 * - '날씨별' 정렬은 status 문자열을 그대로 비교하지 않고 getWeatherCategory()로
 *   뽑은 대분류(맑음/구름/비/눈/뇌우) 기준으로 묶는다. "튼구름"과 "약간 흐림"처럼
 *   문자열은 달라도 같은 구름 계열이면 한데 묶이고, 같은 카테고리 안에서는
 *   이름순으로 2차 정렬해서 순서가 매번 들쭉날쭉하지 않게 한다.
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
    if (favoriteStore.isFavorite(city.id)) {
      favorites.push(city)
    } else {
      others.push(city)
    }
  }
  favorites.sort(compareBySortOrder)
  others.sort(compareBySortOrder)
  return [...favorites, ...others]
})

/** 즐겨찾기 개수 */
/** 검색어로 필터링된 결과 개수. 전체 개수 대비 몇 개가 걸렸는지 바로 보여준다. */
const filteredCount = computed(() => filteredWeatherList.value.length)

/** 평균 기온 (섭씨 원본 기준으로 계산 후, 화면 표시 단위에 맞춰 변환) */
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
 * 최고·최저 기온 도시. reduce로 배열을 한 번만 훑어서 찾는다.
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

/**
 * 이 문구는 더 이상 화면에 그대로 노출되지 않는다 — 선택한 도시는 이제
 * SelectedCityPanel이 아이콘·기온까지 함께 보여준다. 다만 "선택이 바뀔 때마다
 * 반응"하는 로직 자체는 여전히 유효해서, 아래 watch의 콘솔 로그용으로 남겨뒀다.
 */
const statusMessage = computed(() => {
  if (!selectedCityInfo.value) return '카드를 클릭하거나 검색해 보세요.'
  const { name } = selectedCityInfo.value
  return `${name}${getSubjectParticle(name)} 선택되었습니다.`
})

watch(selectedCityInfo, (newCity) => {
  console.log(`[watch 감지] 선택된 도시가 바뀌었습니다 -> "${statusMessage.value}"`, newCity)
})

watchEffect(() => {
  console.log(`[watchEffect 자동 호출] 현재 검색어 '${searchQuery.value}'에 매칭되는 도시를 필터링합니다.`)
})

/** 정렬 기준이 바뀔 때 콘솔 로그 */
watch(sortOrder, (newOrder) => {
  const labelMap = { temp: '기온순', weather: '날씨별', name: '이름순' }
  console.log(`[watch 감지] 정렬 기준이 '${labelMap[newOrder]}'으로 바뀌었습니다.`)
})

// 불러오기는 App.vue가 스토어를 통해 맡는다(Dock도 같은 데이터를 쓰고, 토글이 헤더에 있어서다).
// 이 화면은 그 결과만 받아 쓴다.
const isLoading = computed(() => weatherStore.isLoading)
const fetchError = computed(() => weatherStore.loadError)

function handleUpdateQuery(newQuery) {
  searchQuery.value = newQuery
}

/**
 * 카드 클릭은 상세 페이지 이동 없이 "선택"만 한다 — 클릭 즉시 화면이 바뀌면
 * 선택 정보가 떴다는 반응을 확인할 틈이 없기 때문이다. 상세 페이지로 가는 길은
 * 카드의 "상세보기" 버튼(handleClickDetail)으로만 남겨뒀다.
 */
function handleSelectCard(city) {
  selectedCityInfo.value = city
}

function handleClickDetail(city) {
  router.push(`/weather/${city.id}`)
}

</script>

<template>
  <div class="dashboard">
    <BaseDashboardCard title="도시 검색" icon="fa-solid fa-magnifying-glass">
      <SearchBar :search-query="searchQuery" @update-query="handleUpdateQuery" />
    </BaseDashboardCard>

    <TempBoard />

    <p v-if="!isLoading && tagline" class="tagline">
      <i class="fa-solid fa-lightbulb"></i> {{ tagline }}
    </p>

    <p v-if="fetchError" class="fetch-error">
      <i class="fa-solid fa-triangle-exclamation"></i> {{ fetchError }}
    </p>

    <!--
      예시 모드는 켜둔 걸 잊기 쉽다. 안내가 없으면 "날씨가 안 맞는다"고 오해하게 되므로
      켜져 있는 동안에는 계속 눈에 띄게 알려주고, 여기서 바로 끌 수 있게 한다.
    -->
    <p v-if="configStore.useMockData" class="mock-notice">
      <i class="fa-solid fa-flask"></i>
      예시 데이터를 보고 있어요. 실제 날씨가 아니라, 구현된 날씨 표현을 모두 담은 예시입니다.
      <button type="button" class="mock-notice__btn" @click="configStore.toggleMockData">
        실시간으로 돌아가기
      </button>
    </p>

    <BaseDashboardCard title="지역별 날씨 현황" icon="fa-solid fa-location-dot">
      <div class="toolbar hand-rule-bottom">
        <div class="toolbar__stats">
          <span><i class="fa-solid fa-list-ul"></i> 검색결과 {{ filteredCount }}개</span>
          <span><i class="fa-solid fa-star"></i> 즐겨찾기 {{ favoriteStore.count }}개</span>
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

      <!--
        v-show: 로딩 중엔 display:none 으로만 감춘다 (DOM에서 완전히 제거하는 v-if와 차이).
        빈 화면 대신 실제 카드와 같은 모양의 회색 뼈대(스켈레톤)를 깜빡여서
        "멈춘 것 같은" 느낌을 줄인다.
      -->
      <ul v-show="isLoading" class="weather-list" aria-busy="true" aria-label="날씨 정보를 불러오는 중입니다">
        <li v-for="n in 10" :key="n" class="tile-skeleton">
          <div class="skeleton skeleton--circle tile-skeleton__favorite"></div>
          <div class="skeleton skeleton--circle tile-skeleton__icon"></div>
          <div class="skeleton skeleton--text tile-skeleton__name"></div>
          <div class="skeleton skeleton--text tile-skeleton__region"></div>
          <div class="skeleton tile-skeleton__temp"></div>
          <div class="skeleton skeleton--text tile-skeleton__badge"></div>
        </li>
      </ul>

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
            :is-favorite="favoriteStore.isFavorite(city.id)"
            @select-card="handleSelectCard"
            @click-detail="handleClickDetail"
            @toggle-favorite="favoriteStore.toggle($event.id)"
          />
        </ul>
      </template>
    </BaseDashboardCard>

    <!--
      사이드 패널 대신 화면 하단에 둔다 — 카드 그리드 옆에 세로로 긴 패널을
      나란히 두면 디자인 밸런스가 깨진다. 페이지 맨 아래(normal flow)에 두면
      스크롤을 끝까지 내려야만 보이니, position: fixed로 뷰포트 바닥에 고정한다.
    -->
    <SelectedCityPanel :city="selectedCityInfo" @click-detail="handleClickDetail" />
  </div>
</template>

<style scoped>
.dashboard {
  max-width: 1080px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 18px;
  /* 하단에 고정되는 SelectedCityPanel한테 마지막 카드가 가리지 않도록 여유를 둔다 */
  padding-bottom: 110px;
}

.weather-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

/* WeatherCard(.tile)와 같은 크기/모양으로 맞춰서, 로딩이 끝나고 실제 카드로 바뀔 때 레이아웃이 안 튄다 */
.tile-skeleton {
  position: relative;
  list-style: none;
  background: var(--color-surface);
  border: var(--border-thick);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-hard);
  padding: 18px 16px 16px;
}

/* 기울기·모서리도 실제 카드와 같은 주기로 맞춰야 로딩이 끝나는 순간 카드가 움찔하지 않는다 */
.tile-skeleton:nth-child(3n + 1) {
  rotate: -0.6deg;
}

.tile-skeleton:nth-child(3n + 2) {
  rotate: 0.5deg;
  border-radius: var(--radius-lg-b);
}

.tile-skeleton:nth-child(3n + 3) {
  rotate: -0.25deg;
  border-radius: var(--radius-lg-c);
}

.tile-skeleton__favorite {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
}

.tile-skeleton__icon {
  width: 64px;
  height: 64px;
  margin-bottom: 10px;
}

.tile-skeleton__name {
  width: 60%;
  height: 19px;
  margin-bottom: 8px;
}

.tile-skeleton__region {
  width: 40%;
  margin-bottom: 14px;
}

.tile-skeleton__temp {
  width: 45%;
  height: 30px;
  border-radius: var(--radius-sm);
  margin-bottom: 12px;
}

.tile-skeleton__badge {
  width: 70px;
  height: 20px;
  border-radius: 999px;
}

.toolbar {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 12px;
  padding-bottom: 14px;
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

.empty-message {
  margin: 0;
  font-size: 13px;
  color: var(--color-muted);
  text-align: center;
  padding: 12px 0;
}

/*
 * 배너는 옅은 색으로 면을 칠하지 않는다. 종이 위에 잉크 테두리를 두르고 왼쪽에 굵은
 * 색 띠만 세우는, 인쇄물에서 쓰는 강조 방식이다. 파스텔 면이 사라지면서도 눈에는 더 띈다.
 */
.tagline {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-ink);
  background: var(--color-surface);
  border: var(--border-thin);
  border-left: 7px solid var(--color-primary);
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
  color: var(--color-ink);
  background: var(--color-surface);
  border: var(--border-thin);
  border-left: 7px solid var(--color-warning);
  border-radius: var(--radius-sm);
  padding: 10px 14px;
}

.fetch-error i,
.mock-notice i {
  color: var(--color-warning);
}

.mock-notice {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-ink);
  background: var(--color-surface);
  border: var(--border-thin);
  border-left: 7px solid var(--color-warning);
  border-radius: var(--radius-sm);
  padding: 10px 14px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.mock-notice__btn {
  margin-left: auto;
  border: var(--border-thin);
  border-radius: 999px;
  background: var(--color-surface);
  color: var(--color-ink);
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 700;
  font-family: inherit;
}

</style>
