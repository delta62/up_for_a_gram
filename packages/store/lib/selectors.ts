import { createSelector } from '@reduxjs/toolkit'
import { CellRef } from 'api'
import { State } from './index'

export type Selector<T> = (state: State) => T

export let zip = <T, U>(xs: T[], ys: U[]): [T, U][] => {
  let min = Math.min(xs.length, ys.length)
  let ret = new Array(min)

  for (let i = 0; i < min; i++) {
    ret.push([xs[i], ys[i]])
  }

  return ret
}

export let getSolution = (state: State) => state.solution
let getCells = (state: State) => state.grid.cells
let getSelection = (state: State) => state.selection
let getMode = (state: State) => state.mode

type Solution = ReturnType<typeof getSolution>
type Cells = ReturnType<typeof getCells>

let isSolved = (solution: Solution, cells: Cells) =>
  zip(solution.flat(), cells.flat()).every(
    ([expected, actual]) => actual.black || actual.value === expected
  )

export let getSolved: Selector<boolean> = createSelector(
  getSolution,
  getCells,
  isSolved
)

export let getClueSolved = (state: State, { r, c }: CellRef): boolean => {
  let { mode, grid } = state
  let cell = grid.cells[r]![c]!
  let clueNum = cell.parents?.[mode]!

  return grid.cells
    .flat()
    .filter(cell => cell.parents?.[mode] === clueNum)
    .every(cell => !!cell.value)
}

export let getCellScope: Selector<[CellRef]> = createSelector(
  getSelection,
  cell => [cell]
)

export let getWordScope: Selector<CellRef[]> = createSelector(
  getCells,
  getSelection,
  getMode,
  (cells, cell, mode) => {
    let clueNum = cells[cell.r]![cell.c]!.parents?.[mode]!

    return cells
      .flatMap((row, r) => row.map((cell, c) => ({ ...cell, r, c })))
      .filter(cell => cell.parents?.[mode] === clueNum)
      .map(({ r, c }) => ({ r, c }))
  }
)

export let getPuzzleScope: Selector<CellRef[]> = createSelector(
  getCells,
  cells => {
    return cells.flatMap((row, r) => row.map((_, c) => ({ r, c })))
  }
)

export enum RenderCellFlags {
  None = 0,
  Black = 1,
}

export interface RenderCell {
  flags: RenderCellFlags
  value?: string
  num?: number
}

export type GridState = RenderCell[][]

export let getGridState: Selector<GridState> = createSelector(
  getCells,
  rows => {
    return rows.map(row => {
      return row.map((cell): RenderCell => {
        let { value } = cell
        let flags = 0
        let num = cell.number || undefined

        if (cell.black) {
          flags |= RenderCellFlags.Black
        }

        return { flags, value, num }
      })
    })
  }
)
