/**
 * 일출·일몰을 **그 도시의 현지 시각**으로 찍는다.
 * 오프셋을 더한 뒤 UTC 함수로 읽어야 한다 — `getHours()`를 그냥 쓰면 보는 사람의
 * 브라우저 시간대가 섞여 어긋난다.
 * @param {number|null|undefined} unixSeconds 유닉스 타임스탬프(초)
 * @param {number} timezoneOffsetSec 도시의 UTC 대비 오프셋(초)
 * @returns {string} "HH:mm"
 */
export function formatLocalTime(unixSeconds, timezoneOffsetSec = 0) {
  if (unixSeconds === null || unixSeconds === undefined) return '-'

  const localMillis = (unixSeconds + timezoneOffsetSec) * 1000
  const date = new Date(localMillis)
  const hours = String(date.getUTCHours()).padStart(2, '0')
  const minutes = String(date.getUTCMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}
