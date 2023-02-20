import { createGame } from './actions'
import { CellRef } from '../dfac-api'
import { createReducer } from '@reduxjs/toolkit'

export type SelectionState = CellRef

const DEFAULT_STATE: CellRef = { r: 0, c: 0 }

// let reduceKeyInput = (state: SelectionState, key: Key): SelectionState => {
//   switch (key) {
//     case 'up':
//       return findSelectionUp(grid, state)
//     case 'down':
//       return findSelectionDown(game.grid, game.selection)
//     case 'left':
//       return findSelectionLeft(game.grid, game.selection)
//     case 'right':
//       return findSelectionRight(game.grid, game.selection)
//     case 'delete':
//       emitCellUpdate(gameId, socket, game.selection, '')
//       return game
//     case 'rotate':
//       let mode: InputMode = game.mode === 'across' ? 'down' : 'across'
//     case 'next':
//       return findNextSelection(game)
//     case 'prev':
//       return findPrevSelection(game)
//     default:
//       emitCellUpdate(gameId, socket, game.selection, key.key)
//       return game
//   }
// }

let selection = createReducer(DEFAULT_STATE, builder => {
  builder.addCase(createGame, () => DEFAULT_STATE)
})

export default selection
