import { CellRef, InputMode } from '../dfac-api'
import {
  moveLeft,
  moveRight,
  moveUp,
  moveDown,
  nextCell,
  moveToNext,
  moveToPrev,
} from '../selection'
import { Key } from '../input'
import { moveCursor, setMode, switchMode, State } from '../store'
import { setCell } from '../store/actions'

/**
 * Map key press events to store actions
 */
export let keyPressToAction = (state: State, key: Key) => {
  let cell: CellRef
  let value: string
  let nextMode: InputMode
  let nextSelection: CellRef

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
    default:
      cell = state.selection
      value = key.key.toUpperCase()
      ;[nextMode, nextSelection] = nextCell(
        state.grid.cells,
        state.mode,
        state.clues,
        cell
      )
      let correct = state.solution[cell.r][cell.c] === value
      return [
        setCell({ cell, value, correct }),
        moveCursor({ cell: nextSelection }),
        setMode(nextMode),
      ]
  }
}

export type KeyPressAction = ReturnType<typeof keyPressToAction>
