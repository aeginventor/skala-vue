/**
 * OpenWeatherMap이 한글(lang=kr)로 주는 날씨 설명("맑음", "튼구름", "약한 비" 등)을
 * 손그림 아이콘(glyph) + 카툰풍 테마 색상 한 쌍으로 매핑한다.
 * 아이콘/배경색을 따로따로 매핑하면 "이 날씨는 이 색"이라는 규칙이 두 곳에 흩어지므로,
 * 하나의 규칙 테이블(CONDITION_RULES)에서 둘 다 뽑아 쓰도록 합쳤다.
 *
 * glyph는 WeatherGlyph.vue가 그리는 그림의 종류다. category(정렬용 대분류)와 따로 두는
 * 이유는 안개 때문 — 안개/연무/황사는 정렬상 '구름'으로 묶이는 게 맞지만, 그림은 구름과
 * 구분돼야 한다. 둘을 한 필드로 합치면 이 구분이 사라진다.
 */
const INK = 'var(--color-ink)'
const PAPER = 'var(--color-bg)'

const CONDITION_RULES = [
  { category: 'snow', keywords: ['눈'], glyph: 'snow', bg: 'var(--color-snow-bg)', accent: 'var(--color-snow)', onAccent: INK },
  { category: 'storm', keywords: ['뇌우', '천둥'], glyph: 'storm', bg: 'var(--color-storm-bg)', accent: 'var(--color-storm)', onAccent: PAPER },
  { category: 'rain', keywords: ['비', '소나기', '이슬비'], glyph: 'rain', bg: 'var(--color-rain-bg)', accent: 'var(--color-rain)', onAccent: PAPER },
  { category: 'cloud', keywords: ['안개', '연무', '박무', '황사', '먼지'], glyph: 'fog', bg: 'var(--color-cloud-bg)', accent: 'var(--color-cloud)', onAccent: PAPER },
  { category: 'cloud', keywords: ['흐림', '구름'], glyph: 'cloud', bg: 'var(--color-cloud-bg)', accent: 'var(--color-cloud)', onAccent: PAPER },
  { category: 'sun', keywords: ['맑음'], glyph: 'sun', bg: 'var(--color-sun-bg)', accent: 'var(--color-sun)', onAccent: INK }
]

const DEFAULT_RULE = { category: 'sun', glyph: 'sun', bg: 'var(--color-sun-bg)', accent: 'var(--color-sun)', onAccent: INK }

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
 * 날씨에 딸린 색 한 벌.
 * - accent: 아이콘 원을 꽉 채우는 진한 잉크색
 * - onAccent: 그 원 위에 얹는 색. 노란 해 위에는 잉크색이, 진한 파랑 위에는 종이색이
 *   읽힌다. 원의 밝기에 따라 갈리는 값이라 색과 같은 표에서 함께 관리해야 어긋나지 않는다.
 * - bg: 옅은 틴트. 큰 면에는 쓰지 않고 배너·표시처럼 작은 자리에만 쓴다.
 * @param {string} statusText
 * @returns {{bg: string, accent: string, onAccent: string}}
 */
export function getWeatherTheme(statusText) {
  const { bg, accent, onAccent } = matchRule(statusText)
  return { bg, accent, onAccent }
}

/**
 * "날씨별 정렬"에 쓰는 대분류 카테고리.
 * 실시간 API 설명은 "튼구름", "약간 흐림", "구름많음"처럼 문자열이 조금씩 다르다.
 * status 문자열을 그대로 가나다순 정렬하면 "구름"(ㄱ)과 "흐림"(ㅎ)처럼 같은 구름
 * 계열인데도 초성이 멀어 정렬 결과에서 따로 떨어져 나간다. 아이콘을 정할 때 쓰는
 * 키워드 매핑 규칙에서 category만 뽑아 쓰면, "이 카드가 화면에 무슨 아이콘으로
 * 보이는지"와 "정렬에서 어디로 묶이는지"가 항상 일치한다 (규칙이 한 곳에만
 * 있으니 둘이 따로 놀 수가 없다).
 * @param {string} statusText
 * @returns {string} 'sun' | 'cloud' | 'rain' | 'snow' | 'storm'
 */
export function getWeatherCategory(statusText) {
  return matchRule(statusText).category
}
