<script setup>
import { useConfigStore } from '../stores/configStore.js'

const configStore = useConfigStore()

const unitLabel = () => (configStore.unit === 'celsius' ? '섭씨' : '화씨')
</script>

<template>
  <div class="unit-toggler">
    <span class="unit-toggler__label">
      날씨단위: {{ unitLabel() }}({{ configStore.unitSymbol }})
    </span>
    <button class="unit-toggler__btn" @click="configStore.toggleUnit">단위변경</button>
  </div>
</template>

<style scoped>
.unit-toggler {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #4b5563;
  white-space: nowrap;
}

.unit-toggler__btn {
  border: none;
  background: #1f2937;
  color: #fff;
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
}

.unit-toggler__btn:hover {
  background: #374151;
}
</style>
