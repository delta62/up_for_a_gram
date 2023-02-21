import { State } from './index'
import { createSelector } from '@reduxjs/toolkit'
import { zip } from '../util'
import { CellRef } from '../dfac-api'

let getSolution = (state: State) => state.solution
let getCells = (state: State) => state.grid.cells

type Solution = ReturnType<typeof getSolution>
type Cells = ReturnType<typeof getCells>

let isSolved = (solution: Solution, cells: Cells) =>
  zip(solution.flat(), cells.flat()).every(
    ([expected, actual]) => actual.black || actual.value === expected
  )

export let getSolved = createSelector(getSolution, getCells, isSolved)

export let getClueSolved = (state: State, { r, c }: CellRef): boolean => {
  let { mode, grid } = state
  let cell = grid.cells[r][c]
  let clueNum = cell.parents?.[mode]!

  return grid.cells
    .flat()
    .filter(cell => cell.parents?.[mode] === clueNum)
    .every(cell => !!cell.value)
}
