export interface ICharacterAttribute {
  id: string

  hp: number
  magicka: number
  strength: number
  dexterity: number
  willpower: number
  resistence: number
  intelligence: number
  vitality: number
}

type Effect = 'DAMAGE' | 'STATUS' | 'BUFF'

type SkillType = 'FIRE' | 'WATER' | 'EARTH' | 'AIR' | 'BLUNT' | 'CUT' | 'PIERCE'

export interface Skill {
  id: string
  name: string
  duration?: string
  effect: Effect
  baseDamage?: number
  type: SkillType
  baseCost: number
  countdown: number
  channeling?: number
}

export interface ICharacter {
  id: string
  name: string
  CharacterAttribute: ICharacterAttribute
  exp: number
  level: number
  levelupExp: number
  heroClass: string
  skill: Skill[]
}

export interface IUser {
  email: string
  username: string
  id: string
  character?: ICharacter[]
}

export interface ISignupFields {
  email: string
  password: string
  passwordConfirmation: string
  username: string
}
