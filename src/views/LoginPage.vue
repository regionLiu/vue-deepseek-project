<template>
  <div class="login-root">
    <!-- 左上角固定logo -->
    <div class="corner-logo">Anycreator</div>
    <!-- 页面主区域，居中显示卡片块 -->
    <div class="center-area">
      <!-- 登录卡片块，点击后直接切换为表单内容 -->
      <div class="login-card-block" @mouseenter="arrowHover = true" @mouseleave="arrowHover = false">
        <!-- 右上角关闭按钮 -->
        <button v-if="showForm" class="close-btn" @click="closeForm" aria-label="关闭登录框">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" class="close-svg">
            <path d="M6 6l10 10M16 6L6 16" :stroke="closeHover ? '#22C55E' : '#bbb'" stroke-width="2.2" stroke-linecap="round"/>
          </svg>
        </button>
        <template v-if="!showForm">
          <div class="card-flex-row" @click="toggleForm">
            <div class="fuzai-img-wrapper">
              <img src="/fuzai.png" alt="AI头像" class="fuzai-img" />
            </div>
            <div class="login-card-desc">Anycreator，让工作更简单</div>
            <svg
              v-if="!isMobile"
              class="arrow-svg"
              :class="{ 'arrow-hover': arrowHover }"
              xmlns="http://www.w3.org/2000/svg"
              width="38" height="38" viewBox="0 0 38 38" fill="none"
            >
              <circle cx="19" cy="19" r="19" fill="#fff"/>
              <path class="arrow-path" d="M13 19h12m0 0-4.5-4.5M25 19l-4.5 4.5" :stroke="arrowHover ? '#22C55E' : '#222'" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </template>
        <template v-else>
          <div class="login-form-inner">
            <form v-if="!showGuest" @submit.prevent="handleLogin">
              <div class="form-title">账号登录</div>
              <div class="form-group">
                <input v-model="username" type="text" placeholder="用户名" required autocomplete="username" />
              </div>
              <div class="form-group">
                <input v-model="password" type="password" placeholder="密码" required autocomplete="current-password" />
              </div>
              <button class="login-btn" :disabled="loading">{{ loading ? '登录中...' : '登录' }}</button>
              <div v-if="errorMsg" class="form-error">{{ errorMsg }}</div>
            </form>
            <div v-if="!showGuest" class="guest-tip">
              临时访客？<span class="guest-link" @click="showGuest=true">点此输入邀请码</span>
            </div>
            <form v-else @submit.prevent="handleGuestLogin" class="guest-form">
              <input v-model="guestCode" type="text" placeholder="请输入邀请码" required class="guest-input" />
              <button class="guest-btn" :disabled="loading">{{ loading ? '验证中...' : '确认' }}</button>
              <span class="guest-back" @click="showGuest=false">返回</span>
              <div v-if="errorMsg" class="form-error">{{ errorMsg }}</div>
            </form>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { BASE_URL, LOGIN_API, AI_CHAT_PATH } from '../env.js'
