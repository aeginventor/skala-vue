<script setup>
import BaseDashboardCard from '../components/BaseDashboardCard.vue'
import WeatherGlyph from '../components/WeatherGlyph.vue'
import { TEMP_LEVEL_LEGEND } from '../utils/tempLevel.js'
import { getWeatherTheme } from '../utils/weatherIcon.js'

/**
 * 범례는 실제 화면에 쓰는 것과 **같은 컴포넌트·같은 표**로 그린다.
 * 설명용 그림을 따로 그리면 아이콘이나 색을 고칠 때 한쪽만 고쳐져 설명이 거짓말이 된다.
 * 여기서는 대표 날씨 문구를 넘겨주면 WeatherGlyph가 알아서 그 그림을 그린다.
 */
const WEATHER_LEGEND = [
  { status: '맑음', label: '맑음' },
  { status: '구름', label: '구름 · 흐림' },
  { status: '안개', label: '안개 · 황사' },
  { status: '비', label: '비 · 소나기' },
  { status: '눈', label: '눈' },
  { status: '뇌우', label: '뇌우' }
]
</script>

<template>
  <div class="about">
    <BaseDashboardCard title="서비스 소개" icon="fa-solid fa-cloud-sun">
      <p class="lead">전국 30개 지역 날씨를 한 화면에서 훑어보는 대시보드입니다.</p>
      <p>
        매번 지역을 검색할 필요는 없어요. 상단 Dock에 늘어선 도시 아이콘과 카드 색만 봐도
        오늘 날씨가 대충 짐작되고, 궁금한 지역은 클릭 한 번이면 됩니다.
      </p>
      <p>
        체감온도부터 12시간 뒤 예보까지 OpenWeatherMap 실시간 데이터로 보여드리고,
        기온은 추움부터 더움까지 다섯 단계로 나눠 색으로 구분합니다.
      </p>
    </BaseDashboardCard>

    <BaseDashboardCard title="이렇게 써보세요" icon="fa-solid fa-shoe-prints">
      <ol class="steps">
        <li>
          <span class="steps__num">1</span>
          <span class="steps__text">
            찾는 지역을 검색해요. 도시 이름은 물론 "경기"처럼 지역 단위로도 걸립니다.
          </span>
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

    <!--
      범례가 글보다 먼저 와야 아래 "주요 기능" 설명이 읽힌다. 아이콘 그림을 한 번도 안
      보여주고 "아이콘만 봐도 안다"고 쓰는 건 불친절하다.
    -->
    <BaseDashboardCard title="아이콘 읽는 법" icon="fa-solid fa-eye">
      <p>날씨는 그림으로, 기온은 색으로 구분합니다.</p>

      <ul class="legend">
        <li v-for="item in WEATHER_LEGEND" :key="item.status" class="legend__item">
          <span
            class="legend__glyph"
            :style="{
              '--legend-bg': getWeatherTheme(item.status).accent,
              '--legend-fg': getWeatherTheme(item.status).onAccent
            }"
          >
            <WeatherGlyph :status="item.status" />
          </span>
          <span class="legend__label">{{ item.label }}</span>
        </li>
      </ul>

      <p class="legend__note">구름은 구름 양이 많을수록 여러 개로, 대신 작게 그려집니다.</p>

      <ul class="temp-legend">
        <li
          v-for="level in TEMP_LEVEL_LEGEND"
          :key="level.id"
          class="temp-legend__item"
          :style="{ '--legend-bg': level.color, '--legend-fg': level.on }"
        >
          {{ level.label }}
        </li>
      </ul>
    </BaseDashboardCard>

    <BaseDashboardCard title="주요 기능" icon="fa-solid fa-list-check">
      <ul class="features">
        <li>
          <strong><i class="fa-solid fa-grip-lines-vertical"></i> 상단 Dock</strong>
          <p>30개 지역 아이콘이 실시간 날씨를 그대로 보여줍니다.</p>
          <p class="features__detail">마우스로 끌거나 밀어서 스크롤 — "전체"와 "랜덤"은 양 끝에 고정돼 있어요.</p>
        </li>
        <li>
          <strong><i class="fa-solid fa-temperature-half"></i> 전국 기온 훑어보기</strong>
          <p>검색창 아래 판이 6개씩 다섯 장으로 30개 지역을 돌아가며 보여줍니다.</p>
          <p class="features__detail">읽는 중에 넘어가지 않도록 마우스를 올리면 멈춰요.</p>
        </li>
        <li>
          <strong><i class="fa-solid fa-flask"></i> 예시 데이터 보기</strong>
          <p>헤더의 스위치를 켜면 실시간 대신 예시 데이터를 봅니다.</p>
          <p class="features__detail">눈·뇌우·안개처럼 지금 계절엔 볼 수 없는 날씨까지 한 번에 확인할 수 있어요.</p>
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
          <p class="features__detail">날씨에 맞는 애니메이션이 함께 나오고, 구름은 구름 양만큼 떠다녀요.</p>
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

/*
 * 날씨 그림 범례. 칸 수를 고정하지 않고 auto-fit으로 흘려서 좁은 화면에서도 줄만 늘어난다.
 * 아이콘 원은 카드에서 쓰는 것과 같은 규칙(진한 날씨색 + 밝기에 맞춘 글자색)을 따른다.
 */
.legend {
  list-style: none;
  margin: 12px 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(76px, 1fr));
  gap: 10px;
}

.legend__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-align: center;
}

.legend__glyph {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: var(--border-thin);
  background: var(--legend-bg);
  color: var(--legend-fg);
  font-size: 21px;
}

.legend__label {
  font-size: 11px;
  font-weight: 600;
  color: var(--color-muted);
  line-height: 1.4;
}

.legend__note {
  font-size: 12px;
  color: var(--color-muted);
  margin-bottom: 12px;
}

/* 기온 5단계 범례. 추움 -> 더움 순서라 그 자체가 색 눈금처럼 읽힌다. */
.temp-legend {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.temp-legend__item {
  flex: 1 1 60px;
  text-align: center;
  padding: 6px 4px;
  border: var(--border-thin);
  border-radius: var(--radius-sm);
  background: var(--legend-bg);
  color: var(--legend-fg);
  font-size: 12px;
  font-weight: 700;
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
  position: relative;
  padding-bottom: 18px;
}

/*
 * 항목 사이 구분선도 손그림 물결로 맞춘다. 항목마다 클래스를 붙이는 대신 여기서 한 번에
 * 거는 이유는 마지막 항목만 빼야 하기 때문이다. 물결 모양(--rule-wavy)은 main.css의
 * 것을 그대로 쓰므로 그림이 두 벌로 갈라지지 않는다.
 */
.features > li:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 6px;
  background-color: var(--color-ink);
  opacity: 0.3;
  -webkit-mask: var(--rule-wavy) repeat-x left center / 60px 6px;
  mask: var(--rule-wavy) repeat-x left center / 60px 6px;
}

.features > li:last-child {
  padding-bottom: 0;
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
