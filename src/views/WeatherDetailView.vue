<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { findCityById } from '../data/weatherMockData.js'
import { useConfigStore } from '../stores/configStore.js'

const route = useRoute()
const cityDetail = ref(null)
const configStore = useConfigStore()

onMounted(() => {
  cityDetail.value = findCityById(route.params.cityId)
})

const displayTemp = computed(() => {
  const rawTemp = cityDetail.value?.temp
  if (rawTemp === undefined) return null
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return rawTemp
})
</script>

<template>
  <div class="detail">
    <div v-if="cityDetail" class="detail-card">
      <h2>📊 지역별 상세 기상 관측 정보</h2>
      <dl class="detail-list">
        <div class="detail-row">
          <dt>📍 지정 지역</dt>
          <dd>{{ cityDetail.region }}</dd>
        </div>
        <div class="detail-row">
          <dt>실시간 기온</dt>
          <dd>{{ displayTemp }}{{ configStore.unitSymbol }}</dd>
        </div>
        <div class="detail-row">
          <dt>기상 현황</dt>
          <dd>{{ cityDetail.status }}</dd>
        </div>
        <div class="detail-row">
          <dt>대기 습도</dt>
          <dd>{{ cityDetail.humidity }}%</dd>
        </div>
        <div class="detail-row">
          <dt>현재 풍속</dt>
          <dd>{{ cityDetail.windSpeed }}m/s</dd>
        </div>
      </dl>
      <RouterLink to="/" class="back-btn">← 메인 대시보드로 돌아가기</RouterLink>
    </div>

    <!-- /weather/존재하지않는id 처럼, 라우트 패턴은 맞지만 실제 도시가 없는 경우 -->
    <div v-else class="detail-card detail-card--empty">
      <p>해당 도시 코드({{ route.params.cityId }})를 찾을 수 없습니다.</p>
      <RouterLink to="/" class="back-btn">← 메인 대시보드로 돌아가기</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.detail {
  max-width: 520px;
  margin: 0 auto;
}

.detail-card {
  background: #fff;
  border-radius: 12px;
  padding: 18px 20px;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.06);
}

.detail-card h2 {
  font-size: 15px;
  margin: 0 0 14px;
}

.detail-list {
  margin: 0 0 18px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f1f5f9;
  font-size: 14px;
}

.detail-row dt {
  color: #6b7280;
}

.detail-row dd {
  margin: 0;
  font-weight: 600;
}

.detail-card--empty {
  text-align: center;
  color: #6b7280;
  font-size: 14px;
}

.back-btn {
  display: inline-block;
  background: #1f2937;
  color: #fff;
  text-decoration: none;
  font-size: 13px;
  padding: 10px 16px;
  border-radius: 8px;
}
</style>
