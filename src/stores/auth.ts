import { defineStore } from 'pinia'
import api from '../services/api'
import type { IUser } from '@/types/auth'

export interface AuthState {
  isAuthenticated: boolean
  token: string | null
  user: IUser | null
  loading: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isAuthenticated: false,
    token: localStorage.getItem('token') || null,
    user: null,
    loading: false,
  }),
  actions: {
    async login(email: string, password: string) {
      try {
        const response = await api.post('/auth/login', { email, password })
        console.log({ response })
        this.token = response.data.token
        this.isAuthenticated = true
        localStorage.setItem('token', this.token!)
        this.user = response.data.user
        return true
      } catch (error) {
        console.log(error)
        return false
      }
    },
    async signup(username: string, email: string, password: string) {
      try {
        const response = await api.post('/auth/signup', {
          username,
          email,
          password,
        })
        this.token = response.data.token
        this.isAuthenticated = true
        localStorage.setItem('token', this.token!)
        this.user = response.data.user
        return true
      } catch (error) {
        console.log(error)
        return false
      }
    },

    async createCharacter(name: string, classHero: string) {
      if (this.token) {
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
                Authorization: `Bearer ${this.token}`,
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
    },

    logout() {
      this.isAuthenticated = false
      this.token = null
      this.user = null
      localStorage.removeItem('token')
    },
    async loadUser() {
      if (this.token) {
        try {
          const response = await api.get('/auth/me', {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          })
          if (!response.data.user?.id) {
            console.log('User not found')
            throw Error('User not found')
          }
          this.user = response.data.user
          this.isAuthenticated = true
        } catch (error) {
          console.log('erro no loadUser', error)
          this.logout()
        }
      }
      this.loading = false
    },
  },
})
