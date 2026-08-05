<script setup>
import { computed } from 'vue'
import { useConfigStore } from '../stores/configStore.js'
import { getWeatherTheme } from '../utils/weatherIcon.js'
import WeatherGlyph from './WeatherGlyph.vue'

/**
 * WeatherCard — "갤러리 타일"로 재설계.
 * - 기존엔 텍스트 위주의 얇은 리스트 줄이었는데, 지역이 30개로 늘고 홈 화면이
 *   그리드형 갤러리로 바뀌면서 "한눈에 훑어도 정보가 읽히는 큼직한 카드"가 필요해졌다.
 * - 날씨 상태에 따라 카드 배경색 자체가 바뀐다(getWeatherTheme) — 맑음=노랑,
 *   비=파랑, 흐림=회청 등. 텍스트를 읽지 않아도 색만으로 대략적인 날씨가 느껴지게.
 */
/**
 * city 는 스크립트에서 반복해서 쓰이므로 꺼내서 받는다. Vue 3.5부터 props 구조분해가
 * 정식 지원되어, 이렇게 꺼내 써도 반응형이 유지된다(컴파일러가 props.city 로 되돌린다).
 * isSelected/isFavorite 은 템플릿에서만 쓰므로 굳이 꺼내지 않는다.
 */
const { city } = defineProps({
  city: {
    type: Object,
    required: true
  },
  isSelected: {
    type: Boolean,
    default: false
  },
  isFavorite: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['select-card', 'click-detail', 'toggle-favorite'])

const configStore = useConfigStore()

const theme = computed(() => getWeatherTheme(city.status))

/** city.temp 원본은 항상 섭씨. 화면 표시 시점에만 configStore.unit 에 따라 변환. */
const displayTemp = computed(() => {
  const rawTemp = city.temp
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return rawTemp
})

function handleCardClick() {
  emit('select-card', city)
}

function handleDetailClick() {
  emit('click-detail', city)
}

function handleFavoriteClick() {
  emit('toggle-favorite', city)
}

/** 25도(섭씨) 기준. 단위가 화씨로 바뀌어도 판단은 항상 원본 섭씨 값으로 고정한다. */
function isHot(rawCelsiusTemp) {
  return rawCelsiusTemp >= 25
}
</script>

<template>
  <li
    class="tile ink-pressable"
    :class="{ 'tile--active': isSelected, 'tile--favorite': isFavorite }"
    :style="{ '--tile-bg': theme.bg, '--tile-accent': theme.accent }"
    @click="handleCardClick"
  >
    <button
      class="tile__favorite"
      :class="{ 'tile__favorite--active': isFavorite }"
      :aria-label="isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'"
      @click.stop="handleFavoriteClick"
    >
      <i :class="isFavorite ? 'fa-solid fa-star' : 'fa-regular fa-star'"></i>
    </button>

    <div class="tile__icon-wrap">
      <WeatherGlyph :status="city.status" class="tile__icon" />
    </div>

    <p class="tile__name">{{ city.name }}</p>
    <p class="tile__region">{{ city.region }}</p>
    <p class="tile__temp">{{ displayTemp }}<span class="tile__unit">{{ configStore.unitSymbol }}</span></p>

    <span v-if="isHot(city.temp)" class="badge badge--hot">
      <i class="fa-solid fa-fire"></i> 더움
    </span>
    <span v-else class="badge badge--cool">
      <i class="fa-solid fa-snowflake"></i> 선선함
    </span>

    <div class="tile__footer">
      <span class="tile__stat"><i class="fa-solid fa-droplet"></i> {{ city.humidity }}%</span>
      <span class="tile__stat"><i class="fa-solid fa-wind"></i> {{ city.windSpeed }}m/s</span>
    </div>

    <!--
      카드 클릭은 "선택"만 할 뿐이라, 이 버튼이 상세 페이지로 가는 유일한 통로다.
      그만큼 누르기 쉽게 폭 전체를 차지하는 큰 버튼으로 잡았다.
    -->
    <button class="detail-btn ink-pressable" @click.stop="handleDetailClick">
      상세보기 <i class="fa-solid fa-arrow-right"></i>
    </button>
  </li>
</template>

<style scoped>
.tile {
  position: relative;
  list-style: none;
  background: var(--tile-bg, var(--color-sun-bg));
  border: var(--border-thick);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-hard);
  padding: 18px 16px 16px;
  transition: transform 0.15s ease;
}

