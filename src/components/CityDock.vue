<script setup>
import { ref, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWeatherStore } from '../stores/weatherStore.js'
import { getWeatherIcon } from '../utils/weatherIcon.js'

/**
 * CityDock — 맥북 Dock에서 아이디어를 가져온 상단 내비게이션.
 * - 라벨은 hover 없이 아이콘 아래 작은 글자로 항상 보인다.
 * - [버그 수정] "전체" 버튼은 스크롤 컨테이너(.dock) 안에서 `position: sticky`로
 *   왼쪽에 고정된다. "전체" 버튼과 구분선을 하나로 감싼 래퍼(.dock-pinned)를 sticky
 *   컨테이너로 두고, 그 래퍼가 왼쪽 여백(padding-left)까지 통째로 소유하게 했다.
 *   원래는 이 여백을 .dock 컨테이너의 padding으로 뒀는데, 스크롤 컨테이너 시작
 *   지점의 padding이 스크롤에 같이 딸려가는지는 브라우저마다 처리가 달라서, 그
 *   틈으로 뒤에 있는 도시 버튼이 살짝 비쳐 보이는 경우가 있었다.
 * - [버그 수정] 구분선도 원래는 이 래퍼 밖의 일반 형제 요소였는데, sticky가 아니라서
 *   스크롤을 시작하는 순간 다른 도시 아이콘들과 같이 딸려가 "전체"와 지역 목록
 *   사이의 경계가 스크롤 위치 0에서만 보이고 바로 사라졌다. 래퍼 안으로 옮겨서
 *   전체 버튼과 한 몸으로 고정시켰다.
 * - [다듬기] 위 고정 경계 바로 뒤에 오른쪽으로 옅어지는 그라데이션(.dock-pinned::after)을
 *   깔아서, 스크롤되는 도시 버튼들이 각지게 뚝 끊기는 대신 배경 속으로 스며들듯
 *   지나가게 했다. 그냥 딱 잘린 흰 상자처럼 보이던 걸 완화하기 위함.
 * - [버그 수정] 마우스로 드래그하는 동안에는 커서가 지나가는 버튼에 hover 확대
 *   효과가 계속 걸렸다. 이 확대(translateY + scale) 때문에 버튼이 원래 자리보다
 *   커져서, 고정된 "전체" 영역 뒤를 지나갈 때 아래쪽 테두리가 살짝 삐져나와 보였다.
 *   드래그 중에는 `.dock--dragging` 클래스로 hover 확대 자체를 꺼서 해결했다.
 * - 도시 아이콘은 고정된 위치 핀이 아니라, weatherStore.cities(Home에서 Axios로
 *   갱신한 실시간 값)를 그대로 참조해서 그 도시의 현재 날씨 상태에 맞는 아이콘을
 *   보여준다.
 * - [추가 기능] 트랙패드/스크롤휠 없이도 마우스로 아이콘을 잡고 옆으로 끌면
 *   가로 스크롤이 되게 했다. mousedown 시점의 좌표·scrollLeft를 기억해뒀다가,
 *   mousemove 때 그 차이만큼 scrollLeft를 직접 옮긴다. 버튼(RouterLink) 위에서
 *   시작해도 동작해야 해서, 일정 거리(4px) 이상 움직였을 때만 "드래그"로 인정하고
 *   그 경우에만 클릭 이벤트를 막아 실수로 페이지 이동이 되지 않게 했다.
 * - [기능 변경] Dock 끝에 있던 "소개" 링크는 헤더에 전용 버튼이 생겨서 중복이라
 *   빼고, 그 자리에 무작위 지역으로 이동하는 "랜덤" 버튼을 넣었다.
 */
const route = useRoute()
const router = useRouter()
const weatherStore = useWeatherStore()
const dockEl = ref(null)
const isDragging = ref(false)

let isPointerDown = false
let dragMoved = false
let dragStartX = 0
let dragStartScrollLeft = 0

function isActiveCity(cityId) {
  return route.params.cityId === cityId
}

function goToRandomCity() {
  const cities = weatherStore.cities
  if (cities.length === 0) return
  const randomCity = cities[Math.floor(Math.random() * cities.length)]
  router.push(`/weather/${randomCity.id}`)
}

