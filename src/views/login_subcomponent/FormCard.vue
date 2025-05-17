<template>
  <!-- 登录/访客登录表单卡片组件 -->
  <div class="auth-card">
    <!-- 标题横向居中 -->
    <div class="auth-header">
      <h2 class="auth-title">{{ isVisitor ? '访客登录' : '欢迎登录' }}</h2>
    </div>
    <!-- 登录表单 -->
    <form v-if="!isVisitor" class="auth-form" @submit="handleLogin">
      <label for="login-username">账号</label>
      <input id="login-username" type="text" placeholder="请输入账号" v-model="username" />
      <label for="login-password">密码</label>
      <input id="login-password" type="password" placeholder="请输入密码" v-model="password" />
      <!-- 错误提示信息 -->
      <div v-if="errorMsg" style="color: red; margin-bottom: 10px;">{{ errorMsg }}</div>
      <button type="submit" class="main-btn" :disabled="loading">{{ loading ? '登录中...' : '登录' }}</button>
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
// 引入全局 base_url
import { BASE_URL, LOGIN_API, AI_CHAT_PATH } from '../../env.js'
import { useRouter } from 'vue-router'
// 是否为访客登录模式
const isVisitor = ref(false)
// 新增：表单数据和错误提示
const username = ref('')
const password = ref('')
const errorMsg = ref('')
const loading = ref(false)
const router = useRouter()

// 登录表单提交处理
async function handleLogin(e) {
  e.preventDefault()
  errorMsg.value = ''
  // 校验用户名和密码不能为空
  if (!username.value.trim() || !password.value.trim()) {
    errorMsg.value = '账号和密码都不能为空！'
    return
  }
  loading.value = true
  try {
    // 构造 x-www-form-urlencoded 格式的参数，参数名和后端保持一致
    const params = new URLSearchParams();
    params.append('username', username.value);
    params.append('password', password.value);
    // 发起登录请求，Content-Type 需为 application/x-www-form-urlencoded
    const res = await fetch(`${BASE_URL}${LOGIN_API}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params
    })
    let data
    try {
      data = await res.json()
      console.log('后端返回JSON：', data)
    } catch (e) {
      const text = await res.text()
      console.log('后端返回非JSON：', text)
      data = {}
    }
    if (res.ok) {
      // 登录成功，先将access_token存入localStorage，key为'access_token'
      const token = data.data && data.data.access_token
      if (token) {
        localStorage.setItem('access_token', token)
      }
      router.push(AI_CHAT_PATH)
    } else if (res.status === 401) {
      // 401 未授权，用户名或密码错误
      errorMsg.value = '用户名不存在或密码错误'
    } else {
      // 其他错误，显示后端返回的错误信息
      errorMsg.value = data.message || '登录失败，请检查账号密码！'
    }
  } catch (err) {
    errorMsg.value = '网络错误，请稍后重试！'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-card {
  /* 最大宽度400px，宽度自适应屏幕，水平居中 */
  max-width: 400px;
  width: 90vw;
  padding: 48px 36px 36px 36px;
  margin: 0 auto;
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
  font-size: clamp(1.5rem, 2.5vw, 2.2rem); /* 响应式字体 */
  font-weight: bold;
  color: #222;
  text-align: center;
  width: 100%;
}
.switch-btn {
  background: none;
  border: none;
  color: #22C55E;
  font-size: 1rem;
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
  font-size: 1rem;
  color: #666;
  margin-bottom: 6px;
}
.auth-form input {
  height: 44px;
  margin-bottom: 20px;
  padding: 0 14px;
  border: 1.5px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1.1rem;
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
  font-size: 1.1rem;
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
    width: 98vw;
    min-width: 0;
    padding: 24px 8px;
    margin: 0 auto;
  }
}
@media (max-width: 600px) {
  .auth-card {
    max-width: 99vw;
    padding: 12px 2vw;
  }
  .auth-title {
    font-size: 1.2rem;
  }
}
</style> 