import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from './views/LoginPage.vue'

// 只保留 LoginPage 路由
const routes = [
  { path: '/', redirect: '/auth' },
  { path: '/auth', component: LoginPage }
]
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 创建并挂载应用
createApp(App).use(router).mount('#app') 