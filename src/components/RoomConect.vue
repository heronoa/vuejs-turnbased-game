<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
      <h2 class="text-2xl font-bold text-center">Procurando Adversário...</h2>

      <div class="flex justify-center items-center">
        Jogadores na fila: {{ clients.length }}
      </div>
      <button v-on:click="leave" class="w-full py-2 mt-4 text-white bg-blue-500 rounded">
        Abandonar
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useGameStore } from '@/stores/game'
import { useColyseusStore } from '@/stores/colyseus'
// import type { ICharacter } from '@/types/auth'

const authStore = useAuthStore()
const colyseus = useColyseusStore()
const gameStore = useGameStore()
const authToken = authStore.token
const router = useRouter()
// const character = ref<ICharacter | undefined | null>()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const clients = ref<any[]>([])
const loading = ref(true)
const load = async () => {
  if (!authToken || !authStore.isAuthenticated) {
    return router.push({ name: 'login' })
  }

  loading.value = true
  const successInit = await colyseus.colyseusInit(authToken)
  if (successInit)
    console.log({
      character: gameStore?.character,
      userId: authStore?.user?.username,
    })
  if (gameStore?.character && authStore?.user?.username) {
    await colyseus.joinOrCreateLobby({
      userId: `${authStore.user.username}@${authStore?.user?.id}`,
      character: {
        name: gameStore?.character.name,
        heroClass: gameStore?.character.heroClass,
        magicka: gameStore?.character.CharacterAttribute.magicka,
        dexterity: gameStore?.character.CharacterAttribute.dexterity,
        intelligence: gameStore?.character.CharacterAttribute.intelligence,
        willpower: gameStore?.character.CharacterAttribute.willpower,
        strength: gameStore?.character.CharacterAttribute.strength,
        resistence: gameStore?.character.CharacterAttribute.resistence,
        vitality: gameStore?.character.CharacterAttribute.vitality,
        level: gameStore?.character.level,
        hp: gameStore?.character.CharacterAttribute.hp,
      },
    })
  }

  loading.value = false
}

const leave = async () => {
  const success = await colyseus.leaveLobby()

  if (success) router.push({ name: 'Character Dashboard' })
}

watchEffect(() => {
  clients.value = colyseus.clientsOnQueue
})

watchEffect(() => {
  const matchRoom = colyseus.gameRoom

  if (matchRoom?.roomId) {
    router.push({ name: 'Game Match' })
  }
})
onMounted(load)

// const router = useRouter()


</script>
