import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from './views/LoginPage.vue'
import AIChat from './views/AIChat.vue'

// 只保留 LoginPage 路由
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginPage },
  { path: '/:pathMatch(.*)*', redirect: '/login' },
  { path: '/ai_chat', component: AIChat }
]
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 创建并挂载应用
createApp(App).use(router).mount('#app') 