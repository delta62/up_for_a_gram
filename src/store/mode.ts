import { createReducer } from '@reduxjs/toolkit'
import { createGame } from './actions'

export type ModeState = 'across' | 'down'

const DEFAULT_STATE: ModeState = 'across'

let reducer = createReducer(DEFAULT_STATE, builder => {
  builder.addCase(createGame, () => DEFAULT_STATE)
})

export default reducer
