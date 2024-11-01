<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full min-w-[250px] max-w-[700px] p-8 space-y-6 bg-white rounded shadow-md">
      <div class="flex flex-col">
        <h2 class="text-2xl font-bold text-center">Battle - {{ countdown }}</h2>
        <h4 class="text-center">
          Turn: {{ currentTurn }} Round: {{ currentRound }}
        </h4>
      </div>
      <div class="flex gap-4">
        <div class="flex flex-col gap-4 items-end">
          <div class="w-[70px] h-[100px] bg-amber-600"></div>
          <div>{{ player.userId.split('@')[0] }}</div>
          <div class="flex flex-col">
            {{ player.hp }}/{{ player.max_hp
            }}<progress :value="player.hp || 100" :max="player.max_hp || 100" />
          </div>
          <div class="flex flex-col">
            {{ player.mana }}/{{ player.maxMana
            }}<progress :value="player.mana || 100" :max="player.maxMana || 100" />
          </div>
        </div>
        <div class="flex flex-col gap-4 justify-between min-w-[300px]">
          <div class="flex flex-col gap-4 justify-center items-center">
            <div class="min-h-[20px]">{{ userMsg }}</div>
            <div class="min-h-[20px]">
              {{ finalGameOverMsg || finalGameOverMsg }}
            </div>
            <div v-on:click="leaveMatch" v-if="finalGameOverMsg && finalGameOverMsg.length > 1"
              class="min-h-[20px] w-[100px] text-center py-2 px-4 mt-4 cursor-pointer text-white bg-blue-500 rounded">
              Leave
            </div>
            <div class="min-h-[20px]">{{ opponentMsg }}</div>
          </div>
        </div>
        <div class="flex flex-col gap-4">
          <div class="w-[70px] h-[100px] bg-amber-600"></div>
          <div>{{ opponent.userId.split('@')[0] }}</div>
          <div class="flex flex-col">
            {{ opponent.hp }}/{{ opponent.max_hp
            }}<progress :value="opponent.hp || 100" :max="opponent.max_hp || 100" />
          </div>
          <div class="flex flex-col">
            {{ opponent.mana }}/{{ opponent.maxMana
            }}<progress :value="opponent.mana || 100" :max="opponent.maxMana || 100" />
          </div>
        </div>
      </div>
      <div class="flex gap-4 justify-center w-full flex-wrap">
        <div class="min-w-md py-2 px-4 mt-4 cursor-pointer text-white bg-blue-500 rounded"
          v-for="skill in character?.skill" :key="skill.id" v-on:click="() => sendSkill(skill)">
          {{ skill.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
// import { useAuthStore } from '../stores/auth'
import { useGameStore } from '@/stores/game'
import { useColyseusStore } from '@/stores/colyseus'
import type { PlayerSchema } from '@/types/colyseus'
import type { Skill } from '@/types/auth'

const colyseus = useColyseusStore()
const router = useRouter()
const gameStore = useGameStore()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const player = ref<PlayerSchema | undefined | null | any>()

const character = ref(gameStore.character)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const opponent = ref<PlayerSchema | undefined | null | any>()
const currentTurn = ref<number | undefined | null>()
const currentRound = ref<number | undefined | null>()
const userMsg = ref()
const gameOverMsg = ref()
const finalGameOverMsg = ref()
const opponentMsg = ref()
const countdown = ref()
const roundWinners = ref()

// const gameState = ref<MyRoomState | any | undefined | null>()
// const loading = ref(true)

watchEffect(() => {
  if (colyseus.gameRoom === null) {
    router.push('/profile')
  }
})

watchEffect(() => {
  countdown.value = colyseus?.countdown
})
watchEffect(() => {
  roundWinners.value = colyseus?.roundWinners

  console.log({ roundWinners: roundWinners.value })
})

watchEffect(() => {
  currentTurn.value = colyseus?.currentTurn
})

watchEffect(() => {
  currentRound.value = colyseus?.currentRound
})

watchEffect(() => {
  gameOverMsg.value = colyseus.gameOverMsg
})
watchEffect(() => {
  finalGameOverMsg.value = colyseus.finalGameOverMsg
})

watchEffect(() => {
  if (colyseus?.gameState && colyseus.userSessionId) {
    player.value = colyseus?.gameState.players.get(colyseus.userSessionId)
    const opponentKey = Array.from(colyseus?.gameState.players.keys()).find(
      v => v !== colyseus.userSessionId,
    )

    if (opponentKey)
      opponent.value = colyseus?.gameState.players.get(opponentKey)
  }
})

watchEffect(() => {
  if (colyseus?.gameState && colyseus.userSessionId) {
    userMsg.value = colyseus?.userMsg
    opponentMsg.value = colyseus?.opponentMsg
  }
})
// const router = useRouter()

const leaveMatch = async () => {
  const success = await colyseus.leaveMatch()
  if (success) router.push('/game/dashboard')
}

const sendSkill = (skill: Skill) => {
  colyseus.send('action', skill)
}


</script>