/*
 * 벽에 손으로 붙인 스티커처럼 보이도록, 카드마다 모서리·기울기·테두리 굵기·그림자를
 * 조금씩 다르게 준다. 3주기로 돌리면 4열 그리드에서 줄마다 패턴이 어긋나서
 * "세로줄이 반복된다"는 티가 안 난다.
 * 기울기는 1°를 넘기지 않는다 — 넘어가면 손맛이 아니라 깨진 레이아웃으로 보인다.
 * 기울기에 transform 대신 rotate 속성을 쓰는 이유: 아래 hover(transform)와 눌림
 * 효과(.ink-pressable:active)가 서로 덮어쓰지 않고 자연스럽게 합성되기 때문이다.
 */
.tile:nth-child(3n + 1) {
  rotate: -0.6deg;
  border-width: 3px 2.5px 3.5px 3px;
}

.tile:nth-child(3n + 2) {
  rotate: 0.5deg;
  border-radius: var(--radius-lg-b);
  border-width: 3.5px 3px 2.5px 3px;
  box-shadow: 4px 5px 0 var(--color-ink);
}

.tile:nth-child(3n + 3) {
  rotate: -0.25deg;
  border-radius: var(--radius-lg-c);
  border-width: 2.5px 3px 3px 3.5px;
  box-shadow: 5px 4px 0 var(--color-ink);
}

.tile:hover {
  transform: translateY(-4px) rotate(-1deg);
}

.tile--active {
  outline: 3px dashed var(--color-ink);
  outline-offset: 3px;
}

/*
 * 위 nth-child 규칙(.tile:nth-child(...))이 클래스 하나짜리 선택자보다 특이도가 높아서,
 * 그냥 .tile--favorite 로 두면 즐겨찾기 카드의 노란 그림자가 카드 위치에 따라 먹히다
 * 말다 한다. 클래스를 겹쳐 써서 특이도를 맞추고, 뒤에 선언해 확실히 이기게 한다.
 */
.tile.tile--favorite {
  border-color: var(--color-favorite);
  box-shadow: 5px 5px 0 var(--color-favorite);
}

.tile__favorite {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: var(--border-thin);
  background: #fff;
  color: var(--color-muted);
  display: flex;
  align-items: center;
  justify-content: center;
}

.tile__favorite--active {
  color: var(--color-favorite);
  background: var(--color-sun-bg);
}

.tile__icon-wrap {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #fff;
  border: var(--border-thin);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

.tile__icon {
  font-size: 30px;
  color: var(--tile-accent, var(--color-sun));
}

.tile__name {
  margin: 0;
  font-family: 'Pretendard', sans-serif;
  font-size: 19px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.tile__region {
  margin: 2px 0 8px;
  font-size: 11px;
  color: var(--color-muted);
}

.tile__temp {
  margin: 0 0 8px;
  font-family: 'Pretendard', sans-serif;
  font-size: 34px;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1;
}

.tile__unit {
  font-size: 16px;
  margin-left: 2px;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 999px;
  border: var(--border-thin);
  margin-bottom: 12px;
}

.badge--hot {
  background: var(--color-hot-bg);
  color: var(--color-hot);
}

.badge--cool {
  background: var(--color-cool-bg);
  color: var(--color-cool);
}

.tile__footer {
  display: flex;
  align-items: center;
  gap: 14px;
  padding-top: 10px;
  padding-bottom: 12px;
  border-top: 2px dashed rgba(34, 34, 59, 0.2);
}

.tile__stat {
  font-size: 11px;
  color: var(--color-muted);
  display: flex;
  align-items: center;
  gap: 4px;
}

.detail-btn {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: var(--border-thick);
  background: var(--color-ink);
  color: #fff;
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-hard-sm);
  padding: 12px 14px;
  font-size: 13px;
  font-weight: 700;
}
</style>
