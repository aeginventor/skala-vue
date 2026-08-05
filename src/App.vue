<script setup>
import { useRoute } from 'vue-router'
import UnitToggler from './components/UnitToggler.vue'
import CityDock from './components/CityDock.vue'

const route = useRoute()
</script>

<template>
  <div class="page">
    <header class="page-header">
      <div class="page-header__top">
        <h1>
          <span class="brand-badge"><i class="fa-solid fa-cloud-sun"></i></span>
          날씨 Dock
          <RouterLink
            to="/about"
            class="about-btn ink-pressable"
            :class="{ 'about-btn--active': route.name === 'weather-about' }"
          >
            <i class="fa-solid fa-circle-info"></i> 소개
          </RouterLink>
        </h1>
        <div class="page-header__actions">
          <UnitToggler />
        </div>
      </div>
      <CityDock />
    </header>

    <main class="page-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: var(--color-bg);
  padding: 32px 16px 60px;
  font-family: 'Pretendard', 'Apple SD Gothic Neo', sans-serif;
  color: var(--color-ink);
}

.page-header {
  max-width: 720px;
  margin: 0 auto 32px;
}

.page-header__top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.page-header h1 {
  font-family: 'Fredoka', 'Pretendard', sans-serif;
  font-size: 26px;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.page-header__actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.about-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 36px;
  padding: 0 16px;
  border: var(--border-thick);
  border-radius: 999px;
  background: var(--color-surface);
  color: var(--color-ink);
  box-shadow: var(--shadow-hard-sm);
  text-decoration: none;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
}

.about-btn--active {
  background: var(--color-primary);
  color: #fff;
}

.brand-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-sun-bg);
  border: var(--border-thick);
  box-shadow: var(--shadow-hard-sm);
  color: var(--color-sun);
  font-size: 18px;
  animation: bob 3.2s ease-in-out infinite;
}

@keyframes bob {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-4px) rotate(-6deg);
  }
}

.page-main {
  padding-top: 4px;
  max-width: 1080px;
  margin: 0 auto;
}
</style>
