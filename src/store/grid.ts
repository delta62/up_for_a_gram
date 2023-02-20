import { createReducer } from '@reduxjs/toolkit'
import { GridCell } from '../dfac-api'
import { check, createGame, reveal, updateCell } from './actions'

export interface Cell extends GridCell {
  checked?: true
  revealed?: true
}

export type GridState = Cell[][]

const DEFAULT_STATE: GridState = []

let grid = createReducer<GridState>(DEFAULT_STATE, builder => {
  builder
    .addCase(createGame, (_, action) => action.payload.game.grid)
    .addCase(updateCell, (state, action) => {
      let { r, c } = action.payload.cell
      let { value } = action.payload

      state[r][c].value = value
    })
    .addCase(check, (state, action) => {
      for (let { r, c } of action.payload.scope) {
        state[r][c].checked = true
      }
    })
    .addCase(reveal, (state, action) => {
      for (let { r, c } of action.payload.scope) {
        state[r][c].revealed = true
      }
    })
})

export default grid
