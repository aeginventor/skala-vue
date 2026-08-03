/**
 * 한글 단어의 마지막 글자에 받침이 있는지 판별한다.
 *
 * 완성형 한글(가~힣)은 유니코드 상에서
 *   코드값 = 0xAC00 + (초성 인덱스 × 21 + 중성 인덱스) × 28 + 종성 인덱스
 * 규칙으로 배열되어 있다.
 * 즉 (코드값 - 0xAC00) % 28 을 계산하면 종성(받침) 인덱스만 뽑아낼 수 있고,
 * 이 값이 0이면 "받침 없음", 0이 아니면 "받침 있음"이다.
 *
 * @param {string} word - 조사를 붙일 대상 단어 (예: 도시 이름)
 * @returns {boolean} 마지막 글자에 받침이 있으면 true
 */
function hasFinalConsonant(word) {
  if (!word) return false

  const lastChar = word[word.length - 1]
  const code = lastChar.charCodeAt(0)

  // 완성형 한글(가~힣) 범위를 벗어나면(영어/숫자/자모 단독 등)
  // 받침을 계산할 수 없으므로 일단 false로 처리한다.
  const isCompleteHangul = code >= 0xac00 && code <= 0xd7a3
  if (!isCompleteHangul) return false

  return (code - 0xac00) % 28 !== 0
}

/**
 * 받침 유무에 따라 "이" 또는 "가" 조사를 반환한다.
 * 사용 예: `${city.name}${getSubjectParticle(city.name)} 선택되었습니다.`
 *   -> 서울이 선택되었습니다.  (받침 있음: 울 -> 이)
 *   -> 대구가 선택되었습니다.  (받침 없음: 구 -> 가)
 *
 * @param {string} word
 * @returns {'이' | '가'}
 */
export function getSubjectParticle(word) {
  return hasFinalConsonant(word) ? '이' : '가'
}

/**
 * 받침 유무에 따라 "을" 또는 "를" 조사를 반환한다. (필요 시 확장해서 사용)
 * @param {string} word
 * @returns {'을' | '를'}
 */
export function getObjectParticle(word) {
  return hasFinalConsonant(word) ? '을' : '를'
}
