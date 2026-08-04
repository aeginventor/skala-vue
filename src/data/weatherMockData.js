export const weatherMockData = [
  {
    id: 'city_01',
    name: '서울',
    region: '대한민국 서울특별시',
    temp: 28,
    status: '맑음',
    humidity: 55,
    windSpeed: 2.5,
  },
  {
    id: 'city_02',
    name: '수원',
    region: '대한민국 경기도 수원시',
    temp: 24,
    status: '비',
    humidity: 78,
    windSpeed: 3.2,
  },
  {
    id: 'city_03',
    name: '부산',
    region: '대한민국 부산광역시',
    temp: 26,
    status: '구름',
    humidity: 62,
    windSpeed: 4.1,
  },
  {
    id: 'city_04',
    name: '제주',
    region: '대한민국 제주특별자치도',
    temp: 22,
    status: '맑음',
    humidity: 68,
    windSpeed: 5.4,
  },
]
export function findCityById(cityId) {
  return weatherMockData.find((city) => city.id === cityId)
}
