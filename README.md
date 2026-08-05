# 날씨 Dock

전국 30개 지역의 날씨를 한 화면에서 훑어보는 대시보드. Vue 3 + Vite로 만들고 OpenWeatherMap 실시간 데이터를 붙였다.

**배포:** https://aeginventor.github.io/skala-vue/

## 실행 방법

Node `^22.18.0` 또는 `>=24.12.0` 필요.

```sh
npm install
npm run dev      # 개발 서버
npm run build    # 프로덕션 빌드 (dist/)
npm run preview  # 빌드 결과 미리보기
```

실시간 날씨를 받으려면 루트에 `.env`를 만들고 키를 넣는다.

```
VITE_OPENWEATHER_API_KEY=발급받은_키
```

**키가 없어도 앱은 그대로 돈다.** 호출이 실패하면 예시 데이터로 대체하고 배너로 알리므로, 키 없이도 모든 화면을 볼 수 있다.

## 구현한 기능

| 요구사항 | 구현 | 위치 |
|---|---|---|
| 컴포넌트 분리 + props/emit | 부모가 데이터를 내리고 자식은 이벤트만 올린다 | `views/WeatherHomeView.vue`, `components/BaseDashboardCard.vue`, `SearchBar.vue`, `WeatherCard.vue` |
| Vue Router | 목록 `/`, 상세 `/weather/:cityId`, 소개 `/about`, 나머지 404 | `router/index.js` |
| Pinia 전역 상태 | 즐겨찾기, 도시 목록과 로딩, 표시 설정을 성격별로 분리 | `stores/favoriteStore.js`, `weatherStore.js`, `configStore.js` |
| Axios 실데이터 | 위경도로 현재 날씨 + 3시간 간격 예보 조회 | `api/weatherApi.js` |
| 로딩과 에러 처리 | 스켈레톤을 먼저 띄우고, 실패하면 배너와 함께 예시 데이터로 대체 | `stores/weatherStore.js` |
| Vite 빌드와 배포 | `base: '/skala-vue/'` + 해시 라우팅, main 푸시 시 자동 배포 | `vite.config.js`, `.github/workflows/deploy.yml` |
| UI 라이브러리 | Element Plus의 `el-select`를 정렬 선택에 적용 | `views/WeatherHomeView.vue` |

Element Plus는 정렬 드롭다운 한 곳에만 썼다. 화면 전체가 두꺼운 잉크 테두리와 직접 그린 아이콘으로 이미 한 벌을 이루고 있어서, 라이브러리를 넓게 깔면 기본 스타일을 걷어내는 CSS가 더 늘어난다. 그래서 기본 `select`로는 손대기 어려운 드롭다운 목록만 `el-select`로 바꾸고, 테두리와 색은 `:deep()`으로 나머지 화면에 맞췄다. 전체 CSS 대신 쓰는 컴포넌트의 CSS만 골라 불러온다. 반복되는 껍데기는 `BaseDashboardCard`로, 눌리는 감각은 `.ink-pressable` 한 클래스로 묶었다.

### 요구 사항 외 구현 기능

- 지역 단위 검색. "경기"로 검색하면 그 지역 도시가 한 번에 나온다
- 즐겨찾기(localStorage 유지)와 이름순, 기온순, 날씨별 정렬. 날씨별은 대분류로 묶은 뒤 같은 날씨끼리 다시 붙여서, "튼구름"과 "흐림"이 섞이지 않는다
- 카드를 고르면 하단 바에 "서울을 선택하셨습니다"처럼 받침에 맞춘 조사로 안내한다
- 상단 Dock에서 30개 지역 바로가기. 마우스로 끌어도 가로 스크롤이 된다
- 전국 기온 판에서 6개씩 다섯 장을 자동으로 넘긴다(마우스를 올리면 멈춤)
- 섭씨/화씨 전환, 기온 5단계 분류
- 실시간과 예시 데이터 전환. 눈이나 뇌우처럼 계절을 타는 날씨는 실제 API로 확인할 수 없어서, 구현해 둔 표현을 전부 담은 예시 데이터로 바꿔볼 수 있게 했다
- 날씨 아이콘과 애니메이션을 아이콘 세트 없이 직접 그린 SVG로 구현

## 4일간 어려웠던 점과 해결 과정

**1일차. 조사(이/가)가 어색했다.** 문자열에 "이"를 박아 넣어 "대구이 선택되었습니다"가 됐다. 완성형 한글이 `0xAC00 + (초성×21 + 중성)×28 + 종성` 순으로 배열된다는 점을 이용해, `(코드 - 0xAC00) % 28`로 받침 유무를 계산하도록 바꿨다(`utils/josa.js`). 카드를 고르면 하단 바에 뜨는 안내 문구와 요약 문장이 이 함수를 쓴다.

