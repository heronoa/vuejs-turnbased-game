<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
      <h2 class="text-2xl font-bold text-center">Profile</h2>
      <section v-if="user">
        <h4 class="text-center font-bold uppercase">
          Welcome {{ user.username }}!
        </h4>
        <div>
          <div
            v-if="user?.character"
            class="flex flex-col w-full justify-start items-center gap-4"
          >
            <div
              v-for="char in user.character"
              :key="char.id"
              class="flex justify-center items-center gap-3"
            >
              {{ char.name }} -
              <span class="font-bold uppercase">{{ char.heroClass }}</span>
              <div
                v-on:click="() => selectHero(char.id)"
                class="w-[24px] h-[24px] text-white bg-blue-500 rounded flex justify-center items-center"
              >
                <div
                  class="w-[32px] h-[32px] block text-black cursor-pointer"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div>
        <button
          v-on:click="createCharacter"
          class="w-full py-2 mt-4 text-white bg-blue-500 rounded"
        >
          Create
        </button>
        <button
          v-on:click="logout"
          class="w-full py-2 mt-4 text-white bg-blue-500 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useGameStore } from '@/stores/game'
import { GiConfirmed } from 'oh-vue-icons/icons'

export default defineComponent({
  setup() {
    const authData = useAuthStore()

    const user = authData.$state.user

    const router = useRouter()
    const authStore = useAuthStore()
    const gameStore = useGameStore()

    const logout = () => {
      authStore.logout()
      router.push('/')
    }

    const createCharacter = () => {
      router.push('/charactercreation')
    }

    const selectHero = (id: string) => {
      if (authStore.token) {
        gameStore.selectHero(id)
        router.push('/game/dashboard')
      }
    }

    return {
      user,
      createCharacter,
      logout,
      selectHero,

      GiConfirmed,
    }
  },
})
</script>
