import Action from './actions'
import { CellRef, GameEvent } from '../dfac-api'
import { Key } from '../input'

const DEFAULT_STATE: CellRef = { r: 0, c: 0 }

type SelectionState = CellRef

let reduceKeyInput = (state: SelectionState, key: Key): SelectionState => {
  switch (key) {
    case 'up':
      return findSelectionUp(grid, state)
    case 'down':
      return findSelectionDown(game.grid, game.selection)
    case 'left':
      return findSelectionLeft(game.grid, game.selection)
    case 'right':
      return findSelectionRight(game.grid, game.selection)
    case 'delete':
      emitCellUpdate(gameId, socket, game.selection, '')
      return game
    case 'rotate':
      let mode: InputMode = game.mode === 'across' ? 'down' : 'across'
    case 'next':
      return findNextSelection(game)
    case 'prev':
      return findPrevSelection(game)
    default:
      emitCellUpdate(gameId, socket, game.selection, key.key)
      return game
  }
}

let reduceGameAction = (
  state: SelectionState,
  event: GameEvent
): SelectionState => {
  switch (event.type) {
    case 'create':
      return DEFAULT_STATE
    default:
      return state
  }
}

let reducer = (state = DEFAULT_STATE, action: Action): SelectionState => {
  switch (action.type) {
    case 'GAME_ACTION':
      return reduceGameAction(state, action.event)
    case 'KEY_INPUT':
      return reduceKeyInput(state, action.key)
    default:
      return state
  }
}

export default reducer
