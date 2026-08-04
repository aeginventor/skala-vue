<script setup>
import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
</script>

<template>
  <div class="about">
    <BaseDashboardCard title="서비스 소개" icon="ℹ️">
      <p>본 앱은 Vue 3 및 Vue Router 4 기반으로 제작된 실습용 기상 관측 대시보드 시스템입니다.</p>
      <ul>
        <li><code>components/exercise/</code> 폴더 내부의 독립 부품 컴포넌트 연동</li>
        <li>클라이언트 사이드 라우팅을 통한 새로고침 없는 화면 전환</li>
        <li>동적 세그먼트(:cityId)를 활용한 도시별 상세 페이지 라우팅</li>
      </ul>
      <RouterLink to="/" class="home-btn">대시보드 홈으로 이동</RouterLink>
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
  color: #374151;
  line-height: 1.6;
  margin: 0 0 12px;
}

ul {
  margin: 0 0 20px;
  padding-left: 18px;
  font-size: 13px;
  color: #4b5563;
  line-height: 1.8;
}

code {
  background: #f1f5f9;
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 12px;
}

.home-btn {
  display: block;
  text-align: center;
  background: #2563eb;
  color: #fff;
  text-decoration: none;
  font-size: 14px;
  padding: 12px;
  border-radius: 8px;
}
</style>
