<script setup>
defineProps({
  searchQuery: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update-query'])

function handleInput({ target }) {
  emit('update-query', target.value)
}
</script>

<template>
  <div class="search-bar">
    <div class="search-input-wrap">
      <i class="fa-solid fa-magnifying-glass search-input-wrap__icon"></i>
      <input
        class="search-input"
        type="text"
        placeholder="도시 또는 지역 이름 입력 (예: 강릉, 경기...)"
        :value="searchQuery"
        @input="handleInput"
      />
    </div>
    <p class="search-status">
      검색 중인 도시:
      <strong v-if="searchQuery">{{ searchQuery }}</strong>
      <span v-else class="search-status__placeholder">(입력 대기 중)</span>
    </p>
  </div>
</template>

<style scoped>
.search-input-wrap {
  position: relative;
}

.search-input-wrap__icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-muted);
  font-size: 13px;
}

.search-input {
  width: 100%;
  box-sizing: border-box;
  padding: 12px 14px 12px 36px;
  border: var(--border-thin);
  border-radius: var(--radius-sm);
  font-size: 14px;
  color: var(--color-ink);
  background: var(--color-bg);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: var(--shadow-hard-sm);
}

.search-status {
  margin: 8px 0 0;
  font-size: 13px;
  color: var(--color-muted);
}

.search-status strong {
  color: var(--color-ink);
}

.search-status__placeholder {
  color: var(--color-muted);
}
</style>
