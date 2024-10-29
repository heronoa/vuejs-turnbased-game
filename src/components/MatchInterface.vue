<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div
      class="w-full min-w-[250px] max-w-[700px] p-8 space-y-6 bg-white rounded shadow-md"
    >
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
            }}<progress
              :value="player.mana || 100"
              :max="player.maxMana || 100"
            />
          </div>
        </div>
        <div class="flex flex-col gap-4 justify-between">
          <div class="flex flex-col gap-4 justify-center items-center">
            <div class="min-h-[20px]">{{ userMsg }}</div>
            <div class="min-h-[20px]">
              {{ finalGameOverMsg || finalGameOverMsg }}
            </div>
            <div
              v-on:click="leaveMatch"
              v-if="finalGameOverMsg && finalGameOverMsg.length > 1"
              class="min-h-[20px] w-[100px] text-center py-2 px-4 mt-4 cursor-pointer text-white bg-blue-500 rounded"
            >
              Leave
            </div>
            <div class="min-h-[20px]">{{ opponentMsg }}</div>
          </div>
          <div class="flex gap-4 justify-center">
            <div
              class="min-w-md py-2 px-4 mt-4 cursor-pointer text-white bg-blue-500 rounded"
              v-on:click="sendAtk"
            >
              Atk
            </div>

            <div
              v-on:click="sendDef"
              class="min-w-md py-2 px-4 mt-4 cursor-pointer text-white bg-blue-500 rounded"
            >
              Def
            </div>
            <div
              v-on:click="sendBrk"
              class="min-w-md py-2 px-4 mt-4 cursor-pointer text-white bg-blue-500 rounded"
            >
              Brk
            </div>
            <div
              v-on:click="sendSp"
              class="min-w-md py-2 px-4 mt-4 cursor-pointer text-white bg-blue-500 rounded"
            >
              Sp
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-4">
          <div class="w-[70px] h-[100px] bg-amber-600"></div>
          <div>{{ opponent.userId.split('@')[0] }}</div>
          <div class="flex flex-col">
            {{ opponent.hp }}/{{ opponent.max_hp
            }}<progress
              :value="opponent.hp || 100"
              :max="opponent.max_hp || 100"
            />
          </div>
          <div class="flex flex-col">
            {{ opponent.mana }}/{{ opponent.maxMana
            }}<progress
              :value="opponent.mana || 100"
              :max="opponent.maxMana || 100"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
// import { useAuthStore } from '../stores/auth'
import { useColyseusStore } from '@/stores/colyseus'
import type { MyRoomState, PlayerSchema } from '@/types/colyseus'

export default defineComponent({
  setup() {
    const colyseus = useColyseusStore()
    const router = useRouter()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const player = ref<PlayerSchema | undefined | null | any>()
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gameState = ref<MyRoomState | any | undefined | null>()
    const loading = ref(true)

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

    const sendAtk = () => {
      colyseus.send('atk')
    }
    const sendDef = () => {
      colyseus.send('def')
    }
    const sendBrk = () => {
      colyseus.send('brk')
    }
    const sendSp = () => {
      colyseus.send('sp')
    }

    return {
      player,
      gameState,
      opponent,
      currentTurn,
      currentRound,
      loading,
      userMsg,
      opponentMsg,
      countdown,
      gameOverMsg,
      roundWinners,
      finalGameOverMsg,
      leaveMatch,
      sendAtk,
      sendDef,
      sendBrk,
      sendSp,
    }
  },
})
</script>
