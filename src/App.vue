<script setup>
import UnitToggler from './components/UnitToggler.vue'
import CityDock from './components/CityDock.vue'
</script>

<template>
  <div class="page">
    <header class="page-header">
      <div class="page-header__top">
        <h1>
          <span class="brand-badge"><i class="fa-solid fa-cloud-sun"></i></span>
          날씨 대시보드
        </h1>
        <UnitToggler />
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
