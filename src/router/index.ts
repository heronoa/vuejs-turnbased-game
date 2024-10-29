import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import SignupView from '@/views/SignupView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
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
      path: '/game/dashboard',
      name: 'Character Dashboard',
      meta: {
        requiresAuth: true,
      },
      component: () => import('../views/CharacterDashboardView.vue'),
    },
    {
      path: '/game/queue',
      name: 'Game Queue',
      meta: {
        requiresAuth: true,
      },
      component: () => import('../views/QueueView.vue'),
    },
    {
      path: '/game/match',
      name: 'Game Match',
      meta: {
        requiresAuth: true,
      },
      component: () => import('../views/MatchView.vue'),
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
