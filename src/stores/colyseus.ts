/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineStore } from 'pinia'
import { Client, Room } from 'colyseus.js'
import type Colyseus from 'colyseus.js'
import { useRouter } from 'vue-router'
import type {
  ICharacterInitial,
  MyRoomState,
  WinnerSchema,
} from '@/types/colyseus'
import router from '@/router'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import type { MapSchema } from '@colyseus/schema'
import { ref, type Ref } from 'vue'

export interface ColyseusState {
  client: Ref<Client | null>
  gameRoom: Ref<Room<MyRoomState> | null>
  gameState: Ref<MyRoomState | null>
  clientsOnQueue: Ref<string[]>
  winner: Ref<string | null>
  userMsg: Ref<string | null>
  enemyMsg: Ref<string | null>
  gameOverMsg: Ref<string | null>
  finalGameOverMsg: Ref<string | null>
  msgLog: Ref<string[]>
  userSessionId: Ref<string | null>
  lobby: Ref<Room<any> | null>
  currentTurn: Ref<number>
  currentRound: Ref<number>
  countdown: Ref<number>
  roundWinners: Ref<MapSchema<WinnerSchema> | null>
  colyseusInit: (authToken: string) => Promise<boolean>
  send: (actionType: string, msg?: any) => Promise<void>
  leaveLobby: () => Promise<boolean>
  leaveMatch: () => Promise<boolean>
  leaveUnfinishedMatch: () => Promise<boolean>
  joinGameReservation: (reservation: any) => Promise<void>
  joinOrCreateLobby: (options?: ICharacterInitial) => Promise<void>
  reconnectGame: (reservation: any) => Promise<void>
}

