/**
 * OpenWeatherMap이 한글(lang=kr)로 주는 날씨 설명("맑음", "튼구름", "약한 비" 등)을
 * Font Awesome 아이콘 + 카툰풍 테마 색상 한 쌍으로 매핑한다.
 * 아이콘/배경색을 따로따로 매핑하면 "이 날씨는 이 색"이라는 규칙이 두 곳에 흩어지므로,
 * 하나의 규칙 테이블(CONDITION_RULES)에서 둘 다 뽑아 쓰도록 합쳤다.
 */
const CONDITION_RULES = [
  { category: 'snow', keywords: ['눈'], icon: 'fa-snowflake', bg: 'var(--color-snow-bg)', accent: 'var(--color-snow)' },
  { category: 'storm', keywords: ['뇌우', '천둥'], icon: 'fa-bolt', bg: 'var(--color-storm-bg)', accent: 'var(--color-storm)' },
  { category: 'rain', keywords: ['비', '소나기', '이슬비'], icon: 'fa-cloud-showers-heavy', bg: 'var(--color-rain-bg)', accent: 'var(--color-rain)' },
  { category: 'cloud', keywords: ['안개', '연무', '박무', '황사', '먼지'], icon: 'fa-smog', bg: 'var(--color-cloud-bg)', accent: 'var(--color-cloud)' },
  { category: 'cloud', keywords: ['흐림', '구름'], icon: 'fa-cloud', bg: 'var(--color-cloud-bg)', accent: 'var(--color-cloud)' },
  { category: 'sun', keywords: ['맑음'], icon: 'fa-sun', bg: 'var(--color-sun-bg)', accent: 'var(--color-sun)' }
]

const DEFAULT_RULE = { category: 'sun', icon: 'fa-cloud-sun', bg: 'var(--color-sun-bg)', accent: 'var(--color-sun)' }

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

/** @param {string} statusText @returns {string} Font Awesome 아이콘 클래스명 */
export function getWeatherIcon(statusText) {
  return matchRule(statusText).icon
}

/** @param {string} statusText @returns {{bg: string, accent: string}} 카드 배경색 / 포인트색 CSS 변수 */
export function getWeatherTheme(statusText) {
  const rule = matchRule(statusText)
  return { bg: rule.bg, accent: rule.accent }
}

/**
 * "날씨별 정렬"에 쓰는 대분류 카테고리.
 * - [버그 수정] 실시간 API 설명은 "튼구름", "약간 흐림", "구름많음"처럼 문자열이 조금씩
 *   다르다. status 문자열을 그대로 가나다순 정렬했더니 "구름"(ㄱ)과 "흐림"(ㅎ)처럼
 *   같은 구름 계열인데도 초성이 멀어서 정렬 결과에서 따로 떨어져 나갔다.
 * - 아이콘을 정할 때 이미 만들어둔 키워드 매핑 규칙에서 category만 뽑아 쓰면
 *   "이 카드가 화면에 무슨 아이콘으로 보이는지"와 "정렬에서 어디로 묶이는지"가
 *   항상 일치한다 (규칙이 한 곳에만 있으니 둘이 따로 놀 수가 없다).
 * @param {string} statusText
 * @returns {string} 'sun' | 'cloud' | 'rain' | 'snow' | 'storm'
 */
export function getWeatherCategory(statusText) {
  return matchRule(statusText).category
}
