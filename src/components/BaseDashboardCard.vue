<script setup>
/**
 * BaseDashboardCard — "흰색 둥근 카드" 껍데기. 카툰 스타일에 맞춰 두꺼운 잉크
 * 테두리 + 하드 섀도우를 기본값으로 준다. icon prop은 Font Awesome 클래스 문자열.
 */
defineProps({
  title: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <section class="card">
    <h2>
      <i v-if="icon" :class="icon"></i>
      {{ title }}
    </h2>
    <slot></slot>
  </section>
</template>

<style scoped>
.card {
  background: var(--color-surface);
  border: var(--border-thick);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-hard);
  padding: 20px 22px;
}

.card h2 {
  font-family: 'Fredoka', 'Pretendard', sans-serif;
  font-size: 17px;
  font-weight: 600;
  margin: 0 0 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-ink);
}

.card h2 i {
  color: var(--color-primary);
  font-size: 15px;
}
</style>