**2일차. App.vue 하나가 계속 커졌다.** 상태와 표현, 이벤트가 한 파일에 섞여서 `BaseDashboardCard`(껍데기) / `SearchBar`(입력) / `WeatherCard`(도시 하나)로 쪼갰다. "부모가 데이터를 내리고 자식은 이벤트만 올린다"는 방향을 정해두니 이후 기능이 붙어도 흐름이 헷갈리지 않았다.

**3일차. 라우터와 상태에서 세 번 막혔다.**
- 상세에서 다른 도시를 눌러도 화면이 그대로였다. 같은 라우트 레코드라 Vue Router가 컴포넌트를 재사용하는데 로딩을 `onMounted`에만 둔 게 원인이었다. `watch(route.params.cityId, ..., { immediate: true })`로 바꿔 최초 진입과 도시 전환을 함께 처리했다.
- Dock 아이콘이 실제 날씨와 달랐다. Dock과 목록이 형제라 한쪽의 로컬 상태를 다른 쪽이 볼 수 없었다. 도시 목록을 Pinia로 올려 해결했다.
- 배포 후 새로고침에서 404가 났다. GitHub Pages는 정적 호스팅이라 딥링크 경로를 모른다. 해시 라우팅으로 바꾸고 `base`를 저장소 이름에 맞췄다.

**4일차. 눈에 보이는 문제가 가장 오래 걸렸다.** Dock 양 끝 고정 버튼이 스크롤되는 카드를 각지게 잘라 먹는 문제를 세 번 되돌려가며 고쳤다. 흐림 폭을 넓히면 멈춰 있을 때 옆 카드를 가리고, 없애면 다시 각지게 잘려서, 결국 정지 상태의 여백과 같은 폭에서만 흐려지도록 맞췄다.

## 셀프 코드리뷰

- **단일 책임.** 유틸과 스토어는 역할이 뚜렷하지만 `WeatherHomeView`가 검색과 정렬, 선택을 함께 들고 있어 가장 무겁다. 즐겨찾기를 스토어로 뺀 것도 이 파일을 줄이려는 것이었고, 정렬까지 빼는 건 다음 과제로 남는다.
- **반응형 남용.** 규칙 테이블이나 SVG 경로처럼 값이 변하지 않는 것은 평범한 `const`로 뒀고, `ref`/`computed`는 실제로 바뀌는 값에만 썼다. 반대로 로딩 상태는 여러 화면이 함께 봐야 해서 스토어의 반응형 상태로 올렸다.
- **로딩과 에러 처리.** 로딩 중에는 실제 카드와 같은 배치의 스켈레톤으로 자리를 먼저 잡아 화면이 튀지 않게 했고, 실패하면 배너로 알린 뒤 예시 데이터로 이어가 빈 화면을 보여주지 않는다.
- **네이밍.** `getWeatherGlyph`, `getCloudCount`, `loadCities`처럼 동사+대상으로 맞췄고, 판정 기준이 헷갈릴 수 있는 곳은 `rawCelsius`처럼 단위를 이름에 넣었다.

## 프로젝트 구조

```
src/
  api/         OpenWeatherMap 호출 + 응답 매핑
  data/        전국 30개 지역 예시 데이터 (폴백 겸 예시 모드용)
  stores/      favoriteStore(즐겨찾기), weatherStore(도시 목록과 로딩), configStore(표시 설정)
  utils/       weatherIcon(날씨 -> 그림과 색), tempLevel(기온 5단계),
               glyphPaths(SVG 경로), josa(조사), formatTime
  components/  CityDock, WeatherCard, TempBoard, WeatherGlyph, SelectedCityPanel 등
  views/       WeatherHomeView, WeatherDetailView, WeatherAboutView, NotFoundView
  router/      라우트 정의
```

날씨 문자열(`맑음`, `튼구름` 등)은 `utils/weatherIcon.js`의 규칙 테이블 하나에서 그림과 색, 정렬 기준을 모두 뽑는다. 따로 관리하면 서로 어긋나기 때문이다. 기온 5단계도 `utils/tempLevel.js`의 임계값 테이블 하나에서 뽑고, 판정은 표시 단위와 무관하게 항상 원본 섭씨로 한다. 다섯 단계 색만은 다른 색과 달리 고정 값으로 뒀다. 나란히 붙어 있어서 서로 구분되는 게 우선이라 파랑에서 빨강까지 한 벌로 골랐다.
