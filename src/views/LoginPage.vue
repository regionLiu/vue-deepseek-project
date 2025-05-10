<template>
  <div class="login-root">
    <!-- 顶部横向居中 logo和副标题 -->
    <div class="logo-bar">
      <div class="font-logo">Anycreator</div>
      <div class="logo-title"><h1 style="font-family: '阿里妈妈刀隶体 Regular', sans-serif;">——私人服务的全能型AI助理</h1></div>
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

<style>
@font-face {
  font-family: "阿里妈妈刀隶体 Regular";
  font-weight: 400;
  src: url("//at.alicdn.com/wf/webfont/c1syphcDXAsN/ZhY8CZZAixFi.woff2") format("woff2"),
    url("//at.alicdn.com/wf/webfont/c1syphcDXAsN/MuvzcOIaUev9.woff") format("woff");
  font-display: swap;
}
</style>

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
.font-logo {
  font-family: '阿里妈妈刀隶体 Regular', sans-serif;
  font-size: 64px;
  color: #22C55E;
  font-weight: 400;
  letter-spacing: 4px;
  text-align: center;
  margin-bottom: 8px;
  text-shadow: 0 2px 12px #22C55E22, 0 0px 2px #fff;
  user-select: none;
}
.logo-title {
  font-family: '阿里妈妈刀隶体 Regular', sans-serif;
  margin-top: 12px;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
}
.logo-title h1 {
  font-size: 20px;
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
.page-logo { display: none; }
</style> 