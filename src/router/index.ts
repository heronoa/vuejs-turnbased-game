import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import SignupView from '@/views/SignupView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      meta: {
        requiresAuth: true,
      },
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/charactercreation',
      name: 'character creation',
      meta: {
        requiresAuth: true,
      },
      component: () => import('../views/CharacterCreationView.vue'),
    },
    {
      path: '/game',
      children: [
        {
          path: 'dashboard',
          component: () => import('../views/CharacterDashboardView.vue'),
          name: 'Character Dashboard',
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: 'queue',
          component: () => import('../views/QueueView.vue'),
          name: 'Game Queue',
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: 'match',
          name: 'Game Match',
          meta: {
            requiresAuth: true,
          },
          component: () => import('../views/MatchView.vue'),
        },
      ],
    },
    {
      path: '/login',
      name: 'login',

      component: LoginView,
    },
    {
      path: '/signup',
      name: 'signup',

      component: SignupView,
    },
  ],
})

export default router
