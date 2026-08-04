import { ref } from 'vue'
import { defineStore } from 'pinia'
import { weatherMockData } from '../data/weatherMockData.js'

/**
 * weatherStore
 * - 문제 상황: WeatherHomeView가 Axios로 받아온 "실시간" 날씨를 자기 컴포넌트
 *   안(local ref)에만 갖고 있어서, Dock(App.vue 하위, WeatherHomeView와는 형제 관계)은
 *   그 값을 전혀 몰랐다. 그래서 Dock 아이콘은 항상 Mock 데이터 기준으로만 그려졌고,
 *   실제 화면에 보이는 실시간 날씨와 어긋났다.
 * - 해결: 도시 목록(cities)을 Pinia 전역 스토어로 승격시켜서, Home/Detail/Dock
 *   어디서 갱신하든 나머지 모든 곳이 같은 최신 데이터를 보게 만들었다.
 */
export const useWeatherStore = defineStore('weather', () => {
  /** state: 전 지역 날씨 목록. 처음엔 Mock, Axios 성공 시 실시간 값으로 교체된다. */
  const cities = ref(weatherMockData)

  /** actions: Home 화면이 30개를 한 번에 갱신할 때 사용 */
  function setCities(newCities) {
    cities.value = newCities
  }

  /** actions: Detail 화면이 도시 1개만 갱신할 때 사용 (나머지 29개는 그대로 둠) */
  function updateCity(updatedCity) {
    cities.value = cities.value.map((city) => (city.id === updatedCity.id ? updatedCity : city))
  }

  /** getters 역할: id로 도시 하나를 찾는다 (Mock이든 실시간이든 항상 최신값) */
  function getCityById(cityId) {
    return cities.value.find((city) => city.id === cityId)
  }

  return { cities, setCities, updateCity, getCityById }
})
