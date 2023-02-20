import { configureStore } from '@reduxjs/toolkit'
import game from './game'
import players from './players'
import grid from './grid'
import selection from './selection'
import mode from './mode'

let store = configureStore({
  reducer: {
    game,
    grid,
    mode,
    players,
    selection,
  },
})

export type State = ReturnType<typeof store.getState>
export type Dispatch = typeof store.dispatch

export {
  createGame,
  updateCell,
  updatePlayerName,
  updatePlayerColor,
  updatePlayerCursor,
} from './actions'

export default store