import { useRouter } from 'vue-router'
const showForm = ref(false)
const arrowHover = ref(false)
const isMobile = ref(false)
const username = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')
const showGuest = ref(false)
const guestCode = ref('')
const closeHover = ref(false)
const router = useRouter()
function toggleForm() {
  showForm.value = true
}
function closeForm() {
  showForm.value = false
  showGuest.value = false
  errorMsg.value = ''
  username.value = ''
  password.value = ''
  guestCode.value = ''
}
function handleEsc(e) {
  if (showForm.value && (e.key === 'Escape' || e.key === 'Esc')) {
    // 不再关闭表单，ESC无效
  }
}
function checkMobile() {
  isMobile.value = window.innerWidth <= 600
}
onMounted(() => {
  window.addEventListener('keydown', handleEsc)
  checkMobile()
  window.addEventListener('resize', checkMobile)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleEsc)
  window.removeEventListener('resize', checkMobile)
})
// 登录逻辑，完全按原有接口和跳转
async function handleLogin() {
  errorMsg.value = ''
  if (!username.value || !password.value) {
    errorMsg.value = '用户名和密码不能为空'
    return
  }
  loading.value = true
  try {
    // 构造 x-www-form-urlencoded 参数
    const params = new URLSearchParams()
    params.append('username', username.value)
    params.append('password', password.value)
    // 发起登录请求
    const res = await fetch(`${BASE_URL}${LOGIN_API}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params
    })
    let data
    try {
      data = await res.json()
    } catch (e) {
      data = {}
    }
    if (res.ok) {
      // 登录成功，存token并跳转
      const token = data.data && data.data.access_token
      if (token) {
        localStorage.setItem('access_token', token)
      }
      router.push(AI_CHAT_PATH)
    } else if (res.status === 401) {
      errorMsg.value = '用户名不存在或密码错误'
    } else {
      errorMsg.value = data.message || '登录失败，请检查账号密码！'
    }
  } catch (err) {
    errorMsg.value = '网络错误，请稍后重试！'
  } finally {
    loading.value = false
  }
}
// 临时访客登录逻辑（可根据实际API补充）
async function handleGuestLogin() {
  errorMsg.value = ''
  if (!guestCode.value) {
    errorMsg.value = '邀请码不能为空'
    return
  }
  loading.value = true
  try {
    // 这里应调用实际邀请码API
    await new Promise(r => setTimeout(r, 800))
    // 验证成功逻辑
    // ...
    errorMsg.value = ''
    // 跳转等
  } catch (e) {
    errorMsg.value = '邀请码无效或网络错误'
  } finally {
    loading.value = false
  }
}
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
/* 左上角固定logo */
.corner-logo {
  position: fixed;
  top: 18px;
  left: 32px;
  z-index: 100;
  font-family: '阿里妈妈刀隶体 Regular', sans-serif;
  font-size: 2rem;
  color: #222;
  font-weight: bold;
  letter-spacing: 2px;
  user-select: none;
  pointer-events: auto;
  transition: color 0.25s cubic-bezier(.4,0,.2,1);
}
.corner-logo:hover {
  color: #22C55E;
}
.login-root {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #f6f8fa;
}
/* 主区域，内容垂直水平居中 */
.center-area {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 0;
}
/* 登录卡片块，圆角阴影，主色调边框，居中显示 */
.login-card-block {
  max-width: 100vw;
  width: 45vw;
  min-height: 60px;
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 4px 32px 0 #1e2c4012, 0 1.5px 4px #0001;
  border: 1px solid #888;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: box-shadow 0.2s, border 0.2s;
  margin-top: 8vh;
  margin-bottom: 0;
  padding: 38px 32px 32px 32px;
  text-align: center;
  position: relative;
}
.login-card-block:hover {
  box-shadow: 0 8px 32px #22C55E44;
  border-color: #16a34a;
}
/* 卡片内容左右布局 */
.card-flex-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  gap: 6vw;
}
/* 图片容器，方形有圆角，溢出隐藏 */
.fuzai-img-wrapper {
  width: 90px;
  height: 90px;
  border-radius: 18px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 12px #22C55E22;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
/* 图片本身放大，填满容器，居中，超出部分隐藏 */
.fuzai-img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  display: block;
  transform: scale(1);
}
.login-card-desc {
  font-size: 1.1rem;
  color: #222;
  margin-bottom: 0;
  opacity: 0.7;
  text-align: left;
  line-height: 1.6;
}
.login-form-inner {
  width: 100%;
  max-width: 340px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: none;
}
.form-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 30px;
  letter-spacing: 2px;
  text-align: center;
  width: 100%;
}
.form-subtitle {
  font-size: 1.05rem;
  color: #888;
  margin-bottom: 28px;
  width: 100%;
  text-align: left;
}
.form-group {
  width: 100%;
  margin-bottom: 26px;
}
.form-group input {
  width: 100%;
  padding: 12px 0 8px 0;
  border: none;
  border-bottom: 2px solid #e0e0e0;
  border-radius: 0;
  font-size: 1.08rem;
  background: transparent;
  outline: none;
  box-shadow: none;
  transition: border-color 0.2s;
}
.form-group input:focus {
  border-bottom: 2px solid #22C55E;
  background: transparent;
}
.login-btn {
  width: 100%;
  padding: 14px 0;
  background: #e6eaf0;
  color: #888;
  font-size: 1.13rem;
  font-weight: bold;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  margin-top: 8px;
  margin-bottom: 6px;
  box-shadow: 0 2px 16px #22C55E22, 0 1.5px 4px #0001;
  transition: background 0.2s, color 0.2s, transform 0.18s cubic-bezier(.4,0,.2,1), box-shadow 0.2s;
}
.login-btn:disabled {
  background: #f6f8fa;
  color: #bbb;
  cursor: not-allowed;
  box-shadow: none;
}
.login-btn:hover:not(:disabled) {
  background: linear-gradient(90deg, #22C55E 0%, #16a34a 100%);
  color: #fff;
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 8px 24px #22C55E33;
}
.form-error {
  color: #e74c3c;
  margin-top: 10px;
  font-size: 0.98rem;
  width: 100%;
  text-align: left;
}
.arrow-svg {
  margin-left: 2vw;
  transition: transform 0.35s cubic-bezier(.4,0,.2,1), box-shadow 0.3s;
  will-change: transform;
  box-shadow: 0 2px 8px #22C55E11;
  border-radius: 50%;
  cursor: pointer;
  background: transparent;
}
.arrow-path {
  transition: stroke 0.25s cubic-bezier(.4,0,.2,1);
}
.arrow-hover {
  transform: translateX(18px) translateY(-8px) scale(1.08) rotate(6deg);
  box-shadow: 0 8px 24px #22C55E33;
}
.guest-tip {
  width: 100%;
  margin-top: 18px;
  text-align: center;
  color: #888;
  font-size: 1rem;
}
.guest-link {
  color: #22C55E;
  cursor: pointer;
  text-decoration: underline;
  margin-left: 2px;
  transition: color 0.2s;
}
.guest-link:hover {
  color: #16a34a;
}
.guest-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 18px;
}
.guest-input {
  width: 100%;
  padding: 12px 0 8px 0;
  border: none;
  border-bottom: 2px solid #e0e0e0;
  border-radius: 0;
  font-size: 1.08rem;
  background: transparent;
  outline: none;
  margin-bottom: 14px;
  box-shadow: none;
  transition: border-color 0.2s;
}
.guest-input:focus {
  border-bottom: 2px solid #22C55E;
  background: transparent;
}
.guest-btn {
  width: 100%;
  padding: 14px 0;
  background: #e6eaf0;
  color: #888;
  font-size: 1.08rem;
  font-weight: bold;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  margin-bottom: 8px;
  box-shadow: 0 2px 16px #22C55E22, 0 1.5px 4px #0001;
  transition: background 0.2s, color 0.2s, transform 0.18s cubic-bezier(.4,0,.2,1), box-shadow 0.2s;
}
.guest-btn:disabled {
  background: #f6f8fa;
  color: #bbb;
  cursor: not-allowed;
  box-shadow: none;
}
.guest-btn:hover:not(:disabled) {
  background: linear-gradient(90deg, #22C55E 0%, #16a34a 100%);
  color: #fff;
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 8px 24px #22C55E33;
}
.guest-back {
  color: #888;
  font-size: 0.98rem;
  cursor: pointer;
  margin-top: 2px;
  text-decoration: underline;
  transition: color 0.2s;
}
.guest-back:hover {
  color: #22C55E;
}
.close-btn {
  position: absolute;
  top: 18px;
  right: 18px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
.close-svg path {
  transition: stroke 0.2s;
}
.close-btn:hover .close-svg path {
  stroke: #22C55E !important;
}
.close-svg {
  display: block;
}
@media (max-width: 600px) {
  .corner-logo {
    top: 8px;
    left: 12px;
    font-size: 1.1rem;
  }
  .login-card-block {
    width: 98vw;
    min-width: 0;
    padding: 18px 4vw 18px 4vw;
    border-radius: 10px;
  }
  .center-area {
    padding-top: 0;
  }
  .card-flex-row {
    flex-direction: column;
    gap: 10px;
    align-items: center;
  }
  .fuzai-img-wrapper {
    width: 60px;
    height: 60px;
    border-radius: 10px;
  }
  .fuzai-img {
    width: 80px;
    height: 80px;
    transform: scale(1.18);
  }
  .login-card-desc {
    font-size: 0.98rem;
    text-align: center;
  }
  .arrow-svg {
    display: none;
  }
}
</style> 