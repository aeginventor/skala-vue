import axios from 'axios'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'

export async function fetchCurrentWeather(apiQuery) {
  const response = await axios.get(BASE_URL, {
    params: {
      q: apiQuery,
      appid: API_KEY,
      units: 'metric',
      lang: 'kr',
    },
  })
  return response.data
}

export function mapWeatherResponse(apiData, baseCity) {
  return {
    ...baseCity,
    temp: Math.round(apiData.main.temp),
    status: apiData.weather?.[0]?.description ?? baseCity.status,
    humidity: apiData.main.humidity,
    windSpeed: apiData.wind.speed,
  }
}
