<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
      <h2 class="text-2xl font-bold text-center">Dashboard</h2>
      <div v-if="!character?.name" class="flex justify-center items-center">
        <div class="loading-circle !border-b-indigo-700"></div>
      </div>
      <div v-if="character?.name">
        <div class="flex flex-col justify-center items-center">
          <div class="relative z-1 w-[70px] h-[70px] bg-amber-600 rounded-full overflow-hidden ">
            <img class="w-full h-full" :src="characterImage?.[character?.heroClass as 'warrior' | 'mage' | 'scout']" />
          </div>
          <label class="border-b border-solid border-gray-200 w-full text-center font-bold uppercase">
            {{ character?.name }} - {{ character?.heroClass }}
          </label>
          <div class="flex gap-4 justify-between">
            <div>Exp: {{ character?.exp }}</div>
            <div>Next Lvl: {{ character?.levelupExp }}</div>
          </div>
          <div class="flex justify-center items-center">
            <div>
              <div class="flex gap-4 justify-between">
                <div>
                  Hp:
                  {{ character?.CharacterAttribute.hp }}
                </div>
                <div>
                  Magicka:
                  {{ character?.CharacterAttribute.magicka }}
                </div>
              </div>
              <div class="flex gap-4 justify-between">
                <div>
                  Strength:
                  {{ character?.CharacterAttribute.strength }}
                </div>
                <div>
                  Willpower:
                  {{ character?.CharacterAttribute.willpower }}
                </div>
              </div>

              <div class="flex gap-4 justify-between">
                <div>
                  Resistence:
                  {{ character?.CharacterAttribute.resistence }}
                </div>
                <div>
                  Dexterity:
                  {{ character?.CharacterAttribute.dexterity }}
                </div>
              </div>
            </div>
          </div>
          <button v-on:click="findBattle" class="w-full py-2 mt-4 text-white bg-blue-500 rounded">
            Find Battle
          </button>
          <button v-on:click="changeHero" class="w-full py-2 mt-4 text-white bg-blue-500 rounded">
            Change Hero
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
// import { useAuthStore } from '../stores/auth'
import { useAuthStore } from '@/stores/auth'
import { useGameStore } from '@/stores/game'
import type { ICharacter } from '@/types/auth'
import WarriorImage from "../assets/characters/warrior.webp"
import MageImage from "../assets/characters/mage.webp"
import ScoutImage from "../assets/characters/scout.webp"

const characterImage = {
  warrior: WarriorImage,
  mage: MageImage,
  scout: ScoutImage,
}

const authStore = useAuthStore()
const gameStore = useGameStore()
const router = useRouter()
const character = ref<ICharacter | undefined | null>()
const loading = ref(true)
const load = async () => {
  loading.value = true
  if (!authStore.token || !authStore.isAuthenticated) router.push({ name: "login" })
  if (authStore.token) await gameStore.loadUser(authStore.token)
  if (!gameStore.character) {
    router.push({ name: 'profile' })
  }
  character.value = gameStore.character
  loading.value = false
}

onMounted(load)

const changeHero = () => {
  gameStore.character = null
  gameStore.characterId = null

  router.push({ name: 'profile' })
}

const findBattle = () => {
  router.push({ name: 'Game Queue' })
}

// const router = useRouter()

</script>
