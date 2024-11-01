import { defineStore } from 'pinia'
import api from '../services/api'
import type { IUser } from '@/types/auth'
import { ref, type Ref } from 'vue'

export interface AuthState {
  isAuthenticated: Ref<boolean>
  token: Ref<string | null>
  user: Ref<IUser | null>
  loading: Ref<boolean>
  login: (email: string, password: string) => Promise<boolean>
  signup: (
    username: string,
    email: string,
    password: string,
  ) => Promise<boolean>
  createCharacter: (name: string, classHero: string) => Promise<boolean>
  logout: () => void
  loadUser: () => Promise<void>
}

export const useAuthStore = defineStore('auth', (): AuthState => {
  const isAuthenticated = ref(false)
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(null)
  const loading = ref(false)
  async function login(email: string, password: string) {
    try {
      const response = await api.post('/auth/login', { email, password })
      console.log({ response })
      token.value = response.data.token
      isAuthenticated.value = true
      if (token.value) localStorage.setItem('token', token.value!)
      user.value = response.data.user
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }
  async function signup(username: string, email: string, password: string) {
    try {
      const response = await api.post('/auth/signup', {
        username,
        email,
        password,
      })
      token.value = response.data.token
      isAuthenticated.value = true
      if (token.value) localStorage.setItem('token', token.value!)
      user.value = response.data.user
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }

  async function createCharacter(name: string, classHero: string) {
    if (token.value) {
      console.log({ name, classHero })
      try {
        const response = await api.post(
          '/character/create',
          {
            name,
            classHero,
          },
          {
            headers: {
              Authorization: `Bearer ${token.value}`,
            },
          },
        )
        console.log({ response })
        return true
      } catch (error) {
        console.log(error)
        return false
      }
    }
    return false
  }

  function logout() {
    isAuthenticated.value = false
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }
  async function loadUser() {
    if (token.value) {
      try {
        const response = await api.get('/auth/me', {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        })
        if (!response.data.user?.id) {
          console.log('User not found')
          throw Error('User not found')
        }
        user.value = response.data.user
        isAuthenticated.value = true
      } catch (error) {
        console.log('erro no loadUser', error)
        logout()
      }
    }
    loading.value = false
  }

  return {
    isAuthenticated,
    token,
    user,
    loading,
    login,
    signup,
    createCharacter,
    logout,
    loadUser,
  }
})
