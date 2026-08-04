/**
 * OpenWeatherMap이 한글(lang=kr)로 주는 날씨 설명("맑음", "튼구름", "약한 비" 등)을
 * Font Awesome 아이콘 + 카툰풍 테마 색상 한 쌍으로 매핑한다.
 * 아이콘/배경색을 따로따로 매핑하면 "이 날씨는 이 색"이라는 규칙이 두 곳에 흩어지므로,
 * 하나의 규칙 테이블(CONDITION_RULES)에서 둘 다 뽑아 쓰도록 합쳤다.
 */
const CONDITION_RULES = [
  { keywords: ['눈'], icon: 'fa-snowflake', bg: 'var(--color-snow-bg)', accent: 'var(--color-snow)' },
  { keywords: ['뇌우', '천둥'], icon: 'fa-bolt', bg: 'var(--color-storm-bg)', accent: 'var(--color-storm)' },
  { keywords: ['비', '소나기', '이슬비'], icon: 'fa-cloud-showers-heavy', bg: 'var(--color-rain-bg)', accent: 'var(--color-rain)' },
  { keywords: ['안개', '연무', '박무', '황사', '먼지'], icon: 'fa-smog', bg: 'var(--color-cloud-bg)', accent: 'var(--color-cloud)' },
  { keywords: ['흐림', '구름'], icon: 'fa-cloud', bg: 'var(--color-cloud-bg)', accent: 'var(--color-cloud)' },
  { keywords: ['맑음'], icon: 'fa-sun', bg: 'var(--color-sun-bg)', accent: 'var(--color-sun)' }
]

const DEFAULT_RULE = { icon: 'fa-cloud-sun', bg: 'var(--color-sun-bg)', accent: 'var(--color-sun)' }

function matchRule(statusText) {
  return CONDITION_RULES.find((rule) => rule.keywords.some((keyword) => statusText?.includes(keyword))) ?? DEFAULT_RULE
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
