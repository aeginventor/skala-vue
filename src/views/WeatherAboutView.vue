<script setup>
import BaseDashboardCard from '../components/BaseDashboardCard.vue'
</script>

<template>
  <div class="about">
    <BaseDashboardCard title="서비스 소개" icon="fa-solid fa-circle-info">
      <p>본 앱은 Vue 3 · Vue Router 4 · Pinia · Axios 기반으로 제작된 실습용 기상 관측 대시보드입니다.</p>
      <ul>
        <li>전국 30개 지역의 OpenWeatherMap 실시간 데이터 연동 (현재 날씨 + 예보 API)</li>
        <li>상단 Dock에서 지역을 바로 선택하고, 홈 화면은 전체 지역을 갤러리형 그리드로 한눈에</li>
        <li>즐겨찾기 · 정렬 기준 선택 등 요구사항 밖에서 추가한 개인 커스터마이징 기능</li>
      </ul>
      <RouterLink to="/" class="home-btn">
        <i class="fa-solid fa-house"></i> 대시보드 홈으로 이동
      </RouterLink>
    </BaseDashboardCard>
  </div>
</template>

<style scoped>
.about {
  max-width: 520px;
  margin: 0 auto;
}

p {
  font-size: 14px;
  color: var(--color-ink);
  line-height: 1.6;
  margin: 0 0 12px;
}

ul {
  margin: 0 0 20px;
  padding-left: 18px;
  font-size: 13px;
  color: var(--color-muted);
  line-height: 1.8;
}

.home-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  background: var(--color-primary);
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  padding: 12px;
  border-radius: var(--radius-sm);
  border: var(--border-thick);
  box-shadow: var(--shadow-hard-sm);
}
</style>
