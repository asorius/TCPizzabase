import { createRouter, createWebHistory } from 'vue-router'

import { authenticate } from './guards'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/create',
      name: 'Create',
      beforeEnter: [authenticate],
      component: () => import('@/views/CreateView.vue')
    },
    {
      path: '/personal',
      name: 'Personal',
      beforeEnter: [authenticate],
      component: () => import('@/views/PersonalView.vue')
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('@/views/SignupView.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/LoginView.vue')
    },
    {
      path: '/pizza/:id',
      name: 'Pizza',
      component: () => import('@/views/PizzaView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFoundView.vue')
    }
  ]
})

export default router
