import { createReducer } from '@reduxjs/toolkit'
import { GridCell } from '../dfac-api'
import { check, createGame, reveal, setCell, updateCell } from './actions'

type CellState =
  | 'verified' // Correct and has been checked
  | 'revealed' // Revealed
  | 'correct' // Correct but has not been checked
  | 'incorrect' // Incorrect and has been checked
  | 'default' // Incorrect and has not been checked

export interface Cell extends GridCell {
  state: CellState
}

export interface GridState {
  width: number
  height: number
  cells: Cell[][]
}

const DEFAULT_STATE: GridState = { width: 0, height: 0, cells: [] }

let grid = createReducer<GridState>(DEFAULT_STATE, builder => {
  builder
    .addCase(createGame, (_, action) => {
      let grid = action.payload.game.grid
      let width = grid[0].length
      let height = grid.length
      let cells = grid.map(row =>
        row.map(cell => ({ ...cell, state: 'default' as const }))
      )

      return { width, height, cells }
    })
    .addCase(updateCell, (state, action) => {
      let { r, c } = action.payload.cell
      let { value } = action.payload
      let cell = state.cells[r][c]

      if (['verified', 'revealed'].includes(cell.state)) {
        return
      }

      cell.state = action.payload.correct ? 'correct' : 'default'
      cell.value = value
    })
    .addCase(check, (state, action) => {
      for (let { r, c } of action.payload.scope) {
        let cell = state.cells[r][c]
        switch (cell.state) {
          case 'default':
            cell.state = 'incorrect'
            break
          case 'correct':
            cell.state = 'verified'
            break
        }
      }
    })
    .addCase(reveal, (state, action) => {
      for (let { r, c } of action.payload.scope) {
        state.cells[r][c].state = 'revealed'
      }
    })
    .addCase(setCell, (state, action) => {
      let { r, c } = action.payload.cell
      let { value } = action.payload
      let cell = state.cells[r][c]

      if (['verified', 'revealed'].includes(cell.state)) {
        return
      }

      cell.state = action.payload.correct ? 'correct' : 'default'
      cell.value = value
    })
})

export default grid