function handleDragStart(event) {
  if (event.button !== 0 || !dockEl.value) return
  isPointerDown = true
  dragMoved = false
  dragStartX = event.pageX
  dragStartScrollLeft = dockEl.value.scrollLeft
  // 링크를 마우스로 끌 때 브라우저가 기본으로 하는 "링크 드래그"/텍스트 선택을 막는다
  event.preventDefault()
  window.addEventListener('mousemove', handleDragMove)
  window.addEventListener('mouseup', handleDragEnd)
}

function handleDragMove(event) {
  if (!isPointerDown || !dockEl.value) return
  const delta = event.pageX - dragStartX
  if (Math.abs(delta) > 4) {
    dragMoved = true
    isDragging.value = true
  }
  if (dragMoved) {
    dockEl.value.scrollLeft = dragStartScrollLeft - delta
  }
}

function handleDragEnd() {
  isPointerDown = false
  isDragging.value = false
  window.removeEventListener('mousemove', handleDragMove)
  window.removeEventListener('mouseup', handleDragEnd)
}

/** 드래그였다면(버튼을 잡고 옆으로 끌었다면) 그 클릭이 라우터 이동으로 이어지지 않게 막는다 */
function handleDockClickCapture(event) {
  if (dragMoved) {
    event.preventDefault()
    event.stopPropagation()
  }
}

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', handleDragMove)
  window.removeEventListener('mouseup', handleDragEnd)
})
</script>

<template>
  <div class="dock-wrap">
    <nav
      ref="dockEl"
      class="dock"
      :class="{ 'dock--dragging': isDragging }"
      aria-label="지역 바로가기 Dock"
      @mousedown="handleDragStart"
      @click.capture="handleDockClickCapture"
    >
      <div class="dock-pinned">
        <RouterLink
          to="/"
          class="dock-item ink-pressable"
          :class="{ 'dock-item--active': route.name === 'weather-home' }"
          title="전체 대시보드"
        >
          <i class="fa-solid fa-house"></i>
          <span class="dock-item__label">전체</span>
        </RouterLink>
        <span class="dock-divider" aria-hidden="true"></span>
      </div>

      <RouterLink
        v-for="city in weatherStore.cities"
        :key="city.id"
        :to="`/weather/${city.id}`"
        class="dock-item ink-pressable"
        :class="{ 'dock-item--active': isActiveCity(city.id) }"
        :title="city.name"
      >
        <i :class="['fa-solid', getWeatherIcon(city.status)]"></i>
        <span class="dock-item__label">{{ city.name }}</span>
      </RouterLink>

      <span class="dock-divider" aria-hidden="true"></span>

      <button
        type="button"
        class="dock-item ink-pressable"
        title="랜덤 지역 날씨"
        @click="goToRandomCity"
      >
        <i class="fa-solid fa-shuffle"></i>
        <span class="dock-item__label">랜덤</span>
      </button>
    </nav>
    <p class="dock-hint"><i class="fa-solid fa-arrows-left-right"></i> 옆으로 밀어서 30개 지역을 모두 볼 수 있어요</p>
  </div>
</template>

<style scoped>
.dock-wrap {
  position: relative;
  max-width: 100%;
}

.dock {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background: var(--color-surface);
  border: var(--border-thick);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-hard);
  padding: 12px 16px 12px 0;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.dock::-webkit-scrollbar {
  height: 6px;
}

.dock::-webkit-scrollbar-thumb {
  background: var(--color-primary-bg);
  border-radius: 999px;
}

