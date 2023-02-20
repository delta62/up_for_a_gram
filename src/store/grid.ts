import { createReducer } from '@reduxjs/toolkit'
import { GridRow } from '../dfac-api'
import { createGame, updateCell } from './actions'

export type GridState = GridRow[]

const DEFAULT_STATE: GridState = []

let grid = createReducer(DEFAULT_STATE, builder => {
  builder
    .addCase(createGame, (_, action) => action.payload.game.grid)
    .addCase(updateCell, (state, action) => {
      let { r, c } = action.payload.cell
      let { value } = action.payload

      state[r][c].value = value
    })
})

export default grid
