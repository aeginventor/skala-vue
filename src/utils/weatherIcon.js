/**
 * 한글 날씨 설명("맑음", "튼구름", "약한 비" …)을 그림·색·정렬 기준으로 옮긴다.
 * 셋을 따로 매핑하면 서로 어긋나므로 규칙 테이블 하나에서 전부 뽑는다.
 *
 * glyph를 category와 따로 두는 건 안개 때문이다 — 안개·황사는 정렬상 '구름'이 맞지만
 * 그림은 구름과 달라야 한다. 한 필드로 합치면 이 구분이 사라진다.
 */
const INK = 'var(--color-ink)'
const PAPER = 'var(--color-bg)'

const CONDITION_RULES = [
  { category: 'snow', keywords: ['눈'], glyph: 'snow', accent: 'var(--color-snow)', onAccent: INK },
  { category: 'storm', keywords: ['뇌우', '천둥'], glyph: 'storm', accent: 'var(--color-storm)', onAccent: PAPER },
  { category: 'rain', keywords: ['비', '소나기', '이슬비'], glyph: 'rain', accent: 'var(--color-rain)', onAccent: PAPER },
  { category: 'cloud', keywords: ['안개', '연무', '박무', '황사', '먼지'], glyph: 'fog', accent: 'var(--color-cloud)', onAccent: PAPER },
  { category: 'cloud', keywords: ['흐림', '구름'], glyph: 'cloud', accent: 'var(--color-cloud)', onAccent: PAPER },
  { category: 'sun', keywords: ['맑음'], glyph: 'sun', accent: 'var(--color-sun)', onAccent: INK }
]

const DEFAULT_RULE = { category: 'sun', glyph: 'sun', accent: 'var(--color-sun)', onAccent: INK }

/**
 * "날씨별 정렬"에서 카테고리가 뜨는 순서. 인덱스가 작을수록 앞쪽에 온다.
 * 화면에서 항상 맑음 -> 구름 -> 비 -> 눈 -> 뇌우 순으로 묶여서 보이게 고정 순서를 준다.
 */
export const WEATHER_CATEGORY_ORDER = ['sun', 'cloud', 'rain', 'snow', 'storm']

function matchRule(statusText) {
  return (
    CONDITION_RULES.find((rule) => rule.keywords.some((keyword) => statusText?.includes(keyword))) ??
    DEFAULT_RULE
  )
}

/** @param {string} statusText @returns {string} WeatherGlyph가 그릴 그림 종류 */
export function getWeatherGlyph(statusText) {
  return matchRule(statusText).glyph
}

/**
 * 날씨에 딸린 색 한 쌍.
 * - accent: 아이콘 원을 꽉 채우는 진한 잉크색
 * - onAccent: 그 원 위에 얹는 색. 황토색 해 위에는 잉크색이, 진한 파랑 위에는 종이색이
 *   읽힌다. 원의 밝기에 따라 갈리는 값이라 색과 같은 표에서 함께 관리해야 어긋나지 않는다.
 * @param {string} statusText
 * @returns {{accent: string, onAccent: string}}
 */
export function getWeatherTheme(statusText) {
  const { accent, onAccent } = matchRule(statusText)
  return { accent, onAccent }
}

/**
 * "날씨별 정렬"에 쓰는 대분류.
 * status를 그대로 가나다순으로 세우면 "구름"(ㄱ)과 "흐림"(ㅎ)이 같은 구름 계열인데도
 * 갈라진다. 아이콘과 같은 표에서 뽑으므로 화면에 보이는 그림과 정렬 묶음이 늘 일치한다.
 * @param {string} statusText
 * @returns {string} 'sun' | 'cloud' | 'rain' | 'snow' | 'storm'
 */
export function getWeatherCategory(statusText) {
  return matchRule(statusText).category
}
