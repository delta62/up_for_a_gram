import { createReducer } from '@reduxjs/toolkit'
import { createGame, switchMode } from './actions'

export type ModeState = 'across' | 'down'

const DEFAULT_STATE = 'across'

let reducer = createReducer<ModeState>(DEFAULT_STATE, builder => {
  builder
    .addCase(createGame, () => DEFAULT_STATE)
    .addCase(switchMode, state => (state === 'across' ? 'down' : 'across'))
})

export default reducer
