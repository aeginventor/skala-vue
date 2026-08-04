/**
 * OpenWeatherMap이 한글(lang=kr)로 주는 날씨 설명("맑음", "튼구름", "약한 비" 등)을
 * Font Awesome 아이콘 클래스로 매핑한다. 이모지 대신 아이콘 폰트를 쓰면 카드/Dock에서
 * 항상 같은 굵기·크기로 렌더링된다.
 */
const ICON_RULES = [
  { keywords: ['눈'], icon: 'fa-snowflake' },
  { keywords: ['뇌우', '천둥'], icon: 'fa-bolt' },
  { keywords: ['비', '소나기', '이슬비'], icon: 'fa-cloud-showers-heavy' },
  { keywords: ['안개', '연무', '박무', '황사', '먼지'], icon: 'fa-smog' },
  { keywords: ['흐림', '구름'], icon: 'fa-cloud' },
  { keywords: ['맑음'], icon: 'fa-sun' }
]

const DEFAULT_ICON = 'fa-cloud-sun'

/** @param {string} statusText @returns {string} Font Awesome 아이콘 클래스명 */
export function getWeatherIcon(statusText) {
  const rule = ICON_RULES.find((r) => r.keywords.some((keyword) => statusText?.includes(keyword)))
  return rule ? rule.icon : DEFAULT_ICON
}
