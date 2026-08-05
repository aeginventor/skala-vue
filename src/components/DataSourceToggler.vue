<script setup>
import { useConfigStore } from '../stores/configStore.js'

/**
 * DataSourceToggler — 실시간 API와 예시 데이터를 오가는 스위치.
 * 눈·뇌우처럼 계절을 타는 날씨는 실제 API로 확인할 수 없어서, 켜면 구현해 둔 표현을
 * 한 화면에서 전부 볼 수 있다. 모양은 옆에 놓이는 UnitToggler와 맞췄다.
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
