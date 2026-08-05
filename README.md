# 날씨 Dock

전국 30개 지역의 날씨를 한 화면에서 훑어보는 대시보드. Vue 3 + Vite로 만들었고, OpenWeatherMap 실시간 데이터를 붙여 GitHub Pages에 배포되어 있다.

## 실행

Node `^22.18.0` 또는 `>=24.12.0` 필요 (`package.json`의 `engines` 참고).

```sh
npm install
npm run dev      # 개발 서버
npm run build    # 프로덕션 빌드 (dist/)
npm run preview  # 빌드 결과 미리보기
npm run lint     # oxlint + eslint
npm run format   # prettier
```

실시간 날씨를 받으려면 프로젝트 루트에 `.env` 파일을 만들고 OpenWeatherMap API 키를 넣는다.

```
VITE_OPENWEATHER_API_KEY=발급받은_키
```

키가 없거나 API 호출이 실패해도 앱은 죽지 않는다. `src/data/weatherMockData.js`의 Mock 데이터로 대체되고, 화면에 경고 배너만 뜬다.

## 기술 스택

- Vue 3 (`<script setup>`), Vite
- Vue Router — `createWebHashHistory` 사용. GitHub Pages는 정적 호스팅이라 새로고침/직접 접속 시 서버가 딥링크 경로를 못 받는데, 해시(#) 뒤쪽은 서버로 안 넘어가고 브라우저에서만 처리되므로 이 문제가 없다.
- Pinia — 도시 목록(`weatherStore`)과 온도 단위(`configStore`)를 전역 상태로 관리
- Axios — OpenWeatherMap 호출

## 구조

```
src/
  api/weatherApi.js        OpenWeatherMap 호출 + 응답 매핑
  data/weatherMockData.js  전국 30개 지역 초기/폴백 데이터
  stores/                  weatherStore(도시 목록), configStore(온도 단위)
  utils/                   날씨 상태 -> 아이콘/색 매핑, 조사(이/가) 처리, 시간 포맷
  components/              CityDock, WeatherCard, SelectedCityPanel, WeatherAnimation 등
  views/                   WeatherHomeView, WeatherDetailView, WeatherAboutView, NotFoundView
  router/                  라우트 정의
```

도시 목록은 `App.vue` 하위의 Dock과 `WeatherHomeView`가 형제 컴포넌트라 로컬 상태로는 서로의 데이터를 볼 수 없다. 그래서 Pinia의 `weatherStore`가 목록을 들고 있고, 어느 화면에서 갱신하든 나머지 화면이 항상 같은 최신 데이터를 보게 했다.

## 화면

- `/` — 검색, 정렬(이름/기온/날씨별), 즐겨찾기, 카드 그리드
- `/weather/:cityId` — 도시 상세 (체감온도·습도·기압·풍속 등 + 12시간 예보 + 날씨 애니메이션)
- `/about` — 서비스 소개
- 그 외 경로는 404

즐겨찾기는 `localStorage`에 저장되어 새로고침해도 유지된다. 즐겨찾기 도시는 정렬 기준과 무관하게 항상 목록 맨 앞에 온다.

## 데이터

OpenWeatherMap을 도시명이 아니라 위경도(lat/lon)로 조회한다. 지역이 30개(중소도시 포함)라 영문 도시명 쿼리는 동명 지역·표기 차이로 매칭이 불안정한데, 좌표는 지구상 한 지점만 가리켜서 안정적이다.

날씨 설명 문자열(`맑음`, `튼구름`, `약한 비` 등)은 `src/utils/weatherIcon.js`의 키워드 규칙 하나로 아이콘·색·정렬 카테고리를 한 번에 정한다. 아이콘과 정렬 기준을 따로 관리하면 둘이 어긋날 수 있어서, 규칙 테이블 하나만 두고 여기서 다 뽑아 쓴다.

## 디자인

- 색상, 반경, 테두리, 그림자는 전부 `src/assets/main.css`의 CSS 변수(디자인 토큰)로 정의한다. 날씨 상태별 색(맑음=노랑, 비=파랑, 흐림=회청, 눈=하늘, 뇌우=보라)도 여기 정의된 변수를 그대로 참조한다.
- 스타일 컨셉은 "카툰/스티커" — 두꺼운 잉크색 테두리(`--border-thick`, `--border-thin`)와 blur 없는 하드 섀도우(`--shadow-hard`, offset만 있고 번짐 없음)로 스티커를 붙여놓은 듯한 느낌을 낸다. 버튼을 누르면 그림자를 줄이고 살짝 이동시켜 눌리는 촉감을 흉내낸다.
- 폰트: 본문은 Pretendard(브라우저/OS에 이미 설치돼 있을 때만 적용되고, 별도로 로드하지는 않아 없으면 시스템 고딕체로 대체됨), 헤딩류는 Fredoka(Google Fonts CDN)를 우선 적용한다.
- 아이콘은 이미지 파일 대신 Font Awesome(Free) 아이콘 폰트를 CDN으로 불러와 쓴다. 상세 페이지의 날씨 애니메이션(해/구름/비/눈/뇌우)도 이미지가 아니라 CSS 애니메이션과 Font Awesome 아이콘 조합으로 직접 그린다.
- 커스텀 커서: 기본은 8방향 살이 있는 해 모양, 클릭 가능한 요소 위에서는 과녁 모양(굵은 링 + 흰 중심점)으로 바뀐다. 둘 다 data URI SVG라 별도 이미지 파일이 없다.

## 배포

`main` 브랜치에 푸시되면 GitHub Actions(`.github/workflows/deploy.yml`)가 빌드해서 GitHub Pages에 올린다. 저장소 Secrets에 `VITE_OPENWEATHER_API_KEY`를 등록해두면 배포된 사이트에서도 실시간 데이터가 뜨고, 등록하지 않아도 Mock 데이터로 정상 동작한다. GitHub Pages는 저장소 이름 하위 경로(`/skala-vue/`)에서 서비스되므로 `vite.config.js`의 `base`를 그에 맞춰뒀다.

## 배경

Vue 3 학습 과정에서 시작한 프로젝트로, 커리큘럼 진행에 따라 단계적으로 확장됐다.

1. `v-for`/`v-if`, 양방향 바인딩, 이벤트 수식어로 만든 정적 목업
2. `computed`/`watch`/`watchEffect` 도입, 컴포넌트 분리
3. Vue Router, Pinia, Axios(OpenWeatherMap 연동) 도입

이후 지역을 30개로 늘리고 카툰 스타일로 디자인을 전면 개편, Dock 내비게이션·즐겨찾기·정렬·검색·GitHub Pages 배포 등을 요구사항 범위 밖에서 추가로 붙여나갔다.
