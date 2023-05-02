import { createReducer } from '@reduxjs/toolkit'
import { createGame } from './actions'

export type Clue = string | null

export interface CluesState {
  down: Clue[]
  across: Clue[]
}

const DEFAULT_STATE: CluesState = {
  across: [],
  down: [],
}

let clues = createReducer(DEFAULT_STATE, builder => {
  builder.addCase(createGame, (_, action) => {
    return action.payload.game.clues
  })
})

export default clues
