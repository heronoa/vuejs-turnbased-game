import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'
import { useGameStore } from './stores/game'
import { useColyseusStore } from './stores/colyseus'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)
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
        next('/profile')
      } else {
        next('/login')
      }
    } else if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      next('/login')
    } else {
      next()
    }
  })

  app.mount('#app')
}

initializeApp()
