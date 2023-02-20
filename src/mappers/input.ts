import { CellRef } from '../dfac-api'
import { moveLeft, moveRight, moveUp, moveDown } from '../selection'
import { Key } from '../input'
import { moveCursor, switchMode, State } from '../store'

export let keyPressToAction = (state: State, key: Key) => {
  let cell: CellRef

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
    default:
      throw new Error('not implemented')
  }
}
