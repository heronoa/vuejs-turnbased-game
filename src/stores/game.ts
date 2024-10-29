import { defineStore } from 'pinia'
import api from '../services/api'
import type { ICharacter } from '@/types/auth'

export interface GameState {
  character: ICharacter | null
  characterId: ICharacter['id'] | null
  loading: boolean
}

export const useGameStore = defineStore('game', {
  state: (): GameState => ({
    characterId: null,
    character: null,
    loading: false,
  }),
  actions: {
    selectHero(id: string) {
      localStorage.setItem('cacheCharacter', id)
      this.characterId = id
    },

    clear() {
      this.characterId = null
      this.character = null
    },

    async loadUser(token: string) {
      const cacheCharacter = localStorage.getItem('cacheCharacter')
      if (cacheCharacter) {
        console.log({ cacheCharacter })
        this.characterId = cacheCharacter
      }
      if (this.characterId) {
        console.log({ id: this.characterId })

        try {
          const response = await api.post(
            '/character/search',
            {
              characterId: this.characterId,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )
          if (!response.data.character?.id) {
            console.log('User not found')
            return this.clear()
          }
          this.character = response.data.character
          return true
        } catch (error) {
          console.log('erro no loadUser', error)
          this.clear()
          return false
        }
      }
      this.loading = false
      return false
    },
  },
})
