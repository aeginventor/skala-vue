<script setup>
/**
 * BaseDashboardCard — "흰색 둥근 카드" 껍데기. icon prop은 이제 이모지 문자열이 아니라
 * Font Awesome 클래스 문자열(예: "fa-solid fa-magnifying-glass")을 받는다.
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
  border-radius: var(--radius-lg);
  padding: 20px 22px;
  box-shadow: var(--shadow-card);
}

.card h2 {
  font-family: 'Space Grotesk', 'Pretendard', sans-serif;
  font-size: 16px;
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
