import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'
import { useGameStore } from './stores/game'
import { useColyseusStore } from './stores/colyseus'

import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(Vue3Toastify, {
  autoClose: 3000,
} as ToastContainerOptions)

const authStore = useAuthStore(pinia)
const gameStore = useGameStore(pinia)
useColyseusStore(pinia)

const initializeApp = async () => {
  await authStore.loadUser()
  if (authStore.token) await gameStore.loadUser(authStore?.token)

  // Configurar o guardião de rotas após o carregamento do authStore
  router.beforeEach((to, from, next) => {
    if (to.path === '/') {
      if (authStore.isAuthenticated) {
        next({ name: 'profile' })
      } else {
        next({ name: 'login' })
      }
    } else if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      next({ name: 'login' })
    } else {
      next()
    }
  })

  app.mount('#app')
}

initializeApp()
