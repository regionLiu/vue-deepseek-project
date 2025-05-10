<template>
  <div class="ai-chat-root">
    <!-- 主色调导航栏，fixed置顶 -->
    <nav class="main-navbar">
      <div class="navbar-title">Anycreator</div>
      <div class="navbar-spacer"></div>
      <img class="navbar-logo" src="/icon/settings_icon.png" alt="用户设定" title="用户设定" />
    </nav>
    <!-- 预留主内容区 -->
    <div class="chat-content">
      <!-- 这里将来放聊天窗口等内容 -->
    </div>
  </div>
</template>

<script setup>
// 目前无需引入其他内容，后续可扩展
</script>

<style scoped>
.ai-chat-root {
  min-height: 100vh;
  background: #f8fefb;
  display: flex;
  flex-direction: column;
}
.main-navbar {
  width: 100vw;
  height: 40px;
  background: linear-gradient(90deg, #22C55E 0%, #16a34a 100%); /* 主色渐变 */
  display: flex;
  align-items: center;
  box-shadow: 0 2px 8px #22C55E44, 0 4px 16px #0000000a; /* 更立体的阴影 */
  padding: 0 8px 0 32px; /* 右侧padding更小，防止logo超出 */
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
}
.navbar-title {
  color: #fff;
  font-size: 22px;
  font-weight: bold;
  letter-spacing: 2px;
  font-family: '阿里妈妈刀隶体 Regular', sans-serif;
  user-select: none;
  height: 40px;
  display: flex;
  align-items: center;
}
.navbar-spacer {
  flex: 1;
}
.navbar-logo {
  width: 28px;
  height: 28px;
  margin-left: 18px;
  margin-right: 40px;
  cursor: pointer;
  border-radius: 50%;
  transition: box-shadow 0.2s;
  box-shadow: 0 2px 8px #22C55E22;
}
.navbar-logo:hover {
  box-shadow: 0 4px 16px #22C55E55;
}
.chat-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #bbb;
  font-size: 20px;
  /* 顶部留出导航栏高度 */
  margin-top: 40px;
}
</style> 