export const useColyseusStore = defineStore('colyseus', (): ColyseusState => {
  const client = ref<any>(null)
  const gameRoom = ref<any>(null)
  const gameState = ref<any>(null)
  const clientsOnQueue = ref<any>([])
  const winner = ref<any>(null)
  const userMsg = ref<string | null>(null)
  const enemyMsg = ref<string | null>(null)
  const gameOverMsg = ref<any>(null)
  const msgLog = ref<any>([])
  const userSessionId = ref<any>(null)
  const lobby = ref<any>(null)
  const currentTurn = ref<any>(1)
  const currentRound = ref<any>(1)
  const countdown = ref<any>(25)
  const roundWinners = ref<any>(null)
  const finalGameOverMsg = ref<any>(null)

  async function colyseusInit(authToken: string) {
    try {
      client.value = new Client(import.meta.env.VITE_SOCKET_URL)
      client.value.auth.token = authToken

      console.log('Connecting to colyseus server...')

      return true
    } catch (error) {
      console.log(error)
      console.log('Disconnecting from colyseus server...')
      router.push({ name: 'profile' })

      return false
    }
  }

  async function send(actionType: string, msg?: any) {
    gameRoom.value?.send(actionType, msg || {})
  }

  async function leaveLobby() {
    try {
      await lobby.value?.leave(true)
      lobby.value = null
      return true
    } catch (err) {
      console.log({ err })
      return false
    }
  }

  async function leaveMatch() {
    try {
      gameState.value = null
      gameRoom.value = null
      localStorage.removeItem('reconnectionToken')

      return true
    } catch (err) {
      console.log({ err })
      return false
    }
  }

  async function leaveUnfinishedMatch() {
    try {
      const result = gameRoom.value?.leave(true)
      if (result) {
        gameState.value = null
        gameRoom.value = null
        localStorage.removeItem('reconnectionToken')
        return true
      }
      return false
    } catch (err) {
      console.log({ err })
      return false
    }
  }

  async function joinGameReservation(reservation: any) {
    const room = await client.value
      ?.consumeSeatReservation(reservation)
      ?.then((room: any): Colyseus.Room<any> => {
        console.log(room.sessionId, 'joined', room.name)

        clientsOnQueue.value = []

        gameRoom.value = room

        gameOverMsg.value = null
        finalGameOverMsg.value = null

        winner.value = null

        msgLog.value = []

        enemyMsg.value = null

        userMsg.value = null

        return room
      })
      .catch((e: any) => {
        console.log('JOIN ERROR', e)
        router.push({ name: 'profile' })
      })

    if (!room) {
      console.log("couldn't join ", room)

      return
    }
    if (room) {
      const expiredAt = new Date(Date.now())
      expiredAt.setSeconds(expiredAt.getSeconds() + 60)

      localStorage.setItem(
        'reconnectionToken',
        JSON.stringify({
          token: room.reconnectionToken,
          expiredAt,
        }),
      )

      userSessionId.value = room.sessionId
    }

    room.onStateChange((state: MyRoomState) => {
      if (state?.winner) {
        winner.value = state?.winner
      }
      if (state?.roundWinners) {
        roundWinners.value = state?.roundWinners
      }

      if (state.countdown) {
        countdown.value = state.countdown
      }
      if (state.currentRound) {
        currentRound.value = state.currentRound
      }
      if (state.currentTurn) {
        currentTurn.value = state.currentTurn
      }

      // console.log({
      //   state: gameState.value,
      // })
      gameState.value = state
    })

    room.onMessage('Round Over', (messages: string) => {
      console.log('Round Over', room.name, messages)
      if (messages) {
        msgLog.value = [...msgLog.value, messages]
        gameOverMsg.value = messages
        setTimeout(() => (gameOverMsg.value = null))
      }
    })

    room.onMessage('Game Over', (messages: string) => {
      console.log('Game Over', room.name, messages)
      msgLog.value = [...msgLog.value, messages]
      console.log('Game Over', messages, JSON.stringify(room.state))
      if (messages) {
        const drawSettings = messages?.includes(
          'You won the match because your opponent was away.',
        )
          ? messages?.split(': ')
          : []

        const drawMessage =
          drawSettings.length < 2
            ? undefined
            : drawSettings[0] === userSessionId.value
              ? drawSettings[1]
              : "You lost the match because you didn't take any action."
        finalGameOverMsg.value = drawMessage || messages
      }
      localStorage.removeItem('reconnectionToken')
    })

    // room.state?.listen("currentRound", (value, prevValue) => {
    //   if (prevValue !== value) {
    //     toast("New Round");
    //   }
    // });
    // room.state?.listen("currentTurn", (value, prevValue) => {
    //   toast("New Turn");
    // });

    room.onMessage(
      'action',
      (messages: { playerMsg: string; opponentMsg: string }) => {
        const { playerMsg = '', opponentMsg = '' } = messages

        msgLog.value = [...msgLog.value, opponentMsg, playerMsg].filter(e =>
          Boolean(e),
        )

        userMsg.value = playerMsg

        enemyMsg.value = opponentMsg
      },
    )
    room.onMessage('chat', (messages: string) => {
      msgLog.value = [...msgLog.value, messages]
    })

    room.onMessage('warn', (messages: string) => {
      console.log(messages)
      toast(messages, {
        autoClose: 1000,
      })
    })

    room.onError((code: number) => {
      console.log("couldn't join", room.name, 'code: ', code)
    })

    room.onLeave((code: number) => {
      const expiredAt = new Date(Date.now())
      expiredAt.setSeconds(expiredAt.getSeconds() + 600)

      console.log({ reconnectionToken: room.reconnectionToken })

      localStorage.setItem(
        'reconnectionToken',
        JSON.stringify({
          token: room.reconnectionToken,
          expiredAt,
        }),
      )
    })
  }
  async function reconnectGame(reservation: any) {
    const room = await client.value
      ?.reconnect(reservation)
      ?.then((room: any): Colyseus.Room<any> => {
        console.log(room.sessionId, 'joined', room.name)

        clientsOnQueue.value = []

        gameRoom.value = room

        gameOverMsg.value = null
        finalGameOverMsg.value = null

        winner.value = null

        msgLog.value = []

        enemyMsg.value = null

        userMsg.value = null

        return room
      })
      .catch((e: any) => {
        console.log('JOIN ERROR', e)
        router.push({ name: 'profile' })
      })

    if (!room) {
      console.log("couldn't join ", room)

      return
    }
    if (room) {
      const expiredAt = new Date(Date.now())
      expiredAt.setSeconds(expiredAt.getSeconds() + 60)

      localStorage.setItem(
        'reconnectionToken',
        JSON.stringify({
          token: room.reconnectionToken,
          expiredAt,
        }),
      )

      userSessionId.value = room.sessionId
    }

    room.onStateChange((state: MyRoomState) => {
      if (state?.winner) {
        winner.value = state?.winner
      }
      if (state?.roundWinners) {
        roundWinners.value = state?.roundWinners
      }

      if (state.countdown) {
        countdown.value = state.countdown
      }
      if (state.currentRound) {
        currentRound.value = state.currentRound
      }
      if (state.currentTurn) {
        currentTurn.value = state.currentTurn
      }

      // console.log({
      //   state: gameState.value,
      // })
      gameState.value = state
    })

    room.onMessage('Round Over', (messages: string) => {
      console.log('Round Over', room.name, messages)
      if (messages) {
        msgLog.value = [...msgLog.value, messages]
        gameOverMsg.value = messages
        setTimeout(() => (gameOverMsg.value = null))
      }
    })

    room.onMessage('Game Over', (messages: string) => {
      console.log('Game Over', room.name, messages)
      msgLog.value = [...msgLog.value, messages]
      console.log('Game Over', messages, JSON.stringify(room.state))
      if (messages) {
        const drawSettings = messages?.includes(
          'You won the match because your opponent was away.',
        )
          ? messages?.split(': ')
          : []

        const drawMessage =
          drawSettings.length < 2
            ? undefined
            : drawSettings[0] === userSessionId.value
              ? drawSettings[1]
              : "You lost the match because you didn't take any action."
        finalGameOverMsg.value = drawMessage || messages
      }
      localStorage.removeItem('reconnectionToken')
    })

    // room.state?.listen("currentRound", (value, prevValue) => {
    //   if (prevValue !== value) {
    //     toast("New Round");
    //   }
    // });
    // room.state?.listen("currentTurn", (value, prevValue) => {
    //   toast("New Turn");
    // });

    room.onMessage(
      'action',
      (messages: { playerMsg: string; opponentMsg: string }) => {
        const { playerMsg = '', opponentMsg = '' } = messages

        msgLog.value = [...msgLog.value, opponentMsg, playerMsg].filter(e =>
          Boolean(e),
        )

        userMsg.value = playerMsg

        enemyMsg.value = opponentMsg
      },
    )
    room.onMessage('chat', (messages: string) => {
      msgLog.value = [...msgLog.value, messages]
    })

    room.onMessage('warn', (messages: string) => {
      console.log(messages)
      toast(messages, {
        autoClose: 1000,
      })
    })

    room.onError((code: number) => {
      console.log("couldn't join", room.name, 'code: ', code)
    })

    room.onLeave((code: number) => {
      const expiredAt = new Date(Date.now())
      expiredAt.setSeconds(expiredAt.getSeconds() + 600)

      console.log({ reconnectionToken: room.reconnectionToken })

      localStorage.setItem(
        'reconnectionToken',
        JSON.stringify({
          token: room.reconnectionToken,
          expiredAt,
        }),
      )
    })
  }

  async function joinOrCreateLobby(options?: ICharacterInitial) {
    const room = await client.value
      ?.joinOrCreate('lobby_room', options)
      .then((room: Room<any>) => {
        console.log(room.sessionId, 'joined', room.name)

        lobby.value = room

        return room
      })
      .catch((e: any) => {
        console.log('JOIN ERROR', e)
        router.push({ name: 'profile' })
      })

    if (!room) {
      console.log("couldn't join")

      return
    }

    room.onMessage('seat', (messages: string) => {
      console.log('messages received on', room.name, messages)
      room.leave()
      lobby.value = null
      joinGameReservation(messages)

      const expiredAt = new Date(Date.now())
      expiredAt.setSeconds(expiredAt.getSeconds() + 60)
    })

    room.onMessage('clients', (messages: string[]) => {
      console.log('messages received on', room.name, messages)
      console.log('clients change')
      clientsOnQueue.value = messages
    })

    room.onMessage('warn', (messages: string) => {
      toast(messages)
      console.log(messages)
    })

    room.onError((code: number) => {
      console.log("couldn't join", room.name, 'code: ', code)
      // const router = useRouter()
      // router.push({ name: 'profile' })
    })

    room.onLeave((code: number) => {
      console.log('left', room.name, 'code: ', code, JSON.stringify(room))
    })

    console.log({ room })
  }

  return {
    client,
    clientsOnQueue,
    countdown,
    currentRound,
    currentTurn,
    finalGameOverMsg,
    gameOverMsg,
    gameRoom,
    gameState,
    lobby,
    msgLog,
    enemyMsg,
    roundWinners,
    userMsg,
    userSessionId,
    winner,
    colyseusInit,
    send,
    leaveLobby,
    leaveMatch,
    leaveUnfinishedMatch,
    joinGameReservation,
    joinOrCreateLobby,
    reconnectGame,
  }
})
