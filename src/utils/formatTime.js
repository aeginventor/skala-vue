/**
 * OpenWeatherMap의 sunrise/sunset은 UTC 기준 유닉스 타임스탬프(초)로 온다.
 * 여기에 도시별 timezone(UTC 대비 초 단위 오프셋)을 더한 뒤 UTC 시각 함수로 읽으면,
 * "보는 사람의 브라우저 시간대"가 아니라 "그 도시 현지 시각"을 정확히 구할 수 있다.
 * (new Date().getHours() 를 그냥 쓰면 브라우저 로컬 시간대 기준으로 어긋난다)
 *
 * @param {number|null|undefined} unixSeconds - sunrise/sunset 유닉스 타임스탬프(초)
 * @param {number} timezoneOffsetSec - apiData.timezone (도시의 UTC 대비 오프셋, 초)
 * @returns {string} "HH:mm" 형태의 현지 시각 문자열
 */
export function formatLocalTime(unixSeconds, timezoneOffsetSec = 0) {
  if (unixSeconds === null || unixSeconds === undefined) return '-'

  const localMillis = (unixSeconds + timezoneOffsetSec) * 1000
  const date = new Date(localMillis)
  const hours = String(date.getUTCHours()).padStart(2, '0')
  const minutes = String(date.getUTCMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}
