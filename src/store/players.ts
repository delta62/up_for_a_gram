import { CellRef } from '../dfac-api'
import { Rgb } from '../color'
import { createReducer } from '@reduxjs/toolkit'
import {
  updatePlayerColor,
  updatePlayerCursor,
  updatePlayerName,
} from './actions'

export interface Player {
  id: string
  name: string
  color: Rgb
  cursor: CellRef
}

export type PlayersState = Record<string, Player>

const DEFAULT_STATE: PlayersState = {}

const DEFAULT_PLAYER: Player = {
  id: '',
  name: '?',
  color: { r: 255, g: 0, b: 0 },
  cursor: { r: 0, c: 0 },
}

let players = createReducer(DEFAULT_STATE, builder => {
  builder
    .addCase(updatePlayerCursor, (state, action) => {
      let { playerId, cell } = action.payload
      state[playerId] ??= DEFAULT_PLAYER
      state[playerId].id = playerId
      state[playerId].cursor = cell
    })
    .addCase(updatePlayerColor, (state, action) => {
      let { playerId, color } = action.payload
      state[playerId] ??= DEFAULT_PLAYER
      state[playerId].id = playerId
      state[playerId].color = color
    })
    .addCase(updatePlayerName, (state, action) => {
      let { playerId, name } = action.payload
      state[playerId] ??= DEFAULT_PLAYER
      state[playerId].id = playerId
      state[playerId].name = name
    })
})

export default players
