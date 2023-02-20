import { combineReducers, configureStore, Middleware } from '@reduxjs/toolkit'
import { Client } from '../websocket'
import game from './game'
import players from './players'
import grid from './grid'
import selection from './selection'
import mode from './mode'
import clues from './clues'
import log from '../log'

let logMiddleware: Middleware = _store => next => action => {
  log.debug(action)
  return next(action)
}

let rootReducer = combineReducers({
  clues,
  game,
  grid,
  mode,
  players,
  selection,
})

let createStore = () => {
  let store = configureStore({
    reducer: rootReducer,
    middleware: [logMiddleware] as const,
  })

  return store
}

type Store = ReturnType<typeof createStore>
export type State = ReturnType<typeof rootReducer>
export type Dispatch = Store['dispatch']

export {
  check,
  createGame,
  moveCursor,
  reveal,
  switchMode,
  updateCell,
  updatePlayerName,
  updatePlayerColor,
  updatePlayerCursor,
} from './actions'

export default createStore
