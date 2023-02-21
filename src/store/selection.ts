import { createGame, moveCursor } from './actions'
import { CellRef } from '../dfac-api'
import { createReducer } from '@reduxjs/toolkit'

export type SelectionState = CellRef

const DEFAULT_STATE: CellRef = { r: 0, c: 0 }

let selection = createReducer(DEFAULT_STATE, builder => {
  builder
    .addCase(createGame, () => DEFAULT_STATE)
    .addCase(moveCursor, (_, action) => action.payload.cell)
})

export default selection
