import { stdin } from 'process'
import { showCursor } from './term'
import log from './log'

export interface InputKey {
  key: string
}

export type Key =
  | 'backspace'
  | 'check_puzzle'
  | 'check_word'
  | 'check_cell'
  | 'delete'
  | 'down'
  | 'left'
  | 'next'
  | 'prev'
  | 'reveal_puzzle'
  | 'reveal_word'
  | 'reveal_cell'
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
const ALT_P_KEY = '\u001b\u0070'
const ALT_W_KEY = '\u001b\u0077'
const ALT_C_KEY = '\u001b\u0063'
const ALT_SHIFT_P_KEY = '\u001b\u0050'
const ALT_SHIFT_W_KEY = '\u001b\u0057'
const ALT_SHIFT_C_KEY = '\u001b\u0043'

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
        cb('delete')
        break
      case BACKSPACE_KEY:
        cb('backspace')
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
      case ALT_P_KEY:
        cb('check_puzzle')
        break
      case ALT_W_KEY:
        cb('check_word')
        break
      case ALT_C_KEY:
        cb('check_cell')
        break
      case ALT_SHIFT_P_KEY:
        cb('reveal_puzzle')
        break
      case ALT_SHIFT_W_KEY:
        cb('reveal_word')
        break
      case ALT_SHIFT_C_KEY:
        cb('reveal_cell')
        break
      default:
        if (/^[a-z0-9]$/i.test(key)) {
          cb({ key })
        } else {
          let bytes = Buffer.from(key)
          log.warn('Unknown key', { key, bytes })
        }
        break
    }
  })
}
