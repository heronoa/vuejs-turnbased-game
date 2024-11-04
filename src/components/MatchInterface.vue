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
              <div class="relative">
                <div v-if="playerMap?.map" class="map">
                  <div v-for="(tile1, index) in playerMap.map" :key="index" :value="tile1" class="flex flex-wrap">
                    <div v-for="(tile2, index2) in tile1.tilesets" :key="index2" :value="tile2"
                      class="border border-solid border-gray-400 ">
                      <div class="w-[24px] h-[25px] flex justify-center items-center">
                        <div v-if="index === selectedMovement?.x && index2 === selectedMovement?.y"
                          class="w-[20px] h-[20px] bg-amber-600 truncate"></div>
                        <div v-else-if="tile2.enabled" class="w-[20px] h-[20px] bg-lime-300"
                          v-on:click="() => handleTileSelect(index, index2)"></div>
                        <!-- <div v-else class="w-[20px] h-[20px] bg-slate-500"></div> -->
                        <div v-else-if="tile2.playerId !== ''" class="w-[20px] h-[20px] bg-amber-600 truncate">
                          {{ tile2.playerId }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
                <div v-if="opponentMap?.map" class="map">
                  <div v-for="(tile1, index) in opponentMap.map" :key="index" :value="tile1" class="flex flex-wrap">
                    <div v-for="(tile2, index2) in tile1.tilesets" :key="index2" :value="tile2"
                      class="border border-solid border-gray-400 ">
                      <div class="w-[24px] h-[25px] flex justify-center items-center">
                        <div v-if="tile2.enabled" class="w-[20px] h-[20px] bg-lime-300"></div>
                        <!-- <div v-else class="w-[20px] h-[20px] bg-slate-500"></div> -->
                        <div v-if="tile2.playerId !== ''" class="w-[20px] h-[20px] bg-amber-600">
                          {{ tile2.playerId }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
      <div class="flex gap-2 justify-center items-center ">
        <div class="">
          Action
          <div v-if="selectedAction"
            class="border py-2 px-3 flex justify-center items-center border-gray-400 border-solid">
            {{ selectedAction.name }}
          </div>
        </div>
        <div v-if="selectedMovement">
          Movement
          <div class="border flex gap-1 py-2 justify-center items-center border-gray-400 border-solid">
            x:{{ selectedMovement.x }}
            y:{{ selectedMovement.y }}
            <div class="bg-red-500 px-1 cursor-pointer" v-on:click="() => {
              selectedMovement = undefined
            }">X</div>
          </div>
        </div>

      </div>
      <div class="flex gap-4 justify-center w-full flex-wrap">
        <div class="flex gap-4 justify-center w-full flex-wrap" v-if="menu === 'atk'">
          <div class="min-w-md py-2 px-4 mt-4 cursor-pointer text-white bg-blue-500 rounded"
            v-for="skill in character?.skill" :key="skill.id"
            v-on:click="() => { if (!countdownMap?.get(skill.id)) { selectedAction = skill; menu = ''; } }">
            {{ skill.name }} {{ countdownMap?.get(skill.id) ? ` - ${countdownMap?.get(skill.id)?.duration}` : "" }}
          </div>
          <div class="min-w-md py-2 px-4 mt-4 cursor-pointer text-white bg-blue-500 rounded"
            v-for="(menuItem, idx) in [{ name: 'Back', value: '' }]" :key="idx"
            v-on:click="() => { menu = (menuItem.value as '' | 'atk' | 'move' | 'confirm') }">
            {{ menuItem.name }}
          </div>
        </div>
        <div class="flex gap-4 justify-center w-full flex-wrap" v-else-if="menu === ''">
          <div class="min-w-md py-2 px-4 mt-4 cursor-pointer text-white bg-blue-500 rounded"
            v-for="(menuItem, idx) in [{ name: 'Attack', value: 'atk' }, { name: 'Move', value: 'move' }, { name: 'Confirm', value: 'confirm' }]"
            :key="idx" v-on:click="() => { menu = (menuItem.value as '' | 'atk' | 'move' | 'confirm') }">
            {{ menuItem.name }}
          </div>

        </div>
        <div class="flex gap-4 justify-center items-center flex-col w-full flex-wrap" v-else-if="menu === 'move'">
          <div>Click on a Tile on your map to Move</div>
          <div class="flex">
            <div class="min-w-md py-2 px-4 mt-4 cursor-pointer text-white bg-blue-500 rounded"
              v-for="(menuItem, idx) in [{ name: 'Back', value: '' }]" :key="idx"
              v-on:click="() => { menu = (menuItem.value as '' | 'atk' | 'move' | 'confirm') }">
              {{ menuItem.name }}
            </div>
          </div>
        </div>
        <div class="flex gap-4 justify-center w-full flex-wrap" v-else-if="menu === 'confirm'">

          <div class="min-w-md py-2 px-4 mt-4 cursor-pointer text-white bg-blue-500 rounded"
            v-for="(menuItem, idx) in [{ name: 'Confirm', value: 'confirm' }, { name: 'Back', value: '' }]" :key="idx"
            v-on:click="() => {
              if (menuItem.value === 'confirm') {
                sendAction();
              }
              menu = ''
            }">
            {{ menuItem.name }}
          </div>
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
import { toast } from 'vue3-toastify'

const colyseus = useColyseusStore()
const router = useRouter()
const gameStore = useGameStore()
const character = ref(gameStore.character)
const menu = ref<"" | "atk" | "move" | "confirm">("")
const selectedAction = ref<Skill>()
const selectedMovement = ref<{ x: number, y: number }>()

const handleTileSelect = (x: number, y: number) => {
  if (menu.value === "move") {
    selectedMovement.value = {
      x, y
    }
  }
}

const gameState = computed(() => {
  const gameState = colyseus.gameState;

  console.log({ gameState })

  return colyseus.gameState
})



const countdownMap = computed(() => {
  return player.value?.skill_countdown
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
    return colyseus?.enemyMsg
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

const playerMap = computed(() => {
  return colyseus.gameState?.battleField.get(player.value?.playerName || "") || null
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

const opponentMap = computed(() => {
  return colyseus?.gameState?.battleField.get(opponent.value?.playerName || "") || null
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

const sendAction = () => {
  if (!selectedAction.value) {
    toast("Escolha pelo menos uma ação para prosseguir")
    return
  }

  colyseus.send('action', { skill: selectedAction, movement: selectedMovement })
}


</script>
