/**
 * 전국 30개 지역 Mock 데이터.
 * - 도시가 30개로 늘면서 OpenWeatherMap을 영문 도시명(q=Seoul,KR)으로 조회하던 방식은
 *   포기했다. 국내 중소도시는 영문 표기 매칭이 불안정하고(중복 지명, 표기 차이 등),
 *   위경도(lat/lon) 조회가 훨씬 정확하다. 그래서 apiQuery 필드를 lat/lon 좌표로 교체했다.
 * - region: Dock/상세페이지에 노출되는 "행정구역 전체 이름"
 */
export const weatherMockData = [
  { id: 'city_01', name: '서울', region: '서울특별시', lat: 37.5665, lon: 126.978, temp: 28, status: '맑음', humidity: 55, windSpeed: 2.5 },
  { id: 'city_02', name: '부산', region: '부산광역시', lat: 35.1796, lon: 129.0756, temp: 26, status: '구름', humidity: 62, windSpeed: 4.1 },
  { id: 'city_03', name: '대구', region: '대구광역시', lat: 35.8714, lon: 128.6014, temp: 29, status: '맑음', humidity: 48, windSpeed: 1.8 },
  { id: 'city_04', name: '인천', region: '인천광역시', lat: 37.4563, lon: 126.7052, temp: 27, status: '흐림', humidity: 58, windSpeed: 3.4 },
  { id: 'city_05', name: '광주', region: '광주광역시', lat: 35.1595, lon: 126.8526, temp: 28, status: '맑음', humidity: 52, windSpeed: 2.0 },
  { id: 'city_06', name: '대전', region: '대전광역시', lat: 36.3504, lon: 127.3845, temp: 27, status: '구름', humidity: 54, windSpeed: 2.2 },
  { id: 'city_07', name: '울산', region: '울산광역시', lat: 35.5384, lon: 129.3114, temp: 26, status: '맑음', humidity: 60, windSpeed: 3.6 },
  { id: 'city_08', name: '세종', region: '세종특별자치시', lat: 36.48, lon: 127.289, temp: 27, status: '맑음', humidity: 53, windSpeed: 1.9 },
  { id: 'city_09', name: '수원', region: '경기도 수원시', lat: 37.2636, lon: 127.0286, temp: 24, status: '비', humidity: 78, windSpeed: 3.2 },
  { id: 'city_10', name: '고양', region: '경기도 고양시', lat: 37.6584, lon: 126.832, temp: 25, status: '흐림', humidity: 65, windSpeed: 2.8 },
  { id: 'city_11', name: '용인', region: '경기도 용인시', lat: 37.2411, lon: 127.1776, temp: 25, status: '구름', humidity: 61, windSpeed: 2.1 },
  { id: 'city_12', name: '파주', region: '경기도 파주시', lat: 37.7599, lon: 126.78, temp: 23, status: '비', humidity: 80, windSpeed: 3.9 },
  { id: 'city_13', name: '김포', region: '경기도 김포시', lat: 37.6152, lon: 126.7156, temp: 24, status: '흐림', humidity: 70, windSpeed: 3.1 },
  { id: 'city_14', name: '평택', region: '경기도 평택시', lat: 36.9921, lon: 127.1129, temp: 25, status: '맑음', humidity: 57, windSpeed: 2.4 },
  { id: 'city_15', name: '안산', region: '경기도 안산시', lat: 37.3219, lon: 126.8309, temp: 24, status: '구름', humidity: 66, windSpeed: 3.0 },
  { id: 'city_16', name: '춘천', region: '강원특별자치도 춘천시', lat: 37.8813, lon: 127.7298, temp: 22, status: '맑음', humidity: 50, windSpeed: 1.6 },
  { id: 'city_17', name: '강릉', region: '강원특별자치도 강릉시', lat: 37.7519, lon: 128.8761, temp: 25, status: '맑음', humidity: 68, windSpeed: 4.5 },
  { id: 'city_18', name: '청주', region: '충청북도 청주시', lat: 36.6424, lon: 127.489, temp: 27, status: '구름', humidity: 56, windSpeed: 2.0 },
  { id: 'city_19', name: '천안', region: '충청남도 천안시', lat: 36.8151, lon: 127.1139, temp: 26, status: '맑음', humidity: 55, windSpeed: 2.3 },
  { id: 'city_20', name: '전주', region: '전북특별자치도 전주시', lat: 35.8242, lon: 127.148, temp: 28, status: '맑음', humidity: 51, windSpeed: 1.7 },
  { id: 'city_21', name: '목포', region: '전라남도 목포시', lat: 34.8118, lon: 126.3922, temp: 27, status: '흐림', humidity: 72, windSpeed: 5.2 },
  { id: 'city_22', name: '여수', region: '전라남도 여수시', lat: 34.7604, lon: 127.6622, temp: 27, status: '맑음', humidity: 69, windSpeed: 4.0 },
  { id: 'city_23', name: '순천', region: '전라남도 순천시', lat: 34.9506, lon: 127.4872, temp: 27, status: '구름', humidity: 63, windSpeed: 2.6 },
  { id: 'city_24', name: '창원', region: '경상남도 창원시', lat: 35.228, lon: 128.6811, temp: 29, status: '맑음', humidity: 58, windSpeed: 2.9 },
  { id: 'city_25', name: '진주', region: '경상남도 진주시', lat: 35.18, lon: 128.1076, temp: 28, status: '맑음', humidity: 54, windSpeed: 1.8 },
  { id: 'city_26', name: '포항', region: '경상북도 포항시', lat: 36.019, lon: 129.3435, temp: 26, status: '구름', humidity: 64, windSpeed: 4.3 },
  { id: 'city_27', name: '경주', region: '경상북도 경주시', lat: 35.8562, lon: 129.2247, temp: 27, status: '맑음', humidity: 52, windSpeed: 2.1 },
  { id: 'city_28', name: '안동', region: '경상북도 안동시', lat: 36.5684, lon: 128.7294, temp: 25, status: '흐림', humidity: 59, windSpeed: 1.9 },
  { id: 'city_29', name: '제주', region: '제주특별자치도 제주시', lat: 33.4996, lon: 126.5312, temp: 30, status: '맑음', humidity: 71, windSpeed: 5.4 },
  { id: 'city_30', name: '서귀포', region: '제주특별자치도 서귀포시', lat: 33.2541, lon: 126.5601, temp: 29, status: '구름', humidity: 74, windSpeed: 6.1 }
]

/** cityId 로 도시 하나를 찾아 반환한다. 없으면 undefined. */
export function findCityById(cityId) {
  return weatherMockData.find((city) => city.id === cityId)
}
