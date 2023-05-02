import { createGame, moveCursor } from './actions'
import { CellRef } from 'api'
import { createReducer } from '@reduxjs/toolkit'

export type SelectionState = CellRef

const DEFAULT_STATE: CellRef = { r: 0, c: 0 }

let selection = createReducer(DEFAULT_STATE, builder => {
  builder
    .addCase(createGame, (_, action) => {
      // Find the first non-black square
      return action.payload.game.grid
        .flatMap((row, r) =>
          row.map((cell, c) => ({
            r,
            c,
            black: cell.black,
          }))
        )
        .filter(cell => !cell.black)
        .map(({ r, c }) => ({ r, c }))[0]
    })
    .addCase(moveCursor, (_, action) => action.payload.cell)
})

export default selection
