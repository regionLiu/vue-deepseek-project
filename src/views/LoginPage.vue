<template>
  <div class="login-root">
    <!-- 顶部横向居中 logo和副标题 -->
    <div class="logo-bar">
      <img src="/logo.png" alt="logo" class="page-logo" />
      <div class="logo-title"><h1>——一个私人服务的全能型AI助理</h1></div>
    </div>
    <!-- 中间头像选择与表单动画区域 -->
    <div class="center-panel">
      <RightPanel />
    </div>
  </div>
</template>

<script setup>
import RightPanel from './login_subcomponent/RightPanel.vue'
</script>

<style scoped>
.login-root {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #fbfbfb;
}
.logo-bar {
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 180px;
  margin-top: 40px;
  margin-bottom: 0;
  z-index: 10;
  background-color: #fbfbfb;
}
.page-logo {
  width: 500px;
  height: 120px;
  object-fit: contain;
}
.logo-title {
  margin-top: 12px;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
}
.logo-title h1 {
  font-size: 26px;
  color: #000000;
  font-weight: 600;
  margin-top: 0;
  letter-spacing: 2px;
  margin-left: 20%;
  text-shadow: 0px 0px 4px #79df9fde;
}
.center-panel {
  width: 100vw;
  height: calc(100vh - 260px);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
</style> 