<script setup>
import BaseDashboardCard from '../components/BaseDashboardCard.vue'
</script>

<template>
  <div class="about">
    <BaseDashboardCard title="서비스 소개" icon="fa-solid fa-cloud-sun">
      <p class="lead">전국 30개 지역 날씨를 한 화면에서 훑어보는 대시보드입니다.</p>
      <p>매번 지역을 검색할 필요는 없어요.</p>
      <p>Dock에 늘어선 도시 아이콘만 봐도 오늘 날씨를 대충 짐작할 수 있으니까요.</p>
      <p>궁금한 지역은 클릭 한 번이면 됩니다.</p>
      <p>체감온도부터 12시간 뒤 예보까지, OpenWeatherMap 실시간 데이터로 바로 보여드려요.</p>
    </BaseDashboardCard>

    <BaseDashboardCard title="이렇게 써보세요" icon="fa-solid fa-shoe-prints">
      <ol class="steps">
        <li>
          <span class="steps__num">1</span>
          <span class="steps__text">Dock에서 지역을 찾아요. 아이콘 색만 봐도 대충 감이 옵니다.</span>
        </li>
        <li>
          <span class="steps__num">2</span>
          <span class="steps__text">카드를 클릭해요. 화면 하단에 요약이 바로 뜹니다.</span>
        </li>
        <li>
          <span class="steps__num">3</span>
          <span class="steps__text">"상세보기"를 눌러요. 예보와 날씨 애니메이션까지 볼 수 있어요.</span>
        </li>
      </ol>
    </BaseDashboardCard>

    <BaseDashboardCard title="주요 기능" icon="fa-solid fa-list-check">
      <ul class="features">
        <li>
          <strong><i class="fa-solid fa-grip-lines-vertical"></i> 상단 Dock</strong>
          <p>30개 지역 아이콘이 실시간 날씨를 그대로 보여줍니다.</p>
          <p class="features__detail">마우스로 끌거나 밀어서 스크롤 — "전체" 버튼은 항상 제자리에 있어요.</p>
        </li>
        <li>
          <strong><i class="fa-solid fa-star"></i> 즐겨찾기 · 정렬</strong>
          <p>별표로 즐겨찾기하면 목록 맨 위에 고정됩니다.</p>
          <p class="features__detail">이름순 · 기온순 · 날씨별 정렬도 가능하고, 새로고침해도 유지돼요.</p>
        </li>
        <li>
          <strong><i class="fa-solid fa-eye"></i> 카드 미리보기</strong>
          <p>카드를 클릭하면 화면 하단에 요약이 바로 뜹니다.</p>
          <p class="features__detail">전체 정보로 넘어가려면 "상세보기"를 눌러주세요.</p>
        </li>
        <li>
          <strong><i class="fa-solid fa-chart-simple"></i> 상세 정보</strong>
          <p>체감온도 · 습도 · 기압 · 풍속 · 일출 · 일몰, 12시간 예보까지.</p>
          <p class="features__detail">날씨 상태에 맞는 애니메이션도 함께 나와요.</p>
        </li>
        <li>
          <strong><i class="fa-solid fa-arrows-rotate"></i> 섭씨 / 화씨</strong>
          <p>버튼 하나로 화면 전체 온도 단위를 바꿉니다.</p>
        </li>
      </ul>
    </BaseDashboardCard>

    <RouterLink to="/" class="home-btn">
      <i class="fa-solid fa-house"></i> 대시보드 홈으로 이동
    </RouterLink>
  </div>
</template>

<style scoped>
.about {
  max-width: 620px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

p {
  font-size: 14px;
  color: var(--color-ink);
  line-height: 1.6;
  margin: 0 0 8px;
}

p:last-child {
  margin-bottom: 0;
}

.lead {
  font-family: 'Pretendard', sans-serif;
  font-size: 17px;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 10px;
}

/* 빠른 사용법: 번호 배지 + 한 줄 설명을 나란히 둬서 문단보다 눈에 빨리 들어오게 */
.steps {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.steps li {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.steps__num {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--color-primary);
  color: #fff;
  border: var(--border-thin);
  font-family: 'Pretendard', sans-serif;
  font-size: 13px;
  font-weight: 800;
}

.steps__text {
  font-size: 13px;
  color: var(--color-ink);
  line-height: 1.6;
  padding-top: 4px;
}

.features {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.features > li {
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border);
}

.features > li:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.features strong {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 14px;
  font-weight: 700;
  color: var(--color-ink);
  margin-bottom: 6px;
}

.features strong i {
  color: var(--color-primary);
  font-size: 13px;
  width: 16px;
  text-align: center;
}

.features p {
  font-size: 13px;
  margin-bottom: 4px;
}

.features__detail {
  color: var(--color-muted);
  font-size: 12px;
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
