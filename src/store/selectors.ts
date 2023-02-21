import { State } from './index'
import { createSelector } from '@reduxjs/toolkit'
import { zip } from '../util'

let getSolution = (state: State) => state.solution
let getCells = (state: State) => state.grid.cells

type Solution = ReturnType<typeof getSolution>
type Cells = ReturnType<typeof getCells>

let isSolved = (solution: Solution, cells: Cells) =>
  zip(solution.flat(), cells.flat()).every(
    ([expected, actual]) => actual.black || actual.value === expected
  )

export let getSolved = createSelector(getSolution, getCells, isSolved)
