import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import MessengerPage from '@/pages/MessengerPage.vue'
import MobileChatPage from '@/pages/MobileChatPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Messenger',
    component: MessengerPage
  },
  {
    path: '/chat/:id',
    name: 'MobileChat',
    component: MobileChatPage
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
