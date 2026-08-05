/**
 * 전국 30개 지역 예시 데이터. API 실패 시 대체용이자, 헤더의 "예시" 토글로 보는 값이다.
 *
 * 눈·뇌우는 계절을 타서 실제 API로는 확인할 수 없으므로, **구현해 둔 표현이 전부 한 번씩
 * 나오도록** 값을 배치했다(날씨 6종 · 구름 1~3개 · 기온 5단계). 그래서 계절감은 일부러
 * 맞추지 않았다 — 같은 날 눈과 폭염이 함께 나온다.
 *
 * 조회는 도시명이 아니라 위경도로 한다. 국내 중소도시는 영문 표기가 겹쳐 매칭이 불안정하다.
 */

/** 도시마다 달라 보여야 하는 값만 적는다. 나머지 상세 필드는 아래 withDetail이 채운다. */
const BASE_CITIES = [
  { id: 'city_01', name: '서울', region: '서울특별시', lat: 37.5665, lon: 126.978, status: '맑음', temp: 30, humidity: 45, windSpeed: 2.5, cloudsPercent: 5 },
  { id: 'city_02', name: '부산', region: '부산광역시', lat: 35.1796, lon: 129.0756, status: '구름', temp: 27, humidity: 62, windSpeed: 4.1, cloudsPercent: 45 },
  { id: 'city_03', name: '대구', region: '대구광역시', lat: 35.8714, lon: 128.6014, status: '맑음', temp: 33, humidity: 40, windSpeed: 1.8, cloudsPercent: 0 },
  { id: 'city_04', name: '인천', region: '인천광역시', lat: 37.4563, lon: 126.7052, status: '흐림', temp: 24, humidity: 68, windSpeed: 3.4, cloudsPercent: 90 },
  { id: 'city_05', name: '광주', region: '광주광역시', lat: 35.1595, lon: 126.8526, status: '소나기', temp: 26, humidity: 82, windSpeed: 3.3, cloudsPercent: 80 },
  { id: 'city_06', name: '대전', region: '대전광역시', lat: 36.3504, lon: 127.3845, status: '뇌우', temp: 29, humidity: 84, windSpeed: 6.2, cloudsPercent: 95 },
  { id: 'city_07', name: '울산', region: '울산광역시', lat: 35.5384, lon: 129.3114, status: '튼구름', temp: 25, humidity: 60, windSpeed: 3.6, cloudsPercent: 60 },
  { id: 'city_08', name: '세종', region: '세종특별자치시', lat: 36.48, lon: 127.289, status: '맑음', temp: 28, humidity: 48, windSpeed: 1.9, cloudsPercent: 10 },
  { id: 'city_09', name: '수원', region: '경기도 수원시', lat: 37.2636, lon: 127.0286, status: '비', temp: 21, humidity: 88, windSpeed: 3.2, cloudsPercent: 88 },
  { id: 'city_10', name: '고양', region: '경기도 고양시', lat: 37.6584, lon: 126.832, status: '흐림', temp: 19, humidity: 72, windSpeed: 2.8, cloudsPercent: 95 },
  { id: 'city_11', name: '용인', region: '경기도 용인시', lat: 37.2411, lon: 127.1776, status: '구름조금', temp: 18, humidity: 55, windSpeed: 2.1, cloudsPercent: 30 },
  { id: 'city_12', name: '파주', region: '경기도 파주시', lat: 37.7599, lon: 126.78, status: '안개', temp: 15, humidity: 93, windSpeed: 1.1, cloudsPercent: 70 },
  { id: 'city_13', name: '김포', region: '경기도 김포시', lat: 37.6152, lon: 126.7156, status: '연무', temp: 16, humidity: 85, windSpeed: 1.6, cloudsPercent: 55 },
  { id: 'city_14', name: '평택', region: '경기도 평택시', lat: 36.9921, lon: 127.1129, status: '이슬비', temp: 17, humidity: 86, windSpeed: 2.4, cloudsPercent: 85 },
  { id: 'city_15', name: '안산', region: '경기도 안산시', lat: 37.3219, lon: 126.8309, status: '튼구름', temp: 20, humidity: 66, windSpeed: 3.0, cloudsPercent: 50 },
  { id: 'city_16', name: '춘천', region: '강원특별자치도 춘천시', lat: 37.8813, lon: 127.7298, status: '눈', temp: 1, humidity: 80, windSpeed: 1.6, cloudsPercent: 92 },
  { id: 'city_17', name: '강릉', region: '강원특별자치도 강릉시', lat: 37.7519, lon: 128.8761, status: '소낙눈', temp: -2, humidity: 76, windSpeed: 4.5, cloudsPercent: 88 },
  { id: 'city_18', name: '청주', region: '충청북도 청주시', lat: 36.6424, lon: 127.489, status: '흐림', temp: 12, humidity: 64, windSpeed: 2.0, cloudsPercent: 78 },
  { id: 'city_19', name: '천안', region: '충청남도 천안시', lat: 36.8151, lon: 127.1139, status: '구름조금', temp: 11, humidity: 58, windSpeed: 2.3, cloudsPercent: 35 },
  { id: 'city_20', name: '전주', region: '전북특별자치도 전주시', lat: 35.8242, lon: 127.148, status: '맑음', temp: 13, humidity: 51, windSpeed: 1.7, cloudsPercent: 8 },
  { id: 'city_21', name: '목포', region: '전라남도 목포시', lat: 34.8118, lon: 126.3922, status: '비', temp: 9, humidity: 90, windSpeed: 5.2, cloudsPercent: 90 },
  { id: 'city_22', name: '여수', region: '전라남도 여수시', lat: 34.7604, lon: 127.6622, status: '맑음', temp: 22, humidity: 63, windSpeed: 4.0, cloudsPercent: 12 },
  { id: 'city_23', name: '순천', region: '전라남도 순천시', lat: 34.9506, lon: 127.4872, status: '구름많음', temp: 23, humidity: 63, windSpeed: 2.6, cloudsPercent: 65 },
  { id: 'city_24', name: '창원', region: '경상남도 창원시', lat: 35.228, lon: 128.6811, status: '맑음', temp: 31, humidity: 52, windSpeed: 2.9, cloudsPercent: 3 },
  { id: 'city_25', name: '진주', region: '경상남도 진주시', lat: 35.18, lon: 128.1076, status: '황사', temp: 20, humidity: 54, windSpeed: 3.4, cloudsPercent: 40 },
  { id: 'city_26', name: '포항', region: '경상북도 포항시', lat: 36.019, lon: 129.3435, status: '구름많음', temp: 24, humidity: 64, windSpeed: 4.3, cloudsPercent: 72 },
  { id: 'city_27', name: '경주', region: '경상북도 경주시', lat: 35.8562, lon: 129.2247, status: '맑음', temp: 26, humidity: 52, windSpeed: 2.1, cloudsPercent: 15 },
  { id: 'city_28', name: '안동', region: '경상북도 안동시', lat: 36.5684, lon: 128.7294, status: '눈', temp: 4, humidity: 74, windSpeed: 1.9, cloudsPercent: 85 },
  { id: 'city_29', name: '제주', region: '제주특별자치도 제주시', lat: 33.4996, lon: 126.5312, status: '뇌우', temp: 28, humidity: 87, windSpeed: 7.1, cloudsPercent: 98 },
  { id: 'city_30', name: '서귀포', region: '제주특별자치도 서귀포시', lat: 33.2541, lon: 126.5601, status: '흐림', temp: 30, humidity: 74, windSpeed: 6.1, cloudsPercent: 82 }
]

