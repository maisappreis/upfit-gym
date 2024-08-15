import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory('/upfit-gym'),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import ('@/views/HomeView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import ('@/views/LoginView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

export default router
