/**
 * 기온을 다섯 단계로 나눈다.
 *
 * 원래는 25℃를 기준으로 "더움 / 선선함" 둘뿐이었는데, 그러면 영하 2도와 24도가 똑같이
 * "선선함"으로 묶여 실제로 옷차림을 정하는 데 아무 도움이 안 됐다.
 *
 * weatherIcon.js의 CONDITION_RULES와 같은 방식으로 **임계값 테이블 하나**만 두고
 * 라벨·색·아이콘을 다 여기서 뽑는다. 기준이 여러 파일에 흩어지면 색과 라벨이 어긋난다.
 * 표는 높은 온도부터 내려가며 적어서, 처음 만족하는 칸이 곧 그 단계가 된다.
 */
const INK = 'var(--color-ink)'
const PAPER = 'var(--color-bg)'

const TEMP_LEVELS = [
  {
    id: 'hot',
    on: PAPER,
    label: '더움',
    min: 28,
    icon: 'fa-fire',
    color: 'var(--color-temp-hot)',
    bg: 'var(--color-temp-hot-bg)'
  },
  {
    id: 'warm',
    on: INK,
    label: '따뜻',
    min: 21,
    icon: 'fa-temperature-three-quarters',
    color: 'var(--color-temp-warm)',
    bg: 'var(--color-temp-warm-bg)'
  },
  {
    id: 'mild',
    on: INK,
    label: '선선',
    min: 14,
    icon: 'fa-temperature-half',
    color: 'var(--color-temp-mild)',
    bg: 'var(--color-temp-mild-bg)'
  },
  {
    id: 'chilly',
    on: INK,
    label: '쌀쌀',
    min: 5,
    icon: 'fa-temperature-quarter',
    color: 'var(--color-temp-chilly)',
    bg: 'var(--color-temp-chilly-bg)'
  },
  {
    id: 'cold',
    on: PAPER,
    label: '추움',
    min: -Infinity,
    icon: 'fa-snowflake',
    color: 'var(--color-temp-cold)',
    bg: 'var(--color-temp-cold-bg)'
  }
]

/**
 * 기온이 속한 단계를 돌려준다.
 *
 * @param {number} rawCelsius 항상 **원본 섭씨** 값을 넘겨야 한다. 화면이 화씨로 보이는
 *   중이라고 화씨 값을 넣으면 단계가 통째로 어긋난다(77°F는 25℃라 '따뜻'인데, 77을
 *   그대로 넣으면 '더움'이 된다). 단위 변환은 표시할 때만 하고 판정은 섭씨로 고정한다.
 * @returns {{id: string, label: string, on: string, icon: string, color: string, bg: string}}
 */
export function getTempLevel(rawCelsius) {
  return TEMP_LEVELS.find((level) => rawCelsius >= level.min) ?? TEMP_LEVELS.at(-1)
}

/** 소개 페이지 범례처럼 다섯 단계를 한 번에 보여줄 때 쓴다 (추움 -> 더움 순서) */
export const TEMP_LEVEL_LEGEND = [...TEMP_LEVELS].reverse()
