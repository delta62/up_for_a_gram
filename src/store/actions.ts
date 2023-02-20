import { createAction } from '@reduxjs/toolkit'
import { Rgb } from '../color'
import { CellRef, WsGame } from '../dfac-api'

export interface CreateGame {
  game: WsGame
}

export interface UpdateCell {
  cell: CellRef
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

export type Reveal = Check

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
export let moveCursor = createAction<MoveCursor>('MOVE_CURSOR')
export let switchMode = createAction('SWITCH_MODE')
export let check = createAction<Check>('CHECK')
export let reveal = createAction<Reveal>('REVEAL')
