<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full min-w-[250px] max-w-[700px] p-8 space-y-6 bg-white rounded shadow-md">
      <div class="flex flex-col">
        <h2 class="text-2xl font-bold text-center"> Battle - {{ countdown || 25 }}</h2>
        <div class="flex justify-center items-center">

          <div v-on:click="runFromBattle" class="max-w-md py-2 px-4 mt-4 cursor-pointer text-white bg-blue-500 rounded">
            Run</div>
        </div>
        <h4 class="text-center flex justify-center items-center">
          Turn: {{
            gameState?.currentTurn || 1 }} Round: {{ gameState?.currentRound || 1 }}
        </h4>
      </div>
      <div class="flex gap-4">
        <div v-if="player" class="flex flex-col gap-4 items-end ">

          <div class="flex gap-2 ">
            <div class="flex flex-col gap-2">
              <div class="bg-lime-500 h-[25px]" v-for="(stats, index) in player.status" :key="index" :value="stats">
                {{ stats.type }}
              </div>
            </div>
            <div class="flex flex-col gap-2">
              <div class="flex gap-2 justify-end">
                <div v-for="(wins, index) in playerWins" :key="index" :value="wins"
                  class="w-[10px] h-[10px] bg-green-400"></div>
              </div>
              <div class="w-[70px] h-[100px] bg-amber-600"></div>
            </div>
          </div>
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
              {{ finalGameOverMsg || gameOverMsg }}
            </div>
            <div v-on:click="leaveMatch" v-if="finalGameOverMsg && finalGameOverMsg.length > 1"
              class="min-h-[20px] w-[100px] text-center py-2 px-4 mt-4 cursor-pointer text-white bg-blue-500 rounded">
              Leave
            </div>
            <div class="min-h-[20px]">{{ opponentMsg }}</div>
          </div>
        </div>
        <div v-if="opponent" class="flex flex-col gap-4">
          <div class="flex gap-2 ">

            <div class="flex flex-col gap-2">
              <div class="flex gap-2 ">
                <div v-for="(wins, index) in opponentWins" :key="index" :value="wins"
                  class="w-[10px] h-[10px] bg-green-400"></div>
              </div>
              <div class="relative">
                <div class="relative z-1 w-[70px] h-[100px] bg-amber-600"></div>
                <!-- <div class="absolute z-2 inset-0 damage-animation-portrait">
                  <div class="relative damage-animation"></div>
                </div> -->
              </div>
            </div>
            <div class="flex flex-col gap-2">
              <div class="bg-lime-500 h-[25px]" v-for="(stats, index) in opponent.status" :key="index" :value="stats">
                {{ stats.type }}
              </div>
            </div>
          </div>
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
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
// import { useAuthStore } from '../stores/auth'
import { useGameStore } from '@/stores/game'
import { useColyseusStore } from '@/stores/colyseus'
import type { Skill } from '@/types/auth'

const colyseus = useColyseusStore()
const router = useRouter()
const gameStore = useGameStore()
const character = ref(gameStore.character)

const gameState = computed(() => {
  const gameState = colyseus.gameState;

  console.log({ gameState })

  return colyseus.gameState
})

const countdown = computed(() => {
  return colyseus.countdown
})

const userMsg = computed(() => {
  if (gameState.value) {
    return colyseus?.userMsg
  }
  return undefined
})

const opponentMsg = computed(() => {
  if (colyseus?.gameState) {
    return colyseus?.opponentMsg
  } return undefined
})

const gameOverMsg = computed(() => {
  return colyseus.gameOverMsg
})

const finalGameOverMsg = computed(() => {
  return colyseus.finalGameOverMsg
})

const player = computed(() => {
  if (gameState.value && colyseus.userSessionId) {
    return gameState.value.players.get(colyseus.userSessionId)
  }
  return null
})



const opponent = computed(() => {
  if (gameState.value && colyseus.userSessionId) {
    const opponentKey = Array.from(gameState.value.players.keys()).find(
      v => v !== colyseus.userSessionId,
    )


    if (opponentKey)
      return gameState.value.players.get(opponentKey)

    return null
  }
  return null
})

const playerWins = computed(() => {
  const roundWinners = gameState?.value?.roundWinners
  const pWins = Array.from(gameState?.value?.roundWinners?.values() || [])

  console.log({ pWins, roundWinners })

  return pWins.filter(win => win.winner === (player?.value?.userId || "0"))

})

const opponentWins = computed(() => {
  const roundWinners = gameState?.value?.roundWinners

  const opWins = Array.from(gameState?.value?.roundWinners?.values() || [])

  console.log({ opWins, roundWinners })


  return opWins.filter(win => win.winner === (opponent?.value?.userId || "0"))

})

const runFromBattle = async () => {
  const success = await colyseus.leaveUnfinishedMatch()
  if (success) router.push({ name: 'Character Dashboard' })
}

const leaveMatch = async () => {
  const success = await colyseus.leaveMatch()
  if (success) router.push({ name: 'Character Dashboard' })
}

const sendSkill = (skill: Skill) => {
  colyseus.send('action', skill)
}


</script>
