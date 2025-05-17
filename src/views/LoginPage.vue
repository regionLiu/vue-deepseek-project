<template>
  <div class="login-root">
    <!-- 顶部横向居中 logo和副标题，渐显动画 -->
    <transition name="fadein">
      <div class="logo-bar" v-if="show">
        <div class="font-logo">Anycreator</div>
        <div class="logo-title"><h1 style="font-family: '阿里妈妈刀隶体 Regular', sans-serif;">——一个私人服务的全能型AI助理</h1></div>
      </div>
    </transition>
    <!-- 中间头像选择与表单动画区域，渐显动画 -->
    <transition name="fadein" appear>
      <div class="center-panel" v-if="show">
        <RightPanel />
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import RightPanel from './login_subcomponent/RightPanel.vue'
// 控制渐显动画的显示
const show = ref(false)
onMounted(() => {
  setTimeout(() => { show.value = true }, 80) // 页面加载后渐显
})
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
  height: auto;
  min-height: 120px;
  margin-top: 4vh;
  margin-bottom: 0;
  z-index: 10;
  background-color: #fbfbfb;
}
.font-logo {
  font-family: '阿里妈妈刀隶体 Regular', sans-serif;
  font-size: clamp(2.5rem, 7vw, 4rem); /* 响应式字体 */
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
  font-size: clamp(1rem, 3vw, 2rem); /* 响应式字体 */
  color: #000000;
  font-weight: 600;
  margin-top: 0;
  letter-spacing: 2px;
  margin-left: 0;
  text-shadow: 0px 0px 4px #79df9fde;
}
.center-panel {
  width: 100vw;
  min-height: 300px;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  flex-wrap: wrap;
  padding-bottom: 4vh;
  margin-top: 20vh;
}
.page-logo { display: none; }
/* 渐显动画 */
.fadein-enter-active, .fadein-leave-active {
  transition: opacity 0.7s cubic-bezier(.4,0,.2,1);
}
.fadein-enter-from, .fadein-leave-to {
  opacity: 0;
}
@media (max-width: 900px) {
  .center-panel {
    flex-direction: column;
    padding-bottom: 2vh;
  }
  .logo-bar {
    min-height: 80px;
    margin-top: 2vh;
  }
}
@media (max-width: 600px) {
  .font-logo {
    font-size: 2rem;
  }
  .logo-title h1 {
    font-size: 1rem;
  }
  .center-panel {
    min-height: 180px;
    padding-bottom: 1vh;
  }
}
</style> 