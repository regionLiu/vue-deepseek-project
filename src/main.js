import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from './views/LoginPage.vue'
import AIChat from './views/AIChat.vue'
// 导入全局路由常量
import { ROOT_PATH, LOGIN_PATH, AI_CHAT_PATH, NOT_FOUND_PATH } from './env.js'

// 只保留 LoginPage 路由
const routes = [
  { path: ROOT_PATH, redirect: LOGIN_PATH },
  { path: LOGIN_PATH, component: LoginPage },
  { path: NOT_FOUND_PATH, redirect: LOGIN_PATH },
  { path: AI_CHAT_PATH, component: AIChat }
]
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 创建并挂载应用
createApp(App).use(router).mount('#app') 