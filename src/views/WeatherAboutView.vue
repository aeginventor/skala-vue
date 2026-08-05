<script setup>
import BaseDashboardCard from '../components/BaseDashboardCard.vue'
</script>

<template>
  <div class="about">
    <BaseDashboardCard title="서비스 소개" icon="fa-solid fa-cloud-sun">
      <p>
        전국 30개 지역의 날씨를 한 화면에서 훑어보는 대시보드입니다. 매번 지역을 검색해서
        들어가는 대신, 위쪽 Dock에 나열된 도시 아이콘만 봐도 오늘 날씨를 대충 짐작할 수
        있게 만들었습니다. 궁금한 지역은 클릭 한 번으로 체감온도부터 12시간 뒤 예보까지
        확인할 수 있고, 표시되는 값은 OpenWeatherMap 실시간 데이터를 그대로 가져옵니다.
      </p>
    </BaseDashboardCard>

    <BaseDashboardCard title="주요 기능" icon="fa-solid fa-list-check">
      <ul>
        <li>
          <strong><i class="fa-solid fa-grip-lines-vertical"></i> 상단 Dock</strong>
          서울부터 서귀포까지 30개 지역이 한 줄로 늘어서 있고, 아이콘이 그 지역의 실제
          날씨 상태를 그대로 보여줍니다. 마우스로 끌거나 옆으로 밀어서 스크롤할 수 있고,
          "전체" 버튼은 어디로 스크롤하든 항상 왼쪽에 남아있습니다.
        </li>
        <li>
          <strong><i class="fa-solid fa-star"></i> 즐겨찾기 · 정렬</strong>
          자주 보는 지역은 별표로 즐겨찾기 해두면 목록 맨 위에 고정됩니다. 이름순·기온순·
          날씨별로 정렬 기준도 바꿔볼 수 있고, 즐겨찾기는 새로고침해도 그대로 남아있습니다.
        </li>
        <li>
          <strong><i class="fa-solid fa-eye"></i> 카드 미리보기</strong>
          목록에서 카드를 클릭하면 화면 하단에 그 지역 요약이 바로 뜹니다. 거기서
          "상세보기"를 눌러야 전체 정보 페이지로 넘어갑니다.
        </li>
        <li>
          <strong><i class="fa-solid fa-chart-simple"></i> 상세 정보</strong>
          체감온도·습도·기압·풍속과 풍향·구름량·가시거리·일출·일몰, 그리고 앞으로
          12시간 예보까지 한 화면에서 확인할 수 있습니다. 날씨 상태에 맞는 애니메이션이
          함께 나옵니다.
        </li>
        <li>
          <strong><i class="fa-solid fa-arrows-rotate"></i> 섭씨 / 화씨</strong>
          오른쪽 위 버튼 하나로 화면에 보이는 모든 온도를 한 번에 바꿀 수 있습니다.
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
  line-height: 1.7;
  margin: 0;
}

ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

ul li {
  font-size: 13px;
  color: var(--color-ink);
  line-height: 1.7;
}

ul strong {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 14px;
  font-weight: 700;
  color: var(--color-ink);
  margin-bottom: 3px;
}

ul strong i {
  color: var(--color-primary);
  font-size: 13px;
  width: 16px;
  text-align: center;
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
