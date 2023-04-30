import { createAction } from '@reduxjs/toolkit'
import { Rgb } from '../color'
import { CellRef, WsGame } from '../dfac-api'
import { ModeState } from './mode'

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

export interface MoveCursor {
  cell: CellRef
}

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
