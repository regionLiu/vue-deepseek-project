<template>
  <!-- 登录/访客登录表单卡片组件 -->
  <div class="auth-card">
    <!-- 标题横向居中 -->
    <div class="auth-header">
      <h2 class="auth-title">{{ isVisitor ? '访客登录' : '欢迎登录' }}</h2>
    </div>
    <!-- 登录表单 -->
    <form v-if="!isVisitor" class="auth-form" @submit.prevent>
      <label for="login-username">账号</label>
      <input id="login-username" type="text" placeholder="请输入账号" />
      <label for="login-password">密码</label>
      <input id="login-password" type="password" placeholder="请输入密码" />
      <button type="submit" class="main-btn">登录</button>
      <!-- 辅助链接区域，只保留切换到访客登录按钮 -->
      <div class="form-links">
        <button type="button" class="switch-btn left-link" @click="isVisitor = true">没有账号？访客登录</button>
      </div>
    </form>
    <!-- 访客登录表单 -->
    <form v-else class="auth-form" @submit.prevent>
      <label for="visitor-token">访客令牌</label>
      <input id="visitor-token" type="text" placeholder="请输入访客令牌" />
      <button type="submit" class="main-btn">访客登录</button>
      <div class="form-links">
        <button type="button" class="switch-btn left-link" @click="isVisitor = false">已有账号？登录</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// 是否为访客登录模式
const isVisitor = ref(false)
</script>

<style scoped>
.auth-card {
  width: 380px;
  padding: 48px 36px 36px 36px;
  margin-left: 200px;
  background: #fff; 
  box-shadow: 0 8px 32px rgba(34,197,94,0.10), 0 1.5px 4px rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.auth-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 28px;
}
.auth-title {
  font-size: 26px;
  font-weight: bold;
  color: #222;
  text-align: center;
  width: 100%;
}
.switch-btn {
  background: none;
  border: none;
  color: #22C55E;
  font-size: 15px;
  cursor: pointer;
  transition: color 0.2s;
  padding: 0;
}
.switch-btn:hover {
  color: #16a34a;
}
.auth-form {
  display: flex;
  flex-direction: column;
}
.auth-form label {
  font-size: 15px;
  color: #666;
  margin-bottom: 6px;
}
.auth-form input {
  height: 44px;
  margin-bottom: 20px;
  padding: 0 14px;
  border: 1.5px solid #e0e0e0;
  border-radius: 10px;
  font-size: 17px;
  outline: none;
  transition: border 0.2s;
  background: #f6fef9;
}
.auth-form input:focus {
  border-color: #22C55E;
}
.main-btn {
  height: 44px;
  background: #22C55E;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 17px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
  transition: background 0.2s;
  box-shadow: 0 2px 8px rgba(34,197,94,0.10);
}
.main-btn:hover {
  background: #16a34a;
}
.form-links {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 25px;
  margin-bottom: 0;
}
.left-link {
  text-align: left;
}
@media (max-width: 900px) {
  .auth-card {
    width: 90vw;
    min-width: 0;
    padding: 24px 8px;
    margin-left: 0;
  }
}
</style> 