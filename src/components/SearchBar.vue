<script setup>
defineProps({
  searchQuery: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update-query'])

function handleInput(event) {
  emit('update-query', event.target.value)
}
</script>

<template>
  <div class="search-bar">
    <input
      class="search-input"
      type="text"
      placeholder="검색할 도시 이름 입력"
      :value="searchQuery"
      @input="handleInput"
    />
    <p class="search-status">
      검색 중인 도시:
      <strong v-if="searchQuery">{{ searchQuery }}</strong>
      <span v-else class="search-status__placeholder">(입력 대기 중)</span>
    </p>
  </div>
</template>

<style scoped>
.search-input {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
}

.search-status {
  margin: 8px 0 0;
  font-size: 13px;
  color: #4b5563;
}

.search-status__placeholder {
  color: #9ca3af;
}
</style>
