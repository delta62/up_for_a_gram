import { GameEvent, GridRow } from '../dfac-api'
import Action from './actions'

type GridState = GridRow[]

const DEFAULT_STATE: GridState = []

let reduceGameEvent = (state: GridState, event: GameEvent): GridState => {
  switch (event.type) {
    case 'updateCell':
      let [...grid] = state
      let { r, c } = event.params.cell
      let { value } = event.params
      let newCell = { ...grid[r][c], value }
      grid[r][c] = newCell

      return grid
    case 'create':
      return event.params.game.grid
    default:
      return state
  }
}

let reducer = (state = DEFAULT_STATE, action: Action): GridState => {
  if (action.type === 'GAME_ACTION') {
    return reduceGameEvent(state, action.event)
  }

  return state
}

export default reducer
