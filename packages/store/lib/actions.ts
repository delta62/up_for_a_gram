import { createAction } from '@reduxjs/toolkit'
import { CellRef, WsGame } from 'api'
import { ModeState } from './mode'

export interface Rgb {
  r: number
  g: number
  b: number
}

export interface Hsl {
  h: number
  s: number
  l: number
}

const HSL_PATTERN = /^hsl\(\d+,\s*\d+%,\s*\d+%\)$/

export const DEFAULT_COLOR: Hsl = { h: 146, s: 40, l: 60 }

export let parseHsl = (str: string): Hsl | null => {
  let matches = str.match(HSL_PATTERN)
  if (!matches) return null

  let [h, s, l] = matches.slice(1).map(x => parseInt(x, 10)) as [
    number,
    number,
    number
  ]

  return { h, s, l }
}

export let hslToRgb = ({ h, s, l }: Hsl): Rgb => {
  l /= 100

  let a = (s * Math.min(l, 1 - l)) / 100

  let extractComponent = (n: number) => {
    let k = (n + h / 30) % 12
    let color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color)
  }

  return {
    r: extractComponent(0),
    g: extractComponent(8),
    b: extractComponent(4),
  }
}

export interface CreateGame {
  game: WsGame
}

export interface UpdateCell {
  cell: CellRef
  correct: boolean
  value: string
}

export interface UpdatePlayerColor {
  playerId: string
  color: Rgb
}

export interface UpdatePlayerName {
  playerId: string
  name: string
}

export interface UpdatePlayerCursor {
  playerId: string
  cell: CellRef
}

export type MoveCursor = CellRef

export interface Check {
  scope: CellRef[]
}

export interface Reveal extends Check {
  solution: string[][]
}

export let createGame = createAction<CreateGame>('CREATE_GAME')
export let updateCell = createAction<UpdateCell>('UPDATE_CELL')
export let updatePlayerColor = createAction<UpdatePlayerColor>(
  'UPDATE_PLAYER_COLOR'
)
export let updatePlayerName =
  createAction<UpdatePlayerName>('UPDATE_PLAYER_NAME')
export let updatePlayerCursor = createAction<UpdatePlayerCursor>(
  'UPDATE_PLAYER_CURSOR'
)
export let moveCursor = createAction<MoveCursor, 'MOVE_CURSOR'>('MOVE_CURSOR')
export let switchMode = createAction('SWITCH_MODE')
export let setMode = createAction<ModeState, 'SET_MODE'>('SET_MODE')
export let check = createAction<Check, 'CHECK'>('CHECK')
export let reveal = createAction<Reveal, 'REVEAL'>('REVEAL')
export let setCell = createAction<UpdateCell, 'SET_CELL'>('SET_CELL')

// These actions are ignored by the store; they are for sending to the server
export type StartCheck = Check
export type StartReveal = Reveal
export let startCheck = createAction<StartCheck, 'START_CHECK'>('START_CHECK')
export let startReveal = createAction<StartReveal, 'START_REVEAL'>(
  'START_REVEAL'
)
