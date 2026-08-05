import { ref } from 'vue'
import { defineStore } from 'pinia'
import { weatherMockData } from '../data/weatherMockData.js'
import { fetchCurrentWeather, mapWeatherResponse } from '../api/weatherApi.js'

/**
 * weatherStore
 * - 문제 상황: WeatherHomeView가 Axios로 받아온 "실시간" 날씨를 자기 컴포넌트
 *   안(local ref)에만 갖고 있어서, Dock(App.vue 하위, WeatherHomeView와는 형제 관계)은
 *   그 값을 전혀 몰랐다. 그래서 Dock 아이콘은 항상 예시 데이터 기준으로만 그려졌고,
 *   실제 화면에 보이는 실시간 날씨와 어긋났다.
 * - 해결: 도시 목록(cities)을 Pinia 전역 스토어로 승격시켜서, Home/Detail/Dock
 *   어디서 갱신하든 나머지 모든 곳이 같은 최신 데이터를 보게 만들었다.
 * - 로딩 자체도 이 스토어가 맡는다. 예시↔실시간 토글은 헤더에 있어서 어느 화면에서든
 *   누를 수 있는데, 불러오는 일이 특정 화면(Home)에만 있으면 다른 화면에서 토글했을 때
 *   Dock과 목록이 옛 데이터를 그대로 들고 있게 된다.
 */
export const useWeatherStore = defineStore('weather', () => {
  /** state: 전 지역 날씨 목록. 처음엔 예시, 실시간 조회에 성공하면 그 값으로 교체된다. */
  const cities = ref(weatherMockData)

  const isLoading = ref(true)
  const loadError = ref(null)

  /**
   * 전 지역 날씨를 채운다. 예시 모드면 API를 아예 부르지 않는다.
   * 실시간 조회는 30개를 동시에 부른다. OpenWeatherMap 무료 플랜은 분당 60회라
   * 새로고침 한 번은 괜찮지만, 짧은 시간에 반복하면 429가 날 수 있다. 재시도·캐싱까지는
   * 넣지 않았고 실패 시 예시 데이터로 안전하게 대체한다.
   */
  async function loadCities(useMockData) {
    isLoading.value = true
    loadError.value = null

    if (useMockData) {
      cities.value = weatherMockData
      isLoading.value = false
      return
    }

    try {
      // 기준 도시 목록은 항상 예시 데이터다. 이름·좌표처럼 API가 주지 않는 값의 출처이기도 하다.
      cities.value = await Promise.all(
        weatherMockData.map(async (city) => {
          const apiData = await fetchCurrentWeather(city.lat, city.lon)
          return mapWeatherResponse(apiData, city)
        })
      )
    } catch (error) {
      loadError.value = '실시간 날씨 데이터를 불러오지 못해 예시 데이터로 표시합니다.'
      cities.value = weatherMockData
      console.error('[Axios 에러] OpenWeatherMap 호출 실패:', error)
    } finally {
      isLoading.value = false
    }
  }

  /** actions: Detail 화면이 도시 1개만 갱신할 때 사용 (나머지 29개는 그대로 둠) */
  function updateCity(updatedCity) {
    cities.value = cities.value.map((city) => (city.id === updatedCity.id ? updatedCity : city))
  }

  /** getters 역할: id로 도시 하나를 찾는다 (예시든 실시간이든 항상 최신값) */
  function getCityById(cityId) {
    return cities.value.find((city) => city.id === cityId)
  }

  return { cities, isLoading, loadError, loadCities, updateCity, getCityById }
})
