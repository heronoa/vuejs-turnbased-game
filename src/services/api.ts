// src/services/api.ts
import axios from 'axios'
import { useAuthStore } from '../stores/auth'
import router from '../router'

// Crie uma instância do Axios com configurações padrão
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`, // Substitua pela URL da sua API
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para adicionar o token de autenticação em todas as requisições
api.interceptors.request.use(
  config => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  },
)

// Interceptor para lidar com respostas e erros globais
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Por exemplo, se o token expirou ou é inválido
      if (error.response.status === 401) {
        const authStore = useAuthStore()
        authStore.logout()
        router.push({ name: 'login' })
      }
    }
    return Promise.reject(error)
  },
)

export default api
