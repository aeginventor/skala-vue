<script setup></script>

<template>
  <div class="not-found">
    <div class="not-found__icon"></div>
    <h2>페이지를 찾을 수 없습니다.</h2>
    <p>요청하신 주소가 존재하지 않거나, 아직 개발되지 않았습니다.</p>
    <RouterLink to="/" class="home-btn">날씨 메인으로 이동</RouterLink>
  </div>
</template>

<style scoped>
.not-found {
  max-width: 360px;
  margin: 60px auto 0;
  background: #fff;
  border-radius: 16px;
  padding: 40px 28px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.06);
}

.not-found__icon {
  font-size: 40px;
  margin-bottom: 16px;
}

h2 {
  font-size: 18px;
  margin: 0 0 8px;
}

p {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.6;
  margin: 0 0 20px;
}

.home-btn {
  display: inline-block;
  background: #2563eb;
  color: #fff;
  text-decoration: none;
  font-size: 14px;
  padding: 10px 20px;
  border-radius: 8px;
}
</style>
