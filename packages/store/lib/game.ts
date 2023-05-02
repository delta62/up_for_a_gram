import { createGame } from './actions'
import { GameInfo } from 'api'
import { createReducer } from '@reduxjs/toolkit'

export type GameState = GameInfo

const DEFAULT_STATE: GameState = {
  author: '',
  title: '',
}

let game = createReducer(DEFAULT_STATE, builder => {
  builder.addCase(createGame, (_, action) => action.payload.game.info)
})

export default game
