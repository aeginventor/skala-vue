<script setup>
import { useConfigStore } from '../stores/configStore.js'

/**
 * DataSourceToggler — 실시간 API와 예시 데이터를 오가는 스위치.
 *
 * 눈·뇌우·안개처럼 계절을 타는 날씨는 실제 API로는 확인할 방법이 없다(8월에 눈이 올 리 없다).
 * 예시 데이터에는 구현해 둔 표현이 전부 한 번씩 들어 있어서, 이 스위치를 켜면 날씨 그림
 * 6종·구름 개수 3단계·온도 5단계를 한 화면에서 모두 확인할 수 있다.
 *
 * UnitToggler와 같은 모양으로 맞춘 이유: 헤더에 나란히 놓이는 같은 성격의 스위치라
 * 서로 다르게 생기면 오히려 눈에 걸린다.
 */
const configStore = useConfigStore()
</script>

<template>
  <div class="source-toggler">
    <span class="source-toggler__label">{{ configStore.useMockData ? '예시' : '실시간' }}</span>
    <button
      type="button"
      class="source-toggler__btn ink-pressable"
      :class="{ 'source-toggler__btn--mock': configStore.useMockData }"
      :aria-pressed="configStore.useMockData"
      :title="configStore.useMockData ? '실시간 날씨로 돌아가기' : '예시 데이터로 모든 날씨 보기'"
      @click="configStore.toggleMockData"
    >
      <i :class="configStore.useMockData ? 'fa-solid fa-flask' : 'fa-solid fa-satellite-dish'"></i>
    </button>
  </div>
</template>

<style scoped>
.source-toggler {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-muted);
  white-space: nowrap;
}

.source-toggler__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: var(--border-thick);
  border-radius: 50%;
  background: var(--color-surface);
  color: var(--color-ink);
  box-shadow: var(--shadow-hard-sm);
  font-size: 13px;
}

/* 예시 모드일 때만 색이 들어와서, 스위치만 봐도 지금 어느 쪽인지 알 수 있다 */
.source-toggler__btn--mock {
  background: var(--color-warning);
  color: #fff;
}
</style>
