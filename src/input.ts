import { stdin } from 'process'
import { CellRef } from './dfac-api'
import { showCursor } from './term'
import { moveLeft, moveRight, moveUp, moveDown } from './selection'
import { moveCursor, State } from './store'
import log from './log'

export interface InputKey {
  key: string
}

export type Key =
  | 'delete'
  | 'down'
  | 'left'
  | 'next'
  | 'prev'
  | 'right'
  | 'rotate'
  | 'up'
  | InputKey

export type KeyPressHandler = (key: Key) => void

const UP_ARROW = '\u001b\u005b\u0041'
const DOWN_ARROW = '\u001b\u005b\u0042'
const RIGHT_ARROW = '\u001b\u005b\u0043'
const LEFT_ARROW = '\u001b\u005b\u0044'
const BACKSPACE_KEY = '\u007f'
const DELETE_KEY = '\u001b\u005b\u0033\u007e'
const TAB_KEY = '\u0009'
const SPACE_KEY = '\u0020'
const SHIFT_TAB_KEY = '\u001b\u005b\u005a'
const CTRL_C_KEY = '\u0003'

export let onKeyPress = async (cb: KeyPressHandler): Promise<void> => {
  if (stdin.isTTY) {
    stdin.setRawMode(true)
    stdin.resume()
    stdin.setEncoding('utf-8')
  }

  stdin.on('data', (key: string) => {
    if (key === CTRL_C_KEY) {
      showCursor()
      process.exit()
    }

    switch (key) {
      case DELETE_KEY:
      case BACKSPACE_KEY:
        cb('delete')
        break
      case UP_ARROW:
        cb('up')
        break
      case DOWN_ARROW:
        cb('down')
        break
      case LEFT_ARROW:
        cb('left')
        break
      case RIGHT_ARROW:
        cb('right')
        break
      case SPACE_KEY:
        cb('rotate')
        break
      case TAB_KEY:
        cb('next')
        break
      case SHIFT_TAB_KEY:
        cb('prev')
        break
      default:
        if (/[a-z0-9]$/i.test(key)) {
          cb({ key })
        } else {
          let bytes = Buffer.from(key)
          log.warn('Unknown key', { key, bytes })
        }
        break
    }
  })
}

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
    default:
      throw new Error('not implemented')
  }
}
