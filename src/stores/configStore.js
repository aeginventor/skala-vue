import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

const MOCK_MODE_STORAGE_KEY = 'skala-weather-use-mock'

/**
 * 예시 모드 설정을 localStorage에서 읽는다. 저장된 값이 깨져 있어도 앱이 죽지 않게
 * 즐겨찾기(WeatherHomeView)와 같은 방식으로 감싼다.
 */
function loadMockModeFromStorage() {
  try {
    return localStorage.getItem(MOCK_MODE_STORAGE_KEY) === 'true'
  } catch (error) {
    console.error('[localStorage 읽기 실패] 예시 모드 설정을 불러오지 못했습니다:', error)
    return false
  }
}

export const useConfigStore = defineStore('config', () => {
  const unit = ref('celsius')

  const unitSymbol = computed(() => (unit.value === 'fahrenheit' ? '°F' : '°C'))

  function toggleUnit() {
    unit.value = unit.value === 'celsius' ? 'fahrenheit' : 'celsius'
  }

  /**
   * 실시간 API 대신 예시 데이터를 쓸지 여부.
   * 눈·뇌우·안개처럼 계절을 타는 날씨는 실제 API로는 확인할 방법이 없어서, 구현해 둔
   * 표현을 전부 눈으로 확인할 수 있게 만든 전환 스위치다.
   * 새로고침해도 유지되게 저장한다 — 켜둔 걸 잊지 않도록 화면에는 안내 배너를 함께 띄운다.
   */
  const useMockData = ref(loadMockModeFromStorage())

  function toggleMockData() {
    useMockData.value = !useMockData.value
  }

  watch(useMockData, (enabled) => {
    localStorage.setItem(MOCK_MODE_STORAGE_KEY, String(enabled))
  })

  return { unit, unitSymbol, toggleUnit, useMockData, toggleMockData }
})
