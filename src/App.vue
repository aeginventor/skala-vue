<script setup></script>

<template>
  <div class="page">
    <header class="page-header">
      <span class="page-header__badge"></span>
      <h1>과제 3: 라우터적용</h1>
      <nav class="nav-bar">
        <RouterLink to="/" class="nav-link">날씨 대시보드</RouterLink>
        <span class="nav-divider">|</span>
        <RouterLink to="/about" class="nav-link">서비스 소개</RouterLink>
      </nav>
    </header>

    <main class="page-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: #eef2f9;
  padding: 32px 16px;
  font-family: 'Pretendard', 'Apple SD Gothic Neo', sans-serif;
  color: #1f2937;
}

.page-header {
  max-width: 520px;
  margin: 0 auto 20px;
}

.page-header__badge {
  font-size: 12px;
  color: #6b7280;
}

.page-header h1 {
  font-size: 22px;
  margin: 4px 0 16px;
}

.nav-bar {
  background: #fff;
  border-radius: 10px;
  padding: 10px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.06);
}

.nav-link {
  color: #6b7280;
  text-decoration: none;
  font-size: 14px;
  padding: 4px 6px;
}

.nav-divider {
  color: #e5e7eb;
}

.nav-link.router-link-exact-active {
  color: #2563eb;
  font-weight: 600;
  border-bottom: 2px solid #2563eb;
}

.page-main {
  padding-top: 16px;
}
</style>
