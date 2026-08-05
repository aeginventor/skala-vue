<script setup>
import { computed } from 'vue'
import { getWeatherGlyph } from '../utils/weatherIcon.js'
import { CLOUD, SUN_CORE, SUN_RAYS, RAIN, BOLT, FOG } from '../utils/glyphPaths.js'

/**
 * WeatherGlyph — 날씨 상태를 손으로 그린 듯한 SVG 아이콘으로 그린다.
 *
 * 아이콘 세트(Font Awesome)를 쓰지 않고 직접 그리는 이유: FA 글리프는 획 굵기와
 * 곡률이 완벽하게 균일해서, 두꺼운 잉크 테두리로 그린 이 앱의 카툰 톤과 붙여 놓으면
 * 아이콘만 "가져다 쓴 것"처럼 겉돈다. 그래서 원은 살짝 찌그러뜨리고, 구름 혹은 좌우
 * 크기를 다르게 하고, 광선/빗줄기는 길이를 제각각으로 잡아 손그림의 흔들림을 흉내냈다.
 *
 * 크기·색을 prop으로 받지 않는 이유: 쓰는 쪽 4곳(카드 30px / 하단바 20px / Dock 17px /
 * 예보 16px)이 전부 이미 font-size와 color로 아이콘을 제어하고 있다. 그래서 SVG를
 * `1em` + `currentColor`로 그리면 기존 CSS가 그대로 먹고, 쓰는 쪽은 손댈 게 없다.
 *
 * 그림은 Dock·예보의 16~17px에서도 뭉개지지 않아야 해서, 가는 선을 여러 겹 쓰는 대신
 * 면으로 채운 실루엣을 기본으로 삼았다. 광선·빗줄기·안개선처럼 선이어야 자연스러운
 * 요소만 stroke로 그리고 끝을 둥글게(stroke-linecap) 해서 붓끝 느낌을 준다.
 */
const { status } = defineProps({
  status: {
    type: String,
    default: ''
  }
})

const glyph = computed(() => getWeatherGlyph(status))
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

    <!-- 흐림/구름: 구름 하나만 큼직하게 -->
    <path v-else-if="glyph === 'cloud'" :d="CLOUD" />

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
