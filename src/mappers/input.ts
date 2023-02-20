import { CellRef } from '../dfac-api'
import { moveLeft, moveRight, moveUp, moveDown } from '../selection'
import { Key } from '../input'
import { moveCursor, switchMode, State } from '../store'
import { setCell } from '../store/actions'

/**
 * Map key press events to store actions
 */
export let keyPressToAction = (state: State, key: Key) => {
  let cell: CellRef
  let value: string

  switch (key) {
    case 'up':
      cell = moveUp(state.grid, state.selection)
      return moveCursor({ cell })
    case 'down':
      cell = moveDown(state.grid, state.selection)
      return moveCursor({ cell })
    case 'left':
      cell = moveLeft(state.grid, state.selection)
      return moveCursor({ cell })
    case 'right':
      cell = moveRight(state.grid, state.selection)
      return moveCursor({ cell })
    case 'rotate':
      return switchMode()
    case 'delete':
      cell = state.selection
      value = ''
      return setCell({ cell, value: '' })
    case 'prev':
    case 'next':
      throw new Error('not implemented')
    default:
      cell = state.selection
      value = key.key.toUpperCase()
      return setCell({ cell, value })
  }
}

export type KeyPressAction = ReturnType<typeof keyPressToAction>