/** 한국 표준시(UTC+9) 오프셋. API의 timezone 필드와 같은 단위(초)다. */
const KST_OFFSET_SEC = 9 * 60 * 60

/**
 * 오늘 날짜의 특정 KST 시각을 유닉스 타임스탬프(초)로 만든다.
 * formatLocalTime()이 `(unixSeconds + timezoneOffsetSec)`를 UTC로 읽어 현지 시각을 구하므로,
 * 여기서는 반대로 오프셋을 빼둬야 화면에 의도한 시각이 찍힌다.
 */
function kstTimestamp(hour, minute) {
  const now = new Date()
  const utcMidnight = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  return Math.floor(utcMidnight / 1000) + hour * 3600 + minute * 60 - KST_OFFSET_SEC
}

/**
 * 상세 페이지에만 쓰이는 필드를 채운다. 이 값들까지 위 표에 적으면 정작 눈으로 확인해야 할
 * 값(날씨·기온·구름 양)이 파묻히고, 예시 모드에서 상세 페이지가 '-' 투성이가 된다.
 */
function withDetail(city, index) {
  const isFoggy = ['안개', '연무', '박무', '황사', '먼지'].some((word) => city.status.includes(word))

  return {
    ...city,
    // 더울수록 습도가 체감을 끌어올리고, 추울수록 바람이 끌어내린다
    feelsLike: city.temp >= 25 ? city.temp + 3 : Math.round(city.temp - city.windSpeed / 2),
    pressure: 1004 + (index % 17),
    windDeg: (index * 37) % 360,
    visibilityMeters: isFoggy ? 800 + (index % 5) * 200 : 10000,
    sunrise: kstTimestamp(5, 38 + (index % 7)),
    sunset: kstTimestamp(19, 34 - (index % 7)),
    timezoneOffsetSec: KST_OFFSET_SEC
  }
}

export const weatherMockData = BASE_CITIES.map(withDetail)

/** cityId 로 도시 하나를 찾아 반환한다. 없으면 undefined. */
export function findCityById(cityId) {
  return weatherMockData.find((city) => city.id === cityId)
}

/**
 * 예시 모드에서 상세 페이지의 "앞으로 12시간 예보"가 비지 않도록 3시간 간격 4칸을 만든다.
 * 실제 예보 API 응답을 흉내 내되(3시간 간격, 같은 도시의 날씨가 서서히 변함) 값은 단순하게 둔다.
 */
export function buildMockForecast(city) {
  const startHour = new Date().getHours()

  return Array.from({ length: 4 }, (_, i) => ({
    time: `${String((startHour + (i + 1) * 3) % 24).padStart(2, '0')}:00`,
    temp: city.temp + [0, -1, -2, -1][i],
    status: city.status
  }))
}
