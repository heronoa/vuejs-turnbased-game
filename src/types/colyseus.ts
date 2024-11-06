import { Schema, MapSchema } from '@colyseus/schema'

export interface StatusSchema extends Schema {
  type: string
  duration: number
  damage?: number
  factors?: string
}

export interface SkillCountdownSchema extends Schema {
  duration: number
  id: string
}
export interface PlayerSchema extends Schema {
  status: StatusSchema[]
  skill_countdown: MapSchema<SkillCountdownSchema>

  userId: string
  connected: boolean

  heroClass: string
  hp: number
  max_hp: number
  playerName: string
  afkSequel: number
  baseDamage: number
  damage: number
  hasCA: boolean
  CAfactor: number
  hasShield: boolean
  breakSequel: number
  maxBreakSequel: number
  mana: number
  maxMana: number
  strength: number
  dexterity: number
  vitality: number
  willpower: number
  intelligence: number
  initialMana: number
  manaRegen: number
  specialDamage: number
  meleeOdd: number
  meleeDefOdd: number
  specialOdd: number
  specialDefOdd: number
  meleeDodgeOdd: number
  specialDodgeOdd: number
}

export interface ActionSchema extends Schema {
  action: string
  player: string
}
export interface WinnerSchema extends Schema {
  round: number
  winner: string
}

export interface MyRoomState extends Schema {
  currentTurn: number
  currentRound: number
  countdown: number
  winner: string
  history: string
  db_id: string
  isRanked: boolean

  players: MapSchema<PlayerSchema>
  actions: MapSchema<ActionSchema>
  roundWinners: MapSchema<WinnerSchema>
}

export interface ICharacterInitial {
  userId: string
  character: {
    name: string
    magicka: number
    dexterity: number
    intelligence: number
    willpower: number
    strength: number
    resistence: number
    vitality: number
    level: number
    hp: number
  }
}
