import Action from './actions'

export type Mode = 'across' | 'down'

const DEFAULT_STATE: Mode = 'across'

let reducer = (state = DEFAULT_STATE, action: Action): Mode => {
  switch (action.type) {
    case 'GAME_ACTION':
      switch (action.event.type) {
        case 'create':
          return DEFAULT_STATE
        default:
          return state
      }
    default:
      return state
  }
}

export default reducer