/*
 * "전체" 버튼 + 구분선을 스크롤 컨테이너(.dock) 왼쪽 끝에 고정.
 * padding-right + 음수 margin-right 조합으로 이 래퍼의 배경이 flex gap 틈까지
 * 덮게 만들어서, 뒤로 스크롤되는 다른 도시 아이콘이 gap 사이로 비치거나
 * "전체" 버튼과 겹쳐 보이는 일이 없게 했다.
 *
 * [다듬기] 한때 오른쪽 여백을 14px까지 넉넉하게 잡고 blur 그라데이션까지
 * 얹어봤는데, 이 앱은 블러 없는 두꺼운 잉크 테두리 + 하드 섀도우("카툰/스티커")
 * 스타일이라 부드러운 흐림 효과가 오히려 스타일에 안 맞고 어색해 보였다.
 * 게다가 그 넉넉한 여백 자체가 다른 구분선 주변보다 훨씬 넓은 "흰 박스"로
 * 느껴지는 원인이었다. 애초에 여백을 넓게 잡은 이유는 드래그 중 hover 확대
 * 효과가 삐져나오는 걸 덮기 위해서였는데, 그 확대 효과 자체를 드래그 중엔
 * 꺼버렸으니(.dock--dragging) 더 이상 넉넉한 여백이 필요 없다. blur를 걷어내고
 * 여백을 다른 구분선과 비슷한 수준(8px)으로 줄여서, 도시 버튼들이 "전체"
 * 경계 바로 옆까지 딱 붙어 지나가는 깔끔한 느낌으로 바꿨다.
 * [버그 재발/재수정] blur를 걷어내면서 페이드까지 통째로 없앴더니, 스크롤이
 * 조금만 움직여도(정지 상태에서도) 뒤에 있는 도시 버튼의 둥근 모서리가 이
 * 불투명 배경에 칼같이 잘려서 다시 각지게 보였다. 이전 페이드는 이 래퍼
 * 바깥(-14px)까지 번져나가서 문제였던 거지, 페이드 자체가 문제는 아니었다.
 * 그래서 페이드를 이 래퍼 "바깥으로 확장"하는 대신, 이미 있는 padding-right
 * 8px 영역 안에서만 배경이 옅어지게(투명해지게) 했다. 이 영역은 scrollLeft
 * 0에서 정확히 flex gap과 맞아떨어져 서울과 안 겹치던 자리라(위 -8px margin
 * 참고), 페이드를 얹어도 정지 상태에서 서울을 더 가리지 않으면서, 스크롤 중
 * 잘리는 모서리는 배경 속으로 스며들듯 부드럽게 보이게 된다.
 */
.dock-pinned {
  position: sticky;
  left: 0;
  z-index: 5;
  flex-shrink: 0;
  display: flex;
  align-items: stretch;
  gap: 6px;
  background: linear-gradient(
    to right,
    var(--color-surface) 0,
    var(--color-surface) calc(100% - 8px),
    transparent 100%
  );
  padding: 0 8px 0 16px;
  margin-right: -8px;
}

.dock-divider {
  width: 3px;
  align-self: stretch;
  background: var(--color-ink);
  opacity: 0.15;
  border-radius: 3px;
  margin: 4px 2px;
  flex-shrink: 0;
}

.dock-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 56px;
  height: 56px;
  flex-shrink: 0;
  border-radius: var(--radius-sm);
  border: var(--border-thin);
  background: var(--color-bg);
  color: var(--color-ink);
  text-decoration: none;
  font-family: inherit;
  font-size: 17px;
  padding: 0;
  transition: transform 0.15s ease, background-color 0.15s ease;
}

.dock-item__label {
  font-family: 'Pretendard', sans-serif;
  font-size: 9px;
  font-weight: 600;
  color: var(--color-muted);
  white-space: nowrap;
}

.dock-item:hover {
  transform: translateY(-6px) rotate(-3deg) scale(1.08);
  background: var(--color-primary-bg);
  z-index: 4;
}

/* 드래그로 스크롤하는 동안엔 커서가 지나가는 버튼마다 확대 효과가 걸려 삐져나와 보이는
   문제가 있어서, 드래그 중에는 hover 확대를 꺼서 버튼들이 평평하게 지나가게 한다. */
.dock--dragging .dock-item:hover {
  transform: none;
  background: var(--color-bg);
  z-index: auto;
}

.dock--dragging .dock-item--active:hover {
  background: var(--color-primary);
}

.dock-item--active {
  background: var(--color-primary);
  color: #fff;
}

.dock-item--active .dock-item__label {
  color: #fff;
}

.dock-hint {
  margin: 8px 0 0;
  font-size: 11px;
  color: var(--color-muted);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}
</style>
