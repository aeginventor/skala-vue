<script setup>
import { computed } from 'vue'
import { getWeatherGlyph } from '../utils/weatherIcon.js'
import {
  CLOUD,
  SUN_CORE,
  SUN_RAYS,
  RAIN,
  BOLT,
  FOG,
  CLOUD_LAYOUTS,
  getCloudCount
} from '../utils/glyphPaths.js'

/**
 * WeatherGlyph — 날씨를 손으로 그린 듯한 SVG로 그린다.
 *
 * 크기·색을 prop으로 받지 않는다. 쓰는 쪽이 이미 font-size와 color로 아이콘을 제어하고
 * 있어서, `1em` + `currentColor`로 그리면 기존 CSS가 그대로 먹고 호출부는 손댈 게 없다.
 * 작은 크기(예보 26px)에서 뭉개지지 않도록 가는 선 대신 면으로 채운 실루엣을 기본으로 삼았다.
 */
const { status, clouds } = defineProps({
  status: {
    type: String,
    default: ''
  },
  /**
   * 구름 양(%). 넘기면 구름 날씨일 때 양에 따라 구름을 1~3개로 그린다.
   * 기본값이 null이라 **안 넘기면 지금까지처럼 한 개**다 — Dock(17px)이나 예보(16px)처럼
   * 작아서 여러 개가 뭉개지는 자리, 그리고 구름 양을 아예 모르는 자리를 위한 기본값이다.
   */
  clouds: {
    type: Number,
    default: null
  }
})

const glyph = computed(() => getWeatherGlyph(status))

/** 구름 계열 그림에만 개수가 의미 있다. 비·눈·뇌우는 강수에 자리를 내줘야 해서 한 개로 둔다. */
const cloudLayout = computed(() => CLOUD_LAYOUTS[getCloudCount(clouds)])
</script>

<template>
  <svg class="glyph" viewBox="0 0 48 48" fill="currentColor" role="img" :aria-label="status">
    <!-- 맑음: 찌그러진 해 + 길이가 제각각인 광선 -->
    <template v-if="glyph === 'sun'">
      <path :d="SUN_CORE" />
      <path
        :d="SUN_RAYS"
        fill="none"
        stroke="currentColor"
        stroke-width="3.8"
        stroke-linecap="round"
      />
    </template>

    <!-- 흐림/구름: 구름 양이 많을수록 여러 개를, 대신 하나하나는 작게 -->
    <template v-else-if="glyph === 'cloud'">
      <g
        v-for="(cloud, i) in cloudLayout"
        :key="i"
        :transform="`translate(${cloud.x} ${cloud.y}) scale(${cloud.scale})`"
      >
        <path :d="CLOUD" />
      </g>
    </template>

    <!--
      비/눈/뇌우/안개는 전부 "위에 구름, 아래에 무언가" 구조라 구름을 같은 위치로
      줄여 올려놓고(아래쪽에 자리를 비운다) 그 아래 그림만 갈아끼운다.
      Dock·예보의 16~17px에서 넷이 서로 구별되려면 아래 그림이 충분히 커야 해서,
      구름은 0.8배까지 줄이고 남는 자리를 빗줄기/눈/번개에 넉넉히 내줬다.
    -->
    <template v-else>
      <g transform="translate(4.5 -1) scale(0.8)">
        <path :d="CLOUD" />
      </g>

      <path
        v-if="glyph === 'rain'"
        :d="RAIN"
        fill="none"
        stroke="currentColor"
        stroke-width="3.6"
        stroke-linecap="round"
      />

      <!-- 눈: 반지름을 미묘하게 다르게 해서 찍어낸 느낌을 없앤다 -->
      <template v-else-if="glyph === 'snow'">
        <circle cx="15" cy="35" r="3" />
        <circle cx="24" cy="41.5" r="2.5" />
        <circle cx="33" cy="34" r="2.8" />
      </template>

      <path v-else-if="glyph === 'storm'" :d="BOLT" />

      <path
        v-else
        :d="FOG"
        fill="none"
        stroke="currentColor"
        stroke-width="3.2"
        stroke-linecap="round"
      />
    </template>
  </svg>
</template>

<style scoped>
/* font-size로 크기를, color로 색을 물려받는다 (쓰는 쪽 CSS를 그대로 두기 위함) */
.glyph {
  display: block;
  width: 1em;
  height: 1em;
}
</style>
