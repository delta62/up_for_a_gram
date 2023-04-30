import { SolutionRow } from '../dfac-api'
import { createReducer } from '@reduxjs/toolkit'
import { createGame } from './actions'

type SolutionState = SolutionRow[]

const DEFAULT_VALUE: SolutionState = []

let solution = createReducer<SolutionState>(DEFAULT_VALUE, builder =>
  builder.addCase(createGame, (_, action) => action.payload.game.solution)
)

export default solution
