import { createStore, combineReducers } from 'redux'
import game from './game'
import players from './players'
import grid from './grid'
import selection from './selection'
import mode from './mode'

let rootReducer = combineReducers({
  game,
  grid,
  mode,
  players,
  selection,
})

export { gameAction, keyInput } from './actions'

export default () => createStore(rootReducer)
