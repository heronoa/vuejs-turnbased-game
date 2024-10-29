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

export interface ICharacter {
  id: string
  name: string
  CharacterAttribute: ICharacterAttribute
  exp: number
  level: number
  levelupExp: number
  heroClass: string
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
