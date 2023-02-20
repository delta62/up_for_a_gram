import Action from './actions'
import { GameInfo, GameEvent } from '../dfac-api'

type GameState = GameInfo

const DEFAULT_STATE: GameState = {
  author: '',
  title: '',
}

let reduceGameEvent = (state: GameState, event: GameEvent): GameState => {
  switch (event.type) {
    case 'create':
      return event.params.game.info
    default:
      return state
  }
}

let game = (state: GameState = DEFAULT_STATE, action: Action): GameState => {
  if (action.type === 'GAME_ACTION') {
    return reduceGameEvent(state, action.event)
  }

  return state
}

export default game
