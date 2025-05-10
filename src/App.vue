<template>
  <!-- 页面主容器，使用 Flexbox 居中布局 -->
  <div class="app-container">
    <!-- 这里是所有页面内容的出口，路由页面会显示在这里 -->
    <router-view />
  </div>
</template>

<script setup>
// 此处无需引入额外逻辑，App.vue 只负责布局和路由出口
</script>

<style scoped>
/* 页面主容器，使用 Flexbox 实现垂直水平居中 */
.app-container {
  min-height: 100vh; /* 视口高度 */
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center;     /* 垂直居中 */
  background: #f5f6fa;     /* 背景色参考 Figma */
}
</style> 