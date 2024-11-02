/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineStore } from 'pinia'
import { Client, Room } from 'colyseus.js'
import type Colyseus from 'colyseus.js'
import { useRouter } from 'vue-router'
import type { ICharacterInitial, MyRoomState } from '@/types/colyseus'
import router from '@/router'

export interface ColyseusState {
  client: Client | null
  gameRoom: Room<MyRoomState> | null
  gameState: MyRoomState | null
  clientsOnQueue: string[]
  winner: string | null
  userMsg: string | null
  opponentMsg: string | null
  gameOverMsg: string | null
  finalGameOverMsg: string | null
  msgLog: string[]
  userSessionId: string | null
  lobby: Room<any> | null
  currentTurn: number
  currentRound: number
  countdown: number
  roundWinners: any[]
}

export const useColyseusStore = defineStore('colyseus', {
  state: (): ColyseusState => ({
    client: null,
    gameRoom: null,
    gameState: null,
    clientsOnQueue: [],
    winner: null,
    userMsg: null,
    opponentMsg: null,
    gameOverMsg: null,
    msgLog: [],
    userSessionId: null,
    lobby: null,
    currentTurn: 1,
    currentRound: 1,
    countdown: 25,
    roundWinners: [],
    finalGameOverMsg: null,
  }),
  actions: {
    async colyseusInit(authToken: string) {
      try {
        this.client = new Client(import.meta.env.VITE_SOCKET_URL)
        this.client.auth.token = authToken

        console.log('Connecting to colyseus server...')

        return true
      } catch (error) {
        console.log(error)
        console.log('Disconnecting from colyseus server...')
        router.push({ name: 'profile' })

        return false
      }
    },
    async send(actionType: string, msg?: any) {
      this.gameRoom?.send(actionType, msg || {})
    },

    async leaveLobby() {
      try {
        await this.lobby?.leave(true)
        this.lobby = null
        return true
      } catch (err) {
        console.log({ err })
        return false
      }
    },
    async leaveMatch() {
      try {
        this.gameState = null
        this.gameRoom = null
        localStorage.removeItem('reconnectionToken')

        return true
      } catch (err) {
        console.log({ err })
        return false
      }
    },
    async leaveUnfinishedMatch() {
      try {
        const result = this.gameRoom?.leave(true)
        if (result) {
          this.gameState = null
          this.gameRoom = null
          localStorage.removeItem('reconnectionToken')
          return true
        }
      } catch (err) {
        console.log({ err })
        return false
      }
    },

    async joinGameReservation(reservation: any) {
      const room = await this.client
        ?.consumeSeatReservation(reservation)
        ?.then((room: any): Colyseus.Room<any> => {
          console.log(room.sessionId, 'joined', room.name)

          this.clientsOnQueue = []

          this.gameRoom = room

          this.gameOverMsg = null
          this.finalGameOverMsg = null

          this.winner = null

          this.msgLog = []

          this.opponentMsg = null

          this.userMsg = null

          return room
        })
        .catch(e => {
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

        this.userSessionId = room.sessionId
      }

      room.onStateChange(state => {
        if (state?.winner) {
          this.winner = state?.winner
        }
        if (state?.roundWinners) {
          this.roundWinners = state?.roundWinners
        }

        if (state.countdown) {
          this.countdown = state.countdown
        }
        if (state.currentRound) {
          this.currentRound = state.currentRound
        }
        if (state.currentTurn) {
          this.currentTurn = state.currentTurn
        }

        console.log({
          state: this.gameState,
        })
        this.gameState = state
      })

      room.onMessage('Round Over', messages => {
        console.log('Round Over', room.name, messages)
        if (messages) {
          this.msgLog = [...this.msgLog, messages]
          this.gameOverMsg = messages
          setTimeout(() => (this.gameOverMsg = null))
        }
      })

      room.onMessage('Game Over', messages => {
        console.log('Game Over', room.name, messages)
        this.msgLog = [...this.msgLog, messages]
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
              : drawSettings[0] === this.userSessionId
                ? drawSettings[1]
                : "You lost the match because you didn't take any action."
          this.finalGameOverMsg = drawMessage || messages
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

      room.onMessage('action', messages => {
        const {
          playerMsg = '',
          opponentMsg = '',
          playerRawMsg,
          playerDamageTaken = 0,
          opponentDamageTaken = 0,
        } = messages

        this.msgLog = [...this.msgLog, opponentMsg, playerMsg].filter(e =>
          Boolean(e),
        )

        this.userMsg = playerMsg

        this.opponentMsg = opponentMsg
      })
      room.onMessage('chat', messages => {
        this.msgLog = [...this.msgLog, messages]
      })

      room.onMessage('warn', messages => {
        console.log(messages)
      })

      room.onError((code, message) => {
        console.log("couldn't join", room.name, 'code: ', code)
      })

      room.onLeave(code => {
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

        // setGameState(null);
        // setWinner(null);
        // setStage("selection");
      })
    },
    async joinOrCreateLobby(options?: ICharacterInitial) {
      const room = await this.client
        ?.joinOrCreate('lobby_room', options)
        .then(room => {
          console.log(room.sessionId, 'joined', room.name)

          this.lobby = room

          return room
        })
        .catch(e => {
          console.log('JOIN ERROR', e)
          router.push({ name: 'profile' })
        })

      if (!room) {
        console.log("couldn't join")

        return
      }

      room.onMessage('seat', messages => {
        console.log('messages received on', room.name, messages)
        room.leave()
        this.lobby = null
        this.joinGameReservation(messages)

        const expiredAt = new Date(Date.now())
        expiredAt.setSeconds(expiredAt.getSeconds() + 60)
      })

      room.onMessage('clients', messages => {
        console.log('messages received on', room.name, messages)
        console.log('clients change')
        this.clientsOnQueue = messages
      })

      room.onMessage('warn', messages => {
        console.log(messages)
      })

      room.onError((code, message) => {
        console.log("couldn't join", room.name, 'code: ', code)
        // const router = useRouter()
        // router.push({ name: 'profile' })
      })

      room.onLeave(code => {
        console.log('left', room.name, 'code: ', code, JSON.stringify(room))
      })

      console.log({ room })
    },
  },
})
