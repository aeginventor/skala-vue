import axios from 'axios'

/**
 * Vite에서는 .env 파일에 VITE_ 접두사가 붙은 변수만 클라이언트 코드에 노출된다.
 * 프로젝트 루트에 .env 파일을 만들고 아래처럼 본인 키를 넣어야 실제 데이터가 뜬다.
 *   VITE_OPENWEATHER_API_KEY=발급받은_키
 */
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const CURRENT_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather'
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast'

/**
 * [현재 날씨 API] OpenWeatherMap 현재 날씨 조회
 * - 지역이 30개(중소도시 포함)로 늘면서 영문 도시명 쿼리(q=) 대신 위경도(lat/lon)로 바꿨다.
 *   중소도시는 영문 표기가 여러 개거나 동명 지역이 있어서 q= 매칭이 불안정한데,
 *   좌표는 지구상에 딱 한 지점만 가리켜서 훨씬 안정적이다.
 */
export async function fetchCurrentWeather(lat, lon) {
  const response = await axios.get(CURRENT_WEATHER_URL, {
    params: {
      lat,
      lon,
      appid: API_KEY,
      units: 'metric', // 섭씨로 바로 받는다 (앱 내부 규칙: 원본은 항상 섭씨로 저장)
      lang: 'kr' // 날씨 설명을 "맑음", "튼구름"처럼 한글로 받는다
    }
  })
  return response.data
}

/**
 * [예보 API] 3시간 간격 5일 예보 조회 — 현재 날씨 API와는 별도의 엔드포인트다.
 * 상세 페이지에서 "오늘 이후 흐름"을 보여주기 위해 추가로 붙였다.
 */
export async function fetchForecast(lat, lon) {
  const response = await axios.get(FORECAST_URL, {
    params: {
      lat,
      lon,
      appid: API_KEY,
      units: 'metric',
      lang: 'kr'
    }
  })
  return response.data
}

/**
 * 현재 날씨 API 응답을 우리 앱이 쓰는 "도시 객체" 형태로 변환한다.
 * - name/region/lat/lon 처럼 API가 안 주는(혹은 우리 표기와 다른) 필드는 baseCity(Mock) 값을 유지하고,
 *   실시간이어야 하는 필드만 API 값으로 덮어쓴다.
 * - 목록 화면(WeatherCard)이 안 쓰는 필드(feelsLike, pressure 등)까지 전부 담아두는 이유:
 *   상세 화면(WeatherDetailView)이 같은 변환 함수를 재사용할 수 있게 하기 위해서다.
 */
export function mapWeatherResponse(apiData, baseCity) {
  return {
    ...baseCity,
    temp: Math.round(apiData.main.temp),
    feelsLike: Math.round(apiData.main.feels_like),
    status: apiData.weather?.[0]?.description ?? baseCity.status,
    humidity: apiData.main.humidity,
    pressure: apiData.main.pressure,
    windSpeed: apiData.wind.speed,
    windDeg: apiData.wind.deg,
    windGust: apiData.wind.gust ?? null,
    cloudsPercent: apiData.clouds?.all ?? null,
    visibilityMeters: apiData.visibility ?? null,
    sunrise: apiData.sys?.sunrise ?? null,
    sunset: apiData.sys?.sunset ?? null,
    timezoneOffsetSec: apiData.timezone ?? 0
  }
}

/**
 * 예보 API 응답(3시간 간격 x 5일, 총 40개 슬롯)에서 앞으로의 4개 슬롯(12시간치)만 뽑아
 * 화면에서 바로 쓰기 좋은 형태로 가공한다.
 */
export function mapForecastResponse(forecastData) {
  const slots = forecastData?.list ?? []
  return slots.slice(0, 4).map((slot) => ({
    // "2026-08-05 15:00:00" -> "15:00" 만 잘라서 쓴다
    time: slot.dt_txt?.slice(11, 16) ?? '',
    temp: Math.round(slot.main.temp),
    status: slot.weather?.[0]?.description ?? ''
  }))
}
