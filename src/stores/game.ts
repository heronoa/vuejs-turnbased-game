import { defineStore } from 'pinia'
import api from '../services/api'
import type { ICharacter } from '@/types/auth'
import { ref, type Ref } from 'vue'

export interface GameState {
  character: Ref<ICharacter | null>
  characterId: Ref<ICharacter['id'] | null>
  loading: Ref<boolean>
  loadUser: (token: string) => Promise<boolean | void>
  clear: () => void
  deleteHero: (id: string, token: string) => Promise<true | void>
  selectHero: (id: string) => void
}

export const useGameStore = defineStore('game', (): GameState => {
  const characterId = ref<ICharacter['id'] | null>(null)
  const character = ref<ICharacter | null>(null)
  const loading = ref<boolean>(false)

  function selectHero(id: string) {
    localStorage.setItem('cacheCharacter', id)
    characterId.value = id
  }

  async function deleteHero(id: string, token: string) {
    try {
      const response = await api.delete('/character/delete', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          characterId: id,
        },
      })
      if (!response.data.character?.id) {
        console.log('User not found')
        return clear()
      }
      character.value = response.data.character
      return true
    } catch (error) {
      console.log('erro no loadUser', error)
      return clear()
    }
  }
  function clear() {
    characterId.value = null
    character.value = null
  }
  async function loadUser(token: string) {
    const cacheCharacter = localStorage.getItem('cacheCharacter')
    if (cacheCharacter) {
      console.log({ cacheCharacter })
      characterId.value = cacheCharacter
    }
    if (characterId.value) {
      console.log({ id: characterId.value })

      try {
        const response = await api.post(
          '/character/search',
          {
            characterId: characterId.value,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        if (!response.data.character?.id) {
          console.log('User not found')
          return clear()
        }
        character.value = response.data.character
        return true
      } catch (error) {
        console.log('erro no loadUser', error)
        clear()
        return false
      }
    }
    loading.value = false
    return false
  }

  return {
    loadUser,
    clear,
    character,
    deleteHero,
    selectHero,
    characterId,
    loading,
  }
})
