import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import store from '@/store'
// 定义路由
const routes = [
  { path: '/', component: () => import('./components/Home.vue') },
  { path: '/BattlePass', component: () => import('@/components/BattlePass.vue') },
]

// 创建路由器实例
const router = createRouter({
  history: createWebHashHistory(),
  routes,
})




// 创建 Vue 应用程序并添加路由器
const app = createApp(App)


app.use(router)
app.use(store) // 使用你的 store
app.mount('#app')