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
  data/weatherMockData.js  전국 30개 지역 예시 데이터 (폴백 겸 예시 모드용)
  stores/                  weatherStore(도시 목록·로딩), configStore(온도 단위·예시 모드)
  utils/                   weatherIcon(날씨 -> 그림·색), tempLevel(기온 5단계),
                           glyphPaths(손그림 SVG 경로), josa(조사), formatTime
  components/              CityDock, WeatherCard, TempBoard, WeatherGlyph,
                           WeatherAnimation, SelectedCityPanel 등
  views/                   WeatherHomeView, WeatherDetailView, WeatherAboutView, NotFoundView
  router/                  라우트 정의
```

도시 목록은 `App.vue` 하위의 Dock과 `WeatherHomeView`가 형제 컴포넌트라 로컬 상태로는 서로의 데이터를 볼 수 없다. 그래서 Pinia의 `weatherStore`가 목록을 들고 있고, 어느 화면에서 갱신하든 나머지 화면이 항상 같은 최신 데이터를 보게 했다.

불러오기 자체도 스토어가 맡고 `App.vue`가 시작한다. 예시↔실시간 스위치가 헤더에 있어 어느 화면에서든 눌리는데, 불러오는 일이 특정 화면에만 있으면 다른 화면에서 토글했을 때 Dock과 목록이 옛 데이터를 그대로 들고 있게 된다.

## 화면

- `/` — 검색, 전국 기온 훑어보기, 정렬(이름/기온/날씨별), 즐겨찾기, 카드 그리드
- `/weather/:cityId` — 도시 상세 (체감온도·습도·기압·풍속 등 + 12시간 예보 + 날씨 애니메이션)
- `/about` — 서비스 소개 (날씨 그림·기온 단계 범례 포함)
- 그 외 경로는 404

검색은 도시 이름뿐 아니라 `region`에도 걸린다. "경기"처럼 광역 단위로 검색하면 그 지역 도시가 한 번에 나온다.

즐겨찾기는 `localStorage`에 저장되어 새로고침해도 유지된다. 즐겨찾기 도시는 정렬 기준과 무관하게 항상 목록 맨 앞에 온다.

검색창 아래 "전국 기온 훑어보기"는 30개 지역을 6개씩 다섯 장으로 나눠 자동으로 넘긴다. 읽는 중에 넘어가지 않도록 마우스를 올리면 멈추고, `prefers-reduced-motion` 설정에서는 자동 전환 없이 점으로만 넘긴다.

### 실시간 / 예시 데이터 토글

헤더의 스위치로 실시간 API와 예시 데이터를 오갈 수 있다(설정은 `localStorage`에 유지).

눈·뇌우·안개처럼 계절을 타는 날씨는 실제 API로는 확인할 방법이 없어서, 예시 데이터에는 **구현해 둔 표현이 전부 한 번씩 들어 있다** — 날씨 그림 6종, 구름 개수 3단계, 기온 5단계. 그래서 예시 데이터의 계절감은 일부러 맞추지 않았다(같은 날 눈과 폭염이 함께 나온다). 예시 모드일 때는 화면에 안내 배너가 계속 떠 있다.

## 데이터

OpenWeatherMap을 도시명이 아니라 위경도(lat/lon)로 조회한다. 지역이 30개(중소도시 포함)라 영문 도시명 쿼리는 동명 지역·표기 차이로 매칭이 불안정한데, 좌표는 지구상 한 지점만 가리켜서 안정적이다.

날씨 설명 문자열(`맑음`, `튼구름`, `약한 비` 등)은 `src/utils/weatherIcon.js`의 키워드 규칙 하나로 그림·색·아이콘 위 글자색·정렬 카테고리를 한 번에 정한다. 이것들을 따로 관리하면 서로 어긋나므로 규칙 테이블 하나만 두고 여기서 다 뽑아 쓴다. 기온 5단계(추움·쌀쌀·선선·따뜻·더움)도 같은 방식으로 `src/utils/tempLevel.js`의 임계값 테이블 하나에서 라벨·색·아이콘을 뽑는다.

기온 단계 판정은 화면 표시 단위와 무관하게 **항상 원본 섭씨**로 한다. 화씨로 보는 중이라고 화씨 값으로 판정하면 단계가 통째로 어긋난다(77°F는 25℃라 "따뜻"인데 77을 그대로 넣으면 "더움"이 된다).

## 디자인

- 색상, 반경, 테두리, 그림자는 전부 `src/assets/main.css`의 CSS 변수(디자인 토큰)로 정의한다. 색은 OKLCH로 적어서, 같은 무리에 속한 색끼리 명도·채도를 맞추고 색상만 돌릴 수 있게 했다.
- 스타일 컨셉은 "카툰/스티커" — 두꺼운 잉크색 테두리(`--border-thick`, `--border-thin`)와 blur 없는 하드 섀도우(`--shadow-hard`, offset만 있고 번짐 없음)로 스티커를 붙여놓은 듯한 느낌을 낸다. 버튼을 누르면 그림자를 줄이고 살짝 이동시켜 눌리는 촉감을 흉내낸다.
- **색은 적게 쓰되 진하게.** 예전에는 카드 전체를 날씨색으로 옅게 물들였는데, 큰 면을 연하게 칠하는 파스텔은 두꺼운 잉크 테두리와 겉돌았다. 지금은 카드를 전부 종이색으로 두고 색은 아이콘 원 하나에만 진하게 넣는다. 원이 밝으면(해·눈) 잉크색 글자를, 어두우면(비·구름·뇌우) 종이색 글자를 얹는데 이 짝(`onAccent`)도 색과 같은 규칙 테이블에서 함께 정한다.
- 날씨 아이콘 6종(해·구름·안개·비·눈·뇌우)은 아이콘 세트를 쓰지 않고 직접 그린 SVG다(`src/utils/glyphPaths.js`). 아이콘 폰트는 획과 곡률이 완벽히 균일해서 손그림 톤과 겉돈다. 원을 살짝 찌그러뜨리고 구름 혹의 크기를 다르게 하는 식으로 흔들림을 넣었다. 구분선도 CSS 점선 대신 물결 SVG를 쓴다.
- 구름은 구름 양(`cloudsPercent`)에 따라 1~3개로 그리되 **개수가 늘수록 하나를 작게** 그린다. 같은 크기로 여러 개를 넣으면 작은 크기에서 서로 뭉개진다. 구름 양을 모르는 자리(Dock 17px, 예보 16px)는 한 개로 둔다.
- 작은 기능 아이콘(별·물방울·바람·화살표 등)은 Font Awesome(Free)을 CDN으로 쓴다. 사소한 UI 아이콘까지 손그림이면 오히려 산만해진다.
- 폰트: Pretendard를 CDN으로 불러와 본문·헤딩에 함께 쓰고, 헤딩은 굵기(800)와 자간으로 구분한다.
- 커스텀 커서: 기본은 8방향 살이 있는 해 모양, 클릭 가능한 요소 위에서는 과녁 모양(굵은 링 + 흰 중심점)으로 바뀐다. 둘 다 data URI SVG라 별도 이미지 파일이 없다.
- 반응형은 미디어 쿼리를 거의 쓰지 않는다. 카드 그리드와 기온 판은 `auto-fit` + `minmax`로, 툴바·헤더는 `flex-wrap`으로, Dock은 가로 스크롤로 폭에 맞춰 흐른다.

## 배포

`main` 브랜치에 푸시되면 GitHub Actions(`.github/workflows/deploy.yml`)가 빌드해서 GitHub Pages에 올린다. 저장소 Secrets에 `VITE_OPENWEATHER_API_KEY`를 등록해두면 배포된 사이트에서도 실시간 데이터가 뜨고, 등록하지 않아도 예시 데이터로 정상 동작한다. GitHub Pages는 저장소 이름 하위 경로(`/skala-vue/`)에서 서비스되므로 `vite.config.js`의 `base`를 그에 맞춰뒀다.

## 배경

Vue 3 학습 과정에서 시작한 프로젝트로, 커리큘럼 진행에 따라 단계적으로 확장됐다.

1. `v-for`/`v-if`, 양방향 바인딩, 이벤트 수식어로 만든 정적 목업
2. `computed`/`watch`/`watchEffect` 도입, 컴포넌트 분리
3. Vue Router, Pinia, Axios(OpenWeatherMap 연동) 도입

이후 지역을 30개로 늘리고 카툰 스타일로 디자인을 전면 개편, Dock 내비게이션·즐겨찾기·정렬·검색·GitHub Pages 배포 등을 요구사항 범위 밖에서 추가로 붙여나갔다. 날씨 아이콘을 직접 그리고, 파스텔 대신 종이+진한 잉크로 색을 다시 잡고, 기온을 5단계로 나누고, 예시 데이터 토글을 넣은 것도 그 연장선이다.

코드 쪽에서는 구조분해·전개·옵셔널 체이닝 같은 최신 문법을 실제로 코드가 좋아지는 자리에만 쓰려고 했다. 예를 들어 API 응답 매핑은 `apiData.`를 열세 번 반복하는 대신 `main`/`wind`/`sys` 덩어리로 분해했고, Vue 3.5부터 정식 지원되는 반응형 props 구조분해도 스크립트에서 props를 실제로 읽는 컴포넌트에만 적용했다.
