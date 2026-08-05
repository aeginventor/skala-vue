import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'skala-weather-favorites'

/**
 * 즐겨찾기. 한 화면보다 오래 사는 사용자 데이터라 화면 컴포넌트가 아니라 스토어가 갖는다.
 *
 * 도시 객체가 아니라 **id만** 담는다. 객체를 통째로 담으면 기온이 갱신될 때 즐겨찾기 쪽에
 * 옛 값이 남아 카드와 따로 논다. id만 있으면 항상 weatherStore의 최신값을 참조하게 된다.
 */
export const useFavoriteStore = defineStore('favorite', () => {
  const cityIds = ref(loadFromStorage())

  const count = computed(() => cityIds.value.length)

  function isFavorite(cityId) {
    return cityIds.value.includes(cityId)
  }

  /** 불변 업데이트 — 배열을 갈아끼워야 watch가 감지한다 */
  function toggle(cityId) {
    cityIds.value = isFavorite(cityId)
      ? cityIds.value.filter((id) => id !== cityId)
      : [...cityIds.value, cityId]
  }

  watch(cityIds, (ids) => localStorage.setItem(STORAGE_KEY, JSON.stringify(ids)), { deep: true })

  return { cityIds, count, isFavorite, toggle }
})

/** 저장된 값이 깨져 있어도 앱이 죽지 않게 감싼다 */
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (error) {
    console.error('[localStorage 읽기 실패] 즐겨찾기를 불러오지 못했습니다:', error)
    return []
  }
}
