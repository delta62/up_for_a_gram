import { CellRef, InputMode } from '../dfac-api'
import {
  moveLeft,
  moveRight,
  moveUp,
  moveDown,
  nextCell,
  moveToNext,
  moveToPrev,
  prevCell,
} from '../selection'
import { Key } from '../input'
import {
  moveCursor,
  setMode,
  switchMode,
  State,
  getSolution,
  getCellScope,
  getPuzzleScope,
  getWordScope,
  setCell,
  startReveal,
  startCheck,
} from '../store'
import grid from '../store/grid'

/**
 * Map key press events to store actions
 */
export let keyPressToAction = (state: State, key: Key) => {
  let cell: CellRef
  let value: string
  let nextMode: InputMode
  let nextSelection: CellRef
  let scope: CellRef[]
  let solution: string[][]
  let correct: boolean

  switch (key) {
    case 'up':
      cell = moveUp(state.grid.cells, state.selection)
      return [moveCursor({ cell })]
    case 'down':
      cell = moveDown(state.grid.cells, state.selection)
      return [moveCursor({ cell })]
    case 'left':
      cell = moveLeft(state.grid.cells, state.selection)
      return [moveCursor({ cell })]
    case 'right':
      cell = moveRight(state.grid.cells, state.selection)
      return [moveCursor({ cell })]
    case 'rotate':
      return [switchMode()]
    case 'delete':
      cell = state.selection
      value = ''
      return [setCell({ cell, value: '', correct: false })]
    case 'backspace':
      cell = state.selection
      value = ''
      correct = false
      let ret: (
        | ReturnType<typeof setMode>
        | ReturnType<typeof moveCursor>
        | ReturnType<typeof setCell>
      )[] = [setCell({ cell, value, correct })]

      let lastValue = state.grid.cells[cell.r][cell.c].value
      if (lastValue) {
        ;[nextMode, nextSelection] = prevCell(
          state.grid.cells,
          state.mode,
          state.clues,
          cell
        )
        ret.push(moveCursor({ cell: nextSelection }))
        ret.push(setMode(nextMode))
      }
      return ret
    case 'next':
      nextSelection = moveToNext(
        state.grid.cells,
        state.mode,
        state.clues,
        state.selection
      )
      return [moveCursor({ cell: nextSelection })]
    case 'prev':
      nextSelection = moveToPrev(
        state.grid.cells,
        state.mode,
        state.clues,
        state.selection
      )
      return [moveCursor({ cell: nextSelection })]
    case 'check_puzzle':
      scope = getPuzzleScope(state)
      return [startCheck({ scope })]
    case 'check_word':
      scope = getWordScope(state)
      return [startCheck({ scope })]
    case 'check_cell':
      scope = getCellScope(state)
      return [startCheck({ scope })]
    case 'reveal_puzzle':
      solution = getSolution(state)
      scope = getPuzzleScope(state)
      return [startReveal({ scope, solution })]
    case 'reveal_word':
      solution = getSolution(state)
      scope = getWordScope(state)
      return [startReveal({ scope, solution })]
    case 'reveal_cell':
      solution = getSolution(state)
      scope = getCellScope(state)
      return [startReveal({ scope, solution })]
    default:
      cell = state.selection
      value = key.key.toUpperCase()
      ;[nextMode, nextSelection] = nextCell(
        state.grid.cells,
        state.mode,
        state.clues,
        cell
      )
      correct = state.solution[cell.r][cell.c] === value
      return [
        setCell({ cell, value, correct }),
        moveCursor({ cell: nextSelection }),
        setMode(nextMode),
      ]
  }
}

export type KeyPressAction = ReturnType<typeof keyPressToAction>
