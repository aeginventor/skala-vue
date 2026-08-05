<script setup>
import { computed } from 'vue'
import { getWeatherCategory } from '../utils/weatherIcon.js'
import { CLOUD, BOLT, BOLT_VIEWBOX } from '../utils/glyphPaths.js'

/**
 * WeatherAnimation
 * - 원래는 상세 페이지 상단에 별도의 가로 배너로 넣으려 했는데, 그렇게 하면
 *   그 아래 있는 hero 아이콘(원형 날씨 아이콘)과 같은 정보(날씨 상태)를 두 번
 *   보여주면서 세로 공간만 잡아먹고, 좁은 화면에서는 배너와 아이콘이 시각적으로
 *   겹쳐 보이는 문제가 있었다. 그래서 별도 배너를 없애고, 왼쪽 hero 아이콘 자리를
 *   더 넓혀서(76px -> 112px) 그 안에 이 애니메이션을 직접 그려 넣는 방식으로 바꿨다.
 *   아이콘 자리 하나가 "정적인 아이콘"에서 "그 자리에서 살아 움직이는 장면"으로
 *   바뀌는 셈이라 정보 중복도 없고 레이아웃도 겹치지 않는다.
 * - status 문자열(예: "튼구름")을 그대로 분기하면 API 표현이 바뀔 때마다 case를
 *   추가해야 하니, 이미 정렬/아이콘에도 쓰고 있는 getWeatherCategory()로 대분류
 *   (sun/cloud/rain/snow/storm) 하나만 받아서 그 카테고리에 맞는 장면을 그린다.
 * - 빗방울/눈송이는 각자 다른 위치(left%)·지연시간(delay)·속도(duration)를 가져야
 *   "우수수 떨어지는" 느낌이 나서, 렌더링 전에 미리 배열로 계산해 둔다.
 */
// Vue 3.5부터 props 구조분해가 정식 지원되어, 꺼내 써도 반응형이 유지된다.
const { status } = defineProps({
  status: {
    type: String,
    required: true
  }
})

const category = computed(() => getWeatherCategory(status))

const raindrops = Array.from({ length: 10 }, (_, i) => ({
  left: (i * 10.3) % 100,
  delay: (i % 5) * 0.16,
  duration: 0.7 + (i % 4) * 0.12
}))

const snowflakes = Array.from({ length: 8 }, (_, i) => ({
  left: (i * 12.6) % 100,
  delay: (i % 4) * 0.35,
  duration: 3.6 + (i % 4) * 0.5
}))
</script>

<template>
  <div class="scene" :class="`scene--${category}`">
    <!-- 맑음: 해가 천천히 커졌다 작아지며 쨍쨍 -->
    <template v-if="category === 'sun'">
      <div class="sun">
        <span v-for="n in 8" :key="n" class="sun__ray" :style="{ transform: `rotate(${n * 45}deg) translateY(-24px)` }"></span>
        <div class="sun__core"></div>
      </div>
    </template>

    <!-- 구름: 구름 두 덩이가 서로 다른 속도로 둥둥 지나감 -->
    <template v-else-if="category === 'cloud'">
      <svg class="cloud cloud--back" viewBox="0 0 48 48"><path :d="CLOUD" /></svg>
      <svg class="cloud cloud--front" viewBox="0 0 48 48"><path :d="CLOUD" /></svg>
    </template>

    <!-- 비: 구름 아래로 빗방울이 계속 떨어짐 -->
    <template v-else-if="category === 'rain'">
      <svg class="cloud cloud--rain" viewBox="0 0 48 48"><path :d="CLOUD" /></svg>
      <span
        v-for="(drop, i) in raindrops"
        :key="i"
        class="raindrop"
        :style="{ left: drop.left + '%', animationDelay: drop.delay + 's', animationDuration: drop.duration + 's' }"
      ></span>
    </template>

    <!-- 눈: 눈송이가 좌우로 살랑이며 천천히 떨어짐 -->
    <template v-else-if="category === 'snow'">
      <svg class="cloud cloud--snow" viewBox="0 0 48 48"><path :d="CLOUD" /></svg>
      <span
        v-for="(flake, i) in snowflakes"
        :key="i"
        class="snowflake"
        :style="{ left: flake.left + '%', animationDelay: flake.delay + 's', animationDuration: flake.duration + 's' }"
      ></span>
    </template>

    <!-- 뇌우: 먹구름 + 번쩍이는 번개 + 굵은 비 -->
    <template v-else-if="category === 'storm'">
      <svg class="cloud cloud--storm" viewBox="0 0 48 48"><path :d="CLOUD" /></svg>
      <svg class="bolt" :viewBox="BOLT_VIEWBOX"><path :d="BOLT" /></svg>
      <span
        v-for="(drop, i) in raindrops.slice(0, 7)"
        :key="i"
        class="raindrop raindrop--storm"
        :style="{ left: drop.left + '%', animationDelay: drop.delay + 's', animationDuration: (drop.duration * 0.8) + 's' }"
      ></span>
    </template>
  </div>
