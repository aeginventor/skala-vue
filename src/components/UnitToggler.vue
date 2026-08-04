<script setup>
import { useConfigStore } from '../stores/configStore.js'

const configStore = useConfigStore()

const unitLabel = () => (configStore.unit === 'celsius' ? '섭씨' : '화씨')
</script>

<template>
  <div class="unit-toggler">
    <span class="unit-toggler__label">
      {{ unitLabel() }}({{ configStore.unitSymbol }})
    </span>
    <button class="unit-toggler__btn ink-pressable" @click="configStore.toggleUnit">
      <i class="fa-solid fa-arrows-rotate"></i>
    </button>
  </div>
</template>

<style scoped>
.unit-toggler {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-muted);
  white-space: nowrap;
}

.unit-toggler__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: var(--border-thick);
  border-radius: 50%;
  background: var(--color-primary);
  color: #fff;
  box-shadow: var(--shadow-hard-sm);
  font-size: 14px;
  cursor: pointer;
}
</style>
