<script setup></script>

<template>
  <div class="not-found">
    <div class="not-found__icon">
      <i class="fa-solid fa-cloud"></i><i class="fa-solid fa-circle-question"></i>
    </div>
    <h2>페이지를 찾을 수 없습니다.</h2>
    <p>요청하신 주소가 존재하지 않거나, 아직 개발되지 않았습니다.</p>
    <RouterLink to="/" class="home-btn"><i class="fa-solid fa-house"></i> 날씨 메인으로 이동</RouterLink>
  </div>
</template>

<style scoped>
.not-found {
  max-width: 360px;
  margin: 60px auto 0;
  background: var(--color-surface);
  border: var(--border-thick);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-hard);
  padding: 40px 28px;
  text-align: center;
}

.not-found__icon {
  font-size: 34px;
  margin-bottom: 16px;
  color: var(--color-primary);
  display: flex;
  justify-content: center;
  gap: 10px;
}

h2 {
  font-family: 'Pretendard', sans-serif;
  font-size: 19px;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0 0 8px;
  color: var(--color-ink);
}

p {
  font-size: 13px;
  color: var(--color-muted);
  line-height: 1.6;
  margin: 0 0 20px;
}

.home-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--color-primary);
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  padding: 10px 20px;
  border-radius: var(--radius-sm);
  border: var(--border-thick);
  box-shadow: var(--shadow-hard-sm);
}
</style>