</template>

<style scoped>
/*
 * 부모(hero__icon)가 이미 원형 테두리 + 크기 + overflow:hidden을 잡아주므로,
 * 이 컴포넌트는 그 안을 100% 채우는 장면만 그린다.
 */
.scene {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/*
 * 장면 배경도 카드 아이콘 원과 같은 규칙을 따른다 — 옅게 물들이는 대신 날씨색을 진하게
 * 깐다. 흰 구름과 빗줄기가 그 위에서 훨씬 또렷하게 읽힌다. 위아래로 살짝 밝기 차만 줘서
 * 완전히 납작한 색 면은 피했다(하늘이 위쪽이 밝다는 감각).
 */
.scene--sun {
  background: linear-gradient(180deg, oklch(86% 0.17 90) 0%, var(--color-sun) 100%);
}

.scene--cloud {
  background: linear-gradient(180deg, oklch(70% 0.03 250) 0%, var(--color-cloud) 100%);
}

.scene--rain {
  background: linear-gradient(180deg, oklch(64% 0.17 250) 0%, var(--color-rain) 100%);
}

.scene--snow {
  background: linear-gradient(180deg, oklch(84% 0.1 200) 0%, var(--color-snow) 100%);
}

.scene--storm {
  background: linear-gradient(180deg, oklch(60% 0.18 300) 0%, var(--color-storm) 100%);
}

/* ---------- 맑음 ---------- */
.sun {
  position: relative;
  width: 10px;
  height: 10px;
}

.sun__core {
  position: absolute;
  inset: -18px;
  background: var(--color-sun);
  border: 3px solid var(--color-ink);
  border-radius: 50%;
  animation: sun-pulse 2.2s ease-in-out infinite;
}

.sun__ray {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 3px;
  height: 11px;
  margin: -5.5px 0 0 -1.5px;
  background: var(--color-ink);
  border-radius: 2px;
  transform-origin: center;
  animation-name: ray-pulse;
  animation-duration: 2.2s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

@keyframes sun-pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.12);
    opacity: 0.85;
  }
}

@keyframes ray-pulse {
  0%,
  100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

/* ---------- 구름 / 비 / 눈 / 뇌우 공통 ---------- */
/*
 * 카드/Dock 아이콘과 똑같은 구름 실루엣(glyphPaths.CLOUD)을 크게 그린 것.
 * 아이콘 폰트일 때는 색을 color + text-stroke로 줬지만, SVG라 fill/stroke로 준다.
 */
.cloud {
  position: absolute;
  width: 40px;
  height: 40px;
  fill: #fff;
  stroke: var(--color-ink);
  stroke-width: 2.6;
  stroke-linejoin: round;
}

.cloud--back {
  top: 18px;
  width: 30px;
  height: 30px;
  opacity: 0.7;
  animation: drift-back 10s linear infinite;
}

.cloud--front {
  top: 40px;
  animation: drift-front 6.5s linear infinite;
}

.cloud--rain,
.cloud--snow,
.cloud--storm {
  top: 14px;
  left: 50%;
  transform: translateX(-50%);
}

@keyframes drift-back {
  from {
    left: -30%;
  }
  to {
    left: 120%;
  }
}

@keyframes drift-front {
  from {
    left: -35%;
  }
  to {
    left: 125%;
  }
}

.raindrop {
  position: absolute;
  top: 38px;
  width: 2px;
  height: 12px;
  background: var(--color-rain);
  border-radius: 2px;
  transform: rotate(-12deg);
  animation-name: fall;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

.raindrop--storm {
  background: oklch(38% 0.15 305);
  height: 15px;
}

@keyframes fall {
  from {
    top: 38px;
    opacity: 0.9;
  }
  to {
    top: 106px;
    opacity: 0.1;
  }
}

/* 카드 아이콘의 눈 표현과 맞춰 동그란 눈송이로 그린다 */
.snowflake {
  position: absolute;
  top: 34px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--color-snow);
  animation-name: snow-fall, snow-sway;
  animation-timing-function: linear, ease-in-out;
  animation-iteration-count: infinite, infinite;
  animation-direction: normal, alternate;
}

@keyframes snow-fall {
  from {
    top: 30px;
  }
  to {
    top: 106px;
  }
}

@keyframes snow-sway {
  from {
    margin-left: -5px;
  }
  to {
    margin-left: 5px;
  }
}

.bolt {
  position: absolute;
  top: 48px;
  left: 50%;
  transform: translateX(-50%);
  width: 17px;
  height: 24px;
  fill: oklch(84% 0.16 95);
  stroke: var(--color-ink);
  stroke-width: 2;
  stroke-linejoin: round;
  animation: flash 2.6s ease-in-out infinite;
}

@keyframes flash {
  0%,
  40%,
  100% {
    opacity: 0;
  }
  45%,
  55% {
    opacity: 1;
  }
  60% {
    opacity: 0;
  }
}
</style>
