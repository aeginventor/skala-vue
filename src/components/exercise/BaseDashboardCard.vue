<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <section class="card">
    <h2>
      <span v-if="icon" class="card__icon">{{ icon }}</span>
      {{ title }}
    </h2>
    <slot></slot>
  </section>
</template>

<style scoped>
.card {
  background: #fff;
  border-radius: 12px;
  padding: 18px 20px;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.06);
}

.card h2 {
  font-size: 15px;
  margin: 0 0 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.card__icon {
  font-size: 15px;
}
</style>
